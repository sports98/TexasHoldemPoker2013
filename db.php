<?php
if (!defined('CONFIG_FILE')) {
    exit("Please Load Config file first!");
};
if (!isset($config) || !is_array($config)) {
    exit("Need Database Config!");
}
/**
 *--------------------------------------------------------------------------
 * 数据库连接程序
 *--------------------------------------------------------------------------
 *
 * BXML项目配置选项，包含数据库配置。以及其他业务需要配置选项
 *
 * @author : yangzw@uusee.com
 * @date   : 2013/02/19
 * @package: BXML
 *
 */

$mysqlHandle = mysqli_connect($config['dbhost'], $config['dbuser'], $config['dbpass']) or die(mysqli::error());
mysqli_select_db($mysqlHandle, $config['dbname']) or die(mysqli::error());
mysqli_query($mysqlHandle, sprintf("set names '%s'", $config['dbchar']));