<?php
namespace Haus\StorefrontElementorBridge\Widgets;

use \Elementor\Widget_Base;

class AccountDropdown extends Widget_Base
{

    public function get_name()
    {
        return 'AccountDropdown';
    }

    public function get_title()
    {
        return esc_html__('Account Dropdown', 'haus-ecom-widgets');
    }

    public function get_icon()
    {
        return 'eicon-user-circle-o';
    }

    public function get_categories()
    {
        return ['haus-ecom'];
    }

    public function get_keywords()
    {
        return ['Ecommerce', 'account', 'dropdown'];
    }

    protected function register_controls()
    {
        $this->start_controls_section(
            'section_general',
            [
                'label' => __('General settings', 'haus-ecom-widgets'),
            ]
        );

        $repeater = new \Elementor\Repeater();

        $repeater->add_control(
            'href',
            [
                'label' => __('Href:', 'haus-ecom-widgets'),
                'type' => \Elementor\Controls_Manager::TEXT,
                'label_block' => true,
                'default' => '',
            ]
        );

        $repeater->add_control(
            'label',
            [
                'label' => __('Label:', 'haus-ecom-widgets'),
                'type' => \Elementor\Controls_Manager::TEXT,
                'label_block' => true,
                'default' => '',
            ]
        );

        $this->add_control(
            'dropdown-items',
            [
                'label' => __('Menu items:', 'haus-ecom-widgets'),
                'type' => \Elementor\Controls_Manager::REPEATER,
                'fields' => $repeater->get_controls(),
                'default' => [],
                'title_field' => '{{{ label }}}',
                'prevent_empty' => false,
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
        $widgetId = 'ecom_' . $this->get_id(); ?>

        <div id="<?= $widgetId ?>" class="ecom-components-root" data-widget-type="account-dropdown" data-menu-items="<?= htmlspecialchars(json_encode($settings['dropdown-items']), ENT_QUOTES, 'UTF-8'); ?>"></div>
        <?php
    }

    public function get_script_depends()
    {
        return ['account-dropdown'];
    }
}