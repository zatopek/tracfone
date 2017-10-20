<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN" "http://www.w3.org/TR/REC-html40/loose.dtd">
<html>
	<head>
	    <script language="JavaScript" type="text/javascript" src="${pageContext.request.contextPath}/SYSTEM/resources/js/extJS/adapter/ext/ext-base.js"></script>
		<script language="JavaScript" type="text/javascript" src="${pageContext.request.contextPath}/SYSTEM/resources/js/extJS/ext-all.js"></script>
	  	<script language="JavaScript" type="text/javascript" src="${pageContext.request.contextPath}/SYSTEM/resources/js/prototype.js"></script>
		<script language="JavaScript" type="text/javascript" src="${pageContext.request.contextPath}/SYSTEM/resources/js/jad.js"></script>
	    <script language="JavaScript" type="text/javascript" src="${pageContext.request.contextPath}/SYSTEM/resources/js/common.js"></script>
		<script language="JavaScript" type="text/javascript" src="${pageContext.request.contextPath}/SYSTEM/resources/js/push.js"></script>
		<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/SYSTEM/resources/js/extJS/resources/css/ext-all.css" /> 
		<script language="JavaScript" type="text/javascript" src="/dynamicviews/js/afrous-widget-plugin-all.js"></script>
		
	    <script type="text/javascript">
			var isDebugMode = null;
			var pushKeyword = null;
			var intervalID = null;
			var isFirstChange = true;
			
			afrous.widget.setOnParamChangeCallback(function(params){
				isDebugMode = params.debug;
				pushKeyword = params.keyword;
				if(typeof $W().Push != 'undefined'){
					registerToPushEvent();
				}else{
					if(isFirstChange){
						createStubPushEvent();
						isFirstChange = false;
					}
				}
			});
			
		</script>
		
		<script>
		
		//This function is executed on runtime
		function registerToPushEvent() {
			$W().Push.registerEventHandler(pushKeyword, onPushEvent);
		}
		
		//This function is executed on designtime 
		function createStubPushEvent(){
			Ext.onReady(function(){
				var label = new Ext.form.Label( {
					renderTo : 'result',
					text : 'Fire Push event in order to associate a widget with a push message:'
				});
				var btn = new Ext.Button( {
					renderTo : 'result',
					text : 'Fire Push event',
					handler : function() { 
					  var date = new Date();
					  var data = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
					  firePushEvent(data);
					  if (isDebugMode) debug(data);
					}
				});
			}); 
		}

		//Push handler(on runtime)
		function onPushEvent(pushdata){
			firePushEvent(pushdata);
		}

		//Prints debug message to the widget (on design time)
		function debug(data){
			var value = "Push Keyword: " + pushKeyword + ", Push data: " + data;;
			var div = document.createElement('div');
			div.appendChild(document.createTextNode(value));
			document.getElementById("result").appendChild(div);
		}
	
		function firePushEvent(value){
			afrous.widget.fireEvent('push', {data : value});
		}
		
		</script>
		
	</head>
	<body style="margin:0;padding:0;font-size:10px">
    <div id="result"></div>
	</body>
</html>

