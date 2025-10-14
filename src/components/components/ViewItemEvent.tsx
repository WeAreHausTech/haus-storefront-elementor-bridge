import { productChannel, useEventBusEmit } from '@haus-storefront-react/core'
import { useProduct } from '@haus-storefront-react/hooks'
import { useEffect } from 'react'

export interface ViewItemEventProps {
  productId?: string
}

export const ViewItemEvent = ({ productId }: ViewItemEventProps) => {
  const stringProductId = String(productId)
  const { data: product } = useProduct({ id: stringProductId }, !!stringProductId)

  const emitViewItem = useEventBusEmit(productChannel, 'product:viewed')

  console.log('ViewItemEvent: ', product)

  useEffect(() => {
    if (product) {
      emitViewItem(product)
    }
  }, [product, emitViewItem])

  return null
}

export default ViewItemEvent
