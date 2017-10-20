
<%@ page language="java" contentType="text/html;charset=UTF-8"%>
<%@ include file = "/SYSTEM/resources/jspf/pageIncludes.jspf"%>
<%@ taglib uri="http://beehive.apache.org/netui/tags-databinding-1.0" prefix="netui-data"%>
<%@ taglib uri="http://beehive.apache.org/netui/tags-html-1.0" prefix="netui"%>
<%@ taglib uri="http://beehive.apache.org/netui/tags-template-1.0" prefix="netui-template"%>
<%@ taglib uri="http://www.jacada.com/taglibs/jacada" prefix="jacada"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt"%>
<%@ include file = "/SYSTEM/resources/jspf/checkHierarchy.jspf"%>
<%@ include file = "/SYSTEM/resources/jspf/includes/locale.jspf"%>
<netui:html>
    <head>
      <script language="JavaScript" type="text/javascript" src="<%=request.getContextPath()%>/SYSTEM/resources/js/prototype.js"></script>
      <script language="JavaScript" type="text/javascript" src="<%=request.getContextPath()%>/SYSTEM/resources/js/jad.js"></script>
      <script language="JavaScript" type="text/javascript" src="<%=request.getContextPath()%>/USER/resources/js/override.js"></script>
      

		<style type="text/css"> 

body { 
    margin:         0px;
    padding:        0px;
}

TD { 
    font-size: 12px; 
    font-family: Verdana 
}

.header {
    background-color: #9a9a9a;
    color:             white;
    padding: 0px 5px 0px 2px;
    font-size: 12px; 
    font-family: Verdana 
}    
.normalInBlue {
    background-color: white;
    color: #330099;
    padding: 0px 5px 0px 2px;
    font-size: 12px; 
    font-family: Verdana 
}
.normal {
    background-color: white;
    color: black;
    padding: 0px 5px 0px 2px;
    font-size: 12px; 
    font-family: Verdana 
}

.hover  {
	background-color: #3333ff;
    color : white;
    padding: 0px 5px 0px 2px;
    cursor:hand;
    font-size: 12px; 
    font-family: Verdana 
}
		</style>

<script language="JavaScript" type="text/JavaScript">
<!--

function high(obj) {
    if (obj.savedClass) {
    } else {
       obj.savedClass = obj.className;
    }
    obj.className = 'hover';
}

function low(obj) {
    if (obj.savedClass) {
        obj.className = obj.savedClass;
        obj.savedClass = null;
    }
}
-->
</script>

    </head>

    <body >
        <netui-data:getData resultId="action" value="${pageFlow.actionToString}"/>
        <netui-data:getData resultId="listTitle" value="${pageFlow.listTitle}"/>
        <netui-data:getData resultId="accessCode" value="${pageFlow.globalApp.CTIManager.voiceInformation.outboundAccessCode}"/>

        <jacada:if expr="${pageFlow.onlyOne}">
	        <jacada:if expr="${pageFlow.disallowDialPadWindowGlobalFlag}">
	            <netui-data:getData resultId="dn" value="${pageFlow.oneDN}"/>
	
	            <netui-data:callPageFlow method="getDN" resultId="fulldn">
	              <netui-data:methodParameter value="${pageFlow.oneDN}"/>
	              <netui-data:methodParameter value="${pageFlow.oneUseAC}"/>                      
	            </netui-data:callPageFlow>
            
            
<script language="JavaScript" type="text/JavaScript">
<!--
   var w = window.parent.$W();
   w.cti.doAction('<%= pageContext.getAttribute("action") %>', '<%= pageContext.getAttribute("fulldn") %>');
-->
</script>
        
    </jacada:if>
    </jacada:if>
        
        <jacada:if expr="${pageFlow.displayList}">      
        
            <netui-data:repeater dataSource="pageFlow.list">
                  
                <netui-data:repeaterHeader>
                     <table border="0" cellpadding="0" cellspacing="1" bgcolor="white">
        
                     <jacada:if expr="${pageFlow.extensionsList}">
                      <tr class="header">
                       <%= pageContext.getAttribute("listTitle") %>
                      </tr>
                      <tr class="header">
                       <td><fmt:message bundle="${applicationMessages}" key="application.ctiDialList.label.extensionColumnTitle"/></td>
                       <td><fmt:message bundle="${applicationMessages}" key="application.ctiDialList.label.nameColumnTitle"/></td>
                       <td><fmt:message bundle="${applicationMessages}" key="application.ctiDialList.label.descriptionColumnTitle"/></td>
                      </tr>
                      </jacada:if>
                      <jacada:if expr="${pageFlow.stateCodesList}">
                      <tr class="header">
                       <td><fmt:message bundle="${applicationMessages}" key="application.ctiDialList.label.codeColumnTitle"/></td>
                       <td><fmt:message bundle="${applicationMessages}" key="application.ctiDialList.label.nameColumnTitle"/></td>
                       <td><fmt:message bundle="${applicationMessages}" key="application.ctiDialList.label.descriptionColumnTitle"/></td>
                      </tr>
                      </jacada:if>
                      <jacada:if expr="${pageFlow.allowDialPadWindowGlobalFlag}">
                          <tr class="normalInBlue"  onMouseOver='high(this);' onMouseOut="low(this);" valign="top" onclick="$W().cti.onShowDialPadWindow('<%= pageContext.getAttribute("action") %>');">
                          <td>
                        <nobr><fmt:message bundle="${applicationMessages}" key="application.ctiDialList.label.dialNumberTitle"/></nobr>
                        </td>
                        </tr>
                    </jacada:if>
                </netui-data:repeaterHeader>
                
                <netui-data:repeaterItem>
                    <netui-data:getData resultId="index" value="${container.index}"/>
                    <netui-data:callPageFlow method="getDN" resultId="fulldn">
                      <netui-data:methodParameter value="${container.item.dn}"/>
                      <netui-data:methodParameter value="${container.item.useAccessCode}"/>                      
                    </netui-data:callPageFlow>
                    
                    <tr class='normal' onMouseOver='high(this);' onMouseOut='low(this);' valign="top" onclick="$W().cti.doAction('<%= ((String)pageContext.getAttribute("action")).toLowerCase() %>', '<%= pageContext.getAttribute("fulldn") %>');">
                        <td><nobr><netui:span value="${container.item.dn}" defaultValue="&nbsp;"/></nobr></td>
                        <td><nobr><netui:span value="${container.item.name}" defaultValue="&nbsp;"/></nobr></td>
                        <td><nobr><netui:span value="${container.item.description}" defaultValue="&nbsp;"/></nobr></td>
                    </tr>
                </netui-data:repeaterItem>
                
                <netui-data:repeaterFooter>
                    </table>
                </netui-data:repeaterFooter>
            </netui-data:repeater>
        </jacada:if>
        
        <!--special case of no items but we have the ability to open dial pad portlet-->
         <jacada:if expr="${pageFlow.noItems}">
            <jacada:if expr="${pageFlow.allowDialPadWindowGlobalFlag}">
             <script language="JavaScript" type="text/JavaScript">
                <!--
                   var w = window.parent.$W();
                   w.cti.onShowDialPadWindow('<%= pageContext.getAttribute("action") %>');
                -->
            </script>
            </jacada:if>
        </jacada:if>
    </body>
</netui:html>
