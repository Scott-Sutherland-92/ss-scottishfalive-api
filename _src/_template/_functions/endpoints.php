<?php
/**
 * Endpoints
 */

function sssfa_getCompData( $request )
{
	$input = @file_get_contents('php://input');
	$event_json = json_decode($input, true);

	try {
		$compID = (int) $request["id"];
		$season = ($request["season"]) ? (int) $request["season"] : "2020";

		$genericCxn = new SSScottishFaLive();

		$compInfo = new SSSFACompInfo();
		$leagueTable = new SSSFALeagueTable();
		$fixtures = new SSSFAFixtures();
		$results = new SSSFAResults();

		$data = $genericCxn->getDatabaseData($compID, $season);
		$update = true;

		if ($data) {
			$update = $genericCxn->checkDataForTimeDiff($data);
			
			$update = ($data->comp_info) ? $update : true;
			$update = ($data->data_table) ? $update : true;
			$update = ($data->data_fixtures) ? $update : true;
			$update = ($data->data_results) ? $update : true;
		} else {
			global $wpdb;
			$tableName = $wpdb->prefix . "sfaApiIntegration";
			$tableData = [
				"comp_id" => $compID,
				"last_updated" => date('Y-m-d H:i:s'),
				"season" => $season,
			];
			$wpdb->insert($tableName, $tableData, ["%d", "%s", "%d"]);

			$data = $genericCxn->getDatabaseData($compID, $season);
		}

		$update = ( $request["update"] ) ? true : $update;

		$compInfo_data = $compInfo->getCompInfo($data, $compID, $season, $update);
		$leagueTable_data = $leagueTable->getLeagueTable($data, $compID, $season, $update);
		$fixtures_data = $fixtures->getFixtures($data, $compID, $season, $update);
		$results_data = $results->getResults($data, $compID, $season, $update);

		$output = [
			"info" => $compInfo_data,
			"table" => $leagueTable_data, 
			"fixtures" => $fixtures_data,
			"results" => $results_data,
		];

		return rest_ensure_response( $output );
		die();
	} catch (Exception $e) {
		error_log(print_r($e->getMessage(), true));
		return rest_ensure_response( "Action Failed" );
		die();
	}	
}

add_action( 'rest_api_init', function(){
	// register_rest_route( 'sfalive/v1', 'compdata/(?P<id>[\d]+)', $args = array(
	// 	'methods' 	=> WP_REST_Server::READABLE,
	// 	'callback' 	=> 'sssfa_getCompData',
	// 	// 'args' 		=> sssfa_leagueTableArgs()
	// ) );

	register_rest_route( 'sfalive/v1', 'compdata/(?P<id>[\d]+)(?:/(?P<season>\d+))?', $args = array(
		'methods' 	=> WP_REST_Server::READABLE,
		'callback' 	=> 'sssfa_getCompData',
		'args' 		=> [
			"season","update"
		]
	) );
});