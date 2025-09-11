<?php
namespace Haus\StorefrontElementorBridge\Widgets;

use \Elementor\Widget_Base;

class Checkout extends Widget_Base
{

    public function get_name()
    {
        return 'Checkout';
    }

    public function get_title()
    {
        return esc_html__('Checkout', 'haus-ecom-widgets');
    }

    public function get_icon()
    {
        return 'eicon-checkout';
    }

    public function get_categories()
    {
        return ['haus-ecom'];
    }

    public function get_keywords()
    {
        return ['Ecommerce', 'checkout'];
    }


    protected function render()
    {
        $url = $_SERVER['SERVER_NAME'] . $_SERVER['REQUEST_URI'];
        $settings = $this->get_settings_for_display();

        if (strpos($url, '&action=elementor') !== false) {
            return;
        }

        $widgetId = 'ecom_' . $this->get_id(); ?>

        <div id="<?= $widgetId ?>" class="ecom-components-root" data-show-subtotal="<?= $settings['show_subTotal'] ?>"
            data-show-tax="<?= $settings['show_tax'] ?>" data-show-shipping="<?= $settings['show_shipping'] ?>"
            data-show-total="<?= $settings['show_total'] ?>" data-custom-message="<?= $settings['custom-message'] ?>"
            data-widget-type="checkout">
        </div>
        <?php
    }

    public function get_script_depends()
    {
        return ['checkout'];
    }
}