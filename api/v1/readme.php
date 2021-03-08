<?php
$files=[];
function getMdFiles($dir) {
	global $files;
	$result = array();
	$cdir = scandir($dir);
	foreach ($cdir as $key => $value)	{
		if (!in_array($value,array(".",".."))) {
			if (is_dir($dir . DIRECTORY_SEPARATOR . $value)) {
				getMdFiles($dir . DIRECTORY_SEPARATOR . $value);
			}
			else if (pathinfo($value, PATHINFO_EXTENSION)==md) {
				array_push($files,file_get_contents($dir. DIRECTORY_SEPARATOR . $value));
			}
		}
	}
	return $result;
}
//print_r(getMdFiles('../'));
getMdFiles('../../');
//getMdFiles('/aim/www/aim/v1/');
//echo json_encode($files);
//die();
$txt=json_encode($files);
//print_r($files);

//die();
//$txt=json_encode([chap1=>"# Welcome
//## dfgsdfgsdfg
//1. fasdfasdf
//1. sfasdfasdfas

//  Hello.  Welcome to my **website**.
//"]);

echo "<script>var txt=$txt;</script>";
?>
<div id=content></div>
<script src="/inc/js/showdown/dist/showdown.js"></script>
<script>
var conv = new showdown.Converter();
console.log(txt);
for (var name in txt) document.getElementById('content').innerHTML += conv.makeHtml(txt[name]);
</script>
