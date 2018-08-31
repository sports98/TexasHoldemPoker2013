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
  if(!checkLogin()){g("login.php");exit;}
  $out = new stdClass;
  
  $ids = isset($_REQUEST['id'])?intval(trim($_REQUEST['id'])):false;
  
  if(false ===  $ids){
	$out->tag = "fail";
	$out->message = "id is NULL!!!";
  }else{
	$content = file_get_contents("php://input");
	
	$query = "select * from resource where conf_id='$ids' limit 1";
	$q = mysql_query($query);
	$row = mysql_fetch_object($q);
	$sql = "select 0";
	if(false === $row){
		$sql = "insert into resource(`conf_id`,`content`,`appendtime`) values('$ids','$content','".TIME_NOW."')";
	}else{
		$sql = "update resource set `content`='$content',`edittime`='".TIME_NOW."' where conf_id='$ids' limit 1";
	}
	mysql_query($sql);
	$out->tag = "ok";
	$out->message = "Success";
  }
  
  echo json_encode($out);
 