import { ViewItemEvent } from './ViewItemEvent'
import { PurchaseEvent } from './PurchaseEvent'

export interface GoogleTaskManagerProps {
  analyticsEvent?: string
  productId?: string
}

export const GoogleTaskManager = ({ analyticsEvent, productId }: GoogleTaskManagerProps) => {
  switch (analyticsEvent) {
    case 'purchase':
      return <PurchaseEvent />
    case 'view-item':
      return <ViewItemEvent productId={productId || ''} />
    default:
      console.warn(`GoogleTaskManager: Unknown event type "${analyticsEvent}"`)
      return null
  }
}

export default GoogleTaskManager
