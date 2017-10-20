<%@page import="com.jacada.jad.personalization.IPersonalization"%>
<%@page import="SYSTEM.global.SharedData"%>
<%
	
		SharedData sharedData = SharedData.getSharedData(request);
		IPersonalization personalization = sharedData.getPresentationManager().getPersonalization(request);
		out.write(request.getContextPath() + "/" + personalization.getThemeDirectory()+ "/style.css");
	
%>
