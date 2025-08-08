# Haus Storefront Elementor Bridge

A simple WordPress plugin that registers Elementor widgets.

## Installation

```bash
composer require haus/haus-storefront-elementor-bridge
```

## Requirements

- WordPress 5.0+
- Elementor 3.0+
- PHP 7.4+

## What it does

This package provides a simple foundation for registering Elementor widgets. It includes:

1. **WidgetRegistrar** - A class that handles widget registration with Elementor
2. **ExampleWidget** - A sample widget showing how to create custom Elementor widgets

## Usage

After installing via Composer, the plugin will automatically:

1. Check if Elementor is active
2. Register the example widget with Elementor
3. Make the widget available in the Elementor editor

## Example Widget

The included example widget demonstrates:

- Basic widget structure
- Control registration (text and textarea inputs)
- Frontend rendering
- Editor preview

## Extending

To add your own widgets, you can:

1. Create new widget classes that extend `Elementor\Widget_Base`
2. Register them in the `WidgetRegistrar::register_widgets()` method
3. Or extend the `WidgetRegistrar` class to add more functionality

## Development

```bash
# Install dependencies
composer install

# The plugin will be installed in wp-content/plugins/haus-storefront-elementor-bridge/
```

## License

MIT License
