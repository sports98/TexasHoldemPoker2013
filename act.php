<?php
/**
 *--------------------------------------------------------------------------
 * act.php  [action] (AJAX)
 *--------------------------------------------------------------------------
 *
 * 用来进行执行一系列的业务操作模块内容的核心文件
 *
 * @author : yangzw@uusee.com
 * @date   : 2013/02/20
 * @package: BXML
 * 
 */
  require_once "config.php";
  require_once "db.php";
  $out = new stdClass;
  
  $actCmd = isset($_REQUEST['act'])?strtolower(trim($_REQUEST['act'])):'def';
  
  switch($actCmd){
	case 'remove':
	case 'del':
	case 'delete':letsremove($out);break;
	case 'item':letsitem($out);break;
  }
  
  function letsremove(&$out){
	$confid = (int)$_REQUEST['id'];
	$pw = $_REQUEST['pw'];
	$pwTag = strcmp($pw,OPPWD)==0?true:false;
	if($confid && $pwTag){
		$query = "delete from conf where confid='$confid'";
		mysql_query($query);
		$out->tag = "ok";
	}
	else{
		$out->tag = "fail";
		if($pwTag){
			$out->message = lang("removefaila");
		}else{
			$out->message = lang("removefailb");
		}
	}
  }
  
  
  echo json_encode($out);
 