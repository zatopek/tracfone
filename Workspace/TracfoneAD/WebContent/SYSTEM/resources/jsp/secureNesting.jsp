<%@ page language="java" contentType="text/html;charset=UTF-8"%>

<html>
<head>
 <script type="text/javascript" src="${pageContext.request.contextPath}/SYSTEM/resources/js/jad.js"></script>
 <script type="text/javascript" src="${pageContext.request.contextPath}/USER/portlets/multiTab/NestingExtJsHelper.js"></script>
 <script type="text/javascript" src="${pageContext.request.contextPath}/SYSTEM/resources/js/tabs.js"></script>
    <script type="text/javascript" src="${pageContext.request.contextPath}/SYSTEM/resources/js/common.js"></script>
<script>
var tabUrl = "<%=request.getParameter("tabUrl")%>";

</script>
</head>
<body onload="">
<object CLASSID="clsid:8856F961-340A-11D0-A96B-00C04FD705A2" ID="webBrowserComponent" height="100%" width="100%"></object>
<script>
 document.getElementById('webBrowserComponent').Navigate(tabUrl);
 </script>
</body>
</html>



 