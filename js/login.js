/**
 *--------------------------------------------------------------------------
 * login (AJAX)
 *--------------------------------------------------------------------------
 *
 * ҳ������Ҫ��JSģ��
 *
 * @author : yangzw@uusee.com
 * @date   : 2013/02/19
 * @package: BXML
 * 
 */
//ҳ���ڳ�ʼ������
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