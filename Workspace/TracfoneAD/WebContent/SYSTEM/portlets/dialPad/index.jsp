<%@ page language="java" contentType="text/html;charset=UTF-8"%>
<%@ include file = "/SYSTEM/resources/jspf/pageIncludes.jspf"%>
<%@ taglib uri="http://beehive.apache.org/netui/tags-databinding-1.0" prefix="netui-data"%>
<%@ taglib uri="http://beehive.apache.org/netui/tags-html-1.0" prefix="netui"%>
<%@ taglib uri="http://beehive.apache.org/netui/tags-template-1.0" prefix="netui-template"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt"%>
<%@ include file = "/SYSTEM/resources/jspf/checkHierarchy.jspf"%>
<%@ include file = "/SYSTEM/resources/jspf/includes/locale.jspf"%>
<netui:html>
    <head>
        <title>
            <fmt:message bundle="${applicationMessages}" key="application.portlet.label.dialPad"></fmt:message>
        </title>

      <script language="JavaScript" type="text/javascript" src="<%=request.getContextPath()%>/SYSTEM/resources/js/jad.js"></script>
      <script language="JavaScript" type="text/javascript" src="<%=request.getContextPath()%>/USER/resources/js/override.js"></script>
      <script language="JavaScript" type="text/javascript" src="<%=request.getContextPath()%>/SYSTEM/resources/js/common.js"></script>
    
<script language="JavaScript" type="text/JavaScript">
cti = null;
ctiEnabled = false;
notready = true;
document.onkeypress = dialpad_keypress;

function updateDialog() {
    document.getElementById('dialNumber').disabled = !ctiEnabled;
    document.getElementById('dialBtn').disabled = !ctiEnabled;
}

function pad(number) {
  if (ctiEnabled) {
    document.getElementById('dialNumber').value = document.getElementById('dialNumber').value + number
  }
}

function dial() {
    if (document.getElementById('dialNumber').value == null || document.getElementById('dialNumber').value == '') {
       return;
    }
    ctiEnabled = false;
    updateDialog();

    cti.doAction('dial', document.getElementById('dialNumber').value);    
}

function onstatechanged(newState) {
    if (cti != null)
    {
        ctiEnabled = cti.isDialEnabled();
        updateDialog();
    }
}
 
function init() {
    cti = $W().cti;
    if (cti != null) {
        ctiEnabled = cti.isDialEnabled();
        if(cti.onstatechanged == null) {
            cti.onstatechanged = onstatechanged;
        }

        updateDialog();
    } else {
      setTimeout("init();", 1000);
    }
}

function unload() {
  if (cti != null) {
    cti.onstatechanged = null;
  }
}

function dialpad_keypress(e) {
    var clickedOn = window.event.keyCode;
           
    var allowedChar = false;
    var clickedOnParsed = String.fromCharCode(clickedOn);
    if(clickedOnParsed == '*' || clickedOnParsed == '#' || 
        clickedOnParsed >= '0' && clickedOnParsed <= '9')
    {
        allowedChar = true;
    }
    
    if(clickedOn == 13) // enter
    {
        document.getElementById('dialBtn').click();
        return;
    }
    
    if( !allowedChar  )
    {
        window.event.keyCode = 0; 
        window.event.cancelBubble = true; 
        window.event.returnValue = false;
    }
    return;
    
    
    /*
    //Implementation when the pad works even when not in focus
    //Limitation: typing will be concatenated to the end of the value.
    var clickedOn = window.event.keyCode;
           
    var allowedChar = false;
    var clickedOnParsed = String.fromCharCode(clickedOn);
    if(clickedOnParsed == '*' || clickedOnParsed == '#' || 
        clickedOnParsed >= '0' && clickedOnParsed <= '9')
    {
        allowedChar = true;
    }
    
    if( document.selection.createRange().text != "" && clickedOn != 13 )
    {
        if( !allowedChar )
        {
            window.event.keyCode = 0; 
            window.event.cancelBubble = true; 
            window.event.returnValue = false;
        }
        return;
    }
     
     // cancel the handling of the current key, we'll take care of it
     window.event.keyCode = 0; 
     window.event.cancelBubble = true; 
     window.event.returnValue = false;
   
    
    if(clickedOn == 13) // enter
        $("dialBtn").click();
    else
    {
        if( allowedChar )
        {
            pad(clickedOnParsed);   
        }            
    }   
        
    */
       
}

</script>    
</head>
    <body onkeydown="onKeyDownHandler(event);" onunload="unload();" >
        <table cellpadding="0" cellspacing="0">
         <tr>
          <td><img src="<%=request.getContextPath()%>/SYSTEM/portlets/dialPad/pad1.JPG" onclick="pad('1');"></td>
          <td><img src="<%=request.getContextPath()%>/SYSTEM/portlets/dialPad/pad2.JPG" onclick="pad('2');"></td>
          <td><img src="<%=request.getContextPath()%>/SYSTEM/portlets/dialPad/pad3.JPG" onclick="pad('3');"></td>
         </tr>
         <tr>
          <td><img src="<%=request.getContextPath()%>/SYSTEM/portlets/dialPad/pad4.JPG" onclick="pad('4');"></td>
          <td><img src="<%=request.getContextPath()%>/SYSTEM/portlets/dialPad/pad5.JPG" onclick="pad('5');"></td>
          <td><img src="<%=request.getContextPath()%>/SYSTEM/portlets/dialPad/pad6.JPG" onclick="pad('6');"></td>
         </tr>
         <tr>
          <td><img src="<%=request.getContextPath()%>/SYSTEM/portlets/dialPad/pad7.JPG" onclick="pad('7');"></td>
          <td><img src="<%=request.getContextPath()%>/SYSTEM/portlets/dialPad/pad8.JPG" onclick="pad('8');"></td>
          <td><img src="<%=request.getContextPath()%>/SYSTEM/portlets/dialPad/pad9.JPG" onclick="pad('9');"></td>
         </tr>
         <tr>
          <td><img src="<%=request.getContextPath()%>/SYSTEM/portlets/dialPad/padstar.JPG" onclick="pad('*');"></td>
          <td><img src="<%=request.getContextPath()%>/SYSTEM/portlets/dialPad/pad0.JPG" onclick="pad('0');"></td>
          <td><img src="<%=request.getContextPath()%>/SYSTEM/portlets/dialPad/padp.JPG" onclick="pad('#');"></td>
         </tr>
        </table>
        <br>
        <nobr><input type='text' id='dialNumber' style='width: 130px' /><button id='dialBtn' onclick="dial();"><fmt:message bundle="${applicationMessages}" key="application.dialPad.button.dial"></fmt:message></button></nobr>
        
<script language="JavaScript" type="text/JavaScript">
updateDialog();
setTimeout("init();", 1000);

</script>            
    </body>
</netui:html>