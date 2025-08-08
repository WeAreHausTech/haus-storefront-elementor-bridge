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

            // Register widgets
            \Elementor\Plugin::instance()
                ->widgets_manager
                ->register(new \Haus\StorefrontElementorBridge\Widgets\ExampleWidget());

            // Debug: Check if widget is registered
            error_log('Haus Bridge: Widget registered - ExampleWidget');
        });
    }
}