<%@ page language="java" contentType="text/html;charset=UTF-8" session="false"%>
<%@page import="org.springframework.web.context.support.WebApplicationContextUtils"%>
<%@page import="org.springframework.context.ApplicationContext"%>
<%@page import="com.jacada.jad.core.UrlParameters"%>
<%@page import="com.jacada.jad.JadConstants"%>
<%@page import="SYSTEM.global.managers.CTIManager"%>
<%@page import="com.jacada.jad.cti.agent.CTICommonInformation"%>
<!DOCTYPE html>
<html>
	<head>

	</head>
<body>

	<div id="container" style="width:500px">

		<div id="header" style="background-color:#EEEEEE;">
			<h1 style="margin-bottom:0;">AvayaOneX - Client API Tester</h1>
		</div>

		<div id="content" style="background-color:#EEEEEE;height:200px;width:200px;float:left;">
		Log messages
		</div>

		<div id="buttonBar" style="background-color:#EEEEEE;height:200px;width:300px;float:left;">
			<span id="buttonBarPanel">
				<span id="answerButtonSpan">
				    <input id="answerButton" class="ctiButton" type="button" value="Answer" onclick="answer()" disabled="true"/>
				</span>
				<span id="muteButtonSpan">
				        <input id="muteButton" class="ctiButton" type="button" value="Mute" onclick="mute()"/>
				    </span>
				<span id="holdButtonSpan">
				        <input id="holdButton" class="ctiButton" type="button" value="Hold" onclick="hold()"/>
				    </span>
				<span id="callButtonSpan">
				        <input id="callButton" class="ctiButton" type="button" value="Call" onclick="call()"/>
				</span>			
				<div id="registerButtonDiv">
				        <input id="registerButton" class="ctiButton" type="button" value="Register" onclick="register()"/>
				</div>
			</span>
		</div>		
		<div id="footer" style="background-color:#EEEEEE;clear:both;text-align:left;">
		Status bar</div>
	</div>

</body>
<script language="JavaScript" type="text/javascript" src="<%=request.getContextPath()%>/SYSTEM/resources/js/prototype.js"></script>
<script language="JavaScript" type="text/javascript" src="${pageContext.request.contextPath}/SYSTEM/portlets/CTI/providers/onexagent/utils.js"></script>
<script language="JavaScript" type="text/javascript" src="${pageContext.request.contextPath}/SYSTEM/portlets/CTI/providers/onexagent/onexagentClient.js"></script>
<script language="JavaScript" type="text/javascript" src="${pageContext.request.contextPath}/SYSTEM/portlets/CTI/providers/onexagent/onexagentClientAPI.js"></script>
<script language="JavaScript" type="text/javascript" src="${pageContext.request.contextPath}/SYSTEM/portlets/CTI/providers/onexagent/onexagentCTIBar.js"></script>
<%

    ApplicationContext applicationContext = WebApplicationContextUtils.getWebApplicationContext(application);
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
</html>

