<%@ page language="java" contentType="text/html;charset=UTF-8"%>
<%
response.setHeader("Cache-Control","no-cache"); //HTTP 1.1
response.setHeader("Pragma","no-cache"); //HTTP 1.0
response.setDateHeader ("Expires", 0); //prevents caching at the proxy server
%>
<HTML>

<head>
	<script language="JavaScript" type="text/javascript" src="<%=request.getContextPath()%>/SYSTEM/resources/js/jad.js"></script>
	<script type="text/javascript">
		var UTILS_JS_URL = "${pageContext.request.contextPath}/SYSTEM/portlets/supervisor/actions/utils.js";
		var ADDTASK_JS_URL = "${pageContext.request.contextPath}/SYSTEM/portlets/supervisor/actions/addTask.js";
		var TASK_DATE_FORMAT = $W().DATE_FORMAT;
		var TASK_TIME_FORMAT = $W().TIME_FORMAT;
	</script>
<script type="text/javascript" src="${pageContext.request.contextPath}/SYSTEM/resources/js/yahoo/js/yui3/yui-min.js"></script>
<script> 
       extPersonalizationInit(document, '${pageContext.request.contextPath}');
       function getLocalizationValue(key){
			return $W().localeManager.getLocalizationValue(key);
		}
		
		// set the blank image url to an image inside the application
		Ext.BLANK_IMAGE_URL = '<%=request.getContextPath()%>/SYSTEM/resources/js/extJS/resources/images/default/s.gif';
    </script>
    <script language="JavaScript" type="text/javascript" src="<%=request.getContextPath()%>/SYSTEM/resources/js/common.js"></script>
	<script language="JavaScript" type="text/javascript" src="<%=request.getContextPath()%>/SYSTEM/portlets/taskManager/newTaskForm.js"></script>
	<script language="JavaScript" type="text/javascript" src="<%=request.getContextPath()%>/USER/resources/js/override.js?callback"></script> 
</head> 
<body onkeydown="onKeyDownHandler(event);" style="background-color:transparent">
	<div id="callback"></div>
</body>
</HTML>