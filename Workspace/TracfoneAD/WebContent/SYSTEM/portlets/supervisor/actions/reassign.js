loadReassign = function() {


Ext.ns("Jacada.task");
Jacada.task.ReassignTaskAction = Ext.extend(Object,{
		name: null,
		url:null,
		taskId: null,
		utils: new Jacada.task.TaskUtils(),
		
		constructor: function(agentName, url, taskId){
		   this.name = agentName;
		   this.url= url;
		   this.taskId = taskId;
		},
		perform: function(parent) {
			var _this = this;
			var fields = getAllUsersFromCurrentGroup();
			
			var rt = Ext.data.Record.create([
			                                 {name: 'name'},
			                                 {name: 'ufn'}
			                             ]);
			descriptionField = new  Ext.form.Label({
				text: this.utils.getLocalizationValue('application.javascript.supervisor.task.reassign.description'),
                name:'description',
                cls: 'x-form-item-label',
                width:250
        	});
			 
			pnlDescription = new Ext.Panel({
				  bodyStyle : "padding:0px 0px 10px 0px'",
				  frame: false,
				  border: false,
				  cls: 'x-form-item',
				  items: [descriptionField]
				});
			
        	toAgentCombo = new Ext.form.ComboBox({
        	    store: new Ext.data.Store({
        	    	reader: new Ext.data.ArrayReader(
        	    	        {
        	    	            idIndex: 0  // id for each record will be the first element
        	    	        },
        	    	        rt ),
                  
                    data : fields,
                    sortInfo:{field: 'name', direction: "ASC"}
                }),
                valueField:'name',
                displayField:'ufn',
                typeAhead: true,
                fieldLabel: this.utils.getLocalizationValue('application.javascript.supervisor.task.reassign.select.field'),
                mode: 'local',
                triggerAction: 'all',
                emptyText:this.utils.getLocalizationValue('application.javascript.supervisor.task.reassign.select'),
                selectOnFocus:true,
             	allowBlank: false,
                width:190,
                //WS-2609:
                valueNotFoundText : this.utils.getLocalizationValue('application.javascript.supervisor.task.reassign.select')
        	});
        	 reassignForm = new Ext.FormPanel({
                labelWidth: 75, // label settings here cascade unless overridden
                frame:true,
                width: 300,
                items: [
                        pnlDescription,
                        toAgentCombo
                ]

            });
        	
        	reassignWin = new Ext.Window({
                layout      : 'fit',
                width       : 300,
                height      : 190,
                resizable 	: false,
                closeAction :'close',
                modal : true,
                title: this.utils.getLocalizationValue('application.javascript.supervisor.task.reassign.title'),
                items:[reassignForm],
                buttons: [{
                    text     : this.utils.getLocalizationValue('application.javascript.supervisor.task.reassign.action.reassign'),
                    handler  : function(){
                        reassign();
                    }
                    
                },{
                    text     : this.utils.getLocalizationValue('application.javascript.supervisor.task.reassign.action.cancel'),
                    handler  : function(){
                    	//hide the window if the user canceled
                		reassignWin.hide();
                    }
                }]
            });
            
			reassignWin.on('show', function(window) {
				reassignWin.center();
            	//clear the fields in the form
				reassignForm.getForm().reset();
            	//set default values
			});
            
            function reassign() {
            	//WS-2609: Validate the agent's name
            	toAgentCombo.setValue(toAgentCombo.getRawValue());
            	//If the inserted name is not valid than the rawValue will be empty after executing setValue() 
            	if(toAgentCombo.getRawValue() == ""){
            		Ext.Msg.alert(getLocalizationValue('application.javascript.supervisor.task.reassign.title'), getLocalizationValue('application.javascript.supervisor.task.reassign.alert'));
            		return;
            	}
            	
            	
            	var form = reassignForm.getForm();
            	
            	
            	var formValues = form.getValues();
            	//take the value(id) from the combobox
            	//because we cannot use the text as an identifier to save in the database
            	formValues.agentName = toAgentCombo.getValue();
            	formValues.taskId = _this.taskId;
            	//convert to json
				var values = Ext.util.JSON.encode(formValues);
				var conn = new Ext.data.Connection();
		        conn.request({
		            url: _this.url,
		            method: 'POST',
		            params: { method: "reassignTask", agentName: toAgentCombo.getValue(), taskId: _this.taskId},
		            success: function(responseObject) {
		            	parent.doRefresh();
		             },
		             failure: function(r,a,b) {
		    	         Ext.Msg.alert(this.utils.getLocalizationValue('application.javascript.supervisor.task.reassign.failure'));
		             }
		        });
				reassignWin.hide();
			}
            reassignWin.show();
        	
		}
	});

};