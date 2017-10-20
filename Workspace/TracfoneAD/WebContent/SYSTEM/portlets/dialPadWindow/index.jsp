<%@ page language="java" contentType="text/html;charset=UTF-8"%>
<%@ include file = "/SYSTEM/resources/jspf/pageIncludes.jspf"%>
<%@ taglib uri="http://beehive.apache.org/netui/tags-databinding-1.0" prefix="netui-data"%>
<%@ taglib uri="http://beehive.apache.org/netui/tags-html-1.0" prefix="netui"%>
<%@ taglib uri="http://beehive.apache.org/netui/tags-template-1.0" prefix="netui-template"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt"%>
<%@ include file = "/SYSTEM/resources/jspf/checkHierarchy.jspf"%>
<%@ page import="SYSTEM.global.managers.LocaleManager"%>
<%@ page import="org.apache.beehive.netui.pageflow.PageFlowUtils" %>
<%@ include file = "/SYSTEM/resources/jspf/includes/locale.jspf"%>
<netui:html>
    <head>
        
        <title>
            <fmt:message bundle="${applicationMessages}"  key="application.portlet.label.dialPad"></fmt:message>
        </title>
        <script language="JavaScript" type="text/javascript" src="<%=request.getContextPath()%>/SYSTEM/resources/js/prototype.js"></script>
        <script language="JavaScript" type="text/javascript" src="<%=request.getContextPath()%>/SYSTEM/resources/js/rico.js"></script>
        <script language="JavaScript" type="text/javascript" src="<%=request.getContextPath()%>/SYSTEM/resources/js/tree.js"></script>
        <script language="JavaScript" type="text/javascript" src="<%=request.getContextPath()%>/SYSTEM/resources/js/jad.js"></script>
        <script language="JavaScript" type="text/javascript" src="<%=request.getContextPath()%>/SYSTEM/resources/js/common.js"></script>
        <script language="JavaScript" type="text/javascript" src="<%=request.getContextPath()%>/USER/resources/js/override.js"></script>

        <netui-data:getData resultId="themePath" value="${sharedFlow.globalApp.presentationManager.personalization.themeDirectory}"/> 
        <link href="<%=request.getContextPath()+"/"+pageContext.getAttribute("themePath")+"/style.css" %>" type="text/css" rel="stylesheet" id="themeStyleSheet">
        <link href="<%=request.getContextPath()%>/USER/resources/css/override.css" type="text/css" rel="stylesheet">
        
    </head>
    <body onkeydown="onKeyDownHandler(event);">
    <%
    SYSTEM.global.SharedData global = (SYSTEM.global.SharedData)PageFlowUtils.getSharedFlow(SYSTEM.global.SharedData.class.getName(), request, request.getSession().getServletContext());
    LocaleManager manager = global.getLocaleManager();
	%>
         
     <table style="MARGIN: 6px" bgcolor="white">
      <tr >
       <td style="border-color:gray;border-width:1px;border-style:solid; padding: 3px 3px 3px 3px;">
       <table cellpadding="0" cellspacing="0" align="center">
          <tr style="font-weight:bold;">
       
         </tr>
          <tr>
          <td><img src="<%=request.getContextPath()%>/SYSTEM/portlets/dialPad/pad1.JPG" onclick="pad('1');"></td>
          <td><img src="<%=request.getContextPath()%>/SYSTEM/portlets/dialPad/pad2.JPG" onclick="pad('2');"></td>
          <td><img src="<%=request.getContextPath()%>/SYSTEM/portlets/dialPad/pad3.JPG" onclick="pad('3');"></td>
         </tr>
         <tr>
          <td><img src="<%=request.getContextPath()%>/SYSTEM/portlets/dialPad/pad4.JPG" onclick="pad('4');"></td>
          <td><img src="<%=request.getContextPath()%>/SYSTEM/portlets/dialPad/pad5.JPG" onclick="pad('5');"></td>
          <td><img src="<%=request.getContextPath()%>/SYSTEM/portlets/dialPad/pad6.JPG" onclick="pad('6');"></td>
         </tr>
         <tr>
          <td><img src="<%=request.getContextPath()%>/SYSTEM/portlets/dialPad/pad7.JPG" onclick="pad('7');"></td>
          <td><img src="<%=request.getContextPath()%>/SYSTEM/portlets/dialPad/pad8.JPG" onclick="pad('8');"></td>
          <td><img src="<%=request.getContextPath()%>/SYSTEM/portlets/dialPad/pad9.JPG" onclick="pad('9');"></td>
         </tr>
         <tr>
          <td><img src="<%=request.getContextPath()%>/SYSTEM/portlets/dialPad/padstar.JPG" onclick="pad('*');"></td>
          <td><img src="<%=request.getContextPath()%>/SYSTEM/portlets/dialPad/pad0.JPG" onclick="pad('0');"></td>
          <td><img src="<%=request.getContextPath()%>/SYSTEM/portlets/dialPad/padp.JPG" onclick="pad('#');"></td>
         </tr>
        </table>
       </td>
      </tr>
      
      <tr>
       <td align="right">
        <table style="MARGIN: -4px;">
         <tr>
         <td><input type='text' id='dialPopupWindowNumber' style='width: 130px' onkeyup="updateWindow()"/></td>
          <td><input type="button" style="font-size: 12px; font-family: arial" value="<%=manager.getApplicationLocalizationValue("application.dialPadWindow.button.ok")%>" id="applyBtn"></td>
          <td><input type="button" style="font-size: 12px; font-family: arial" value="<%=manager.getApplicationLocalizationValue("application.dialPadWindow.button.cancel")%>"  id="cancelBtn"></td>
         </tr>
        </table>
       </td>
      </tr>
      
     </table>

        <script language="JavaScript" type="text/javascript" src="dialPadWindow.js">
        </script>

    </body>
</netui:html>
