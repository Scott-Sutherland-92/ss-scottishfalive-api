<?php
/**
 * Results Class
 */
class SSSFAResults extends SSScottishFaLive
{
	function __construct()
	{
		// error_log(print_r("Results Class Constructed", true));
	}

	public function getResults(
		$data,
		$compID,
		$season,
		$forceUpdate = false
	) {
		// Get From API
		if ($forceUpdate) {
			$source = "api";
			$outputData = $this->apiResults($compID, $season, $data);
		} else {
			$source = "database";
			$outputData = unserialize($data->data_results);
		}

		// Return
		return [
			"DATA" => $outputData,
			"SOURCE" => $source,
		];
	}

	private function apiResults($compID, $season, $databaseData = null)
	{
		$today = date('F, j Y');
		$today = preg_replace('~\s~', '%20', $today);

		$url =
			parent::$baseURL .
			'/match.cfc?method=getJSON&competitionID=' .
			$compID .
			'&orderbyValues=MatchDate%20ASC&DateTo=' .
			$today .
			'&SeasonName=' .
			$season .
			'&incPostponed=1&incCancelled=1';
		$response = parent::queryAPI($url);

		// PARSE DATA
		$output = $response ? $response['DATA'] : null;

		$uploadData = $response ? serialize($output) : null;
		$tableData = [
			"comp_id" => $compID,
			"data_results" => $uploadData,
			"last_updated" => date('Y-m-d H:i:s'),
			"season" => $season,
		];

		// SAVE TO DB
		global $wpdb;
		$tableName = $wpdb->prefix . "sfaApiIntegration";
		$databaseData
			? $wpdb->update(
				$tableName,
				$tableData,
				["id" => $databaseData->id],
				["%d", "%s", "%s","%s"]
			)
			: $wpdb->insert($tableName, $tableData, ["%d", "%s", "%s","%s"]);

		return $output;
	}

	private function dbResults($compID, $season)
	{
		global $wpdb;

		$tableName = $wpdb->prefix . "sfaApiIntegration";
		$sql = "SELECT * FROM $tableName WHERE comp_id = '$compID' AND season = '$season'";
		$data = $wpdb->get_row($sql);

		$output = $data ? $data : null;

		return $output->data_results;
	}
	
}