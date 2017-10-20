<!DOCTYPE>
<%@page import="com.jacada.logging.sessionDump.events.DumpEventsStorageUtils"%>
<%@page import="com.jacada.logging.sessionDump.events.DumpEventTokens"%>
<%@page import="com.jacada.logging.sessionDump.events.DumpEvent"%>
<%@ page language="java" contentType="text/html;charset=UTF-8" session="false"%>
<%@ page import="org.springframework.context.ApplicationContext"%>
<%@ taglib uri="http://beehive.apache.org/netui/tags-databinding-1.0" prefix="netui-data"%>
<%@ taglib uri="http://beehive.apache.org/netui/tags-html-1.0" prefix="netui"%>
<%@ taglib uri="http://beehive.apache.org/netui/tags-template-1.0" prefix="netui-template"%>
<%@ taglib uri="http://www.jacada.com/taglibs/jacada" prefix="jacada"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt"%>
<%@ taglib uri='http://java.sun.com/jstl/core_rt' prefix='c'%>

<%@page import="org.springframework.web.context.support.WebApplicationContextUtils"%>
<%@page import="SYSTEM.global.LocaleBean"%>
<%@page import="com.jacada.jad.core.ProductInfo"%>

<%@ include file = "/SYSTEM/resources/jspf/checkHierarchy.jspf"%>

<% 
	response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);	
%>
<html>
<head>
    <title>Jacada WorkSpace</title>
<style type="text/css">
	 #centeredDiv {
	  position: fixed;
	  top: 50%;
	  left: 50%;
	  margin-top: -242px;
	  margin-left: -380px;
	  height: 485px;
	  width: 760px;
	}
</style>

<script  type="text/javascript" src="<%=request.getContextPath()%>/SYSTEM/resources/js/prototype.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/SYSTEM/resources/js/jad.js"></script>
<script  type="text/javascript" src="<%=request.getContextPath()%>/SYSTEM/resources/js/login.js"></script>
<script  type="text/javascript" src="<%=request.getContextPath()%>/SYSTEM/resources/js/common.js"></script>
<script  type="text/javascript" src="<%=request.getContextPath()%>/USER/resources/js/override.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/SYSTEM/resources/js/extJS_/ext-all.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/SYSTEM/resources/js/indexhead.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/SYSTEM/resources/js/JadWrapperToExtJs.js"> </script>

<script  type="text/javascript">
<!--
function closeWindow() { 
   window.opener = window; 
   window.close();  
}

<%@ include file = "/USER/errorPage.jspf" %>
-->
</script> 

	<%
    ApplicationContext applicationContext = WebApplicationContextUtils.getWebApplicationContext(application);
    LocaleBean localeBean = (LocaleBean)applicationContext.getBean("LocaleBean");
    ProductInfo product = (ProductInfo)applicationContext.getBean("productInfo");
    HttpSession session = request.getSession(false);
    %>
    <%-- DumpEvent dumpEvent;
    Exception unCaughtException = new Exception();//(Exception)session.getAttribute("__LAST_EXCEPTION__");
    String unCaughtExceptionMsg="";
    if (unCaughtException != null) {
        unCaughtExceptionMsg = DumpEvent.parseException(unCaughtException);
        dumpEvent = new DumpEvent(DumpEventTokens.UNEXPECTED_EXCEPTION, unCaughtExceptionMsg);
        DumpEventsStorageUtils.notifySessionDump(session, dumpEvent);
    }
    if (session.getAttribute("__LAST_EXCEPTION__TRACE") != null) {
 	   unCaughtExceptionMsg = (String)session.getAttribute("__LAST_EXCEPTION__TRACE");
 	   dumpEvent = new DumpEvent(DumpEventTokens.UNEXPECTED_EXCEPTION, unCaughtExceptionMsg);
 	   DumpEventsStorageUtils.notifySessionDump(session, dumpEvent);
    }%>
    <% if (unCaughtExceptionMsg != null) {
 	   unCaughtExceptionMsg = unCaughtExceptionMsg.replaceAll("\n","<br>");
    }%> --%>
    
	<fmt:setLocale value='<%=localeBean.getDefaultApplicationLocale()%>'/>
	<fmt:setBundle basename='<%=localeBean.getResourceBundleBaseName()%>' scope="request" var="loginMessages"/>
	<fmt:requestEncoding value="UTF-8"/>
	

</head>
	<body style="background: white;">
	<div id="centeredDiv"></div>
	
	<script  type="text/javascript">
		$W().contextPath = "<%=request.getContextPath()%>";
		loadTheme();
        extPersonalizationInit(document, "${pageContext.request.contextPath}");
        var ss = document.createElement("link");
        ss.setAttribute("rel", "stylesheet");
        ss.setAttribute("type", "text/css");
        ss.setAttribute("href", "<%=request.getContextPath()%>"+"/"+$W().theme.directory+"/style.css");
        document.getElementsByTagName("head")[0].appendChild(ss);
    </script>
    
	<script type="text/javascript" >
	
		Ext.onReady(function(){
			Ext.QuickTips.init();
			
			Ext.create('Ext.panel.Panel', {
				height: '100%',
			    border: false,

			    layout: {
			    	type: 'vbox',
			    	align: 'stretch'
			    },
			    defaults: {
			        border: false
			    },
			    items: [{
			    	xtype: 'panel',
			    	bodyCls : 'logo-panel',
			    	height: 149
			    },{
			    	xtype: 'form',
			    	bodyCls : 'form-panel',
			    	flex: 1,
			    	border: false,
			    	layout: {
				    	type: 'vbox',
				    	align: 'center'
				    },
			    	items:[
			    	       {
			    	    	   xtype: 'panel',
			    	    	   layout: {type: 'vbox', align: 'stretch'},
			    	    	   width: 550,
			    	    	   height: 160,
			    	    	   border: false,
			    	    	   bodyStyle : 'background:none; ',
			    	    	   items:{
			    	    	   html: getCustomErrorMessage(), // see errorPage.jspf
			    	    	   bodyCls : 'form-error-sub-title'
			    	    		   
			    	    	   }
			    	       },
			    	       {
			    	    	   xtype: 'panel',
			    	    	   border: false,
			    	    	   layout: {type: 'vbox', align: 'stretch'},
			    	    	   width: 550,
			    	    	   height: 60,
			    	    	   margin: '15 5 5 5',
			    	    	   
			    	    	   items:[
			    	    	          <%-- {
			    	    	        	  html: '<%=unCaughtExceptionMsg%>',
			    	    	        	  bodyCls : 'form-error-msg',
						    	    	   border: false,
						    	    	   autoScroll: true,
						    	    	   height: 150
			    	    	          }, --%>{
						    	    	   xtype: 'displayfield',
						    	    	   value: new Date(),
						    	    	   fieldLabel: 'Exception Time'
						    	       },{
						    	    	   xtype: 'displayfield',
						    	    	   value: '<%=session != null?session.getId():""%>',
						    	    	   fieldLabel: 'Session ID' 
						    	       }
			    	    	          
			    	    	          ]
			    	    	   
			    	       },
						{
						    xtype: 'button',
						    text: '<%=localeBean.getLocalizationValueByAgent("application.terminatedPage.label.close", null)%>',
						    height: 44,
						    cls: 'btn-ok-big',
						    margin: '10px 10px 10px 10px',
						    handler: closeWindow
						}
			    	  ]
			    	}
			    ],
			    renderTo: 'centeredDiv'
			});
		});
	</script>
		
		<% if (session != null && session.getAttribute("JacadaLicenseServletException")!= null && session.getAttribute("JacadaLicenseServletException").equals("true")) { 
         %>  		
           		
           		
           		<script>
           		var msg = '<%=session.getAttribute("__LAST_EXCEPTION__")%>';
           		getCustomErrorMessage = function(){return msg;}
           		</script>
           		
           		<%
           		session.invalidate();
           }
           %>
		
	</body>

</html>
