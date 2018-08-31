/**
 *--------------------------------------------------------------------------
 * main (AJAX)
 *--------------------------------------------------------------------------
 *
 * 页面内主要的JS模块
 *
 * @author : yangzw@uusee.com
 * @date   : 2013/02/19
 * @package: BXML
 * 
 */
 var itemNumber = 0;
//页面内初始化操作
function init(){
	//--------------------------------------------------------------------------
	$("a.doit").live("click",function(){
		$.fancybox(
			{
			'width'				: 1280,
			'height'			: 700,
			'padding'			: 0,
			'centerOnScroll'	: true,
			'titleShow'			: true,
			'autoScale'			: false,
			'transitionIn'		: 'none',
			'transitionOut'		: 'none',
			'enableEscapeButton': false,
			'showCloseButton'	: false,
			'href'				: 'xmlconfig.php?id='+$(this).attr('data'),
			'type'				:'iframe',
			'hideOnOverlayClick': false
		});
	});
	//--------------------------------------------------------------------------
	$("input,textarea").each(function(){
		$(this).focus(function(){
			$(this).next(".tipsA").show();
		});
		$(this).blur(function(){
			$(this).next(".tipsA").hide();
		});
	});
	//--------------------------------------------------------------------------
	$(".newconf").click(function(){
		$.ajax({
			type 	:	'post',
			url		:	'newconf.php',
			data	:	$('#appendform').serialize(),
			success	:	function(html){
				var rv = $.parseJSON(html);
				if(0 === rv.error){
					$('#appendform').find("input[type='text'],textarea").val('');
					init_xml(rv.confid);
					refreshData()
				}else{
					$.fancybox({content:"【"+rv.message+"】"});
				}
			}
		});
	});
	//--------------------------------------------------------------------------
	$("#refreshdatalist").live("click",function(){refreshData();});
	setInterval("_showNum()",100);
	//--------------------------------------------------------------------------
	$(".lets").live("click",function(){
		letsact($(this));
	});
	//--------------------------------------------------------------------------
	$(".editor").live("click",function(){
		var tx = $("#editTemplate").clone();
		var f = $(this).parent();
		$.fancybox({content:$(tx).html()});
		$(".editareabox").val(f.text());
		$(".supbtn").attr("field",f.attr("field")).attr("act",f.attr("sdact")).attr("opid",f.attr("opid")).html($("#info>.updaterbtn").html());
	});
	$("*[sdact]").live({mouseenter:function(){
		$("<div>",{"class":"editor"}).appendTo($(this));
	},mouseleave:function(){
		$(this).find(".editor").remove();
	}});
	//--------------------------------------------------------------------------
	$(".supbtn").live("click",function(){
		var opid = $(this).attr('opid');
		var htmlcontent = $(this).prev().val();
		var field= $(this).attr('field');
		$.ajax({
			type 	:	'post',
			url		:	'updateconf.php',
			data	:	"field="+field+"&opid="+opid+"&content="+htmlcontent,
			error	:   function(content){console.log(content);},
			success	:	function(content){
				if(content === 'success'){
					$("*[opid="+opid+"][field="+field+"]").html(htmlcontent);
					$.fancybox.close();
				}else{
					$.fancybox({content:$("#info>.updatefail").html()});
				}
			}
		});
	});
	//--------------------------------------------------------------------------
	refreshData();
}

function letsact(obj){
	switch(obj.attr('act')){
		case 'refresh':
		case 'reload':
		case 'load':refreshData();break;
		case 'remove':
		case 'del':
		case 'delete':letsremove(obj);break;
		case 'item':letsitem(obj);break;
		case 'download':letsdownload(obj);break;
		case 'prev':letsprev(obj);break;
	}
}

function letsprev(obj){
	var id = obj.parent().parent().attr("data");
	$.fancybox(
			{
			'width'				: 1000,
			'height'			: 700,
			'padding'			: 5,
			'centerOnScroll'	: true,
			'titleShow'			: true,
			'autoScale'			: false,
			'transitionIn'		: 'none',
			'transitionOut'		: 'none',
			'href'				: "prev.php?id="+id,
			'type'				:'iframe'
		});
	//window.open("prev.php?id="+id);
}

function letsdownload(obj){
	if(confirm($("#info>.downconfirm").html())){
		var id = obj.parent().parent().attr("data");
		$("<iframe>").hide().attr("src","downxml.php?id="+id).appendTo($("body"));
	}
}

function letsitem(obj){
	var id = obj.parent().parent().attr("data");
	init_xml(id);
}

function letsremove(obj){
	var pmsg = prompt($("#info>.confirmpw").html());
	if(null != pmsg && pmsg != ''){
		var id = obj.parent().parent().attr("data");
		$.getJSON("act.php?act=del&pw="+pmsg+"&id="+id,function(data){
			if(data.tag == 'ok'){
				_removeItem(id);
			}else{
				$.fancybox({content:data.message});
			}
		});
	}
}

 //初始化XML的编辑页面
 function init_xml(param){
	$('#xmlconfigpop').attr("data",param);
	$('#xmlconfigpop').trigger("click");
 }
 
 //刷新数据列表
 function refreshData(){
	itemNumber = 0;
	$("#datalist").empty();
	$.getJSON("l.php",function(data){
		$.each(data.item,function(i,o){
			_insertItem(o);
		});
	});
	
 }
 
 function _insertItem(o){
	var ol 			= $("<li/>").addClass("data_item").attr("data",o.confid);			//课件容器
	var techdiv 	= $("<div/>",{"field":"techid","opid":o.confid,"sdact":"a1"}).addClass("data_cno").html(o.techid).appendTo(ol);		//课件名称
	var namediv 	= $("<div/>",{"field":"title","opid":o.confid,"sdact":"a1"}).addClass("data_title").html(o.title).appendTo(ol);		//课件名称
	var sumsdiv 	= $("<div/>",{"field":"sums","opid":o.confid,"sdact":"a1"}).addClass("data_sums").html(o.sums).appendTo(ol);		//介绍内容
	var control 	= $("<div/>").addClass("data_contrl");	//控制面板
	var delbtn 		= $("<dd/>").addClass("lets handle ico del").attr("title",$("#info>.delbtn_tip").html()).attr("act","delete").html("").appendTo(control);		//删除课件
	var editbtn 	= $("<dd/>").addClass("lets handle ico edit").attr("title",$("#info>.prevbtn_tip").html()).attr("act","prev").html("").appendTo(control);		//修改课件内容
	var contentbtn 	= $("<dd/>").addClass("lets handle ico items").attr("title",$("#info>.itembtn_tip").html()).attr("act","item").html("").appendTo(control);		//项目内容管理
	var downloadbtn = $("<dd/>").addClass("lets handle ico download").attr("title",$("#info>.downbtn_tip").html()).attr("act","download").html("").appendTo(control); 	//下载资源XML
	control.appendTo(ol);
	ol.hover(function(){$(this).find('.data_contrl').show();},function(){$(this).find('.data_contrl').hide();});
	ol.appendTo("#datalist");
	itemNumber++;
	_showNum();
	return false;
 }
 
 function _removeItem(id){
	$("#datalist li[data="+id+"]").fadeOut("slow",function(){$(this).remove()});
	itemNumber--;
 }
 
 function _refreshItem(){
 }
 
 function _showNum(){
	$('.itemsnumber').html("&nbsp;【"+itemNumber+"】");
 }