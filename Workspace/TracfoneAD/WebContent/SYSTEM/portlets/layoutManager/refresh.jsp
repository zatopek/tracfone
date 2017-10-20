<%@ page language="java" contentType="text/html;charset=UTF-8"%>
<%@ include file = "/SYSTEM/resources/jspf/pageIncludes.jspf"%>
<%@ taglib uri="http://beehive.apache.org/netui/tags-databinding-1.0" prefix="netui-data"%>
<%@ taglib uri="http://beehive.apache.org/netui/tags-html-1.0" prefix="netui"%>
<%@ taglib uri="http://beehive.apache.org/netui/tags-template-1.0" prefix="netui-template"%>
<%@ taglib uri="http://www.jacada.com/taglibs/jacada" prefix="jacada"%>

<%@ include file = "/SYSTEM/resources/jspf/checkHierarchy.jspf"%>
<script language="JavaScript" type="text/javascript" src="<%=request.getContextPath()%>/SYSTEM/resources/js/prototype.js"></script>
<script language="JavaScript" type="text/javascript" src="<%=request.getContextPath()%>/USER/resources/js/override.js"></script>


<netui:html>
 <body>
        <script language="JavaScript" type="text/javascript">
         <!--
            opener.$W().removeWindow(window);
            window.close();
            opener.onLayoutChanged();
            //opener.$W().shouldLogout = false;
            //opener.$W().Push.stop();
            //opener.refresh();
            //opener.location.href="<%=request.getContextPath()%>/Controller.jpf?reload=true";
            
        //-->
        </script>
 </body>
  
</netui:html>

   