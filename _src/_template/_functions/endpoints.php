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
		$season = "2020";

		$cxn = new SSSFALeagueTable();
		$table = $cxn->getLeagueTable($compID, $season);
		// $table = $cxn->getLeagueTable($compID, $season);
		// $table = $cxn->getLeagueTable($compID, $season);

		$output = json_encode([
			"table" => $table,
			"fixtures" => [],
			"results" => [],
		]);

		return rest_ensure_response( $output );
		die();
	} catch (Exception $e) {
		error_log(print_r($e->getMessage(), true));
		return rest_ensure_response( "Action Failed" );
		die();
	}	
}

add_action( 'rest_api_init', function(){
	register_rest_route( 'sfalive/v1', 'compdata/(?P<id>[\d]+)', $args = array(
		'methods' 	=> WP_REST_Server::READABLE,
		'callback' 	=> 'sssfa_getCompData',
		// 'args' 		=> sssfa_leagueTableArgs()
	) );
});