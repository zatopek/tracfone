// an map that hold all the comboboxes key=id value=combobox
var codesComboboxes = new Object();
// an map that hold the selection timestamp for a combobox key=id value=Date
var codesSelectionTimestamps = new Object();
// holds the time when a call started
var callStartTime;
//connection used to call the server
var conn = new Ext.data.Connection();
//by default, the agent is not in disposition state
//var agentInDispositionState = false;
//indicates whether disposition data was sent already
var dispositionSent = false;

Ext.onReady(function(){
	buildUI();
	registerForMessages();
	//This is init, so if we already in disposition, we had resync.
	//
	if(agentInDispositionState){
		setDispositionDisabled(false, true);
		container.getEl().repaint();
		
		var agentDispositionWindow = $W().toolbarWindows['AgentDispositionWindow'];
		if (autoDispositionEnabled && agentDispositionWindow) {
			$W().runToolbarItem("AgentDispositionWindow");
		}
	}
	//Means we missed push message (probably due to Resynch)
	if($W().agentDispositionInit){
		$W().agentDispositionInit = false;
		startBusinessCall();
	}
});

function buildUI() {
	buildAgentNotesPanel();
    buildDispositionsCodesPanel();
    buildBottomPanel();   
      
      //Main panel with a border layout
	  //--------------------------------------
	  // pnlNotes     | pnlDispositionsCodes
	  //--------------------------------------
	  // 			pnlBottom
	  //--------------------------------------
   	container = new Ext.Panel({
        renderTo: 'agentDisposition',
        layout: 'border',
        frame: false,
        border: false,
        items: [pnlNotes, pnlDispositionsCodes, pnlBottom]
    });

   	var agentDispositionWindow = $W().toolbarWindows['AgentDispositionWindow'];
	if (!agentDispositionWindow && $W().LayoutByContext) {
		setDispositionDisabled(false);
	}else{
		setDispositionDisabled(true);//on creation, disable the portlet ui
	}
    //add listener to resize the inner ui whenever the portlet is resized
    document.body.onresize = new Function("resizeContent()");
    resizeContent();
}

function buildAgentNotesPanel(){
	agentNotesTextArea = new Ext.form.TextArea({
	  width: '100%',
	  height: '95%'
	});
	//set the textare on $W in order to expose it to the smartpad
	$W().agentNotesTextArea = agentNotesTextArea;
	
	agentNotesTextArea.on("change", function(textArea, newValue, oldValue){
		updateSmartPad(newValue);
	});
	
	var lblNotes = new Ext.form.Label({
	  width: '100%',
	  html: getLocalizationValue('application.javascript.agentDisposition.notes')
	});
	
	lblNotesWrapper = new Ext.Panel({
		  bodyStyle: 'text-align:left;padding: 0 0 5 0',
		  border: false,
		  items: [lblNotes]
		});
	
	// Panel that holds a TextArea for the agent's notes
	pnlNotes = new Ext.Panel({
	  region: 'center',
	  split: true,//create a splitter
	  bodyStyle: 'text-align:left;',
	  frame: true,
	  border: false,
	  items: [lblNotesWrapper, agentNotesTextArea]
	});
}

function buildDispositionsCodesPanel(){
	if (!isDispositionSupported()){
		pnlDispositionsCodes = new Ext.Panel();
		pnlDispositionsCodes.setVisible(false);
		return;
	}
	
	var lblDisposition = new Ext.form.Label({
	  width: '100%',
	  height: '5%',
	  html: getLocalizationValue('application.javascript.agentDisposition.codes')
	});
	// Panel that holds the dispositions codes comboboxes
	pnlDispositionsCodes = new Ext.Panel({
	   region: 'east',
	   id: 'pnlDispositionsCodes',
	   split: true,//create a splitter
	   bodyStyle : "text-align:left; padding: 0 5 0 5;",
	   width: '200',
	   frame: true,
	   border: false,
	   items: [lblDisposition],
	   autoScroll: true
	});
	
	var paddingSpace = 0;
	//in 'heirarchical' mode, we want a tree like structure
	if (isHierarchical()){
			paddingSpace = 20;
	}
	//wrap each combobox in a panel in order to give it a custom layout
	for (var i=0; i < dispositionCount; i++) {
		//create the combobox 
	   var id = i+"";
	   codesComboboxes[id] = createCodesCombobox(id);
	   //create the wrapping panel
	   var panel = new Ext.Panel({
       		bodyStyle: 'text-align:left; padding:5 0 5 '+i*paddingSpace,
       		items: [codesComboboxes[id]]
   		});	
	   pnlDispositionsCodes.add(panel);	
	}
   	//load the values only once
   	codesComboboxes["0"].store.load({params:{method:'getAllCodes', onlyFirstLevel: eval(loadOnlyFirstLevel)}});
}

function buildBottomPanel(){
	btnSend = new Ext.Button ({
			disabled: true,
    		text: getLocalizationValue('application.javascript.agentDisposition.send'),
    		handler: sendDisposition
    	});
	btnCallback = new Ext.Button ({
		text: getLocalizationValue('application.javascript.agentDisposition.callback'),
		handler: openCallbackForm
	});
    	
	// Bottom panel to hold the action button
	var buttons;
	if (showCallbackButton){
		buttons = [btnCallback, btnSend];
	}else{
		buttons = [btnSend];
	}
	pnlBottom = new Ext.Panel({
	   region: 'south',
	   autoHeight: true,
	   frame: true,
	   margins:'0 0 0 0',
	   bodyStyle : "text-align:right",//align the button to the right
	   buttons: buttons
	});	
}

function openCallbackForm(){
	$W().openCallbackForm();
}

function sendDisposition(){
	var jsonString;
	var agentNotes = agentNotesTextArea.getValue();
	if (!agentInDispositionState || !isDispositionSupported()) {
		//the agent is currently not in disposition,
		//send only the agent's notes
		jsonString = '';
	}else{
		var data = new Array();
		var j = 0;
		for (var i = 0; i < dispositionCount; i++) {
			var combobox = codesComboboxes[i+""];
			var timestamp = codesSelectionTimestamps[i];
			var value = combobox.getValue();
			if (value != ''){
				var values = new Object();
				values["code"]= value;
				values["absoluteTimeForCodeSelection"]= timestamp.format('m-d-Y H:i:s');
				values["relativeTimeForCodeSelectionInSeconds"]= timestamp.getElapsed(callStartTime)/1000;
				data[j++] = values;
			}
		}
		jsonString = Ext.util.JSON.encode(data);
	}
	var pars = 'method=sendDisposition&disposition=' + jsonString + '&notes=' + agentNotes;
	
	conn.request({
        url: AGENT_DISPOSITION_JSON_URL,
        method: 'GET',
		disableCaching: true,
        params: {method: 'sendDisposition', disposition: jsonString, notes:agentNotes},
        success: function(responseObject) {
        	dispositionSent = true;
			
			if (!isDispositionSupported()) {
				agentNotesTextArea.setValue('');
				updateSmartPad('');
			}
			//refresh the ui 
			resizeContent();
			
			//if agent is in disposition state - end disposition
			if (agentInDispositionState && isDispositionSupported()) {
					endCTIDisposition();
			}
			
			//if on toolbar and popup enabled then close disposition upon submit
			var agentDispositionWindow = $W().toolbarWindows['AgentDispositionWindow'];
			if (agentDispositionWindow) {
				agentDispositionWindow.hide();
			}
			
			//disable the disposition panel until next disposition
			updateDispositionState(false);
        },
         failure: function() {
		 	//show an error message
			 Ext.Msg.show({
			   title:getLocalizationValue('application.javascript.agentDisposition.alert.title'),
			   msg: getLocalizationValue('application.javascript.agentDisposition.alert.body'),
			   buttons: Ext.Msg.YESNO,
			   fn: handleSendError,
			   icon: Ext.MessageBox.ERROR
			});
         }
    });
}

function handleSendError(btn){
	if (btn == 'yes'){
		sendDisposition();
    }
};
	
function createCodesCombobox(index){
	if (isHierarchical() || index == 0) {
		dataStore = new Ext.data.JsonStore({
			id: index + "",
			root: 'results',
			totalProperty: 'totalCount',
			fields: [{
				name: 'displayValue',
				type: 'string'
			}, {
				name: 'code',
				type: 'string'
			}, {
				name: 'id',
				type: 'int'
			}],
			url: AGENT_DISPOSITION_JSON_URL,
			sortInfo: {
    			field: 'displayValue',
    			direction: 'ASC'
			}

		});
		dataStore.on('load', function(store) {
			addEmptyRecord(store);
		});
	}
	var comboBox = new Ext.form.ComboBox({
		id: index+"",
	    store: dataStore,
	    displayField:'displayValue',
	    valueField:'code',
	    mode: 'local',
	    editable: false,
	    triggerAction: 'all',
	    width: 170,
		//use a template in order to display empty value correct, otherwise you see a small empty row
		tpl: '<tpl for="."><div class="x-combo-list-item">{displayValue:defaultValue("&nbsp;")}</div></tpl>',
		listeners: {
			expand: function(combo) {
				if(combo.calculated){
					return;
				}
				var length = this.innerList.dom.childNodes.length;
				var max = 0;
				for (var i = 0; i < length; i++) {
					max = Math.max(this.innerList.dom.childNodes[i].offsetWidth, max);
					max = Math.max(this.minListWidth, max);
				}
				//max += 19;
				this.list.setWidth(max);
	            this.innerList.setWidth(max - this.list.getFrameWidth('lr'));
	            
	            combo.calculated = true;
            }
        }
	});
	
	comboBox.on('select', function(){
		var comboboxIndex = parseInt(this.id);
		if (isHierarchical()) {
			//the user changed his selection, we don't want to break the
			//hierarchy so we clean all the children of the selected combobox
			var firstChildIndex = comboboxIndex+1;
			if (firstChildIndex<dispositionCount){
				for (var j = firstChildIndex; j < dispositionCount; j++) {
					var cb = codesComboboxes[j+""];
					//remove all values and clear the selected value
					cb.store.removeAll();
					cb.clearValue();
				}
				//load the values of the first child
				var firstChildCB = codesComboboxes[firstChildIndex+""];
				firstChildCB.store.load({params:{method:'getCodesForParent', code:codesComboboxes[comboboxIndex+""].getValue()}});
			}
		}
		//save the time when the selection occured
		codesSelectionTimestamps[comboboxIndex] = new Date();
	});
	
	return comboBox;
}

//add empy record to a combobox to allow empty selection
function addEmptyRecord(store){
	if (store.getCount() > 0){
		var newRecord = new Ext.data.Record({data: {
	                        id: -1,
							code: 'none',
							displayValue: 'NONE'
	                    }});
		//insert the empty record as the first record
	    store.insert(0, newRecord);
	}
}

//set the given code as selected in the given combobox index
function setSelection(param){
	if(isDispositionSupported()){
		var code = param.code;
		var index = param.index;
		var disabled = !param.editable;
		
		if (index < dispositionCount){
			var cb = codesComboboxes[index+""];
			var store = cb.store;
			//check if value exists and only then select it
			var count = store.getCount();
	    	for (var i = 0; i < count; i++) {
	    		var currentCode = store.getAt(i).data.code;
	    		if (currentCode == code){
	    			cb.setValue(currentCode);
	    			cb.setDisabled(disabled);
	    			cb.fireEvent('select', cb, store.getAt(i), i);
	    			return;
	    		}		
	    	}
		}
	}
}

//save the call start date and clean previous selections
function startBusinessCall(){
    dispositionSent = false;
	callStartTime = new Date();	
	initDispositionValues();
	setDispositionDisabled(false, true);
	
	//notify the server that the client is ready
	conn.request({
        url: AGENT_DISPOSITION_JSON_URL,
        method: 'GET',
		disableCaching: true,
        params: {method: 'invokeDispositionInitializedEvent'}
    });
}

function startDisposition(){
	updateDispositionState(true);
	var agentDispositionWindow = $W().toolbarWindows['AgentDispositionWindow'];
	if (autoDispositionEnabled && agentDispositionWindow) {
		$W().runToolbarItem("AgentDispositionWindow");
	}
}

function setDispositionDisabled(disabled){
	setDispositionDisabled(disabled, true);
}
//disable the disposition section
function setDispositionDisabled(disabled, force){
	if (isDispositionSupported()){
		for (var j = 0; j < dispositionCount; j++) {
			var cb = codesComboboxes[j+""];
			//we want to enable the combobox but it is disabled
			//if it was disabled via the api, leave it this way.
			if (!disabled){
				if (cb.disabled && force){
					cb.setDisabled(disabled);
				}
			}else{
				cb.setDisabled(disabled);
			}
		}
		agentNotesTextArea.setDisabled(disabled);
		//disabling smart pad shortcuts for agent disposition
		disableSmartPadShortcuts(disabled);
		if (!disabled){
			//only if in disposition state and did not send the disposition data already
			if (!dispositionSent && agentInDispositionState){
				btnSend.setDisabled(disabled);
			}
		}else{
			btnSend.setDisabled(disabled);
		}
	}else{
		//only notes are supported, set them enabled all the time
		agentNotesTextArea.setDisabled(false);
		//disabling smart pad shortcuts for agent disposition
		disableSmartPadShortcuts(false);
		btnSend.setDisabled(false);
	}
}

//initialize the selected values in the comboboxes
function initDispositionValues(){
	if (isDispositionSupported()){
		for (var j = 0; j < dispositionCount; j++) {
			var cb = codesComboboxes[j+""];
			cb.clearValue();
			//in hierarchical mode, clear the children as well
			if (j > 0 && isHierarchical()) {
				cb.store.removeAll();
			}
		}
	}
	agentNotesTextArea.setValue('');
	updateSmartPad('');
}

/*
 * Returns true if we are working in 'heirarchical' mode, false otherwise ('flat' mode)
 */
function isHierarchical(){
	return eval(codeHierarchy);
}

/*
 * Returns true if an advanced view is supported, false otherwise (only agent notes panel)
 */
function isDispositionSupported(){
	return eval(dispositionEnabled);
}


/*
 * Register for all Push messages invoked by the disposition manager
 */
function registerForMessages(){
	$W().Push.registerEventHandler( 'START_DISPOSITION', startDisposition);
	$W().Push.registerEventHandler( 'SEND_DISPOSITION', sendDisposition);
	$W().Push.registerEventHandler( 'INIT_DISPOSITION', startBusinessCall);
	$W().Push.registerEventHandler( 'SELECT_DISPOSITON_CODE', setSelection);
	$W().Push.registerEventHandler( 'UPDATE_DISPOSITON_STATE', updateDispositionState);
	//onInitDisposition handler was required till the portlet is initialized
	$W().Push.unregisterEventHandler( 'INIT_DISPOSITION', $W().onInitDisposition);
}

/*
 * Unregister all Push messages handlers before this portlet is removed
 */
function onPortletRemoval(){
	$W().Push.unregisterEventHandler( 'START_DISPOSITION', startDisposition);
	$W().Push.unregisterEventHandler( 'SEND_DISPOSITION', sendDisposition);
	$W().Push.unregisterEventHandler( 'INIT_DISPOSITION', startBusinessCall);
	$W().Push.unregisterEventHandler( 'SELECT_DISPOSITON_CODE', setSelection);
	$W().Push.unregisterEventHandler( 'UPDATE_DISPOSITON_STATE', updateDispositionState);
	
	//mark the portlet as removed
	var frame = $W().document.getElementById("AgentDispositionPortletFrame");
	if ((frame != null)) {
		frame.portletRemoved = true;
	}
}

function onPortletDisplay() {
	var frame = $W().document.getElementById("AgentDispositionPortletFrame");
	if ((frame != null) && (frame.portletRemoved != undefined)) {
		frame.src = "SYSTEM/portlets/agentDisposition/agentDisposition.jsp";
	}
}

// called by the toolbar wrapper when the portlet is shown
function onPortletShow(reloadContentOnNextOpen) {
    if (reloadContentOnNextOpen){
		registerForMessages();
	}
}

/*
 * updates the current disposition state (true/false)
 */
function updateDispositionState(state){
	agentInDispositionState = eval(state);
	setDispositionDisabled(!agentInDispositionState, !state);
	container.getEl().repaint();
}

/*
 * resize the inner components according to the portlet size
 */
function resizeContent() {
	
	if ( this.frameElement.offsetWidth <= 0  || this.frameElement.offsetHeight <= 0) {
		return;
	}
		
	container.setWidth(this.frameElement.offsetWidth);
	container.setHeight(this.frameElement.offsetHeight);
	var agentDispositionWindow = $W().toolbarWindows['AgentDispositionWindow'];
	if (agentDispositionWindow) {
		container.setWidth(this.frameElement.offsetWidth-20);
		container.setHeight(this.frameElement.offsetHeight-40);
	}
	container.doLayout();
	container.getEl().repaint();
}

function updateSmartPad(newValue){
	if(typeof $W().smartPadFrame != 'undefined'){
		smartPad = $W().smartPadFrame;
		smartPad.updateEntryValue(smartPad.AGENT_DISPOSITION_PORTLET, newValue);
	}
}

function disableSmartPadShortcuts(disable){
	if(typeof $W().smartPadFrame != 'undefined'){
		smartPad = $W().smartPadFrame;
		if(disable){
			//unregistering agent disposition shortcuts
			smartPad.unRegisterAgentDispositionStoreShortcut();
		}else{
			//registering agent disposition shortcuts
			smartPad.registerAgentDispositionStoreShortcut();
		}
	}
}

function onPortletShow(){
    resizeContent();
}

function endCTIDisposition(){
	$W().cti.endDisposition();
}
