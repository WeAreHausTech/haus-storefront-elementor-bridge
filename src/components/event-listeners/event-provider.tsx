import React from 'react'
import { useDefaultEventListeners } from './default-event-listerners'
import { DEFAULT_EVENTS, EventConfig } from './default-event-listerners'
import { useEventBusOn, useSdk } from '@haus-storefront-react/core'

let eventListenersRegistered = false

function useCustomEventListeners(eventConfigs: EventConfig[], sdk: any) {
  eventConfigs.forEach(({ event, channel, handler }) => {
    useEventBusOn(channel, event as any, (payload: any) => handler(sdk, payload), undefined, false)
  })
}

export function useEventListenerManager(sdk: any, customEventConfigs?: EventConfig[]) {
  if (!eventListenersRegistered) {
    const overrides: { [key: string]: boolean } = {}

    if (customEventConfigs) {
      DEFAULT_EVENTS.forEach((event) => {
        overrides[event] = true
      })
    }

    useDefaultEventListeners(overrides, sdk)

    if (customEventConfigs) {
      useCustomEventListeners(customEventConfigs, sdk)
    }

    eventListenersRegistered = true
  }
}

interface GlobalEventProviderProps {
  children: React.ReactNode
}

export const GlobalEventProvider: React.FC<GlobalEventProviderProps> = ({ children }) => {
  const sdk = useSdk()
  const eventConfigs =
    typeof window !== 'undefined' ? (window as any).CUSTOM_EVENT_LISTENERS : undefined

  useEventListenerManager(sdk, eventConfigs)

  return <>{children}</>
}

export type CustomEventListeners = EventConfig[]
