# Haus Storefront Elementor Bridge

A Composer package that registers Elementor widgets for Haus e‑commerce components and wires them to React renderers.

## Installation

```bash
composer require wearehaustech/haus-storefront-elementor-bridge
```

Then initialize the registrar from your WordPress plugin or theme (after Elementor is available):

```php
\Haus\StorefrontElementorBridge\WidgetRegistrar::init();
```

## What it does

This package provides a simple foundation for registering Elementor widgets. It includes:

1. WidgetRegistrar – Registers enabled widgets under the `haus-ecom` Elementor category
2. Widgets – Ready-made Elementor widgets that render Haus Storefront components
3. Configuration – Centralized widget configuration and enabling via a WordPress filter

## Enabling widgets

Widgets are toggled via the `haus_enabled_widgets` filter. Return an array mapping widget keys to booleans. Example enabling a few widgets:

```php
add_filter('haus_enabled_widgets', function (array $widgets) {
    return array_merge($widgets, [
        'account-dropdown-widget' => true,
        'filters-widget' => true,
        'product-list-widget' => true,
    ]);
});
```

## Adding a new widget

1. Create a PHP class in `src/Widgets/YourWidget.php` extending `\Elementor\Widget_Base`.
2. Add the widget to `src/config/WidgetConfig.php` by defining a new key and mapping it to your class.
3. Enable it via the `haus_enabled_widgets` filter in customer repository(see above).

## Using attribute helpers in \_propsFn.ts

When integrating a widget in a host project, you can provide a `_propsFn.ts` to parse DOM `data-*` attributes into typed props for the React renderer. Import the attribute type and helper from `@haus-storefront-elementor-bridge` and return the parsed props.

Example for Product List:

```ts
import {
  ProductListAttributes,
  getProductListAttributes,
} from "@haus-storefront-elementor-bridge";

export default function propsFn(
  dataAttributes: NamedNodeMap
): ProductListAttributes {
  return getProductListAttributes(dataAttributes);
}
```

Available helpers:

- Product List: `getProductListAttributes` → returns `ProductListAttributes`
- Filters: `getFiltersAttributes` → returns `FiltersAttributes`
- Account Dropdown: `getAccountDropdownAttributes` → returns `AccountDropdownAttributes`

Common `data-*` attributes parsed by helpers (converted to camelCase internally):

- Product List: `data-product-list-identifier`, `data-facet` (comma-separated or JSON), `data-collection`, `data-pagination-enabled`, `data-take`
- Filters: `data-product-list-identifier`, `data-price-filter-enabled`, `data-max-skeleton-loaders`, `data-filter-values` (JSON or array)
- Account Dropdown: `data-menu-items` (JSON)

## Event Listener System

The bridge includes a flexible event listener system that allows customers to customize event handling.

### Default Event Listeners

The bridge provides default event listeners

### Custom Event Listeners

Customer repos can provide custom event listeners through the `window.CUSTOM_EVENT_LISTENERS` global:

```typescript
// In customer repo
import { orderLineChannel, checkoutChannel } from "@haus-storefront-react/core";
import { Order } from "@haus-storefront-react/shared-types";

const customEventListeners = [
  {
    event: "orderline:added",
    channel: orderLineChannel,
    handler: (payload: OrderLinePayload) => {
      gtag("event", "add_to_cart", {
        currency: payload.currencyCode,
        value: payload.unitPriceWithTax,
        items: [
          {
            item_id: payload.productVariant.id,
            item_name: payload.productVariant.name,
            quantity: payload.quantity,
            price: payload.unitPriceWithTax,
          },
        ],
      });
    },
  },
  {
    event: "checkout:start",
    channel: checkoutChannel,
    handler: (order: Order) => {
      gtag("event", "begin_checkout", {
        currency: order.currencyCode,
        value: order.totalWithTax,
      });
    },
  },
];

// Make the config available to the bridge
window.CUSTOM_EVENT_LISTENERS = customEventListeners;
```

### Event Configuration

Each event listener is configured with:

```typescript
type EventConfig = {
  event: string; // Event name (e.g., "orderline:added")
  channel: any; // Event bus channel from @haus-storefront-react/core
  handler: (...args: any[]) => void; // Your custom handler function
};
```

### How It Works

- If you provide `window.CUSTOM_EVENT_LISTENERS`, it automatically overrides ALL default events
- Your custom events replace the defaults for the same events
- You can add additional events that don't exist in defaults
- If no custom events are provided, only the bridge defaults run

This system provides a clean, type-safe way to customize event handling while maintaining the bridge's default functionality as a fallback.
