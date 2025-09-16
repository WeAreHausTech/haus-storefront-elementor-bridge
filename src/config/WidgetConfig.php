<?php

namespace Haus\StorefrontElementorBridge\config;

/**
 * Available widget types
 */
interface AvailableWidgets
{
    const LOGIN_WIDGET = 'login-widget';
    const RESET_PASSWORD_WIDGET = 'reset-password-widget';
    const CHECKOUT_WIDGET = 'checkout-widget';
    const PRODUCT_LIST_WIDGET = 'product-list-widget';
    const ORDER_VIEW_WIDGET = 'order-view-widget';
    const FILTERS_WIDGET = 'filters-widget';
    const RELATED_PRODUCTS_WIDGET = 'related-products-widget';
    const CART_ICON_WIDGET = 'cart-icon-widget';
    const ACCOUNT_DROPDOWN_WIDGET = 'account-dropdown-widget';
    const CONDITIONAL_TEMPLATE_WIDGET = 'conditional-template-widget';
}

class WidgetConfig implements AvailableWidgets
{
    /**
     * @var array<string, string>
     */
    private const WIDGETS = [
        self::LOGIN_WIDGET => \Haus\StorefrontElementorBridge\Widgets\Login::class,
        self::RESET_PASSWORD_WIDGET => \Haus\StorefrontElementorBridge\Widgets\ResetPassword::class,
        self::CHECKOUT_WIDGET => \Haus\StorefrontElementorBridge\Widgets\Checkout::class,
        self::PRODUCT_LIST_WIDGET => \Haus\StorefrontElementorBridge\Widgets\ProductList::class,
        self::FILTERS_WIDGET => \Haus\StorefrontElementorBridge\Widgets\Filters::class,
        self::ORDER_VIEW_WIDGET => \Haus\StorefrontElementorBridge\Widgets\OrderView::class,
        self::RELATED_PRODUCTS_WIDGET => \Haus\StorefrontElementorBridge\Widgets\RelatedProducts::class,
        self::CART_ICON_WIDGET => \Haus\StorefrontElementorBridge\Widgets\CartIcon::class,
        self::ACCOUNT_DROPDOWN_WIDGET => \Haus\StorefrontElementorBridge\Widgets\AccountDropdown::class,
        self::CONDITIONAL_TEMPLATE_WIDGET => \Haus\StorefrontElementorBridge\Widgets\ConditionalTemplate::class,
    ];

    /**
     * Get enabled widgets
     * 
     * @return array<string, bool> Array of widget keys and their enabled status
     */
    public static function getEnabledWidgets(): array
    {
        $defaultWidgets = array_fill_keys(array_keys(self::WIDGETS), false);

        if (function_exists('apply_filters')) {
            return \apply_filters('haus_enabled_widgets', $defaultWidgets);
        }

        return $defaultWidgets;
    }

    /**
     * Get all available widget keys
     * 
     * @return array<string> Array of all available widget keys
     */
    public static function getAvailableWidgets(): array
    {
        return array_keys(self::WIDGETS);
    }

    /**
     * Get widget class mapping
     * 
     * @return array<string, string> Array of widget keys to class names
     */
    public static function getWidgetClasses(): array
    {
        return self::WIDGETS;
    }
}