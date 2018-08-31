/**
 * proc.js 
 *
 * 本文件主要进行一系列的数据分析使用。不处理其他功能。
 *
 */
 var showConsole = false;
 
 var hs = {'p_ht':1,'p_hx':2,'p_ch':3,'p_fk':4};
 //可以缓存的XML数据岛
 var xmlDoc  = document.implementation.createDocument("","doc", null);
 var oXmlDom = document.implementation.createDocument("","doc",null); 
 var xs = new XMLSerializer();
 var datas =_createXmlNode("datas");
 //游戏是否结束
 var GAME_OVER = false;
 //当前桌面还剩人数
 var ActiveUser = 0;
 //初始化分析结构数据
  // o - 编辑区域
 function d_init(o){
	//避免被重复累加，重新初始化节点对象
	datas =_createXmlNode("datas");
	var takecardtimeValue = 3;
	var explainplayer = _createXmlNode("explainplayer");
	//终了显示手牌的玩家(可多节点)
	var showhandcards = new Array();
	var winners		  = new Array();
	//小窍门
	var classinfo = new Array(_createXmlNode("classinfo"));
	//获取手牌时间 - 默认使用3秒
	var takecardtime = _createXmlNode("takecardtime");
	//总步骤 -- datalist
	var totalsteps = _createXmlNode("totalsteps");
	var personArray = new Array();
	//-----------------------------------------------------------
	//分析Person
	$("#users>li").each(function(){
		var user = new Object();
		var ck = $(this).find("input[type='checkbox']").toArray();
		var tt = $(this).find("input[type='text']").toArray();
		var cd = $(this).find(".pkb").toArray();
		//用户标记
		user.flag  = $(ck[0]).attr("checked")?true:false;
		if(user.flag){
			ActiveUser =  ActiveUser+1;
			//视角
			user.explainplayer =  $(ck[1]).attr("checked")?true:false;
			//结束后显手牌
			user.showpk = $(ck[2]).attr("checked")?true:false;
			//赢家
			user.winner = $(ck[3]).attr("checked")?true:false;
			//用户称号
			user.hornorname = $(tt[0]).val();
			//用户名称
			user.name = $(tt[1]).val();
			// - - - 学术称号
			user.group = $(tt[2]).val();
			//用户起始资金
			user.money = $(tt[3]).val();
			user.cards = new Array();
			var card = new Object();
			var re = /(p_[a-zA-Z]{2})([0-9]{1,2})/g;
			var tmp_a1 = re.exec($(cd[0]).attr("class").toString());
			if(tmp_a1 == null){
				card.huase = 0;
				card.num = 0;
			}else{
				eval("var v1 = hs."+tmp_a1[1]+";");
				card.huase = v1;
				card.num = tmp_a1[2];
			}
			user.cards.push(card);
			card = null;
			var card = new Object();
			var re = /(p_[a-zA-Z]{2})([0-9]{1,2})/g;
			var tmp_a2 = re.exec($(cd[1]).attr("class").toString());
			if(tmp_a2 == null){
				card.huase = 0;
				card.num = 0;
			}else{
				eval("var v2 = hs."+tmp_a2[1]+";");
				card.huase = v2;
				card.num = tmp_a2[2];
			}
			user.cards.push(card);
			card = null;
		}
		else{
			user.explainplayer = 0;
			user.showpk = 0;
			user.winner = 0;
			user.hornorname = 'null';
			user.name = 0;
			user.money = 0;
			user.group = 0;
			user.cards = [{'huase':0,'num':0},{'huase':0,'num':0}];
		}
		personArray.push(user);
	});
	//------Build Person XML NODE--------//
	var explainplayerValue = 0;
	var persons = _createXmlNode("persons");
	$.each(personArray,function(i,user){
		var person 		= _createXmlNode("person");
		var flag 		= _createXmlNode("flag");
		var name 		= _createXmlNode("name");
		var hornorname 	= _createXmlNode("hornorname");
		var money 		= _createXmlNode("money");
		var cards 		= _createXmlNode("cards");
		var card_a 		= _createXmlNode("card");
		var huase_a 	= _createXmlNode("huase");
		var num_a 		= _createXmlNode("num");
		var card_b 		= _createXmlNode("card");
		var huase_b 	= _createXmlNode("huase");
		var num_b 		= _createXmlNode("num");		
		
		//SetVal
		flag.textContent 		= user.flag?1:0;
		name.textContent 		= user.name;
		hornorname.textContent 	= user.hornorname;
		money.textContent 		= user.money;
		huase_a.textContent 	= user.cards[0].huase;
		num_a.textContent 		= user.cards[0].num;
		card_a.appendChild(huase_a);
		card_a.appendChild(num_a);
		huase_b.textContent 	= user.cards[1].huase;
		num_b.textContent 		= user.cards[1].num;
		card_b.appendChild(huase_b);
		card_b.appendChild(num_b);		
		
		
		cards.appendChild(card_a);
		cards.appendChild(card_b);
		
		person.appendChild(flag);
		person.appendChild(name);
		person.appendChild(hornorname);
		person.appendChild(money);
		person.appendChild(cards);
		
		persons.appendChild(person);
		
		if(user.explainplayer){
			explainplayerValue = i;
		}
		if(user.showpk){
			z = i;
			showhandcards.push(z);
		}
		if(user.winner){
			z = i;
			winners.push(z);
		}
	});
	//-----------------------------------------------------------
	explainplayer.textContent = explainplayerValue%9;
	takecardtime.textContent = takecardtimeValue;
	datas.appendChild(explainplayer);
	datas.appendChild(takecardtime);
	datas.appendChild(persons);
	
	//-----------------------------------------------------------
	//分析Setup
	var totalsteps = _createXmlNode("totalsteps");
	var setupid = 1;
	$("#pkareas>li").each(function(i,o){
		var steps 		= _createXmlNode("steps");
		var stepflag 	= _createXmlNode("stepflag");
		var ids			= _createXmlAttr('id' , setupid);
		var stepData	= false;
		steps.setAttributeNode(ids);
		stepflag.textContent = typeof($(this).attr("data"))=="undefined"?0:$(this).attr("data");
		
		if(parseInt(stepflag.textContent)==4){
			stepData = true;
		}
		
		$(this).find(".roundarea").each(function(){
			$(this).children().each(function(){
			
				var step 				= _createXmlNode("step");
				var player 				= _createXmlNode("player");
				var commentflag 		= _createXmlNode("commentflag");
				var flag 				= _createXmlNode("flag");
				var money 				= _createXmlNode("money");
				var comment 			= _createXmlNode("comment");			
				var time 				= _createXmlNode("time");		

				var validStep			= false;
			
				$(this).find(".pmsgbox").each(function(z,vs){
					player.textContent 		= -1;
					commentflag.textContent = 1;
					flag.textContent 		= -1;
					money.textContent 		= -1;
					comment.textContent 	= $(this).val();
					time.textContent 		= takecardtimeValue;
					
					validStep 				= true;
				});
								
				$(this).find(".rounds").each(function(uid , ob){
					var playerid = uid;
					if($(this).hasClass('active')){
						player.textContent 		= playerid%9;
						commentflag.textContent = 0;
						flag.textContent 		= $(this).find("select").val();
						money.textContent 		= $(this).find(".money").val();
						comment.textContent 	= 'null';
						time.textContent 		= $(this).find(".timer").val();
						validStep 				= true;
					}
					//活跃用户减少1人 (弃牌) - 无资金的暂时未考虑
					if(parseInt(flag.textContent) === 5 ){
						ActiveUser = ActiveUser - 1;
					}
				});
				
				if(validStep){
					step.appendChild(player);
					step.appendChild(commentflag);
					step.appendChild(flag);
					step.appendChild(money);
					step.appendChild(comment);
					step.appendChild(time);
					steps.appendChild(step);
						
					stepData = true;
				}
			});
		});
		
		$(this).find(".pkarea").each(function(){
			$(this).find(".pkb").each(function(){
				var re 				= /(p_[a-zA-Z]{2})([0-9]{1,2})/g;
				var tmp_a2 			= re.exec($(this).attr("class").toString());
				var cardNode 		= _createXmlNode("card");
				var card 			= new Object();
				card.huase 	= 0;
				card.num 	= 0;
				if(null !== tmp_a2){
					eval("var v2 = hs."+tmp_a2[1]+";");
					card.huase = v2;
					card.num = tmp_a2[2];
				}
				var cardNodeHS 		= _createXmlNode("huase");
				var cardNodeNM 		= _createXmlNode("num");
				cardNodeHS.textContent = card.huase;
				cardNodeNM.textContent = card.num;
				cardNode.appendChild(cardNodeHS);
				cardNode.appendChild(cardNodeNM);
				steps.appendChild(cardNode);
				
				stepData = true;
			});
		});
		steps.appendChild(stepflag);
		console.log(steps);
		if(stepData){
			totalsteps.appendChild(steps);
			setupid = setupid+1;
		}
	});
	datas.appendChild(totalsteps);
	//-----------------------------------------------------------
	classinfo = _createXmlNode("classinfo");
	classinfo.textContent = $(".classinfo").val();
	$.each(showhandcards,function(k,v){
		var showhandcardsNode = _createXmlNode("showhandcards");
			showhandcardsNode.textContent = v;
			datas.appendChild(showhandcardsNode);
	});
	$.each(winners,function(k,v){
		var winnersNode = _createXmlNode("winplayer");
			winnersNode.textContent = v;
			datas.appendChild(winnersNode);
	});
	datas.appendChild(classinfo);
 }
 
 
 //相应操作行为
 function d_act(act){
	
	switch(act){
		case "prev"		:d_init($("#bodys"));d_prev();break;
		case "prevkj"	:
		case "show"		:d_init($("#bodys"));d_show();break;
		case "save"		:d_init($("#bodys"));d_save();break;
		case "close"	:d_close();break;
	}
 }
 

 function d_show(){
	//console.log(xs.serializeToString(datas));
 }
 
 function d_close(){
	if(confirm($("#info>.opconfirm").html())){
		top.$.fancybox.close();
	}
 }
 
 function d_prev(){
	var nprevWin = window.open("data:text/xml;charset=UTF-8,"+encodeURIComponent(xs.serializeToString(datas)));
 }
 
 function d_save(){
	$.ajax({
	   type: "POST",
	   url: "save.php?id="+$("#info>.opid").html(),
	   data: xs.serializeToString(datas),
	   success: function(msg){
		 var t = $.parseJSON(msg);
			if(t.tag=="OK"){
				alert( $("#info>.success").html() );
			}else{
				$.fancybox({content:t.message});
			}
	   }
	});
 }
 
 function _createXmlNode(k){
	var oNode = oXmlDom.documentElement;
	var oNodeObj = document.createElement(k);
	oNode  = oNodeObj;
	return oNode;
 }
 
  function _createXmlAttr(k,v){
	var oNode = oXmlDom.documentElement;
	var oNodeObj = document.createAttribute(k);
	oNodeObj.value = v;
	oNode  = oNodeObj;
	return oNode;
 }