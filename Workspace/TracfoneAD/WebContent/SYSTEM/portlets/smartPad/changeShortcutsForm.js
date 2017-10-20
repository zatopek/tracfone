function createChangeShortcutsForm(record, freeShortcuts){
	freeShortcuts.push(record.data.paste);
	freeShortcuts.push(record.data.store);
	var sortedShortcuts = freeShortcuts.sort();
	nameField = new Ext.form.TextField({
		id: 'spNameField'
		,fieldLabel: getLocalizationValue('application.javascript.smartpad.tableTitle.name')
		,value: record.data.name
		,disabled: true
		,width: 150
	});
	
	valueField = new Ext.form.TextField({
		id: 'spValueField'
		,fieldLabel: getLocalizationValue('application.javascript.smartpad.tableTitle.value')
		,value: record.data.value
		,disabled: true
		,width: 150
	});
	
	pasteField = new Ext.form.ComboBox({
		id: 'spPasteField'
		,fieldLabel: getLocalizationValue('application.javascript.smartpad.tableTitle.paste')
		,store: sortedShortcuts
		,forceSelection: true
		,value: record.data.paste
		,width: 150
	    ,allowBlank: false
		,mode: 'local'
	    ,editable: false
	    ,triggerAction: 'all'
	    ,validateOnBlur: true
	    ,validator: validateShortcuts
	    //By enabling lazyRender this prevents the combo box
		//from rendering until requested
		,lazyRender: true//should always be true for editor
	});

	storeField = new Ext.form.ComboBox({
		id: 'spStoreField'
		,fieldLabel: getLocalizationValue('application.javascript.smartpad.tableTitle.store')
		,store: sortedShortcuts
		,forceSelection: true
		,value: record.data.store
		,width: 150
	    ,allowBlank: false
		,mode: 'local'
	    ,editable: false
	    ,disabled: record.data.disableValueEdit
	    ,triggerAction: 'all'
	    ,validateOnBlur: true
	    ,validator: validateShortcuts
	    //By enabling lazyRender this prevents the combo box
		//from rendering until requested
		,lazyRender: true//should always be true for editor
	});
	
		btnChangeShortcutOK = new Ext.Button({
			id: 'btnChangeShortcutOK'
			,formBind: true
			,text: getLocalizationValue('application.javascript.smartpad.table.shortcutsWindow.button.change')
			,handler: function(){
				onChangeShortcutsOK(record);
			}
		});
		
		btnChangeShortcutCancel = new Ext.Button({
			id: 'btnChangeShortcutCancel'
			,text: getLocalizationValue('application.javascript.smartpad.table.shortcutsWindow.button.cancel')
			,handler: function(){
				onChangeShortcutsCancel();
			}
		});
	
	var changeShortcutsForm = new Ext.form.FormPanel({
		frame: true
		,defaultType: 'textfield'
		,monitorValid: true
		,clientvalidation: validateFormState
		,items: [
			nameField
			,valueField
			,pasteField
			,storeField
		]
	});
	
	return changeShortcutsForm;
}

//Validator of shortcuts comboboxes
function validateShortcuts(value){
	if(storeField.getValue() == pasteField.getValue()){
		btnChangeShortcutOK.disable();
		return false; //not valid
	}

	btnChangeShortcutOK.enable();
	//Clearing invalid marks if any
	storeField.clearInvalid();
	pasteField.clearInvalid();
	return true;
}

//Client notifier for form validation. Gets form itself and valid state. 
function validateFormState(form, valid){
	if(valid){
		btnChangeShortcutOK.enable();
	}else{
		btnChangeShortcutOK.disable();
	}
}
