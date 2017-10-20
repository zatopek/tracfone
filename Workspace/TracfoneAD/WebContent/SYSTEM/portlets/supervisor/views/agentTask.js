


loadAgentTask = function(){
	Ext.ns("Jacada.task");
	
	var frameElement = this.frameElement;
	var _this;
	var ignoreSelection = false;
	
	
	/**
     *  Class Responsible for rendering Agent Task Panel
     * 
     *  Gets  3 Parameters in the constructor :
     * 
     *      url : The Controller URL that in the server
     * 
     *      taskToolBar: Json Array of a tool bar (see example in supervisor/config/taskToolbar.js)
     * 
     *      renderId: the Dom ID element which the container panel should be render to (set null if not exists)
     * 
     *
     *  Public Methods:
     * 
     *  init: instantiate the object
     * 
     *  getPanel: to get the container panel
     * 
     *  changeAgentData(name): to change the context of the Panel to show tasks of Agent with AgentId 'name'
     * 
     *  registerForMessages: register for Push messages
     * 
     *  unregisterForMessages: unregister for Push messages
     *  
     *  createToolBar: Create the task toolbar on the bottom of the panel
     *  			   returns an instance of Ext.Toolbar
     *  
     *  
     *  
     *  Global Methods that has to be declared in the window/iframe when using this class:
     *  
     *  	- resizeContent will be called from the document.body.onresize event.
     *
     *
     *
     */
	Jacada.task.TaskView = Ext.extend(Object,{
		
		////////////////// //
		// private members //
		////////////////////
    	utils: new Jacada.task.TaskUtils(),
    	isTaskManager: true,
        renderId: null,
        agentName: null,
        URL: '../../../taskManager.json',
        offset:  null,
        invokedReminders: null, // a map to save the ids of the task that already got reminders
        tasksLoaded: false, //indicate if the task is loaded or not
        panContainer: null,
        waitingForLoadingTaskId: null,
        tasksDataStore: null,
        statusDataStore: null,
        statusCB: null,
        reminderDataStore:null,
        dueDateEditor:null,
        btnRefresh: null,
        btnAddTask: null,
        btnDeleteTasks: null,
        btnDeleteAllTasks: null,
        btnAddToGroup:null,
        grid: null,
        taskDetailsStore: null,
        addTaskWindow: null,
		taskDetailsGridPanel: null,
		remindersCB: null,
		descriptionField: null,
		remindersCBField: null,
		dueDateEditorField: null,
		tbar: null,	
		autoWidth: false,
		editable: true,
		usernameMapping:null,

        constructor: function( url, taskToolBar, renderId, autoWidth, editable, isTaskManager){
    		_this = this; 
           /* this.agentName = name;*/
            this.renderId = renderId;
            this.usernameMapping = new Object();
            if (url !== undefined && url !== null) {
            	this.URL = url;
            }
            
            this.offset  = $W().agentGMToffset;
            this.invokedReminders = new Object();
            this.tbar = taskToolBar;
            this.autoWidth = autoWidth;
            if (editable != null && editable != undefined ) {
            	this.editable = editable;
            }
            this.isTaskManager = isTaskManager;
    	},
    	
    	changeAgentData: function(name) {
    		_this.agentName= name;
    		_this.doRefresh();
    	},
    	getPanel: function() {
    		return _this.panContainer;
    	},
    	init: function() {
    		this.registerForMessages();
    		this.initTaskGrid();
    		this.initTaskDetailsGrid();
    		this.registerCallbackApi();
    		/*
    		 * load the grid data
    		 * since we have 3 dataStores (tasks, reminders, status) we must make sure all
    		 * of them were loaded so we load each store on another store event.
    		 * Status -> Reminders -> Tasks
    		 */
    		this.reminderDataStore.on('datachanged', function(store) {
    			_this.loadTasks();
    		});
    		
    		this.statusDataStore.on('datachanged', function(store) {
    			//load the data to populate the task reminder combobox	
    			_this.reminderDataStore.load({params:{method:'loadSReminders'}});
    		});
    		this.tasksDataStore.on('datachanged', function(store) {
    			_this.tasksLoaded = true;
    			//after the tasks were loaded, see if there is a reminder waiting to be invoked 
    			if (_this.waitingForLoadingTaskId != null){
    				//Init this variable  because we don't want to 
    				//perform the operation everytime we reload the tasks
    				_this.invokedReminder(_this.waitingForLoadingTaskId);
    				_this.waitingForLoadingTaskId = null;
    			}
    		});
    		
    		//load the data to populate the task status combobox
    		this.statusDataStore.load({params:{method:'loadStatuses'}});
    		if(this.isTaskManager){
    			document.body.onresize = new Function("resizeContent()");
    		}
    		
    		this.panContainer = new Ext.Panel({
				layout: 'border',
				autoScroll: false,
				border: true,
				bodyBorder: false,
				id: 'panContainer',
				items:[
					this.createTopToolbar(),
					this.grid,
					this.taskDetailsGridPanel
				]
  		   });
    		
    		//whenever a task is selcted, load its details to the taskDetailsStore
    	    this.grid.getSelectionModel().on('rowselect', function(sm, rowIndex, r) {
    	    	//if more than 1 row are selected, do not show details
    	    	if (_this.grid.getSelectionModel().getSelections().length > 1){
    	    		_this.clearTaskDetailsGrid();
    	    	}else{
    	    		_this.taskDetailsStore.load({params:{taskId:r.data.id, method:"loadTaskData"}});
    				_this.taskDetailsGridPanel.setTitle(r.data.description);
    				
    	    	}
    			_this.realizeToolbarButtonsState();
    		});
    	    this.grid.getSelectionModel().on('beforerowselect', function(sm, rowIndex, r) {
    	    	//when a row is selected, de-select event is fired, we want to ignore the de-select event
    	    	//in this particular case.
    	    	_this.ignoreSelection = true;
    		});
    	    //whenever a task is deselcted, clean the taskDetailsStore
    	    this.grid.getSelectionModel().on('rowdeselect', function(sm, rowIndex, r) {
    	    	if(!_this.ignoreSelection){
	    	    	_this.clearTaskDetailsGrid();
	    			_this.realizeToolbarButtonsState();
	    			_this.resizeContent();
    	    	}
    	    	_this.ignoreSelection = false;
    		});
    	    this.resizeContent();
    		_this.doRefresh();
    	    
    	},
    	/*
    	 * resize the inner components according to the portlet size
    	 */
    	resizeContent: function () {
    		
    		if ( frameElement.offsetWidth <= 0  || frameElement.offsetHeight <= 0) {
    			return;
    		}
    		//changing the width and height to allow the wrapping window frame
    		this.panContainer.setWidth(frameElement.offsetWidth);
    		this.panContainer.setHeight(frameElement.offsetHeight);
    		var taskManagerWindow = $W().toolbarWindows['TaskManagerWindow'];
    		if (taskManagerWindow){
    			this.panContainer.setWidth(frameElement.offsetWidth-20);
    			this.panContainer.setHeight(frameElement.offsetHeight-40);
    		}
    		this.panContainer.doLayout();
    		if ( this.panContainer.getEl() !== undefined && this.panContainer.getEl() != null) {
    			this.panContainer.getEl().repaint();
    		}
    	},
    	registerForMessages: function(){
    		$W().Push.registerEventHandler( 'TASK_REMINDER', this.handleTaskReminderEvent);
    		$W().Push.registerEventHandler( 'TASK_ADDED', this.handleTaskAddedEvent);
    		$W().Push.registerEventHandler( 'TASK_BECAME_DUE', this.handleTaskBecameDueEvent);
    		$W().Push.registerEventHandler( 'TASK_DELETED', this.handleTaskDeletedEvent);
    		$W().Push.registerEventHandler( 'TASK_UPDATED', this.handleTaskUpdatedEvent);
    	},
    	unregisterForMssages: function() {
    		$W().Push.unregisterEventHandler( 'TASK_REMINDER', this.handleTaskReminderEvent);
    		$W().Push.unregisterEventHandler( 'TASK_ADDED', this.handleTaskAddedEvent);
    		$W().Push.unregisterEventHandler( 'TASK_BECAME_DUE', this.handleTaskBecameDueEvent);
    		$W().Push.unregisterEventHandler( 'TASK_DELETED', this.handleTaskDeletedEvent);
    		$W().Push.unregisterEventHandler( 'TASK_UPDATED', this.handleTaskUpdatedEvent);

    		var frame = $W().document.getElementById("TaskManagerPortletFrame");
    		if ((frame != null)) {
    			frame.portletRemoved = true;
    		}
    	},
    	
    	/*
    	 * Invoked when a task was deleted by proffesional services
    	 */
    	handleTaskDeletedEvent: function (taskId){
    		_this.doRefresh();
    	},
    	handleTaskUpdatedEvent: function (taskId){
    		_this.doRefresh();
    	},
    	/*
    	 * call the renderer to paint the background of the row
    	 */
    	handleTaskBecameDueEvent: function (taskId){
    		
    	    var rowIndex = _this.utils.getRowIndexById(taskId, _this.tasksDataStore);
    	    if (rowIndex != -1){
    	    	var record = _this.tasksDataStore.getAt(rowIndex);
    	    	_this.updateRowClass(rowIndex, record);
    	    	_this.selectRowByTaskId(taskId);
    	    	$W().flashTabHeaderOnce(_this.utils.getTaskTabName());
    	    }
    	},
    	updateRowClass: function (rowIndex, record){
    		var row = this.grid.getView().getRow(rowIndex);
    			if(row){
    				var element = Ext.get(row);
    				if(this.utils.isTaskDue(record.data.dueDateMilliseconds)){
    					element.addClass('dueTaskRowDecorator');
    				}else{
    					element.removeClass('dueTaskRowDecorator');
    				}
    			}
    	},
    	handleTaskAddedEvent: function (taskId){
    		_this.doRefresh();
    	},
    	handleTaskReminderEvent: function (taskId){
    		//we want to set the task as selected but the tasks were not loaded yet,
    		//save the task id and do it when the load event is invoked
    		//note: we save here only the LAST task id that arrived
    		if (!_this.tasksLoaded){
    			_this.waitingForLoadingTaskId = taskId;
    			return;
    		}
    		_this.invokedReminder(taskId);
    	},
    	invokedReminder: function (taskId){
    		//if this task id already got a reminder
    		//then do not remind again, 
    		if (!this.invokedReminders[taskId]){
    			//if tab available
    			if($W().document.getElementById(this.utils.getTaskTabName())){
    				if($W().isTabFlashing(this.utils.getTaskTabName()) == false && $W().isTabInFocus(this.utils.getTaskTabName()) == false){
    					$W().markTabAsFlashing(this.utils.getTaskTabName());
    					var name = this.utils.getTaskTabName(); 
    					$W().intervalTaskFlashID = $W().setInterval(function(){
    						$W().flashTabHeaderSeveralTimes(eval('(name)'));
    					},500);
    				}
    			}
    			// notify toolbar
    			$W().notifyToolbarButton("TaskManagerWindow"); 
    			this.performEffect(3);
    			this.selectRowByTaskId(taskId);
    			this.invokedReminders[taskId]=true;
    		}
    	},
    	selectRowByTaskId: function (taskId){
    		var rowIndex = _this.utils.getRowIndexById(taskId, _this.tasksDataStore);
    	    if (rowIndex != -1){
    	    	_this.grid.getView().focusRow(rowIndex); 
    	    	_this.grid.getSelectionModel().selectRow(rowIndex, true);
    	    }	
    	},
    	/*
    	 * Performs effect on the main panel for a given number of times
    	 */
    	performEffect: function (numOfTimes){
    		while (numOfTimes > 0)
    		{
    			this.panContainer.el.fadeIn();
    			numOfTimes--;
    		}
    	},

    	/*
    	 * The secondary grid in the agent tasks portlet
    	 * this grid has 2 column: Name and Value that represent
    	 * the task's attached data
    	 */
    	initTaskDetailsGrid: function (){
    		
    		//The data store to hold the task details
    		this.taskDetailsStore = new Ext.data.JsonStore({
    			root:'taskData',
    			totalProperty: 'total',
    			fields:[{name:'name', type:'string'}, {name:'value', type:'string'}],
    			url: _this.URL,
    			sortInfo:{field: 'value', direction: "ASC"},
    			listeners: {
    				load: function(store, records, options) {
	    				if (_this.renderId) {
	    					_this.resizeContent();
	    				}
    	            }
    	        }
    		});
    		
    		//create the grid
    		this.taskDetailsGridPanel = new Ext.grid.GridPanel({
    	        id: 'taskDetailsGrid',    
    			region: 'south',
    		    split: true,
    	        store:_this.taskDetailsStore,
    	        cm: _this.createTaskDetailsColumnModel(),
    	        autoScroll: true,
    	        viewConfig: {forceFit:true},//causes the column to fit the grid
    	        minHeight: 95,
    	        height: 95,
//    	        anchor: '100% 40%',
    	        header: true
    	    }); 
    		this.taskDetailsGridPanel.setAutoScroll(true);
    	},
    	createTaskDetailsColumnModel: function (){
    		var columns = new Ext.grid.ColumnModel([
    	    	{
    	    		//name column
    	             header:_this.utils.getLocalizationValue('application.javascript.taskManager.column.name')
    	            ,sortable:true
    	            ,dataIndex:'name'
    				,renderer: this.taskDataCellRenderer
    	         },
    	         {
    	         	//value column
    	             header:_this.utils.getLocalizationValue('application.javascript.taskManager.column.value')
    	            ,sortable:true
    	            ,dataIndex:'value'
    				,renderer: this.taskDataCellRenderer
    	         }
    	         
    	         ]);
    	    return columns;
    	},


    	initTaskGrid: function() {
    		
            _this.tasksDataStore = new Ext.data.JsonStore({
                root: 'taskData',
                  totalProperty: 'total',
                  fields: [ 
                  {name: 'id'},
                  {name: 'description', type: 'string'},
                  {name: 'dueDateMilliseconds', type: 'int'},
                  {name: 'reminderInMinutes', type: 'int'},
                  {name: 'status', type: 'int'},
                  {name: 'editable', type: 'boolean'},
                  {name: 'agentName', type: 'string'}
                ],
                url: _this.URL,
                //init order by status
                sortInfo:{field: 'status', direction: "ASC"}
              });
            
          //Status combobox to allow the user to define the task' status
            _this.statusDataStore = new Ext.data.JsonStore({
        					root:'taskData',
        					totalProperty: 'total',
        					fields:[{name:'id', type:'int'}, {name:'description', type:'string'}],
        					url: _this.URL
        					//sortInfo:{field: 'description', direction: "ASC"}
        				});
        				
        	this.statusCB = new Ext.form.ComboBox({
        	    store: this.statusDataStore,
        	    displayField:'description',
        	    valueField:'id',
        	    mode: 'local',
        	    name: 'status',
        	    editable: false,
        	    allowBlank: false,
        	    width: 140,
//        	    autoWidth: true,
        	    fieldLabel: _this.utils.getLocalizationValue('application.javascript.taskManager.column.status'),
        	    triggerAction: 'all',
        	    //By enabling lazyRender this prevents the combo box
        		//from rendering until requested
        		lazyRender: true//should always be true for editor
        	});
        	
        	this.statusCB.on('select', function(record, index ) {
        		//after the user selects a value from the combobox,
        		//hide the combobox by calling stopEditing
            	_this.grid.stopEditing();
        	});

          //Reminder combobox to allow the user to select required reminder time
        	this.reminderDataStore = new Ext.data.JsonStore({
            	//id: 'reminderDataStore',
            	root: 'taskData',
            	totalProperty: 'total',
          		fields:[ 
        	        {name: 'description', type: 'string'},
        			{name: 'id', type: 'int'}
          		],
          		url: this.URL
        	});		
        	
        	this.remindersCB = new Ext.form.ComboBox({
        	    store: this.reminderDataStore,
        	    displayField:'description',
        	    valueField:'id',
        	    name: 'reminderInMinutes',
        	    mode: 'local',
        	    allowBlank: false,
        	    width: 120,
        	    fieldLabel: _this.utils.getLocalizationValue('application.javascript.taskManager.column.reminder'),
        	    editable: false,
        	    triggerAction: 'all',
        	    //By enabling lazyRender this prevents the combo box
        		//from rendering until requested
        		lazyRender: true//should always be true for editor
        	});
        	
        	this.remindersCB.on('select', function(record, index ) {
        		//after the user selects a value from the combobox,
        		//hide the combobox by calling stopEditing
            	_this.grid.stopEditing();
        	});

        	//Date editor to handle date values
        	this.dueDateEditor = new Ext.ux.form.DateTime({
                fieldLabel: _this.utils.getLocalizationValue('application.javascript.taskManager.column.dueDate'),
                dateFormat: TASK_DATE_FORMAT,
                dateConfig: {allowBlank: false,validator:this.futureValidator ,minValue:new Date().clearTime()},
                timeConfig: {allowBlank: false, increment: 30},
                timeFormat: TASK_TIME_FORMAT,
                dateWidth:120,
                timeWidth:80,
               id: 'displayDateFrom'
            });
        	//Cell Editors - END
        	var bar = this.createToolBar();
        	var ren = undefined;
        	if (!this.renderId) {
        		ren = Ext.getBody();
        	}
        	
        	if (this.editable) {
	         	this.grid = new Ext.grid.EditorGridPanel({
	                id: 'tasksGrid',
	    			region: 'center',
	                store: this.tasksDataStore,
	                cm: this.createColumnModel(),
	                sm: new Ext.grid.RowSelectionModel({singleSelect: false, moveEditorOnEnter: false}),
	                autoExpandColumn: 'description', // when there is free space to grow, resize only this column
	                minHeight: 150,
	                frame: true,
	                bbar: bar,
	                width: 200,
	                viewConfig: {forceFit:true}//causes the column to fit the grid
	         	});
        	} else {
        		this.grid = new Ext.grid.GridPanel({
					id: 'tasksGrid',
	    			region: 'center',
					store:this.tasksDataStore,
					cm: this.createColumnModel(),
					sm: new Ext.grid.RowSelectionModel({singleSelect: true, moveEditorOnEnter: false}),
					autoExpandColumn: 'description', // when there is free space to grow, resize only this column
	                minHeight: 150,
					frame: true,
					bbar: bar,
					width: 200,
					viewConfig: {forceFit:true}//causes the column to fit the grid
        		});
        	}
        	
        	this.grid.on('resize', function(gridPanel){
        		gridPanel.getEl().repaint();
        	});
         	 
         	//define the css class per row
             this.grid.getView().getRowClass = function(record, index) {
         	      if(_this.utils.isTaskDue(record.data.dueDateMilliseconds)){
         	            return 'dueTaskRowDecorator'; 
         	      }
         	};
         	
         	// trigger the data store to load the tasks
         	this.tasksDataStore.on('load', function() {
             	_this.realizeToolbarButtonsState();
         	});
         	
         	this.realizeToolbarButtonsState(); 
         	//do not allow to edit 'not editable' tasks
            this.grid.on('beforeedit', function(event) {
            	//status is always editable
            	if(event.field == 'status'){
            		if (!_this.isTaskOwner(event.record.data)){
            			event.cancel = !_this.isTaskEditable(event.record.data);
            		}
            	}else{
            		event.cancel = !_this.isTaskEditable(event.record.data);
            	}
        	});
            
            this.grid.on('afteredit', function(event) {
        	  	//format the due date
        	  	if(event.field == 'dueDateMilliseconds'){
        	  		//get the time in milliseconds from the date retrieved from the calendar component
        	  		event.record.data.dueDateMilliseconds = event.record.data.dueDateMilliseconds.getTime();
        	  	}
        	  	
        	  	//we updated the task - allow reminders
        	  	if (event.field == 'dueDateMilliseconds' || event.field == 'reminderInMinutes' || event.field == 'status' ){
        	  		_this.invokedReminders[event.record.data.id]=false;
        	  	}

        	  	//convert to json object and send to the server
        		var data = Ext.util.JSON.encode(event.record.data);
        		_this.tasksDataStore.load( {params: {method: "save", agentTask: data, agentGMTOffset:_this.offset, agentName: _this.agentName} } );
        		//cause the cell editor to hide the small red arrow on the corner
        		event.record.commit();
        		_this.realizeToolbarButtonsState();
        		
        	});
        	
            
        },

        realizeToolbarButtonsState: function(){
        	this.btnDeleteAllTasks.setDisabled(!deleteTasksPrivileged || this.tasksDataStore.getCount()==0 || (_this.viewType && _this.viewType.getValue()==1));
        	//WS-2594: disable the Add Task button when no user is selected on SPV, in all other cases - enable the Add Task button
        	if(!this.isTaskManager && this.agentName == null){
        		this.btnAddTask.setDisabled(true);
        	}else{
        		this.btnAddTask.setDisabled(false);
        	}
        	
        	this.btnReassign.setDisabled (this.grid.getSelectionModel().getCount() <= 0)
        	
        	var totalSelectedRows = this.grid.getSelectionModel().getSelections().length;
        	var totalNonEditableSelectedRows = this.getNonEditableSelectedRowCount();
        	//The 'delete' button is disabled if there are no selected rows
        	// or if all the selected rows are non-editable
        	var isTaskOwner = true;
        	if (totalSelectedRows == 1){
        		var record = this.grid.getSelectionModel().getSelected();
        		isTaskOwner = _this.isTaskOwner(record.data);
        	}
            this.btnDeleteTasks.setDisabled(!isTaskOwner || !deleteTasksPrivileged || totalSelectedRows <= 0 || totalSelectedRows == totalNonEditableSelectedRows);
        },

		
/*
 * Returns the total number of the selected non-editable rows
 */
	getNonEditableSelectedRowCount: function (){
		return this.getNonEditableRowCount(true);
	},
	
	getNonEditableRowCount: function(onlySelected) {
        	var records = 0;
        	if ( onlySelected ){
        		//get only the selected records
        		records = _this.grid.getSelectionModel().getSelections();
        	}else{
        		//get all the records in the grid
        		records = _this.tasksDataStore.getRange();
        	}
        	
        	var counter = 0;
        	for(var i = 0, len = records.length; i < len; i++){
        			if(!_this.isTaskEditable(records[i].data)){
        				counter++;
        			}
                }	
        	return counter;
        },
        
        futureValidator: function(value){
        	return _this.utils.validateFutureDate(value, _this.dueDateEditor);
        },
        doRefresh: function() {
        	
        	_this.grid.getSelectionModel().clearSelections(true);
        	_this.clearTaskDetailsGrid();
        	_this.loadTasks();
        	_this.realizeToolbarButtonsState();
        	
        },
        doAddTask: function(){
        	var action = new Jacada.task.addTaskAction(_this.URL, _this.agentName, _this.reminderDataStore );
        	action.perform(_this);
        	_this.realizeToolbarButtonsState();
        },
        doReassign: function() {
        	var records = _this.grid.getSelectionModel().getSelections();
        	if (records.length != 1 ) {
        		return; 
        	}
        	var action = new Jacada.task.ReassignTaskAction(_this.agentName, _this.URL, records[0].data.id);
        	action.perform(_this);
        },
        doAddToGroup: function() {
        	
        	var action = new Jacada.task.addTaskToGroupAction(_this.URL, _this.agentName, _this.reminderDataStore, _this.tasksDataStore );
        	action.perform(_this);
        	_this.realizeToolbarButtonsState();
        },
        clearTaskDetailsGrid: function (){
        	this.taskDetailsStore.removeAll();
        	this.taskDetailsGridPanel.setTitle('');
        },
    
        createColumnModel: function (){
            
        	var cm = new Ext.grid.ColumnModel([
				{
					//agent name
					id: 'agentName',
				     header:_this.utils.getLocalizationValue('application.javascript.taskManager.column.agent')
				    ,sortable:true
				    ,dataIndex:'agentName'
				    ,width: 100
				    ,align: 'left'
				    ,hidden: true
				    ,renderer: this.taskCellRenderer
				 },
            	{
            		//description
            		id: 'description',
                     header:_this.utils.getLocalizationValue('application.javascript.taskManager.column.description')
                    ,sortable:true
                    ,dataIndex:'description'
                    ,width: 100
                    ,align: 'left'
                    ,hideable: false
                    ,renderer: this.taskCellRenderer
                    ,editor: new Ext.form.TextField({
        					allowBlank: false	
        			})
                 },
                 {
                 	//due date column
                 	id: 'dueDateMilliseconds'
                    ,header:_this.utils.getLocalizationValue('application.javascript.taskManager.column.dueDate')
                    ,sortable:true
                    ,dataIndex:'dueDateMilliseconds'
                    ,editor:this.dueDateEditor
                    ,renderer: this.taskCellRenderer
                    ,width: 200
                 },
                 {
                 	//reminder
                 	id: 'reminder',
                     header:_this.utils.getLocalizationValue('application.javascript.taskManager.column.reminder')
                    ,sortable:true
                    ,dataIndex:'reminderInMinutes'
                    ,width: 100
                    //,fixed : true // cannot change size
                    ,align: 'left'
                    ,editor:this.remindersCB
                    ,renderer: this.taskCellRenderer
                 },
                 {
                 	//status
                 	id: 'status',
                     header:_this.utils.getLocalizationValue('application.javascript.taskManager.column.status')
                    ,sortable:true
                    ,dataIndex:'status'
                    ,width: 100
                    //,fixed : true // cannot change size
                    ,align: 'left'
                    ,editor:this.statusCB
                    ,renderer: this.taskCellRenderer
                 }
                 ]);
             return cm;
        },
        taskDataCellRenderer: function(value, metaData, record, rowIndex, colIndex, store) {
        	metaData.attr = "title='" + value + "'";
            return value;
        },
        /*
         * The renderer that in charge on the grid style
         */
        taskCellRenderer: function(value, metaData, record, rowIndex, colIndex, store) {
        	//show the 'not-editable' rows as grayed
        	if (!_this.isTaskEditable(record.data)){
          		metaData.css = 'non_editable_row';
        	}
        	//debugger;
        	//we are handling row here
        	//we don't care which column so we do it on the first
        	//column so we won't have to repeat it for each column
        	if (colIndex == 0){
        		_this.updateRowClass(rowIndex, record);
        	}
        	//agent name column
        	if(metaData.id == 'agentName'){
        		if (_this.usernameMapping != null){
        			var displayName = _this.usernameMapping[value];
        			if (displayName != null){
        				value = displayName;
        			}
        		}
        	}
        	//dueDate column
        	else if(metaData.id == 'dueDateMilliseconds'){
        		//format only date object
        		if (Ext.num(value, -1)){
        			value = new Date(value);
        		}
        		if (Ext.isDate(value)){
        			//value = value.dateFormat( 'm-d-Y H:i' );
        			value = value.dateFormat( TASK_DATE_FORMAT + " " + TASK_TIME_FORMAT );
        		}
        	}
        	//reminder column
        	else if(metaData.id == 'reminder'){
        		//if we get here the id of the combobox item
        		//we need to find the description
        		if(Ext.num(value, -1) != -1){
                	var rowIndex = _this.utils.getRowIndexById(value, _this.reminderDataStore);
            		if(rowIndex != -1){
            			value = _this.reminderDataStore.getAt(rowIndex).data.description;
            		}
        		}
        	}
        	//status column
        	else if(metaData.id == 'status'){
        		//if we get here the id of the combobox item
        		//we need to find the description
        		if(Ext.num(value, -1) != -1){
                	var rowIndex = _this.utils.getRowIndexById(value, _this.statusDataStore);
            		if(rowIndex != -1){
            			value = _this.statusDataStore.getAt(rowIndex).data.description;
            		}
        		}
        	}
          metaData.attr = "title='" + value + "'";
          return value;
        },
        isTaskOwner: function(data){
        	return (data.agentName == $W().agentName)
        },
        isTaskEditable: function(data){
        	//if the task is marked as not editable, exit immediately
        	if (!data.editable){
        		return false;
        	}
        	return _this.isTaskOwner(data) || editFellowTeamMemberTasksPrivileged;
        },
        createToolBar: function() {
        	
        	
        	//Refresh button
        	this.btnRefresh = new Ext.Toolbar.Button({
                  text:_this.utils.getLocalizationValue('application.javascript.taskManager.button.refresh'),
                  id:'btnRefresh',
                  handler:this.doRefresh
                });
                
        	//Add task button
        	 this.btnAddTask = new Ext.Toolbar.Button({
                  text:_this.utils.getLocalizationValue('application.javascript.taskManager.button.add'),
                  id:'btnAdd',
                  handler:this.doAddTask
                });
            this.btnReassign = new Ext.Toolbar.Button({
                text:'Reassign',
                id:'btnRea',
                handler:this.doReassign
              });
            
            this.btnAddToGroup = new Ext.Toolbar.Button({
                text:'Add to group',
                id:'btnGroup',
                handler:this.doAddToGroup
              });
            
            //Delete task button   
            this.btnDeleteTasks = new Ext.Toolbar.Button({
                 text:getLocalizationValue('application.javascript.taskManager.button.delete'),
                 id:'btnDeleteTasks',
                 handler:this.doDeleteTasks
               });
            // Delete all tasks button
            this.btnDeleteAllTasks = new Ext.Toolbar.Button({
                 text:getLocalizationValue('application.javascript.taskManager.button.deleteAll'),
                 id:'btnDeleteAllTasks',
                 handler:this.doDeleteAllTasks
               });
             
            
        	var len=_this.tbar.length;
        	var i=0;
        	var btnArray = [];
        	
        	for( i=0; i<len; i++) {
        		 if (_this.tbar[i].btnId == "btnDeleteAllTasks" &&_this.tbar[i].visible ) {
        			this.btnDeleteAllTasks.setText(_this.utils.getLocalizationValue(_this.tbar[i].btnLocaleText));
        			btnArray.push(this.btnDeleteAllTasks);
        			btnArray.push({xtype: 'tbseparator'});
        		} else if (_this.tbar[i].btnId == "btnDeleteTasks" &&_this.tbar[i].visible ) {
        			this.btnDeleteTasks.setText(_this.utils.getLocalizationValue(_this.tbar[i].btnLocaleText));
        			btnArray.push(this.btnDeleteTasks);
        			btnArray.push({xtype: 'tbseparator'});
        		}  else if (_this.tbar[i].btnId == "btnGroup" &&_this.tbar[i].visible ) {
        			this.btnAddToGroup.setText(_this.utils.getLocalizationValue(_this.tbar[i].btnLocaleText));
        			btnArray.push(this.btnAddToGroup);
        			btnArray.push({xtype: 'tbseparator'});
        		}  else if (_this.tbar[i].btnId == "Reassign" &&_this.tbar[i].visible ) {
        			this.btnReassign.setText(_this.utils.getLocalizationValue(_this.tbar[i].btnLocaleText));
        			btnArray.push(this.btnReassign);
        			btnArray.push({xtype: 'tbseparator'});
        		}  else if (_this.tbar[i].btnId == "btnAdd" &&_this.tbar[i].visible ) {
        			this.btnAddTask.setText(_this.utils.getLocalizationValue(_this.tbar[i].btnLocaleText));
        			btnArray.push(this.btnAddTask);
        			btnArray.push({xtype: 'tbseparator'});
        		}  else if (_this.tbar[i].btnId == "btnRefresh" &&_this.tbar[i].visible ) {
        			this.btnRefresh.setText(_this.utils.getLocalizationValue(_this.tbar[i].btnLocaleText));
        			btnArray.push(this.btnRefresh);
        			btnArray.push({xtype: 'tbseparator'});
        		}
        	}
           //create the grid's toolbar
         	var bar = new Ext.Toolbar(btnArray);
         	return bar;
        },
        doDeleteTasks : function() {
        	var m = _this.grid.getSelectionModel().getSelections();
        	var notEditable = _this.getNonEditableSelectedRowCount();
            if(m.length > 0)
            {
            	var msg; 
            	//some of the task are not editable
            	if (notEditable > 0 ){
            		msg = _this.utils.getLocalizationValue('application.javascript.taskManager.message.delete.contains_not_editable');
            	}else{
            		msg = _this.utils.getLocalizationValue('application.javascript.taskManager.message.delete');
            	}
            	//show a message for the user to confirm
            	Ext.Msg.confirm(_this.utils.getLocalizationValue('application.javascript.taskManager.message.title'), msg, function(btn){
        		    if (btn == 'yes'){
        		    	_this.doDeleteSelectedTasks();
        		    }
        		});
            }
        },
        doDeleteAllTasks: function() {
        	var notEditable = _this.getNonEditableRowCount(false);
        	var msg; 
            	//some of the task are not editable
            	if (notEditable > 0 ){
            		msg = _this.utils.getLocalizationValue('application.javascript.taskManager.message.delete.contains_not_editable');
            	}else{
            		msg = _this.utils.getLocalizationValue('application.javascript.taskManager.message.deleteAll');
            	}
            	Ext.Msg.confirm(_this.utils.getLocalizationValue('application.javascript.taskManager.message.title'), msg, function(btn){
        	    if (btn == 'yes'){
        	    	_this.grid.getSelectionModel().suspendEvents();
	        		_this.deleteAllTasks();
        			_this.grid.getSelectionModel().resumeEvents();
        	    }
        	});
        },
        /*
         * Delete selected tasks
         */
        doDeleteSelectedTasks: function (){
        		
        		var records = _this.grid.getSelectionModel().getSelections();
        		var jsonData = "";
                for(var i = 0, len = records.length; i < len; i++){
                	if (records[i].data.editable){
        				var ss = records[i].get("id");
        				if(i==0)
        	           		jsonData = jsonData + ss ;
        			   	else
        					jsonData = jsonData + "," + ss;	
        				_this.tasksDataStore.remove(records[i]);								
                	}
                }	
                _this.tasksDataStore.load({params:{deletedTasksIds:jsonData, method: "delete"}});	
        		_this.clearTaskDetailsGrid();
        		_this.realizeToolbarButtonsState();
        },
        /**
         *  delete all the tasks
         */
        deleteAllTasks: function() {
        	var counter = _this.grid.getStore().getCount();
        	var jsonData = "";
        	for(var i = 0 ; i< counter; i++) {
        		var record = _this.grid.getStore().getAt(0);
        		var ss = record.get("id");
        		if(i==0)
	           		jsonData = jsonData + ss ;
			   	else
					jsonData = jsonData + "," + ss;	
				_this.tasksDataStore.remove(record);
        		
        	}
        	_this.tasksDataStore.load({params:{deletedTasksIds:jsonData, method: "delete"}});	
    		_this.clearTaskDetailsGrid();
    		_this.realizeToolbarButtonsState();
        },
        loadTasks: function(){
        	//load user friendly name mapping (only if the agentname column is visible)
        	if (!_this.grid.getColumnModel().getColumnById('agentName').hidden){
	        	var pars = 'method=getAgentTeamMembers';
	        	if (_this.agentName != null){
	        		pars += '"&agentName="'+_this.agentName;
	        	}
	    		var request = new Ajax.Request(_this.URL, { method: 'get', parameters: pars, asynchronous : false });
	    		if (request.success()) {
	    			var results = eval("(" + request.transport.responseText + ")");
	    			var total = results.total;
	    			for( i=0; i<total; i++) {
	    				var obj = results.taskData[i];
	    				_this.usernameMapping[obj.name]=obj.displayName;
	    			}
	    		}
        	}
        	_this.tasksDataStore.load( {params: {agentGMTOffset:_this.offset, agentName: _this.agentName, status: Ext.num(_this.statusCB.getValue(), -1), viewMode: Ext.num(_this.viewType.getValue(), 0)} } );
        },
        createTopToolbar: function(){
        	//loadTasksViewModes
        	var viewTypeColumnWidth = .45;
        	_this.viewType = this.createViewModeComboBox();
        	if (!_this.viewType){
        		//dummy combobox so we won't have to check for null everytime
        		_this.viewType = new Ext.form.ComboBox({
        			hideLabel: true
        		});
        		_this.viewType.setVisible(false);
        		viewTypeColumnWidth = .005;//very small
        	}
		    _this.statusCB = this.createStatusComboBox();
		     	    
        	var toolbarForm = new Ext.FormPanel({
    			region: 'north',
        		labelWidth: 60,
                frame: true,
                border: false,
//                bodyStyle: 'padding: 2px 0 0 0',
//                layout: 'fit',
                height: 33,
                minHeight: 33,
                items: [{
                    layout:'column',
                    items:[{
                        columnWidth:viewTypeColumnWidth,
                        layout: 'form',
                        items: [_this.viewType]
                    },{
                        columnWidth:.5,
                        layout: 'form',
                        items: [_this.statusCB]
                    }]
                }]
            });
        	return toolbarForm;
        },
        createStatusComboBox: function(){
        	var statusFilterDataStore = new Ext.data.JsonStore({
				root:'taskData',
				totalProperty: 'total',
				fields:[{name:'id', type:'int'}, {name:'description', type:'string'}],
				url: _this.URL,
				listeners: {
		    		load: function(store) {
				    	var newRecord = new Ext.data.Record({
		                    id: -1,
							description: _this.utils.getLocalizationValue('application.javascript.taskManager.taskStatus.all')
		                });
				    	//insert the new record
				    	store.insert(0, newRecord);
				    	_this.statusCB.setValue(-1);//select the first item by default
                    }
                }
			});
		    
		    var statusCB = new Ext.form.ComboBox({
        	    store: statusFilterDataStore,
        	    displayField:'description',
        	    valueField:'id',
        	    mode: 'local',
        	    name: 'status',
        	    editable: false,
        	    minListWidth: 135,
        	    width: 120,
        	    fieldLabel: _this.utils.getLocalizationValue('application.javascript.taskManager.column.status'),
        	    triggerAction: 'all',
        	    listeners: {
		    		select: function(combo, record, index) {
		    			_this.doRefresh();
                    }
                }
        	});
		    statusFilterDataStore.load({params:{method:'loadStatuses'}});
		    return statusCB;
        },
        createViewModeComboBox: function(){
        	if (this.isTaskManager && viewPrivileged){
        		var viewStore = new Ext.data.JsonStore({
					root:'taskData',
					totalProperty: 'total',
					fields:[{name:'id', type:'int'}, {name:'description', type:'string'}],
					url: _this.URL,
					listeners: {
			    		load: function(store) {
					    	_this.viewType.setValue(0);//select the first item by default
	                    }
	                }
				});
        		viewStore.load({params:{method:"loadTasksViewModes"}});
	
	        	var viewType = new Ext.form.ComboBox({
			        store: viewStore,
			        displayField: 'description',
			        valueField: 'id',
			        editable: false,
			        mode: 'local',
			        triggerAction: 'all',
			        forceSelection: true,
			        selectOnFocus: false,
			        fieldLabel: _this.utils.getLocalizationValue('application.javascript.taskManager.tasksViewMode'),
			        width: 120,
			        minListWidth: 135,
			        listeners: {
			    		select: function(combo, record, index) {
	        				_this.grid.getColumnModel().setHidden(0, _this.viewType.getValue()?_this.viewType.getValue()==0:true);
	        				_this.doRefresh();
	                    }
	                }
			    });
	        	_this.grid.getColumnModel().setHidden(0, true);//by default, hide the 'Agent' column
	        	viewType.setValue(0);//select the first item by default
	        	return viewType;
        	}
        	return null;
        },
        registerCallbackApi: function(){
        	var config = new Object();
        	config.id = 'CallbackWindow';
        	if($W().toolbarItems[config.id] == null){
        		config.tag == "portlet";
        		config.portletTitle = 'application.javascript.agentDisposition.callback';
        		config.modal = true;
        		config.width = 320;
        		config.height = 260;
        		//config.reloadContentOnNextOpen = true;
        		config.enablePortletDragging = true;
        		//config.loadOnLogin = true;//create the window on login so the user won't have to wait when he invoke $W().openCallbackForm
        		config.portletURL = 'SYSTEM/portlets/taskManager/callback.jsp';
        		$W().addToolbarItem(config);
        		$W().toolbarItems[config.id] = config;
        	}
        	$W().openCallbackForm = function(){
        		showPopupWindow(config);
        	}
        }
    });

};

