

loadAddTask = function() {
Ext.ns("Jacada.task");

Jacada.task.addTaskAction = Ext.extend(Object,{
	
		url:null,
		groupName: null,
		utils: new Jacada.task.TaskUtils(),
		reminderDataStore:null,
		taskDataStore:null,
		agentName:null,
		descriptionField: null,
		remindersCBField: null,
		dueDateEditorField:null,
		actionStore: null,
		
		
		constructor: function(url, agentName,reminderDataStore, taskDataStore){
		   Jacada.task.addTaskAction.superclass.constructor.call(this);
		   this.url= url;
		   this.taskDataStore = taskDataStore;
		   this.reminderDataStore = reminderDataStore;
		   this.agentName = agentName;
		   this.offset  = $W().agentGMToffset;
		},
		perform: function(parent) {
			var _this = this;
        	var addTaskForm = this.createForm();
        	
        	addTaskWindow = new Ext.Window({
                layout      : 'fit',
                width       : 300,
                //height      : 50,
                resizable 	: false,
                shadow		: false,
                closeAction :'close',
                modal : true,
                title: _this.utils.getLocalizationValue('application.javascript.taskManager.addTaskDialog.title'),
                items:[addTaskForm],
                buttons: [{
                    text     : _this.utils.getLocalizationValue('application.javascript.taskManager.addTaskDialog.add'),
                    handler  : function(){
                	_this.addTask(addTaskForm, addTaskWindow);
                    }
                    
                },{
                    text     : _this.utils.getLocalizationValue('application.javascript.taskManager.addTaskDialog.cancel'),
                    handler  : function(){
                    	//close the window if the user canceled
                        addTaskWindow.close();
                    }
                }]
            });
            
            addTaskWindow.on('show', function(window) {
            	addTaskWindow.center();
            	_this.setFormDefaultValues();
			});
            
            addTaskWindow.show();
        	
		},
		setFormDefaultValues: function(){
			var _this = this;
			//set default values
			var date = new Date();
    		date.setDate(date.getDate()+1); //tomorrow
    		_this.dueDateEditorField.setValue(date);
    		//for some reason, the form shows validation error
    		//although the form is valid.
    		//call validate to fix this issue 
    		_this.dueDateEditorField.validate();
    		_this.remindersCBField.setValue(0);
		},
		addTask: function(addTaskForm, addTaskWindow, taskData) {
			var _this = this;
        	//WS-605 
        	//first update the fields with the latest value
        	_this.dueDateEditorField.updateDate();   
        	_this.dueDateEditorField.updateTime();
        	_this.dueDateEditorField.updateHidden();
        	
        	var form = addTaskForm.getForm();
        	if(!_this.validateForm(form)){
        		return;
        	}
        	
        	var formValues = _this.getFormValues(form);
        	//convert to json
			var values = Ext.util.JSON.encode(formValues);
        	_this.actionStore = new Ext.data.JsonStore({
        		root: 'actions',
              totalProperty: 'total',
              fields: [ 
              {name: 'id'},
              {name: 'name', type: 'string'}

            ],
            url: _this.url,
            //init order by status
            sortInfo:{field: 'status', direction: "ASC"}
          });
        	
	     _this.doAction(values, parent, taskData);
			//hide the window after task creation
	     addTaskWindow.hide();
		},
		 /*
         * Validate all fields in the form
         * and shows a popup if not valid 
         */
        validateForm: function (form){
        	var _this = this;
        	var errorMsg = _this.getErrorMessage(_this);
        	if(errorMsg == ""){
        		return true;
        	}
        	var msg = _this.utils.getLocalizationValue('application.javascript.taskManager.addTaskDialog.validation.msg');
        	msg += "<center>";
        	msg += errorMsg;
        	Ext.Msg.show({
        		   title:_this.utils.getLocalizationValue('application.javascript.taskManager.addTaskDialog.validation.title'),
        		   msg: msg,
        		   buttons: Ext.Msg.OK,
        		   maxWidth: 250,
        		   width: 250
        		});
        	return false;
        },
        
        getErrorMessage: function(form){
        	var msg = "";
         	if(!form.descriptionField.isValid()){
         		msg += form.descriptionField.fieldLabel;
         	}
         	if(!form.dueDateEditorField.isValid()){
         		msg += "<br><br>"+ form.dueDateEditorField.fieldLabel;
         	}
         	if(!form.remindersCBField.isValid()){
         		msg += "<br><br>"+form.remindersCBField.fieldLabel;
         	} 
         	return msg;
        },
        
        createForm: function() {
        	var _this = this;
    	   _this.reminderDataStore.load({params:{method:'loadSReminders'}});
           _this.createDateEditor();
           _this.createDescription();
           _this.createReminders();

            	
        	var addTaskForm = new Ext.FormPanel({
                labelWidth: 75, // label settings here cascade unless overridden
                frame:true,
                width: 300,
                height: 100,
                defaultType: 'textfield',
                items: [
                    _this.descriptionField
                    ,_this.dueDateEditorField
                    ,_this.remindersCBField
                ]
            });
        	
        	return addTaskForm;
        },
        createReminders: function() {
        	var _this = this;
        	_this.remindersCBField = new Ext.form.ComboBox({
        	    store: _this.reminderDataStore,
        	    displayField:'description',
        	    valueField:'id',
        	    name: 'reminderInMinutes',
        	    mode: 'local',
        	    allowBlank: false,
        	    width: 120,
        	    fieldLabel: _this.utils.getLocalizationValue('application.javascript.taskManager.column.reminder'),
        	    editable: false,
        	    triggerAction: 'all'
        	});
        },
        createDateEditor: function() {
        	var _this = this;
        	
            //call the future validator on taskManager.js
            function futureValidator(value){
            	return _this.utils.validateFutureDate(value, _this.dueDateEditorField);
            }
            
        	_this.dueDateEditorField = new Ext.ux.form.DateTime({
                fieldLabel: _this.utils.getLocalizationValue('application.javascript.taskManager.column.dueDate'),
                dateFormat: TASK_DATE_FORMAT,
                dateConfig: {allowBlank: false,validator:this.futureValidator ,minValue:new Date().clearTime()},
                timeConfig: {allowBlank: false, increment: 30 /*,minValue:new Date().clearTime()*/},
                timeFormat: TASK_TIME_FORMAT,
                hiddenFormat:'m-d-Y H:i',
                dateWidth:100,
                timeWidth:80,
                width: 180,
                name: 'dueDateMilliseconds'
            });
        },
        createDescription: function() {
        	var _this = this;
        	_this.descriptionField = new Ext.form.TextField({
        		fieldLabel: _this.utils.getLocalizationValue('application.javascript.taskManager.column.description'),
                allowBlank:false,
                width: 180,
                name:'description'	
        	});
        },
        doAction: function(values, parent, data) {
        	var _this = this;
        	var conn = new Ext.data.Connection();
	        conn.request({
	            url: _this.url,
	            method: 'POST',
	            params: { method: "add", agentTask: values, agentGMTOffset:_this.offset, taskData:Ext.util.JSON.encode(data)},
	            success: function(responseObject) {
	            	//not required, the server already sends push message
	            	//parent.doRefresh();
	             },
	             failure: function(r,a,b) {
	    	         Ext.Msg.alert(this.utils.getLocalizationValue('application.javascript.supervisor.task.reassign.failure'));
	             }
	        });
        	//this.actionStore.load( {params: { method: "add", agentTask: values, agentGMTOffset:_this.offset}});
        },
        getFormValues: function(form) {
        	var _this = this;
        	var formValues = form.getValues();
        	//take the value(id) from the combobox
        	//because we cannot use the text as an identifier to save in the database
        	formValues.reminderInMinutes = _this.remindersCBField.getValue();
        	if (formValues.reminderInMinutes.length == 0){
        		formValues.reminderInMinutes = 0;
        	}
        	//format the date retrieved from the calendar component
        	formValues.dueDateMilliseconds = _this.dueDateEditorField.getValue().getTime();
        	formValues.agentName = _this.agentName
        	return formValues;
        }
        
	});

};