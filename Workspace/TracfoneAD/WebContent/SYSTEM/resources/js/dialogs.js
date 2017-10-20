// Dialog Code
var currDialogName;
var currDialogWidth;
var currDialogHeight;

currDialogName = null;

function hideDialog(dialogId) {
    if (document.getElementById(dialogId)) {
	  var dialogElement = document.getElementById(dialogId);
	  if (dialogElement.style.visibility == "hidden") return;
	  dialogElement.style.visibility = "hidden";
	
	  if (document.getElementById(dialogId + "BackgroundDiv")) {
         var dialogBackElement = document.getElementById(dialogId + "BackgroundDiv");
		 dialogBackElement.style.visibility = "hidden";
         dialogBackElement.style.width = 0;
         dialogBackElement.style.height = 0;
      }
    }
    
    currDialogName = null;
}

function resizeDialog() {
    if (currDialogName != null) {
        showDialog(currDialogName, currDialogWidth , currDialogHeight);
    }
}

function showDialog(dialogId, width , height) {
    if (currDialogName != null && currDialogName != dialogId) {
        hideDialog(currDialogName);
    }
    if (document.getElementById(dialogId)) {
        
       document.body.onresize=new Function("resizeDialog()");
        
       currDialogName = dialogId;
       currDialogWidth = width;
       currDialogHeight = height;
       
	   var dialogElement = document.getElementById(dialogId);

	   if (document.getElementById(dialogId + "BackgroundDiv")) {
	     var dialogBackElement = document.getElementById(dialogId + "BackgroundDiv");
  	     dialogBackElement.style.visibility = "visible";
       }

	   dialogElement.style.visibility = "visible";
	   setDialogSizeAndPos(dialogId, width , height);
	   
	   // set focus to inner iframe
	   var frame = dialogElement.children[0];
	   if (frame.tagName == 'IFRAME') {
	   		frame.contentWindow.focus();	   	
	   }
    }
}

function setDialogSizeAndPos(dialogId, dialogWidth, dialogHeight)
{
	var theDialogDiv = document.getElementById(dialogId);
	
	
	var dialogBkgdDiv = document.getElementById(dialogId + "BackgroundDiv");

    
    dialogBkgdDiv.style.height = '100%';
    dialogBkgdDiv.style.width = '100%';
    var ch = dialogBkgdDiv.clientHeight;
    var sh = document.body.scrollHeight;
    var cw = document.body.clientWidth;
    var sw = document.body.scrollWidth;

    var theTop;
    var theLeft;
    
    if ( (ch - dialogHeight) < 0 )
    {
        theTop = document.documentElement.scrollTop;
    } else {
        theTop = parseInt((ch - dialogHeight)/2) + document.body.scrollTop;
    }

    if ( (cw - dialogWidth) < 0 )
    {
        theLeft = document.documentElement.scrollLeft;
    } else {
        theLeft = parseInt((cw - dialogWidth)/2) + document.body.scrollLeft;
    }

    if(typeof console != 'undefined'){
    	console.log('dialogBkgdDiv.clientHeight='+dialogBkgdDiv.clientHeight);
    	console.log('dialogBkgdDiv.scrollHeight='+dialogBkgdDiv.scrollHeight);
    }
    
    
    dialogBkgdDiv.style.top = 0;
    dialogBkgdDiv.style.left = 0;

    theDialogDiv.style.top = theTop+"px";
    theDialogDiv.style.left = theLeft+"px";
    theDialogDiv.style.height = dialogHeight+"px";
    theDialogDiv.style.width = dialogWidth+"px";
}



function openThemesDialog() {
	if ($W().cti && !$W().cti.allowLayoutActions() ) {
      ShowAlertMessageWhenHostedAppAreRunning($W().localeManager.getLocalizationValue('application.javascript.message.alert.applyThemeInCallStatus')); 
      return;
    }
    openSubWindow('SYSTEM/portlets/themes/ThemesController.jpf', 250 , 120, null, "ThemesWindow");
}

function openApplyLayoutDialog() {
	 if ($W().cti && !$W().cti.allowLayoutActions() ) {
      ShowAlertMessageWhenHostedAppAreRunning($W().localeManager.getLocalizationValue('application.javascript.message.alert.applyLayoutInCallStatus')); 
      return;
    }
    openSubWindow('SYSTEM/portlets/layoutManager/LayoutManagerController.jpf', 250 , 120, null, "ApplyLayoutWindow");
    
}

//note: this function uses obsolute path so that portlets like the cti will be able to use it
function openDialPadPortletWindow() {   
    openSubWindow($W().contextPath+'/SYSTEM/portlets/dialPadWindow/Controller.jpf', 266, 147, null, "dialPadPortletWindow");
}

function openFavoritesDialog() {
    openSubWindow('SYSTEM/portlets/favorites/favManager/Controller.jpf', 520, 370, null, "ManageFavoritesWindow");
}

/*
 * Presents the relevant page when a favorite is clicked from the Favorites menu item
 * 	url - The page's url
 * 	newWindow - A boolean that indicates if the page should be opened in a new window or in the Favorites tab
 * 	name - The displayed favorite's name
 */
function openFavorite(url, newWindow, name) {
    if (newWindow) {
        window.open(url, '_blank');
    } else {
    	$W().ShowTabById('FavoritesTab');
    	if($W().isFavoritesTabTitleDynamic){
			$W().setTabTitle("FavoritesTab", $W().localeManager.getLocalizationValue(name));
    	}
        $W().loadintoIframe('FavoritesFrame', url);
    }
}


function displayAddFavorites(name, url, newWindow) {
    pars = "name=" + name +
           "&url=" + url +
           "&newWindow=" + newWindow +
           "&last=";
           
    openSubWindow('SYSTEM/portlets/favorites/favManager/Controller.jpf?' + pars, 480, 370, null, "DisplayAddFavoritesWindow");
}

function openApplyLocaleDialog() {
	if (checkIfWeAreHostingARunningApplication() || ($W().cti && !$W().cti.allowLayoutActions()) ) {
      ShowAlertMessageWhenHostedAppAreRunning($W().localeManager.getLocalizationValue('application.javascript.message.alert.setLanguageInCallStatus')); 
      return;
    }
    openSubWindow('SYSTEM/portlets/localeManager/LocaleManagerController.jpf', 250 , 120, null, "ApplyLocaleWindow");  
}

function openSubWindow(url, width, height, scroll, name) {
    var wide = window.screen.availWidth;
    var high = window.screen.availHeight;
    
    var top = (high / 2) - (height / 2);
    var left = (wide / 2) - (width / 2);

    var sessionid = GetCookie($W().sessionCookieName);
    
    var features = 'width=' + width;
    features += ',height='+height;

    features += ',top='+ top;
    features += ',left='+ left;
    
    features += ',scrollbars=';    
    if (scroll) {
       features += '1';
    } else {
       features += '0';
    }
    
    features += ',menubar=no,toolbar=no,status=no,resizable=no';    
    
    if( name == undefined )
    {
       name = '_blank';
    }
    var newWindow=window.open(url + ';' + $W().sessionCookieName + '=' + sessionid, name, features);
    try {
        $W().openWindows[openWindows.length]=newWindow;
    }
    catch (e) {
        
    }
}

function runApplicationFromMenu(app) {
	if(typeof isApplicationRunAsNested == 'function' && 
			isApplicationRunAsNested(app)){
		// retrieve the folder location of the application
		var lastIndexOfSlash = app.lastIndexOf("\\");
		var dir = app.substr(0, lastIndexOfSlash + 1);
		// retrieve the name of the executable application 
		var exeName = app.substr(lastIndexOfSlash + 1, app.length - 1);
		runApplicationWithoutNesting(exeName, dir, "");
		return;
	}

    try {
        var wsh=new ActiveXObject("WScript.Shell"); 
        var newApp = '"' + app + '"';
        wsh.Run(newApp, 1); 
    } catch (ex) {
       if (ex.number == -2146827859) {
       	  $W().LogManager.getLogger("DIALOGS").error("Cannot run the selected application.\nTo run an Application menu option, first enable all required IE browser security settings for ActiveX controls and plug-ins.");
          alert($W().localeManager.getLocalizationValue('application.javascript.message.alert.clientPermissions'));
          return;
       }
       throw ex;
    }
}

// Cookies

function GetCookie (name) {  
  var arg = name + "=";  
  var alen = arg.length;  
  var clen = document.cookie.length;  
  var i = 0;  
  while (i < clen) {
    var j = i + alen;    
    if (document.cookie.substring(i, j) == arg)      
      return getCookieVal (j);    
    i = document.cookie.indexOf(" ", i) + 1;    
    if (i == 0) 
      break;   
  }  
  return null;
}

function SetCookie (name, value) {  
  var value = GetCookie(name);
  if(count != null) {
    DeleteCookie(name);
  }
  
  var argv = SetCookie.arguments;  
  var argc = SetCookie.arguments.length;  
  var expires = (argc > 2) ? argv[2] : null;  
  var path = (argc > 3) ? argv[3] : null;  
  var domain = (argc > 4) ? argv[4] : null;  
  var secure = (argc > 5) ? argv[5] : false;  
  document.cookie = name + "=" + escape (value) + 
                    ((expires == null) ? "" : ("; expires=" + expires.toGMTString())) + 
                    ((path == null) ? "" : ("; path=" + path)) +  
                    ((domain == null) ? "" : ("; domain=" + domain)) +    
                    ((secure == true) ? "; secure" : "");
}

function DeleteCookie (name) {  
  var exp = new Date();  
  exp.setTime (exp.getTime() - 1);   
  var cval = GetCookie (name);  
  document.cookie = name + "=" + cval + "; expires=" + exp.toGMTString();
}

function getCookieVal(offset) {
  var endstr = document.cookie.indexOf (";", offset);
  if (endstr == -1)
    endstr = document.cookie.length;
  return unescape(document.cookie.substring(offset, endstr));
}

function getDialogBgdZIndex(){
	return 20500;
} 

function getDialogZIndex(){
	return 20501;
}