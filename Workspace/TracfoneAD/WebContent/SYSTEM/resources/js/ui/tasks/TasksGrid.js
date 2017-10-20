Ext.define('Jacada.system.ui.tasks.TasksGrid', {
    extend: 'Ext.grid.Panel',

    itemId: 'tasksGrid',
    minHeight: 200,
    //autoHeight: true,
    border: false,
    autoScroll: true,
    viewConfig: {
        listeners: {
            itemdblclick: function(dataview, record, item, index, e) {
            	var maximizedTab = $W().workspaceUI.maximizedTab;
            	if(maximizedTab){
            		//if current tab is maximized, we need to restore current maximized tab
            		var tab = $W().getTab('tasksTab');
            		tab.restore();
            	}
            	if($W().LayoutByContext){
                	Ext.getCmp('contextNavigation').createTaskContextGroup(record.data);
                }
            }
        }
    },
    updateActionState: function(record){
    	this.up().updateActionState(record);
    },
    updateTask: function(task){
    	var me = this;
    	var record = this.store.getById(task.taskId);
    	if (record != undefined) {    	    
    	    var data = record.data;
    	    data.owner = task.owner;
            data.name = task.name;
            data.taskName = task.taskName;
            data.priority = task.priority;
            data.status = task.status;
            data.subject = task.subject;
            me.reconfigure(this.store);
            // update toolbar for selected record only.
            me.updateActionState(me.getSelectedTask());
    	}

    },
    getSelectedTaskId: function(){
    	var task = this.getSelectedTask();
         if (task) {
             return task.id;
         }
         return null;
    },
    getSelectedTask: function(){
    	var selection = this.getView().getSelectionModel().getSelection()[0];
         if (selection) {
             return selection.data;
         }
         return null;
    },
    initComponent: function () {
    	var me = this;
    	//model
    	Ext.define('Task', {
    	     extend: 'Ext.data.Model',
    	     fields: [{name: 'taskId'}, {name: 'subject'}, {name: 'status'}, {name: 'priority'}, {name: 'name'}, {name: 'owner'}, {name: 'createdMillis'}, {name: 'taskName'}]
    	 });
    	//store
    	 var tasksStore = Ext.create('Ext.data.Store', {
    	     model: 'Task',
    	     id: 'tasksStore',
    	     pageSize: getTasksGridPageSize(),
    	     proxy: {
    	         type: 'ajax',
    	         url: $W().contextPath + '/HTManager.json',
    	         reader: {
    	             type: 'json',
    	             root: 'results',
	                 totalProperty: 'totalCount',
	                 idProperty: 'taskId'
    	         }
    	     },
    	     autoLoad: true
    	 });
    	 
    	 Ext.applyIf(me, {
        	 store: tasksStore,
        	 listeners: {
    		    select: function(selModel, record, index, options){
    		        me.updateActionState(record.data);
    		    },
    		    deselect: function(selModel, record, index, options){
    		        me.updateActionState();//call with empty record
    		    }
        	 },
        	 dockedItems: [{
        	        xtype: 'pagingtoolbar',
        	        store: tasksStore,   
        	        dock: 'bottom',
        	        displayInfo: true
        	    }],
        	 columns: [
        	              { text: me.getLocalizedValue('taskId'),  dataIndex: 'taskId' },
        	              { text: me.getLocalizedValue('name'),  dataIndex: 'name' , flex: 1, renderer: me.taskDataCellRenderer},
        	              { text: me.getLocalizedValue('subject'),  dataIndex: 'subject' , flex: 1, renderer: me.taskDataCellRenderer},
        	              { text: me.getLocalizedValue('status'),  dataIndex: 'status' , renderer: me.taskDataCellRenderer, width: 100},
        	              { text: me.getLocalizedValue('priority'), dataIndex: 'priority' , renderer: me.taskDataCellRenderer},
        	              { text: me.getLocalizedValue('owner'), dataIndex: 'owner' , renderer: me.taskDataCellRenderer, width: 100},
        	              { text: me.getLocalizedValue('created'), dataIndex: 'createdMillis', renderer: me.taskDataCellRenderer, width: 120}
        	          ]
         }); 
    	 this.callParent();
    	 me.registerForMessages();
    },
    removeCompletedTask: function(task){
    	if(task.status == 'COMPLETED'){
    		this.store.remove(this.store.findRecord('taskId', task.taskId));
    		if($W().LayoutByContext){
    			Ext.getCmp('contextNavigation').removeTaskContextGroupNode(task.taskId);
    		}
    		this.updateActionState();
    	}
    },
    registerForMessages: function(){
    	$W().Push.registerEventHandler( 'HT_UPDATED', this.updateTask.bind(this));
    	$W().Push.registerEventHandler( 'HT_COMPLETED', this.removeCompletedTask.bind(this));
    },
    /**
     * Custom function used for column renderer
     */
    taskDataCellRenderer: function(value, metaData, record, row, col, store, gridView) {
    	var dataIndex = metaData.column.dataIndex;
    	if(dataIndex == 'status'){
    		value = $W().localeManager.getLocalizationValue('application.javascript.tasks.status.'+value);
    	}else if(dataIndex == 'createdMillis'){
    		value = Ext.Date.format(new Date(value), DATE_FORMAT + " " + TIME_FORMAT)
    	}
    	//add tooltip to all cells
    	metaData.tdAttr = 'data-qtip="' + value + '"';
        return value;
    },
    getLocalizedValue: function(key){
    	return $W().localeManager.getLocalizationValue('application.javascript.tasks.'+key);
    }
});


  