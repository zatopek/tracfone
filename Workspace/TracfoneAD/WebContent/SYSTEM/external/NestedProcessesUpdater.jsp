<%@ page language="java" contentType="text/html;charset=UTF-8" session="false"%>
<%@ page import="com.jacada.jad.services.JacadaService"%>
<%@ page import="org.springframework.context.ApplicationContext"%>
<%@ page import="org.springframework.web.context.support.WebApplicationContextUtils"%>
<%
	response.setHeader("Cache-Control","no-cache"); //HTTP 1.1
	response.setHeader("Pragma","no-cache"); //HTTP 1.0
	response.setDateHeader ("Expires", 0); //prevents caching at the proxy server
	
	com.jacada.jad.logging.LogWrapper.debug("in update nested process jsp.");
	ApplicationContext applicationContext = WebApplicationContextUtils.getWebApplicationContext(application);
	JacadaService service = (JacadaService)applicationContext.getBean("JacadaService");
	service.updateNestedProcessResult(request);
%>