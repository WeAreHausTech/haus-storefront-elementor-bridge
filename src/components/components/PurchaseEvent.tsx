import { useActiveOrder } from '@haus-storefront-react/hooks'
import { useSdk } from '@haus-storefront-react/core'
import { Order, OrderLine } from '@haus-storefront-react/shared-types'
import { map, reduce } from 'lodash'
import { useEffect } from 'react'
import { clearEcommerceData, getPrice, itemFacets, pushToDataLayer } from '../event-listeners/gtm'

export const PurchaseEvent = () => {
  const urlParams = new URLSearchParams(window.location.search)
  const orderCode = urlParams.get('orderCode')
  const { data: order } = useActiveOrder({ enabled: !!orderCode })
  const { getFeature } = useSdk()
  const pricesIncludeTax = getFeature('pricesIncludeTax')

  console.log('trigger gtm purchase', order)

  useEffect(() => {
    if (order && order.code) {
      handlePurchase(order, !!pricesIncludeTax)
    }
  }, [order, pricesIncludeTax])

  return <div></div>
}

const handlePurchase = (order: Order, pricesIncludeTax: boolean) => {
  const shipping = reduce(
    order.shippingLines || [],
    (acc, line) => {
      return acc + Number(getPrice(line.price, line.priceWithTax, pricesIncludeTax))
    },
    0,
  )

  const tax = reduce(
    order.taxSummary || [],
    (acc, tax) => {
      return acc + tax.taxTotal / 100
    },
    0,
  )

  const items = map(order.lines || [], (line: OrderLine) => {
    const facetValues = line.productVariant.product.facetValues || []
    const facets = itemFacets(facetValues)

    return {
      item_id: line.productVariant.sku,
      item_name: line.productVariant.name,
      price: getPrice(line.unitPrice, line.unitPriceWithTax, pricesIncludeTax),
      quantity: line.quantity,
      ...facets,
    }
  })

  clearEcommerceData()
  pushToDataLayer('purchase', {
    ecommerce: {
      transaction_id: order.code,
      value: getPrice(order.total, order.totalWithTax, pricesIncludeTax),
      tax: tax,
      shipping: shipping,
      currency: order.currencyCode,
      items: items,
    },
  })
}
