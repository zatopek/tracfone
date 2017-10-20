<%@page import="com.jacada.service.beans.IUrlStruct"%>
<%@page import="com.jacada.management.UrlCalculator"%>
<%@ page language="java" contentType="text/html;charset=UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt"%>
<%@ taglib uri="http://jakarta.apache.org/taglibs/log-1.0" prefix="log"%>
<%@ include file="/SYSTEM/resources/jspf/includes/locale.jspf"%>
<html>
<head>
<%@ include
	file="/SYSTEM/resources/jspf/includes/extjsPortletIncludes.jspf"%>
	
</head>
<body>
	
	<script>
		new Ext.form.FormPanel(
				{
					bodyPadding : 5, // Don't want content to crunch against the borders
					width : '100%',
					height: '100',
					items : {
								xtype : 'textfield',
								width: '500',
								fieldLabel : 'Script URL (copy from jas settings)',
								id : 'scriptUrl'
					},
					tbar: [
							{
								text : 'Run',
								handler : function() {
									var url = Ext.getCmp('scriptUrl').getRawValue()+'&RemoteServiceUrl=';
									http://127.0.0.1:9090/JADTemplate/InvocationService;jsessionid=F7C3EFBC00F8534840A8ABBC0399BA13.server1
									var serviceUrl = $W().location.protocol+'//'+$W().serverHost+':'+$W().serverPort+'/'+$W().contextPath+'/InvocationService;jsessionid='+$W().wsSessionId;
									url += serviceUrl;
									alert(url);
									document.getElementById('myframe').src = url;
								}
							}
					],
					renderTo : Ext.getBody()
				});
	</script>
	
	<iframe width="100%" height="100%" id="myframe"></iframe>
</body>
</html>