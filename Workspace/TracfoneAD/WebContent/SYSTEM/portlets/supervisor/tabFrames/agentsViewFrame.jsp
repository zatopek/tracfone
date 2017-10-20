<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
    <%@ taglib uri="http://beehive.apache.org/netui/tags-databinding-1.0" prefix="netui-data"%>
<%@ taglib uri="http://beehive.apache.org/netui/tags-html-1.0" prefix="netui"%>
<%@ taglib uri="http://beehive.apache.org/netui/tags-template-1.0" prefix="netui-template"%>


<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<title>Insert title here</title>
<script>
	// Component url - used to load data from the server
	var Spvcontroller_JSON_URL = "${pageContext.request.contextPath}/Spvcontroller.json";
</script>
<%
	// set attribute to true if extJs should be included
	request.setAttribute("isExtJsComponent", true);
%>
<%@ include file = "/SYSTEM/resources/jspf/includes/extjsPortletIncludes.jspf"%>

</head>
<body>
<script type="text/javascript">
</script>

<jacada:frame id="agentsViewFrame" url="${pageContext.request.contextPath}/agentsGroups.jsp"/> 


</body>
</html>