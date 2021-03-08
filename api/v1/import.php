<?php
	//header("Content-type: text/xml");
	//$xml = file_get_contents(__DIR__."/../../app/system/dms/lib/js/cfg/A2_generic_configuration_010.xml");

    //$f=file_get_contents($_FILES["file"]["tmp_name"]);
	//$xml = simplexml_load_file($_FILES["file"]["tmp_name"]);

	require_once ($_SERVER['DOCUMENT_ROOT']."/aim/v1/api/connect.php");
	$hostID = 2817404;

	
	$i=0;
	$xml = simplexml_load_file(__DIR__."/../xml/A2_generic_configuration_010.xml");
	foreach ($xml->children() as $classGroupName=>$class) {
		echo PHP_EOL."-- ============ ".$classGroupName;
		foreach ($class->children() as $className=>$item) {
			$className=dms_.$className;
			$q=null;
			foreach ($item->children() as $attributeName=>$value) {
				if(!$q)$q=PHP_EOL.";DECLARE @id INT\r\n;EXEC api.getItem @id=@id OUTPUT,@hostID=$hostID,@class='$className',@tag='$value'";
				if($value=="NULL")continue;
				if($value=="-")continue;
				$q.=PHP_EOL.";EXEC api.setAttribute @id=@id,@name='$attributeName',@value='$value'";

				if($className==dms_Tag && $attributeName==intSystemID)$q.=",@class='dms_System',@tag='$value',@idname='masterID'";
				if($className==dms_ModbusTCPRange && $attributeName==intSystemID)$q.=",@class='dms_System',@tag='$value',@idname='masterID'";
				if($className==dms_SNMPItem && $attributeName==intSystemID)$q.=",@class='dms_System',@tag='$value',@idname='masterID'";

				if($className==dms_tblSetPointAlarm && $attributeName==intSourceTagID)$q.=",@class='dms_Tag',@tag='$value'";
				if($className==dms_tblSetPointAlarm && $attributeName==intDestinationTagID)$q.=",@class='dms_Tag',@tag='$value'";
			}
			echo $q;
			query($q);
			//if($i++>5) die();
		}
	}
	//die();



	$i=0;
	$xml = simplexml_load_file(__DIR__."/../xml/A2_specific_configuration_010.xml");
	foreach ($xml->children() as $classGroupName=>$class) {
		echo PHP_EOL."-- ============ ".$classGroupName;
		foreach ($class->children() as $className=>$item) {
			$className=dms_.$className;
			$q=null;
			foreach ($item->children() as $attributeName=>$value) {
				if(!$q)$q=PHP_EOL.";DECLARE @id INT\r\n;EXEC api.getItem @id=@id OUTPUT,@hostID=$hostID,@class='$className',@tag='$value'";
				if($value=="NULL")continue;
				if($value=="-")continue;
				$q.=PHP_EOL.";EXEC api.setAttribute @id=@id,@name='$attributeName',@value='$value'";

				if($className==dms_Group && $attributeName==intLocationID)$q.=",@class='dms_Location',@tag='$value',@idname='masterID'";
				if($className==dms_Group && $attributeName==intParentID)$q.=",@class='dms_Group',@tag='$value',@idname='masterID'";

				if($className==dms_SystemInstance && $attributeName==intGroupID)$q.=",@class='dms_Group',@tag='$value',@idname='masterID'";
				if($className==dms_SystemInstance && $attributeName==intsystemID)$q.=",@class='dms_System',@tag='$value'";
				if($className==dms_SystemInstance && $attributeName==intPlaceID)$q.=",@class='dms_Place',@tag='$value'";
				if($className==dms_SystemInstance && $attributeName==intModbusTCPDeviceID)$q.=",@class='dms_ModbusTCPDevice',@tag='$value'";
				if($className==dms_SystemInstance && $attributeName==intSNMPDeviceID)$q.=",@class='dms_SNMPDevice',@tag='$value'";
				
			}
			echo $q;
			query($q);
			//if($i++>3) die();
		}
	}
	//die();
?>