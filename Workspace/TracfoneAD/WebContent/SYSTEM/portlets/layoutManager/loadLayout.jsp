<%
   response.setHeader("Cache-Control","no-cache"); //HTTP 1.1
   response.setHeader("Pragma","no-cache"); //HTTP 1.0
   response.setDateHeader ("Expires", 0); //prevents caching at the proxy server
%>
<%
	try {
		String layoutXml = com.jacada.jad.portlets.PortletsManager
		.getInstance(request).getLayoutStr(request);
		out.write(layoutXml);
	} catch (JspException ex) {
		com.jacada.jad.logging.LogWrapper.error(
		com.jacada.jad.logging.LogWrapper.GENERAL, ex);
	}
%>
