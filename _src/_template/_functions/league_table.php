<?php
/**
 * League Table Class
 */
class SSSFALeagueTable extends SSScottishFaLive
{
	function __construct()
	{
		// error_log(print_r("League Table Class Constructed", true));
	}

	public function getLeagueTable(
		$data,
		$compID,
		$season,
		$forceUpdate = false
	) {
		// Get From API
		if ($forceUpdate) {
			$source = "api";
			$outputData = $this->apiLeagueTable($compID, $season, $data);
		} else {
			$source = "database";
			$outputData = unserialize($data->data_table);
		}

		// Return
		return [
			"DATA" => $outputData,
			"SOURCE" => $source,
		];
	}

	private function apiLeagueTable($compID, $season, $databaseData = null)
	{
		$url =
			parent::$baseURL .
			'/leaguetable.cfc?method=getJSON&competitionID=' .
			$compID .
			'&SeasonName=' .
			$season .
			'';
		$response = parent::queryAPI($url);

		// PARSE DATA
		$output = $response ? $response['DATA'] : null;

		$uploadData = $response ? serialize($output) : null;
		$tableData = [
			"comp_id" => $compID,
			"data_table" => $uploadData,
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

	private function dbLeagueTable($compID, $season)
	{
		global $wpdb;

		$tableName = $wpdb->prefix . "sfaApiIntegration";
		$sql = "SELECT * FROM $tableName WHERE comp_id = '$compID' AND season = '$season'";
		$data = $wpdb->get_row($sql);

		$output = $data ? $data : null;

		return $output->data_table;
	}
}
