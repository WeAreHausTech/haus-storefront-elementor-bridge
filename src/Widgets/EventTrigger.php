<?php
namespace Haus\StorefrontElementorBridge\Widgets;

use \Elementor\Widget_Base;

class EventTrigger extends Widget_Base
{

    public function get_name()
    {
        return 'EventTrigger';
    }

    public function get_title()
    {
        return esc_html__('EventTrigger', 'haus-ecom-widgets');
    }

    public function get_icon()
    {
        return 'eicon-progress-tracker';
    }

    public function get_categories()
    {
        return ['haus-ecom'];
    }

    public function get_keywords()
    {
        return ['Ecommerce', 'event', 'google', 'analytics', 'tracking', 'ga', 'gtm'];
    }


    protected function register_controls()
    {
        $this->start_controls_section(
            'section_content',
            [
                'label' => __('Event settings', 'haus-ecom-widgets'),
            ]
        );

        $this->add_control(
            'gtm_event',
            [
                'label' => __('Event type', 'haus-ecom-widgets'),
                'type' => \Elementor\Controls_Manager::SELECT,
                'default' => '0',
                'required' => true,
                'options' => [
                    'purchase' => __('purchase', 'haus-ecom-widgets'),
                    'view-item' => __('view-item', 'haus-ecom-widgets'),
                ],
            ]
        );

        $this->end_controls_section();
    }

    protected function render()
    {
        $url = $_SERVER['SERVER_NAME'] . $_SERVER['REQUEST_URI'];
        $settings = $this->get_settings_for_display();


        if (strpos($url, '&action=elementor') !== false) {
            return;
        }

        $widgetId = 'ecom_' . $this->get_id();
        $productId = get_the_ID();
        $vendureProductId = get_post_meta($productId, 'vendure_id', true) ?? '';

        ?>
        <div 
            id="<?= $widgetId ?>"
            class="ecom-components-root" 
            data-analytics-event="<?= esc_attr($settings['gtm_event']) ?>"
            data-product-id="<?= esc_attr($vendureProductId) ?>"
            data-widget-type="event-trigger">
        </div>
        <?php
    }

    public function get_script_depends()
    {
        return ['event-trigger'];
    }
}