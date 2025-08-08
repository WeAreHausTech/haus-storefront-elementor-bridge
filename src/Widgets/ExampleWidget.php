<?php
namespace Haus\StorefrontElementorBridge\Widgets;

/**
 * Example Elementor widget
 */
class ExampleWidget extends \Elementor\Widget_Base
{
    /**
     * Get widget name
     */
    public function get_name()
    {
        return 'haus-example-widget';
    }

    /**
     * Get widget title
     */
    public function get_title()
    {
        return 'Haus Example Widget';
    }

    /**
     * Get widget icon
     */
    public function get_icon()
    {
        return 'eicon-code';
    }

    /**
     * Get widget categories
     */
    public function get_categories()
    {
        return ['haus-ecom'];
    }

    /**
     * Register widget controls
     */
    protected function register_controls()
    {
        // Content Section
        $this->start_controls_section(
            'content_section',
            [
                'label' => 'Content',
                'tab' => \Elementor\Controls_Manager::TAB_CONTENT,
            ]
        );

        $this->add_control(
            'title',
            [
                'label' => 'Title',
                'type' => \Elementor\Controls_Manager::TEXT,
                'default' => 'Hello from Haus Bridge!',
                'placeholder' => 'Enter your title',
            ]
        );

        $this->add_control(
            'description',
            [
                'label' => 'Description',
                'type' => \Elementor\Controls_Manager::TEXTAREA,
                'default' => 'This is an example widget registered by the Haus Bridge plugin.',
                'placeholder' => 'Enter your description',
                'rows' => 4,
            ]
        );

        $this->add_control(
            'show_button',
            [
                'label' => 'Show Button',
                'type' => \Elementor\Controls_Manager::SWITCHER,
                'label_on' => 'Show',
                'label_off' => 'Hide',
                'return_value' => 'yes',
                'default' => 'no',
            ]
        );

        $this->add_control(
            'button_text',
            [
                'label' => 'Button Text',
                'type' => \Elementor\Controls_Manager::TEXT,
                'default' => 'Learn More',
                'placeholder' => 'Enter button text',
                'condition' => [
                    'show_button' => 'yes',
                ],
            ]
        );

        $this->add_control(
            'button_url',
            [
                'label' => 'Button URL',
                'type' => \Elementor\Controls_Manager::URL,
                'default' => [
                    'url' => '#',
                    'is_external' => false,
                    'nofollow' => false,
                ],
                'condition' => [
                    'show_button' => 'yes',
                ],
            ]
        );

        $this->end_controls_section();

        // Layout Section
        $this->start_controls_section(
            'layout_section',
            [
                'label' => 'Layout',
                'tab' => \Elementor\Controls_Manager::TAB_CONTENT,
            ]
        );

        $this->add_control(
            'alignment',
            [
                'label' => 'Alignment',
                'type' => \Elementor\Controls_Manager::CHOOSE,
                'options' => [
                    'left' => [
                        'title' => 'Left',
                        'icon' => 'eicon-text-align-left',
                    ],
                    'center' => [
                        'title' => 'Center',
                        'icon' => 'eicon-text-align-center',
                    ],
                    'right' => [
                        'title' => 'Right',
                        'icon' => 'eicon-text-align-right',
                    ],
                ],
                'default' => 'left',
                'selectors' => [
                    '{{WRAPPER}} .haus-example-widget' => 'text-align: {{VALUE}};',
                ],
            ]
        );

        $this->add_control(
            'title_tag',
            [
                'label' => 'Title HTML Tag',
                'type' => \Elementor\Controls_Manager::SELECT,
                'default' => 'h3',
                'options' => [
                    'h1' => 'H1',
                    'h2' => 'H2',
                    'h3' => 'H3',
                    'h4' => 'H4',
                    'h5' => 'H5',
                    'h6' => 'H6',
                    'div' => 'DIV',
                    'span' => 'SPAN',
                ],
            ]
        );

        $this->end_controls_section();

        // Style Section - Title
        $this->start_controls_section(
            'style_title_section',
            [
                'label' => 'Title',
                'tab' => \Elementor\Controls_Manager::TAB_STYLE,
            ]
        );

        $this->add_control(
            'title_color',
            [
                'label' => 'Title Color',
                'type' => \Elementor\Controls_Manager::COLOR,
                'default' => '#333333',
                'selectors' => [
                    '{{WRAPPER}} .haus-example-widget h1, {{WRAPPER}} .haus-example-widget h2, {{WRAPPER}} .haus-example-widget h3, {{WRAPPER}} .haus-example-widget h4, {{WRAPPER}} .haus-example-widget h5, {{WRAPPER}} .haus-example-widget h6' => 'color: {{VALUE}};',
                ],
            ]
        );

        $this->add_group_control(
            \Elementor\Group_Control_Typography::get_type(),
            [
                'name' => 'title_typography',
                'selector' => '{{WRAPPER}} .haus-example-widget h1, {{WRAPPER}} .haus-example-widget h2, {{WRAPPER}} .haus-example-widget h3, {{WRAPPER}} .haus-example-widget h4, {{WRAPPER}} .haus-example-widget h5, {{WRAPPER}} .haus-example-widget h6',
            ]
        );

        $this->add_control(
            'title_margin',
            [
                'label' => 'Title Margin',
                'type' => \Elementor\Controls_Manager::DIMENSIONS,
                'size_units' => ['px', 'em', '%'],
                'selectors' => [
                    '{{WRAPPER}} .haus-example-widget h1, {{WRAPPER}} .haus-example-widget h2, {{WRAPPER}} .haus-example-widget h3, {{WRAPPER}} .haus-example-widget h4, {{WRAPPER}} .haus-example-widget h5, {{WRAPPER}} .haus-example-widget h6' => 'margin: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
                ],
            ]
        );

        $this->end_controls_section();

        // Style Section - Description
        $this->start_controls_section(
            'style_description_section',
            [
                'label' => 'Description',
                'tab' => \Elementor\Controls_Manager::TAB_STYLE,
            ]
        );

        $this->add_control(
            'description_color',
            [
                'label' => 'Description Color',
                'type' => \Elementor\Controls_Manager::COLOR,
                'default' => '#666666',
                'selectors' => [
                    '{{WRAPPER}} .haus-example-widget p' => 'color: {{VALUE}};',
                ],
            ]
        );

        $this->add_group_control(
            \Elementor\Group_Control_Typography::get_type(),
            [
                'name' => 'description_typography',
                'selector' => '{{WRAPPER}} .haus-example-widget p',
            ]
        );

        $this->add_control(
            'description_margin',
            [
                'label' => 'Description Margin',
                'type' => \Elementor\Controls_Manager::DIMENSIONS,
                'size_units' => ['px', 'em', '%'],
                'selectors' => [
                    '{{WRAPPER}} .haus-example-widget p' => 'margin: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
                ],
            ]
        );

        $this->end_controls_section();

        // Style Section - Button
        $this->start_controls_section(
            'style_button_section',
            [
                'label' => 'Button',
                'tab' => \Elementor\Controls_Manager::TAB_STYLE,
                'condition' => [
                    'show_button' => 'yes',
                ],
            ]
        );

        $this->start_controls_tabs('button_tabs');

        $this->start_controls_tab(
            'button_normal_tab',
            [
                'label' => 'Normal',
            ]
        );

        $this->add_control(
            'button_text_color',
            [
                'label' => 'Text Color',
                'type' => \Elementor\Controls_Manager::COLOR,
                'default' => '#ffffff',
                'selectors' => [
                    '{{WRAPPER}} .haus-example-widget .widget-button' => 'color: {{VALUE}};',
                ],
            ]
        );

        $this->add_control(
            'button_background_color',
            [
                'label' => 'Background Color',
                'type' => \Elementor\Controls_Manager::COLOR,
                'default' => '#007cba',
                'selectors' => [
                    '{{WRAPPER}} .haus-example-widget .widget-button' => 'background-color: {{VALUE}};',
                ],
            ]
        );

        $this->end_controls_tab();

        $this->start_controls_tab(
            'button_hover_tab',
            [
                'label' => 'Hover',
            ]
        );

        $this->add_control(
            'button_text_color_hover',
            [
                'label' => 'Text Color',
                'type' => \Elementor\Controls_Manager::COLOR,
                'default' => '#ffffff',
                'selectors' => [
                    '{{WRAPPER}} .haus-example-widget .widget-button:hover' => 'color: {{VALUE}};',
                ],
            ]
        );

        $this->add_control(
            'button_background_color_hover',
            [
                'label' => 'Background Color',
                'type' => \Elementor\Controls_Manager::COLOR,
                'default' => '#005a87',
                'selectors' => [
                    '{{WRAPPER}} .haus-example-widget .widget-button:hover' => 'background-color: {{VALUE}};',
                ],
            ]
        );

        $this->end_controls_tab();

        $this->end_controls_tabs();

        $this->add_group_control(
            \Elementor\Group_Control_Typography::get_type(),
            [
                'name' => 'button_typography',
                'selector' => '{{WRAPPER}} .haus-example-widget .widget-button',
            ]
        );

        $this->add_control(
            'button_padding',
            [
                'label' => 'Padding',
                'type' => \Elementor\Controls_Manager::DIMENSIONS,
                'size_units' => ['px', 'em', '%'],
                'default' => [
                    'top' => '10',
                    'right' => '20',
                    'bottom' => '10',
                    'left' => '20',
                    'unit' => 'px',
                    'isLinked' => false,
                ],
                'selectors' => [
                    '{{WRAPPER}} .haus-example-widget .widget-button' => 'padding: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
                ],
            ]
        );

        $this->add_control(
            'button_border_radius',
            [
                'label' => 'Border Radius',
                'type' => \Elementor\Controls_Manager::DIMENSIONS,
                'size_units' => ['px', '%'],
                'default' => [
                    'top' => '3',
                    'right' => '3',
                    'bottom' => '3',
                    'left' => '3',
                    'unit' => 'px',
                    'isLinked' => true,
                ],
                'selectors' => [
                    '{{WRAPPER}} .haus-example-widget .widget-button' => 'border-radius: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
                ],
            ]
        );

        $this->end_controls_section();
    }

    /**
     * Render widget output
     */
    protected function render()
    {
        $settings = $this->get_settings_for_display();
        $widget_id = 'haus_example_' . $this->get_id();

        ?>
        <div id="<?= esc_attr($widget_id) ?>" class="ecom-components-root" data-widget-type=" example-widget"
            data-title="<?= esc_attr($settings['title'] ?? 'Hello from Haus Bridge!') ?>"
            data-description="<?= esc_attr($settings['description'] ?? 'This is an example widget.') ?>"
            data-show-button="<?= $settings['show_button'] === 'yes' ? 'yes' : 'no' ?>"
            data-button-text="<?= esc_attr($settings['button_text'] ?? 'Learn More') ?>"
            data-button-url="<?= esc_attr($settings['button_url']['url'] ?? '#') ?>"
            data-alignment="<?= esc_attr($settings['alignment'] ?? 'left') ?>"
            data-title-tag="<?= esc_attr($settings['title_tag'] ?? 'h3') ?>">
        </div>
        <?php
    }

    /**
     * Render widget output in the editor
     */
    protected function content_template()
    {
        ?>
        <div class="haus-example-widget" data-widget-type="example-widget">
            <{{{ settings.title_tag }}}>{{{ settings.title }}}</{{{ settings.title_tag }}}>
            <p>{{{ settings.description }}}</p>
            <# if (settings.show_button==='yes' && settings.button_text) { #>
                <a href="{{{ settings.button_url.url }}}" class="widget-button" <# if (settings.button_url.is_external) {
                    #>target="_blank"<# } #>
                        <# if (settings.button_url.nofollow) { #>rel="nofollow"<# } #>>
                                {{{ settings.button_text }}}
                </a>
                <# } #>
        </div>
        <?php
    }
}