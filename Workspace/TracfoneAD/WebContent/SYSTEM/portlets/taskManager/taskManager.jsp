<%@ page language="java" contentType="text/html;charset=UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@page import="com.jacada.jad.toolbar.interfaces.ToolbarManager"%>
<%@ page import="com.jacada.jad.rap.provider.Authorization"%>
<%@ page import="com.jacada.jad.rap.entities.RAPConstants.Privileges"%>
<%
response.setHeader("Cache-Control","no-cache"); //HTTP 1.1
response.setHeader("Pragma","no-cache"); //HTTP 1.0
response.setDateHeader ("Expires", 0); //prevents caching at the proxy server
%>
<HTML>

<head>
	<script type="text/javascript">
		
		 var UTILS_JS_URL = "${pageContext.request.contextPath}/SYSTEM/portlets/supervisor/actions/utils.js";
		 var REASSIGN_JS_URL = "${pageContext.request.contextPath}/SYSTEM/portlets/supervisor/actions/reassign.js";
		 var ADDTASK_JS_URL = "${pageContext.request.contextPath}/SYSTEM/portlets/supervisor/actions/addTask.js";
		 var ADDTASKTOGROUP_JS_URL = "${pageContext.request.contextPath}/SYSTEM/portlets/supervisor/actions/addTaskToGroup.js";
		 var AGENT_TASK_JS_URL = "${pageContext.request.contextPath}/SYSTEM/portlets/supervisor/views/agentTask.js";
	</script>
	<script type="text/javascript" src="${pageContext.request.contextPath}/SYSTEM/resources/js/yahoo/js/yui3/yui-min.js"></script>
	<script language="JavaScript" type="text/javascript" src="<%=request.getContextPath()%>/SYSTEM/resources/js/jad.js"></script>
	<script type="text/javascript">
		var TASK_DATE_FORMAT = $W().DATE_FORMAT;
		var TASK_TIME_FORMAT = $W().TIME_FORMAT;
	</script>

	<link rel="stylesheet" type="text/css" href="<%=request.getContextPath()%>/SYSTEM/resources/css/taskManager.css">
	<%
	String portletToolBarId = "TaskManagerWindow";
	request.setAttribute(ToolbarManager.PORTLET_TOOLBAR_KEY, portletToolBarId);
	%>
	<%@ include file = "/SYSTEM/resources/jspf/includes/extjsPortletIncludes.jspf"%>
	<%
	Authorization authorization = (Authorization)applicationContext.getBean(Authorization.AUTHORIZATION_BEAN);
	%>
	<script>
		viewPrivileged = <%=authorization.isPrivileged(Privileges.TasksTeamView.getPrivilege())%>;
		editFellowTeamMemberTasksPrivileged = <%=authorization.isPrivileged(Privileges.EditFellowTeamMemberTasks.getPrivilege())%>;
		deleteTasksPrivileged = <%=authorization.isPrivileged(Privileges.DeleteTasks.getPrivilege())%>;
	</script>

<script src="${pageContext.request.contextPath}/SYSTEM/resources/js/extJS-extensions/ext-DateTime.js"></script>

<script language="JavaScript" type="text/javascript" src="<%=request.getContextPath()%>/SYSTEM/portlets/supervisor/actions/utils.js"></script>
<script language="JavaScript" type="text/javascript" src="<%=request.getContextPath()%>/SYSTEM/portlets/supervisor/actions/addTask.js"></script>
<script language="JavaScript" type="text/javascript" src="<%=request.getContextPath()%>/SYSTEM/portlets/supervisor/actions/reassign.js"></script>
<script language="JavaScript" type="text/javascript" src="<%=request.getContextPath()%>/SYSTEM/portlets/supervisor/actions/addTaskToGroup.js"></script>
<script language="JavaScript" type="text/javascript" src="<%=request.getContextPath()%>/SYSTEM/portlets/supervisor/views/agentTask.js"></script> 
<script language="JavaScript" type="text/javascript" src="<%=request.getContextPath()%>/SYSTEM/portlets/taskManager/taskManager.js"></script>


</head>
<body onkeydown="onKeyDownHandler(event);" style="background-color:transparent">
<div id="tasks"></div>
</body>
</HTML>