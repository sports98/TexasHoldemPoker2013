<?php
/**
 *--------------------------------------------------------------------------
 * BXML_main
 *--------------------------------------------------------------------------
 *
 * 构造XML主体项目
 *
 * @author : yangzw@uusee.com
 * @date   : 2013/02/19
 * @package: BXML
 * 
 */
 require_once "config.php";
 require_once "db.php";
 if(!checkLogin()){g("login.php");exit;}
 ?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title><?php ec('title');?></title>
<link rel="icon" href="images/favicon.ico" type="image/x-icon" />
<link rel="shortcut icon" href="images/favicon.ico" type="image/x-icon" />
<link rel="stylesheet" type="text/css" href="css/common.css" />
<link rel="stylesheet" type="text/css" href="css/jquery.fancybox-1.3.4.css" />
<link rel="stylesheet" type="text/css" href="css/user_center.css" />
<link rel="stylesheet" type="text/css" href="css/ico.css" />
<link rel="stylesheet" type="text/css" href="css/button.css" />
</head>
<style type="text/css">
	input,button,select,textarea{outline:none;resize:none;-webkit-border-radius: 4px;
		-moz-border-radius: 4px;
		border-radius: 4px;}
	body {background-color:#246897}
	a:link {color:#B1CFE3}
	a:active {color:#B1B8E3}
	.stitle {color:#B1A5A5;font-weight:800;font-size:14px;padding:2px 10px 2px 10px}
	.titels {color:#88888C;font-weight:800;font-size:14px;padding:2px 10px 2px 10px}
	.maincontent {border:none;text-align:left;-webkit-border-radius: 4px;-moz-border-radius: 4px;border-radius: 4px;}
	.maincontent td {background-bottom:1px solid #000}
	.tipsA {position:absolute;padding:2px 10px 2px 10px;display:none;clear:both;margin:-10px 0px 0px 0px;}
	fieldset {border-left:none;border-right:none;border-bottom:none;text-align:right}
	.handle {cursor:pointer}
	/*<!-- 主体ID定义 -->*/
	#bodys {
		width:1000px;
		background-color:#F0F9EC;
		margin: 18px auto;
		text-shadow: 0 1px 0 rgba(255,255,255,0.5);
		border: 1px solid #fbeed5;
		-webkit-border-radius: 4px;
		-moz-border-radius: 4px;
		border-radius: 4px;
		color: #c09853;
	}
	#loginuser {position:absolute;right:15px;top:5px;font-size:12px;color:#D99C27}
	#info {display:none}
	.editor {position:relative;background-image:url(images/ico.png);width:16px;height:12px;background-position:-180px -446px;display:inline-block;cursor:pointer;margin:0px;padding:0px;bottom:0px}
	/*<!-- 部分字体的定制 -->*/
	.thd {position:relative;font-weight:800;font-size:14.5px;padding:7px 5px 7px 15px;background-color:#D2EDC6;color:#ED7D31}
	/*<!-- 数据列表 -->*/
	#datalist {background-color:#fff;padding:7px;}
	.data_title {font-weight:800}
	.data_cno {position:absolute;right:0px;text-align:right;padding:5px auto;font-weight:800;height:25px;opacity:.2;letter-spacing:7px;}
	.data_cno:hover {opacity:1}
	.data_item {position:relative;clear:both;border-bottom:1px solid #B7D6EE;margin:2px 0px 3px 0px;padding:5px;}
	.data_item:hover {background-color:#E1EEF8}
	.data_sums {color:#A8A71D}
	.data_contrl {position:absolute;bottom:5px;right:5px;display:none}
	/*<!-- 修改数据区域 -->*/
	.editareabox {width:400px;height:40px;}
</style>
<body>
<div id="bodys">Loading....</div>
<script type="txt/template" id="htmlTemplate">
	<a id="xmlconfigpop" href="#" class="doit" data="1"></a>
	<h3 class="thd">{%title%} <div id="loginuser">{%logined%}</div></h3>
	<fieldset style="margin:0px auto;">
		<legend><div class="stitle">{%legenda%}</div></legend>
		<div class="maincontent">
			<form id="appendform" name="appendform">
				<table>
					<tr>
						<td valign="top" style="padding-top:14px;"  class="titels">{%title_name%}</td>
						<td  valign="top"><input type="text" name="name" tabindex="1" class="u_f_text400" />
						<div class="tipsA">{%tips_name%}</div></td>
						<td valign="top" style="padding-top:14px;"  class="titels">{%cno_name%}</td>
						<td  valign="top"><input type="text" name="cno" tabindex="2" class="u_f_text200" />
						<div class="tipsA">{%tips_cno%}</div></td>
						<td rowspan="2"  valign="top" style="padding-top:10px;">
							<input type="button" value="{%buttona%}" tabindex="4" class="newconf button" style="width:200px;height:120px;font-size:20px;cursor:pointer"/>
						</td>
					</tr>
					<tr>
						<td valign="top" style="padding-top:10px;" class="titels">{%title_summary%}</td>
						<td valign="top" colspan="3"><textarea class="u_f_text600" tabindex="3" name="summary" style="height:60px;width:690px">{%buttonaa%}</textarea>
						<div class="tipsA">{%tips_summary%}</div>
						</td>
					</tr>
				</table>
			</form>
		</div>
	</fieldset>
	
	<fieldset style="margin:0px auto;">
		<legend><div class="stitle">{%legendb%} - <span class="lets handle ico reload" act="refresh"></span><span id="refreshdatalist" class="handle">{%refresh%}</span><span class="itemsnumber"></span></div></legend>
		<div class="maincontent"><ul id="datalist"></ul></div>
	</fieldset>	
	<div id="info">
		<span class="confirm">{%opconfirm%}</span>
		<span class="confirmpw">{%opconfirmpw%}</span>
		<span class="downconfirm">{%opdownload%}</span>
		<span class="edit">{%opedit%}</span>
		<span class="item">{%opitem%}</span>
		<span class="downloadfail">{%downloadfail%}</span>
		<span class="delbtn_tip">{%delbtn_tip%}</span>
		<span class="prevbtn_tip">{%prevbtn_tip%}</span>
		<span class="itembtn_tip">{%itembtn_tip%}</span>
		<span class="downbtn_tip">{%downbtn_tip%}</span>
		<span class="editer">{%editer%}</span>
		<span class="updaterbtn">{%updaterbtn%}</span>
		<span class="updatefail">{%updatefail%}</span>
	</div>
</script>
<script type="txt/template" id="editTemplate">
	<textarea class="editareabox"></textarea>
	<a class="button supbtn"></a>
</script>
</body>
</html>
<script type="text/javascript" src="js/jquery-1.6.2.min.js"></script>
<script type="text/javascript" src="js/jquery.fancybox-1.3.4.pack.js"></script>
<script type="text/javascript" src="js/main.js"></script>
<script type="text/javascript" src="js/template.js"></script>