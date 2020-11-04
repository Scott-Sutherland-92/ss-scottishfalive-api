<?php
/**
 * Plugin Name: SS Scottish FA Live - API Integration
 * Description: Connect with Scottish FA Live System and Display Data.
 * Author: Scott Sutherland
 * Author URI: https://we-shape.co.uk
 * Requires PHP: 7.2
 */

// Activation Code
register_activation_hook( __FILE__, 'SSScottishFaLive_activate_plugin' );
function SSScottishFaLive_activate_plugin()
{
	error_log(print_r("Activated Scottish FA Live Plugin", true)); 
}

// Deactivation Code
register_deactivation_hook( __FILE__, 'SSScottishFaLive_deactivate_plugin' );
function SSScottishFaLive_deactivate_plugin()
{
	error_log(print_r("Deactivated Scottish FA Live Plugin", true));
}

if (!class_exists('SSScottishFaLive')) {
	/**
	 * SS Popup Plugin Class
	 */
	class SSScottishFaLive
	{
		private static $instance;
		private $version = "0.0.10";

		// API KEYS
		protected static $clientID = "645071006";
		protected static $clientKey = "2E5312231BAFB96528924F2C7F249DE1";
		protected static $baseURL = "https://api.scottishfalive.co.uk/resources/api/v1/swf";

		function __construct()
		{
			add_action( "init", [$this, "checkDBForUpdate"]);
			add_action( 'wp_enqueue_scripts', array($this, 'setScriptsAndStyles'), 10, 1 );
		}

		/**
		 * Check DB For Updates
		 */
		public function checkDBForUpdate()
		{
			$version = $this->version;
			$liveVersion = get_option('sfa_apiIntegration_version', false);

			if ($liveVersion != $version) {
				global $wpdb;
				$tableName = $wpdb->prefix . 'sfaApiIntegration';

				$charsetCollate = $wpdb->get_charset_collate();

				$mainTableSql = "CREATE TABLE $tableName (
					id mediumint(9) NOT NULL AUTO_INCREMENT,
					comp_id int(5) NOT NULL,
					season varchar(255) NOT NULL,
					comp_info longtext NULL,
					data_fixtures longtext NULL,
					data_results longtext NULL,
					data_table longtext NULL,
					last_updated TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
					PRIMARY KEY  (id)
				) $charsetCollate;";

				require_once ABSPATH . 'wp-admin/includes/upgrade.php';
				dbDelta($mainTableSql);

				update_option(
					'sfa_apiIntegration_version',
					$version,
					null
				);
			}
		}

		/**
		 * Query SFA Live API
		 * @param  string $url URL String
		 * @return object      API Response
		 */
		protected static function queryAPI($url)
		{
			$curl = curl_init();
			curl_setopt_array($curl, array(
				CURLOPT_URL => $url,
				CURLOPT_RETURNTRANSFER => true,
				CURLOPT_TIMEOUT => 30,
				CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
				CURLOPT_CUSTOMREQUEST => "GET",
				CURLOPT_HTTPHEADER => array(
					"cache-control: no-cache",
					"ClientID: " . self::$clientID,
					"ClientKey: " . self::$clientKey
				),
			));

			$response = curl_exec($curl);
			$err = curl_error($curl);

			curl_close($curl);

			$response = json_decode($response, true);

			return $response;
		}

		/**
		 * Check DB For Outdated Data 
		 */
		public static function checkDataForTimeDiff($data)
		{
			$timeNow = time();
			$lastUpdated = strtotime($data->last_updated);
			$timeDiff = $timeNow - $lastUpdated;

			$output = ($timeDiff > 3600) ? true : false;

			return $output;
		}

		public function getDatabaseData($compID, $season) {
			global $wpdb;

			$tableName = $wpdb->prefix . "sfaApiIntegration";
			$sql = "SELECT * FROM $tableName WHERE comp_id = '$compID' AND season = '$season'";
			$data = $wpdb->get_row($sql);

			$output = $data ? $data : null;

			return $output;
		}

		public static function get_instance()
		{
			if ( null == self::$instance ) {
				self::$instance = new SSScottishFaLive();
			}

			return self::$instance;
		}

		public function setScriptsAndStyles()
		{
			$plugin_url = plugin_dir_url( __FILE__ );
			wp_enqueue_style( 'SSScottishFaLive-style', $plugin_url . 'style.css', [], false, 'all' );

			// Enqueue Scripts
			$plugin_path = plugin_dir_path( __FILE__ );
			$dirJS = new DirectoryIterator($plugin_path . '_includes/js');

			foreach ($dirJS as $file) {
				if (pathinfo($file, PATHINFO_EXTENSION) === 'js') :
					$fullName = basename($file);
					$name = substr(basename($fullName), 0, strpos(basename($fullName), '.'));
					$handle = uniqid($name);
					wp_enqueue_script( $handle, $plugin_url . '_includes/js/' . $fullName, array() , null, true );
					wp_localize_script( 'sssfaliveapi', 'ajaxsfalive', array('ajaxurl' => admin_url( 'admin-ajax.php' )) );
				endif;
			}
		}
	}
	add_action( 'plugins_loaded', ['SSScottishFaLive', 'get_instance']);

	require '_functions/endpoints.php';
	require '_functions/comp_info.php';
	require '_functions/fixtures.php';
	require '_functions/results.php';
	require '_functions/league_table.php';

} 