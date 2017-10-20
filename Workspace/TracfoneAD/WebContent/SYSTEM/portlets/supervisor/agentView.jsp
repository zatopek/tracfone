<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<%@ page import="com.jacada.jad.supervisor.entities.Groups"%>

<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<title>Insert title here</title>
<link
	href="<%=request.getContextPath()%>/SYSTEM/portlets/supervisor/supervisor.css"
	type="text/css" rel="stylesheet">
<style>
.add24 {
    background-image: url("SYSTEM/portlets/supervisor/images/chat.gif") !important;
    color: #444;
    display: block;
    float: left;
    font: normal 12px arial, sans-serif;
    height: 24px;
    margin-right: 6px;
    padding-right: 18px; /* sliding doors padding */
    text-decoration: none;
}
</style>
<script>
	// used to load data from the server
	var Spvcontroller_JSON_URL = "${pageContext.request.contextPath}/Spvcontroller.json";
	// the Agent Task view url
	var AGENT_TASK_URL = "${pageContext.request.contextPath}/supervisorTaskManager.json"
	var groups = [];
	var contextpath = "${pageContext.request.contextPath}";
	var chatEnable = <%=request.getAttribute("isChatEnabled")%>//true;
	var pagingEnable = true;
	var agentTaskEnable = <%=request.getAttribute("isAgentTaskEnabled")%>
	deleteTasksPrivileged = false;
	editFellowTeamMemberTasksPrivileged = true;
</script>
<%
	// set attribute to true if extJs should be included
	request.setAttribute("isExtJsComponent", true);
%>


<%@ include file = "/SYSTEM/resources/jspf/includes/extjsPortletIncludes.jspf"%>
<% 	Groups  gs= (Groups)request.getAttribute("groups");
	String[] strs = gs.getAllByName();
	for (int i =0 ; i< strs.length ; i ++) {
		%>
			<script>		
				groups.push("<%=strs[i]%>"); 
			</script>
		<% 
	}
%>
<script type="text/javascript">
		
		 var UTILS_JS_URL = "${pageContext.request.contextPath}/SYSTEM/portlets/supervisor/actions/utils.js";
		 var REASSIGN_JS_URL = "${pageContext.request.contextPath}/SYSTEM/portlets/supervisor/actions/reassign.js";
		 var ADDTASK_JS_URL = "${pageContext.request.contextPath}/SYSTEM/portlets/supervisor/actions/addTask.js";
		 var ADDTASKTOGROUP_JS_URL = "${pageContext.request.contextPath}/SYSTEM/portlets/supervisor/actions/addTaskToGroup.js";
		 var AGENT_TASK_JS_URL = "${pageContext.request.contextPath}/SYSTEM/portlets/supervisor/views/agentTask.js";
		 var AGENTS_VIEW_JS_URL = "${pageContext.request.contextPath}/SYSTEM/portlets/supervisor/views/agentsView.js";
		 var START_CHAT_JS_URL = "${pageContext.request.contextPath}/SYSTEM/portlets/supervisor/actions/startChat.js";
		 var USER_AGENT_VIEW_JS_URL = "${pageContext.request.contextPath}/USER/portlets/supervisor/views/agentsView.js";
		 var SUMMARY_VIEW_JS_URL = "${pageContext.request.contextPath}/SYSTEM/portlets/supervisor/views/summaryView.js";
	</script>
<script type="text/javascript">
</script>

<script language="JavaScript" type="text/javascript" src="<%=request.getContextPath()%>/USER/resources/js/override.js"></script>
<script src="${pageContext.request.contextPath}/SYSTEM/resources/js/extJS-extensions/ext-DateTime.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/SYSTEM/resources/js/yahoo/js/yui3/yui-min.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/USER/portlets/supervisor/config/taskToolBar.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/USER/portlets/supervisor/config/agentViewGridColModel.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/USER/portlets/supervisor/agentsMainView.js"></script>

</head>
<body>
<script type="text/javascript">
</script>
<div id='crtl2'> </div>


</body>
</html>