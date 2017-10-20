<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN" "http://www.w3.org/TR/REC-html40/loose.dtd">
<html>
  <head>
	<script language="JavaScript" type="text/javascript" src="${pageContext.request.contextPath}/SYSTEM/resources/js/jad.js"></script> 
    <script language="JavaScript" type="text/javascript" src="${pageContext.request.contextPath}/SYSTEM/resources/js/common.js"></script>
	<script language="JavaScript" type="text/javascript" src="/dynamicviews/js/afrous-widget-plugin-all.js"></script>
    <script type="text/javascript">
    
		afrous.widget.setOnParamChangeCallback(function(params){
			if(typeof $W().LogManager != 'undefined'){
				handleRuntime(params.message, params.level);
			}else{
				handleDesigner(params.message, params.level);
			}
		});

		//Will be executed on runtime
		function handleRuntime(message, level) {
			if(level == 'fatal') $W().LogManager.getLogger("DVLogger").fatal(message);
			else if(level == 'error') $W().LogManager.getLogger("DVLogger").error(message);
			else if(level == 'warn') $W().LogManager.getLogger("DVLogger").warning(message);
			else if(level == 'info') $W().LogManager.getLogger("DVLogger").info(message);
			else if(level == 'debug') $W().LogManager.getLogger("DVLogger").debug(message);
		}

		//Will be executed on designtime 
		function handleDesigner(message, level) {
			if(level == 'fatal' || level == 'error' || level == 'warn' || level == 'info' || level == 'debug'){
				printMessage(level + ": " + message, false);
			}else{
				printMessage("Invalid log level. Please select a log level from the drop-down list", true);
			}
		}

		function printMessage(message, error){
			var div = document.createElement('div');
			if(error) div.style.color = 'red';
			div.appendChild(document.createTextNode(message));
			var debugDiv = document.getElementById("loggerDebugPrint");
			debugDiv.insertBefore(div, debugDiv.firstChild);
		}
		
</script>
	</head>
	<body style="margin:0;padding:0;font-size:10px">
    <div id=loggerDebugPrint></div>
	</body>
</html>

