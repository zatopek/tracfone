<%@ page import="com.jacada.jad.logging.LogWrapper"%>
<%@ page import="com.jacada.logging.TraceLevel"%>
<%@ taglib uri="http://beehive.apache.org/netui/tags-databinding-1.0" prefix="netui-data"%>
<%@ taglib uri="http://beehive.apache.org/netui/tags-html-1.0" prefix="netui"%>
<%@ taglib uri="http://beehive.apache.org/netui/tags-template-1.0" prefix="netui-template"%>

<%@ taglib uri="http://www.jacada.com/taglibs/jacada" prefix="jacada"%>
<%@ taglib uri="http://jakarta.apache.org/taglibs/log-1.0" prefix="log"%>
<%@ taglib uri="http://www.jacada.com/taglibs/jacada-component" prefix="jacada-component"%>
<% 
    response.setHeader("Cache-Control","no-cache"); //HTTP 1.1
    response.setHeader("Pragma","no-cache"); //HTTP 1.0
    response.setDateHeader ("Expires", 0); //prevents caching at the proxy server

    String loggerName = request.getParameter("loggerName"); 
    if(loggerName == null)
        loggerName = "client";
//    LogWrapper.setLogHelperAttribs(request, loggerName);

    String level = request.getParameter("level"); 
    if (level == null)
        level = "debug";
    
    LogWrapper.log(TraceLevel.toLevel(level), LogWrapper.SCRIPT, request.getParameter("message"));

//    LogWrapper.clearLogHelperAttribs();
%>