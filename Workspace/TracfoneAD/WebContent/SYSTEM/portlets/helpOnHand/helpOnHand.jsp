<%@ page language="java" contentType="text/html;charset=UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@page import="org.springframework.context.ApplicationContext"%>
<%@page import="org.springframework.web.context.support.WebApplicationContextUtils"%>
<%@page import="com.jacada.jad.toolbar.interfaces.ToolbarManager"%>

<HTML>

<head>
<title>Help On Hand portlet</title>
<script>
        var HELPONHAND_JSON_URL = "${pageContext.request.contextPath}/helpOnHand.json";
</script>
<link rel="stylesheet" type="text/css" href="<%=request.getContextPath()%>/SYSTEM/resources/css/helpOnHand.css">
	<%
	String portletToolBarId = "HelpOnHandWindow";
	request.setAttribute(ToolbarManager.PORTLET_TOOLBAR_KEY, portletToolBarId);
	%>
	<%@ include file = "/SYSTEM/resources/jspf/includes/extjsPortletIncludes.jspf"%>


<script language="JavaScript" type="text/javascript" src="<%=request.getContextPath()%>/SYSTEM/resources/js/searchCommon.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/SYSTEM/portlets/helpOnHand/helpOnHand.js"></script>

 
</head>
<body onkeydown="onKeyDownHandler(event);">
	<div id="helpMsg"></div>
	<div id="helpOnHand"></div>
</body>
</HTML>