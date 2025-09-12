<?php
namespace Haus\StorefrontElementorBridge\Widgets;

use \Elementor\Widget_Base;

class CartIcon extends Widget_Base
{

    public function get_name()
    {
        return 'Cart icon';
    }

    public function get_title()
    {
        return esc_html__('Cart icon', 'haus-ecom-widgets');
    }

    public function get_icon()
    {
        return 'eicon-cart-medium';
    }

    public function get_categories()
    {
        return ['haus-ecom'];
    }

    public function get_keywords()
    {
        return ['Ecommerce', 'cart'];
    }


    protected function render()
    {
        $url = $_SERVER['SERVER_NAME'] . $_SERVER['REQUEST_URI'];

        if (strpos($url, '&action=elementor') !== false) {

            return;
        }
        $widgetId = 'ecom_' . $this->get_id(); ?>

        <div id="<?= $widgetId ?>" class="ecom-components-root" data-widget-type="cart-icon"></div>
        <?php
    }
    public function get_script_depends()
    {
        return ['cart-icon'];
    }
}