import { ViewItemEvent } from './ViewItemEvent'
import { PurchaseEvent } from './PurchaseEvent'

export interface EventTriggerProps {
  analyticsEvent?: string
  productId?: string
}

export const EventTrigger = ({ analyticsEvent, productId }: EventTriggerProps) => {
  switch (analyticsEvent) {
    case 'purchase':
      return <PurchaseEvent />
    case 'view-item':
      return <ViewItemEvent productId={productId || ''} />
    default:
      console.warn(`EventTrigger: Unknown event type "${analyticsEvent}"`)
      return null
  }
}

export default EventTrigger
