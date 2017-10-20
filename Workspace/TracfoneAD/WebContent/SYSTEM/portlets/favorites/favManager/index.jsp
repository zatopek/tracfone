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
            <fmt:message bundle="${applicationMessages}" key="application.favManager.label.manageFavorites"></fmt:message>
        </title>
        
        <script language="JavaScript" type="text/javascript" src="<%=request.getContextPath()%>/SYSTEM/resources/js/prototype.js"></script>
        <script language="JavaScript" type="text/javascript" src="<%=request.getContextPath()%>/SYSTEM/resources/js/rico.js"></script>
        <script language="JavaScript" type="text/javascript" src="<%=request.getContextPath()%>/SYSTEM/resources/js/tree.js"></script>
        <script language="JavaScript" type="text/javascript" src="<%=request.getContextPath()%>/SYSTEM/resources/js/jad.js"></script>
        <script language="JavaScript" type="text/javascript" src="<%=request.getContextPath()%>/SYSTEM/resources/js/common.js"></script>
        <script language="JavaScript" type="text/javascript" src="<%=request.getContextPath()%>/USER/resources/js/override.js"></script>

        <netui-data:getData resultId="themePath" value="${sharedFlow.globalApp.presentationManager.personalization.themeDirectory}"/>
        <link href="<%=request.getContextPath()+"/"+pageContext.getAttribute("themePath")+"/style.css" %>" type="text/css" rel="stylesheet">
        <link href="<%=request.getContextPath()%>/SYSTEM/resources/css/navbarstyle.css" type="text/css" rel="stylesheet">
        <link href="<%=request.getContextPath()%>/USER/resources/css/override.css" type="text/css" rel="stylesheet">
    </head>
    <body onkeydown="onKeyDownHandler(event);" class="baseColor">
    
    <%
    SYSTEM.global.SharedData global = (SYSTEM.global.SharedData)PageFlowUtils.getSharedFlow(SYSTEM.global.SharedData.class.getName(), request, request.getSession().getServletContext());
    LocaleManager manager = global.getLocaleManager();
	%>
    
     <netui-data:callPageFlow method="getName" resultId="defName"/>
     <netui-data:callPageFlow method="getURL" resultId="defURL"/>
     <netui-data:callPageFlow method="getNewWindow" resultId="defNewWindow"/>
        
     <table style="MARGIN: 6px">
      <tr >
       <td style="border-color:gray;border-width:1px;border-style:solid; padding: 3px 3px 3px 3px;">
        <table width="450px" cellspacing="3px">
         <tr>
          <td width="100%" style="font-weight:bold;"><fmt:message bundle="${applicationMessages}" key="application.favManager.label.createFavorite"/></td>
          <td width="100%" style="font-weight:bold;"><fmt:message bundle="${applicationMessages}" key="application.favManager.label.myFavorites"/></td>
         </tr>
         <tr>
          <td valign="top">

           <table cellpadding="0" cellspacing="3">
            <tr>
             <td style="border-style: solid; border-width: 1px 1px 1px 1px; border-color: black; padding: 5px 5px 5px 5px;">
           <table>
            <tr>
             <td><fmt:message bundle="${applicationMessages}" key="application.favManager.label.name"/></td>
             <td><input type="text" width="200px" id="name" value="<%= pageContext.getAttribute("defName") %>"></td>
            </tr>

            <tr>
             <td><fmt:message bundle="${applicationMessages}" key="application.favManager.label.url"/></td>
             <td><input type="text" width="200px" id="url" value="<%= pageContext.getAttribute("defURL") %>"></td>
            </tr>

           </table>
              <br>
              <fmt:message bundle="${applicationMessages}" key="application.favManager.label.openIn"/><br>
                <span style="width: 50px;"></span><input type="radio" name="newWindow"  checked><span><fmt:message bundle="${applicationMessages}" key="application.favManager.radio.newWindow"/></span><br>
                <span style="width: 50px;"></span><input type="radio" name="newWindow" ><span><fmt:message bundle="${applicationMessages}" key="application.favManager.radio.favoritesTab"/></span><br>

             </td>
            </tr>
           </table>                          
           
           <table width="95%">
            <tr>
             <td align="right">
              <input type="button" style="font-size: 12px; font-family: arial" value="<%=manager.getApplicationLocalizationValue("application.favManager.button.add")%>" id="addBtn">
              <input type="button" style="font-size: 12px; font-family: arial" value="<%=manager.getApplicationLocalizationValue("application.favManager.button.update")%>" id="updateBtn" style="display: none">
             </td>
            </tr> 
           </table>
          </td>
          
          <td width="200px">
           <table>
            <tr>
             <td>
              <div style="background-color: white; width:210px; height: 250px;border-color:black;border-width:1px;border-style:solid;overflow: auto" id="tree">
              </div>
             </td>
            </tr>
            <tr>
             <td>
              <nobr>
               <input type="button" style="font-size: 12px; font-family: arial" value="<%=manager.getApplicationLocalizationValue("application.favManager.button.newFolder")%>" id="newFolderBtn">
               <input type="button" style="font-size: 12px; font-family: arial" value="<%=manager.getApplicationLocalizationValue("application.favManager.button.edit")%>" id="editBtn">
               <input type="button" style="font-size: 12px; font-family: arial" value="<%=manager.getApplicationLocalizationValue("application.favManager.button.delete")%>" id="deleteBtn">
              </nobr>               
             </td>
            </tr>
           </table>

          </td>         
         </tr>
        </table>
       </td>
      </tr>
      
      <tr>
       <td align="right">
        <table>
         <tr>
          <td><input type="button" style="font-size: 12px; font-family: arial" value="<%=manager.getApplicationLocalizationValue("application.favManager.button.ok")%>" id="applyBtn"></td>
          <td><input type="button" style="font-size: 12px; font-family: arial" value="<%=manager.getApplicationLocalizationValue("application.favManager.button.cancel")%>" id="cancelBtn"></td>
         </tr>
        </table>
       </td>
      </tr>
      
     </table>

        <script language="JavaScript" type="text/javascript" src="favorites.js"></script>

    </body>
</netui:html>
