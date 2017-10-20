<%@ page language="java" contentType="text/html;charset=UTF-8"%>
<%@ include file = "/SYSTEM/resources/jspf/pageIncludes.jspf"%>
<%@ taglib uri="http://beehive.apache.org/netui/tags-databinding-1.0" prefix="netui-data"%>
<%@ taglib uri="http://beehive.apache.org/netui/tags-html-1.0" prefix="netui"%>
<%@ taglib uri="http://beehive.apache.org/netui/tags-template-1.0" prefix="netui-template"%>


<%@ include file = "/SYSTEM/resources/jspf/checkHierarchy.jspf"%>

<netui:html>
    <head>
        <title>
            End Call
        </title>
        <script language="JavaScript" type="text/javascript" src="<%=request.getContextPath()%>/SYSTEM/resources/js/common.js"></script>
        <script language="JavaScript" type="text/javascript" src="<%=request.getContextPath()%>/USER/resources/js/override.js"></script>
    </head>
    <body onkeydown="onKeyDownHandler(event);">

        <netui:form action="EndCall">
            <table>
                <tr valign="top">
                    <td>PhoneNumber:</td>
                    <td><netui:label value="${actionForm.phoneNumber}"/></td>
                </tr>
            </table>
            <br/>&nbsp;
            <netui:button value="EndCall" type="submit"/>
        </netui:form>

        <jacada:framesUpdater/>
        
<script language="JavaScript" type="text/javascript">
<!--
    window.parent.MessageBoardFrame.src = 'SYSTEM/portlets/welcome/WelcomeController.jpf';
    window.parent.ShowTabById('messagesTab');
//-->
</script>
        
    </body>
</netui:html>
