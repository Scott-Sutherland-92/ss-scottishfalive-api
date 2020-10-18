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

	protected static function leagueTableTest()
	{
		error_log(print_r("League Table Test", true));
	}

	public function getLeagueTable($compID, $season, $forceUpdate = false)
	{
		// Check DB
		$databaseData = $this->dbLeagueTable($compID);

		// Get From API
		if ($databaseData) {
			$timeNow = time();
			$lastUpdated = strtotime($databaseData->last_updated);
			$timeDiff = $timeNow - $lastUpdated;

			if ($timeDiff > 3600 || $forceUpdate) {
				$outputData = $this->apiLeagueTable($compID, $season, $databaseData);
			} else {
				$outputData = unserialize($databaseData->data_table);
			}
		} else {
			$outputData = $this->apiLeagueTable($compID, $season);
		}

		// Return
		return $outputData;
	}

	private function apiLeagueTable($compID, $season, $databaseData = null)
	{
		$url = 'https://api.scottishfalive.co.uk/resources/api/v1/swf/leaguetable.cfc?method=getJSON&competitionID=' . $compID . '&SeasonName=' . $season . '';
		$response = parent::queryAPI($url);

		// PARSE DATA
		$output = $response['DATA'];

		$uploadData = serialize($output);
		$tableData = [
			"comp_id" => $compID,
			"data_table" => $uploadData,
			"last_updated" => date('Y-m-d H:i:s'),
		];

		// SAVE TO DB
		global $wpdb;
		$tableName = $wpdb->prefix . "sfaApiIntegration";
		$databaseData
			? $wpdb->update(
				$tableName,
				$tableData,
				["comp_id" => $compID],
				["%d", "%s", "%s"]
			)
			: $wpdb->insert($tableName, $tableData, ["%d", "%s", "%s"]);

		return $output;
	}

	private function dbLeagueTable($compID)
	{
		global $wpdb;

		$tableName = $wpdb->prefix . "sfaApiIntegration";
		$sql = "SELECT * FROM $tableName WHERE comp_id = '$compID'";
		$data = $wpdb->get_row($sql);

		$output = $data ? $data : null;

		return $output;
	}
}

