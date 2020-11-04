<?php
/**
 * Comp Info Class
 */
class SSSFACompInfo extends SSScottishFaLive
{
	function __construct()
	{
		// error_log(print_r("League Table Class Constructed", true));
	}

	public function getCompInfo(
		$data,
		$compID,
		$season,
		$forceUpdate = false
	) {
		// Get From API
		if ($forceUpdate) {
			$source = "api";
			$outputData = $this->apiCompInfo($compID, $season, $data);
		} else {
			$source = "database";
			$outputData = unserialize($data->comp_info);
		}

		// Return
		return [
			"DATA" => $outputData,
			"SOURCE" => $source,
		];
	}

	private function apiCompInfo($compID, $season, $databaseData = null)
	{
		$url = parent::$baseURL . '/competition.cfc?method=getJSON&competitionID=' . $compID;
		$response = parent::queryAPI($url);

		// PARSE DATA
		$output = $response ? $response['DATA'][0] : null;

		$uploadData = $response ? serialize($output) : null;
		$tableData = [
			"comp_id" => $compID,
			"comp_info" => $uploadData,
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
				["%d", "%s", "%s"]
			)
			: $wpdb->insert($tableName, $tableData, ["%d", "%s", "%s","%s"]);

		return $output;
	}

	private function dbCompInfo($compID, $season)
	{
		global $wpdb;

		$tableName = $wpdb->prefix . "sfaApiIntegration";
		$sql = "SELECT * FROM $tableName WHERE comp_id = '$compID' AND season = '$season'";
		$data = $wpdb->get_row($sql);

		$output = $data ? $data : null;

		return $output->comp_info;
	}
}

