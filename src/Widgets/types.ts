/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import React, { ReactNode } from 'react'
import { InternalAxiosRequestConfig } from 'axios'
import { VendureSDK } from './lib/providers/vendure/VendureSDK'
import { DummySDK } from './lib/providers/dummy/DummySDK'
import { LocalizationProviderProps } from './lib/providers/localization/LocalizationProvider'
import { i18n } from 'i18next'
import {
  BuilderQueryUpdates,
  Maybe,
  Product,
  ProductVariant,
  SearchResult,
  IVendurePluginConfig,
  PluginFeatureMappings,
  PluginFeatures,
} from '@haus-storefront-react/shared-types'

export interface PersistOptions {
  enabled: boolean
  storage?: Storage
  maxAge?: number
}

type UserFeatureMappings = {
  pricesIncludeTax: boolean
  showDecimals: boolean
  hidePrice: (props: {
    product?: Product | SearchResult // TODO: price should not exist on Product by default
    variant?: ProductVariant
    identifier?: string
  }) => boolean
  customPriceCurrency: string
  hideAddToCart: (props: {
    product?: Product | SearchResult // TODO: price should not exist on Product by default
    variant?: ProductVariant
    identifier?: string
  }) => boolean
}

type UserFeatureNames = ObtainKeys<UserFeatureMappings, unknown>
type PluginFeatureNames = ObtainKeys<PluginFeatureMappings, unknown>

type ObtainKeys<Obj, Type> = {
  [Prop in keyof Obj]: Obj[Prop] extends Type ? Prop : never
}[keyof Obj]
export type ExtractProps<T> = T extends (props: infer P) => unknown ? P : never

export type FeatureFunctionMappings = ExtractMethods<PluginFeatureMappings & UserFeatureMappings>

export type FeatureFunctionType<K extends keyof FeatureFunctionMappings> =
  FeatureFunctionMappings[K]

type UserFeatureTypes = {
  [K in UserFeatureNames]: K extends keyof FeatureFunctionMappings
    ? FeatureFunctionType<K> | ExtractReturnType<K>
    : UserFeatureMappings[K]
}

type PluginFeatureTypes = {
  [K in PluginFeatureNames]: K extends keyof FeatureFunctionMappings
    ? FeatureFunctionType<K> | ExtractReturnType<K>
    : PluginFeatureMappings[K]
}

export type FeatureNames = UserFeatureNames | PluginFeatureNames
export type Features = Partial<UserFeatureTypes & PluginFeatureTypes>
export type UserFeatures = Partial<UserFeatureTypes>

type NonFunctionKeyNames<T> = Exclude<
  {
    [key in keyof T]: T[key] extends Function ? never : key
  }[keyof T],
  undefined
>

export type RemoveFunctions<T> = Pick<T, NonFunctionKeyNames<T>>

// Utility type to remove function types from a union
type RemoveFunctionsFromUnion<T> = T extends (...args: never) => unknown ? never : T

// Utility type to apply the function removal to all keys
export type RemoveFunctionsFromKeys<T> = {
  [K in keyof T]: RemoveFunctionsFromUnion<T[K]>
}

// Helper type to extract the return type of the function or fallback to the base type
type ExtractReturnType<K extends keyof FeatureFunctionMappings> =
  ReturnType<FeatureFunctionMappings[K]> extends boolean
    ? boolean
    : ReturnType<FeatureFunctionMappings[K]>

type PickMatching<T, V> = { [K in keyof T as T[K] extends V ? K : never]: T[K] }
type ExtractMethods<T> = PickMatching<T, Function>

export interface VendureOptions {
  apiUrl: string
  vendureToken?: string
  persistOptions?: PersistOptions
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  pluginConfigs?: IVendurePluginConfig<PluginFeatures, any, any, any>[]
  enabledFeatures?: Features
  localizationProviderProps?: LocalizationProviderProps
}

export type DummyOptions = object

export interface BaseDataProviderProps {
  updates?: Maybe<BuilderQueryUpdates>
  options?: Maybe<Record<string, unknown>> & { enabledFeatures?: Maybe<Features> } & {
    localizationProviderProps?: Maybe<LocalizationProviderProps>
    pluginConfigs?: VendureOptions['pluginConfigs']
    requestInterceptorStrategy?: (
      config: InternalAxiosRequestConfig,
      defaultHandler: (config: InternalAxiosRequestConfig) => Promise<void> | void,
    ) => Promise<void> | void
  }
  platform?: 'web' | 'native'
  sdkInstance?: VendureSDK | DummySDK
  customProviders?: React.ComponentType<{ children: ReactNode }>
  children: React.ReactNode
}

export interface VendureDataProviderProps extends BaseDataProviderProps {
  provider: 'vendure'
  options: BaseDataProviderProps['options'] & VendureOptions
}

export interface DummyDataProviderProps extends BaseDataProviderProps {
  provider: 'dummy'
  options: BaseDataProviderProps['options'] & DummyOptions // Optional, define if needed
}

export type DataProviderProps = VendureDataProviderProps | DummyDataProviderProps

export type i18nType = i18n

export type FiltersWrapper =
  | {
      as: 'dropdown'
    }
  | {
      as: 'accordion'
      type?: 'single' | 'multiple'
      collapsible?: boolean
    }
