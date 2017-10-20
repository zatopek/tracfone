<%@ page language="java" contentType="text/html;charset=UTF-8"%>
<%@ page autoFlush="true"%>
<%@ page import="com.jacada.jad.logging.LogWrapper"%>
<%@ page import="com.jacada.jad.push.PushMessage"%>
<%@ page import="com.jacada.jad.push.PushSubscriber"%>
<%@ page import="org.apache.log4j.Logger"%>
<%@ page import="org.json.JSONArray"%>
<%@ page import="com.jacada.jad.push.PushHelper"%> 
<%@ page import="org.apache.beehive.netui.pageflow.PageFlowUtils" %>

<% 
   response.setHeader("Cache-Control","no-cache"); //HTTP 1.1
   response.setHeader("Pragma","no-cache"); //HTTP 1.0
   response.setDateHeader ("Expires", 0); //prevents caching at the proxy server
   String pushTimeout = (String) session.getServletContext().getAttribute("PushTimeout");
   Logger logger = Logger.getLogger("Jacada.Debug.JFAP");//.Push.EventProcessor");
   int pushTimeoutInt = 120000;
   if (pushTimeout != null) {
       try {
            pushTimeoutInt = Integer.parseInt(pushTimeout);
       } catch (NumberFormatException ex) {
           logger.error("invalid pushTimeout value, using default value of 2 minutes ",ex);    
       }
       if (pushTimeoutInt == 0) {
           logger.warn("pushTimeout is set to 0. This might have adverse effect on performance ");    
       }
   } else {
       logger.debug("pushTimeout is not set, using default value of 2 minutes");    
   }
   

	SYSTEM.global.SharedData globalApp = (SYSTEM.global.SharedData)PageFlowUtils.getSharedFlow(SYSTEM.global.SharedData.class.getName(), request, request.getSession().getServletContext());
   	String agentName = globalApp.getCTIManager().getAgentInformation().getName();
	String groupBasedSelector = PushHelper.constructGroupsBasedSelector(request, agentName);
   
   String sessionid = request.getParameter("sessionid");
   Object o = session.getAttribute("__PUSH__");
   Object message = null;
   JSONArray ja = new JSONArray();
    try {
    
       if (o!=null) {
            java.util.Map<String,String> map = new java.util.HashMap<String,String>();
            map.put("message","Duplicate push handlers");
            message = new PushMessage("duplicate",map);
            ja.put(message);
       } else {
           o = new Object();
           session.setAttribute("__PUSH__", o);
           
           PushSubscriber subscriber = (PushSubscriber) session.getAttribute("PushQueue");
           if (subscriber == null) {
                synchronized (session) {
                    subscriber = (PushSubscriber) session.getAttribute("PushQueue");
                    
                    if (subscriber == null) {
                        subscriber = new PushSubscriber(sessionid,request.getContextPath(),groupBasedSelector,agentName);
                        session.setAttribute("PushQueue", subscriber);
                    }
                }
           }

            
            Object m = subscriber.getObject(pushTimeoutInt);
            if (m!=null) {
                ja.put(m);
                m = subscriber.getObjectNoWait();
                while (m != null) {
                    ja.put(m);
                    m = subscriber.getObjectNoWait();
                }
            } else {
                java.util.Map<String,String> map = new java.util.HashMap<String,String>();
                map.put("message","timeout has elapsed");
                message = new PushMessage("timeout",map);
                ja.put(message);
            }
       }       
   } catch (Exception exp) {
        LogWrapper.error(exp);
        java.util.Map<String,String> map = new java.util.HashMap<String,String>();
        map.put("message","got exception in the eventProcessor: "+exp.getMessage());
        message = new PushMessage("exception",map);
        ja.put(message);
   }
   synchronized(o) {
        o.notify();
        session.setAttribute("__PUSH__", null);
   }
   logger.debug("going to send events "+session.getId());

%>
<%= ja.toString()%>