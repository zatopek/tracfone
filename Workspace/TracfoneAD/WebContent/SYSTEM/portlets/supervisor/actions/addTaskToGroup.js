loadAddTaskToGroup = function() {

Ext.ns("Jacada.task");

/**
 * Static data for all instances of Jacada.task.addTaskToGroupAction
 */
var allGroups = null;

Jacada.task.addTaskToGroupAction = Ext.extend(Jacada.task.addTaskAction,{
	
		url:null,
		utils: new Jacada.task.TaskUtils(),
		groupCombo: null,
		allGroups: null,
		
		constructor: function(url, agentName,reminderDataStore, taskDataStore){
			Jacada.task.addTaskToGroupAction.superclass.constructor.call(this, url, agentName, reminderDataStore,taskDataStore);
			if ( null == allGroups) {
				allGroups = [];
				var len=groups.length;
				var i=0;
				for( i=0; i<len; i++) {
					rec = [];
					rec.push(groups[i]);
					allGroups.push(rec);
				}
			}
		},
		createForm: function() {
			var _this = this;
    		//	_this.reminderDataStore.load({params:{method:'loadSReminders'}});
           _this.createDateEditor();
           _this.createDescription();
           _this.createReminders();
           _this.createGroupCombo();	
            	
   
        
                //call the future validator on taskManager.js
                function futureValidator(value){
                	return _this.utils.validateFutureDate(value, _this.dueDateEditorField);
                }
                
            	
            	var addTaskForm = new Ext.FormPanel({
                    labelWidth: 75, // label settings here cascade unless overridden
                    frame:true,
                    width: 300,
                    height: 120,
                    defaultType: 'textfield',
                    items: [
                        _this.descriptionField
                        ,_this.dueDateEditorField
                        ,_this.remindersCBField,
                        _this.groupCombo
                    ]

                });
            	return addTaskForm;
		},
		createGroupCombo: function() {
			var rt = Ext.data.Record.create([
			                                 {name: 'name'}
			                             ]);
			
			this.groupCombo = new Ext.form.ComboBox({
				
        	    store: new Ext.data.Store({
        	    	reader: new Ext.data.ArrayReader(
        	    	        {
        	    	            idIndex: 0  // id for each record will be the first element
        	    	        },
        	    	        rt ),
                  
                    data : allGroups 
                }),
                valueField:'name',
                displayField:'name',
                typeAhead: true,
                mode: 'local',
                fieldLabel:this.utils.getLocalizationValue('application.javascript.supervisor.task.addtogroup.label'),
                triggerAction: 'all',
                emptyText: this.utils.getLocalizationValue('application.javascript.supervisor.task.addtogroup.text'),
                selectOnFocus:true,
             	allowBlank: false,
                width:190,
                //WS-2472 No error message on invalid group insertion
                valueNotFoundText : this.utils.getLocalizationValue('application.javascript.supervisor.task.addtogroup.text')
        	});
		},
        doAction: function(values, parent) {
        	var _this = this;
        	var jsonValue = Ext.util.JSON.decode(values);
        	var agentTaskVal = {};
        	agentTaskVal.dueDateMilliseconds = jsonValue.dueDateMilliseconds;
        	agentTaskVal.reminderInMinutes = jsonValue.reminderInMinutes;
        	agentTaskVal.description = jsonValue.description;
        	values = Ext.util.JSON.encode(agentTaskVal);
        	
        	var conn = new Ext.data.Connection();
	        conn.request({
	            url: _this.url,
	            method: 'POST',
	            params: { method: "addToGroup", agentTask: values, agentGMTOffset:_this.offset, targetGroup: jsonValue.targetGroup},
	            success: function(responseObject) {
	            	//not required, the server already sends push message
	            	//parent.doRefresh();
	             },
	             failure: function(r,a,b) {
	    	         Ext.Msg.alert(this.utils.getLocalizationValue('application.javascript.supervisor.task.reassign.failure'));
	             }
	        });
        	
        	//this.actionStore.load( {params: { method: "addToGroup", agentTask: values, agentGMTOffset:_this.offset, targetGroup: jsonValue.targetGroup } });
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
        	formValues.targetGroup = _this.groupCombo.getValue();
        	return formValues;
        },
        
        //WS-2472 No error message on invalid group insertion
        getErrorMessage: function(form){
        	var msg = Jacada.task.addTaskToGroupAction.superclass.getErrorMessage(form);
        	form.groupCombo.setValue(form.groupCombo.getRawValue());
        	//If the inserted name is not valid than the rawValue will be empty after executing setValue() 
        	if(form.groupCombo.getRawValue() == ""){
        		msg += "<br>"+form.groupCombo.fieldLabel;
        	}
         	return msg;
        }
	});
};
