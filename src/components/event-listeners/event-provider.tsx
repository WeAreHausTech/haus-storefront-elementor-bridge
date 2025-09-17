import React from "react";
import { useDefaultEventListeners } from "./default-event-listerners";
import { DEFAULT_EVENTS, EventConfig } from "./default-event-listerners";
import { useEventBusOn } from "@haus-storefront-react/core";

let eventListenersRegistered = false;

function useCustomEventListeners(eventConfigs: EventConfig[]) {
  eventConfigs.forEach(({ event, channel, handler }) => {
    useEventBusOn(channel, event as any, handler);
  });
}

export function useEventListenerManager(customEventConfigs?: EventConfig[]) {
  if (!eventListenersRegistered) {
    const overrides: { [key: string]: boolean } = {};

    if (customEventConfigs) {
      DEFAULT_EVENTS.forEach((event) => {
        overrides[event] = true;
      });
    }

    useDefaultEventListeners(overrides);

    if (customEventConfigs) {
      useCustomEventListeners(customEventConfigs);
    }

    eventListenersRegistered = true;
  }
}

interface GlobalEventProviderProps {
  children: React.ReactNode;
}

export const GlobalEventProvider: React.FC<GlobalEventProviderProps> = ({
  children,
}) => {
  const eventConfigs =
    typeof window !== "undefined"
      ? (window as any).CUSTOM_EVENT_LISTENERS
      : undefined;

  useEventListenerManager(eventConfigs);

  return <>{children}</>;
};

export type CustomEventListeners = EventConfig[];
