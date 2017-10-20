<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN" "http://www.w3.org/TR/REC-html40/loose.dtd">
<html>
	<head>
	    <script language="JavaScript" type="text/javascript" src="${pageContext.request.contextPath}/SYSTEM/resources/js/extJS/adapter/ext/ext-base.js"></script>
		<script language="JavaScript" type="text/javascript" src="${pageContext.request.contextPath}/SYSTEM/resources/js/extJS/ext-all.js"></script>
	  	<script language="JavaScript" type="text/javascript" src="${pageContext.request.contextPath}/SYSTEM/resources/js/prototype.js"></script>
		<script language="JavaScript" type="text/javascript" src="${pageContext.request.contextPath}/SYSTEM/resources/js/jad.js"></script>
	    <script language="JavaScript" type="text/javascript" src="${pageContext.request.contextPath}/SYSTEM/resources/js/common.js"></script>
		<script language="JavaScript" type="text/javascript" src="${pageContext.request.contextPath}/SYSTEM/resources/js/push.js"></script>
		<script language="JavaScript" type="text/javascript" src="${pageContext.request.contextPath}/USER/resources/dynamicViews/dashboardProperties/dashboardProperties.js"></script>
		<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/SYSTEM/resources/js/extJS/resources/css/ext-all.css" /> 
		<script language="JavaScript" type="text/javascript" src="/dynamicviews/js/afrous-widget-plugin-all.js"></script>
		
	    <script type="text/javascript">
			var startCallKeyword = "startCall";
			var endCallKeyword = "endCall";
			var startDispositionKeyword = "startDisposition";
			var endDispositionKeyword = "endDisposition";
			var isFirstChange = true;
			 
			afrous.widget.setOnParamChangeCallback(function(params){
				if(typeof $W().Push != 'undefined'){
					registerToPushEvent();
				}else{
					//designer mode
					if(isFirstChange){
						loadLocalizedValues();
						createStubPushEvent();
						isFirstChange = false;
					}
				}
			});
			
		</script>
		
		<script>
		
		//This function is executed on runtime
		function registerToPushEvent() {
			$W().Push.registerEventHandler(startCallKeyword, handleStartCall);
			$W().Push.registerEventHandler(endCallKeyword, handleEndCall);
			$W().Push.registerEventHandler(startDispositionKeyword, handleStartDisposition);
			$W().Push.registerEventHandler(endDispositionKeyword, handleEndDisposition);
		}

		//load all keys for dynamic views
		function loadLocalizedValues(){
			var conn = new Ext.data.Connection();
			conn.request({
		        url: "${pageContext.request.contextPath}"+'/translationDict',
		        method: 'GET',
				disableCaching: true,
		        success: function(responseObject) {
		        	$W().dashboardPropertiesKeys = eval("(" + responseObject.responseText + ")");
		        }
		    });
		}
		
		//This function is executed on designtime 
		function createStubPushEvent(){
			Ext.onReady(function(){
				var label = new Ext.form.Label( {
					renderTo : 'result',
					text : 'Bind properties to be updated upon cti state changes:'
				});
				var minButtonWidth = 150;
				var panel = new Ext.Panel({
					renderTo : 'result',
					bodyStyle:'padding:15px',
					defaultType: 'button',
					  frame: false,
					  border: false,
					  items: [{
						  text : 'Start Call',
						  minWidth: minButtonWidth,
							handler : function() { 
						  		var data = $W().startCallDashboardProperties();
						  		handleStartCall(data);
							}
				        },{
				        	text : 'End Call',
				        	minWidth: minButtonWidth,
				        	handler : function() { 
				        		var data = $W().endCallDashboardProperties();
				        		handleEndCall(data);
							}
				        },{
				        	text : 'Start Disposition',
				        	minWidth: minButtonWidth,
				        	handler : function() { 
				        		var data = $W().startDispositionDashboardProperties();
				        		handleStartDisposition(data);
							}
				        },{
				        	text : 'End Disposition',
				        	minWidth: minButtonWidth,
				        	handler : function() { 
				        		var data = $W().endDispositionDashboardProperties();
				        		handleEndDisposition(data);
							}
				        }
				    ]
					});
			}); 
		}

		//Push handler(on runtime)
		function handleStartCall(pushdata){
			firePushEvent(startCallKeyword, pushdata);
		}
		function handleEndCall(pushdata){
			firePushEvent(endCallKeyword, pushdata);
		}
		function handleStartDisposition(pushdata){
			firePushEvent(startDispositionKeyword, pushdata);
		}
		function handleEndDisposition(pushdata){
			firePushEvent(endDispositionKeyword, pushdata);
		}

		function firePushEvent(key, value){
			afrous.widget.fireEvent(key, value);
		}
		
		</script>
		
	</head>
	<body style="font-size:12px">
    <div id="result"></div>
	</body>
</html>

