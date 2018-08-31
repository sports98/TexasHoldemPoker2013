<?php
/**
 *--------------------------------------------------------------------------
 * BXML_main
 *--------------------------------------------------------------------------
 *
 * ����XML������Ŀ
 *
 * @author : yangzw@uusee.com
 * @date   : 2013/02/19
 * @package: BXML
 *
 */
require_once "config.php";
require_once "db.php";
$message = new stdClass;
$message->code = 0;
$message->message = '';

function init_user()
{
    global $message, $mysqlHandle;
    $name = "admin";
    $pwd = "admin";
    $status = 1;
    $sql = "insert into account(`name`,`pwd`,`status`) values('$name',md5('$pwd'),'$status')";
    mysqli_query($mysqlHandle, $sql);
    $message->code = 4;
    $message->message = lang("userdefaultuser");
}

if (isset($_GET) && count($_GET) > 0) {
    if (isset($_GET['logout'])) {
        session_unset();
        unset($_SESSION);
        session_destroy();
        header("Location: ./");
        exit;
    }
}

if (isset($_POST) && count($_POST) > 0) {

    if (!isset($_POST['username']) || strlen($_POST['username']) == 0) {
        $message->code = 1;
        $message->message = lang("usernamenull");
        $checkTag = false;
    }
    if (!isset($_POST['password']) || strlen($_POST['password']) == 0) {
        $message->code = 2;
        $message->message = lang("passwordnull");
        $checkTag = false;
    }
    if (0 === (int)$message->code) {
        $name = $_POST['username'];
        $pwd = $_POST['password'];
        $sql = "select account_id,`name`,status,lastlogintime from account where `name`='$name' and pwd=md5('$pwd') limit 1";
        $query = mysqli_query($mysqlHandle, $sql);
        $row = mysqli_fetch_object($query);
        if (false === $row) {
            $message->code = 3;
            $message->message = lang("usercheckfail");
            $sql = "select count(*) from account";
            $totalQuery = mysqli_query($mysqlHandle, $sql);
            $total = mysqli_free_result($totalQuery, 0);
            if (0 === (int)$total) {
                init_user();
            }
        } else {
            foreach ($row as $k => $v) {
                $_SESSION[$k] = $v;
            }
            $sql = "update account set lastlogintime='" . TIME_NOW . "' where account_id = '" . $row->account_id . "' limit 1";
            mysqli_query($mysqlHandle, $sql);
        }
    }
    echo json_encode($message);
    exit;
}

?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
        "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title><?php ec('title'); ?></title>
    <link rel="icon" href="images/favicon.ico" type="image/x-icon"/>
    <link rel="shortcut icon" href="images/favicon.ico" type="image/x-icon"/>
    <link rel="stylesheet" type="text/css" href="css/common.css"/>
    <link rel="stylesheet" type="text/css" href="css/jquery.fancybox-1.3.4.css"/>
    <link rel="stylesheet" type="text/css" href="css/screen.css">
    <link rel="stylesheet" type="text/css" href="css/logins.css">
</head>
<body>
<div id="bodys" class="new_teal">Loading....</div>
<script type="txt/template" id="htmlTemplate">
    <div id="login-box">
        <div id="outer-content">
            <div id="inner-content">
                <div id="content">
                    <div id="login-image"></div>
                    <div id="login-form-wrap"><h1></h1>
                        <div id="av-content">
                            <form onsubmit="return false;" action="/login/post/" id="login-form" method="POST">
                                <fieldset>
                                    <div class="login-field above-below15 above30 clear">
                                        <label for="username" class="placeholder">{%username%}</label>
                                        <input type="text" name="username" tabindex="1" class=" av-text" value=""
                                               id="username"></div>
                                    <div class="show-pass-wrap">
                                        <div class="login-field above-below15">
                                            <label for="password" class="placeholder ">{%password%}</label>
                                            <input type="password" name="password" tabindex="2" class=" av-password"
                                                   value="" id="password"></div>
                                    </div>

                                    <input type="submit" value="{%loginin%}" class="button float-left" id="loginbtn"
                                           tabindex="3"></fieldset>
                            </form>
                        </div>
                        <br class="clear"></div>
                    <br class="clear"></div>
            </div>
        </div>
    </div>
</script>
</body>
</html>
<script type="text/javascript" src="js/jquery-1.6.2.min.js"></script>
<script type="text/javascript" src="js/jquery.fancybox-1.3.4.pack.js"></script>
<script type="text/javascript" src="js/login.js"></script>
<script type="text/javascript" src="js/template.js"></script>