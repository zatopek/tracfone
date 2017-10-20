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
        <title>
            <fmt:message bundle="${applicationMessages}" key="application.portlet.label.navigationBar"></fmt:message>
        </title>
        <link href="<%=request.getContextPath()%>/SYSTEM/resources/css/navbarstyle.css" type="text/css" rel="stylesheet">
        <link href="<%=request.getContextPath()%>/USER/resources/css/override.css" type="text/css" rel="stylesheet">

        <script language="JavaScript" type="text/javascript" src="<%=request.getContextPath()%>/SYSTEM/resources/js/common.js"></script>

        <script language="JavaScript" type="text/javascript" src="<%=request.getContextPath()%>/SYSTEM/resources/js/prototype.js"></script>
        <script language="JavaScript" type="text/javascript" src="<%=request.getContextPath()%>/SYSTEM/resources/js/rico.js"></script>
        <script language="JavaScript" type="text/javascript" src="<%=request.getContextPath()%>/SYSTEM/resources/js/tree.js"></script>
        <script language="JavaScript" type="text/javascript" src="<%=request.getContextPath()%>/SYSTEM/resources/js/navigation.js"></script> 
        <script language="JavaScript" type="text/javascript" src="<%=request.getContextPath()%>/USER/resources/js/override.js"></script>       
      
    </head>
    <body onkeydown="onKeyDownHandler(event);" onload="checkNextSelection();">  
 
        <netui:form tagId="navbarform" action="begin">
            <div style="width: 100%; height: 100%; overflow:auto" id="tree">
            </div>
            
            <script language="JavaScript" type="text/javascript">
              navTree  = new Tree('tree', false);
              navTree.onselected = onselected;
              
              function onselected(node)
              {
               if(!node.node.disabled)
                navBarSelectLink(node)
              }
              
              
              <netui-data:callPageFlow method="getTreeDef" resultId="treeDef">
              </netui-data:callPageFlow>
              
              <%= pageContext.getAttribute("treeDef") %>
            </script>
        
        </netui:form>

    </body>
</netui:html>
