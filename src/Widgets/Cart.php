<?php
namespace Haus\StorefrontElementorBridge\Widgets;

class Cart extends \Elementor\Widget_Base
{
    public function get_name()
    {
        return 'haus-cart';
    }

    public function get_title()
    {
        return esc_html__('Cart', 'haus-storefront-elementor-bridge');
    }

    public function get_icon()
    {
        return 'eicon-cart';
    }

    public function get_categories()
    {
        return ['haus-ecom'];
    }

    public function get_keywords()
    {
        return ['Ecommerce', 'cart'];
    }

    protected function register_controls()
    {
        // Cart widget controls can be added here
    }

    protected function render()
    {
        $widgetId = 'haus_cart_' . $this->get_id();
        ?>
        <div id="<?= $widgetId ?>" class="haus-ecom-components-root" data-widget-type="cart">
        </div>
        <?php
    }

    protected function content_template()
    {
        ?>
        <div class="haus-cart-preview">
            <i class="eicon-cart"></i>
            <h3>Cart Widget</h3>
            <small>Cart functionality will be rendered here</small>
        </div>
        <?php
    }
}