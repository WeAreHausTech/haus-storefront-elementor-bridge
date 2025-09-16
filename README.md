# Haus Storefront Elementor Bridge

A composer packaage that registers Elementor widgets for haus ecom components

## Installation

```bash
composer require haus/haus-storefront-elementor-bridge
```

## What it does

This package provides a simple foundation for registering Elementor widgets. It includes:

1. **WidgetRegistrar** - A class that handles widget registration with Elementor
2. **General elementor widgets** - Elementor widgets with settings to use Haus Storefront React components
3. **Configuration system** - PHP configuration for widget settings and properties
4. **Widget renderer** - TypeScript/React component renderer for shadow DOM integration

## Register new widget

To register a new Elementor widget:

1. Create a new widget class extending the base widget in `src/Widgets/`
2. Add your widget configuration in `src/config/WidgetConfig.php`
3. Enable widget in customer repo by adding it to the enabled widgets filter:

```
    add_filter('haus_enabled_widgets', function ($widgets) {
        $enabledWidgets = [
            'example-widget' => true,
        ];

        return $enabledWidgets;
    });
```
