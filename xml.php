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
  
  $ids = isset($_REQUEST['id'])?intval(trim($_REQUEST['id'])):false;
  
  $sql = "select * from resource where conf_id='$ids' limit 1";
  $q = mysql_query($sql);
  $row = mysql_fetch_object($q);
  if(false === $row){
	echo "ids Error!";
  }
  else{
	header("Content-Type: text/xml");
	  echo '<?xml version="1.0" encoding="UTF-8"?>'.LR;
	  echo $row->content;exit;
  }