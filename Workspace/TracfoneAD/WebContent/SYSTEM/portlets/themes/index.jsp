<%@ page language="java" contentType="text/html;charset=UTF-8"%>
<%@ include file = "/SYSTEM/resources/jspf/pageIncludes.jspf"%>
<%@ taglib uri="http://beehive.apache.org/netui/tags-databinding-1.0" prefix="netui-data"%>
<%@ taglib uri="http://beehive.apache.org/netui/tags-html-1.0" prefix="netui"%>
<%@ taglib uri="http://beehive.apache.org/netui/tags-template-1.0" prefix="netui-template"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt"%>
<%@ taglib uri="http://www.jacada.com/taglibs/jacada" prefix="jacada"%>
<%@ taglib uri="http://www.jacada.com/taglibs/jacada-component" prefix="jacada-component"%>
<%@ taglib uri="http://www.jacada.com/taglibs/jadvalidation" prefix="jacada-validation"%>
<%@ include file = "/SYSTEM/resources/jspf/checkHierarchy.jspf"%>
<%@ page import="SYSTEM.global.managers.LocaleManager"%>
<%@ page import="org.apache.beehive.netui.pageflow.PageFlowUtils" %>
<%@ include file = "/SYSTEM/resources/jspf/includes/locale.jspf"%>
<netui:html>
    <head>
        <title>
            <fmt:message bundle="${applicationMessages}" key="application.applyTheme.label.themes"></fmt:message>
        </title>
    
        <netui-data:getData resultId="themePath" value="${sharedFlow.globalApp.presentationManager.personalization.themeDirectory}"/>
        <link href="<%=request.getContextPath()+"/"+pageContext.getAttribute("themePath")+"/style.css" %>" type="text/css" rel="stylesheet" id="themeStyleSheet">
        <link href="<%=request.getContextPath()%>/USER/resources/css/override.css" type="text/css" rel="stylesheet">

        <script language="JavaScript" type="text/javascript" src="<%=request.getContextPath()%>/SYSTEM/resources/js/jad.js"></script>
        <script language="JavaScript" type="text/javascript" src="<%=request.getContextPath()%>/USER/resources/js/override.js"></script>
        <script type="text/javascript" src="${pageContext.request.contextPath}/SYSTEM/resources/js/common.js"></script>
        
    </head>
    <body onkeydown="onKeyDownHandler(event);">
    	<%
	    SYSTEM.global.SharedData global = (SYSTEM.global.SharedData)PageFlowUtils.getSharedFlow(SYSTEM.global.SharedData.class.getName(), request, request.getSession().getServletContext());
	    LocaleManager manager = global.getLocaleManager();
	    
		%>
		<script language="JavaScript" type="text/JavaScript">
		var themeString = "<%=global.getPresentationManager().getPersonalization(request).getThemeName()%>";
		
		function getSelectedTheme(selectObj)
		{
			var themeInteger = selectObj.selectedIndex;
			themeString = selectObj.options[themeInteger].value;
		}

		function switchTheme()
		{
			$W().setActiveStyleSheet(themeString);
		}
		</script>
        <netui:form action="SelectThemeAction" onSubmit="switchTheme()">
            <br>
            <table width="100%" align="center">
                <tr valign="top" align="center">
                    <td>
                        <span class="label"><fmt:message bundle="${applicationMessages}" key="application.applyTheme.label.themeName"/></span>
                        <netui:select dataSource="actionForm.themeName" optionsDataSource="${pageFlow.themes}" onChange="getSelectedTheme(this)"/>
                      
                    </td>                    
                </tr>
                <tr>
                    <td align="center">
                        <br/>&nbsp;
                        <netui:button type="submit"><fmt:message bundle="${applicationMessages}" key="application.applyTheme.button.apply"/></netui:button>
                        <input type="button" value="<%=manager.getApplicationLocalizationValue("application.applyTheme.button.cancel")%>" onclick="javascript:$W().removeWindow(window);window.close();">
                    </td>
                </tr>
            </table>
        </netui:form>
        
    </body>
</netui:html>
