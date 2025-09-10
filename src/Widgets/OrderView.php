<?php
namespace Haus\StorefrontElementorBridge\Widgets;

use \Elementor\Widget_Base;

class OrderView extends Widget_Base
{

  public function get_name()
  {
    return 'OrderView';
  }

  public function get_title()
  {
    return esc_html__('Orderview', 'haus-ecom-widgets');
  }

  public function get_icon()
  {
    return 'eicon-product-info';
  }

  public function get_categories()
  {
    return ['haus-ecom'];
  }

  public function get_keywords()
  {
    return ['Ecommerce', 'order view'];
  }

  protected function render()
  {
    $url = $_SERVER['SERVER_NAME'] . $_SERVER['REQUEST_URI'];

    if (strpos($url, '&action=elmentor') !== false) {
      return;
    }
    $widget_id = 'ecom_' . $this->get_id();
    echo '<div id="' . $widget_id . '" data-vendure-token="' . VENDURE_TOKEN .'" data-vendure-api-url="' . VENDURE_API_URL .'" class="ecom-components-root" data-widget-type="order-view"></div>';
    ?>

    <?php
  }
}