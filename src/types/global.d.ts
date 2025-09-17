import { EventConfig } from "../components/event-listeners/default-event-listerners";

declare global {
  interface Window {
    CUSTOM_EVENT_LISTENERS?: EventConfig[];
  }
}

export {};
