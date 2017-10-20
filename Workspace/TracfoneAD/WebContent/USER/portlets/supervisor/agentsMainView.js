

/**
 *  The extra mechanism of waiting for all the JS files to be loaded to the browser
 *  is worte only for IE 6 which has no gerantee the onReady (onLoad) will be called 
 *  after all the dom is ready.
 *  
 *   Ext uses a defer script tag for IE which is not guaranteed to actually defer until 
 *   the end of the page. Most of the time it does.  Ext's implementation does not really 
 *   lend well to setting up your own notify system replacement for Ext.onReady since what
 *   it fires is private.
 * 
 * 
 */



function waitForDom() {
	
	var Y = YUI();   
	waitForUtilsJS =  function () {
		   var objTransaction = Y.Get.script(UTILS_JS_URL,
				   
		                                            { onSuccess: function() {   
														// on success continue loading
			   											waitForReassinActionJS();
													 }
													 ,onFailure: function() { 
													 	$W().LogManager.getLogger("SUPERVISOR").error("problem loading :"+ UTILS_JS_URL);  
													 }}); 
		
	 };
	  
	  function waitForReassinActionJS() {
		   var objTransaction = Y.Get.script(REASSIGN_JS_URL,
				   
		                                            { onSuccess: function() {   
														// on success continue loading
			   											waitForAddTaskActionJS();
													 }
													 ,onFailure: function() { 
													 	$W().LogManager.getLogger("SUPERVISOR").error("problem loading :"+ REASSIGN_JS_URL);  
													 }}); 
		
	 }
	  
	  function waitForAddTaskActionJS() {
		   var objTransaction = Y.Get.script(ADDTASK_JS_URL,
				   
		                                            { onSuccess: function() {   
														// on success continue loading
			   											waitForAddTaskToGroupActionJS();
													 }
													 ,onFailure: function() { 
													 	$W().LogManager.getLogger("SUPERVISOR").error("problem loading :"+ ADDTASK_JS_URL);  
													 }}); 
		
	 }
	  
	  function waitForAddTaskToGroupActionJS() {
		   var objTransaction = Y.Get.script(ADDTASKTOGROUP_JS_URL,
				   
		                                            { onSuccess: function() {   
														// on success continue loading
			   											waitForAgentTaskJS();
													 }
													 ,onFailure: function() { 
													 	$W().LogManager.getLogger("SUPERVISOR").error("problem loading :"+ ADDTASKTOGROUP_JS_URL);  
													 }}); 
		
	 }
	
	  function waitForAgentTaskJS() {
		   var objTransaction = Y.Get.script(AGENT_TASK_JS_URL,
				   
		                                            { onSuccess: function() {   
														// on success continue loading
			   											waitForAgentsViewJS();
													 }
													 ,onFailure: function() { 
													 	$W().LogManager.getLogger("SUPERVISOR").error("problem loading :"+ AGENT_TASK_JS_URL);  
													 }}); 
		
	 }
	  
	  function waitForAgentsViewJS() {
		   var objTransaction = Y.Get.script(AGENTS_VIEW_JS_URL,
				   
		                                            { onSuccess: function() {   
														// on success continue loading
			   											waitForStartChatJS();
													 }
													 ,onFailure: function() { 
													 	$W().LogManager.getLogger("SUPERVISOR").error("problem loading :"+ AGENTS_VIEW_JS_URL);  
													 }}); 
		
	 }
	  
	  function waitForStartChatJS() {
		   var objTransaction = Y.Get.script(START_CHAT_JS_URL,
				   
		                                            { onSuccess: function() {   
														// on success continue loading
			   										waitForUserAgentViewJS();
													 }
													 ,onFailure: function() { 
													 	$W().LogManager.getLogger("SUPERVISOR").error("problem loading :"+ START_CHAT_JS_URL);  
													 }}); 
		
	 }
	  function waitForUserAgentViewJS() {
		   var objTransaction = Y.Get.script(USER_AGENT_VIEW_JS_URL,
				   
		                                            { onSuccess: function() {   
														// on success continue loading
			   											waitForSummaryViewViewJS();
													 }
													 ,onFailure: function() { 
													 	$W().LogManager.getLogger("SUPERVISOR").error("problem loading :"+ USER_AGENT_VIEW_JS_URL);  
													 }}); 
		
	 }
	  function waitForSummaryViewViewJS() {
		   var objTransaction = Y.Get.script(SUMMARY_VIEW_JS_URL,
				   
		                                            { onSuccess: function() {   
														// on success continue loading
			 
			   											onReady();
													 }
													 ,onFailure: function() { 
													 	$W().LogManager.getLogger("SUPERVISOR").error("problem loading :"+ SUMMARY_VIEW_JS_URL);  
													 }}); 
		
	 }
	  waitForUtilsJS();

}


var view;		  

function resize() {
	view.resizeContent(this.frameElement);
}

function resizeContent() {

}
function onReady() {
	
	loadUtils();
	loadReassign();
	loadAddTask();
	loadAddTaskToGroup();
	loadAgentTask();
	loadstartChat();
	loadAgentsView();
	loadUserAgentView();
	loadSummaryView();
	
	view = new Jacada.supervisor.user.AgentView();
	view.init();
	resize();

}

/**
 * This method will be called when the portlet is loaded.
 * Should be used to define extJs UI components.
 */
Ext.onReady(function(){
	waitForDom();
});


function getAllUsersFromCurrentGroup() {
	return view.getAllUsersFromCurrentGroup();	
}
