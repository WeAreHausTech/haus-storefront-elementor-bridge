<?php
namespace Haus\StorefrontElementorBridge\Widgets;

class Login extends \Elementor\Widget_Base
{
  public function get_name()
  {
    return 'Login';
  }

  public function get_title()
  {
    return esc_html__('Login', 'haus-ecom-widgets');
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
    return ['Ecommerce', 'login'];
  }

  protected function render()
  {
    $url = $_SERVER['SERVER_NAME'] . $_SERVER['REQUEST_URI'];
    if (strpos($url, '&action=elementor') !== false) {

      return;
    }
    $widget_id = 'ecom_' . $this->get_id();
    ?>
    <div id="<?= $widget_id ?>" class="ecom-components-root" data-vendure-api-url="<?= VENDURE_API_URL ?>"
      data-vendure-token="<?= VENDURE_TOKEN ?>" data-widget-type="login">
    </div>
    <?php
  }
}