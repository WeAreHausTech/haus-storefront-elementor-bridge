import {
  orderLineChannel,
  useEventBusOn,
  OrderLinePayload,
  checkoutChannel,
  useSdk,
} from '@haus-storefront-react/core'
import { Order, OrderLine } from '@haus-storefront-react/shared-types'
import { clearEcommerceData, pushToDataLayer, getPrice, itemFacets } from './gtm'
import { map } from 'lodash'

export type EventConfig = {
  event: string
  channel: any
  handler: (sdk: any, ...args: any[]) => void
}

const createEventConfigs = (): EventConfig[] => [
  {
    event: 'orderline:added',
    channel: orderLineChannel,
    handler: (sdkInstance: any, payload: OrderLinePayload) => {
      console.log('trigger gtm add_to_cart', payload)

      const { getFeature } = sdkInstance
      const pricesIncludeTax = getFeature('pricesIncludeTax')
      const productVariant = payload.orderLine?.productVariant
      const product = productVariant?.product
      const facets = itemFacets(product?.facetValues || [])
      const price = getPrice(productVariant?.price, productVariant?.priceWithTax, pricesIncludeTax)

      clearEcommerceData()
      pushToDataLayer('add_to_cart', {
        ecommerce: {
          value: price * payload.payload?.quantity,
          currency: productVariant?.currencyCode,
          items: [
            {
              item_id: productVariant?.sku,
              item_name: productVariant?.name,
              value: price,
              quantity: payload.payload?.quantity,
              ...facets,
            },
          ],
        },
      })
    },
  },
  {
    event: 'checkout:start',
    channel: checkoutChannel,
    handler: (sdkInstance: any, order: Order) => {
      console.log('trigger gtm begin_checkout', order)

      const { getFeature } = sdkInstance
      const pricesIncludeTax = getFeature('pricesIncludeTax')
      const items = map(order.lines, (line: OrderLine) => {
        const facetValues = line.productVariant.product.facetValues
        const facets = itemFacets(facetValues)

        return {
          item_id: line.productVariant.sku,
          item_name: line.productVariant.name,
          value: getPrice(line.unitPrice, line.unitPriceWithTax, pricesIncludeTax),
          quantity: line.quantity,
          ...facets,
        }
      })

      clearEcommerceData()
      pushToDataLayer('begin_checkout', {
        ecommerce: {
          currency: order.currencyCode,
          value: getPrice(order.total, order.totalWithTax, pricesIncludeTax),
          items: items,
        },
      })
    },
  },
]

export const DEFAULT_EVENTS = ['orderline:added', 'checkout:start']

export function useDefaultEventListeners(overrides: { [key: string]: boolean } = {}) {
  const sdk = useSdk()
  const eventConfigs = createEventConfigs()

  eventConfigs.forEach(({ event, channel, handler }) => {
    if (!overrides[event]) {
      useEventBusOn(channel, event, (payload: any) => handler(sdk, payload), undefined, false)
    }
  })
}
