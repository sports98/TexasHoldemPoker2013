/**
 *--------------------------------------------------------------------------
 * main (AJAX)
 *--------------------------------------------------------------------------
 *
 * 页面内主要的JS模块
 * 扑克花色为  p_fk<方块> p_ch<草花> p_hx<红心> p_ht<黑桃> : 定义在CSS中
 * 扑克牌面为  1(A) ... 10 .11(J) 12(Q) 13(K)
 * 座位信息
 *
 * @author : yangzw@uusee.com
 * @date   : 2013/02/19
 * @package: BXML
 * 
 */
//页面内初始化操作
var cards 		= new Array("","A","2","3","4","5","6","7","8","9","10","J","Q","K");
var cards_hs 	= new Array("p_ht","p_hx","p_ch","p_fk");
var cards_pf 	= new Array("S","H","C","D");
var sites 		= new Array("庄家(BTN)","小盲(SB)","大盲(BB)","枪口(UTG)","前卫1(UTG+1)","前卫2(UTG+2)","后卫1(MP1)","后卫2(MP2)","庄家右侧(CO)");
var sitesTag 	= new Array("BTN","SB","BB","UTG","UTG+1","UTG+2","MP1","MP2","CO");
var persons 	= new Array();
var hornorname 	= new Array("指点江山","妙手书生","无畏牛刀","初露锋芒","天山名客","贵宾骚客");
var flags 		= new Array('- - -','小盲(SB)','大盲(BB)','跟注(C)','加注(R)','弃牌(F)','看牌(CK)');
var optag 		= new Array();
var clickTag 	= 'ck';//可以点击的扑克
var offs = '';
var btns = '';

function init(){
	offs=$('#users').offset();
	btns=$('.btns').offset();
	//--------------------------------------------------------------------------
	init_user();
	//--------------------------------------------------------------------------
	$(".randomPerson").live("click",function(){
		init_user();
	});
	$(".flag").live("click",function(){
		if(!$(this).is(':checked')){
			$(this).parent().find(".mask").remove();
			$("<div>").addClass("mask").html($("#info>.userstandup").html()).appendTo($(this).parent());
		}else{
			$(this).parent().find(".mask").remove();
		}
	});
	//--------------------------------------------------------------------------
	$(".pkb["+clickTag+"]").live("click",function(){selectpk($(this));});
	//--------------------------------------------------------------------------
	$('.roundbtn').live("click" , function(){
		if('undefined' != typeof($(this).attr("data"))){
			newround($(this).parent().next());
		}else{
			alert($("#info>.p404").html());
		}
	});
	$(".pmsg").live("click",function(){
		try{
			pmessage($(this).parent().next());
		}catch(e){};
	});
	$(".viewerbox").live("click",function(){
		if($(this).is(":checked")){
			$(".viewerbox").attr("checked" , false);
			$(this).attr("checked" , true);
		}
	});
	//--------------------------------------------------------------------------
	$("input[class=money]").live("dblclick",function(){
		$(this).val('');
	});
	//--------------------------------------------------------------------------
	$(".actbtn").live("click",function(){d_act($(this).attr('act'))});
	//--------------------------------------------------------------------------
	distribute(3,$("#f3"),1);
	distribute(1,$("#f2"),2);
	distribute(1,$("#f1"),3);
	//--------------------------------------------------------------------------
	$(".removeitembox").live("change",function(){
		$(this).parent().parent().next().children().each(function(i,v){
			$(this).find("*").removeClass("warning");
		});
		$($(this).parent().parent().next().children().get($(this).val())).find("*").addClass("warning");
	});
	//--------------------------------------------------------------------------
	$(".removestep").live("click",function(){
		var tv = parseInt($(this).next().val());
		if(tv>=0 && confirm($("#info>.removeconfirm").html())){
			$($(this).parent().parent().next().children().get(tv)).remove();
			$(this).next().val(-1);
			rebuildContora($(this).parent());
		}
	});
	//--------------------------------------------------------------------------
	$(".hiddenUser").live("click",function(){
	});
	//--------------------------------------------------------------------------
	init_from_server();
}


$(window).scroll(function(){
	var toTop = offs.top-$(window).scrollTop()+55;
	if(toTop<=0){
		if(!$('#users').hasClass('ab'))$('#users').addClass('ab');
	}else{
		$('#users').removeClass('ab');
	}
	//console.log("btns.top:"+btns.top,"window.scrollTop:"+$(window).scrollTop(),"window.height"+$(document).height());
	var v1 = $(document).height() - btns.top-95;
	if( $(window).scrollTop() > v1 ){
		$('.btns').removeClass("still");
	}else{
		if(!$('.btns').hasClass('still'))$('.btns').addClass('still');
	}

});

function init_from_server(){
	$.ajax({
		url:"xml.php",
		type:'GET',
		dataType:"XML",
		data:"id="+$("#info>.opid").html(),
		success:function(content){
			//Rebuild Persons
			$(content).find("persons").children().each(function(i,v){
				var o = $($("#users>.ps_a").get(i));
				if(0 === parseInt($(this).children("flag").text())){
					o.find(".flag").trigger("click");
				}else{
					o.find(".names").val(	$(v).children("name").text());
					o.find(".hname").val(	$(v).children("hornorname").text());
					o.find(".money").val(	$(v).children("money").text());
					var pkA = $(v).children("cards").children("card").get(0);
					var pkB = $(v).children("cards").children("card").get(1);
					var hsIdxA = parseInt($(pkA).children("huase").text());
					var hsIdxB = parseInt($(pkB).children("huase").text());
					var numIdxA = $(pkA).children("num").text();
					var numIdxB = $(pkB).children("num").text();
					var pkTagA = parseInt(numIdxA)*parseInt(hsIdxA)==0?"joke_a":buildPkHN(hsIdxA,numIdxA);//cards_hs[hsIdxA-1]+""+numIdxA;
					var pkTagB = parseInt(numIdxB)*parseInt(hsIdxB)==0?"joke_b":buildPkHN(hsIdxB,numIdxB);//cards_hs[hsIdxB-1]+""+numIdxB;
					o.find(".pkb").first().removeClass().addClass("pkb").addClass(pkTagA);
					o.find(".pkb").last().removeClass().addClass("pkb").addClass(pkTagB);
				}
			});
			//Rebuild Steps
			var currentAreaObj;
			var roundareaIdx = 0;
			var pkareaIdx = 0;
			var roundAreaObj = $(".roundarea");
			var pkareaObj = $("#pkareas").find(".pkarea");
			$(content).find("totalsteps").children().each(function(i,v){
				// 0 - 自动 1- 第一次三张 2 - 第二次一张  3第三次一张  4 -结束
				var stepflagValue = parseInt($(this).children("stepflag").text());
				//当前操作区域 newround(currentAreaObj),distribute(3,currentAreaObj,step),pmessage(currentAreaObj)
				if( stepflagValue === 0){
					//正常步骤
					currentAreaObj =  roundAreaObj.get(roundareaIdx);
					$(this).children("step").each(function(){
						var testFlag = parseInt($(this).children("commentflag").text());
						if(testFlag !== 1){
							var uIdx = $(this).children("player").text();
							uIdx = parseInt(uIdx);
							newround(currentAreaObj); //创建一个会话
							var opNode = $(currentAreaObj).find("ul").last();//.get(parseInt(uIdx));
							var opLi = $(opNode).find("li").get(parseInt(uIdx));
							$(opLi).find("select").val($(this).children("flag").text());
							$(opLi).find(".rflag").trigger("click");
							$(opLi).addClass("active");							
							$(opLi).find(".money").val($(this).children("money").text());						
							$(opLi).find(".timer").val($(this).children("time").text());					
						}else if(testFlag === 1){
							pmessage(currentAreaObj);//创建一个消息
							var opNode = $(currentAreaObj).children().last();//.get(parseInt(uIdx));
							$(opNode).find(".pmsgbox").val($(this).children("comment").text());
						}					
						
					});
				}else if( stepflagValue === 1 || stepflagValue === 2 || stepflagValue === 3){
					currentAreaObj =  pkareaObj.get(pkareaIdx);
					$(this).children("card").each(function(i,v){
						var hsTag = buildPkHN(parseInt($(v).children("huase").text()),parseInt($(v).children("num").text()));
						var opNode = $(currentAreaObj).find(".pkb").get(i);
						$(opNode).removeClass().addClass("pkb").addClass(hsTag);
					});
					roundareaIdx++;
					pkareaIdx++;
				}else if( stepflagValue === 4){
					
				};
			});
			//Rebuild Winner
			$(content).find("winplayer").each(function(i,v){
				var idx = parseInt($(this).text());
				$($("#users").find(".winnerbox").get(idx)).attr("checked",true);
			});
			//explainplayer
			$(content).find("explainplayer").each(function(i,v){
				var idx = parseInt($(this).text());
				$($("#users").find(".viewerbox").get(idx)).attr("checked",true);
			});
			//showhandcards
			$(content).find("showhandcards").each(function(i,v){
				var idx = parseInt($(this).text());
				$($("#users").find(".showpkbox").get(idx)).attr("checked",true);
			});
			$(content).find("classinfo").each(function(){
				$(".classinfo").val($(this).text());
			});
			//Rebuild Steps
		}		
	});
}


//构造扑克 - 返回className
function buildPkHN(hs,num){
	if(parseInt(hs)*parseInt(num) ==0){
		return 'joke_m';
	}
	return cards_hs[hs-1]+""+num;;
}

function init_user(){
	_buildPerson();
	$("#users").empty();
	$.each(sites,function(i,d){
		var ol = $("<li/>").addClass("ps_a");
		$("<input>",{
			"class":"flag",
			"type":"checkbox",
			"name":"flag",
			"value":"1",
			"checked":true
		}).appendTo(ol);
		$("<span/>",{"class":"tip"}).html($("#info>.robot").html()).appendTo(ol);
		$("<input>",{
			"class":"viewerbox",
			"type":"checkbox",
			"name":"flag",
			"value":"1",
			"checked":false
		}).appendTo(ol);
		$("<span/>",{"class":"tip"}).html($("#info>.viewer").html()).appendTo(ol);
		$("<input>",{
			"class":"showpkbox",
			"type":"checkbox",
			"name":"flag",
			"value":"1",
			"checked":false
		}).appendTo(ol);
		$("<span/>",{"class":"tip"}).html($("#info>.showpk").html()).appendTo(ol);
		$("<div/>").addClass("cls").appendTo(ol);
		//$("<div>").addClass("person_name").html($("#info>.person").html()).appendTo(ol);
		$("<input/>",{"type":"text"}).addClass("hname").attr("title",$("#info>.hname_title").html()).val(persons[i].hname).appendTo(ol);
		$("<div/>").addClass("cls").appendTo(ol);
		$("<input/>",{"type":"text"}).addClass("names").attr("title",$("#info>.names_title").html()).val(persons[i].title).appendTo(ol);
		$("<div/>").addClass("cls").appendTo(ol);
		$("<input/>",{"type":"text"}).addClass("titles").attr("title",$("#info>.titles_title").html()).val(d).appendTo(ol);
		$("<div/>").addClass("cls").appendTo(ol);
		$("<input/>",{"type":"text"}).addClass("money").attr("title",$("#info>.money_title").html()).val(10000).appendTo(ol);
		$("<input>",{"type":"checkbox"}).addClass("winnerbox").attr("title",$("#info>.winnerbox").html()).appendTo(ol);
		$("<span/>",{"class":"winner"}).html($("#info>.winner").html()).appendTo(ol);
		$("<div/>").addClass("cls").appendTo(ol);
		var pkarea = $("<div>").addClass("pkarea");
		$("<div/>",{click:function(){}}).addClass("pkb joke_a").attr(clickTag,'1').attr("title",$("#info>.pka").html()).attr("data","0").appendTo(pkarea);
		$("<span/>").html("&nbsp;").appendTo(pkarea);
		$("<div/>",{click:function(){}}).addClass("pkb joke_b").attr(clickTag,'1').attr("title",$("#info>.pkb").html()).attr("data","0").appendTo(pkarea);
		pkarea.appendTo(ol);
		ol.appendTo("#users");
	});
}

function _buildPerson(){
	var FirstName = new Array("Daly","Jr","Mollet","Maupassant","Adenauer","Nikolaus","Gaulle");
	var LastName = new Array("John","Mary","Greenhill","Lord","Couve","Louise","Joliot");
	var us = new Array();
	person = [];
	$.each(FirstName,function(i,n1){
		$.each(LastName,function(j,n2){
			var user = new Object;
			user.title = n1+" "+n2;
			user.hname = randomVal(hornorname);
			us.push(user);
		});
	});
	var getNumber  = sites.length;
	while(getNumber--){
		persons.push(randomVal(us));
	}
}

function randomVal ( myArray ) {
  var i = myArray.length, j;
  if ( i == 0 ) return false;
  while ( --i ) {
     j = Math.floor( Math.random() * ( i + 1 ) );
     return myArray[j];
   }
}

function selectpk(obj){
	try{$("#pklist").remove();}catch(e){}
	var opClassName = "dpksk";
	$("*["+opClassName+"=1]").attr(opClassName,'0');
	obj.attr(opClassName,'1');
	var area = $("<div>",{"id":"pklist"}).css("top",$(window).scrollTop()+350);
	$.each(cards_hs,function(i,j){
		$.each(cards,function(k,v){
			if(k>0){
				var cNames = j+''+k;
				$("<div>",{click:function(){
					$("*["+opClassName+"=1]").removeClass().addClass("pkb").addClass(cNames);
					try{$("#pklist").remove();}catch(e){}
				}}).addClass("pkb").addClass(cNames).appendTo(area);
				$("<span/>").html("&nbsp;").appendTo(area);
			}else{
				$("<div/>",{"class":"pk_help"}).html(cards_pf[i]).appendTo(area);
			}
		});
		$("<div>").add("cls").appendTo(area);
	});
	$("<a>",{click:function(){try{$("#pklist").remove();}catch(e){}}}).html($("#info>.close").html()).addClass('button handle pright').appendTo(area);
	area.appendTo("body");
}


function distribute(p1,appendArea,step){
	var pk_number = parseInt(p1);
	var pkarea = $("<div>").addClass("pkarea");
	while((pk_number--)>0){
		$("<div/>",{click:function(){}}).addClass("pkb joke_m").attr(clickTag,'1').attr("title",$("#info>.pkc").html()).attr("data","0").appendTo(pkarea);
		$("<span/>").html("&nbsp;").appendTo(pkarea);
	}
	appendArea.attr("data",step);
	pkarea.appendTo(appendArea);
}

function pmessage(appendArea){
	var sul = $("<ul/>",{"data":"0"}).attr("data","0");
	var ol = $("<li/>").addClass("pinfo");
	$("<input>",{
			"class":"pmsgbox",
			"type":"text",
			"value":"",
			"title":$("#info>.tip_mesgbox").html(),
			"checked":false
	}).appendTo(ol);
	ol.appendTo(sul).appendTo(appendArea);
	rebuildContora($($(appendArea).parent().children().get(0)).children('.contora').get(0));
}

//新轮次
function newround(appendArea){
	var sul = $("<ul/>",{"data":"0"}).attr("data","0");
	$.each(sites,function(i,d){
		var ol = $("<li/>").addClass("rounds");
		var st = $("<select/>",{change:function(){
									$(this).next().attr("checked",$(this).val()>0?true:false);
									_rest($(this).next());
								}}
		);
		$.each(flags,function(i,o){
			if((new String(o)).length){
				$("<option>",{
					val:i,
					text:o
				}).appendTo(st);
			}
		});
		st.appendTo(ol);
		$("<input>",{
			"class":"rflag",
			"type":"checkbox",
			"name":"flag",
			"value":"1",
			"title":$("#info>.tip_rflag").html(),
			click:function(){if($(this).attr("checked")){
					_rest($(this));
				}else{
					$(this).parent().removeClass("active");
				}},
			"checked":false
		}).appendTo(ol);
		$("<div/>").addClass("cls").appendTo(ol);
		//money,time
		$("<input/>",{
			"class":"icon money",
			"type" : "text",
			"title":$("#info>.moneyb").html(),
			val	: 0
		}).appendTo(ol);
		$("<span/>").html("&nbsp;").appendTo(ol);
		$("<input/>",{
			"class":"icon timer",
			"type" : "text",
			"title":$("#info>.timer").html(),
			val : 2
		}).appendTo(ol);
		$("<div/>").addClass("cls").appendTo(ol);
		ol.appendTo(sul);
	});
	sul.appendTo(appendArea);
	rebuildContora($($(appendArea).parent().children().get(0)).children('.contora').get(0));
}

function _rest(obj){
	if(obj.attr("checked")){
		var oSv = obj.prev().val();
		obj.parent().parent().find("input[type=checkbox]").each(function(){
			$(this).attr("checked",false);
			$(this).parent().removeClass("active");
			$(this).prev().val(0);
		});
		obj.attr("checked",true);
		obj.prev().val(oSv);
		obj.parent().addClass("active");
	}
}

function rebuildContora(obj){
	$(obj).empty();
	$("<a/>").addClass("button handle removestep").html($("#info>.removeitem").html()).appendTo(obj);
	var oSelect = $("<select/>",{"class":"removeitembox"});
	$("<option/>").val('-1').html($("#info>.removeitemconfirm").html()).appendTo(oSelect);
	$(obj).parent().next('.roundarea').children().each(function(i,v){
		$("<option/>").val(i).html(i).appendTo(oSelect);
	});
	oSelect.appendTo(obj);
}