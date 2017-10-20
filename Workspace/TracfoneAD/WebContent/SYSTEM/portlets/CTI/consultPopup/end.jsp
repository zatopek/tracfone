
<%@ page language="java" contentType="text/html;charset=UTF-8"%>
<%@ include file = "/SYSTEM/resources/jspf/pageIncludes.jspf"%>
<%@ taglib uri="http://beehive.apache.org/netui/tags-databinding-1.0" prefix="netui-data"%>
<%@ taglib uri="http://beehive.apache.org/netui/tags-html-1.0" prefix="netui"%>
<%@ taglib uri="http://beehive.apache.org/netui/tags-template-1.0" prefix="netui-template"%>


<%@ include file = "/SYSTEM/resources/jspf/checkHierarchy.jspf"%>

<netui:html>
    <head>
        <title>
            End Popup
        </title>

        <script language="JavaScript" type="text/javascript" src="<%=request.getContextPath()%>/SYSTEM/resources/js/common.js"></script>
        <script language="JavaScript" type="text/javascript" src="<%=request.getContextPath()%>/SYSTEM/resources/js/prototype.js"></script>
        <script language="JavaScript" type="text/javascript" src="<%=request.getContextPath()%>/SYSTEM/resources/js/jad.js"></script>
        <script language="JavaScript" type="text/javascript" src="<%=request.getContextPath()%>/USER/resources/js/override.js"></script>

        <link href="<%=request.getContextPath()%>/SYSTEM/resources/css/jadstyle.css" type="text/css" rel="stylesheet">        
        <netui-data:getData resultId="themePath" value="${sharedFlow.globalApp.presentationManager.personalization.themeDirectory}"/>
        <link href="<%=request.getContextPath()+"/"+ pageContext.getAttribute("themePath")+"/style.css" %>" type="text/css" rel="stylesheet">
        <link href="<%=request.getContextPath()%>/USER/resources/css/override.css" type="text/css" rel="stylesheet">
        <script language="JavaScript" type="text/javascript"> 
            function createButton(btnId, action) 
            {
                document.write('<div class="def" id="' + btnId + '" onmouseover="javascript: this.className = \'over\';"' +
                                ' onmouseout="javascript: this.className = \'def\';" onmousedown="javascript: this.className = \'active\';"' + 
                                ' onmouseup="javascript: this.className = \'def\';"' +
                                ' onclick="' + action + '">' +
                                '<span class="button middle" id="middle' + btnId + '"><p class="icon" ></p></span>' +                               
                                '</div>');
            }
        </script> 
        
    </head>
    <body class="ctiPopup">
       
        <script language="JavaScript" type="text/javascript"> 
            createButton('EndBtn', 'javascript:$W().cti.doEndAction(\'endCall\');$W().cti.popup.hide();') ;
            createButton('EndOpenMediaBtn', 'javascript:$W().cti.doEndAction(\'endItem\');$W().cti.popup.hide();') ;
        </script>

    </body>
</netui:html>