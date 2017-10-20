<%@ page language="java" contentType="text/html;charset=UTF-8"%>
<%@ include file = "/SYSTEM/resources/jspf/pageIncludes.jspf"%>
<%@ taglib uri="http://beehive.apache.org/netui/tags-databinding-1.0" prefix="netui-data"%>
<%@ taglib uri="http://beehive.apache.org/netui/tags-html-1.0" prefix="netui"%>
<%@ taglib uri="http://beehive.apache.org/netui/tags-template-1.0" prefix="netui-template"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt"%>
<%@ include file = "/SYSTEM/resources/jspf/checkHierarchy.jspf"%>
<%@ include file = "/SYSTEM/resources/jspf/includes/locale.jspf"%>
<netui:html>
    <head>
        <title>
            <fmt:message bundle="${applicationMessages}" key="application.portlet.label.favorites"></fmt:message>
        </title>
        
        <script language="JavaScript" type="text/javascript" src="<%=request.getContextPath()%>/SYSTEM/resources/js/prototype.js"></script>
        <script language="JavaScript" type="text/javascript" src="<%=request.getContextPath()%>/SYSTEM/resources/js/rico.js"></script>
        <script language="JavaScript" type="text/javascript" src="<%=request.getContextPath()%>/SYSTEM/resources/js/tree.js"></script>
        <script language="JavaScript" type="text/javascript" src="<%=request.getContextPath()%>/SYSTEM/resources/js/jad.js"></script>
        <script language="JavaScript" type="text/javascript" src="<%=request.getContextPath()%>/USER/resources/js/override.js"></script>
        <script language="JavaScript" type="text/javascript" src="<%=request.getContextPath()%>/SYSTEM/resources/js/common.js"></script>
        
    </head>
    <body onkeydown="onKeyDownHandler(event);">
     <div style="width: 100%;height: 100%;border-color:black;border-width:1px;border-style:solid;overflow:auto" id="tree">
     </div>
     
     <script language="JavaScript" type="text/javascript" src="favorites.js"></script>

    </body>
</netui:html>
