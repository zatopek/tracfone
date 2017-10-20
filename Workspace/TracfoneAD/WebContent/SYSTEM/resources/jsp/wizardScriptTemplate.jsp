<%@ page language="java" contentType="text/html;charset=UTF-8"%>
<%@ taglib uri="http://beehive.apache.org/netui/tags-databinding-1.0" prefix="netui-data"%>
<%@ taglib uri="http://beehive.apache.org/netui/tags-html-1.0" prefix="netui"%>
<%@ taglib uri="http://beehive.apache.org/netui/tags-template-1.0" prefix="netui-template"%>

<%@ taglib uri="http://www.jacada.com/taglibs/jacada" prefix="jacada"%>
<%@ taglib uri="http://www.jacada.com/taglibs/jacada-component" prefix="jacada-component"%>
<%@ taglib uri="http://jakarta.apache.org/taglibs/log-1.0" prefix="log"%>
<%@ taglib uri="http://java.sun.com/jstl/core_rt" prefix="c"%>

<%@ page import="org.apache.beehive.netui.pageflow.PageFlowUtils" %>
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
                        
        <%@ include file = "/USER/resources/jsp/scriptTemplate/includes.jspf" %>
        
    </head>
    <body onkeydown="onKeyDownHandler(event);" onload="SystemOnLoadHandler();">

    
<script language="JavaScript" type="text/javascript">
<!--
document.body.scroll="no";    
-->
</script>

<%
  SYSTEM.global.SharedData global = (SYSTEM.global.SharedData)PageFlowUtils.getSharedFlow(SYSTEM.global.SharedData.class.getName(), request, request.getSession().getServletContext());
  boolean hasBack = global.getScriptManager().getHasBack(request);
  pageContext.setAttribute("hasBack",new Boolean(hasBack));

  boolean hasNoBack = global.getScriptManager().getHasNoBack(request);
  pageContext.setAttribute("hasNoBack",new Boolean(hasNoBack));

 // request.setAttribute("hasBack", new Boolean(hasBack));
  //request.setAttribute("hasNoBack", new Boolean(hasNoBack));  
%>

   
		<table height="100%" width="100%">
			<tr > 
                <td vAlign="top" height="100%" width="100%">
                    <div style="height: 100%; width: 100%; overflow: auto" > 
                            <netui-template:includeSection name="scriptArea"/>
                    </div>
                </td>
            </tr>
            <tr>
                <td >
                    <table cellpadding="0" cellspacing="3">
                        <tr valign="bottom" align="center">
                     

    
   
                            <c:if test="<%=hasNoBack%>"> 
                                <td valign="middle" class="btnImgDisabled"><a id="jadBackBtn" style="TEXT-DECORATION: NONE" href=""></a>Back</td>                            
                            </c:if>                          
                            <c:if test="<%=hasBack%>"> 
                                <td valign="middle" class="btnImg"><a id="jadBackBtn" style="TEXT-DECORATION: NONE" href="javascript:doBack();"><u>B</u>ack</a></td>                            
                            </c:if>             
                            <td valign="middle" class="btnImg"><a id="jadNextBtn" style="TEXT-DECORATION: NONE" href="javascript:doNext();"><u>N</u>ext</a></td>
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
        
        <jacada:span tabIndex="-1"   id="jadNextBtnAux" name="jadNextBtnAux" accessKey="N" onactivate="moveFocusForAccessKey(); runLink('jadNextBtn');"></jacada:span>
        <jacada:span tabIndex="-1"   id="jadBackBtnAux" name="jadBackBtnAux" accessKey="B" onactivate="moveFocusForAccessKey(); runLink('jadBackBtn');"></jacada:span>
        <jacada:span tabIndex="-1"   id="jadLastVisitedLinkBtnAux" name="jadLastVisitedLinkBtnAux" accessKey="M" onactivate="moveFocusForAccessKey(); runLink('jadLastVisitedLinkBtn');"></jacada:span>
        <jacada:navigationBarController selectByUrl="<%=(request.getServletPath()).substring(1)%>" />
        <script>
            syncNavBar('<%=request.getContextPath() + request.getServletPath()%>');
        </script>
      <jacada:framesUpdater/>
    </body>
    
</netui:html>