<?php
/** 
	* @file Database logger
	* @author Max van Kampen <max.van.kampen@alicon.nl>
	*/
require_once ($_SERVER['DOCUMENT_ROOT']."/aim/v1/api/connect.php");
class log {
	function put($param) {
		$param=(object)$param;
		query("INSERT aim.his.event(path,method,step,data,tag)VALUES('".$_SERVER[SCRIPT_NAME]."','$param->method','$param->step','".(is_string($param->data)?$param->data:str_replace("'","''",stripslashes(json_encode($param->data?:''))))."','$param->tag')");
	}
	function get() {
		$res=query("SELECT TOP 500 LogDateTime,Path,Method,Step,ItemID,Data FROM aim.his.event 
		--WHERE Method<>'setAttribute' AND Method LIKE '%server.php%'
		ORDER BY logid DESC");
		$rows=[];
		while($row=fetch_object($res)) {
				if ($row->data)$row->data=json_decode($row->data);
				array_push($rows,$row);
		}
		if ($_GET['Content-Type']==html){
			
			//echo "<style>table{font-family: arial;font-size:8pt;}td{white-space:nowrap}</style><table><tr>".preg_replace('/":/',"=",(preg_replace('/{|}|"/',"",implode("</tr><tr>",array_map(function($row){return "<td>".implode("</td><td>",(array)$row)."</td>";},(array)$rows)))))."</tr></table>";
			echo "<style>body{background-color:black;color:white;;}table{font-family: monospace;font-size:10pt;}td{white-space:nowrap;padding:0 5px;}</style><table>";
			foreach($rows as $row){
				$style="";
				if (strstr($row->Method,'server.php')) $style.="color:orange;";
				else if (strstr($row->Path,'acsm')) $style.="color:lightgreen;";
				else if ($row->Method==setAttribute && !strstr($row->Data,'Value')) $style.="color:yellow;";
				echo"<tr style='$style'><td><small>$row->LogDateTime</small></td><td>$row->Path $row->ItemID $row->Method $row->Step</td><td>". htmlspecialchars($row->Data)."</td></tr>";
			}
			echo "</table>";
			die();
		}
		die(json_encode($rows,JSON_PRETTY_PRINT));
	}
	function delete() {
    query("delete aim.his.event");
    die(json_encode('DSM Log deleted'));
	}
}
?>