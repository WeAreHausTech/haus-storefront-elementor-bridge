import { orderLineChannel, useEventBusOn, OrderLinePayload } from '@haus-storefront-react/core'
import { clearEcommerceData, pushToDataLayer, getPrice, itemFacets } from './gtm'

export type EventConfig = {
  event: string
  channel: any
  handler: (sdk: any, ...args: any[]) => void
}

const EVENT_CONFIGS: EventConfig[] = [
  {
    event: 'orderline:added',
    channel: orderLineChannel,
    handler: (sdk: any, payload: OrderLinePayload) => {
      console.log('trigger gtm add_to_cart', payload)

      const { getFeature } = sdk
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
]

export const DEFAULT_EVENTS = EVENT_CONFIGS.map((config) => config.event)

export function useDefaultEventListeners(overrides: { [key: string]: boolean } = {}, sdk: any) {
  EVENT_CONFIGS.forEach(({ event, channel, handler }) => {
    if (!overrides[event]) {
      useEventBusOn(channel, event, (payload: any) => handler(sdk, payload), undefined, false)
    }
  })
}
