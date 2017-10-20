<%@ page language="java" contentType="text/html;charset=UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@page import="org.springframework.context.ApplicationContext"%>
<%@page import="org.springframework.web.context.support.WebApplicationContextUtils"%>
<%@page import="com.jacada.jad.toolbar.interfaces.ToolbarManager"%>
<%@page import="com.jacada.jad.agentDisposition.DispositionManagerHandler"%>
<%
response.setHeader("Cache-Control","no-cache"); //HTTP 1.1
response.setHeader("Pragma","no-cache"); //HTTP 1.0
response.setDateHeader ("Expires", 0); //prevents caching at the proxy server
%>
<html>
<head>
	<script>
        var AGENT_DISPOSITION_JSON_URL = "${pageContext.request.contextPath}/agentDisposition.json";
    </script>
    
    <%
	String portletToolBarId = "AgentDispositionWindow";
	request.setAttribute(ToolbarManager.PORTLET_TOOLBAR_KEY, portletToolBarId);
	%>
	<%@ include file = "/SYSTEM/resources/jspf/includes/extjsPortletIncludes.jspf"%>
	<%
    DispositionManagerHandler dispositionManager = (DispositionManagerHandler)applicationContext.getBean("dispositionManager");
	%>
    <script>
        //get initital parameters fore the UI
        //defines the working mode 'flat' or 'heirarchical'
         codeHierarchy = "<%=dispositionManager.isCodeHierarchy()%>";
        //defines the total comboboxes to show
         dispositionCount = "<%=dispositionManager.getDispositionCount()%>";
        //defines whether the advanced disposition ui will be shown or only agent's notes
         dispositionEnabled = "<%=dispositionManager.isDispositionEnabled()%>";
       //defines whether the advanced disposition ui will be shown or only agent's notes
         agentInDispositionState = eval("<%=dispositionManager.isAgentInDispositionState()%>");
       //defines whether to load only first level (codes where parent code = null)
         loadOnlyFirstLevel = "<%=dispositionManager.isLoadOnlyFirstLevel()%>";
       //defines whether the automatic disposition popup is enabled
         autoDispositionEnabled = <%=dispositionManager.isAutomaticDispositionEnabled()%>;
         showCallbackButton = <%=dispositionManager.isShowCallbackButton()%>;
    </script>
    <script type="text/javascript" src="${pageContext.request.contextPath}/SYSTEM/portlets/agentDisposition/agentDisposition.js"></script>
    
</head>
<body onkeydown="onKeyDownHandler(event);">
	<div id="agentDisposition"></div>
</body>
</html>
