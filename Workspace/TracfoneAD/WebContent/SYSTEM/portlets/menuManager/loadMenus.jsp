<%@page import="org.springframework.web.context.support.WebApplicationContextUtils"%>
<%@page import="org.springframework.web.context.WebApplicationContext"%>
<%@page import="com.jacada.jad.menus.MenusManager"%>
<%@ page language="java" contentType="text/html;charset=UTF-8"%>

<%
   response.setHeader("Cache-Control","no-cache"); //HTTP 1.1
   response.setHeader("Pragma","no-cache"); //HTTP 1.0
   response.setDateHeader ("Expires", 0); //prevents caching at the proxy server
%>
<%
	ServletContext servletContext = session.getServletContext();
	WebApplicationContext context = WebApplicationContextUtils .getWebApplicationContext(servletContext);
	MenusManager menusManager = (MenusManager) context.getBean("menusManager");
	String menusJson = menusManager.getMenuItemsAsJson();
	out.write(menusJson);
%>
