Ext.ns("Jacada.task");
var URL = '../../../taskManager.json'
var action;
var addCallbackForm;
var callbackData = null;
Ext.onReady(function(){
	waitForDom();
});

function createForm(){
	loadUtils();
	loadAddTask();
	action = new Jacada.task.addTaskAction(URL, $W().agentName, createDataStore());
	addCallbackForm = action.createForm(260);
	addCallbackForm.addButton({text: action.utils.getLocalizationValue('application.javascript.taskManager.addTaskDialog.add')}, handleAddCallback, this);
	addCallbackForm.addButton({text: action.utils.getLocalizationValue('application.javascript.taskManager.addTaskDialog.cancel')}, closeCallbackWindow, this);
	addCallbackForm.setHeight(260);
	addCallbackForm.render('callback');
}

function handleAddCallback(){
	action.addTask(addCallbackForm, $W().toolbarWindows['CallbackWindow'], getCallbackData());
}
function closeCallbackWindow(){
	$W().toolbarWindows['CallbackWindow'].hide();
}

function onPortletBeforeShow(){
	return true;
}


function createDataStore(){
	var reminderDataStore = new Ext.data.JsonStore({
    	id: 'reminderDataStore',
    	root: 'taskData',
    	totalProperty: 'total',
  		fields:[ 
	        {name: 'description', type: 'string'},
			{name: 'id', type: 'int'}
  		],
  		url: URL
	});	
	return reminderDataStore;
}

function waitForDom() {
	var Y = YUI();
	function waitForUtilsJS() {
		   var objTransaction = Y.Get.script(UTILS_JS_URL,
				   
		                                            { onSuccess: function() {   
														// on success continue loading
			   											waitForAddTaskActionJS();
													 }
													 ,onFailure: function() { 
													 	$W().LogManager.getLogger("AGENT_TASK").debug("problem loading :"+ UTILS_JS_URL);  
													 }}); 
		
	 };
	function waitForAddTaskActionJS() {
		   var objTransaction = Y.Get.script(ADDTASK_JS_URL,
				   
		                                            { onSuccess: function() { 
			   											createForm();
													 }
													 ,onFailure: function() { 
														 $W().LogManager.getLogger("AGENT_TASK").debug("problem loading :"+ ADDTASK_JS_URL);  
													 }}); 
		
	 }
	waitForUtilsJS();
}

function getCallbackDescription(){
	if (callbackData != null){
		return callbackData.description;
	}
	var description = getLocalizationValue('application.javascript.agentDisposition.callback.default.description');
	description = String.format(description, $W().cti.ctiClientInfo.DNIS);
	return description;
}

function getCallbackData(){
	if (callbackData != null){
		return callbackData.data;
	}
	return new Object();
}
