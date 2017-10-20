/**
 * **********************************************************************************************************************
 * *********************This file contains the API required by JIA for the integration with Workspace ************
 * **********************************************************************************************************************
*/

/********** Section A: Tabs API **********/
var DELIMETER = "|";
$W().FRAME_SUFFIX = 'Id';
/**
 * @return the number of tabs in workspace.
*/
function getNumOfTabs(){
	return getTabs().length;		
}

/**
 * @return the id of the current selected tab.
*/
function getSelectedTabId(){
	return $W().getTab().itemId;
}

/**
 * This method will set the given tab as the selected one.
 * @param the tabId to be selected.
*/
function setSelectedTabId(tabId){
	$W().ShowTabById(tabId);
}

/**
 * @return a string containing a delimited list of the tab ids in workspace.
*/
function getTabIds(){
	var ids = "";
	var tabs = getTabs();
	for(i = 0; i < tabs.length; i++){
		 if (i>0){
			 ids += DELIMETER;
		 }
		 ids += tabs[i].itemId;
	}
	return ids;
}

/**
 * @return a string identifier of Workspace iframes suffix (which is “frame”)
*/
function getWorkspaceFrameSuffixIdentifier(){
	return $W().FRAME_SUFFIX;
}

/**
 * @param the tabId to check
 * @return true when the given tabId is the selected one and false otherwise.
*/
function isSelectedTab(tabId){
	return getSelectedTabId() == tabId;
}


/**
 * @param the tabId to check
 * @return true when the given tabId is maximized and false otherwise.
*/
function isTabMaximized (tabId){	
	var tab = $W().getTab(tabId);
	if(!tab || !$W().workspaceUI.maximizedTab){
		return false;
	}
	return tab.itemId == tabId;
	
}

/**
 * This method maximized the current selected tab.
*/
function maximizeSelectedTab (){
	$W().getTab().maximizeTab();
}

/**
This method restores the selectedtab (from its maximized mode).
*/
function restoreSelectedTab () {
	$W().getTab().restore();
}

/**
This method shows/hides tab according to the given tabId and visibility flag.
*/
function setTabVisibility (tabId,visible) {
	if (visible) {
		$W().ShowTabById(tabId);
	} else {
		$W().HideTabById(tabId);
	}
	
}

/**
This method should return the ActiveX html identifier, which is “OBJECT”
*/
function getActivexHTMLIdentifier () {
	return "OBJECT";
}

/**
This method should return the hosting id of the given tab.
*/
function getHostingIdOfTab (tabId) {
	var tab = $W().getTab(tabId);
	if(tab){
		return 'nested-object-'+tabId;
	}
	return null;
}

/**
This method should return the executable name of the hosting.
*/
function getExecutableNameOfHosting(hostingId) {
	return getHostingParam(hostingId, 'ExeName');
}

/**
This method should return the working directory of the hosting.
*/
function getWorkingDirOfHosting (hostingId){
	return getHostingParam(hostingId, 'WorkingDirectory');
}

/**
This method should return the handle id of the hosting.
*/
function getHandleOfHosting (hostingId){
	var nestedObject = document.getElementById(hostingId);
	return nestedObject.Handle;
}

function moveHorizontalScrollbar(tabId, operation, movePos){
	var nestedObject = document.getElementById(tabId);
	return nestedObject.MoveHorizontalScrollbar(operation, movePos);
}

function moveVerticalScrollbar(tabId, operation, movePos){
	var nestedObject = document.getElementById(tabId);
	return nestedObject.MoveVerticalScrollbar(operation, movePos);
}

function moveHorizontalScrollbarLeft(tabId){
	var nestedObject = document.getElementById(tabId);
	return nestedObject.MoveHorizontalScrollbarLeft();
}

function moveHorizontalScrollbarRight(tabId){
	var nestedObject = document.getElementById(tabId);
	return nestedObject.MoveHorizontalScrollbarRight();
}

function moveVerticalScrollbarBottom(tabId){
	var nestedObject = document.getElementById(tabId);
	return nestedObject.MoveVerticalScrollbarBottom();
}

function moveVerticalScrollbarTop(tabId){
	var nestedObject = document.getElementById(tabId);
	return nestedObject.MoveVerticalScrollbarTop();
}


/**
This method should return the iframe src.
*/
function getPageUrl (tabId){
	var tab = $W().getTab();
	if(tab){
		return tab.actualUrl;
	}
	return null;
}  

/**
This method should set the new src into the iframe.
*/
function navigate (tabId, url){
	var tab = $W().getTab();
	if(tab){
		$W().loadintoIframe(tab.frameId, url);
	}
}

/**
This method should return the arguments of the hosting.
*/
function getArgumentsOfHosting (hostingId){
	return getHostingParam(hostingId, 'Arguments');
}

/**
This method should return the session id of this agent (only the end of it which is also unique).
*/
function getSessionId () {
	return $W().wsSessionId;
}

/**
This method should perform logout for the user (skip the confirmation window.
*/
function logoutUser () {
    logout(false, "9999", false);	
}

/**
This method notifies workspace an automation is running. If needed workspace will update the UI to reflect this mode.
*/
function startAutomationMode (){
	
}

/**
This method notifies workspace an automation has stopped running. If needed workspace will update the UI to reflect this mode.
*/
function stopAutomationMode () {
	
}

/**
This method should be used by winfuse to indicate that all the other API is accessible.
*/
function isApiSupported () {
	return "true";
}

/**
This method should be used by winfuse to for sending json objects to the given url.
@param (String) url – this is the url where the json object should be sent to.
@param (JSONObject) jsonObj – this is the json object to be sent.
@param (method) onSuccess – this is a method to be called upon successful ajax call.
@param (method) onFailure – this is a method to be called upon unsuccessful ajax call.

*/
function sendAjaxToWinfuse(url, jsonObj, successHandler, errorHandler) {	
	var request = new Ajax.Request(url,
            {method: 'post', parameters: jsonObj, onSuccess : successHandler, onFailure: errorHandler} );
}

/*
 * Private method for retrieving the tabs
 */
function getTabs(){
	var tabs = new Array();
	$W().tabItems.each(function(tabConfig){
    	if(!tabConfig.hidden){
    		tabs.push(tabConfig);
    	}
	});
	return tabs;
}
/*
 * Private method for retrieving the tab frame
 */
function getTabFrame(tabId){
	return $D().getElementById(tabId + $W().FRAME_SUFFIX);
}

/*
 * Private method for retrieving parameters of hosting
 */
function getHostingParam(hostingId, param) {
	var exeName;
	var hostingObject = $D().getElementById(hostingId);
	if (hostingObject == null) {
		return;
	}	
	if (hostingObject.hasChildNodes()) {
		var params = hostingObject.getElementsByTagName('param');
		for (var i = 0; i < params.length; i++) {
			if (params[i].getAttribute('name') == param) {
				exeName = params[i].getAttribute('value');
				break;
			}	
		}
	}
	return exeName;
}

/**
 * This function will terminate all process that are being run by the given ActiveX.
 * @param {String) tabId - the tab id.
 * @return true upon success and false otherwise.
 */
function terminateApplication(tabId) {
    var hostingX = $W().document.getElementById('nested-object-' + tabId);
    if (hostingX != null) {
        try {
            return hostingX.TerminateProcess();
        }
        catch (e) {
            return false;
        }
    }          
    return false;
}

/**
 * This function will run an application using the given ActiveX and given application params.
 * @param {String) id - the tab id.
 * @param {String) name - the process name.
 * @param {String) path - the process path.
 * @param {String) args - the process args.
 * @return process id upon success and false otherwise.
 */
function runApplication(tabId,name,path,args){
    var hostingX = $W().document.getElementById('nested-object-' + tabId);
    if (hostingX != null) {
       try {
            return hostingX.RunApplication(name,path,args);
       }
       catch (e) {
            return false;
       }          
    }   
    return false;
}

function isProcessRunning(tabId) {
    var hostingX = $W().document.getElementById('nested-object-' + tabId); 
    if (hostingX != null) {
        try {
         return hostingX.IsProcessRunning();
        }
        catch (e) {
            return false;
        }
    }          
    return false;
}