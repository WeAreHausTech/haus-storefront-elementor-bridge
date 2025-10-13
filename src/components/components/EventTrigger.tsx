import { productChannel, useEventBusEmit } from '@haus-storefront-react/core'
import { checkoutChannel } from '@haus-storefront-react/core'
import { useActiveOrder, useProduct } from '@haus-storefront-react/hooks'

export interface EventTriggerProps {
  analyticsEvent?: string
  productId?: string
}

export const EventTrigger = ({ analyticsEvent, productId }: EventTriggerProps) => {
  const emitPurchase = useEventBusEmit(checkoutChannel, 'checkout:purchase')
  const emitViewItem = useEventBusEmit(productChannel, 'product:viewed')
  const urlParams = new URLSearchParams(window.location.search)
  const orderCode = urlParams.get('orderCode')
  const { data: order } = useActiveOrder({ enabled: !!orderCode })
  const stringProductId = String(productId)
  const { data: product } = useProduct({ id: stringProductId }, !!stringProductId)

  switch (analyticsEvent) {
    case 'purchase':
      if (!order) {
        console.warn('EventTrigger: No order data available for purchase event')
        return null
      }
      return emitPurchase(order)
    case 'view-item':
      if (!product) {
        console.warn('EventTrigger: No product data available for view item event')
        return null
      }
      return emitViewItem(product)
    default:
      console.warn(`EventTrigger: Unknown event type "${analyticsEvent}"`)
      return null
  }
}

export default EventTrigger
