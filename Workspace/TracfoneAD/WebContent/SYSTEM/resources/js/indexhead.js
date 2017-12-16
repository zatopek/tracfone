

function loadSmartPadActiveX()
{   
    var spDiv = $('SMARTPAD_DIV_ID');                                
    if (spDiv)
    {
        if ((spDiv.innerHTML == null) || (spDiv.innerHTML == ""))
        {                
            spDiv.innerHTML = '<OBJECT id="smartPadActiveX" CLASSID="CLSID:F1899DB4-601B-4E74-8C96-F568826B960B" CODEBASE="ApplicationHolder.CAB#version=1,0,0,0" width="1px" height="1px"></OBJECT>';                         
        }            
    }                          
}
                        
// redirect the activeX calls to the matching function in the smart pad portlet
function jsPasteString(hwin1d, txt, cell)
{  
    //document.frames.SmartPadPortletFrame.jsPasteString(hwin1d, txt, cell);
    smartPadFrame.jsPasteString(hwin1d, txt, cell);
}
//fix for BUG-54087- IE X dlg
//see also BUG-57983
// removed onbeforeunload="closeIt()"  from body tag at index.jsp
// this function is not called now
function closeIt()
{
     event.returnValue = null;
} 

function onSwitchToTab(tabid) {
   $W().ShowTabById(tabid);
}
 
function closeAllSubWindows () {
	//this if is required in case of duplicate login
	if ($W().openWindows == null || !$W().openWindows){
		return;
	}
    for (var i=0;i<$W().openWindows.length;i++) {
        if ($W().openWindows[i] && !$W().openWindows[i].closed)
        	$W().openWindows[i].close();
    }
}

function removeWindow(window) {
    var index =$W().openWindows.indexOf(window);
    if (index >=0){
    	$W().openWindows.splice(index,1);
    }
} 

function Unload() {
    if (!logged) {
        return;
    }
    onAgentLogout();
    Push.stop();
    var http = new XMLHttpRequest();
    var contextPath = location.href.substring(0, location.href.lastIndexOf('/'));
    http.open("GET", contextPath + "/Controller.jpf?logout=true&reason=9999&shouldRegisterSession=false&username=" + $W().username, false);
    http.send();
}

function logout(cancel, reason, isNewDepartment)
{
    //hideDialog('LogoutDialog');
    if (cancel == true)
        return;
        
    logged = false;
    $W().workspaceOut = true;
    onAgentLogout();
    Push.stop();

    var isNewDepartmentStr = (isNewDepartment == true) ? "newdepartment" :""; 
    var parametersString = '&reason=' + reason  + '&department=' + isNewDepartmentStr + '&username=' + $W().username;
    closeAllSubWindows();
    var contextPath = location.href.substring(0, location.href.lastIndexOf('/'));
    location.href= contextPath + "/Controller.jpf?logout=true&shouldRegisterSession=false" + parametersString;
}

function resetToDefaults() 
{
	//checking allowLayoutAction is relevant only when running with our cti-bar
    if ($W().cti && !$W().cti.allowLayoutActions() ) {
      ShowAlertMessageWhenHostedAppAreRunning($W().localeManager.getLocalizationValue('application.javascript.message.alert.resetInCallStatus')); 
      return;
    }
 	if (confirm($W().localeManager.getLocalizationValue('application.javascript.message.confirm.resetToDefaults'))) {
	    //reset the layout
	    var contextPath = location.href.substring(0, location.href.lastIndexOf('/'));
	    contextPath += "/Controller.jpf?reset=true&username=" + $W().username;
	    var request = new Ajax.Request(contextPath, {method: 'get', asynchronous : false});
	    if (request.success()) {
	        onLayoutChanged();
	    }
	    onFavoritesUpdatedHandler();
	    //load the new theme
	    contextPath = location.href.substring(0, location.href.lastIndexOf('/'));
	    contextPath += "/SYSTEM/portlets/themes/loadDefaultTheme.jsp"
	    var request2 = new Ajax.Request(contextPath, {method: 'get', asynchronous : false});
	    if (request2.success()) {
	        $W().setFrameActiveStyleSheet(document, request2.transport.responseText);
	    }
 	}
    
}


function setChannelEnable(channel, state)
{
    var icon = null;
    if(channel == 'multimedia'){
         icon = Ext.getCmp("multimediaMenuIcon");  
    }else if(channel == 'voice'){
         icon = Ext.getCmp("voiceMenuIcon");  
    }else if(channel == 'email'){
         icon = Ext.getCmp("emailMenuIcon");  
    }
    
    setIconEnabled(icon, state);
}

function setIconEnabled(element, state) 
{  
   if(element != null)
   {
        if (state == 1) {
        	element.show();
        	element.enable();
        } else if (state == 0){
        	element.show();
            element.disable();
        } else if (state == -1){
            element.hide();
        }
    }
    else{
        alert("channel icons are null!");
    }
}

/*General logic - CTILogin/Logout links should be displayed only when:
* 1.Feature is enabled.
* 2.In the same states when the workspace Logout link is displayed (i.e. - not during a call).
*/ 
function handleCTILoginLogoutLink(displayLinks, isSemiManual, stateAllowLogout){
	Jacada.Logger.debug("handleCTILoginLogoutLink displayLinks:" + displayLinks + ", isSemiManual:" + isSemiManual + ", stateAllowLogout:" + stateAllowLogout);
	if(displayLinks){ //Feature is enabled.
		if(isSemiManual){	
			//DISPLAY ONLY LOGIN - in semi manual so should allow login, but only in the same states the 
			//Workspace Logout link is avaialbale (not during a call)
			if (stateAllowLogout) {
				changeLoginLink(true, false);
			}
			else { // no link should be displayed
				changeLoginLink(false, false);
			}
		}
		//else is when in CTI mode or when in Manual which is not semi (regular manual). 
		else if (stateAllowLogout){
			//DISPLAY ONLY LOGOUT - in CTI mode that allows logout
			changeLoginLink(false, true);
		}
		else {
			//do not show any CTI link
			changeLoginLink(false, false);
		}
	} else {
		//Feature is disabled - do not show any CTI link
		changeLoginLink(false, false);
	}
}

function changeLoginLink(toLogin, toLogout){
	var btn = Ext.getCmp("ctiLoginBtn");
	if(toLogin){
		btn.setText($W().localeManager.getLocalizationValue("application.javascript.menuBar.label.CTIlogin"));
		btn.setHandler(doCTILogin);
		$W().cti.setButtonVisibility(btn, true);
	}
	else if(toLogout){
		btn.setText($W().localeManager.getLocalizationValue("application.javascript.menuBar.label.CTIlogout"));
		btn.setHandler(doCTILogout);
		$W().cti.setButtonVisibility(btn, true);
	}else {
		$W().cti.setButtonVisibility(btn, false);
	}
}

function doCTILogin(){
	$W().ctiAPI.doLoginAPI();
}

function doCTILogout(){
	$W().ctiAPI.doLogoutAPI();
}
function showLogout(show)
{
    var lnk = document.getElementById("jadLogoutBtn");   
    if(lnk != null){
    	lnk.style.visibility  = show ? '' : 'hidden';
    }
}

function showLogoutDialog()
{
    HideCurrentVisibleTab();
    $W().getTab().hide();
    if($W().cti.hasLiveChatSessions()){
    	Ext.Msg.show({
    			msg: $W().localeManager.getLocalizationValue("application.javascript.chat.logout"),
    			buttons: Ext.Msg.OK,
    			icon: Ext.Msg.INFO,
    			fn: function(){$W().getTab().show();$W().ShowCurrentVisibleTab();}
    		});
    	return;
    }
    Ext.create('Jacada.system.ui.core.LogoutDialog').show();
}
 
window.onbeforeunload = function (evt) {
	closeAllSubWindows ();
	if($W().workspaceOut){
		return;
	}
 if (!evt){
	 evt = window.event;;
 }
 if ((evt.clientY < 0)) { 
   var message = ''; 
   beforeunload = true;
   evt.returnValue = message; 
   return message; 
 } 
}  

refresh = function () {
    Push.stop();
    var contextPath = location.href.substring(0, location.href.lastIndexOf('/'));
    location.href = contextPath + "/Controller.jpf?username=" + + $W().username;
}

refreshMenu = function() {
	var menuWorkspace = Ext.getCmp('workspace-menu');
	//reload all menu items from server side
	menuWorkspace.loadItems();
	//get only the left items since there is where favorites is located
	var leftItems = menuWorkspace.getLeftMenuItems();
	//go over all the left items, update their sub menu and repaint
	for (var i=0,len=leftItems.length; i<len; i++){
		var currentMenu = menuWorkspace.items.items[i];
		var updatedMenu = leftItems[i];
		currentMenu.menu = updatedMenu.menu;
		currentMenu.getEl().repaint();
	}
}

function createHideArea(portletName, vertical) {
    var hideArea = new HideArea (portletName + 'Header', portletName + 'Title', portletName + 'Area',  vertical);
    var portletsArea = portletName + 'PortletsArea';
    var areaElement = $(portletsArea);
    if (areaElement != null) {
        areaElement.hideArea = hideArea;
    }
}
function loadingTicker()
{
    var txtLoading = document.getElementById('textLoading');
    var value = localeManager.getLocalizationValue("application.javascript.message.label.loading");
    if ( txtLoading.innerHTML == value ) {txtLoading.innerHTML = (value + '.');return;}
    if ( txtLoading.innerHTML == (value + '.') ) {txtLoading.innerHTML = (value + '..');return;}
    if ( txtLoading.innerHTML == (value + '..') ) {txtLoading.innerHTML = (value + '...');return;}
    if ( txtLoading.innerHTML == (value + '...') ) {txtLoading.innerHTML = value;return;}

} 
function onSessionExpHandler() {
	$W().workspaceOut = true;
	Push.stop();
	onAgentLogout();
    var contextPath = location.href.substring(0, location.href.lastIndexOf('/'));
    location.href = contextPath + "/terminated.jsp";
}

function onFavoritesUpdatedHandler() {
	refreshMenu();     
}

function onToolsUpdatedHandler() {    
    loadintoIframe('ToolsPortletFrame', 'SYSTEM/portlets/tools/Controller.jpf');
}

function registerOrcastration() {
	//FIREFOX ISSUE
    var desktopID = null;
    var processURL = null;
    
    try {
        var IEBridge = new ActiveXObject("AgentManager.AgentManagerService.1");         
        
        desktopID = IEBridge.getDesktopID();
        processURL = IEBridge.getOrchestrationURL();
    } catch (ex) {}
    
    var url = 'Controller.jpf';
    var pars = 'action=registerOrchastration';
    if (desktopID != null && processURL != null) {
       pars += '&desktopId=' + encodeURIComponent(desktopID) +
               '&processURL=' + encodeURIComponent(processURL);
    } 
    pars += '&last=';
    
    new Ajax.Request(url, { method: 'get', parameters: pars } );
}

function loadTheme() {
	var request = new Ajax.Request($W().contextPath + '/rest/themes/defaultTheme', { requestHeaders: {Accept: 'application/json'}, method: 'get', asynchronous : false });
    if (request.success()) {
    	$W().theme = Ext.decode(request.transport.responseText);
    }else{
    	alert('Failed to load default theme');
    }
}


function setActiveStyleSheet(themeString) {
    var styleDir = $W().themesMap[themeString];
    var path = document.location.pathname;
    var themePath = path.slice(0, path.lastIndexOf("/")) + "/" + styleDir + "/style.css";
    var ext_style = $W().themesMap[themeString+"_ext"];
    var themePath_ext= path.slice(0, path.lastIndexOf("/")) + "/" + ext_style;
    setFrameActiveStyleSheet(document, themePath, themePath_ext);
}

function setFrameActiveStyleSheet(document, ref, ref_ext) {

    var frameStyleElm = document.getElementById("themeStyleSheet");
    if (frameStyleElm != undefined && frameStyleElm != null) {
        frameStyleElm.href = ref;
    }
    
    var frameStyleElm_ext = document.getElementById("ext_theme");
    if (frameStyleElm_ext != undefined && frameStyleElm_ext != null) {
        frameStyleElm_ext.href = ref_ext;
    }
    
    var iframes = document.getElementsByTagName("IFRAME");
    for (var i=0; i<iframes.length; i++) {
    	try {
	        var doc = iframes[i].contentDocument;
	        if (doc == undefined || doc == null) {
	            doc = iframes[i].contentWindow.document;
	        }
	        setFrameActiveStyleSheet(doc, ref, ref_ext);
	    }catch (e) {
	    	$W().LogManager.getLogger("jad.js").error('failed to set stylesheet to frame - ' + e );
	}
    }
}


/*
This method calculates the client gmt-offset time and stores it in $W().agentGMToffset for usage on client side and usage of portlets that need this value before it arrives to server.
Note: at the begining this function also sent the offset to server (main controller to be stored in the agentInformation) but in real-time
we noticed that this ajax call arrives too late to the server-side and in the meantime portlets which required this gmtOffset loaded.
*/
function setClientGMTOffset() {

	//this is an extjs date
    var date = new Date();
    var offset = Ext.Date.getGMTOffset(date);
    
    //storing the offset on W for the usage of components that need this value upon login - relevant for 
    //message board when it is part of the layout
	$W().agentGMToffset = offset;
	
      
}

/**
 * This method will reload portlet data by updateing the iframe src.<br>
 * @param (String) portletId This is the portlet id as defined in portlets.xml .<br>
 */
function onPortletReload(portletId){
var frame = findIFrame(portletId+"Frame");
  if (frame != null) {
     frame.src = frame.src;
  }
}


/**
 * This method will add the text to the agent notes if available.<br>
 * @param (String) notes This is the text to add.<br>
 */
function addAgentNotes(notes){
	if ($W().agentNotesTextArea){
		var existingText = $W().agentNotesTextArea.getValue();
		var len = existingText.length;
		var newValue = "";
		if ((existingText.lastIndexOf(" ") == len-1) ||
		    (existingText.lastIndexOf("\n") == len-1) ||
		    (existingText.lastIndexOf("\t") == len-1))        
		{
		    newValue = existingText + notes;
		}
		else{ // don't end with a space, add space
		    newValue = existingText + " " + notes;
		}
		$W().agentNotesTextArea.setValue(newValue);
	}
}