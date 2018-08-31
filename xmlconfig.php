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
	body {background-color:#fff}
	input,select,textarea{outline:none;resize:none;-webkit-border-radius: 4px;-moz-border-radius: 4px;border-radius: 4px;}
	.stitle {color:#43BF00;font-weight:800;font-size:18px;padding:2px 10px 2px 10px}
	.titels {color:#88888C;font-weight:800;font-size:14px;padding:2px 10px 2px 10px}
	.maincontent {padding:5px auto;border:none;text-align:left;}
	.maincontent td {background-bottom:1px solid #000}
	.handle {cursor:pointer}
	fieldset {border-left:none;border-right:none;border-bottom:none;text-align:left;padding:0px}
	.cls {clear:both}
	.pright {position:absolute;right:2px;top:2px;}
	.center {text-align:center}
	.ab{position:fixed;	top:0px;z-index:100;background-color:#F42C3C;border-bottom:1px solid #ccc;-webkit-border-radius: 4px;-moz-border-radius: 4px;border-radius: 4px;}
	.ab .hname {display:none}
	.ab .pkarea {display:none}
	.ab legend {display:none}
	.ab .names {display:none}
	/*<!-- 扑克弹出层 -->*/
	.pk_help {width:29px;height:38px;display:inline-block;float:right;border:1px solid #ccc;background-color:#000;color:red;font-size:18px;font-weight:800;margin:10px 30px 0px 0px;text-align:center;padding-top:10px}
	/*<!-- 主体ID定义 -->*/
	#bodys {width:100%;background-color:#f2f2f2}
	#info {display:none}
	legend {font-weight:800;}
	/*<!-- 部分字体的定制 -->*/
	.thd {position:relative;font-weight:800;font-size:14.5px;padding:7px 5px 7px 15px;background-color:#D2EDC6;color:#ED7D31}
	/*<!-- Users -->*/
	#users {padding:5px;}
	#users input {border:none;border-bottom:1px solid #c0c0c0;width:133px;text-align:center}
	#users .ps_a {position:relative;width:133px;float:left;border:1px solid #CCD9EA;background-color:#F1F5FB;margin-right:3px;-webkit-border-radius: 4px;-moz-border-radius: 4px;border-radius: 4px;}
	#users .ps_a:hover {background-color:#FFF4CE;border-color:#000}
	#users .titles {font-weight:800;color:#FF7F1A;background-color:#003666}
	#users .flag {position:relative;width:16px;float:left;z-index:30;padding:0px;margin:2px 0px 2px 5px}
	#users .viewerbox {position:relative;width:16px;float:left;z-index:10;padding:0px;margin:2px 0px 2px 0px}
	#users .showpkbox {position:relative;width:16px;float:left;z-index:10;padding:0px;margin:2px 0px 2px 0px}
	#users .tip {position:relative;float:left;}
	#users .names {background-color:#C3E4FB;text-align:center}
	#users .hname {background-color:#FFF7AE;text-align:center}
	#users .money {background-color:#DEF9D1;text-align:center}
	#users .pkarea {text-align:center}
	.winnerbox{width:15px!important;}
	/*<!-- 数据列表 -->*/
	.rounds {position:relative;width:133px;float:left;border:1px solid #CCD9EA;background-color:#F1F5FB;margin-right:3px;}
	.rounds:hover {background-color:#FFF4CE;border-color:#000}
	.active {background-color:#AF9BD9;border-color:#9BD9B2}
	/*<!-- MASK-->*/
	.mask {background-color:#AF9563;color:red;position:absolute;left:0px;top:0px;
	z-index:20;width:133px;height:100%;text-align:center;display:table-cell; vertical-align:middle;}
	/*<!-- PKLIST -->*/
	#pklist {width:720px;border:2px solid #5A88A0;position:absolute;padding:10px;background-color:#2D4250;top:50%;left:50%;margin-top:-120px;margin-left:-360px;z-index:50;}
	/*<!-- 游戏步骤区域 -->*/
	#pkareas .ta {position:relative;font-weight:800;font-size:12px;color:#227CAD;text-align:left;height:25px}
	#pkareas .contora {position:absolute;right:5px;top:0px;}
	#pkareas .roundarea {width:1250px;border:1px dotted  #E1EEF8;}
	#f1,#f2,#f3 {clear:both}
	.rflag {position:relative;width:20px;float:left;z-index:30}
	.sumtextarea {width:125px;height:100px;border:1px solid #ccc;margin-top:20px;}
	.roundarea ul,li {margin-bottom:5px;}
	.roundarea input[type="text"]{border:none;border-bottom:1px solid #c0c0c0;width:133px;}
	.pmsgbox {width:100%!important;border:1px solid #ccc;background-color:#9C4E00;color:#63B8F7}
	.warning {background-color:red!important;color:black!important;}
	/*<!-- 游戏结束小窍门提示 -->*/
	.classinfo {width:1250px;height:30px}
	/*<!-- 游戏结束小窍门提示 -->*/
	.btns {text-align:center}
	.still {position:fixed;	bottom:0px;z-index:100;background-color:#8CBDEA;border-bottom:1px solid #ccc;right:0px;padding:5px;}
	.still * {width:140px;height:40px;}
	.still *:first-child {display:none}
	/*<!-- Ext -->*/
	.hiddenUser {cursor:pointer}
</style>
<body><div id="bodys">Loading....</div>
<script type="txt/template" id="htmlTemplate">
	<h3 class="thd">{%title%}</h3>
	<fieldset style="height:210px"><legend>{%setuserinfo%}</legend>
	<ul id="users"></ul></fieldset>
	<fieldset><legend>{%gameplay%}</legend>
	<ul id="pkareas">
		<li id="firstround">
			<div class="cls ta"><a class="button handle roundbtn" data="3">{%newround%}</a>&nbsp;<a class="button handle pmsg" data="1">{%pmsg%}</a><div class="contora"></div></div>
			<div class="roundarea"></div>
		</li>
		<li id="f3" class="center">{%firstround%}</li>
		<li id="secondround">
			<div class="cls ta"><a class="button handle roundbtn" data="1">{%newround%}</a>&nbsp;<a class="button handle pmsg" data="1">{%pmsg%}</a><div class="contora"></div></div>
			<div class="roundarea"></div>
		</li>
		<li id="f2" class="center">{%secondround%}</li>
		<li id="thirdround">
			<div class="cls ta"><a class="button handle roundbtn" data="1">{%newround%}</a>&nbsp;<a class="button handle pmsg" data="1">{%pmsg%}</a><div class="contora"></div></div>
			<div class="roundarea"></div>
		</li>
		<li id="f1" class="center">{%thirdround%}</li>
		<li id="roundover">
			<div class="cls ta"><a class="button handle roundbtn" data="1">{%newround%}</a>&nbsp;<a class="button handle pmsg" data="1">{%pmsg%}</a><div class="contora"></div></div>
			<div class="roundarea"></div>
		</li>
		<li data="4"></li>
		<li id="sk">
			<div class="cls ta"><a class="button handle pmsg" data="1">{%overpmsg%}</a><div class="contora"></div></div>
			<div class="roundarea"></div>
		</li>		
	</ul></fieldset>
	<fieldset><legend>{%classinfo%}</legend>
	<textarea class="classinfo"></textarea></fieldset>
	<fieldset style="height:45px"><legend>{%conbtns%}</legend>
		<div class="btns still">
			<button class="actbtn" act="prev">{%previnfo%}</button>
			<button class="actbtn" act="save">{%savethis%}</button>
			<button class="actbtn" act="close">{%closethis%}</button>
		</div>
	</fieldset>
	<div id="info">
		<span class="robot">{%robot%}</span>
		<span class="person">{%person%}</span>
		<span class="hname_title">{%tip_hname%}</span>
		<span class="names_title">{%tip_names%}</span>
		<span class="titles_title">{%tip_title%}</span>
		<span class="money_title">{%tip_money%}</span>
		<span class="userstandup">{%userstandup%}</span>
		<span class="close">{%close%}</span>
		<span class="pka">{%pka%}</span>
		<span class="pkb">{%pkb%}</span>
		<span class="rounda">{%firstround%}</span>
		<span class="roundb">{%secondround%}</span>
		<span class="roundc">{%thirdround%}</span>
		<span class="roundd">{%roundover%}</span>
		<span class="p404">{%p404%}</span>
		<span class="tip_rflag">{%tip_rflag%}</span>
		<span class="timer">{%timer%}</span>
		<span class="moneyb">{%moneyb%}</span>
		<span class="viewer">{%viewer%}</span>
		<span class="showpk">{%showpk%}</span>
		<span class="winner">{%winner%}</span>
		<span class="winnerbox">{%winnerbox%}</span>
		<span class="opconfirm">{%opconfirm%}</span>
		<span class="opconfirmpw">{%opconfirmpw%}</span>
		<span class="success">{%success%}</span>
		<span class="tip_mesgbox">{%tip_mesgbox%}</span>
		<span class="removeitem">{%removeitem%}</span>
		<span class="removeitemconfirm">{%removeitemconfirm%}</span>
		<span class="removeconfirm">{%removeconfirm%}</span>
		<span class="opid"><?php echo $_REQUEST['id'];?></span>
	</div>
	<br /><br />
</script>
</body>
</html>
<script type="text/javascript" src="js/jquery-1.6.2.min.js"></script>
<script type="text/javascript" src="js/jquery.fancybox-1.3.4.pack.js"></script>
<script type="text/javascript" src="js/confmain.js"></script>
<script type="text/javascript" src="js/proc.js"></script>
<script type="text/javascript" src="js/template.js"></script>