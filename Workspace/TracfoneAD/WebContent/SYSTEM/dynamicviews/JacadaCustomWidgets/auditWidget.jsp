<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN" "http://www.w3.org/TR/REC-html40/loose.dtd">
<html>
<head>
	<title></title>
	<script language="JavaScript" type="text/javascript" src="/dynamicviews/js/afrous-widget-plugin-all.js"></script>
	<!-- No need to whole jad.js. We need an access to the main window only -->
	<script type="text/javascript">
		var $W = getMainWindow;
		var theNewW = findMainWindow();
	
		function findMainWindow() {
			var w = window;
			while (w != w.parent) {
				w = w.parent;
			}
	
			while (w.opener != null) {
				w = w.opener;
			}
	
			while (w != w.parent) {
				w = w.parent;
			}
	
			return w;
		}
		//private method 
		function getMainWindow() {
			return theNewW;
	
		}
	</script>
	
	<!-- Widget code -->
	<script type="text/javascript">
		afrous.widget.setOnParamChangeCallback(function(params) {
			//If sendAuditEvent exists we run inside WorkSpace.
			//If not, it's designer mode and we need to print debug messages
			if(typeof $W().sendAuditEvent == 'function'){
				auditAction(params);
			}else{
				debug(params);
			}
		});
		
		function auditAction(params) {
			if(typeof $W().sendAuditEvent == 'function'){
				var scope = '';
				if(params.actionScope == 'Interaction'){
					scope = 'interaction';
				}else if(params.actionScope == 'Session'){
					scope = 'agentSession';
				}
				$W().sendAuditEvent(params.actionName, scope, params.paramName, params.paramValue);
			}
		}
	
		function debug(params) {
			if(params.actionScope != 'Interaction' && params.actionScope != 'Session'){
				printMessage("Invalid action scope. Please select an action scope from the drop-down list", true);
			}else{
				var msg = "Action Name: " + params.actionName + ", Action Scope: " + params.actionScope + 
				", Parameter Name: " + params.paramName + ", Parameter Value: " + params.paramValue;
				printMessage(msg, false);
			}
		}

		function printMessage(message, error){
			var div = document.createElement('div');
			if(error) div.style.color = 'red';
			div.appendChild(document.createTextNode(message));
			var debugDiv = document.getElementById("auditDebugPrint");
			debugDiv.insertBefore(div, debugDiv.firstChild);
		}
	</script>
</head>
<body style="margin: 0; padding: 0; font-size: 10px">
	<div id="auditDebugPrint"></div>
</body>
</html>

