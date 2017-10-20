/*  To add a new function or to override an existing function in the current project. 
To override an existing function, define a function with the same name in this 
file - this function will be invoked instead of the original one. */

 /*
  * This method allows the user to add code that should be invoked on application startup.
  */
function onApplicationInitialized(){
	// This code adds the NestingExtJsHelper code to the main document
	// Needed for nesting inside ExtJs tabs
	var headID = document.getElementsByTagName("head")[0];
   	var newScript = document.createElement('script');
   	newScript.type = 'text/javascript';
   	newScript.src = 'USER/portlets/multiTab/NestingExtJsHelper.js';
   	headID.appendChild(newScript);
   	//Push.registerEventHandler('START_MANUAL_CALL', reloadCustomerInfo); 
	//Push.registerEventHandler('START_BUSINESS_CALL', reloadCustomerInfo);
	Push.registerEventHandler('InteractShowTab', InteractShowTab);
	//Push.registerEventHandler('customerInfoUpdate', reloadCustomerInfo);
	
	if(!$W().LayoutByContext){
		Push.registerEventHandler('customerInfoUpdate', reloadCustomerInfo);
	}
}

function InteractShowTab(tabId) {
   $W().ShowTabById(tabId);
}

function reloadCustomerInfo(data){
	data = Ext.decode(data);
	if(document.getElementById('CustomerInfoFrameId')){
		if(data.contactId){
			reloadCustomerInfoDashboard($W().getTab('CustomerInformationTab'), data.contactId);
			$W().ShowTabById('CustomerInformationTab');
		}
	}
}

function reloadCustomerInfoDashboard(tab, contactId){
	if(tab.frameId == "CustomerInfoFrame"){
		tab.loaded = true;
		var url = tab.actualUrl;
		if(url.indexOf('?') > -1){
			url += "&contactId="+contactId;
		}else{
			url += "?contactId="+contactId;
		}
		document.getElementById(tab.id+"Id").src = url;
	}
}

function onContextDataChanged(tab, data){
	reloadCustomerInfoDashboard(tab, data.contactId);
}


function afterShowTabById(tabId) {
}

function getClientCurrectIPAddress(ipAddresses){
	// This code retrieves the relevant IP address of the agent desktop.
 	// This method receives a list that contains the agent's machine 
 	// IP addresses.

//	for (i=0; i<ipAddresses.length; i++) {
//      if (ipAddresses[i] != "127.0.0.1") {
//           return ipAddresses[i];
//      }
//   }
} 

/*
 * Returns the tab to activate initially. Either an ID, index or the tab component itself.
 */
function getDefaultActiveTab(){
	return 'messagesTab';
}
/*
 * Configure the paging of Task's grid
 */
function getTasksGridPageSize() {
    return 10;
}

/*
 * Allows project to run it's code when agent logs out
 */
function onAgentLogout(){
	//No log request should be made in this function.
	//The request might come after session was already invalidated. 
}