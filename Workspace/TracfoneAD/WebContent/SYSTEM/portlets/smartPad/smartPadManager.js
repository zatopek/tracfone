var URL = "../../../smartPad.json";
var AGENT_DISPOSITION_PORTLET = "agentDispositionPortlet"
var SMARTPAD_PORTLET_FRAME = "SmartPadPortletFrame"
//If it's changed, change also the number in .properties files
//for application.javascript.smartpad.alert.textTooLong
var SUPPORTED_SIZE = 440;

var synch = {
		loadInProgressOrRequired : false,
		savingInProcessOrRequired : false,
		isReloadCameIn : false,
		runActiveXUpdate: true
};

var shortcutForm;
var smartPadPortlet;
var changeShortcutsWin;
var smartPadShortcutsStore;
var smartPadEntriesStore;


var EntryRecord = Ext.data.Record.create(
	{name: 'paste', type: 'string'}
	,{name: 'store', type: 'string'}
	,{name: 'name', type: 'string'}
	,{name: 'value', type: 'string'}
	,{name: 'transfer', type: 'boolean'}
	,{name: 'transferred', type: 'boolean'}
	,{name: 'removable', type: 'boolean'}
	,{name: 'disableNameEdit', type: 'boolean'}
	,{name: 'disableValueEdit', type: 'boolean'}
	,{name: 'userDefined', type: 'boolean'}
	,{name: 'clearValueField', type: 'boolean'}
	,{name: 'description', type: 'string'}
	,{name: 'id', type: 'int'}
);

Ext.onReady(function(){
	
	registerSmartPadForMessages();

	//ActiveX sends text, which must be stored using jsPasteString 
	//located at main window level. The call to jsPasteString is caught 
	//at main window level, thus we have to 
	//put reference on main window so it won't look up 
	//smart pad in layout and in toolbar
	$W().smartPadFrame = window;
	initSmartPadStores();
	createGrid();
	
	document.body.onresize = resizeContent;
	resizeContent();
	
	onSmartPadReloadEntries();
	
	//if agent disposition notes are disabled, it's store shortcut must be disabled
	if (typeof $W().agentNotesTextArea != 'undefined'){
		if($W().agentNotesTextArea.disabled){
			unRegisterAgentDispositionStoreShortcut();
		}
	}
	 
});

function registerSmartPadForMessages(){
	$W().Push.registerEventHandler("smartPadEmptyEntry", onSmartPadEmptyEntry);
	$W().Push.registerEventHandler("smartPadReloadEntries", onSmartPadReloadEntries);
}

function smartPadEntriesStore_datachanged(store){
	//If another reload request came in and we do not making saving request, 
	//let's run it.
	if(synch.isReloadCameIn && !synch.savingInProcessOrRequired){
		synch.isReloadCameIn = false;
		onSmartPadReloadEntries(true);
	}else{
		//Let's update entries and shortcuts
		//Shortcuts should be loaded only once
		//If it's just a callback of saving entries, no need to udpate activeX again.
		if (!shortcutsLoaded) {
			smartPadShortcutsStore.load({params: {method: 'loadShortcuts'}});
		}else if(synch.runActiveXUpdate){
			synch.savingInProcessOrRequired = true;
			synch.loadInProgressOrRequired = false;
			updateShortcutsInActiveX();
		}else{
			synch.runActiveXUpdate = true;
		}
		checkButtonsState();
		
		//If saving request is opened, we have to wait till it completes
		//exiting
		if(synch.savingInProcessOrRequired){
			return;
		}
		
		//If reload request came in during updates,
		//Let's reload
		if(synch.isReloadCameIn){
			synch.isReloadCameIn = false;
			onSmartPadReloadEntries(true);
		}else{
			synch.loadInProgressOrRequired = false;
		}
	}
	
}

function initSmartPadStores(){
	smartPadEntriesStore = new Ext.data.JsonStore({
		 root		: 'smartPadData'
		,totalProperty: 'totalEntries'
		,fields		: [
			 {name: 'paste', type: 'string'}
			,{name: 'store', type: 'string'}
			,{name: 'name', type: 'string'}
			,{name: 'value', type: 'string'}
			,{name: 'transfer', type: 'boolean'}
			,{name: 'transferred', type: 'boolean'}
			,{name: 'removable', type: 'boolean'}
			,{name: 'disableNameEdit', type: 'boolean'}
			,{name: 'disableValueEdit', type: 'boolean'}
			,{name: 'userDefined', type: 'boolean'}
			,{name: 'clearValueField', type: 'boolean'}
			,{name: 'description', type: 'string'}
			,{name: 'id', type: 'int'}
		]
		,url			: URL
		,sortInfo	: getSortInfo()
	});
	
	smartPadShortcutsStore = new Ext.data.JsonStore({
		 root		: 'smartPadShortcuts'
		,totalProperty: 'totalEntries'
		,fields		: [
			 {name: 'key', type: 'string'}
			,{name: 'ctrl', type: 'boolean'}
			,{name: 'alt', type: 'boolean'}
			,{name: 'shift', type: 'boolean'}
			,{name: 'win', type: 'boolean'}
			,{name: 'display', type: 'string'}
			,{name: 'id', type: 'string'}
		]
		,url			: URL
	});
	
	smartPadShortcutsStore.on("datachanged", function(store){
		shortcutsLoaded = true;
		updateShortcutsInActiveX();
	});
	
	smartPadEntriesStore.on("datachanged", smartPadEntriesStore_datachanged);

}

function doDeleteEntries(){
	var records = smartPadGrid.getSelectionModel().getSelections();
	var ids = new Array();
    for(var i = 0, len = records.length; i < len; i++){
		if (records[i].data.removable){
			var ss = records[i].get("id");
			ids.push(ss);

			smartPadEntriesStore.remove(records[i]);
		}
    }
	var ids = ids.toJSON();
	updateShortcutsInActiveX();
	checkButtonsState();
	smartPadEntriesStore.load({params: {method: "deleteEntries", idsList: ids}});
}

function doChangeShortcuts() {
	var records = smartPadGrid.getSelectionModel().getSelections();
	if(records.length == 1){
		var changeForm = createChangeShortcutsForm(records[0], availableShortcuts.keys());

		changeShortcutsWin = new Ext.Window({
			id: 'changeShortcutsWindow'
			,layout: 'fit'
			,width: 300
			,height: 300
			,resizable: false
			,modal: true
			,title: getLocalizationValue('application.javascript.smartpad.table.shortcutsWindow.title')
			,items: [changeForm]
			,buttons: [btnChangeShortcutOK, btnChangeShortcutCancel]
		});

		changeShortcutsWin.show();
	}
}

//Changing shortcuts for the record. Updating availableShortcuts array.
function onChangeShortcutsOK(record){
	
	var newPaste = pasteField.getValue();
	var newStore = storeField.getValue();

	//adding old shortcuts to available ones
	availableShortcuts.set(record.data.paste, definedShortcuts.get(record.data.paste));
	availableShortcuts.set(record.data.store, definedShortcuts.get(record.data.store));
	
	//removing new shortcuts to available ones and 
	//registering them in the AxtiveX
	var sc = definedShortcuts.get(newPaste);
	availableShortcuts.unset(newPaste);
	registerPasteShortcut(smartPadEntriesStore.indexOf(record), 
		sc.data.key, sc.data.alt, sc.data.shift, 
		sc.data.ctrl, sc.data.win, true);

	record.data.paste = newPaste;
		
	//if value field can't be edited, no need in shortcut
	if(!record.data.disableValueEdit){
		sc = definedShortcuts.get(newStore);
		availableShortcuts.unset(newStore);
		registerStoreShortcut(smartPadEntriesStore.indexOf(record), 
			sc.data.key, sc.data.alt, sc.data.shift, 
			sc.data.ctrl, sc.data.win, true);
			
		record.data.store = newStore;
	}
	
	record.commit();
	
	var entry = Ext.util.JSON.encode(record.data);
	smartPadEntriesStore.load({params: {method: 'saveEntry', smartPadJSONEntry: entry}});
	changeShortcutsWin.close();
	checkButtonsState();
}

function onChangeShortcutsCancel(){
	changeShortcutsWin.close();
}

/*
 * Returns the total number of the selected non-removable rows
 */
function getNonRemovableSelectedRowCount(){
	return getNonRemovableRowCount(true);
}
/*
 * Returns the total number of the non-editable rows
 */
function getNonRemovableRowCount(onlySelected){
	var records = 0;
	if ( onlySelected ){
		//get only the selected records
		records = smartPadGrid.getSelectionModel().getSelections();
	}else{
		//get all the records in the grid
		records = smartPadEntriesStore.getRange();
	}
	
	var counter = 0;
	for(var i = 0, len = records.length; i < len; i++){
			if(!records[i].data.removable){
				counter++;
			}
        }	
	return counter;
}

function doStoreString(txt, index){
	if(index == AGENT_DISPOSITION_PORTLET){
		//We need to store the text in AgentNotes portlet
		if (typeof $W().agentNotesTextArea != 'undefined'){
			agentNotesTextArea = $W().agentNotesTextArea;
			var existingText = agentNotesTextArea.getValue();
			var len = existingText.length;
			var newValue = "";
			if ((existingText.lastIndexOf(" ") == len-1) ||
			    (existingText.lastIndexOf("\n") == len-1) ||
			    (existingText.lastIndexOf("\t") == len-1))     
			{
			    newValue = existingText + txt;
			}else if(existingText == ""){
				newValue = txt;
			}else{ 
				// don't end with a space, add space
			    newValue = existingText + " " + txt;
			}
			agentNotesTextArea.setValue(newValue);
			updateEntryValue(AGENT_DISPOSITION_PORTLET, newValue);
		}else{
			updateEntryValue(AGENT_DISPOSITION_PORTLET, '');
		}
	}else{
		//we need to store text in the record



		var record = smartPadEntriesStore.getAt(index);
		txt = verifySupportedSize(txt);
		record.data.value = txt;
		record.commit();
		updateEntryValue(index, record.data.value);
		var entry = Ext.util.JSON.encode(record.data);
		smartPadEntriesStore.load({params: {method: 'saveEntry', smartPadJSONEntry: entry}});
	}
}

function onSmartPadEmptyEntry(entry){
	var record = new EntryRecord(entry);
	if (globalPreferences.emptyEntryPosition == 'BOTTOM') {
		smartPadEntriesStore.add([record]);
	}else if(globalPreferences.emptyEntryPosition == 'TOP'){
		smartPadEntriesStore.insert(0, [record]);
	}else{
		//Position is NONE, so there is no need to proceed.
		return;
	}
	
	if (globalPreferences.emptyEntryPosition == 'TOP') {
		//The order of entries has changed, so we need to update an ActiveX
		updateShortcutsInActiveX();
	}else{
		//No order has changed, so we need to update only last record
		var entriesTemp = new Array();
		entriesTemp.push(record);
		assignShortcutsToEntries(entriesTemp);
	}
	
	smartPadGrid.doLayout();
}


function onSmartPadReloadEntries(alwaysLoad){
	//if entries are not loaded at the moment, let's load them
	//otherwise, we should reload once again. 
	//There is a chance that server was updated with additional data
	if(alwaysLoad || !synch.loadInProgressOrRequired){
		synch.loadInProgressOrRequired = true;
		if(!synch.savingInProcessOrRequired){
			smartPadEntriesStore.load({params: {method: 'loadEntries'}});
		}
	}else{
		synch.isReloadCameIn = true;
	}
}

/*
 * resize the inner components according to the portlet size
 */
function resizeContent(){
	smartPadGrid.setWidth(this.frameElement.offsetWidth);
	smartPadGrid.setHeight(this.frameElement.offsetHeight-1);
	var smartPadWindow;
	if(typeof $W().toolbarWindows != 'undefined'){
		smartPadWindow = $W().toolbarWindows['SmartPadWindow'];
	}
	if (smartPadWindow) { 
		smartPadGrid.setWidth(this.frameElement.offsetWidth-20);
		smartPadGrid.setHeight(this.frameElement.offsetHeight-40);
	}
	smartPadGrid.doLayout();
	smartPadGrid.getEl().repaint();
}

//Runs when portlet is added to layout (not including first time it created)
function onPortletDisplay(){
	registerSmartPadForMessages();
	window.portletRemoved = false;
	//Registering Agent Notes shortcut
	registerAgentDispositionPasteShortcut();
	registerAgentDispositionStoreShortcut();
	
	//reloading entries from server
	onSmartPadReloadEntries();
}

/**
 * saving user preferences and marking portlet as removed.
 * Runs when portlet is removed from layout.
 */
function onPortletRemoval(){
	//mark the portlet as removed
	if (window.portletRemoved == null){
		window.portletRemoved = true;
	}else{
		//Portlet already removed from layout, no need to run the function again
		if(window.portletRemoved){
			return;
		}
	}

	$W().LogManager.getLogger("SmartPad").debug("SmartPad. Running onPortletRemoval. Saving user preferences.");
	
	//Unregistering Push handlers
	$W().Push.unregisterEventHandler("smartPadEmptyEntry", onSmartPadEmptyEntry);
	$W().Push.unregisterEventHandler("smartPadReloadEntries", onSmartPadReloadEntries);
	
	//Unregistering Shortcuts
	clearAllEntriesShortcuts();
	
	//Unregistering Agent Notes shortcut
	unRegisterAgentDispositionPasteShortcut();
	unRegisterAgentDispositionStoreShortcut();
	
	//Clearing store
	smartPadEntriesStore.removeAll();
	
	//saving user preferences	
	if(userPreferences == null){
		userPreferences = new Object();
	}
	columnModel.getColumnsBy(function(columnConfig, index){
		var colId = columnConfig.id;
		userPreferences[colId] = new Object();
		if(columnConfig.hidden != null){
			userPreferences[colId].hidden = columnConfig.hidden;
		}else{
			userPreferences[colId].hidden = false;
		}
		userPreferences[colId].width = columnConfig.width;
		userPreferences[colId].index = index;
	});
	
	//There is a special care for Transfer column when in Manual mode.
	//If user is in Manual mode, the previous state must be kept.
	//If there is no previous state, the column must be shown 
	//on next login with CTI mode.
	
	//If Transfer column setting does not exist, it's first login and it's in manual mode.
	//We need to store setting as shown. It's width to default 100px and it's index is last one.
	if(typeof userPreferences[transferColumnId] == 'undefined'){
		userPreferences[transferColumnId] = {'hidden': false, 'width': 100, 'index': 4};
	}

	userPreferences.sortState = smartPadEntriesStore.getSortState();
	
//	var prefs = Ext.util.JSON.encode(userPreferences);
//	smartPadEntriesStore.load({params: {method: "saveUserPreferences", userPreferences: prefs}});
	//On Websphere the asynchronous Ajax request arrives after request for logout (in indexheaders.js)
	//Thus session is already invalidated and user preferences are not saved and exception is thrown.
	//So synchronous Ajax must be used explicitly to ensure that relevant data is comming before logout request. 
	var prefs = "method=saveUserPreferences&userPreferences=" + Ext.util.JSON.encode(userPreferences);
	new Ajax.Request(URL, { method: 'POST', parameters: prefs, asynchronous : false });
}
function getSortInfo(){
	sortState = null; 
	if(userPreferences == null || userPreferences.sortState == null || !globalPreferences.sortColumns){
		if(typeof getDefaultSmartPadSortInfo == 'function'){
			sortState = getDefaultSmartPadSortInfo();
		}
	}else{
		sortState = userPreferences.sortState;
	}
	return sortState;
}
