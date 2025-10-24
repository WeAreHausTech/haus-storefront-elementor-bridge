<?php

namespace Haus\StorefrontElementorBridge;

/**
 * Simple widget registrar for Elementor
 */
class WidgetRegistrar
{
    /**
     * Initialize the widget registrar
     */
    public static function init()
    {
        $instance = new self();
        $instance->setup_hooks();
    }

    /**
     * Setup WordPress hooks
     */
    private function setup_hooks()
    {
        add_action('init', function () {
            if (!defined('WP_INSTALLING') && !did_action('elementor/loaded')) {
                return;
            }

            // Register category
            \Elementor\Plugin::instance()
                ->elements_manager
                ->add_category('haus-ecom', ['title' => 'Haus ecom']);


            // Get enabled widgets from config
            $enabledWidgets = \Haus\StorefrontElementorBridge\Config\WidgetConfig::getEnabledWidgets();

            // Get widget classes from centralized config
            $widgetClasses = \Haus\StorefrontElementorBridge\Config\WidgetConfig::getWidgetClasses();

            // Register enabled widgets dynamically
            foreach ($enabledWidgets as $widgetKey => $isEnabled) {
                if ($isEnabled && isset($widgetClasses[$widgetKey])) {
                    $widgetClass = $widgetClasses[$widgetKey];

                    // Check if class exists before registering
                    if (class_exists($widgetClass)) {

                        \Elementor\Plugin::instance()
                            ->widgets_manager
                            ->register(new $widgetClass());
                    } else {
                        error_log("Haus Bridge: Widget class not found - {$widgetClass}");
                    }
                }
            }
        });
    }
}