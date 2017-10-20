<%@ page language="java" contentType="text/html;charset=UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@page import="org.springframework.context.ApplicationContext"%>
<%@page import="org.springframework.web.context.support.WebApplicationContextUtils"%>
<%@page import="com.jacada.jad.toolbar.interfaces.ToolbarManager"%>
<html>
<head>
	<title>ContactList Prototype</title>
    <%
		String portletToolBarId = "ChatWindow";
		request.setAttribute(ToolbarManager.PORTLET_TOOLBAR_KEY, portletToolBarId);
	%>
	<script language="JavaScript" type="text/javascript" src="<%=request.getContextPath()%>/SYSTEM/resources/js/jad.js"></script>
    <script>
        var CONTACT_LIST_JSON_URL = "${pageContext.request.contextPath}/contactList.json";
        var CURRENT_USER = "${ctiManager.agentInformation.name}";
        
        ////////////////// Contact list search /////////////////
        // set the minimum number of chars a user needs to type 
		// before sending the search request to the server
		var SEARCH_MIN_CHARS = 1;
		
		// Number of results to display in a single page of the search combo
		var SEARCH_RESULTS_PAGE_SIZE = 10;
		
		////////////////// Chat portlet size constant /////////////////
		// initial width of the tab set
		var TABS_WIDTH				= 110;
		
		var CHAT_DATE_FORMAT	= $W().DATE_FORMAT;
		var CHAT_TIME_FORMAT	= $W().TIME_FORMAT;
        
        var contextPath = "<%=request.getContextPath()%>/SYSTEM/portlets/chat/";
        // portlet name must match the id defined for the portlet in the toolbar or portlet xml file:
        var portletName = "<%=portletToolBarId%>";
    </script>
	<%@ include file = "/SYSTEM/resources/jspf/includes/extjsPortletIncludes.jspf"%>
    <c:if test="<%=notInToolbar%>">
      	<script>
	    	contextPath = "";
	    </script>
    </c:if>
    <link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/SYSTEM/resources/css/messaging.css" />
	<script language="JavaScript" type="text/javascript" src="<%=request.getContextPath()%>/SYSTEM/resources/js/common.js"></script>      
    <script type="text/javascript" src="${pageContext.request.contextPath}/SYSTEM/portlets/chat/chat.js"></script>
        
     <!-- x-grid3-header-offset was added because of extjs bug in gridpanel auto width -->
    <style  type="text/css">
		.x-grid3-header-offset {width:auto;}
	</style>
    
</head>
<body onkeydown="onKeyDownHandler(event);">
    <center>
        <div id="formPlaceholder"></div>
    </center>
</body>
</html>
