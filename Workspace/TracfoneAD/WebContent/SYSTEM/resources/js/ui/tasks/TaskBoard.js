Ext.define('Jacada.system.ui.tasks.TaskBoard', {
    extend: 'Ext.panel.Panel',

    id: 'taskBoard',
    border: false,
    autoScroll: true,
    layout: {
        type:'vbox',
        align:'stretch'
    },
    
    updateActionState: function(record){
    	var toolbar = this.getComponent('toolbar');
    	var saveAction = toolbar.getComponent('save');
    	if(!record || this.getComponent('tasksGrid').getSelectionModel().getSelection().length == 0){
    		toolbar.getComponent('complete').setDisabled(true);
    		toolbar.getComponent('release').setVisible(false);
    		toolbar.getComponent('assign').setDisabled(true);
    		toolbar.getComponent('claim').setVisible(true);
    		toolbar.getComponent('claim').setDisabled(true);
    		if(saveAction){
    			saveAction.setDisabled(true);
    		}
    		this.getComponent('taskInfoPanel').setVisible(false);
    	}else{
    		var isSupervisor = $W().rapManager.isUserSupervisor();
    		var hasOwner = record.owner && record.owner.length > 0;
    		//can complete only my tasks
    		toolbar.getComponent('complete').setDisabled(!this.allowComplete(record));
    		//can release only claimed task (assigned to me or to my group)
    		var isReleaseVisible = record.owner && record.owner.length > 0;
    		toolbar.getComponent('release').setVisible(isReleaseVisible);
    		toolbar.getComponent('release').setDisabled(!isReleaseVisible || (record.owner != $W().agentName && !isSupervisor));
    		//can claim only unclaimed tasks
    		toolbar.getComponent('claim').setVisible(!record.owner || record.owner.length == 0 || (record.owner == $W().agentName && record.status == 'RESERVED'));
    		toolbar.getComponent('claim').setDisabled(false);
    		//only owner or supervisor can assign or if no owner
    		toolbar.getComponent('assign').setDisabled(hasOwner && record.owner != $W().agentName && !isSupervisor);
    		if(saveAction){
    			saveAction.setDisabled(!this.allowEdit(record));
    		}
    		this.getComponent('taskInfoPanel').setVisible(true);
    		this.getComponent('taskInfoPanel').loadTask(record);
    	}
    },
    allowEdit: function(task){
    	var isClaimed = task.status == 'IN_PROGRESS';
		var isOwner = task.owner == $W().agentName;
		return isClaimed && isOwner;
    },
    allowComplete: function(task){
    	//can complete only if its me and the task is not in Reserved status
    	return task.owner == $W().agentName && task.status != 'RESERVED';
    },
    claimTask: function(taskId){
    	var me = this;
    	me.performAction('claim', taskId, null);
    },
    completeTask: function(taskId){
    	var me = this;
    	me.performAction('complete', taskId, null);
    },
    assignTask: function(taskId){
    	Ext.create('Ext.window.Window', {
    	    title: $W().localeManager.getLocalizationValue('application.javascript.tasks.assign.title'),
    	    height: 300,
    	    width: 400,
    	    modal: true,
    	    layout: 'fit',
    	    items: Ext.create('Jacada.system.ui.tasks.PotentialOwnersGrid', {taskId: taskId})
    	}).show();
    },
    releaseTask: function(taskId){
    	var me = this;
    	me.performAction('release', taskId, null);
    },
    performAction: function(action, taskId, user){
    	var me = this;
    	if(!taskId){
    		return false;
    	}
    	$W().HideCurrentVisibleTab();
    	me.setLoading(true);
    	// use Ajax.Request and not Ext.Ajax because in Ext you cannot use sync and it is too risky to change
    	//at this point to work with callbacks.
    	var params = {method: action, taskId: taskId, user: user, nocache:new Date().getTime()};
    	var request = new Ajax.Request($W().contextPath + '/HTManager.json', { method: 'get', parameters: params, asynchronous : false });
    	if (request.success()) {
			me.setLoading(false);
	    	var task = Ext.decode(request.transport.responseText).task;
	    	me.updateActionState(task);
	    	$W().ShowCurrentVisibleTab();
	    	return true;
		}else{
			me.setLoading(false);
	    	var msg = 'Your request cannot be processed at this time.\nPlease refresh your task list.';
	    	try{
	    		msg = Ext.decode(request.transport.responseText).error;
	    	}catch(e){
	    		//do nothing
	    	}
	    	Ext.Msg.show({
    			msg: msg,
    			buttons: Ext.Msg.OK,
    			icon: Ext.Msg.WARNING,
    			fn: function(){$W().ShowCurrentVisibleTab();}
    		});
	    	return false;
		}
    	
    },
    getSelectedTaskId: function(){
    	return this.getTasksGrid().getSelectedTaskId();
    },
    getSelectedTask: function(){
    	return this.getTasksGrid().getSelectedTask();
    },
    getTasksGrid: function(){
    	return this.getComponent('tasksGrid');
    },
    initComponent: function () {
    	var me = this;
    	
    	 //create actions
    	 var refreshAction = Ext.create('Ext.Action', {
    		itemId: 'refresh',
    		iconCls: 'x-tbar-loading',
	        text: getLocalizedValue('refresh'),
	        handler: function(){
	        	me.getTasksGrid().store.load();
	        }
	    });
    	 var completeAction = Ext.create('Ext.Action', {
    		itemId: 'complete',
    		iconCls: 'completeIcon',
 	        text: getLocalizedValue('complete'),
 	        handler: function(){
 	        	me.completeTask(me.getSelectedTaskId());
 	        }
 	    });
    	 var releaseAction = Ext.create('Ext.Action', {
    		itemId: 'release',
    		iconCls: 'releaseIcon',
 	        text: getLocalizedValue('release'),
 	        handler: function(){
 	        	me.releaseTask(me.getSelectedTaskId());
 	        }
 	    });
    	 var assignAction = Ext.create('Ext.Action', {
    		itemId: 'assign',
    		iconCls: 'assignIcon',
  	        text: getLocalizedValue('assign'),
  	        handler: function(){
  	        	me.assignTask(me.getSelectedTaskId());
  	        }
  	    });
    	 var claimAction = Ext.create('Ext.Action', {
    		itemId: 'claim',
    		iconCls: 'claimIcon',
   	        text: getLocalizedValue('claim'),
   	        handler: function(){
   	        	me.claimTask(me.getSelectedTaskId());
   	        }
   	    });
    	 
    	 var saveAction = Ext.create('Ext.Action', {
     		itemId: 'save',
     		iconCls: 'saveTaskIcon',
    	        text: getLocalizedValue('save'),
    	        handler: function(){
    	        	me.getComponent('taskInfoPanel').submitTaskOutput(me.getSelectedTask());
    	        }
    	    });
    	 
    	 var actions = [];
    	 if(!$W().LayoutByContext){
    		 actions.push(saveAction);
    		 actions.push('-');
    	 }
    	 actions.push(completeAction);
    	 actions.push(releaseAction);
    	 actions.push(claimAction);
    	 actions.push(assignAction);
    	 actions.push(refreshAction);
    	 
    	 Ext.applyIf(me, {
        	 dockedItems: [{
        	        dock: 'top',
        	        itemId: 'toolbar',
        	        xtype: 'toolbar',
        	        items: actions
        	    }],
        	 items:[
        	        Ext.create('Jacada.system.ui.tasks.TasksGrid'),
        	        Ext.create('Jacada.system.ui.tasks.TaskInfoPanel', {itemId: 'taskInfoPanel'})
        	        ]
         }); 
        this.callParent();
        me.updateActionState();
    }
});

function getLocalizedValue(key){
	return $W().localeManager.getLocalizationValue('application.javascript.tasks.'+key);
}
 