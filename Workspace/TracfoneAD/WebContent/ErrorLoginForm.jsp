<%@ page isErrorPage="true" session="false" %>
<html>
    <body>
    <%
//  	request.getSession().setAttribute("jad.login.error", Boolean.TRUE);   
    Cookie cookie = new Cookie("jad.login.error","true");
    cookie.setMaxAge(2);
    response.addCookie(cookie);
    response.sendRedirect("LoginForm.jsp");
    %>
    </body>
    </html>

