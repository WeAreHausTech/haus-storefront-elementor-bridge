import { FacetValue, Price } from "@haus-storefront-react/shared-types"

declare global {
  interface Window {
      dataLayer: any
      gtmBrandFacetCode: string
      gtmCategoryFacetCode: string
  }
}

export const clearEcommerceData = () => {
  if (window.dataLayer) {
    window.dataLayer.push({ ecommerce: null })
  } else {
    console.log('dataLayer is not defined')
  }
}

export const pushToDataLayer = (event: string, data: Record<string, unknown>) => {
  if (window.dataLayer) {
    window.dataLayer.push({ event, data })
  } else {
    console.log('dataLayer is not defined')
  }
}

export const getPrice = (
  price: Price | number | undefined,
  priceWithTax: Price | number | undefined,
  pricesIncludeTax: boolean | undefined,
): number => {
  return pricesIncludeTax ? Number(priceWithTax) / 100 : Number(price) / 100
}

export const itemFacets = (facetValues: FacetValue[]) => {
  const categories: { [key: string]: string } = {}
  let itemBrand: string = ''
  let categoryCount = 0

  const brandFacetCode = window.gtmBrandFacetCode || 'brand'
  const categoryFacetCode = window.gtmCategoryFacetCode || 'category'

  facetValues.forEach((facetValue) => {
    if (facetValue.facet.code === categoryFacetCode) {
      categoryCount++
      const categoryKey = categoryCount === 1 ? 'item_category' : `item_category${categoryCount}`
      categories[categoryKey] = facetValue.name
    } else if (facetValue.facet.code === brandFacetCode) {
      itemBrand = facetValue.name
    }
  })

  return {
    item_brand: itemBrand,
    ...categories,
  }
}