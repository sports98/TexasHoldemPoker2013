<?php
/**
 *--------------------------------------------------------------------------
 * BXML_template (AJAX)
 *--------------------------------------------------------------------------
 *
 * 语言模块AJAX模块
 *
 * @author : yangzw@uusee.com
 * @date   : 2013/02/19
 * @package: BXML
 * 
 */
require_once "config.php";

$_keys = strtolower(trim($_POST['keys']));

$_keys = preg_replace("/[^a-zA-Z0-9\-\_\,]/", '' , $_keys);
$findKeys = explode(",",$_keys);
$out = new stdClass;
foreach($findKeys as $k=>$v){
	if(!strlen($v))continue;
	$out->$v = lang($v);
}
echo json_encode($out);exit;