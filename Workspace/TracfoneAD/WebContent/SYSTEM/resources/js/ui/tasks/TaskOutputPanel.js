Ext.define('Jacada.system.ui.tasks.TaskOutputPanel', {
	extend: 'Ext.form.Panel',

	ID_SEPARATOR: '/',
	REQUIRED: '<span class="task-output-field-required" data-qtip="Required">*</span>',
	taskOutput: null,
	metadata: null,
	task: null,
	border: false,
	bodyPadding: 5,
	fieldDefaults: {
	       labelWidth: 180
	   },
    itemId: 'taskOutputPanel',
    columnWidth: 0.5,
	
	initComponent: function() {
	  var me = this;
	  me.callParent(arguments);
	},
	/*
	 * taskOutputInfo.data has the same format as for input panel.
	 * See example in TaskInputPanel.js
	 * 
	 * taskOutputInfo.metadata example at the bottom of the file.
	 */
	updateOutputPanel: function(taskOutputInfo, task){
		this.taskOutput = taskOutputInfo.data;
		this.metadata = taskOutputInfo.metadata;
		this.task = task;
		
		//Clear old structures
		this.removeAll(true);
		
		//Generate UI
		var items = [];
		var childConfig = null;
		if(this.metadata.complex){
			childConfig = this.generateComplexField(this.metadata, task.taskId);
			items.push(childConfig);
		}else{
			childConfig = this.generateSimpleField(this.metadata, task.taskId);
			items.push(childConfig);
		}
		if(items.size() > 0){
			this.add(items);
		}
		
		//Fill values if exist
		if(taskOutputInfo.data){
			this.populateOutputValues(taskOutputInfo.data, task.taskId, 1);
		}
		
	},
	
	//field - field properties used to create ExtJS config for FieldSet.
	//idPrefix - prefix that should be used as prefix in field's id
	generateComplexField: function(field, idPrefix){
		var config = this.getComplexFieldConfig(field, idPrefix, 0);
		if(field.maxOccurs > 1){
			//Changing field id to have array brackets
			var panelConfig = this.getRepeatablePanelConfig(idPrefix, field, config);
			
			config = panelConfig;
		}
		return config;
	},
	
	//field - field properties used to create ExtJS config
	//idPrefix - prefix that should be used as prefix in field's id
	generateSimpleField: function(field, idPrefix){
		var config = this.getSimpleFieldConfig(field, idPrefix);
		if(field.maxOccurs > 1){
			//Changing field id to have array brackets
			var panelConfig = this.getRepeatablePanelConfig(idPrefix, field, config);
			
			config = panelConfig;
		}
		
		return config;
	},
	
	getRepeatablePanelConfig: function(idPrefix, field, childConfig){
    	var me = this;
		var childId = idPrefix + this.ID_SEPARATOR + field.name;
		var wrapperId = childId + 'Repeatable';
		var toolbar = Ext.create('Ext.toolbar.Toolbar', {
			frame: false,
			border: false,
			style: {
				background: 'none !important;'
			},
			items: [
		       {
		    	   //Button add one field the panel
		    	   xtype: 'button',
		    	   id: wrapperId + 'AddBtn',
		    	   scope: this,
		    	   text: me.getLocalizedValue('output.repeatable.button.add'),
		    	   disabled: !Ext.getCmp('taskBoard').allowEdit(this.task),
		    	   handler: function(){
		    		   this.addRepeatableField(wrapperId);
		    	   }
		       },
		       {
		    	   //Button removes last field from the panel
		    	   xtype: 'button',
		    	   id: wrapperId + 'RemoveBtn',
		    	   text: me.getLocalizedValue('output.repeatable.button.remove'),
		    	   scope: this,
		    	   disabled: true,
		    	   handler: function(){
		    		   this.removeRepeatableField(wrapperId);
		    	   }
		       }
			]
		});
		var panelConfig = {
				lastFieldIndex: (field.minOccurs > 0)?field.minOccurs:1,
				fieldMetadata: field,
				idPrefix: idPrefix,
				id: wrapperId,
				xtype: 'panel',
				header: false,
				bbar: toolbar
		};
		
		panelConfig.items = [childConfig];

		//Must create minimal number of fields
		var clone = null;
		for(var i = 2; i <= field.minOccurs; i++){
			if(field.complex){
				//complex type repeatable
				//Can't clone since complex type has array inside (members)
				clone = this.getComplexFieldConfig(field, childId, i);
			}else{
				//simple type repeatable
				//safe to clone and change id
				clone = Object.clone(childConfig);
				clone.id = childId + '[' + i + ']';
				clone.name = childId + '[' + i + ']';
			}
			panelConfig.items.push(clone);
		}
		return panelConfig; 
	},
	
	getSimpleFieldConfig: function(field, idPrefix){
		var id = idPrefix + this.ID_SEPARATOR + field.name;
		var config = {
				xtype: this.convertSchemaToFieldType(field.type),
				id: id,
				labelWidth: 150,
				labelPad: 20,
				labelCls: 'task-output-field-label',
				disabled: !Ext.getCmp('taskBoard').allowEdit(this.task),
				name: id.substring(this.task.taskId.length),
				fieldLabel: Jacada.Utils.getPrettyLabel(field.name)
		};
		if(field.minOccurs > 0 && !field.nillable){
			config.allowBlank = false;
			config.afterLabelTextTpl = this.REQUIRED;
		}
		config = this.applyCustomConfig(field, config);
		return config;
	},
	getComplexFieldConfig: function(field, idPrefix, index){
		var me = this;
		var fieldSetId = idPrefix + this.ID_SEPARATOR + field.name;
		if(index > 1){
			fieldSetId += '[' + index + ']';
		}
		var fieldSetConfig = {
			xtype: 'fieldset',
			id: fieldSetId,
			title: '<span class="task-output-group-label">' + Jacada.Utils.getPrettyLabel(field.name) + '</span>',
			bodyPadding: 5,
	        layout: 'anchor',
	        defaults: {anchor: '100%'}
	    };
		fieldSetConfig.items = [];
		if(field.members){
			var childConfig = null;
			field.members.each(function(member){
				if(member.complex){
					childConfig = me.generateComplexField(member, fieldSetId);
					fieldSetConfig.items.push(childConfig);
				}else{
					childConfig = me.generateSimpleField(member, fieldSetId);
					fieldSetConfig.items.push(childConfig);
				}
			});
		}
		return fieldSetConfig;
	},
	
	//Returns ExtJS field xtype according to received schema type
	convertSchemaToFieldType: function(schemaType){
		schemaType = schemaType.toLowerCase();
		var xtype = 'textfield'; //default if not found
		if(schemaType == 'string'){
			xtype = 'textfield';
		}else if(schemaType == 'boolean'){
			xtype = 'checkbox';
		}else if(schemaType == 'date'){
			xtype = 'datefield';
		}else if(schemaType == 'time'){
			xtype = 'timefield';
		}else if(schemaType.indexOf('integer') != -1 || schemaType.indexOf('int') != -1
			|| schemaType.indexOf('short') != -1 || schemaType.indexOf('byte') != -1
			|| schemaType.indexOf('long') != -1
			|| schemaType == 'decimal' || schemaType == 'float' || schemaType == 'double'){
			xtype = 'numberfield';
		}else if(schemaType == 'options'){
			xtype = 'combobox';
		}
		return xtype;
	},
	
	applyCustomConfig: function(field, config){
		//datetime - need to build combination of two fields - date and time
		
		var type = field.type.toLowerCase(); 
		if(type == 'options'){
			var store = Ext.create('Ext.data.ArrayStore', {
				fields: ['optionValue'],
				data: field.values,
    			proxy: {
    				type: 'memory',
    				reader: {
    					type: 'array'
    				}
    			}
			});
			config.store = store;
			config.forceSelection = true;
			config.queryMode = 'local';
			config.displayField = 'optionValue';
			config.valueField = 'optionValue';
			return config;
		}
		if(type == 'time'){
			config.format = "H:i:s";
			return config;
		}
		if(type == 'date'){
			config.format = "Y-m-d";
			config.altFormat = "m/d/Y|m/d/y|d/m/y|d/m/Y|Y/m/d|y/m/d";
			return config;
		}
		if(type == 'boolean'){
			config.uncheckedValue = 'false';
			config.inputValue = 'true';
			return config;
		}
		
		//number configurations
		if(type.indexOf('integer') != -1 || type.indexOf('int') != -1
			|| type.indexOf('short') != -1 || type.indexOf('byte') != -1
			|| type.indexOf('long') != -1
			|| type == 'decimal' || type == 'float' || type == 'double'){
			
			//If double, float or decimal, allow decimals,
			//otherwise not
			if(type.indexOf('double') != -1 || type.indexOf('float') != -1 || type.indexOf('decimal') != -1){
				config.allowDecimals = true;
				//nothing else to set, returning object
				return config;
			}
			config.allowDecimals = false;

			
			//no need to configure int, integer, long
			if(type == 'byte'){
				config.minValue = -128;
				config.maxValue = 127;
			}else if(type == 'short'){
				config.minValue = -32768;
				config.maxValue = 32767;
			}else if(type == 'unsignedbyte'){
				config.minValue = 0;
				config.maxValue = 255;
			}else if(type == 'unsignedshort'){
				config.minValue = 0;
				config.maxValue = 65535;
			}else if(type == 'unsignedint' || type == 'unsignedlong'){
				config.minValue = 0;
			}else if(type == 'nonnegativeinteger'){
				config.minValue = 0;
			}else if(type == 'nonpositiveinteger'){
				config.maxValue = 0;
			}else if(type == 'negativeinteger'){
				config.maxValue = -1;
			}else if(type == 'positiveinteger'){
				config.minValue = 1;
			}
		}
		return config;
	},
	
	addRepeatableField: function(parentId){
		var parentPanel = Ext.getCmp(parentId);
		if(parentPanel != null){
			var field = parentPanel.fieldMetadata;
			var idPrefix = parentPanel.idPrefix;
			if(parentPanel.lastFieldIndex < field.maxOccurs){
				parentPanel.lastFieldIndex++;
				var childConfig;
				if(field.complex){
					childConfig = this.getComplexFieldConfig(field, idPrefix, parentPanel.lastFieldIndex);
				}else{
					childConfig = this.getSimpleFieldConfig(field, idPrefix);
					childConfig.id += '[' + parentPanel.lastFieldIndex +']';
					childConfig.name += '[' + parentPanel.lastFieldIndex +']';
				}
				parentPanel.add(childConfig);
				Jacada.Logger.debug("New child field was added. id: " + childConfig.id + ", parentId: " + parentId);
				//if we reached maximum, disable "add" button
				if(parentPanel.lastFieldIndex == field.maxOccurs){
					var addBtn = Ext.getCmp(parentId + 'AddBtn');
					addBtn.disable();
				}
				//enable "remove" button, if allowed
				if(Ext.getCmp('taskBoard').allowEdit(this.task)){
					var removeBtn = Ext.getCmp(parentId + 'RemoveBtn');
					removeBtn.enable();
				}
			}
		}else{
			Jacada.Logger.error("Could not find parent panel. parentId: " + parentId
					+ ", idPrefix:" + idPrefix);
		}
	},
	
	removeRepeatableField: function(parentId){
		var parentPanel = Ext.getCmp(parentId);
		if(parentPanel != null){
			var field = parentPanel.fieldMetadata;
			//if lastFieldIndex == 1, we don't want to delete last field
			if(parentPanel.lastFieldIndex > field.minOccurs && parentPanel.lastFieldIndex != 1){
				var childId = parentId.replace('Repeatable','') + '[' + parentPanel.lastFieldIndex + ']';
				var childCmp = parentPanel.remove(childId, true);
				parentPanel.lastFieldIndex--;
				Jacada.Logger.debug("Child was removed. id: " + childId + ", parentId: " + parentId + ", chidlCmp: " + childCmp);
				
				if(parentPanel.lastFieldIndex == field.minOccurs || parentPanel.lastFieldIndex == 1){
					//disable "remove" button
					var removeBtn = Ext.getCmp(parentId + 'RemoveBtn');
					removeBtn.disable();
				}
				//enable add button
				var addBtn = Ext.getCmp(parentId + 'AddBtn');
				addBtn.enable();
			}
		}else{
			Jacada.Logger.error("Could not find parent panel. parentId: " + parentId);
		}
	},
	
	/**
	 * Sets fields values into pre-built structure
		{"name":"loanApprovalResponse","complex":true,
			"members":[
				{"name":"responseToLoanRequest","complex":false,"value":"declined"},
				{"name":"responseDescription","complex":false,"value":"ddd"},
				{"name":"responseStrNillable","complex":false,"value":"nnn"},
				{"name":"responseTime","complex":false,"value":"00:15:00"},
				{"name":"responseDate","complex":false,"value":"01/27/14"},
				{"name":"responseInteger","complex":false,"value":"11"},
				{"name":"responseDecimal","complex":false,"value":"22.22"},
				{"name":"responseShort","complex":false,"value":"33"},
				{"name":"responseShort","complex":false,"value":"44"},
				{"name":"responseShort","complex":false,"value":"55"},
				{"name":"responseDouble","complex":false,"value":"66.66"},
				{"name":"responsePositiveInteger","complex":false,"value":"77"},
				{"name":"responseInt","complex":false,"value":"88"},
				{"name":"rejectionReason","complex":true,
					"members":[
						{"name":"reason","complex":false,"value":"infoRequired"},
						{"name":"description","complex":false,"value":"fffff"}
					]},
				{"name":"rejectionReason","complex":true,
					"members":[
						{"name":"reason","complex":false,"value":"loanValue"},
						{"name":"description","complex":false,"value":"ggggg"}
					]}
			]
		}	 
	 */	
	populateOutputValues: function(field, idPrefix, index){
		if(!field.name){
			return;
		}
		var fieldId = idPrefix + this.ID_SEPARATOR + field.name;
		var repeatablePanelId;
		if(index != 1){
			repeatablePanelId = fieldId + 'Repeatable';
			fieldId += '[' + index + ']';
		}
		if(field.complex){
			//Verifying that container exists
			//if not, let's build it
			var cmp = Ext.getCmp(fieldId);
			if(cmp == null){
				//if index == 1, we had a problem generating output panel 
				if(index == 1){
					$W().LogManager.getLogger('taskOutput').error("Could not set value of field '" + field.name + "' with id: " + fieldId);
					alert("Could not set value of field '" + field.name + "' with id: " + fieldId);
					return;
				}
				//the complex field belongs to an array and we need to expand it
				this.addRepeatableField(repeatablePanelId);
			}
			var me = this;
			var memberIndex = 1;
			var lastMemberName = '';
			field.members.each(function(member){
				if(lastMemberName != member.name){
					lastMemberName = member.name;
					memberIndex = 1;
				}else{
					memberIndex++;
				}
				me.populateOutputValues(member, fieldId, memberIndex);
			});
		}else{
			var cmp = Ext.getCmp(fieldId);
			if(cmp == null){
				//if index == 1, we had a problem generating output panel 
				if(index == 1){
					$W().LogManager.getLogger('taskOutput').error("Could not set value of field '" + field.name + "' with id: " + fieldId);
					alert("Could not set value of field '" + field.name + "' with id: " + fieldId);
					return;
				}
				//the field belongs to an array and we need to expand it
				this.addRepeatableField(repeatablePanelId);
				cmp = Ext.getCmp(fieldId);
				if(cmp == null){
					$W().LogManager.getLogger('taskOutput').error("Could not set value of field '" + field.name + "' with id: " + fieldId);
					alert("Could not set value of field '" + field.name + "' with id: " + fieldId);
					return;
				}
			}
			cmp.setValue(field.value);
		}
	},
	
	submitTaskOutput: function(){
		var me = this;
		//ExtJs message boxes are asynchronous, non blocking javascript.
		//Thus, we must "show" nested app when message box is closed. 
		$W().HideCurrentVisibleTab();
		if(!this.isValid()){
			Ext.Msg.show({
				title: me.getLocalizedValue('save.title'),
    			msg: me.getLocalizedValue('save.validation.failed'),
    			buttons: Ext.Msg.OK,
    			icon: Ext.Msg.WARNING,
    			fn: function(){$W().ShowCurrentVisibleTab();}
    		});
			return;
		}
		var outputValues = this.getValues();
		$W().outputValues = outputValues;
    	Ext.Ajax.request({
    	    url: $W().contextPath + '/HTManager.json',
    	    method: 'POST',
    		disableCaching: true,
    		params: {
    			method: 'saveTaskOutput',
    			taskId: this.task.taskId,
    			taskName: this.task.taskName,
    			output: Ext.JSON.encode(outputValues)
    		},
    	    success: function(response, opts) {
    	    	var result = Ext.decode(response.responseText).JSONObject;
    	    	if(result.exception){
    	    		Ext.Msg.show({
    					title: me.getLocalizedValue('save.title'),
    	    			msg: result.exception,
    	    			buttons: Ext.Msg.OK,
    	    			icon: Ext.Msg.ERROR,
    	    			fn: function(){$W().ShowCurrentVisibleTab();}
    	    		});
    	    	}else{
    	    		Ext.Msg.show({
    					title: me.getLocalizedValue('save.title'),
    	    			msg: me.getLocalizedValue('save.success'),
    	    			buttons: Ext.Msg.OK,
    	    			fn: function(){$W().ShowCurrentVisibleTab();}
    	    		});
    	    	}
    	    },
    	    failure: function(response, opts) {
    	    	Ext.Msg.show({
    				title: me.getLocalizedValue('save.title'),
	    			msg: me.getLocalizedValue('save.error'),
	    			buttons: Ext.Msg.OK,
	    			icon: Ext.Msg.ERROR,
	    			fn: function(){$W().ShowCurrentVisibleTab();}
	    		});
    	    }
    	});
    	
	},
	getLocalizedValue: function(key){
		return $W().localeManager.getLocalizationValue('application.javascript.tasks.' + key);
	}
});

/*
{"name":"loanApprovalResponse", "complex":true, "xmlns":"http://schemas.active-endpoints.com/sample/LoanRequest/2008/02/loanRequest.xsd", "minOccurs":1, "maxOccurs":"1", "nillable":false,
"members":[
 {"name":"responseToLoanRequest", "complex":false, "xmlns":null, "minOccurs":1, "maxOccurs":"1", "nillable":false, "type":"options", "values":[["approved"],["declined"],["underReview"]]},
 {"name":"responseDescription", "complex":false, "xmlns":null, "minOccurs":0, "maxOccurs":"1", "nillable":false, "type":"string"},
 {"name":"responseStrNillable", "complex":false, "xmlns":null, "minOccurs":1, "maxOccurs":"1", "nillable":false, "type":"string"},
 {"name":"responseTime", "complex":false, "xmlns":null, "minOccurs":0, "maxOccurs":"1", "nillable":false, "type":"time"},
 {"name":"responseDate", "complex":false, "xmlns":null, "minOccurs":0, "maxOccurs":"1", "nillable":false, "type":"date"},
 {"name":"responseInteger", "complex":false, "xmlns":null, "minOccurs":1, "maxOccurs":"1", "nillable":false, "type":"integer"},
 {"name":"responseDecimal", "complex":false, "xmlns":null, "minOccurs":0, "maxOccurs":"1", "nillable":false, "type":"decimal"},
 {"name":"responseShort", "complex":false, "xmlns":null, "minOccurs":0, "maxOccurs":"1", "nillable":false, "type":"short"},
 {"name":"responseDouble", "complex":false, "xmlns":null, "minOccurs":0, "maxOccurs":"1", "nillable":false, "type":"double"},
 {"name":"responsepositiveInteger", "complex":false, "xmlns":null, "minOccurs":0, "maxOccurs":"1", "nillable":false, "type":"positiveInteger"},
 {"name":"responseInt", "complex":false, "xmlns":null, "minOccurs":0, "maxOccurs":"1", "nillable":false, "type":"int"},
 {"name":"rejectionReason", "complex":true, "xmlns":null, "minOccurs":0, "maxOccurs":"1", "nillable":false,
  "members":[
   {"name":"reason", "complex":false, "xmlns":null, "minOccurs":0, "maxOccurs":"1", "nillable":false, "type":"options", "values":[["lowCredit"],["loanValue"],["infoRequired"]]},
   {"name":"description", "complex":false, "xmlns":null, "minOccurs":0, "maxOccurs":"1", "nillable":false, "type":"string"}
 ]}

]}
*/