<?php
/**
 * Plugin Name: SS Plugin Template
 * Description: Template Plugin Structure - No Functionality.
 * Author: Scott Sutherland
 */

// Activation Code
register_activation_hook( __FILE__, 'SSPluginTemplate_activate_plugin' );
function SSPluginTemplate_activate_plugin()
{
	error_log(print_r("Activated Plugin", true));
}

// Deactivation Code
register_deactivation_hook( __FILE__, 'SSPluginTemplate_deactivate_plugin' );
function SSPluginTemplate_deactivate_plugin()
{
	error_log(print_r("Deactivated Plugin", true));
}

if (!class_exists('SSPluginTemplate')) {
	/**
	 * SS Popup Plugin Class
	 */
	class SSPluginTemplate
	{
		private static $instance;

		function __construct()
		{
			add_action( 'wp_enqueue_scripts', array($this, 'setScriptsAndStyles'), 10, 1 );
			add_shortcode( 'ss-popup', array($this, 'addShortcode') );
		}

		public static function get_instance()
		{
			if ( null == self::$instance ) {
				self::$instance = new SSPluginTemplate();
			}

			return self::$instance;
		}

		public function addShortcode()
		{
			return '<div id="SSPluginTemplate-init"></div>';
		}

		public static function setScriptsAndStyles()
		{
			$plugin_url = plugin_dir_url( __FILE__ );
			wp_enqueue_style( 'SSPluginTemplate-style', $plugin_url . '/style.css', array( ), false, 'all' );
			wp_enqueue_script( 'SSPluginTemplate-script', $plugin_url . '_includes/js/ss-plugin-template.js', array() , false, true );
		}
	}
	add_action( 'plugins_loaded', array( 'SSPluginTemplate', 'get_instance' ));
} 