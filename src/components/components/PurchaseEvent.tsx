import { useEventBusEmit } from '@haus-storefront-react/core'
import { checkoutChannel } from '@haus-storefront-react/core'
import { useOrderByCode } from '@haus-storefront-react/hooks'
import { useEffect } from 'react'

export const PurchaseEvent = () => {
  const urlParams = new URLSearchParams(window.location.search)
  const orderCode = urlParams.get('orderCode')
  const { data: order } = useOrderByCode(orderCode ?? '')

  const emitPurchase = useEventBusEmit(checkoutChannel, 'checkout:purchase')

  console.log('PurchaseEvent: ', order)

  useEffect(() => {
    if (order) {
      emitPurchase(order)
    }
  }, [order, emitPurchase])

  return null
}

export default PurchaseEvent
