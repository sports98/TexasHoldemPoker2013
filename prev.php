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

  $url = PRVURL.XMLURL.$_REQUEST['id'];
  header("Location: $url");