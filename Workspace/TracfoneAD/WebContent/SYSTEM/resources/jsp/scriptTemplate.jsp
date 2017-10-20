<%@ page language="java" contentType="text/html;charset=UTF-8"%>
<%@ page import="org.apache.beehive.netui.pageflow.PageFlowUtils" %>
<%@ taglib uri="http://beehive.apache.org/netui/tags-databinding-1.0" prefix="netui-data"%>
<%@ taglib uri="http://beehive.apache.org/netui/tags-html-1.0" prefix="netui"%>
<%@ taglib uri="http://beehive.apache.org/netui/tags-template-1.0" prefix="netui-template"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt"%>
<%@ taglib uri="http://www.jacada.com/taglibs/jacada" prefix="jacada"%>
<%@ taglib uri="http://jakarta.apache.org/taglibs/log-1.0" prefix="log"%>
<%@ taglib uri="http://www.jacada.com/taglibs/jacada-component" prefix="jacada-component"%>
<%@ taglib uri="http://java.sun.com/jstl/core_rt" prefix="c"%>
<%@page import="org.springframework.context.ApplicationContext"%>
<%@page import="org.springframework.web.context.support.WebApplicationContextUtils"%>
<%@page import="SYSTEM.global.managers.LocaleManager"%>
<%
    ApplicationContext applicationContext = WebApplicationContextUtils.getWebApplicationContext(application);
	LocaleManager localeManager = (LocaleManager)applicationContext.getBean("localeManager");
	String scriptLocale = localeManager.getScriptLocale();
	String resourseBundleName = localeManager.getResourceBundleBaseName();
    %>
    
    <fmt:setLocale value="<%=scriptLocale%>" scope="session" />
	<fmt:setBundle basename="<%=resourseBundleName%>" scope="session" var="scriptMessages"/>
<netui:html>
    <head> 
        <title>
            <netui-template:attribute name="title"></netui-template:attribute>
        </title>
        <style type="text/css"> 
            .btnImg { font-family:arial; font-size:12px; BACKGROUND-POSITION: right center; BACKGROUND-IMAGE: url(<%=request.getContextPath()%>/SYSTEM/resources/images/Button-txt.gif); BACKGROUND-REPEAT: no-repeat; WIDTH: 74px; HEIGHT: 24px}
            .btnImgDisabled { font-family:arial; font-size:12px; BACKGROUND-POSITION: right center; BACKGROUND-IMAGE: url(<%=request.getContextPath()%>/SYSTEM/resources/images/Button-txt.gif); BACKGROUND-REPEAT: no-repeat; WIDTH: 74px; HEIGHT: 24px; COLOR: #888888}
            .btnImgLeft  { BACKGROUND-POSITION: right center; BACKGROUND-IMAGE: url(<%=request.getContextPath()%>/SYSTEM/resources/images/Button-txt-left.gif);  BACKGROUND-REPEAT: no-repeat; WIDTH: 17px; HEIGHT: 24px}
            .btnImgRight { BACKGROUND-POSITION: right center; BACKGROUND-IMAGE: url(<%=request.getContextPath()%>/SYSTEM/resources/images/Button-txt-right.gif); BACKGROUND-REPEAT: no-repeat; WIDTH: 17px; HEIGHT: 24px}
            .btnImgMidlle { font-family:arial; font-size:12px; BACKGROUND-POSITION: right center; BACKGROUND-IMAGE: url(<%=request.getContextPath()%>/SYSTEM/resources/images/Button-txt-middle.gif); BACKGROUND-REPEAT: repeat-x; HEIGHT: 24px} 
        </style>	
        <link href="<%=request.getContextPath()%>/SYSTEM/resources/css/faqstyle.css" type="text/css" rel="stylesheet">
        <link href="<%=request.getContextPath()%>/SYSTEM/resources/css/jadcustom.css" type="text/css" rel="stylesheet">        
        <link href="<%=request.getContextPath()%>/USER/resources/css/override.css" type="text/css" rel="stylesheet">
        <script src="<%=request.getContextPath()%>/SYSTEM/resources/js/navigation.js"></script>
        <script src="<%=request.getContextPath()%>/SYSTEM/resources/js/validation.js"></script>
        <script src="<%=request.getContextPath()%>/SYSTEM/resources/js/customValidation.js"></script>
        <script language="JavaScript" type="text/javascript" src="<%=request.getContextPath()%>/SYSTEM/resources/js/common.js"></script>
        <script language="JavaScript" type="text/javascript" src="<%=request.getContextPath()%>/SYSTEM/resources/js/prototype.js"></script>
        <script language="JavaScript" type="text/javascript" src="<%=request.getContextPath()%>/SYSTEM/resources/js/jad.js"></script>
        <script language="JavaScript" type="text/javascript" src="<%=request.getContextPath()%>/USER/resources/js/override.js"></script>
		<script language="JavaScript" type="text/javascript" src="<%=request.getContextPath()%>/SYSTEM/resources/js/yahoo/js/LocaleManager.js"></script>
        
                        
        <%@ include file = "/USER/resources/jsp/scriptTemplate/includes.jspf" %>
        
    </head>
    <body onkeydown="onKeyDownHandler(event);" onload="SystemOnLoadHandler();">

    
<script language="JavaScript" type="text/javascript">
    document.body.scroll="auto";    
</script>
<jacada:if expr="${sharedFlow.globalApp.scriptManager.isRolling}">
    <script language="JavaScript" type="text/javascript" src="<%=request.getContextPath()%>/SYSTEM/resources/js/rollingScript.js"></script>
</jacada:if>


<%
SYSTEM.global.SharedData global = (SYSTEM.global.SharedData)PageFlowUtils.getSharedFlow(SYSTEM.global.SharedData.class.getName(), request,request.getSession().getServletContext());
SYSTEM.global.managers.LocaleManager manager = global.getLocaleManager();
  boolean hasBack = global.getScriptManager().getHasBack(request);
  pageContext.setAttribute("hasBack",new Boolean(hasBack));
 
  boolean hasNoBack = global.getScriptManager().getHasNoBack(request);
  pageContext.setAttribute("hasNoBack",new Boolean(hasNoBack));
 // request.setAttribute("hasBack", new Boolean(hasBack));
  //request.setAttribute("hasNoBack", new Boolean(hasNoBack));  
%>

<jacada:if expr="${sharedFlow.globalApp.scriptManager.isNotRolling}">
   
		<table height="100%" width="100%">
			<tr > 
                <td vAlign="top" height="100%" width="100%">
</jacada:if>                
                    <div id="scriptArea" style="height: 100%; width: 100%;" > 
                            <netui-template:includeSection name="scriptArea"/>
                    </div>
                    
  <jacada:if expr="${sharedFlow.globalApp.scriptManager.isRolling}">                                      
                    <script language="javascript">
                        syncNavBar('<%=request.getContextPath() + request.getServletPath()%>');
                        var form = document.getElementsByTagName('FORM')[0];
                        var button = document.createElement('div');
                        button.innerHTML='<input type="submit" value="Next">'
                        form.appendChild(button);
                    </script>
   </jacada:if>

   <jacada:if expr="${sharedFlow.globalApp.scriptManager.isNotRolling}">                  
                </td>
            </tr>
            <tr>
                <td >
                    <table cellpadding="0" cellspacing="3">
                        <tr valign="bottom" align="center">
                     

    
   
                            <c:if test="<%=hasNoBack%>"> 
                                <td valign="middle" class="btnImgDisabled"><a id="jadBackBtn" style="TEXT-DECORATION: NONE" href=""></a><fmt:message bundle="${scriptMessages}" key="application.scriptTemplate.label.back"/></td>                            
                            </c:if>                          
                            <c:if test="<%=hasBack%>"> 
                                <td valign="middle" class="btnImg"><a id="jadBackBtn" style="TEXT-DECORATION: NONE" href="javascript:doBack();"><fmt:message bundle="${scriptMessages}" key="application.scriptTemplate.label.backWithShort"/></a></td>                            
                            </c:if>             
                            <td valign="middle" class="btnImg"><a id="jadNextBtn" style="TEXT-DECORATION: NONE" href="javascript:doNext();"><fmt:message bundle="${scriptMessages}" key="application.scriptTemplate.label.nextWithShort"/></a></td>
                            <td>
                                <div id="advBackBtn">
                                    <table cellpadding="0" cellspacing="0">
                                        <tr>
                                            <td valign="middle" class="btnImgLeft"/>
                                            <td valign="middle" class="btnImgMidlle" ><nobr><jacada:lastVisitedLink id="jadLastVisitedLinkBtn" navigationBarFrame="NavigationBarFrame"/></nobr></td>
                                            <td valign="middle" class="btnImgRight"/>
                                        </tr>
                                    </table>
                                </div>
                            </td>
                            <td class="panelName" align="right"><netui:label value="<%=request.getServletPath()%>"/></td>                            
                        </tr>                        
                    </table>
                </td>
            </tr>
        </table>
        
        <%
		 String nextAccessKey = manager.getApplicationLocalizationValue("application.scriptTemplate.accessKey.next");
		 String backAccessKey = manager.getApplicationLocalizationValue("application.scriptTemplate.accessKey.back");
		 %>
        <jacada:span tabIndex="-1"   id="jadNextBtnAux" name="jadNextBtnAux" accessKey="<%=nextAccessKey%>" onactivate="moveFocusForAccessKey(); runLink('jadNextBtn');"></jacada:span>
        <jacada:span tabIndex="-1"   id="jadBackBtnAux" name="jadBackBtnAux" accessKey="<%=backAccessKey%>" onactivate="moveFocusForAccessKey(); runLink('jadBackBtn');"></jacada:span>
                
        <jacada:span tabIndex="-1"   id="jadLastVisitedLinkBtnAux" name="jadLastVisitedLinkBtnAux" accessKey="M" onactivate="moveFocusForAccessKey(); runLink('jadLastVisitedLinkBtn');"></jacada:span>
        <jacada:navigationBarController selectByUrl="<%=(request.getServletPath()).substring(1)%>" />
        <script>
            syncNavBar('<%=request.getContextPath() + request.getServletPath()%>');
        </script>
    </jacada:if>
    
    <jacada:framesUpdater/>
    <div style="display: none;">
         <form id="backButtonForm"> </form>
    </div>
    </body>
    
</netui:html>