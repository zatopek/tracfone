/*****************************************************************************
  	SCRIPT API - static methods so that they can be override
 ******************************************************************************/
	

/*
This method loads the given url to the script area
*/ 
function loadScript(url){
    //$W().ShowTabById('scriptTab');
    //$W().loadintoIframe("ScriptZone", url);   
}
/*
This method unloads the script that is currently in the script area, and loads an empty page instead. 
*/
function unloadScript(){
	//$W().loadintoIframe("ScriptZone", "SYSTEM/resources/html/empty.html");
}
/*
This method navigates to the given link. If a navigation bar doesnt exist in the application the navigation will not be performed.
*/
function navigateToLink(link){
	if ($W().ScriptZone && $W().ScriptZone.NavigationBarFrame && $W().ScriptZone.NavigationBarFrame.clickOnLink) {
	            $W().ScriptZone.NavigationBarFrame.clickOnLink(link);
	}
}

function onCallScriptName(scriptUrl) { 
  	 
     var msg = "in _onCallScriptName :"+scriptUrl;
     $W().ctiAPI._debug(msg);    
     var url = "USER/flows/Controller.jpf?";

     if (scriptUrl != null && scriptUrl.length > 0) {
        url = scriptUrl;
     }
 
 	//if cti available lets add the callerId
 	if($W().cti && $W().cti != null){
     url += '&callerId=' + $W().cti.callerId;
 	}
 
     $W().showLogout(false);
     //$W().loadScript(url); 
}
  
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////  
// The following functions interact with other portlets or the server side, 
// and usually operates as a result of receiving CTI states from the server side
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 

//this methos should be used only whn need to load default disposition script, 
//TBD : Shouls be removed - no direct link between CTI and script.
function loadDisposition() {	 	
     $W().onPushLoadDisposition(getDispositionScriptUrl());
} 

function onPushLoadDisposition(scriptUrl){
	
	if (!$W().useNavigationBar){
	   $W().loadScript(scriptUrl);	                                     
	   return;
	} 
	//if navigation bar is not available, just load into the script zone without navigation bar
    if ($W().ScriptZone.NavigationBarFrame == null || $W().ScriptZone.NavigationBarFrame.clickOnLink==null) {
              $W().loadScript(scriptUrl);
    } else {
    		//if navigation bar is available then assuming this is the default script
              ShowCallLogging();
              $W().navigateToLink("root.calldisposition");
    }
}

function onUnloadScript() {
    //this was added for fixing bug 55772 : if the script is maximized we have to minimize the script before loading the messages
     //$W().minimizeCurrentWindow();
     //$W().loadintoIframe("MessageBoardFrame", "SYSTEM/portlets/messaging/messageBoard.jsp");
     $W().ShowTabById('messagesTab');
     $W().unloadScript();     
     $W().ctiAPI.notifyScriptUnloaded();
} 

function getDispositionScriptUrl(){
	return "USER/flows/callDisposition/callDisposition.jsf";
}