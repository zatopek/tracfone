var transferColumnId = "spTransfer";
var transferDataIndex = "transfer";
var pasteColumnId = "spPaste";
var pasteDataIndex = "paste";
var storeColumnId = "spStore";
var storeDataIndex = "store";
var nameColumnId = "spName";
var nameDataIndex = "name";
var valueColumnId = "spValue";
var valueDataIndex = "value";

var smartPadGrid;
var selectionModel;
var definedShortcuts = new Hash();
var availableShortcuts = new Hash();
var transferColumn;
var columnModel;
var shortcutsLoaded = false;

function updateShortcutsInActiveX(){
	smartPadGrid.getView().refresh();
	clearAllEntriesShortcuts();
	
	//Updating shortcuts
	definedShortcuts = new Hash();
	availableShortcuts = new Hash();
	smartPadShortcutsStore.each(function(record){
		definedShortcuts.set(record.data.display, record);
		availableShortcuts.set(record.data.display, record);
	});
	
	var entriesTemp = new Array();
	var entriesToSave = new Array();

	//Registering shortcuts in the ActiveX
	//If record does not have at least one shortcut assigned
	//or shortcut does not exist it's added to temp array
	smartPadEntriesStore.each(function(record){
		var index = null;
		var isPasteShortcut = false; 
		var isStoreShortcut = false;
		var isShortcutRemoved = false; 
		
		if (record.data.paste != null && record.data.paste != "") {
			sc = availableShortcuts.unset(record.data.paste);
			if(sc != null){
				index = smartPadEntriesStore.indexOf(record);
				isPasteShortcut = true;
				registerPasteShortcut(index, sc.data.key, sc.data.alt, sc.data.shift, sc.data.ctrl, sc.data.win);
			}else{
				//Shortcut does not exist
				record.data.paste = null;
				isShortcutRemoved = true;
			}
		}
		else {
			entriesTemp.push(record);
		}
		
		//if value field can't be edited, no need in shortcut
		if(!record.data.disableValueEdit){
			if (record.data.store != null && record.data.store != "") {
				sc = availableShortcuts.unset(record.data.store);
				if(sc != null){
					if(index == null){
						index = smartPadEntriesStore.indexOf(record);
					}
					isStoreShortcut = true;
					registerStoreShortcut(index, sc.data.key, sc.data.alt, sc.data.shift, sc.data.ctrl, sc.data.win);
				}else{
					//Shortcut does not exist
					record.data.store = null;
					isShortcutRemoved = true;
				}
			}
			else {
				entriesTemp.push(record);
			}
		}else{
			//We have to act like store shortcut exists for correct registration of shortcuts
			isStoreShortcut = true;
		}

		if(isShortcutRemoved){
			record.commit();
			entriesToSave.push(record.data);
			entriesTemp.push(record);
		}		
		
		//Providing entry value to ActiveX 
		//if there are both shortcuts
		if (isPasteShortcut && isStoreShortcut) {
			verifyRecordSizes(record, entriesToSave);
			updateEntryValue(index, record.data.value); 
		}
	});
	assignShortcutsToEntries(entriesTemp, entriesToSave);
}

//Assigning shortcuts from available ones. 
//If all shortcuts are already assigned, row won't get one
function assignShortcutsToEntries(entriesTemp, entriesToSave){
	if(typeof entriesToSave == "undefined"){
		entriesToSave = new Array();
	}
	var keys = availableShortcuts.keys();
	entriesTemp.each(function(record){
		if(keys.size() == 0){
			return false;
		}
		var isPasteShortcut = false; 
		var isStoreShortcut = false; 
		if (record.data.paste == null || record.data.paste == "") {
			sc = availableShortcuts.unset(keys.pop());
			if(sc != null){
				isPasteShortcut = true;
				record.data.paste = sc.data.display;
				record.commit();
				registerPasteShortcut(smartPadEntriesStore.indexOf(record), 
					sc.data.key, sc.data.alt, sc.data.shift, 
					sc.data.ctrl, sc.data.win);
			}
		}

		//if value field can't be edited, no need in shortcut
		if(!record.data.disableValueEdit){
			//If there no more shortcuts left, no need to proceed.
			if(keys.size() > 0){
				if (record.data.store == null || record.data.store == "") {
					sc = availableShortcuts.unset(keys.pop());
					if (sc != null) {
						isStoreShortcut = true;
						record.data.store = sc.data.display;
						record.commit();
						registerStoreShortcut(smartPadEntriesStore.indexOf(record), 
							sc.data.key, sc.data.alt, sc.data.shift, 
							sc.data.ctrl, sc.data.win);
					}
				}
			}
		}

		//Providing entry value to ActiveX 
		//if there at least one shortcut.
		if (isPasteShortcut || isStoreShortcut) {
			//shortcut was changed, so we need to save the entry
			if(entriesToSave.indexOf(record.data) == -1){
				entriesToSave.push(record.data);
			}
			verifyRecordSizes(record, entriesToSave);
			updateEntryValue(smartPadEntriesStore.indexOf(record), record.data.value); 
		}
	});
	
	entriesTemp.clear();
	if(entriesToSave.size() > 0){
		var params = {
		};
		smartPadEntriesStore.load({
			params: {
				method: 'saveEntries', 
				entries: entriesToSave.toJSON() 
			},
			callback : function(records, options, success){
				synch.savingInProcessOrRequired = false;
				synch.runActiveXUpdate = false;
				smartPadEntriesStore_datachanged(smartPadEntriesStore);
			}
		});
	}else{
		synch.savingInProcessOrRequired = false;
	}
}

function createGrid(){

	//remove entry button
	btnDeleteEntries = new Ext.Toolbar.Button({
		text:getLocalizationValue('application.javascript.smartpad.table.button.deleteEntries')
		,id:'btnDeleteEntries'
		,handler:doDeleteEntries
	});

	//change shortcuts
	btnChangeShortcuts = new Ext.Toolbar.Button({
		text: getLocalizationValue('application.javascript.smartpad.table.button.changeShortcuts')
		,id: 'btnChangeShortcuts'
		,handler: doChangeShortcuts
	});

	//In manual mode no need to show these buttons
	if(!globalPreferences.isInManualMode){ 
		btnSelectAllTranfer = new Ext.Toolbar.Button({
			cls: "x-btn-icon x-grid3-check-col-on"
			,handleMouseEvents: false
			,id: "btnSelectAllTranfer"
			,tooltip: getLocalizationValue('application.javascript.smartpad.table.selectAll')
			,tooltipType: 'title'
			,handler: doSelectAllTransfer
		});
	
		btnUnselectAllTranfer = new Ext.Toolbar.Button({
			cls: "x-btn-icon x-grid3-check-col"
			,handleMouseEvents: false
			,id: "btnUnselectAllTranfer"
			,tooltip: getLocalizationValue('application.javascript.smartpad.table.selectNone')
			,tooltipType: 'title'
			,handler: doUnselectAllTransfer
		});
	}

	var toolbarButtonsArray = [
        btnDeleteEntries //remove selected entry
        ,btnChangeShortcuts //change selected row shortcuts
        ,'->' //spacer
	];
	 
	//In manual mode no need to show these buttons
	if(!globalPreferences.isInManualMode){
		toolbarButtonsArray = toolbarButtonsArray.concat(['-'
	        ,btnUnselectAllTranfer //select all rows as not to be transferred with call
	        ,btnSelectAllTranfer //select all rows to be transferred with call
		]);
	}
	
    //create the grid's toolbar
	var tbar = new Ext.Toolbar(toolbarButtonsArray);
	
	selectionModel = new Ext.grid.RowSelectionModel({singleSelect: false, moveEditorOnEnter: false});
	
	columnModel = createColumnModel();
	
	smartPadGrid = new Ext.grid.EditorGridPanel({
        id: 'smartPadGrid',
        border:false,
        store: smartPadEntriesStore,
        cm: columnModel,
        renderTo: 'smartPadEntriesGridDIV',
        sm: selectionModel,
		enableColumnHide: globalPreferences.hideColumns,
		plugins: transferColumn,
        bbar: tbar
    });
	
	//Do not allow name and value cell edit when disabled
	smartPadGrid.on('beforeedit', function(event){
		if(event.field == nameDataIndex){
			if(event.record.data.disableNameEdit){
				event.cancel = true;
			}else{
				event.cancel = false;
			}
		}else if(event.field == valueDataIndex){
			if(event.record.data.disableValueEdit){
				event.cancel = true;
			}else{
				event.cancel = false;
			}
		}
	});

	//Data was changed, so updating server.
	smartPadGrid.on('afteredit', function(event){
		//If updated cell is Name or Value, 
		//we need to verify the length or stored string
		//and cut it if more then SUPPORTED_SIZE (defined in smartPadManager.js)
		if(event.field == nameDataIndex || event.field == valueDataIndex){
			event.record.set(event.field, verifySupportedSize(event.value));
			//verification of name cell coloring must be done.
			//If Transfer os checked on and name cell value is empty, 
			//the cell must be colored in red.
			if(event.field == nameDataIndex){
				//if name cell is empty and transfer is true, transfer must be unchecked.
				if(!validateNameVsTransfer(event.record, event.record.data.transfer)){
					event.record.data.transfer = false;
				}
			}
		}
		event.record.commit();
		var entry = Ext.util.JSON.encode(event.record.data);
		smartPadEntriesStore.load({params: {method: 'saveEntry', smartPadJSONEntry: entry}});
		checkButtonsState();
		if(event.field == valueDataIndex) {
			updateEntryValue(event.row, event.record.data.value);
		}
	});
	
	smartPadGrid.on('rowclick', function(grid, rowIndex, event){
		checkButtonsState();
	});
	
	smartPadGrid.on('load', function(){
		checkButtonsState();
	});
	
	//define the css class per row
    smartPadGrid.getView().getRowClass = function(record, index) {
		if(record.data.transferred){
			return 'transferredSmartPadEntry'; 
		}
	};
}

function createColumnModel(){
	//If cancelUserHiddenPreference gets false, so every columns 
	//must be show regardless to its user setting
	var cancelUserHiddenPreference = (!globalPreferences.hideColumns || userPreferences == null);
	
	//Defining columns objects to be inserted according to user preferences settings
	
	//No need in Transfer column when in Manual mode
	if(!globalPreferences.isInManualMode){
		transferColumn = new Ext.grid.CheckColumn({
	     	id: transferColumnId
	        ,header: getLocalizationValue('application.javascript.smartpad.tableTitle.transfer')
	        ,sortable: globalPreferences.sortColumns
	        ,dataIndex: transferDataIndex
	        ,width: userPreferences == null ? 50 : userPreferences[transferColumnId].width
			,hidden: cancelUserHiddenPreference ? false : userPreferences[transferColumnId].hidden
		});
	}
		
	pasteColumn = {
         	//Paste
         	id: pasteColumnId
            ,header: getLocalizationValue('application.javascript.smartpad.tableTitle.paste')
            ,dataIndex: pasteDataIndex
	        ,width: userPreferences == null ? 100 : userPreferences[pasteColumnId].width
			,hidden: cancelUserHiddenPreference ? false : userPreferences[pasteColumnId].hidden
			,renderer: cellRenderer
	        ,sortable: globalPreferences.sortColumns
         };
         
	storeColumn = {
		 	//Store
         	id: storeColumnId
            ,header: getLocalizationValue('application.javascript.smartpad.tableTitle.store')
            ,dataIndex: storeDataIndex
	        ,width: userPreferences == null ? 100 : userPreferences[storeColumnId].width
			,hidden: cancelUserHiddenPreference ? false : userPreferences[storeColumnId].hidden
			,renderer: cellRenderer
	        ,sortable: globalPreferences.sortColumns
         };
	nameColumn = {
         	//Name
         	id: nameColumnId
            ,header: getLocalizationValue('application.javascript.smartpad.tableTitle.name')
            ,sortable: globalPreferences.sortColumns
            ,dataIndex: nameDataIndex
	        ,width: userPreferences == null ? 100 : userPreferences[nameColumnId].width
			,hidden: cancelUserHiddenPreference ? false : userPreferences[nameColumnId].hidden
            ,align: 'left'
			,renderer: cellRenderer
            ,editor: new Ext.form.TextField({
					allowBlank: true	
				})
         };
	valueColumn = {
         	//Value
         	id: valueColumnId
            ,header: getLocalizationValue('application.javascript.smartpad.tableTitle.value')
            ,sortable: globalPreferences.sortColumns
            ,dataIndex: valueDataIndex
	        ,width: userPreferences == null ? 100 : userPreferences[valueColumnId].width
			,hidden: cancelUserHiddenPreference ? false : userPreferences[valueColumnId].hidden
            ,align: 'left'
			,renderer: cellRenderer
            ,editor: new Ext.form.TextField({
					allowBlank: true	
				})
         };
	
	//Creating has for easier access
	var columns = new Hash();
	columns.set(storeColumnId, storeColumn);
	columns.set(pasteColumnId, pasteColumn);
	columns.set(nameColumnId, nameColumn);
	columns.set(valueColumnId, valueColumn);

	//No need in Transfer column when in Manual mode
	if(!globalPreferences.isInManualMode){
		columns.set(transferColumnId, transferColumn);
	}
	
	//will hold columns in appropriate order.
	var orderedColumns = new Array(columns.keys().size());
	
	//if it's user's first login userPreferences will be null,
	//so the order should be store, paste, name, value, transfer
	if(userPreferences != null){
		//Making conversion for easier running over object values
		var prefsHash = new Hash(userPreferences);
		prefsHash.each(function(col){
			//userPreferences contains field sortState. So we don't need it.
			if(col.key != "sortState"){
				//If in manual mode and it's Transfer column, there is no need to pass it's settings.
				if(!globalPreferences.isInManualMode || col.key != transferColumnId){
					orderedColumns[col.value.index] = columns.get(col.key);
				}
			}
		});
	}else{
		orderedColumns = columns.values();
	}	
	var cm = new Ext.grid.ColumnModel(orderedColumns);
	
	return cm;
}

//Disables or enables buttons according to number of selected rows
function checkButtonsState(){
	var numberSelectedRows = smartPadGrid.getSelectionModel().getSelections().length;
	var disabled = true;
	if (numberSelectedRows != 0) {
		var numberNonRemovableSelectedRows = getNonRemovableSelectedRowCount();
		disabled = (numberSelectedRows <= 0 || numberSelectedRows == numberNonRemovableSelectedRows);
	}
	btnDeleteEntries.setDisabled(disabled);
	
	disabled = (numberSelectedRows != 1);
	btnChangeShortcuts.setDisabled(disabled);
}

//Required for adding Transfer checkbox to a table
Ext.grid.CheckColumn = function(config){
    Ext.apply(this, config);
    if(!this.id){
        this.id = Ext.id();
    }
    this.renderer = this.renderer.createDelegate(this);
}

//Required for adding Transfer checkbox to a table
Ext.grid.CheckColumn.prototype ={
    init : function(grid){
        this.grid = grid;
        this.grid.on('render', function(){
            var view = this.grid.getView();
            view.mainBody.on('mousedown', this.onMouseDown, this);
        }, this);
    },

    //When mouse is clicked over Transfer checkbox,
    //its value is changed to oposite one and appropriate 
    //name cell verification is done if its empty. 
    onMouseDown : function(e, t){
        if(t.className && t.className.indexOf('x-grid3-cc-'+this.id) != -1){
            e.stopEvent();
            var index = this.grid.getView().findRowIndex(t);
            var record = this.grid.store.getAt(index);
            //if new transfer value is not valid for name cell content,
            //adding invalid class, which marks cell with red
            if(validateNameVsTransfer(record, !record.data[this.dataIndex])){
	            record.set(this.dataIndex, !record.data[this.dataIndex]);
				record.commit();
				var entry = Ext.util.JSON.encode(record.data);
				smartPadEntriesStore.load({params: {method: 'saveEntry', smartPadJSONEntry: entry}});
			}
        }
    },

    renderer : function(v, p, record){
        p.css += ' x-grid3-check-col-td'; 
        return '<div class="x-grid3-check-col'+(v?'-on':'')+' x-grid3-cc-'+this.id+'">&#160;</div>';
    }
}

//Adds no editable class, when required, and tooltip (title) to each cell
function cellRenderer(value, metaData, record, rowIndex, colIndex, store){
	var editingDisabled = false;
	if(metaData.id == nameColumnId && record.data.disableNameEdit){
		editingDisabled = true;
	}
	else if(metaData.id == valueColumnId && record.data.disableValueEdit){
		editingDisabled = true;
	}
	
	if(editingDisabled){
		metaData.css = "non_editable_smartpad_cell";
	}

	metaData.attr = "title='" + value + "'";
	
	return value;
}

function doUnselectAllTransfer(){
	var entries = new Array();
	smartPadEntriesStore.each(function(record){
		record.data.transfer = false;
		record.commit();
		entries.push(record.data);
	});
	
	smartPadEntriesStore.load({params: {method: 'saveEntries', entries: entries.toJSON()}});
}

function doSelectAllTransfer(){
	var entries = new Array();
	smartPadEntriesStore.each(function(record){
		//checking records that have transfer set to false
		if(!record.data.transfer){
			//if name cell is valid with transfer set to true,
			//updating the record.
			//otherwise, adding invalid class to name cell
            if(validateNameVsTransfer(record, true)){
				record.data.transfer = true;
				record.commit();
				entries.push(record.data);
			}
		}
	});
	
	if(entries.size() > 0){
		smartPadEntriesStore.load({params: {method: 'saveEntries', entries: entries.toJSON()}});
	}
}

//Verifies whether name cell must be colored 
//in red according its value and Transfer state
//Transfer value is changed to false if Name value is empty
//Returns true if new transfer value is not approved
function validateNameVsTransfer(record, newTransferValue){
	//if name is not empty, return true
	if(record.data.name != null && record.data.name != ""){
		return true;
	}
	//name is empty
	if(record.data.value != null && record.data.value != ""){
		if(newTransferValue){
			//name is empty, value not, return false and color name field
			nameCellInvalidClass(record, true);
			return false; 
		}
	}
	//name and value are empty, return false
	return false;
}

function nameCellInvalidClass(record, addClass){
	var rowIndex = smartPadEntriesStore.indexOf(record);
	var colIndex = columnModel.findColumnIndex(nameDataIndex);
	var cellTD = smartPadGrid.getView().getCell(rowIndex, colIndex);
	var cellElem = Ext.get(cellTD);
	if(addClass){ 
		cellElem.addClass('x-form-invalid');
	}else{
		cellElem.removeClass('x-form-invalid');
	}
}

//If value is more then SUPPORTED_SIZE it's cut.
//Original or updated value is returned.
function verifySupportedSize(cellValue){
	if (cellValue.length > SUPPORTED_SIZE) {
		alert($W().localeManager.getLocalizationValue('application.javascript.smartpad.alert.textTooLong'));
		//returning first SUPPORTED_SIZE chars
		return cellValue.substr(0, SUPPORTED_SIZE);
	}
	return cellValue;
}

function verifyRecordSizes(record, entriesToSave){
	//if name or value have changed after verification
	//we need to save on the server.
	var verifiedValue = verifySupportedSize(record.data.value);
	var verifiedName = verifySupportedSize(record.data.name);
	var changed = false;
	if(verifiedValue != record.data.value){ 
		record.data.value = verifiedValue;
		updateEntryValue(index, record.data.value);
		changed = true;
	}
	if(record.data.name != verifiedName){
		record.data.name = verifiedName;
		changed = true;
	} 
	if(changed){
		record.commit();
		if(entriesToSave.indexOf(record.data) == -1){
			entriesToSave.push(record.data);
		}
	}
}