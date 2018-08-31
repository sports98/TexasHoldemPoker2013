<?php
/**
 *--------------------------------------------------------------------------
 * updateconf : 更新CONF项
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

 
 $field 	= strtolower(trim($_POST['field']));
 $confid 	= intval(trim($_POST['opid']));
 $content 	= trim($_POST['content']);
  
 $updateField = array('techid'=>'techid','title'=>'name','sums'=>'summary','sorted'=>'sorted');
 $sk = array_keys($updateField);
 if(in_array( $field , $sk)){
	 $upField = $updateField[$field];
	 $sql = "update conf set `$upField`='$content',lastedit='".TIME_NOW."' where confid='$confid'";
	 mysql_query($sql);
	 echo "success";
 }else{
	echo 'fail';
 }