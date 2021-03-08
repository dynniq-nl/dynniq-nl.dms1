<?php
header('Access-Control-Allow-Origin: '.$_SERVER[HTTP_ORIGIN]);
require_once ("config.php");
require_once ($_SERVER[DOCUMENT_ROOT]."/aim/v1/api/log.php");
$headers=getallheaders();
log::put([method=>'',step=>'input',data=>[Accept=>$headers[Accept],ContentType=>$headers["Content-Type"]]]);
//if ($headers["Content-Type"]==="application/soap+xml; charset=utf-8") {
//  $config=json_decode(file_get_contents("Subscribe.json"));
//  $GetSubscriptionStateResult=$config->Active?"true":"false";
//  if(strstr($input,"StopSubscription"))$requestName="StopSubscription";
//  else if(strstr($input,"GetSubscriptionState"))$requestName="GetSubscriptionState";
//  if ($requestName) {
//    $reply=[
//      StopSubscription=>"<StopSubscriptionResponse />",
//      GetSubscriptionState=>"<GetSubscriptionResponse><GetSubscriptionStateResult>$GetSubscriptionStateResult</GetSubscriptionStateResult></GetSubscriptionResponse>"
//    ];
//    $reply = 
//      '<soap12:Envelope xmlns:soap12="http://www.w3.org/2003/05/soap-envelope" xmlns:env="http://www.w3.org/2003/05/soap-envelope" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><soap12:Body>'
//      .$reply[$requestName]
//      .'</soap12:Body></soap12:Envelope>'
//    ;
//    log::put([method=>'',step=>'catch_soap_http_request',data=>[header=>getallheaders(),get=>$_GET,post=>$_POST,server=>$_SERVER]]);
//    header('Content-type: application/soap+xml; charset=utf-8');
//    die($reply[$requestName]);
//  }
//}
class LocalMonitoring { 
	public function Subscribe($params) {
		log::put([method=>'LocalMonitoring.Subscribe',step=>'input',data=>[params=>$params]]);
		$params->Active=true;
		file_put_contents("Subscribe.json",json_encode($params,JSON_PRETTY_PRINT));
		$params=(object)$params;
		return;
		////return "SELECT LogID,SystemInstanceID,GroupID,LocationID,TagID,LogType,TextualValue,NumericValue,CONVERT(VARCHAR(50),CAST([TimeStamp] AS DATETIMEOFFSET),127)[TimeStamp],Quality,StandardOutput FROM acsm.dbo.WebLogItem WHERE TimeStamp>=".$params->StartDate;
		////$q="SELECT TOP 2 LogID,SystemInstanceID,GroupID,LocationID,TagID,LogType,TextualValue,NumericValue,CONVERT(VARCHAR(50),CAST([TimeStamp] AS DATETIMEOFFSET),127)[TimeStamp],Quality,StandardOutput FROM acsm.dbo.WebLogItem";
		//$q="SELECT top 10 LogID,SystemInstanceID,GroupID,LocationID,TagID,LogType,TextualValue,NumericValue,CONVERT(VARCHAR(50),CAST([TimeStamp] AS DATETIMEOFFSET),127)[TimeStamp],Quality,StandardOutput FROM acsm.dbo.WebLogItem WHERE TimeStamp>='$params->StartDate' AND TimeStamp<='$params->EndDate'";
		//$res=query($q);
		//$response->WebLogItemArray=[];
		//while($row=fetch_object($res)) array_push($response->WebLogItemArray,$row);
		//require_once ("index.php");
		//return acsm::put($response);
	} 
	public function StopSubscription( $params=null ) {
		log::put([method=>'LocalMonitoring.StopSubscription',step=>'input',data=>[params=>$params]]);
		$config=json_decode(file_get_contents("Subscribe.json"));
		$config->Active=False;
		file_put_contents("Subscribe.json",stripslashes(json_encode($config,JSON_PRETTY_PRINT)));
		return;
	}
	public function GetSubscriptionState( $params=null ) {
		log::put([method=>'LocalMonitoring.GetSubscriptionState',step=>'input',data=>[params=>$params]]);
		$config=json_decode(file_get_contents("Subscribe.json"));
		$returnValue = [GetSubscriptionStateResult=>$config->Active?"true":"false"];
		return $returnValue;
	}
} 
class DmsSoapServer extends SoapServer {
  public function handle($request = null) {
    if ($request === null) $request = file_get_contents('php://input');
		log::put([method=>'dmsSoapServer',step=>'input',data=>$request]);
    ob_start();
    $result = parent::handle($request);
		log::put([method=>'dmsSoapServer',step=>'output',data=>ob_get_contents()]);
    ob_flush();
    return $result;
  }
}
ini_set( "soap.wsdl_cache_enabled", 0 );
ini_set( 'soap.wsdl_cache_ttl', 0 );
$server = $wsdl
	? new DmsSoapServer( "LocalMonitoringWebservice.wsdl", array('soap_version' => SOAP_1_2, 'features' => SOAP_SINGLE_ELEMENT_ARRAYS) )
	: new DmsSoapServer( null, ['uri' => "http://$host:30070/MonitoringSystemWebservice/LocalMonitoringWebservice.asmx", 'soap_version' => SOAP_1_2 ] );
$server->setClass('LocalMonitoring'); 
$server->handle();
?>