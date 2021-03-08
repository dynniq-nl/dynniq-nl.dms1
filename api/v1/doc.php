<?php
require_once ($_SERVER['DOCUMENT_ROOT']."/aim/v1/api/connect.php");
$get=(object)$_GET;
$res=query("
	SET NOCOUNT ON;DECLARE @id INT;SET @id=$get->rootID

	DECLARE @T TABLE (id INT)
	;WITH P (level,id) AS (  
		SELECT 0,@id
	UNION ALL 
		SELECT level+1,I.id
		FROM P INNER JOIN api.items I ON I.masterId = P.id and level<20 
	)  
	INSERT @T SELECT id FROM P
	INSERT @T 
	SELECT DISTINCT A.itemID FROM @T T INNER JOIN om.attributes A ON A.id=T.id AND A.itemID IS NOT NULL WHERE A.itemID NOT IN (SELECT id FROM @T)
	SET NOCOUNT OFF
	SELECT I.class,I.id,I.tag 
	FROM @T T 
	INNER JOIN api.citems I ON I.id=T.id
	SELECT A.id,A.name,A.value,A.itemID FROM @T T INNER JOIN api.attributes A ON A.id=T.id
");
while($row=fetch_object($res)) {$items->{$row->id}=$class->{$row->class}->{$row->id}=cleanrow($row);}
if(next_result($res)) while($row=fetch_object($res)) {$items->{$row->id}->values->{$row->name}=cleanrow($row);unset($row->id);unset($row->name);}

if(isset($_GET[generic])) {
	$xml = new SimpleXMLElement('<Generic_configurations></Generic_configurations>');
	$filename="A2_generic_configuration_010";
	$classGroups=array(Systems=>dms_System,Tags=>dms_Tag,ModbusTCPRanges=>dms_ModbusTCPRanges,tblSetPointAlarms=>dms_tblSetPointAlarm,SNMPItems=>dms_SNMPItem);
}
else {
	$xml = new SimpleXMLElement('<Specific_configurations></Specific_configurations>');
	$classGroups=array(Locations=>dms_Location,Groups=>dms_Group,PLaces=>dms_Place,ModbusTCPDevices=>dms_ModbusTCPDevice,SNMPDevices=>dms_SNMPDevice,SystemInstances=>dms_SystemInstance);
	$filename="A2_specific_configuration_010";
}

foreach($classGroups as $classGroupName=>$className){
	$xmlClassGroup = $xml->addChild($classGroupName);
	foreach($class->{$className} as $id => $item){
		$xmlItem = $xmlClassGroup->addChild(str_replace(dms_,"",$item->class));
		foreach($item->values as $attributeName => $attribute) if($attribute->value) {
			$xmlAttribute = $xmlItem->addChild($attributeName,$attribute->value);
			unset($attribute->value);
			foreach($attribute as $attributeName=>$value) $xmlAttribute[$attributeName]=$value;
		}
		unset($item->values);
		foreach($item as $attributeName=>$value) $xmlItem[$attributeName]=$value;
	}
}

header("Content-type: text/xml");
if(isset($_GET[download])) header("Content-disposition: attachment; filename=$filename.xml");
die($xml->asXml());
?>
