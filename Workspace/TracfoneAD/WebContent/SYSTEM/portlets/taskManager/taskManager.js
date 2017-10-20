var URL = '../../../taskManager.json';
var tasksView ;




/**
 *  The extra mechanism of waiting for all the JS files to be loaded to the browser,
 *  was written only for IE6 which has no guarantee that the onReady (onLoad) will be called 
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
													 	$W().LogManager.getLogger("AGENT_TASK").debug("problem loading :"+ UTILS_JS_URL);  
													 }}); 
		
	 };
	  
	  function waitForReassinActionJS() {
		   var objTransaction = Y.Get.script(REASSIGN_JS_URL,
				   
		                                            { onSuccess: function() {   
														// on success continue loading
			   											waitForAddTaskActionJS();
													 }
													 ,onFailure: function() { 
													 	$W().LogManager.getLogger("AGENT_TASK").debug("problem loading :"+ REASSIGN_JS_URL);  
													 }}); 
		
	 }
	  
	  function waitForAddTaskActionJS() {
		   var objTransaction = Y.Get.script(ADDTASK_JS_URL,
				   
		                                            { onSuccess: function() {   
														// on success continue loading
			   											waitForAddTaskToGroupActionJS();
													 }
													 ,onFailure: function() { 
													 	$W().LogManager.getLogger("AGENT_TASK").debug("problem loading :"+ ADDTASK_JS_URL);  
													 }}); 
		
	 }
	  
	  function waitForAddTaskToGroupActionJS() {
		   var objTransaction = Y.Get.script(ADDTASKTOGROUP_JS_URL,
				   
		                                            { onSuccess: function() {   
														// on success continue loading
			   											waitForAgentTaskJS();
													 }
													 ,onFailure: function() { 
													 	$W().LogManager.getLogger("AGENT_TASK").debug("problem loading :"+ ADDTASKTOGROUP_JS_URL);  
													 }}); 
		
	 }
	
	  function waitForAgentTaskJS() {
		   var objTransaction = Y.Get.script(AGENT_TASK_JS_URL,
				   
		                                            { onSuccess: function() {   
														// on success continue loading
			   												
			   											onReady();
			   											
													 }
													 ,onFailure: function() { 
													 	$W().LogManager.getLogger("AGENT_TASK").debug("problem loading :"+ DYNAMIC_GRID_URL);  
													 }}); 
		
	 }

	
	
	
	  waitForUtilsJS();

}

function onReady() {
	
	loadUtils();
	loadReassign();
	loadAddTask();
	loadAddTaskToGroup();
	loadAgentTask();
	
	// defining  the tool bar of the grid
	taskToolBar = [
					{
						   btnId: "btnRefresh", 
						   btnLocaleText: 'application.javascript.taskManager.button.refresh', 
						   btnDescription: "Refresh tasks",
						   visible:true,
						   order:3	 
				   },
                   {
                	   btnId: "btnAdd", 
                	   btnLocaleText: 'application.javascript.taskManager.button.add', 
                	   btnDescription: "Add Task To an Agent",
                	   visible:true,
                	   order:0
                   },
                   {
                	   btnId: "btnDeleteTasks", 
                	   btnLocaleText: 'application.javascript.taskManager.button.delete', 
                	   btnDescription: "Delete Task from an Agent",
                	   visible:true,
                	   order:1
                   },
                   {
                	   btnId: "btnDeleteAllTasks", 
                	   btnLocaleText: 'application.javascript.taskManager.button.deleteAll', 
                	   btnDescription: "Delete All Tasks from an Agent",
                	   visible:true,
                	   order:2
                   },
                   
                   {
                	   btnId: "Reassign", 
                	   btnLocaleText: 'application.javascript.taskManager.button.reassign', 
                	   btnDescription: "Reassign task",
                	   visible:false,
                	   order:4
                   },
                   {
                	   btnId: "btnGroup", 
                	   btnLocaleText: 'application.javascript.taskManager.button.addToGroup', 
                	   btnDescription: "add task to group",
                	   visible:false,
                	   order:5
                   }
                   
                   
                   
	
];
	
    tasksView =  new Jacada.task.TaskView(URL, taskToolBar, 'tasks', false, true, true);
	tasksView.init();
	
	tasksView.getPanel().render('tasks');
	
}

Ext.onReady(function(){
	//due to extjs bug (window updater) sometimes js resources are not loaded according to given order
	//using yui to load the customer search only AFTER the dynamicGrid.js resource was loaded
	waitForDom();
});



function onPortletShow(reloadContentOnNextOpen) {
	if (reloadContentOnNextOpen){
		tasksView.registerForMessages();
	}
}

function onPortletDisplay() {
	tasksView.resizeContent();
}

//function onPortletBeforeShow(){
//	tasksView.resizeContent();
//	return true;
//}
function onPortletShow(){
	tasksView.resizeContent();
}

function onPortletRemoval() {
	tasksView.unregisterForMssages();	
}

function resizeContent() {
	tasksView.resizeContent();
}
