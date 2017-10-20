
<html>

<%@ page import="com.jacada.jad.jimworkflow.interfaces.JIMWorkflowManager"%>
<%@ page import="org.apache.beehive.netui.pageflow.PageFlowUtils" %>

<head>
<!-- Note: since this is a html page (and not jsp) we couldnt get the context path of the "src" below -->
<!-- from the request, neither could we retrieve it from the document location using javascript (you cannot write javascript inside a src of "script" tag, the possible solition as seen below was to use relative path with "../js" -->
<script language="JavaScript" type="text/javascript" src="../js/common.js"></script>
	</head>
<body onkeydown="onKeyDownHandler(event);">   
	<%
	SYSTEM.global.SharedData globalApp = (SYSTEM.global.SharedData)PageFlowUtils.getSharedFlow(SYSTEM.global.SharedData.class.getName(), request, request.getSession().getServletContext());
	JIMWorkflowManager workflowManager = globalApp.getJIMWorkflowManager(); 
	%>
	<div><%=workflowManager.getErrorPageContent() %></div>
	
	</body>
</html>