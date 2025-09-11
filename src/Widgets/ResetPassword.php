<?php
namespace Haus\StorefrontElementorBridge\Widgets;

class ResetPassword extends \Elementor\Widget_Base
{

    public function get_name()
    {
        return 'Reset password';
    }

    public function get_title()
    {
        return esc_html__('Reset password', 'haus-ecom-widgets');
    }

    public function get_icon()
    {
        return 'eicon-lock-user';
    }

    public function get_categories()
    {
        return ['haus-ecom'];
    }

    public function get_keywords()
    {
        return ['Ecommerce', 'password'];
    }

    protected function render()
    {
        $url = $_SERVER['SERVER_NAME'] . $_SERVER['REQUEST_URI'];

        if (strpos($url, '&action=elementor') !== false) {
            return;
        }
        $widgetId = 'ecom_' . $this->get_id(); ?>

        <div id="<?= $widgetId ?>" class="ecom-components-root" data-widget-type="reset-password">
        </div>
        <?php
    }

    public function get_script_depends()
    {
        return ['reset-password'];
    }
}