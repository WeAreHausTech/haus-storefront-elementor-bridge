import {
  orderLineChannel,
  useEventBusOn,
  OrderLinePayload,
  checkoutChannel,
  productChannel,
} from '@haus-storefront-react/core'
import { clearEcommerceData, pushToDataLayer, getPrice, itemFacets } from './gtm'
import { Order, Product } from '@haus-storefront-react/shared-types'
import { OrderLine } from '@haus-storefront-react/shared-types'
import { map, reduce } from 'lodash'

export type EventConfig = {
  event: string
  channel: any
  handler: (sdk: any, ...args: any[]) => void
}

const EVENT_CONFIGS: EventConfig[] = [
  {
    event: 'orderline:added',
    channel: orderLineChannel,
    handler: (sdkInstance: any, payload: OrderLinePayload) => {
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
  {
    event: 'checkout:purchase',
    channel: checkoutChannel,
    handler: (sdkInstance: any, order: Order) => {
      const { getFeature } = sdkInstance
      const pricesIncludeTax = getFeature('pricesIncludeTax')
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
    },
  },
  {
    event: 'product:viewed',
    channel: productChannel,
    handler: (sdkInstance: any, product: Product) => {
      const { getFeature } = sdkInstance
      const pricesIncludeTax = getFeature('pricesIncludeTax')
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
