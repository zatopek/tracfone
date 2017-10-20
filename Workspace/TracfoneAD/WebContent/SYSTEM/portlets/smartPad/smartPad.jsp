<%@ page language="java" contentType="text/html;charset=UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>

<%@page import="org.springframework.context.ApplicationContext"%>
<%@page import="org.springframework.web.context.support.WebApplicationContextUtils"%>
<%@page import="com.jacada.jad.toolbar.interfaces.ToolbarManager"%>
<%@page import="com.jacada.jad.smartPad.interfaces.SmartPadManagerHandler"%>
<HTML>

<head>
    <%
	String portletToolBarId = "SmartPadWindow";
	request.setAttribute(ToolbarManager.PORTLET_TOOLBAR_KEY, portletToolBarId);
	%>
	<%@ include file = "/SYSTEM/resources/jspf/includes/extjsPortletIncludes.jspf"%>
	<%
	SmartPadManagerHandler smartPadManager = (SmartPadManagerHandler) applicationContext.getBean("smartPadManager");
	%>		
	<script language="JavaScript" type="text/javascript" src="<%=request.getContextPath()%>/SYSTEM/resources/js/common.js"></script>
	 
	<link href="<%=request.getContextPath()%>/SYSTEM/resources/css/smartPad.css" rel="stylesheet" type="text/css"/>
	<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/USER/resources/css/override.css">
	
	<script type="text/javascript">
		var globalPreferences = new Object();
		var userPreferences = new Object();
	
		globalPreferences.hideColumns=<%=smartPadManager.isHideColumns()%>;
		globalPreferences.sortColumns=<%=smartPadManager.isSortColumns()%>;
		globalPreferences.maximumEntries=<%=smartPadManager.getMaximumEntries()%>;
		globalPreferences.emptyEntryPosition='<%=smartPadManager.getEmptyEntryPosition()%>';
		globalPreferences.isInManualMode=<%=smartPadManager.isInManualMode()%>;
		
		userPreferences=<%=smartPadManager.getUserPreferences()%>;
	</script>
	
	<script type="text/javascript" src="<%=request.getContextPath()%>/SYSTEM/portlets/smartPad/smartPadGrid.js"></script>
	<script type="text/javascript" src="<%=request.getContextPath()%>/SYSTEM/portlets/smartPad/smartPadActiveX.js"></script>
	<script type="text/javascript" src="<%=request.getContextPath()%>/SYSTEM/portlets/smartPad/changeShortcutsForm.js"></script>
	<script type="text/javascript" src="<%=request.getContextPath()%>/SYSTEM/portlets/smartPad/smartPadManager.js"></script>
    <script type="text/javascript" src="<%=request.getContextPath()%>/SYSTEM/resources/js/extJS-extensions/jacada/overrideToExtJS.js"> </script>
	<script language="JavaScript" type="text/javascript" src="<%=request.getContextPath()%>/USER/resources/js/override.js"></script>  		
</head>
<body onkeydown="onKeyDownHandler(event);">
	<div id="smartPadEntriesGridDIV"></div>
</body>
</HTML>