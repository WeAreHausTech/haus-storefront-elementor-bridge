import React, { useEffect } from 'react'
import { pushToDataLayer } from '../event-listeners/gtm'

export interface GoogleTaskManagerProps {
  analyticsEvent?: string
  product?: string
  [key: string]: any
}

export const GoogleTaskManager: React.FC<GoogleTaskManagerProps> = ({
  analyticsEvent,
  product,
  ...props
}) => {
  useEffect(() => {
    if (!analyticsEvent) {
      console.warn('GoogleTaskManager: No analytics event specified')
      return
    }

    const eventData: Record<string, unknown> = {
      event: analyticsEvent,
    }

    if (product) {
      eventData.item_id = product
    }

    Object.keys(props).forEach((key) => {
      if (key !== 'analyticsEvent' && key !== 'product' && props[key] !== undefined) {
        eventData[key] = props[key]
      }
    })

    pushToDataLayer(analyticsEvent, eventData)

    console.log(`GoogleTaskManager: Triggered GTM event "${analyticsEvent}"`, eventData)
  }, [analyticsEvent, product, props])

  return null
}

export default GoogleTaskManager
