import { useProduct } from '@haus-storefront-react/hooks'
import { useEffect } from 'react'
import { clearEcommerceData, getPrice, itemFacets, pushToDataLayer } from '../event-listeners/gtm'
import { useSdk } from '@haus-storefront-react/core'

interface ViewItemEventProps {
  productId: string
}

export const ViewItemEvent = ({ productId }: ViewItemEventProps) => {
  const stringProductId = String(productId)

  if (!stringProductId || stringProductId === 'undefined' || stringProductId === 'null') {
    console.warn('ViewItemEvent: Invalid productId', productId)
    return 
  }

  const { getFeature } = useSdk()
  const pricesIncludeTax = getFeature('pricesIncludeTax')
  const { data: product } = useProduct({ id: stringProductId }, !!stringProductId)

  

  useEffect(() => {
    if (product) {
      handleViewItem(product, !!pricesIncludeTax)
    }
  }, [product, pricesIncludeTax])

  return null
}

const handleViewItem = (product: any, pricesIncludeTax: boolean) => {
  const facetValues = product.facetValues || []
  const facets = itemFacets(facetValues)
  const productVariant = product.variants?.[0]

  if (!productVariant) return

  const price = getPrice(productVariant.price, productVariant.priceWithTax, pricesIncludeTax)

  clearEcommerceData()
  pushToDataLayer('view_item', {
    ecommerce: {
      value: price,
      currency: productVariant.currencyCode,
      items: [
        {
          item_id: productVariant.sku,
          item_name: product.name,
          value: price,
          ...facets,
        },
      ],
    },
  })
}
