/**
 *--------------------------------------------------------------------------
 * login (AJAX)
 *--------------------------------------------------------------------------
 *
 * 页面内主要的JS模块
 *
 * @author : yangzw@uusee.com
 * @date   : 2013/02/19
 * @package: BXML
 * 
 */
//页面内初始化操作
function init(){
	//--------------------------------------------------------------------------
	$("#loginbtn").live("click",function(){
		$.ajax({
		   type: "POST",
		   url: "login.php",
		   data: $("#login-form").serialize(),
		   success: function(msg){
			 var t = $.parseJSON(msg);
				if(t.code=="0"){
					window.location = './';
				}else{
					$.fancybox({content:t.message});
				}
		   }
		});
	});
}