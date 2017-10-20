<%@page import="com.jacada.jad.taskmanager.TaskManagerHandler"%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN">
<%@ page language="java" contentType="text/html;charset=UTF-8" session="true"%>
<%@ page import="com.jacada.jad.push.PushPublisher"%>
<%@ page autoFlush="true"%>
<%@ page import="org.springframework.context.ApplicationContext"%>
<%@page import="org.springframework.web.context.support.WebApplicationContextUtils"%>
<% 

   response.setHeader("Cache-Control","no-cache"); //HTTP 1.1
   response.setHeader("Pragma","no-cache"); //HTTP 1.0
   response.setDateHeader ("Expires", 0); //prevents caching at the proxy server
   PushPublisher.stopAccumulating(session);	
   
   //Notify the TaskManager that the client is ready for push messages
   ApplicationContext applicationContext = WebApplicationContextUtils.getWebApplicationContext(request.getSession().getServletContext());
   TaskManagerHandler taskManagerHandler = (TaskManagerHandler)applicationContext.getBean("taskManager");
   taskManagerHandler.stopAccumulating();
%>