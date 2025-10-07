import React, { JSX, PropsWithChildren } from 'react'
import ReactDOM from 'react-dom/client'
import type { VendureDataProviderProps } from '@haus-storefront-react/core'
import { DataProvider } from '@haus-storefront-react/core'
import {
  LocalizationProvider,
  LocalizationProviderProps,
} from './localization/LocalizationProvider'
import { GlobalEventProvider } from './event-listeners/event-provider'

export type ConditionalTemplateProps = {
  conditions: {
    [key: string]: {
      inputType: 'productVariant' | 'product' | 'activeOrder' | 'activeCustomer' // Add more input types as needed (e.g. 'product', 'cart', etc.)
      fn: (input: never) => boolean
    }
  }
}

type GenericProps = PropsWithChildren<{
  [key: string]: any
}>

type DataProviderProps = Omit<VendureDataProviderProps, 'children'> & {
  provider: 'vendure'
}

interface ElementorWidgetRendererProps {
  dataProviderProps: DataProviderProps
  localizationProviderProps: LocalizationProviderProps
}

export class ElementorWidgetRenderer {
  dataProviderProps: ElementorWidgetRendererProps['dataProviderProps']
  localizationProviderProps: ElementorWidgetRendererProps['localizationProviderProps']

  constructor(
    dataProviderProps: ElementorWidgetRendererProps['dataProviderProps'],
    localizationProviderProps: ElementorWidgetRendererProps['localizationProviderProps'],
  ) {
    this.dataProviderProps = dataProviderProps
    this.localizationProviderProps = localizationProviderProps
  }

  convertPropValues(key: string, value: any): unknown {
    if (value === null || value === undefined) return value
    if (typeof value !== 'string') return value

    const trimmed = value.trim()
    if (trimmed === '') return ''

    // Inline type annotation support: "value|type"
    // Recognized types: string, number, int, float, boolean/bool, json, object, array, csv, null, undefined
    const lastPipeIndex = trimmed.lastIndexOf('|')
    if (lastPipeIndex > -1) {
      const annotatedValue = trimmed.slice(0, lastPipeIndex).trim()
      const annotatedType = trimmed
        .slice(lastPipeIndex + 1)
        .trim()
        .toLowerCase()
      const recognizedTypes = new Set([
        'string',
        'number',
        'int',
        'float',
        'boolean',
        'bool',
        'json',
        'object',
        'array',
        'csv',
        'null',
        'undefined',
      ])
      if (recognizedTypes.has(annotatedType)) {
        switch (annotatedType) {
          case 'string':
            return annotatedValue
          case 'number':
          case 'float': {
            const n = Number(annotatedValue)
            return Number.isNaN(n) ? annotatedValue : n
          }
          case 'int': {
            const n = parseInt(annotatedValue, 10)
            return Number.isNaN(n) ? annotatedValue : n
          }
          case 'boolean':
          case 'bool': {
            const lowerAnnotated = annotatedValue.toLowerCase()
            if (['true', '1', 'yes', 'on'].includes(lowerAnnotated)) return true
            if (['false', '0', 'no', 'off'].includes(lowerAnnotated)) return false
            return Boolean(annotatedValue)
          }
          case 'json':
          case 'object':
          case 'array':
            try {
              return JSON.parse(annotatedValue)
            } catch {
              return annotatedValue
            }
          case 'csv':
            return annotatedValue
              .split(',')
              .map((part) => part.trim())
              .filter((part) => part.length > 0)
              .map((part) => this.convertPropValues(key, part))
          case 'null':
            return null
          case 'undefined':
            return undefined
          default:
            return annotatedValue
        }
      }
    }

    // Try JSON (objects or arrays)
    if (
      (trimmed.startsWith('{') && trimmed.endsWith('}')) ||
      (trimmed.startsWith('[') && trimmed.endsWith(']'))
    ) {
      try {
        return JSON.parse(trimmed)
      } catch {
        // fallthrough to other heuristics
      }
    }

    const lower = trimmed.toLowerCase()
    // Explicit booleans
    if (lower === 'true') return true
    if (lower === 'false') return false

    // Heuristic: only treat 1/0/yes/no/on/off as booleans for likely-boolean keys
    const likelyBoolean = /^(is|has|should)([A-Z]|$)/.test(key)
    if (likelyBoolean) {
      if (['1', 'yes', 'on'].includes(lower)) return true
      if (['0', 'no', 'off'].includes(lower)) return false
    }

    // null / undefined
    if (lower === 'null') return null
    if (lower === 'undefined') return undefined

    // Numbers (int/float)
    if (/^[+-]?\d+(\.\d+)?$/.test(trimmed)) {
      const num = Number(trimmed)
      if (!Number.isNaN(num)) return num
    }

    // Comma-separated arrays (recursively convert items)
    if (trimmed.includes(',')) {
      return trimmed
        .split(',')
        .map((part) => part.trim())
        .filter((part) => part.length > 0)
        .map((part) => this.convertPropValues(key, part))
    }

    return value
  }

  propsFromDataAttributes(dataAttributes: NamedNodeMap) {
    const props: GenericProps = {}

    Array.from(dataAttributes).forEach((attr) => {
      if (attr.name.startsWith('data-') && attr.name !== 'data-widget-type') {
        const key = attr.name.slice(5).replace(/-([a-z])/g, (_, c) => c.toUpperCase())
        props[key] = this.convertPropValues(key, attr.value)
      }
    })

    console.log('props', props)
    if (props.product) {
      props.productId = props.product
      delete props.product
    }
    if (props.variant) {
      props.variantId = props.variant
      delete props.variant
    }

    return props
  }

  render(
    widget: JSX.Element,
    widgetType: string,
    getPropsFn: (dataAttributes: NamedNodeMap) => GenericProps,
  ) {
    let elements = document.querySelectorAll(`[data-widget-type="${widgetType}"]`)
    if (elements.length === 0 && !widgetType.includes('-widget')) {
      elements = document.querySelectorAll(`[data-widget-type="${widgetType}-widget"]`)
    }
    if (!elements) {
      throw new Error(`No elementor widget found: ${widgetType}`)
    }
    elements.forEach((element) => {
      const shadowRoot = element.attachShadow({ mode: 'open' })
      if (!shadowRoot) {
        throw new Error('No shadow root found')
      }

      // Create style element and apply existing styles
      const styleEl = document.createElement('style')
      styleEl.setAttribute('id', 'ecom-components-styles')

      // Extract additional `.ec-` styles from loaded stylesheets
      const ecStyleEl = document.createElement('style')
      ecStyleEl.setAttribute('id', 'ecom-components-ec-styles')

      // Append styles to shadow root
      shadowRoot?.appendChild(styleEl)
      shadowRoot?.appendChild(ecStyleEl)

      // Fix for activeElement not being correct in shadow DOM when tabbing
      const originalActiveElement = Object.getOwnPropertyDescriptor(
        Document.prototype,
        'activeElement',
      )?.get

      if (originalActiveElement) {
        Object.defineProperty(Document.prototype, 'activeElement', {
          get() {
            const activeElement = originalActiveElement.call(this)
            return activeElement?.shadowRoot?.activeElement ?? activeElement
          },
        })
      }

      const props: GenericProps =
        getPropsFn?.(element.attributes) || this.propsFromDataAttributes(element.attributes)
      const widgetWithProps = React.cloneElement(widget, props)

      return ReactDOM.createRoot(shadowRoot).render(
        <React.StrictMode>
          <DataProvider {...this.dataProviderProps}>
            <LocalizationProvider
              // i18nOptions={{ debug: false }}
              {...this.localizationProviderProps}
            >
              <GlobalEventProvider>{widgetWithProps}</GlobalEventProvider>
            </LocalizationProvider>
          </DataProvider>
        </React.StrictMode>,
      )
    })
  }
}
