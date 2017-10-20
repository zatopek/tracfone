<%@ page language="java" contentType="text/html;charset=UTF-8"%>
<%@page import="org.springframework.web.context.support.WebApplicationContextUtils"%>
<%@page import="org.springframework.context.ApplicationContext"%>
<%@page import="com.jacada.jad.core.UrlParameters"%>
<%@page import="com.jacada.jad.JadConstants"%>
<%@page import="SYSTEM.global.managers.CTIManager"%>
<%@page import="SYSTEM.global.managers.PresentationManager"%>
<%@page import="com.jacada.jad.personalization.IPersonalization"%>
<%@page import="com.jacada.jad.cti.agent.CTICommonInformation"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt"%>
<%@ taglib uri="http://jakarta.apache.org/taglibs/log-1.0" prefix="log"%>
<%@ include file = "/SYSTEM/resources/jspf/includes/locale.jspf"%>
<html>
    <head>
        <%@ include file = "/SYSTEM/resources/jspf/includes/extjsPortletIncludes.jspf"%>
        <%
            PresentationManager presentationManager = (PresentationManager)applicationContext.getBean("presentationManager");
            IPersonalization personalization = presentationManager.getPersonalization();
            String themePath = personalization.getThemeDirectory();
            pageContext.setAttribute("themePath", themePath);
        %>
        <link href="<%=request.getContextPath()+"/"+pageContext.getAttribute("themePath") %>/style.css" type="text/css" rel="stylesheet" id="themeStyleSheet"/>
        <link href="onexagentCTIBar.css" type="text/css" rel="stylesheet"/>
	</head>
    <body onkeydown="onKeyDownHandler(event);">
		
	<script language="JavaScript" type="text/javascript" src="<%=request.getContextPath()%>/SYSTEM/resources/js/dialogs.js"></script>	
	<script language="JavaScript" type="text/javascript" src="${pageContext.request.contextPath}/SYSTEM/portlets/CTI/providers/onexagent/utils.js"></script>
	<script language="JavaScript" type="text/javascript" src="${pageContext.request.contextPath}/SYSTEM/portlets/CTI/providers/onexagent/onexagentClient.js"></script>
	<script language="JavaScript" type="text/javascript" src="${pageContext.request.contextPath}/SYSTEM/portlets/CTI/providers/onexagent/onexagentClientAPI.js"></script>
	<script language="JavaScript" type="text/javascript" src="${pageContext.request.contextPath}/SYSTEM/portlets/CTI/providers/onexagent/onexagentCTIBar.js"></script>

<%

    CTIManager ctiManager = (CTIManager)applicationContext.getBean("ctiManager");
    String dbOneXPort = ((CTICommonInformation)ctiManager.getAgentInformation()).getSettings("OneXPort");
    UrlParameters urlParams = (UrlParameters)applicationContext.getBean("urlParameters");
    String reqParam = urlParams.getUrlParameter(JadConstants.JAD_REQUEST_PREFIX + "OneXPort");
    if (reqParam != null && reqParam.length() > 0) {
        dbOneXPort = reqParam;
    }
%>
	<script>
    	OneXAgentAPI.init("<%=dbOneXPort%>");
	</script>
	<script>
		$W().CTIBar = new CTIBarOneX();
		$W().CTIBar.init();
		$W().showLogout(true);
		$W().setChannelEnable("voice", -1);
        $W().setChannelEnable("multimedia", -1);
        $W().setChannelEnable("email", -1);
        $W().handleCTILoginLogoutLink(false,true,true);
	</script>
	
	
	<body>		
	</body>
	
</html>