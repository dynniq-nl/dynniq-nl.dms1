<?php
/** 
	* Soap file
	* @file SOAP client van ACSM SOAP Server. Verstuurd een JSON data upload als XML naar de SOAP server.
	* @author Max van Kampen <max.van.kampen@alicon.nl>
	*/
header('Access-Control-Allow-Origin: '.$_SERVER[HTTP_ORIGIN]);
require_once ("log.php");
/** 
	* AcsmSoapClient is een extended class van de SoapClient 
	* Deze is nodig voor het aanpassen van de standaard soap env:Envelop naar de soap:Envelop
	* @class 
	* @author Max van Kampen <max.van.kampen@alicon.nl>
	*/
class AcsmSoapClient extends SoapClient {
	function __doRequest($request,$location,$action,$version) {
		$request=str_replace('env:Envelope','soap:Envelope',$request);
		return parent::__doRequest($request,$location,$action,$version);
	}
}

$input = file_get_contents('php://input'); // JSON data object als string
$input = json_decode($input,true);
$config=json_decode(file_get_contents("Subscribe.json"));
try {
	$options=[
		'location' 					=> $config->ReportURL, 
		//'uri' 							=> 'http://172.26.90.25:30070/sites/dms/api/v1/SoapClientAcsm.php', 
		'uri' 							=> 'http://'.$_SERVER[HTTP_HOST].$_SERVER[URL],
		'soap_version' 			=> SOAP_1_2,
		'trace'							=> DEBUG_SOAP,
		'features'					=> SOAP_SINGLE_ELEMENT_ARRAYS,
		//'exceptions'				=> true,
		//'connection'				=> 'keep-alive',
		//'keep-alive'				=> true,
		//'cache_wsdl'				=> WSDL_CACHE_NONE,
		'connection_timeout'=>10
	];
	/** 
		* Onderstaande client is nodig in productie omgeving en werkt met de ACSM SOAP Server
		* Het aanroepen van een functie op de ACSM SOAP server werkt niet. 
		* Dit lukt alleen met een zelf opgebouwde XML string en een SoapVar
		* Opbouwen XML string is gebaseerd op ontvangen input object, Deze functionaliteit is specifiek voor een WebLogItemArray gemaakt.
		* @author Max van Kampen <max.van.kampen@alicon.nl>
		*/
	array_walk($input[WebLogItemArray],function(&$val){array_walk($val,function(&$val,$key){$val="<$key>$val</$key>";});$val='<WebLogItem>'.implode("",$val).'</WebLogItem>';});
	$input_xml='<WebLogItemArray xmlns="http://www.imtech.eu/">'.implode("",$input[WebLogItemArray]).'</WebLogItemArray>';
	dmslog ('SoapClientAcsm.php','input',$input_xml);


	//$client = new AcsmSoapClient( null, $options);
	//$response = $client->ReportChanges(new SoapVar($input_xml, XSD_ANYXML));

	/** 
		* Onderstaande client is nodig voor testen. Is een standaard SOAP client
		* we versturen wel de zelf opgebouwde XML welke ook naar de ACSM SOAP Server gaat.
		* @author Max van Kampen <max.van.kampen@alicon.nl>
		*/
	$client = new SoapClient( null, $options);
	$response = $client->ReportChanges($input_xml);
	dmslog ('SoapClientAcsm.php','response',$response);

} 
catch ( SoapFault $sf ) {
	$response=[AcsmSoapFault=>$sf];
}
die(json_encode($response));
?>
