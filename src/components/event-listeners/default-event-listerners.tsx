import {
  orderLineChannel,
  useEventBusOn,
  OrderLinePayload,
} from "@haus-storefront-react/core";

export type EventConfig = {
  event: string;
  channel: any;
  handler: (...args: any[]) => void;
};

const EVENT_CONFIGS: EventConfig[] = [
  {
    event: "orderline:added",
    channel: orderLineChannel,
    handler: (payload: OrderLinePayload) => {
      console.log("trigger gtm add_to_cart", payload);
    },
  },
];

export const DEFAULT_EVENTS = EVENT_CONFIGS.map((config) => config.event);

export function useDefaultEventListeners(
  overrides: { [key: string]: boolean } = {}
) {
  EVENT_CONFIGS.forEach(({ event, channel, handler }) => {
    if (!overrides[event]) {
      useEventBusOn(channel, event, handler);
    }
  });
}
