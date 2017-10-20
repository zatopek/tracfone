<%@ page language="java" contentType="text/html;charset=UTF-8"%>
<%@page import="org.springframework.web.context.support.WebApplicationContextUtils"%>
<%@page import="org.springframework.web.context.WebApplicationContext"%>
<%@ page import="com.jacada.jad.featuresManager.FeaturesManager"%>
<%@ page import="com.jacada.jad.featuresManager.FeatureName"%>
<html>
<head>
<title>Insert title here</title>
<%
ServletContext servletContext1 = session.getServletContext();
WebApplicationContext context1 = WebApplicationContextUtils .getWebApplicationContext(servletContext1);
FeaturesManager featureManager1 = (FeaturesManager) context1.getBean("featuresManager");  	
	//including supervisor page only when enabled
if (featureManager1.isEnabled(FeatureName.SupervisorView)) { %>
	    
	
<script>
	// Component url - used to load data from the server
	var Spvcontroller_JSON_URL = "${pageContext.request.contextPath}/Spvcontroller.json";
	var context = "${pageContext.request.contextPath}";
	
</script>
<%
	// set attribute to true if extJs should be included
	request.setAttribute("isExtJsComponent", true);
%>
<%@ include file = "/USER/resources/jspf/includes/moduleIncludes.jspf"%>
<script type="text/javascript" src="${pageContext.request.contextPath}/USER/portlets/supervisor/config/tabs.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/SYSTEM/portlets/supervisor/Spvcontroller.js"></script>
<% } %>
</head>
<body onkeydown="onKeyDownHandler();">
<script>
</script>
<%
if (featureManager1.isEnabled(FeatureName.SupervisorView)) { %>
<div id="crtl"></div>
<%} %>
</body>
</html>