<?php
session_start();

/**
 *--------------------------------------------------------------------------
 * 配置选项数据
 *--------------------------------------------------------------------------
 *
 * BXML项目配置选项，包含数据库配置。以及其他业务需要配置选项
 *
 * @author : yangzw@uusee.com
 * @date   : 2013/02/19
 * @package: BXML
 *
 */

define("CONFIG_FILE", '');
define("VERSION", '1.0');
define("TIME_NOW", date("Y-m-d H:i:s"));
define("NOW", time());
define("LR", "\r\n");
define("PRVURL", 'player/box.swf?xmlurl=');
define("XMLURL", '../xml.php?id=');
define("OPPWD", '.uusee.com');
#Item [db_config]
$config['dbhost'] = "127.0.0.1";
$config['dbuser'] = "root";
$config['dbpass'] = "admin";
$config['dbname'] = "test_bxml";
$config['dbchar'] = "utf8";


$config['lang'] = 'cn';
$config['langExt'] = 'txt';

#字典缓存
$dictionary = array();
function lang($tag)
{
    global $config, $dictionary;
    $dic = "lang/" . $config['lang'] . "." . $config['langExt'];
    $dicArray = file($dic);
    if (count($dicArray) !== count($dictionary)) {
        foreach ($dicArray as $dicItem) {
            preg_match("/([a-zA-Z0-9\-\_]*)(?:.)(.*?)$/", $dicItem, $mas);
            if (3 === count($mas)) {
                if (0 !== strlen($mas[1]) * strlen($mas[2])) {
                    $k = strtolower(trim($mas[1]));
                    $_values = _sTemplate($mas[2]);
                    $dictionary[$k] = $_values;
                }
            }
        }
    }
    return isset($dictionary[$tag]) ? $dictionary[$tag] : '';
}

function _sTemplate($param)
{
    $searchKeyFormat = "{*%s*}";
    $searchKey = array();
    $replaceValue = array();
    $returnVal = '';
    foreach ($_SESSION as $k => $v) {
        array_push($searchKey, sprintf($searchKeyFormat, $k));
        array_push($replaceValue, $v);
    }
    return str_replace($searchKey, $replaceValue, $param);
}

function ec($d)
{
    echo lang($d);
}

function checkLogin()
{
    return (isset($_SESSION['name']) && isset($_SESSION['status'])) ? true : false;
}

function g($url)
{
    header("Location: $url");
    exit;
}

#注意！所有需要调用字典的均要放置在此行以后
$config['title'] = lang('title');