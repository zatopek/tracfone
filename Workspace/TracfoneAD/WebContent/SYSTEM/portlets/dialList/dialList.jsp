
<%@ page language="java" contentType="text/html;charset=UTF-8"%>
<html>
<head>
	<script language="JavaScript" type="text/javascript" src="<%=request.getContextPath()%>/SYSTEM/resources/js/jad.js"></script>
	<script>
		// Component url - used to load data from the server
		var DialList_JSON_URL = "${pageContext.request.contextPath}/dialList.json";
	</script>

	<script type="text/javascript" src="${pageContext.request.contextPath}/SYSTEM/portlets/dialList/dialList.js"></script>
</head>

<body onkeydown="onKeyDownHandler();">
	<div id="dialListDiv"></div>
</body>
</html>
