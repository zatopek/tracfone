<%@ page language="java" contentType="text/html;charset=UTF-8"%>
<%@ taglib uri="http://beehive.apache.org/netui/tags-databinding-1.0" prefix="netui-data"%>
<%@ taglib uri="http://beehive.apache.org/netui/tags-html-1.0" prefix="netui"%>
<%@ taglib uri="http://beehive.apache.org/netui/tags-template-1.0" prefix="netui-template"%>
<%@ taglib uri="http://www.jacada.com/taglibs/jacada" prefix="jacada"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt"%>

<%@page import="SYSTEM.global.ScriptPersonalization"%>
<netui:html>
	<head>
		<script type="text/javascript" src="<%=request.getContextPath()%>/SYSTEM/resources/js/indexhead.js"></script>
		<script language="JavaScript" type="text/javascript" src="<%=request.getContextPath()%>/SYSTEM/resources/js/prototype.js"></script>
        <script language="JavaScript" type="text/javascript" src="<%=request.getContextPath()%>/SYSTEM/resources/js/jad.js"></script>
	</head>
    <body>
    <netui-data:callPageFlow method="getDefaultApplicationLocale" resultId="defaultApplicationLocale"></netui-data:callPageFlow>
    <netui:form action="afterDuplicateLoginForm" tagId="dupActionForm">
    	<netui:hidden dataSource="actionForm.selectedOption" tagId="dupFrom"/>
    	<input type="hidden" name="shouldTerminateOldSession" value="false" id="shouldTerminateOldSession"></input>
    </netui:form>
    
    <script type="text/javascript">
    	var option = confirm('<%= ScriptPersonalization.getLocalizationValueAccordingTOLocale("application.message.confirm.duplicateLogin", (String)pageContext.getAttribute("defaultApplicationLocale")) %>');
    	var idTag = document.getElementById("dupFrom");
   		idTag.value = option;
   		var tag = document.getElementById("dupActionForm");
   		var terminateFlag = document.getElementById("shouldTerminateOldSession");
   		terminateFlag.value = option;
	    tag.method = "POST";
	    tag.submit();
    </script>
    </body>
</netui:html>

