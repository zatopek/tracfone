<%@ page language="java" contentType="text/html;charset=UTF-8" isErrorPage="true"%>
<%@ include file = "/SYSTEM/resources/jspf/pageIncludes.jspf"%>
<%@ taglib uri="http://beehive.apache.org/netui/tags-databinding-1.0" prefix="netui-data"%>
<%@ taglib uri="http://beehive.apache.org/netui/tags-html-1.0" prefix="netui"%>
<%@ taglib uri="http://beehive.apache.org/netui/tags-template-1.0" prefix="netui-template"%>

<%@ include file = "/SYSTEM/resources/jspf/checkHierarchy.jspf"%>

<%
Throwable errorObj=null;
if (session.getAttribute("__LAST_EXCEPTION__")==null) {
    if (errorObj==null)
        errorObj=(Throwable)request.getAttribute("javax.servlet.error.exception") ;
    if(errorObj != null) {
        StringBuffer errorMsg=new StringBuffer(errorObj.getMessage());
        for (int i=0;i<errorObj.getStackTrace().length;i++) {
            errorMsg.append("\n"+errorObj.getStackTrace()[i]);   
        }
        session.setAttribute("__LAST_EXCEPTION__",errorObj.getMessage()); 
        session.setAttribute("__LAST_EXCEPTION__TRACE",errorMsg.toString()); 
        LogWrapper.error(LogWrapper.GENERAL, "Got error page",  errorObj, new Object[0]);
    } 
}    
%>

<netui:html>
  <head>
    <title>Jacada WorkSpace - Error Page </title>
    <script>
<!--

function getMainWindow() {
    var w = window;
    while (w != w.parent) {
        w = w.parent;
    }
    
    return w;
}


var mainWindow = getMainWindow();
var mainDoc = mainWindow.document;
try {
   if (mainWindow.Push) {
      mainWindow.Push.stop();
   }
} catch( ex) {}
mainWindow.location.href = "<%=request.getContextPath()%>/SYSTEM/errorPage.jsp;" 
							+ mainWindow.sessionCookieName + "=<%=session.getId()%>";


// -->
</script>

  </head>
   <body>
<%@ include file = "/USER/error.jspf" %>
</body>
</netui:html>

