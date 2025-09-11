<?php
namespace Haus\StorefrontElementorBridge\Widgets;

use \Elementor\Widget_Base;
use \Haus\StorefrontElementorBridge\Queries\QueryHelper;

class RelatedProducts extends Widget_Base
{
    public function get_name()
    {
        return 'RelatedProducts';
    }
    public function get_title()
    {
        return esc_html__('Related products', 'haus-ecom-widgets');
    }
    public function get_icon()
    {
        return 'eicon-products';
    }
    public function get_categories()
    {
        return ['haus-ecom'];
    }
    public function get_keywords()
    {
        return ['Ecommerce', 'product'];
    }

    protected function _register_controls()
    {
        $this->start_controls_section(
            'section_content',
            [
                'label' => __('Filter settings', 'haus-ecom-widgets'),
            ]
        );

        $this->add_facet_controls();


        $this->add_control(
            'max_products',
            [
                'label' => __('Max products', 'haus-ecom-widgets'),
                'type' => \Elementor\Controls_Manager::NUMBER,
                'default' => '12',
            ]
        );

        $this->end_controls_section();
    }


    public function get_facets()
    {
        $facets = get_transient('ecom-haus-queries-facet');

        if (!$facets) {
            $facets = (new QueryHelper)->getVendureFacets('sv');
            set_transient('ecom-haus-queries-facet', $facets, 60 * 5);
        }

        return $facets;
    }

    public function add_facet_controls()
    {
        $facets = $this->get_facets();

        if (!isset($facets)) {
            return;
        }

        $options = [];

        foreach ($facets as $facet) {
            $options[$facet['id']] = $facet['name'];
        }

        $this->add_control(
            'facet',
            [
                'label' => __('Show related products based on:', 'haus-ecom-widgets'),
                'type' => \Elementor\Controls_Manager::SELECT2,
                'label_block' => true,
                'options' => $options,
            ]
        );
    }
    protected function render()
    {
        $url = $_SERVER['SERVER_NAME'] . $_SERVER['REQUEST_URI'];

        if (strpos($url, '&action=elementor') !== false) {
            return;
        }
        $settings = $this->get_settings_for_display();
        $facet = $settings['facet'] ?? '';
        $productId = get_the_ID();
        $vendureId = get_post_meta($productId, 'vendure_id', true);

        $widget_id = 'ecom_' . $this->get_id();
        ?>
        <div id="<?= $widget_id ?>" class="ecom-components-root" data-widget-type="related-products"
            data-product="<?= $vendureId ?>" data-take="<?= $settings['max_products'] ?>" data-facet="<?= $facet ?>">
        </div>
        <?php

    }

    public function get_script_depends()
    {
        return ['related-products'];
    }
}
