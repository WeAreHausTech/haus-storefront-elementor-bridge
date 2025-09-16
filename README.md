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
4. Frontend renderer – React renderer and build tooling (Vite) for the widget UIs

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
