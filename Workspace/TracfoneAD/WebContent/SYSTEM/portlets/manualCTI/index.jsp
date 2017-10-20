<%@ page language="java" contentType="text/html;charset=UTF-8"%>
<%@ include file = "/SYSTEM/resources/jspf/pageIncludes.jspf"%>
<%@ taglib uri="http://beehive.apache.org/netui/tags-databinding-1.0" prefix="netui-data"%>
<%@ taglib uri="http://beehive.apache.org/netui/tags-html-1.0" prefix="netui"%>
<%@ taglib uri="http://beehive.apache.org/netui/tags-template-1.0" prefix="netui-template"%>
<%@ taglib uri="http://www.jacada.com/taglibs/jacada" prefix="jacada"%>

<%@ include file = "/SYSTEM/resources/jspf/checkHierarchy.jspf"%>

<netui:html>
    <head>
        <title>
            Start Call
        </title>
        <script language="JavaScript" type="text/javascript" src="<%=request.getContextPath()%>/SYSTEM/resources/js/common.js"></script>
        <script language="JavaScript" type="text/javascript" src="<%=request.getContextPath()%>/USER/resources/js/override.js"></script>
    </head>
    <body onkeydown="onKeyDownHandler(event);">
  

        <netui:form action="StartCall">
            Call ID<br>
            <netui:select dataSource="${actionForm.phoneNumber}" nullable="true" nullableOptionText=''>
                <netui:selectOption value="1111111"/>
                <netui:selectOption value="2222222"/>
                <netui:selectOption value="3333333"/>
                <netui:selectOption value="4444444"/>                
            </netui:select>
            
            <br/>
            <br/>&nbsp;                
            <netui:button value="Start Call" type="submit"/>
        </netui:form>
        
        <jacada:framesUpdater/> 
        
<jacada:if expr="${pageFlow.callEnded}">
<script language="JavaScript" type="text/javascript">
<!--
    window.parent.MessageBoardFrame.src = 'SYSTEM/portlets/welcome/WelcomeController.jpf';
    window.parent.ShowTabById('messagesTab');
//-->
</script>
</jacada:if>

    </body>
</netui:html>
