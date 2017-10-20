<%@ page language="java" contentType="text/html;charset=UTF-8"%>
<HTML>

<head>
    	<script type="text/javascript" src="${pageContext.request.contextPath}/SYSTEM/resources/js/extJS/adapter/ext/ext-base.js"></script>
	    <script type="text/javascript" src="${pageContext.request.contextPath}/SYSTEM/resources/js/extJS/ext-all.js"></script>
	    <script type="text/javascript" src="${pageContext.request.contextPath}/USER/portlets/multiTab/NestingExtJsHelper.js"></script>
	<script language="JavaScript" type="text/javascript" src="<%=request.getContextPath()%>/SYSTEM/resources/js/tabs.js"></script>
	<script language="JavaScript" type="text/javascript" src="<%=request.getContextPath()%>/SYSTEM/resources/js/jad.js"></script>
	<script language="JavaScript" type="text/javascript" src="<%=request.getContextPath()%>/SYSTEM/resources/js/common.js"></script>
	<script language="JavaScript" type="text/javascript" src="NestingExtJS.js"></script>
	<script language="JavaScript" type="text/javascript" src="NestingExtJsHelper.js"></script>
	<!-- Include Ext stylesheets here: -->
	<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/SYSTEM/resources/js/extJS/resources/css/ext-all.css" />
</head>
<body onkeydown="onKeyDownHandler(event);">
	<div id="main"></div>
</body>
</HTML>