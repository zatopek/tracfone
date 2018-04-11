<!DOCTYPE HTML>
<%@page import="java.text.MessageFormat"%>
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

	<%
    ApplicationContext applicationContext = WebApplicationContextUtils.getWebApplicationContext(application);
    LocaleBean localeBean = (LocaleBean)applicationContext.getBean("LocaleBean");
    ProductInfo product = (ProductInfo)applicationContext.getBean("productInfo");
    // need it to be a variable in order to solve the warning in jsp
    String jSpringSecurityCheck = "j_spring_security_check";
	%>
	<fmt:setLocale value='<%=localeBean.getDefaultApplicationLocale()%>'/>
	<fmt:setBundle basename='<%=localeBean.getResourceBundleBaseName()%>' scope="request" var="loginMessages"/>
	<fmt:requestEncoding value="UTF-8"/>
	

</head>
	<body style="background: white;">
	<div id="centeredDiv"></div>
	
	
	<script  type="text/javascript">
		$W().username = "";
		$W().contextPath = "<%=request.getContextPath()%>";
		loadTheme();
        extPersonalizationInit(document, "${pageContext.request.contextPath}");
        var ss = document.createElement("link");
        ss.setAttribute("rel", "stylesheet");
        ss.setAttribute("type", "text/css");
        ss.setAttribute("href", "<%=request.getContextPath()%>"+"/"+$W().theme.directory+"/style.css");
        document.getElementsByTagName("head")[0].appendChild(ss);

    </script>

	<script>
	function getParameterByName(name, url) {
		if (!url) url = window.location.href;
		name = name.replace(/[\[\]]/g, "\\$&");
		var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
		results = regex.exec(url);
		if (!results) return null;
		if (!results[2]) return '';
		return decodeURIComponent(results[2].replace(/\+/g, " "));
	}

	var username = getParameterByName('username');
	if(username && username.length > 0){
		document.cookie = "username=" + username;
	}

	</script>
	
	
	<script type="text/javascript" >
	
		Ext.onReady(function(){
			Ext.QuickTips.init();
			
			Ext.create('Ext.panel.Panel', {
				height: '100%',
				id: 'loginPanel',
			    border: false,

			    layout: {
			    	type: 'vbox',
			    	align: 'stretch'
			    },
			    defaults: {
			        border: false
			    },
			    listeners: {
			    	afterrender: function(){
			    		sf();
			    	}
			    },
			    items: [{
			    	xtype: 'panel',
			    	bodyCls : 'logo-panel',
			    	height: 149
			    },{
			    	xtype: 'form',
			    	bodyCls : 'form-panel',
			    	flex: 1,
			    	layout: {
				    	type: 'vbox',
				    	align: 'center'
				    },
			    	url: '<%=jSpringSecurityCheck%>',
			    	standardSubmit: true,
			    	defaultType: 'textfield',
			    	items:[
	    	       {
	    	    	   xtype: 'panel',
	    	    	   html: '<%=MessageFormat.format(localeBean.getLocalizationValueByAgent("application.loginPage.label.welcome", null), product.getVersion())%>',
	    	    	   bodyCls : 'form-panel-sub-title',
	    	    	   padding: '0 0 32 0',
	    	    	   width: 500,
	    	    	   border: false
	    	       },{
	    	    	   xtype: 'panel',
	    	    	   html: '<%=localeBean.getLocalizationValueByAgent("application.loginPage.label.loginError", null)%>',
	    	    	   bodyCls : 'loginErrorMsg',
	    	    	   hideMode: 'offsets',
	    	    	   width: 500,
	    	    	   hidden: <%=request.getParameter("login_error")==null%>,
	    	    	   border: false
	    	       },
					{
					    name: 'j_username',
						emptyText: 'Username',
					    value: '',
					    padding: '10 0 18 0',
					    hideLabel: true,
					    cls: 'login-form-field-user',
						enableKeyEvents: true,
		 	        	listeners: {
		 	        		keypress: function(textfield, e, eOpts){
		 	        			if(e.getKey() == e.ENTER){
		 	        				this.up('form').down('button').disable();
		 	        				var form = this.up('form').getForm();
							    	form.submit();
		 	        			}
		 	        		}
		 	        	}
					},{
					    name: 'j_password',
						emptyText: 'Password',
					    value: '',
					    inputType: 'password',
					    hideLabel: true,
					    padding: '0 0 21 0',
					    cls: 'login-form-field-password',
						enableKeyEvents: true,	
		 	        	listeners: {
		 	        		keypress: function(textfield, e, eOpts){
		 	        			if(e.getKey() == e.ENTER){
		 	        				this.up('form').down('button').disable();
		 	        				var form = this.up('form').getForm();
							    	form.submit();
		 	        			}
		 	        		}
		 	        	}
					},{
					    name: 'username',
						id: 'username',
						xtype: 'hidden',
						value: '<%=request.getParameter("username") %>'
					},{
						xtype: 'hidden',
						name: 'spring-security-redirect',
						id: 'spring-security-redirect',
						value: '<%=request.getParameter("spring-security-redirect") %>'
					}<%-- ,{
						xtype: 'hidden',
						name: 'urlPrefix',
						value: '<%=request.getAttribute("jad_urlPrefix") %>'
					},{
						xtype: 'hidden',
						name: 'sessionRef',
						value: ''
					} --%> ,{
					    xtype: 'button',
					    itemId: 'btnSubmit',
					    text: '<%=localeBean.getLocalizationValueByAgent("application.loginPage.label.login", null)%>',
					    height: 44,
					    cls: 'btn-login',
					    handler: function() {
					    	this.disable();
					    	var form = this.up('form').getForm();
					    	form.submit();
					    }
					}
			    	  ]
			    	}
			    ],
			    renderTo: 'centeredDiv'
			});
		});
		
	</script>
		
	</body>

</html>