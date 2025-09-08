<?php

namespace Haus\StorefrontElementorBridge\config;

/**
 * Available widget types
 */
interface AvailableWidgets
{
    const EXAMPLE_WIDGET = 'example-widget';
    const LOGIN_WIDGET = 'login-widget';
    const RESET_PASSWORD_WIDGET = 'reset-password-widget';
    const CHECKOUT_WIDGET = 'checkout-widget';

}

/**
 * Widget configuration
 * Customer can override this by creating their own config file
 */
class WidgetConfig implements AvailableWidgets
{
    /**
     * Get enabled widgets
     * 
     * @return array<string, bool> Array of widget keys and their enabled status
     */
    public static function getEnabledWidgets(): array
    {
        $defaultWidgets = [
            self::EXAMPLE_WIDGET => false,
            self::LOGIN_WIDGET => false,
            self::RESET_PASSWORD_WIDGET => false,
            self::CHECKOUT_WIDGET => false,
        ];

        // Allow customer to override via WordPress filter
        return apply_filters('haus_enabled_widgets', $defaultWidgets);
    }

    /**
     * Get all available widget keys
     * 
     * @return array<string> Array of all available widget keys
     */
    public static function getAvailableWidgets(): array
    {
        return [
            self::EXAMPLE_WIDGET,
            self::LOGIN_WIDGET,
            self::RESET_PASSWORD_WIDGET,
            self::CHECKOUT_WIDGET,
        ];
    }

    /**
     * Get widget class mapping
     * 
     * @return array<string, string> Array of widget keys to class names
     */
    public static function getWidgetClasses(): array
    {
        return [
            self::EXAMPLE_WIDGET => \Haus\StorefrontElementorBridge\Widgets\ExampleWidget::class,
            self::LOGIN_WIDGET => \Haus\StorefrontElementorBridge\Widgets\Login::class,
            self::RESET_PASSWORD_WIDGET => \Haus\StorefrontElementorBridge\Widgets\ResetPassword::class,
            self::CHECKOUT_WIDGET => \Haus\StorefrontElementorBridge\Widgets\Checkout::class,
        ];
    }
}