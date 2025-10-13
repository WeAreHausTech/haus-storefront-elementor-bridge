import React, { Suspense } from 'react'
import { ViewItemEvent } from './ViewItemEvent'
import { PurchaseEvent } from './PurchaseEvent'

export interface GoogleTaskManagerProps {
  analyticsEvent?: string
  productId?: string
}

export const GoogleTaskManager: React.FC<GoogleTaskManagerProps> = ({
  analyticsEvent,
  productId,
}) => {
  switch (analyticsEvent) {
    case 'purchase':
      return (
        <Suspense fallback={<div></div>}>
          <PurchaseEvent />
        </Suspense>
      )
    case 'view-item':
      return (
        <Suspense fallback={<div></div>}>
          <ViewItemEvent productId={productId || ''} />
        </Suspense>
      )
    default:
      console.warn(`GoogleTaskManager: Unknown event type "${analyticsEvent}"`)
      return null
  }
}

export default GoogleTaskManager
