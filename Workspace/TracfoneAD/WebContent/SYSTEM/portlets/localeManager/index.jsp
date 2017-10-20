<%@ page contentType="text/html;charset=UTF-8" %>
<%@ taglib uri="http://beehive.apache.org/netui/tags-databinding-1.0" prefix="netui-data"%>
<%@ taglib uri="http://beehive.apache.org/netui/tags-html-1.0" prefix="netui"%>
<%@ taglib uri="http://beehive.apache.org/netui/tags-template-1.0" prefix="netui-template"%>
<%@ taglib uri="http://www.jacada.com/taglibs/jacada" prefix="jacada"%>
<%@ taglib uri="http://jakarta.apache.org/taglibs/log-1.0" prefix="log"%>
<%@ taglib uri="http://www.jacada.com/taglibs/jacada-component" prefix="jacada-component"%>
<%@ taglib uri="http://www.jacada.com/taglibs/jadvalidation" prefix="jacada-validation"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt"%>
<%@ page import="SYSTEM.global.managers.LocaleManager"%>
<%@ page import="org.apache.beehive.netui.pageflow.PageFlowUtils" %>
<%@ include file = "/SYSTEM/resources/jspf/includes/locale.jspf"%>
<netui:html>
    <head>
        <title>
            <fmt:message bundle="${applicationMessages}" key="application.setLanguage.label.setLanguage"/>
        </title>
         <netui-data:getData resultId="themePath" value="${sharedFlow.globalApp.presentationManager.personalization.themeDirectory}"/> 
        <link href="<%=request.getContextPath()+"/"+pageContext.getAttribute("themePath")+"/style.css" %>" type="text/css" rel="stylesheet" id="themeStyleSheet">
        <link href="<%=request.getContextPath()%>/SYSTEM/resources/css/jadstyle.css" type="text/css" rel="stylesheet">
        <link href="<%=request.getContextPath()%>/USER/resources/css/override.css" type="text/css" rel="stylesheet">
        
        <script language="JavaScript" type="text/javascript" src="<%=request.getContextPath()%>/SYSTEM/resources/js/prototype.js"></script> 
        <script language="JavaScript" type="text/javascript" src="<%=request.getContextPath()%>/SYSTEM/resources/js/common.js"></script>
        <script language="JavaScript" type="text/javascript" src="<%=request.getContextPath()%>/SYSTEM/resources/js/combo.js"></script>

     
        <script language="JavaScript" type="text/javascript" src="<%=request.getContextPath()%>/SYSTEM/resources/js/jad.js"></script>
        <script language="JavaScript" type="text/javascript" src="<%=request.getContextPath()%>/USER/resources/js/override.js"></script>
        
    </head>
    <body onkeydown="onKeyDownHandler(event);">
    	<%
	    SYSTEM.global.SharedData global = (SYSTEM.global.SharedData)PageFlowUtils.getSharedFlow(SYSTEM.global.SharedData.class.getName(), request, request.getSession().getServletContext());
	    LocaleManager manager = global.getLocaleManager();
		%>
    	<netui:form action="SetPortalLocaleAction">
            <br>
            <table width="100%" align="center">
                <tr valign="top" align="center">
                    <td>
                    	<fmt:message bundle="${applicationMessages}" key="application.setLanguage.label.language"/>
                    	<span class="label">:</span>
                        <netui:select dataSource="pageFlow.chosenLocaleId" optionsDataSource="${pageFlow.localeManager.displayLanguages}" style="width: 150;"/>
                    </td>                    
                </tr>
                <tr>
                    <td align="center">
                        <br/>&nbsp;
                        <netui:button type="submit"><fmt:message bundle="${applicationMessages}" key="application.setLanguage.button.ok"/></netui:button>
                        <input type="button" value="<%=manager.getApplicationLocalizationValue("application.setLanguage.button.cancel")%>" onclick="javascript:$W().removeWindow(window);window.close();">
                    </td>
                </tr>
            </table>
        </netui:form>
        
   
    </body>
</netui:html>
