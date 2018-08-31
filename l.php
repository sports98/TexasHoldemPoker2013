<?php
/**
 *--------------------------------------------------------------------------
 * l.php  [list] (AJAX)
 *--------------------------------------------------------------------------
 *
 * 数据记录结果
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
 
 $out->item = array();
 $sql = "select techid,confid,name,summary from conf order by confid DESC,sorted ASC";
 $query = mysql_query($sql);
 
 while($row = mysql_fetch_object($query)){
	$rowObj = new stdClass;
	$rowObj->techid = $row->techid;
	$rowObj->confid = $row->confid;
	$rowObj->title = $row->name;
	$rowObj->sums = $row->summary;
	$out->item[] = $rowObj;
 }
 
 echo json_encode($out);