<%@ page language="java" contentType="text/html;charset=UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@page import="org.springframework.context.ApplicationContext"%>
<%@page import="org.springframework.web.context.support.WebApplicationContextUtils"%>
<%@page import="com.jacada.jad.toolbar.interfaces.ToolbarManager"%>
<%@page import="com.jacada.jad.search.interfaces.SearchManager"%>
<%@page import="com.jacada.jad.search.web.SearchJsonController"%>
<html>


<head>
    <title>Search portlet</title>
    <script>
        var SEARCH_JSON_URL = "${pageContext.request.contextPath}/search.json";
        var inToolBar = false;
    </script>
    
	<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/SYSTEM/portlets/search/search.css" />
    <%
	String portletToolBarId = "SearchWindow";
	request.setAttribute(ToolbarManager.PORTLET_TOOLBAR_KEY, portletToolBarId);
	%>
	<%@ include file = "/SYSTEM/resources/jspf/includes/extjsPortletIncludes.jspf"%>
	
	<%
    SearchManager searchManager = (SearchManager)applicationContext.getBean("searchManager");
	%>
    <script>
 		// where should the search result be opened. Default 'Search Result' tab
    	var documentLocation = "<%=searchManager.getDocumentLocation()%>";
    	//setting the message attribute in the client side
    	 var ERROR_MESSAGE_ATTR = "<%=SearchJsonController.ERROR_MESSAGE%>";
    </script>
	
	<script language="JavaScript" type="text/javascript" src="<%=request.getContextPath()%>/SYSTEM/resources/js/searchCommon.js"></script>
    <script type="text/javascript" src="${pageContext.request.contextPath}/SYSTEM/portlets/search/search.js"></script>
    
</head>
<body onkeydown="onKeyDownHandler(event);">
    <div id="formPlaceholder"></div>
</body>
</html>