
<%@ page language="java" contentType="text/html;charset=UTF-8"%>
<%@ taglib uri="http://beehive.apache.org/netui/tags-databinding-1.0" prefix="netui-data"%>
<%@ taglib uri="http://beehive.apache.org/netui/tags-html-1.0" prefix="netui"%>
<%@ taglib uri="http://beehive.apache.org/netui/tags-template-1.0" prefix="netui-template"%>
<%@ taglib uri="http://www.jacada.com/taglibs/jacada" prefix="jacada"%>
<%@ taglib uri="http://jakarta.apache.org/taglibs/request-1.0" prefix="req"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt"%>

<%@ page import="com.jacada.jad.jimworkflow.interfaces.JIMWorkflowManager"%>
<%@ page import="org.apache.beehive.netui.pageflow.PageFlowUtils" %>

<html>
<head>
 
 <%
 	//retreive relevant manager
    SYSTEM.global.SharedData global = (SYSTEM.global.SharedData)PageFlowUtils.getSharedFlow(SYSTEM.global.SharedData.class.getName(), request, request.getSession().getServletContext());
 	JIMWorkflowManager manager = global.getJIMWorkflowManager();
 	
 	
 	//retreive theme path
 	String themePath = global.getPresentationManager().getPersonalization().getThemeDirectory();
 	
	%>  
	<link href="<%=request.getContextPath()+"/"+themePath %>/style.css" type="text/css" rel="stylesheet" id="themeStyleSheet">
	
	
      <script language="JavaScript" type="text/javascript" src="<%=request.getContextPath()%>/SYSTEM/resources/js/jad.js"></script>
      
<!-- Note: since this is a html page (and not jsp) we couldnt get the context path of the "src" below -->
<!-- from the request, neither could we retrieve it from the document location using javascript (you cannot write javascript inside a src of "script" tag, the possible solition as seen below was to use relative path with "../js" -->
<script language="JavaScript" type="text/javascript" src="../js/common.js"></script>
	</head>
	<!-- I put here "no" scroll because the scroll somehow appeared all the time-->
<body onkeydown="onKeyDownHandler(event);" scroll="no">
	<script language="JavaScript" type="text/javascript">
	//INITALIZATIONS IN JS SIDE
	$W().jimHandler.collapsible = <%=manager.isJIMScriptCollabsible()%>;
	$W().jimHandler.layout = "<%=manager.getJIMLayout().toString()%>";
</script>

<!--
The structure is:
body with no scroll bars
1. jim script div -with a float style to the left so that the jsp page will occupy the rest  
2. collapsible jim script div -with a float style to the left so that the jsp page will occupy the rest  
3. workspace jsp page div- uses 100% for width and height because the jim div have a float style
Note: the internal iframe have no special styling just simple width=100% and height="100% 
 -->
 
	<div id="JIMCollapsedDIVPlaceHolder" class="jimSide" style="display:none;width:<%=manager.getJIMCollapsibleWidth()%>;">
	 	<jsp:include page='<%="/"+manager.getJIMCollapsiblePage()%>'></jsp:include>
	</div>
	<div id="JIMDIVPlaceHolder"  class="jimSide" style="width=<%=manager.getJIMWidth()%>;" >
		<iframe id="JIMFrame" class="fullSizeIframe" src="<%=manager.getJIMScriptUrl()%>"></iframe>
	</div>
	<div id=WorkspaceJSPPlaceHolder class="workspaceSide">
		<iframe id="WorkspaceJSPFrame" class="fullSizeIframe" src="<%=request.getContextPath()+"/"+manager.getJSPStartPage()%>"></iframe>
	</div>

	
	<script language="JavaScript" type="text/javascript">
	/**onclick registering**/
	//we need to register onclick handler for workspace-side- this should be done only after the iframe completes loadeing
	$W().jimHandler._getWorkspaceSideIframe().onreadystatechange = $W().jimHandler.onWorkspaceSideLoaded;
	//registering onclick event for the collapsed side
	$W().jimHandler._getJIMCollapsibleSideDiv().ondblclick = $W().jimHandler.onJimCollapsedSideClicked;
	
</script>


      
	</body>
</html>