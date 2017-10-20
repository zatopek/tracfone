<%@ page import="org.apache.beehive.netui.pageflow.PageFlowUtils" %>
<%@page import="SYSTEM.global.SharedData"%>
<%@page import="SYSTEM.global.PortalPersonalization"%>
<%@ page language="java" contentType="text/html;charset=UTF-8"%>
<%
                try {
                                String localeType = request.getParameter("localeType"); 
                                SharedData global = (SharedData)PageFlowUtils.getSharedFlow(SYSTEM.global.SharedData.class.getName(), request, request.getSession().getServletContext());
                                PortalPersonalization personalization = ((PortalPersonalization)global.getPresentationManager().getPersonalization(request));
                                String values;
                                if (localeType.equals("script")) {
                                                values = personalization.getScriptJavaScriptLocalizationValues(request);
                                } else {
                                                values = personalization.getApplicationJavaScriptLocalizationValues(request);
                                }
                                out.write(values);
                } catch (Exception ex) {
                                com.jacada.jad.logging.LogWrapper.error(
                                com.jacada.jad.logging.LogWrapper.GENERAL, ex);
                }
%>

