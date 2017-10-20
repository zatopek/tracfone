<%@ page import="com.jacada.jad.featuresManager.FeaturesManager"%>
<%@ page import="com.jacada.jad.featuresManager.FeatureName"%>
<%@ page import="com.jacada.jad.rap.provider.Authorization"%>
<%@ page import="com.jacada.jad.rap.entities.RAPConstants.Privileges"%>
<html>
    <head>
        
   	 <%@ include file = "/SYSTEM/resources/jspf/includes/extjsPortletIncludes.jspf"%>
   	 <!--  msgTextStyle.css should appear after the extjs one in order to override necessary styles -->
   	 <link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/SYSTEM/resources/css/msgTextStyle.css" />
        <script src="${pageContext.request.contextPath}/SYSTEM/resources/js/extJS-extensions/ext-ColorField.js"></script>
        <script src="${pageContext.request.contextPath}/SYSTEM/resources/js/extJS-extensions/ext-DateTime.js"></script>
        
        <script>
            var MESSAGING_JSON_URL = "${pageContext.request.contextPath}/messaging.json";
            var MESSAGES_DATE_FORMAT = $W().DATE_FORMAT;
            var MESSAGES_TIME_FORMAT = $W().TIME_FORMAT;
        </script>
        <script language="JavaScript" type="text/javascript" src="<%=request.getContextPath()%>/USER/resources/js/override.js"></script>
        <script src="messagingTable.js"></script>
        <script src="messageForm.js"></script>
        
    </head>
        
    <body onkeydown="onKeyDownHandler(event);">
        <div id="messageListDiv"></div>
        <div id="viewPanelDiv"></div>
    </body>
    <%
    FeaturesManager featureManager = (FeaturesManager) applicationContext.getBean("featuresManager");
    Authorization authorization = (Authorization)applicationContext.getBean(Authorization.AUTHORIZATION_BEAN);
    %>
    <script type="text/javascript">
		 //defines whether the search ui will be enabled
         tickerTapeEnabled = eval("<%=featureManager.isEnabled(FeatureName.TickerTape) && authorization.isPrivileged(Privileges.TickerTapeFeature.getPrivilege())%>");
		</script>
</html>