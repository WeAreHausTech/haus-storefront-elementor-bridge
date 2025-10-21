import { EnabledFilter } from '@haus-storefront-react/shared-types'

export type ProductListAttributes = {
  productListIdentifier?: string
  facetValueIds?: string[]
  collectionId?: string
  enablePagination: boolean
  take: number
  buttonVariant?: string
}

export type FiltersAttributes = {
  productListIdentifier?: string
  maxSkeletonLoaders?: number
  enabledFilters: EnabledFilter[]
}

export type AccountMenuItem = {
  href: string
  label: string
}

export type AccountDropdownAttributes = {
  menuItems: AccountMenuItem[]
}

export type EventTriggerProps = {
  analyticsEvent?: string
  productId?: string
}
