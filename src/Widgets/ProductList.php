<?php

namespace Haus\StorefrontElementorBridge\Widgets;

use \Elementor\Widget_Base;
use \Haus\StorefrontElementorBridge\Queries\QueryHelper;

class ProductList extends Widget_Base
{

    public function get_name()
    {
        return 'Product List';
    }

    public function get_title()
    {
        return esc_html__('Product List', 'haus-ecom-widgets');
    }

    public function get_icon()
    {
        return 'eicon-post-list';
    }


    public function get_categories()
    {
        return ['haus-ecom'];
    }

    public function get_keywords()
    {
        return ['Ecommerce', 'productfilter'];
    }

    protected function _register_controls()
    {
        $this->start_controls_section(
            'section_general',
            [
                'label' => __('General settings', 'haus-ecom-widgets'),
            ]
        );

        $this->add_control(
            'product_list_identifier',
            [
                'label' => __('Product list identifier', 'haus-ecom-widgets'),
                'type' => \Elementor\Controls_Manager::TEXT,
                'description' => __('Product list identifier. Used for just listen to events passed with the same identifier.', 'haus-ecom-widgets'),
                'default' => 'product-list',
            ]
        );

        $this->add_control(
            'button_variant',
            [
                'label' => __('Button Variant', 'haus-ecom-widgets'),
                'type' => \Elementor\Controls_Manager::SELECT,
                'options' => $this->get_button_variant_options(),
                'default' => 'primary',
                'description' => __('Choose the button variant for product actions.', 'haus-ecom-widgets'),
            ]
        );

        $this->end_controls_section();

        $this->start_controls_section(
            'section_content',
            [
                'label' => __('Filter settings', 'haus-ecom-widgets'),
            ]
        );

        $this->getAvalibleCollections();
        $this->add_facet_controls();
        $this->end_controls_section();

        $this->start_controls_section(
            'section_pagination',
            [
                'label' => __('Pagination', 'haus-ecom-widgets'),
            ]
        );
        $this->add_pagination_controls();
        $this->end_controls_section();

        $this->getAvailableFacets();
    }

    public function getAvalibleCollections()
    {
        $collections = $this->get_collections();

        $options = [
            '0' => '-',
        ];

        foreach ($collections as $value) {
            $options[$value['id']] = $value['name'];
        }


        $this->add_control(
            'collectionId',
            [
                'label' => __('Collection ', 'haus-ecom-widgets'),
                'type' => \Elementor\Controls_Manager::SELECT2,
                'label_block' => true,
                'options' => $options,
                'default' => '0',
            ]
        );
    }

    public function getAvailableFacets()
    {
        $facets = $this->get_facets();

        if (!isset($facets)) {
            return;
        }

        $options = [];

        foreach ($facets as $facet) {
            $options[$facet['code']] = $facet['code'] . ' (id: ' . $facet['id'] . ')';
        }

        $repeater = new \Elementor\Repeater();

        $repeater->add_control(
            'filter_value',
            [
                'label' => __('Filter Value:', 'haus-ecom-widgets'),
                'type' => \Elementor\Controls_Manager::SELECT,
                'label_block' => true,
                'options' => $options,
                'default' => '0',
            ]
        );

        $repeater->add_control(
            'filter_condition',
            [
                'label' => __('Filter Condition:', 'haus-ecom-widgets'),
                'type' => \Elementor\Controls_Manager::SELECT,
                'label_block' => true,
                'options' => [
                    'OR' => __('OR', 'haus-ecom-widgets'),
                    'AND' => __('AND', 'haus-ecom-widgets'),
                    'NOT' => __('NOT', 'haus-ecom-widgets'),
                ],
                'default' => 'OR',
            ]
        );

        $repeater->add_control(
            'filter_label',
            [
                'label' => __('Filter Label:', 'haus-ecom-widgets'),
                'type' => \Elementor\Controls_Manager::TEXT,
                'label_block' => true,
                'default' => '',
            ]
        );


    }

    public function get_collections()
    {
        $collections = get_transient('ecom-haus-queries-collection');

        if (!$collections) {
            $collections = (new QueryHelper)->getVendureCollections('sv');
            set_transient('ecom-haus-queries-collection', $collections, 60 * 5);
        }

        return $collections;
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

        //TODO make a boolean, right now department/brand/category all means true and all works the same
        $this->add_control(
            'autoFacet',
            [
                'label' => __('Autoset taxonomy:', 'haus-ecom-widgets'),
                'type' => \Elementor\Controls_Manager::SELECT2,
                'label_block' => true,
                'options' => [
                    '0' => '-',
                    'department' => 'Department',
                    'brand' => 'Brand',
                    'category' => 'Category',
                ],
                'default' => '0',
                'condition' => [
                    'collectionId' => '0',
                ],
            ]
        );

        foreach ($facets as $facet) {
            $this->add_control(
                'facetType-' . $facet['code'],
                [
                    'label' => __(ucfirst($facet['code']) . ':', 'haus-ecom-widgets'),
                    'type' => \Elementor\Controls_Manager::SELECT2,
                    'label_block' => true,
                    'options' => $this->get_facet_options($facet),
                    'default' => '0',
                    'condition' => [
                        'autoFacet!' => $facet['code'],
                    ],
                ]
            );
        }
    }

    public function get_facet_options($facet)
    {
        $options = [
            '0' => '-',
        ];

        foreach ($facet['values'] as $value) {
            $options[$value['id']] = $value['name'];
        }

        return $options;
    }

    public function add_pagination_controls()
    {


        $this->add_control(
            'pagination_enabled',
            [
                'label' => __('Enable Pagination', 'haus-ecom-widgets'),
                'type' => \Elementor\Controls_Manager::SELECT,
                'default' => '0',
                'options' => [
                    '0' => __('No', 'haus-ecom-widgets'),
                    '1' => __('Yes', 'haus-ecom-widgets'),
                ],
            ]
        );

        $this->add_control(
            'products_per_page',
            [
                'label' => __('Products per page', 'haus-ecom-widgets'),
                'type' => \Elementor\Controls_Manager::NUMBER,
                'default' => '12',
            ]
        );
    }

    public function get_button_variant_options()
    {
        return apply_filters('haus_ecom_widgets_button_variant_options', [
            'primary' => __('Primary', 'haus-ecom-widgets'),
        ]);
    }

    protected function render()
    {
        $settings = $this->get_settings_for_display();
        $url = $_SERVER['SERVER_NAME'] . $_SERVER['REQUEST_URI'];

        if (strpos($url, '&action=elementor') !== false) {
            return;
        }

        $taxonomy = '';
        $facets = [];

        $autoSetTaxonomy = $settings['autoFacet'] !== '0';
        $collectionId = $settings['collectionId'] !== '0';

        if ($collectionId) {
            $taxonomy = $settings['collectionId'];
        } else if ($autoSetTaxonomy) {
            $currentTerm = get_queried_object();
            $termId = $currentTerm->term_id;
            $vendureCollectionId = get_term_meta($termId, 'vendure_collection_id', true);

            if ($termId && $vendureCollectionId) {
                $taxonomy = $vendureCollectionId;
            } else {
                $vendureTermId = get_term_meta($termId, 'vendure_term_id', true);
                if ($vendureTermId) {
                    $facets[] = $vendureTermId;
                }
            }
        }

        foreach ($settings as $key => $value) {
            if (strpos($key, 'facetType-') !== false && $value !== '0' && ($autoSetTaxonomy && $key !== 'facetType-' . $settings['autoFacet'] || !$autoSetTaxonomy)) {
                $facets[] = $value;
            }
        }

        $widgetId = 'ecom_' . $this->get_id();

        ?>
        <div id="placeholderWrapper" style="position: relative; width: 100%; ">
            <div id="<?= $widgetId ?>" class="ecom-components-root productlist-widget" data-widget-type="product-list" data-facet="<?= implode(", ", $facets) ?>" data-collection="<?= $taxonomy ?>" data-take="<?= $settings['products_per_page'] ?>" data-pagination-enabled="<?= $settings['pagination_enabled'] ?>" data-product-list-identifier="<?= $settings['product_list_identifier'] ?>" data-button-variant="<?= $settings['button_variant'] ?>"></div>
            <?php if ($_ENV['ENABLE_SKELETON_PRODUCT_LIST'] === 'true'): ?>
                <div
                    id="ph-cards" class="placeholder-cards" style="position:absolute; width: 100%; top: 0; left: 0;">
                    <?php for ($i = 0; $i < $settings['products_per_page']; $i++): ?>
                        <div class="placeholder-card">
                            <div class="placeholder-image"></div>
                            <div class="placeholder-text"></div>
                        </div>
                    <?php endfor; ?>
                </div>
            <?php endif; ?>
        </div>


        <script>
            (function () {
        const productListWidget = document.getElementById('<?= $widgetId ?>');
        const placeholderCards = document.getElementById('ph-cards');
        const placeholderCardsHeight = placeholderCards ? placeholderCards.clientHeight : 0;
        const placeholderWrapper = document.getElementById('placeholderWrapper');

        if (placeholderCards) {
        placeholderWrapper.style.height = `${placeholderCardsHeight}px`;
        }

        window.addEventListener('product-list:data:changed', function (event) {
        if (! productListWidget) {
        return;
        }

        const handleShadowRootDetected = () => {
        if (productListWidget.shadowRoot) { // Remove or hide the placeholder cards
        if (placeholderCards) {
        placeholderCards.remove();
        placeholderWrapper.style.height = 'auto';
        }
        }
        };

        if (productListWidget.shadowRoot) {
        handleShadowRootDetected();
        }
        });
        })();
        </script><?php
    }

    public function get_script_depends()
    {
        return ['product-list'];
    }
}
