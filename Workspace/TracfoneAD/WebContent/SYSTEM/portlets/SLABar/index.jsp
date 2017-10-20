<%@ page language="java" contentType="text/html;charset=UTF-8"%>
<%@page import="org.springframework.web.context.support.WebApplicationContextUtils"%>
<%@page import="org.springframework.context.ApplicationContext"%>
<%@page import="SYSTEM.global.managers.PresentationManager"%>
<%@page import="com.jacada.jad.personalization.IPersonalization"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt"%>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <style type="text/css">
        @import "SLABar.css";
    </style>
     <%
     		ApplicationContext applicationContext = WebApplicationContextUtils.getWebApplicationContext(application);
            PresentationManager presentationManager = (PresentationManager)applicationContext.getBean("presentationManager");
            IPersonalization personalization = presentationManager.getPersonalization();
            String themePath = personalization.getThemeDirectory();
            pageContext.setAttribute("themePath", themePath);
        %>
    <link href="<%=request.getContextPath()+"/"+pageContext.getAttribute("themePath")+"/style.css" %>" type="text/css" rel="stylesheet">
    <script src="${pageContext.request.contextPath}/SYSTEM/resources/js/jad.js"></script>        
    <script type="text/javascript" src="SLABar.js"></script>        
    <script language="JavaScript" type="text/javascript" src="<%=request.getContextPath()%>/USER/resources/js/override.js"></script>
    <script language="JavaScript" type="text/javascript" src="<%=request.getContextPath()%>/SYSTEM/resources/js/common.js"></script>
</head>
<body scroll="no" onkeydown="onKeyDownHandler(event);">
    <div id="mContainer">
			<div id="gradient"></div>
			<div id="mask" class="baseColor"></div>
			<div id="progressIndicator"></div>
	</div>	 
</body>
</html>    
