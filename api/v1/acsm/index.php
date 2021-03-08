<?php
header('Access-Control-Allow-Origin: '.$_SERVER[HTTP_ORIGIN]);
require_once ("config.php");
require_once ($_SERVER[DOCUMENT_ROOT]."/aim/v1/api/log.php");
$get=(object)$_GET;

//    if($get->operation==setLocation){
//        $get=(object)$_GET;
//        file_put_contents('LocalMonitoringWebservice.wsdl',str_replace('localhost',$get->location,file_get_contents('LocalMonitoringWebserviceTemplate.wsdl')));
//    }
//    die();
//}

class AcsmSoapClient extends SoapClient {
  function __doRequest($request,$location,$action,$version) {
		log::put([method=>'acsmSoapClient',step=>'input',data=>$request]);
    $request=str_replace('env:Envelope','soap:Envelope',$request);
		log::put([method=>'acsmSoapClient',step=>'output',data=>$request]);
    return parent::__doRequest($request,$location,$action,$version);
  }
}

class acsm {
  function put($input=null) {
    $config=json_decode(file_get_contents("Subscribe.json"));
    log::put([method=>'acsm.put',step=>'input',data=>[input=>$input,config=>$config]]);
    if($config->Active) {
			//return (json_encode($input));
			$input=$input?json_encode($input):file_get_contents('php://input');
      $input=json_decode($input,true);
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
        array_walk($input[WebLogItemArray],function(&$val){array_walk($val,function(&$val,$key){$val="<$key>$val</$key>";});$val='<WebLogItem>'.implode("",$val).'</WebLogItem>';});
        $input_xml='<WebLogItemArray xmlns="http://www.imtech.eu/">'.implode("",$input[WebLogItemArray]).'</WebLogItemArray>';

				header('Content-Type: application/soap+xml; charset=utf-8');
				header('Content-Length: '.strlen($input_xml));

        log::put([method=>'acsm.put',step=>'connect',data=>[xml=>$input_xml,options=>$options]]);
				if ($GLOBALS[acsmsoapclient]) {
					$client = new AcsmSoapClient( null, $options);
        //log::put([method=>'acsm.put',step=>'ReportChanges']);
					$response->response = $client->ReportChanges(new SoapVar($input_xml, XSD_ANYXML));
				} 
				else {
	        $client = new SoapClient( null, $options);
				}
        $response->response = $client->ReportChanges($input_xml);
        log::put([method=>'acsm.put',step=>'response',data=>$response]);
      } 
      catch ( SoapFault $sf ) {
				if (!strstr($f[faultstring],"Fetching")) {
					//$config->Active=false;
					//file_put_contents("Subscribe.json",stripslashes(json_encode($config,JSON_PRETTY_PRINT)));
				}
        $response->AcsmSoapFault=$sf;
        log::put([method=>'acsm.put',step=>'fault',data=>[AcsmSoapFault=>$sf,headers=>getallheaders()]]);
      }
    }
		$response->Active=$config->Active;
		return $response;
  }
}

class weblog {
  function put($input=null) {
		//die(aaa);
    $input=$input?:json_decode(file_get_contents('php://input'));
    log::put([method=>'weblog/put',step=>'input',data=>$input]);
    $values=array();
    foreach($input->WebLogItemArray as $i => $WebLogItem){
		$columns=implode(",",array_keys((array)$WebLogItem));
		$q="INSERT acsm.dbo.WebLogItem ($columns)VALUES('".implode("','",array_values((array)$WebLogItem))."');
		--SELECT * FROM acsm.dbo.WebLogItem WHERE LogID=@@IDENTITY;
		SELECT LogID,LocationID,GroupID,SystemInstanceID,TagID,LogType,TextualValue,NumericValue,CONVERT(VARCHAR(50),CAST(TimeStamp AS DATETIMEOFFSET),127)TimeStamp,Quality,StandardOutput 
		--SELECT LogID,CONVERT(VARCHAR(50),CAST(TimeStamp AS DATETIMEOFFSET),127)TimeStamp,$columns 
		FROM acsm.dbo.WebLogItem WHERE LogID=@@IDENTITY;
		";

        $row=fetch_object(query($q)); 

									//SELECT SystemInstanceID,GroupID,LocationID,TagID,LogType,TextualValue,NumericValue,CONVERT(VARCHAR(50),CAST(TimeStamp AS DATETIMEOFFSET),127)TimeStamp,Quality,StandardOutput FROM acsm.dbo.WebLogItem WHERE LogID=@@IDENTITY;"));



        array_push($values,$row);
    }
		query("DELETE acsm.dbo.weblogitem where datediff (day,timestamp,getutcdate())>20;"); 
		//$response->AddWebLogItem=Done;
		//acsm::put([WebLogItemArray=>$values]);
    die(json_encode(acsm::put([WebLogItemArray=>$values]),JSON_PRETTY_PRINT));
  }
  function get() {
    //$res=query($q="SELECT TagID id,CONVERT(VARCHAR(50),CAST(TimeStamp AS DATETIMEOFFSET),127) modifiedDT,TextualValue,NumericValue,StandardOutput,Quality FROM acsm.dbo.WebLogItem WHERE TagID>0 AND ".$_GET[filter]." ORDER BY logID DESC");
    $res=query($q="SELECT TOP 10000 CONVERT(VARCHAR(50),CAST(LogDateTime AS DATETIMEOFFSET),127)modifiedDT,id,Value FROM aimhis.om.event 
WHERE Value IS NOT NULL AND id > 0 AND method='setAttribute' AND
".$_GET[filter]." ORDER BY logID DESC");
    $rows=array();
    while($row=fetch_object($res)) array_push($rows,array_merge((array)$row,array_shift(json_decode($row->Value,true))));
    die(json_encode($rows));
  }
}

$method=strtolower($_SERVER[REQUEST_METHOD]);
foreach ($_GET as $name=>$value) if (method_exists($name,$method)) die(json_encode($name::$method()));
?>