<%@ page language="java" contentType="text/html;charset=UTF-8"%>
<%@ taglib uri="http://beehive.apache.org/netui/tags-databinding-1.0" prefix="netui-data"%>
<%@ taglib uri="http://beehive.apache.org/netui/tags-html-1.0" prefix="netui"%>
<%@ taglib uri="http://beehive.apache.org/netui/tags-template-1.0" prefix="netui-template"%>
<%@ page autoFlush="true"%>
<% 

   response.setHeader("Cache-Control","no-cache"); //HTTP 1.1
   response.setHeader("Pragma","no-cache"); //HTTP 1.0
   response.setDateHeader ("Expires", 0); //prevents caching at the proxy server
   
   synchronized (session) {
      String inUse = (String) session.getAttribute("__JFAP__InUse");
      if (inUse!=null) {
         session.notifyAll();
      }
      session.setAttribute("__JFAP__InUse","inUse");
//      System.out.println("********************** going to wait for timeout ****************************");
      session.wait(60*60*1000); 
      session.removeAttribute("__JFAP__InUse");
  //    System.out.println("********************** after notify ****************************");
   }
   



%>