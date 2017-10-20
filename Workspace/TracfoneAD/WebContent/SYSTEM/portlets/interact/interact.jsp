<%@ page language="java" contentType="text/html;charset=UTF-8"%>

<html>
<head>
<title>Interaction</title>
<script type="text/javascript"
	src="<%=request.getContextPath()%>/SYSTEM/resources/js/jad.js"></script>
<script src="jquery/js/jquery-1.9.1.js"></script>
<script src="plugins/postmessage.js"></script>
<script src="js/remoteagentapp.js"></script>
</head>
<body>

	<div id='container' style="height: 100%; width: 100%;"></div>

	<script>
	var requestInteractionId = "<%=request.getParameter("interactionId")%>";

		$(function() {
			options = {
				layout : {
					height : "100%",
					width : "100%",
					showSearch : false,
					theme: 'jquery/css/cupertino/jquery-ui-1.10.3.custom.css' //blue style
				},
				connection : {
					accessToken: $W().interact.accessToken,
					server : $W().interact.host,
					accountId : $W().interact.tenantId,
					queryString:"wsSessionId=" + $W().wsEncodedSessionId + "&wsSessionCookieName=" + $W().wsSessionCookieName + "&integrationService=" + $W().interact.integrationService + "/rest/interactIntegration"
				},
				authentication : {
					applicationKey : $W().interact.appKey,
					agentId: $W().agentName
				},
				autostart : {
					interactionId : requestInteractionId
				}
			};
			window.agentApp = new AgentApp($('#container'), options);

			window.agentApp.registerEvent('interactionEnded', function(params) {
				window.location = "about:blank";
			});


		});
	</script>
</body>
</html>