<?php
/**
 *--------------------------------------------------------------------------
 * newconf : 新增CONF项
 *--------------------------------------------------------------------------
 *
 * 也就是新增一条配置选项。
 *
 * @author : yangzw@uusee.com
 * @date   : 2013/02/19
 * @package: BXML
 * 
 */
 require_once "config.php";
 require_once "db.php";
 if(!checkLogin()){g("login.php");exit;}
 $out = new stdClass;
 $out->error = 0;
 $out->message = '';
 $out->confid = 0;
 
 $name = trim($_POST['name']);
 $summary = trim($_POST['summary']);
 $cno = isset($_POST['cno'])?trim($_POST['cno']):NOW;
 
 if(strlen($name) * strlen($summary)){
	 $sql = "insert into conf(`techid`,`name`,`summary`,`appendtime`,`sorted`) values('$cno','$name','$summary','".TIME_NOW."','".(NOW%86400)."')";
	 mysql_query($sql);
	 $out->confid = mysql_insert_id();
	 if(!(int)$out->confid){
		$out->error = 1;
		$out->message = mysql_error();
	 }
 }else{
	$out->error = 1;
	$out->message = "输入内容不可为空";
 }
 
 
 echo json_encode($out);
 ?>