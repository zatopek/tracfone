var request ;
function sf(){    
    var targetUrl = Ext.getCmp("spring-security-redirect").getValue();
    if (targetUrl == null || targetUrl == "" || targetUrl=="null") {
        targetUrl =  window.location.pathname;
        if (targetUrl.indexOf("Controller") < 0 && targetUrl.indexOf("dynamicviews") < 0) {
            targetUrl="/Controller.jpf";
        }
        Ext.getCmp("spring-security-redirect").setValue(targetUrl.substring(targetUrl.indexOf("/", 1)));
    }

}

function onTimeout() {
}

function stopTimeout() {
//   if (request!=null) {
//       request.transport.abort();
//   }
//   new Ajax.Request("SYSTEM/resources/jsp/stopLoginTimeout.jsp", {method: 'get'} );
}


function getMainWindow() {
    var w = window;
    while (w != w.parent) {
        w = w.parent;
    }
    
    return w;
}

function getCookie(name) {
    var value = "; " + document.cookie;
    var parts = value.split("; " + name + "=");
    if (parts.length == 2) return parts.pop().split(";").shift();
}

var mainWindow = getMainWindow();
var mainDoc = mainWindow.document;
if (mainDoc != document) {
    mainWindow.location.href = "<%=request.getContextPath()%>/terminated.jsp&username=" + this.getCookie('username');
}

function enterCloseForm(e) {
   var evt = e || window.event;
   if(!evt){
	   return;
   }
   if ( evt.keyCode == 13 ) { 
	   evt.keyCode = 0; 
	   evt.cancelBubble = true; 
	   evt.returnValue = false; 
      //document.all.LoginForm.submit();
      document.LoginForm.submit.click();
   } else { 
	   evt.cancelBubble = false; 
	   evt.returnValue = true; 
   }             
}

function closeWindow() { 
	msie = navigator.userAgent.indexOf('MSIE');
	version = (navigator.userAgent.toLowerCase().match( /.+(?:rv|it|ra|ie|me)[\/: ]([\d.]+)/ ) || [])[1]
	if(msie > 0 && version == 6){
    	window.opener = window; 
    	window.close();
    } 
    else { ///for ie7 - without the pop up to allow closing the window
    	window.open('','_parent','');
		window.close();
	}
    
}

