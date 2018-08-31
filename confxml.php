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

  $xml = new SimpleXMLElement('<?xml version="1.0" encoding="UTF-8"?><root></root>');
 
  
  $sql = "select * from conf order by confid ASC,sorted ASC";
  $query = mysql_query($sql);
  while($row = mysql_fetch_object($query)){
		 $confchild = $xml->addChild("confchild");
		 $confchild->addChild("name" , $row->name);
		 $confchild->addChild("summary", $row->summary);
		 $confchild->addChild("url", sprintf(XMLURL."%s",$row->confid));
  }
  header("Content-Type: text/xml");
  echo $xml->asXML();exit;