<%@ page contentType="text/html;charset=UTF-8" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt"%>
<%@ include file = "/SYSTEM/resources/jspf/includes/locale.jspf"%>
<html>
  <head>
    <script>
        var CONTACT_LIST_JSON_URL = "${pageContext.request.contextPath}/messageHistory.json";
    </script>

    <%@ include file = "/SYSTEM/resources/jspf/includes/extjsPortletIncludes.jspf"%>
	<script type="text/javascript">
		var SESSIONS_ON_PAGE = 16;
	</script>
    
    <!-- Use the override.js file to override constants  -->
    <script language="JavaScript" type="text/javascript" src="<%=request.getContextPath()%>/USER/resources/js/override.js"></script>

    <script type="text/javascript" src="imhistory.js"></script>
  
  </head>
  
  <body onkeydown="onKeyDownHandler(event);">  
  </body>
</html>