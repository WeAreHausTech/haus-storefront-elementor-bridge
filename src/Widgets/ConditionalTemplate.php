<?php

namespace Haus\StorefrontElementorBridge\Widgets;

use \Elementor\Widget_Base;
class ConditionalTemplate extends Widget_Base
{

    public function get_name()
    {
        return 'ConditionalTemplate';
    }

    public function get_title()
    {
        return esc_html__('Conditional template', 'haus-ecom-widgets');
    }

    public function get_icon()
    {
        return 'eicon-container';
    }

    public function get_categories()
    {
        return ['haus-ecom'];
    }

    public function get_keywords()
    {
        return ['Ecommerce', 'template'];
    }


    protected function register_controls()
    {

        $this->start_controls_section(
            'section_general',
            [
                'label' => __('General settings', 'haus-ecom-widgets'),
            ]
        );

        $this->add_control(
            'condition',
            [
                'label' => __('Condition', 'haus-ecom-widgets'),
                'type' => \Elementor\Controls_Manager::SELECT,
                'options' => apply_filters('haus_ecom_widgets_conditional_template_options', [
                    'priceIsZero' => __('Salesprice is 0 (variant)', 'haus-ecom-widgets'),
                    'cartIsEmpty' => __('Cart is empty', 'haus-ecom-widgets'),
                    'userIsLoggedIn' => __('User is logged in', 'haus-ecom-widgets'),
                ]),
                'default' => 'priceIsZero',
            ]
        );

        $templates = get_transient('ecom-haus-queries-templates');

        if (!$templates) {
            $elementor_templates = get_posts([
                'post_type' => 'elementor_library',
                'posts_per_page' => -1,
            ]);

            $templates = [];
            foreach ($elementor_templates as $template) {
                $templates[$template->ID] = $template->post_title;
            }

            set_transient('ecom-haus-queries-templates', $templates, 60 * 5);
        }

        $options = !empty($templates) ? $templates : ['' => __('No templates available', 'haus-ecom-widgets')];


        $this->add_control(
            'template-id',
            [
                'label' => __('Select Elementor Template if condition is true', 'haus-ecom-widgets'),
                'type' => \Elementor\Controls_Manager::SELECT2,
                'default' => '',
                'options' => $options,
                'label_block' => true,
            ]
        );

        $this->add_control(
            'template-id-false',
            [
                'label' => __('Select Elementor Template if condition is false', 'haus-ecom-widgets'),
                'type' => \Elementor\Controls_Manager::SELECT2,
                'description' => __(
                    'Choose your templates carefully. Using a large or overly complex template may negatively impact your site’s performance. Note that the template will still be rendered in the background, even if the condition for displaying it is not met.',
                    'haus-ecom-widgets'
                ),
                'default' => '',
                'options' => $options,
                'label_block' => true,
            ]
        );

        $this->end_controls_section();
    }

    protected function render()
    {
        $settings = $this->get_settings_for_display();
        $url = $_SERVER['SERVER_NAME'] . $_SERVER['REQUEST_URI'];

        if (strpos($url, '&action=elementor') !== false) {

            return;
        }

        $widgetId = 'ecom_' . $this->get_id();
        $templateId = $settings['template-id'];
        $templateIdFalse = $settings['template-id-false'];
        $productId = get_the_ID();
        $vendureId = get_post_meta($productId, 'vendure_id', true);

        ?>
        <div id="<?= $widgetId ?>" class="ecom-components-root" data-product-id="<?= $vendureId ?>" data-template-id="<?= $templateId ?>" data-template-id-false="<?= $templateIdFalse ?>" data-widget-type="conditional-template" data-condition="<?= $settings['condition'] ?>"></div>
        <?php
        if ($templateId) { ?>
            <div
                id="ecom-elementor-template-<?= $templateId ?>" style="display:none"><?php echo do_shortcode('[elementor-template id="' . $templateId . '"]'); ?>
            </div>
        <?php }
        ?>

        <?php if ($templateIdFalse) { ?>
            <div
                id="ecom-elementor-template-<?= $templateIdFalse ?>" style="display:none"><?php echo do_shortcode('[elementor-template id="' . $templateIdFalse . '"]'); ?>
            </div>
        <?php } ?>    <?php
              }
              public function get_script_depends()
              {
                  return ['conditional-template'];
              }
}
