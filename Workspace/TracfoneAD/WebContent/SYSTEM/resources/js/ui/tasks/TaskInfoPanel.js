Ext.define('Jacada.system.ui.tasks.TaskInfoPanel', {
    extend: 'Ext.panel.Panel',
    
    inputOutputPanel: null,
    taskInputPanel: null,
    taskOutputPanel: null,
    commentsPanel: null,
    border: false,
    header: false,
    layout: {
        type:'vbox',
        padding:'5',
        align:'stretch'
    },
    
    submitTaskOutput: function(){
    	this.getComponent('taskInputOutputPanel').getComponent('taskOutputPanel').submitTaskOutput();
    },
    
    initComponent: function() {
        var me = this;
        var items = [];
        me.inputOutputPanel = me.buildInputOutpuPanel()
        me.commentsPanel = me.buildCommentsPanel();
        items.push(
        		{
  				  xtype: 'displayfield',  
  				  itemId: 'subjectTitle',
  				  padding: 5,
  				  fieldLabel: $W().localeManager.getLocalizationValue('application.javascript.tasks.subject'),
  				  value:  'task.subject',
  				  labelCls: 'task-input-field-label'
  	        	}		
        );
        items.push(me.inputOutputPanel);
        items.push({xtype: 'splitter'});
        items.push(me.commentsPanel);
        items = items.compact();
        Ext.applyIf(me, {
        	items: items
        });
        me.callParent(arguments);
    },
    buildInputOutpuPanel: function(){
    	var panelItems = [];
    	this.taskInputPanel = this.buildInputPanel();
    	panelItems.push(this.taskInputPanel);
    	this.taskOutputPanel = this.buildOutputPanel();
    	panelItems.push(this.taskOutputPanel);
    	panelItems = panelItems.compact();
    	
    	return Ext.create('Ext.panel.Panel',{
			layout: 'column',
			autoScroll: true,
			flex: 2,
			itemId: 'taskInputOutputPanel',
			items: panelItems
    	});
    },
    buildInputPanel: function(){
        return Ext.create('Jacada.system.ui.tasks.TaskInputPanel');
    },
    buildOutputPanel: function(){
        return Ext.create('Jacada.system.ui.tasks.TaskOutputPanel');
    },
    buildCommentsPanel: function(){
        return Ext.create('Ext.tab.Panel', {
	        activeTab: 0,
	        flex: 1,
	        itemId: 'commentsTabPanel',
	        plain: true,
	        items: [
	            {
	                title: $W().localeManager.getLocalizationValue('application.javascript.tasks.comment.comments'),
	                itemId: 'comments',
	                autoScroll: true,
	                layout: 'fit',
	        	    items: Ext.create('Jacada.system.ui.tasks.CommentsGrid')
	            }
	        ]
	    });
    },
    
    loadTask: function(task){
    	this.setLoading(true);
    	var shouldShowInfo = !$W().LayoutByContext || this.up().id != 'taskBoard';
    	if(this.taskOutputPanel){
    		this.taskOutputPanel.setVisible(shouldShowInfo);
    	}
    	if(this.commentsPanel){
    		this.commentsPanel.setVisible(shouldShowInfo);
    	}
    	this.loadInputPanel(task);
    	this.getComponent('subjectTitle').setValue(task.subject);
    	if(shouldShowInfo){
	    	this.loadOutputPanel(task);
    		this.loadComments(task.taskId);
    	}else{
    		//if output is shown, we will stop loading after the output was loaded 
    		this.setLoading(false);
    	}
    	
    },
    createTaskInfoForm: function(taskInputInfo, task){
    	this.taskInputPanel.updateInputPanel(taskInputInfo, task);
    },
    populateTaskOutputPanel: function(taskOutputInfo, task){
    	this.taskOutputPanel.updateOutputPanel(taskOutputInfo, task);
    },
    loadComments: function(taskId){
    	this.commentsPanel.getComponent('comments').getComponent('commentsGrid').loadComments(taskId);
    },
    loadInputPanel: function(task){
    	var me = this;
    	Ext.Ajax.request({
    	    url: $W().contextPath + '/HTManager.json',
    	    method: 'GET',
    		disableCaching: true,
    		params: {method: 'getTaskInput', taskId: task.taskId},
    	    success: function(response, opts) {
    	    	var taskInfo = Ext.decode(response.responseText).JSONObject;
    	    	me.createTaskInfoForm(taskInfo, task);
    	    },
    	    failure: function(response, opts) {
    	    	alert('Your request cannot be processed at this time.\nPlease refresh your task list.');
    	    }
    	});
    },
    loadOutputPanel: function(task){
    	var me = this;
    	Ext.Ajax.request({
    	    url: $W().contextPath + '/HTManager.json',
    	    method: 'GET',
    		disableCaching: true,
    		params: {method: 'getTaskOutputWithMetadata', taskId: task.taskId, taskName: task.taskName},
    	    success: function(response, opts) {
    	    	Jacada.Logger.debug("getTaskOutputWithMetadata result");
    	    	Jacada.Logger.debug(response.responseText);
    	    	var taskOutputInfo = Ext.decode(response.responseText).JSONObject;
    	    	me.populateTaskOutputPanel(taskOutputInfo, task);
    	    	me.setLoading(false);
    	    },
    	    failure: function(response, opts) {
    	    	me.setLoading(false);
    	    	alert('Your request cannot be processed at this time.\nPlease refresh your task list.');
    	    }
    	});
    }
});