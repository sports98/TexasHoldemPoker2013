if(typeof($)=="undefined"){
	document.getElementById("bodys").innerHTML = "Init Fail! jQuery not defined! please try .";
}else{
	$(function(){
		var content = $('#htmlTemplate').html();
		var filter = /\{%([a-zA-Z0-9\-\_]*)%\}/mig;
		var vl = content.match(filter);	
		var k = new Array();
		var lf = /\{%/g;
		var rl = /%\}/g;
		$.each(vl,function(i,x){
			k.push(x);
		});
		var kString = k.join(",");
		kString = kString.replace(lf,'');
		kString = kString.replace(rl,'');
		$.ajax({
		  url: "template.php",
		  type:'post',
		  data:"keys="+encodeURIComponent(kString),
		  success: function(html){
			applyTemplate(html);
			init();
		  }
		});
	});
}
function applyTemplate(templateInfo){
	var temp = $.parseJSON(templateInfo);
	var newContent = $("#htmlTemplate").html();
	$.each(temp,function(k,v){
		eval('var re = /\{%'+k+'%\}/g;');
		try{
		newContent = newContent.replace(re,v);
		}catch(e){}
		re = null;
	});
	$("#bodys").html(newContent);
}