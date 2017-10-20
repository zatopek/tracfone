/*
This file is responsible for showing the form of adding a new message to the message center.
*/
var mainForm; // form that contains all controls for editing a message
var mainWindow; // popup window that contains the form described above

var creationDateHidden; //hidden variable for saving new message creation time
var displayDateFrom; // date & time control for Activation Date. 
var displayDateTo; // date & time control for Expiration Date. 
var recipientType; // combobox for chose recipient type
var recipientGroupBox //combobox for selecting recipient group
var tickerTapeSet; // set(panel) that contains setting for ticker tape
var repeatingSet; // set(panel) that contains setting for repeating
var locationSet; // set(panel) that contains setting for message destination
var colorField; // control for chose ticker tape font color 
var priorityLevelCombo; // combobox with priority
var flash; // checkbox for flash message (ticker tape settings)
var pause; // checkbox for automatic pause (ticker tape settings)

var tickerTapeCheckbox; // ticker tape checkbox (location settings)
var splashCheckbox; // welcome screen checkbox (location settings)
var boardCheckbox; // message board checkbox (location settings)
var ReadOnceChbox; //read messages once checkbox
var enableRepeat;//this is relevant only when readonce is enabled
var MustReadChbox; //
var tabPanel //tab panel showing the mandatory/optional tabs of the message
var content; //message content field
var intervalOnSaveClicked = 0;
var tickerTapeEnabled;//initialized in server side

// function trim empty spaces at the begin and end of string. it's used for validation that message subject isn't only empty spaces
String.prototype.trim = function() {
    return this.replace(/^\s+/, '').replace(/\s+$/, '');
};

// Add the additional 'advanced' VTypes
Ext.apply(Ext.form.VTypes, {

	
    //validate if string is empty
    emptyText : function(val, field){
        if (val.trim().length == 0){    
            field.invalidText = getLocalizationValue('application.javascript.messageCenter.editForm.validation.fieldEmpty');
            return false;
        }
        return true;
    }
});

Ext.onReady(function() {
 // turn on validation errors beside the field globally
    Ext.form.Field.prototype.msgTarget = 'side';

    var displayRangeSet = initDisplayRangeSet(); //ititialization set with message range controls
    locationSet = initLocationSet(); //ititialization set with message location controls
    repeatingSet = initRepeatingSet(); //ititialization set with message repeating settings controls
    var tickerTapeSet = initTickerTapeSet(); // ititialization set with message ticker tape settings controls
    var recipientSet = initRecipientsSet(); //ititialization set with recipient settings controls
    var editSet = initEditSet(); //ititialization subject and content controls

    creationDateHidden = new Ext.form.Hidden({ name: 'creationDate' }); // initialization hidden fiel for message creation time
    var leftColumnInOptional;
    if (tickerTapeEnabled){
    	leftColumnInOptional = [locationSet, tickerTapeSet];
    }
    else{
    	leftColumnInOptional = [locationSet];
    }
    // tab panel for mandatory and optional tab - contains all sets and contols    
    tabPanel = new Ext.TabPanel({
        activeTab: 0,
        //anchor: '100% 100%',
        deferredRender: false,
        //height: 400,
        //width: 635,
        defaults: {
        	hideMode: "offsets",
        	style: 'padding: 2px 10px 2px 10px;'
        },
        items: [{
            title: getLocalizationValue('application.javascript.messageCenter.editForm.mandatoryTab'),
	        id: 'mandatorySet',
	        autoHeight:true,
	        layout:'form',
	        items:[{
	        		layout: 'column',
                    items: [{
                            style: 'padding: 2px 2px 2px 2px; margin: 2px;',                           
                            columnWidth:.5,
                            layout:'form',
                            items:[recipientSet]},
                            {
                            style: 'padding: 2px 2px 2px 2px; margin: 2px;',                            
                            columnWidth:.45,
                            layout:'form',
                            items:[displayRangeSet]
                        	}
                        ]
		        }, 
	        	editSet[0], 
	        	editSet[1]
	        ]

		}, {
		
            title: getLocalizationValue('application.javascript.messageCenter.editForm.optionalTab'),
			layout: 'column',
			id: "optionalSet",
			autoHeight: true,
                items: [
                    {
                        style: 'padding: 2px 2px 2px 2px;',
                        columnWidth:.45,
                        items: leftColumnInOptional
                    }, {
                        style: 'padding: 2px 2px 2px 2px;',
                        columnWidth:.45,
                        items: [repeatingSet]
                    }
			]}
        ]
    });
	tabPanel.doLayout();
	
	tabPanel.on('tabchange', function(tabpanel, activetab){
		activetab.getEl().repaint();
        }); 
    // main form initialization - form contains tabpanel and hidden field for message creatinon date 
    mainForm = new Ext.FormPanel({
        labelAlign: 'top',
        frame:true,
        hideBorders: true,
        header: false,
        anchor:'100%',
        items: [
            new Ext.form.Hidden({ name: 'id' }),
            creationDateHidden,
            tabPanel
            ]
    });
	mainForm.doLayout();

    // edit message window 
    mainWindow = new Ext.Window({
        title: getLocalizationValue('application.javascript.messageCenter.editForm.title'),//default title can be changed via shoMessageWindo function
        //x: 20, // put the form lower than the top corner in order to support the 1024*768 resolution
        //y: 20,
        width: 700,
        height: 440,
        layout: 'fit',
        //minWidth: 650,
        //minHeight: 440,   
		resizable : false,     
        plain: true,
	closeAction	: 'hide', //always hiding. It will be reloaded on beforeshow if requred.
        bodyStyle:'padding:2px;',
        buttonAlign:'right',
        items: mainForm,
        buttons: [
            {id:'saveBtn',text: getLocalizationValue('application.javascript.messageCenter.editForm.saveButton'), handler: onSaveClicked},
            {text: getLocalizationValue('application.javascript.messageCenter.editForm.cancelButton'), handler: function() { mainWindow.hide(); }}
        ]
    });
});
//when save is clicked we saw a problem that the values of the to/from dates are not updated yet
//so in order to prevent un-updated values from arriving to the server, we put a timer until the values are updated
function onSaveClicked() {
	var saveButton = Ext.getCmp('saveBtn');
	//disabling the button until we send everything to server
	saveButton.disable();
	intervalOnSaveClicked = setInterval(checkDatesAreUpdated,500);
}
function checkDatesAreUpdated() {
	var updated;
	//check expiryDate time is updated, if not return false
	if (Ext.value(Ext.getCmp('expiryDate').tf.getRawValue())!= Ext.value(displayDateTo.tf.getValue())){
		return false;
	}
	//check expiryDate date is updated, if not return false
	if (Ext.value(Ext.getCmp('expiryDate').df.getRawValue())!= Ext.value(displayDateTo.df.value)){
		return false;
	}
	
	//check activateionDate time is updated, if not return false
	if (Ext.value(Ext.getCmp('activationDate').tf.getRawValue())!= Ext.value(displayDateFrom.tf.getValue())){
		return false;
	}
	
	
	//check activateionDate date is updated, if not return false
	if (Ext.value(Ext.getCmp('activationDate').df.getRawValue())!= Ext.value(displayDateFrom.df.value)){
		return false;
	}
	//debugger;
	//everything is updated - so stop the interval and perform save
	clearInterval(intervalOnSaveClicked);
	intervalOnSaveClicked = 0;
	performValidationAndSave();
	
	
}
function performValidationAndSave() {
	var saveButton = Ext.getCmp('saveBtn');
	if(!validAll()) {
		//enabling the button until we send everything to server
		saveButton.enable();
		return; 
	}
	onSaveMessage(mainForm.getForm().getValues()); 
	mainWindow.hide(); 
	//enabling the button until we send everything to server
	saveButton.enable();
	
}
// fix hyper links in the message to open in new window
function replaceWithSafeHyperlink(){
	var newContent = content.getValue();
	
	while(newContent.indexOf("<A href") >= 0){
		newContent = newContent.replace("<A href", "<A target=\"_blank\" href");
	}
	content.setValue(newContent);
}
// check if all field values are valid
function validAll(){
	var emptyFlag = true;
	var contentVal = content.getValue();
   	//for bug ws-173 there were cases in which the content of the message had length but was actually empty, e.g:<p>&nbsp;</p>
    if (contentVal.length > 0 ){
    	//non-zero length can still be empty e.g <p>&nbsp;</p> is empty but length is not
    	if(contentVal.indexOf("</") > 0){
    		var tagsArray = contentVal.split("</");
     		for(var i = 0; i < tagsArray.length; i++) {
     			
     			
     			//if the splitted array doesnt  end with > then the tag is not empty
     			var trimmed = tagsArray[i].trim();
     			if(i%2 == 1){
     			//need to get rif off the tagName> at the begining, e.g in the case of <p>&nbsp;</p> tagsArray[1] is p>
     				trimmed = trimmed.substring(trimmed.indexOf('>')+1);
     			}
     			var tagContent = trimmed.substring(trimmed.indexOf('>')+1);
     			//checking the tag content is really empty
    			if (tagContent.length > 0 && tagContent != "&nbsp;" ){
    				emptyFlag = false;
    				break;
    			}
    		}
    	}
    	else{//no tags and non-zero length
    		emptyFlag = false;
    	}
    }
    else{//length = 0
    	emptyFlag = true;
    }
    if (emptyFlag){
		var title = getLocalizationValue('application.javascript.messageCenter.editForm.title');
		var msg = getLocalizationValue('application.javascript.messageCenter.editForm.validation.emptyContentField');
		
		Ext.MessageBox.alert(title, msg);
        return false;
    }

	//validate range of activation and expiration date is valid
     var toReturn = validateRange(displayDateFrom.df.value,displayDateFrom.tf.value,displayDateTo.df.value,displayDateTo.tf.value, displayDateFrom, displayDateTo);
     if(!toReturn){
     	var title = getLocalizationValue('application.javascript.messageCenter.editForm.title');
		var msg = getLocalizationValue('application.javascript.messageCenter.messageRangeValidationError');
		
		Ext.MessageBox.alert(title, msg);
	    return false;
	  }
	 if (tickerTapeEnabled && !colorField.isValid()){
	 	var title = getLocalizationValue('application.javascript.messageCenter.editForm.title');
		var msg = getLocalizationValue('application.javascript.messageCenter.messageColorValidationError');
		
		Ext.MessageBox.alert(title, msg);
        tabPanel.setActiveTab(tabPanel.getItem('optionalSet'));
		return false;
	 } 
	 
	 replaceWithSafeHyperlink();
	 
    return mainForm.getForm().isValid();
}

// initialization subject and message content edit fields
function initEditSet(){
    var subject = new Ext.form.TextField({
        fieldLabel: getLocalizationValue('application.javascript.messageCenter.editForm.subject'),
        name: 'subject',
        //anchor:'97%',
		width: '95%',
        vtype: 'emptyText',
        allowBlank:false
    });

    content = new Ext.form.HtmlEditor({
        id:'content',
		//height: 100,
		//width: '100%',
        fieldLabel: getLocalizationValue('application.javascript.messageCenter.editForm.content'),
        name:'content',
        vtype: 'emptyText',
        anchor:'95% 40%',
        defaultValue: '', //ws-2689: need to set explicitly empty, since "�" exist in message body once content is rendered.
        allowBlank:false
    });

    var array = [subject, content];
    return array;
}

function initDisplayRangeSet(){
	//the minium value for message date will be set to yesterday (not today for the case of timezone differences)
	var yesterday = new Date();
	yesterday.setDate((new Date()).getDate() - 1);

    displayDateFrom = new Ext.ux.form.DateTime({
                fieldLabel: getLocalizationValue('application.javascript.messageCenter.editForm.rangeSet.from'),
                dateFormat: MESSAGES_DATE_FORMAT,
                timeFormat: MESSAGES_TIME_FORMAT,
                hiddenFormat:'m-d-Y H:i',
                id: 'activationDate',
                name: 'activationDate',
                //configuring  with a validator on the date
                dateConfig: {allowBlank: false,minValue:yesterday.clearTime()},
                //configuring time 
        		timeConfig: {allowBlank: false, increment: 15}
         		
               
            });
            
    displayDateTo = new Ext.ux.form.DateTime({
                fieldLabel: getLocalizationValue('application.javascript.messageCenter.editForm.rangeSet.to'),
                dateFormat: MESSAGES_DATE_FORMAT,
                timeFormat: MESSAGES_TIME_FORMAT,
                hiddenFormat:'m-d-Y H:i',
                id: 'expiryDate',
                name: 'expiryDate',
                //configuring minimum date for current (because we nned it in the future) without milliseconds 
                dateConfig: {allowBlank: false,minValue:yesterday.clearTime()},
                //dateConfig: {allowBlank: false},
                //configuring time date for current without milliseconds, also the options will increment in 15 minutes
        		timeConfig: {allowBlank: false, increment: 15/*,minValue:new Date().clearTime()*/}
              
                
            }) 
            
    var displayRangeSet = new Ext.form.FieldSet({
        title: getLocalizationValue('application.javascript.messageCenter.editForm.rangeSet.title'),
        autoHeight:true,
        style: 'padding: 2px 10px 2px 10px;',
        layout: 'form',
        items: [displayDateFrom, displayDateTo]
        });
    return displayRangeSet;
    //return { items: [displayDateFrom, displayDateTo] };
}


         
function initTickerTapeSet(){
    flash = new Ext.form.Checkbox({ 
        boxLabel: getLocalizationValue('application.javascript.messageCenter.editForm.tickerTapeSet.flashMessage'),
        fieldLabel: '',
        hideLabel: true,
        name:'flashOnTickerTape',
        labelSeparator: ''
    });
        
    pause = new Ext.form.Checkbox({ 
        boxLabel: getLocalizationValue('application.javascript.messageCenter.editForm.tickerTapeSet.autoPause'),
        fieldLabel: '',
        hideLabel: true,
        name:'pauseOnTickerTape',
        labelSeparator: ''
    });
        
    var priorityStore = new Ext.data.SimpleStore({
        fields: ['priority', 'priorityId'],
        data : [[getPriorityDisplayName(5), 5], [getPriorityDisplayName(4), 4], [getPriorityDisplayName(3), 3], [getPriorityDisplayName(2), 2], [getPriorityDisplayName(1), 1]]
    });
        
    priorityLevelCombo = new Ext.form.ComboBox({
        store: priorityStore,
        displayField:'priority',
        valueField:'priorityId',
        typeAhead: true,
        editable:false,
        mode: 'local',
        anchor: "70%",
        triggerAction: 'all',
        selectOnFocus:true,
        resizable:false,
        name:'priorityLevel',
        fieldLabel: getLocalizationValue('application.javascript.messageCenter.editForm.tickerTapeSet.priority'),
        emptyText: getLocalizationValue('application.javascript.messageCenter.editForm.combobox.emptyText')
    });
    
    colorField = new Ext.form.ColorField({
        fieldLabel: getLocalizationValue('application.javascript.messageCenter.editForm.tickerTapeSet.color'),
        id: 'colorOnTickerTape',
        name:'colorOnTickerTape',
        allowBlank: false
    });

    tickerTapeSet = new Ext.form.FieldSet({
        title: getLocalizationValue('application.javascript.messageCenter.editForm.tickerTapeSet.title'),
        autoHeight:true,
        style: 'padding: 2px 10px 2px 10px',
        items: [
            flash, 
            pause, 
            {
            	width: "250px",
                layout: 'column',
                items: [{
                    columnWidth: .5,
                    layout: 'form',
                    items: [priorityLevelCombo]
                }, {
                    columnWidth: .5,
                    layout: 'form',
                    items: [colorField]
                }]
            }]
    });
    return tickerTapeSet;
}

//translate priority id into a display string
function getPriorityDisplayName(priority){
	switch (priority){
		case 5: 
			return getLocalizationValue('application.javascript.messageCenter.editForm.tickerTapeSet.priority.urgent');
		case 4: 
			return getLocalizationValue('application.javascript.messageCenter.editForm.tickerTapeSet.priority.important');
		case 3: 
			return getLocalizationValue('application.javascript.messageCenter.editForm.tickerTapeSet.priority.regular');
		case 2: 
			return getLocalizationValue('application.javascript.messageCenter.editForm.tickerTapeSet.priority.low');
		case 1: 
			return getLocalizationValue('application.javascript.messageCenter.editForm.tickerTapeSet.priority.very_low');
		default : return priority;
	}
}

function initLocationSet(){

    tickerTapeCheckbox = new Ext.form.Checkbox({ 
        boxLabel: getLocalizationValue('application.javascript.messageCenter.editForm.locationSet.tickerTape'),
        fieldLabel: '',
        hideLabel: true,
        defaults:{height: 12},
        checked: true,     
        name:'showOnTickerTape',
        labelSeparator: ''
    });

        tickerTapeCheckbox.on('check', function(checkbox, checked){
        // disable ticker tape options set if ticker tape check box is inactive in locations 
            setTickerTapeComponentsStatus(checked);
            
	        //if all locations are unchecked also disable readOnce
	        var allLocationsAreDisabled = !checked && !boardCheckbox.getValue() && !splashCheckbox.getValue();
	        onLocationsStateChange(allLocationsAreDisabled);
	      	
	        
        }); 

    splashCheckbox = new Ext.form.Checkbox({
        boxLabel: getLocalizationValue('application.javascript.messageCenter.editForm.locationSet.welcomeScreen'),
        hideLabel: true,
        fieldLabel: '',
        checked: true, 
        labelSeparator: '',
        name:'showOnWelcomeScreen',
        defaults:{height: 12} 
    });
    
    // enable/disable must-read-on-welcome-screen options if splashCheckbox checkbox active/inactive
    splashCheckbox.on('check', function(checkbox, checked){
        if(!checked){
        	//uncheck the MustReadChbox
            MustReadChbox.setValue(false);
        }
        //if all locations are unchecked also disable readOnce
        var allLocationsAreDisabled = !checked && !boardCheckbox.getValue() && !tickerTapeCheckbox.getValue();
        onLocationsStateChange(allLocationsAreDisabled);
        //enable/disable according to splashCheckbox
        MustReadChbox.setDisabled(!checked);
    });

    boardCheckbox = new Ext.form.Checkbox({ 
        boxLabel: getLocalizationValue('application.javascript.messageCenter.editForm.locationSet.messageBoard'),
        validationEvent: 'change', 
        checked: true, 
        hideLabel: true,  
        fieldLabel: '', 
        labelSeparator: '', 
        name:'showOnMessageBoard', 
        defaults:{height: 12}
    });

	 // enable/disable must-read-on-welcome-screen options if splashCheckbox checkbox active/inactive
    boardCheckbox.on('check', function(checkbox, checked){
       
        //if all locations are unchecked also disable readOnce
        var allLocationsAreDisabled = !checked && !splashCheckbox.getValue() && !tickerTapeCheckbox.getValue();
        onLocationsStateChange(allLocationsAreDisabled);
        
        
    
    });
    
    var locationSetItems;
    if (tickerTapeEnabled) {
    	locationSetItems = [splashCheckbox, boardCheckbox, tickerTapeCheckbox];
    }
    else {
    	locationSetItems = [splashCheckbox, boardCheckbox];
    }
    var locationSet = new Ext.form.FieldSet({
        title: getLocalizationValue('application.javascript.messageCenter.editForm.locationSet.title'),
        collapsible: false,
        autoHeight:true,
        maskDisabled: false,
        style:'padding: 2px 10px 2px 10px',
        defaultType: 'checkbox',
        items: locationSetItems
    });
    return locationSet;
}

// disable/enable ticker tape options if ticker tape checkbox from location set is unchecked/checked
function setTickerTapeComponentsStatus(checked){ 
    priorityLevelCombo.setDisabled(!checked);
    colorField.setDisabled(!checked);
    flash.setDisabled(!checked);
    pause.setDisabled(!checked);
}

function initRepeatingSet() {

    ReadOnceChbox = new Ext.form.Checkbox({
        id: 'readOnceChbx',
        boxLabel:  getLocalizationValue('application.javascript.messageCenter.editForm.propertiesSet.readOnce'),
        hideLabel: true,
        name:'readOnce',
        anchor:'100%'
    });
    
    MustReadChbox = new Ext.form.Checkbox({
        id: 'mustReadChbox',
        boxLabel: getLocalizationValue('application.javascript.messageCenter.editForm.propertiesSet.mustRead'),
        hideLabel: true,
        name:'mustRead',
        disabled: false,
        anchor:'100%'
    });

    var periodStore = new Ext.data.SimpleStore( {
        fields: ['period', 'periodId'],
        data : [


            [getLocalizationValue('application.javascript.messageCenter.editForm.propertiesSet.repeat.1day'),
            	 "ONE_DAY"],
            [getLocalizationValue('application.javascript.messageCenter.editForm.propertiesSet.repeat.2days'),
            	 "TWO_DAYS"],
            [getLocalizationValue('application.javascript.messageCenter.editForm.propertiesSet.repeat.3days'),
            	 "THREE_DAYS"],
            [getLocalizationValue('application.javascript.messageCenter.editForm.propertiesSet.repeat.1week'),
            	 "ONE_WEEK"],
            [getLocalizationValue('application.javascript.messageCenter.editForm.propertiesSet.repeat.2weeks'),
            	 "TWO_WEEKS"],
            [getLocalizationValue('application.javascript.messageCenter.editForm.propertiesSet.repeat.3weeks'),
            	 "THREE_WEEKS"],
            [getLocalizationValue('application.javascript.messageCenter.editForm.propertiesSet.repeat.1month'),
            	 "ONE_MONTH"],
            [getLocalizationValue('application.javascript.messageCenter.editForm.propertiesSet.repeat.2months'),
            	 "TWO_MONTHS"],
            [getLocalizationValue('application.javascript.messageCenter.editForm.propertiesSet.repeat.3months'),
            	 "THREE_MONTHS"]            

        ]   
    });

    var everyCombo = new Ext.form.ComboBox( {
        store: periodStore,
        displayField: 'period',
        valueField: 'periodId',
        mode: 'local',
        triggerAction: 'all',
        editable: false,
        selectOnFocus: true,
        allowBlank: false,
        forceSelection: true,
        resizable: false,
        anchor:'70%',
        hideLabel: true,
        hiddenName:'repeatingPeriodType',
        emptyText: getLocalizationValue('application.javascript.messageCenter.editForm.combobox.emptyText')
    });

	everyCombo.setDisabled(true);
    enableRepeat = new Ext.form.Checkbox({ 
        boxLabel: getLocalizationValue('application.javascript.messageCenter.editForm.propertiesSet.repeat'),
        fieldLabel: '',
        hideLabel: true,
        disabled: true, 
        style:'padding:0px',
        name:'repeating',
        labelSeparator: ''
    });

    // enable/disable repeat options if readOnce checkbox active/inactive
    ReadOnceChbox.on('check', function(checkbox, checked){
        if(!checked){
            enableRepeat.setValue(false);
        }
        enableRepeat.setDisabled(!checked);
    });

    enableRepeat.on('check', function(checkbox, checked){
        everyCombo.setDisabled(!checked);
        if (checked == false) {
			everyCombo.clearInvalid();
		}
        }); 

    var repeatingSet = new Ext.form.FieldSet({
        id: 'repeatingSet',
        title: getLocalizationValue('application.javascript.messageCenter.editForm.propertiesSet.title'),
        autoHeight:true,
        style: 'padding: 2px 10px 2px 10px;',
        layout: 'column',
        width: 260,

        items: [
            {
                style: 'padding: 2px 10px 2px 10px;',
                layout: 'form',
                columnWidth:.5,
                items: [ReadOnceChbox,
                MustReadChbox
                ]
            },
            {
                columnWidth:.5,
                layout: 'form',
                items: [enableRepeat, everyCombo]
            }
        ]     
    });

    return repeatingSet;
}

function initRecipientsSet() {
    var recipientsStore = new Ext.data.SimpleStore({
        fields: ['target', 'targetId'],
        data : [
            [getLocalizationValue('application.javascript.messageCenter.editForm.recipientsSet.sendTo.all'),
            	 'ALL'], 
            [getLocalizationValue('application.javascript.messageCenter.editForm.recipientsSet.sendTo.group'),
            	 'GROUP']
        ]
    });

    recipientType = new Ext.form.ComboBox({
        store: recipientsStore,
        displayField: 'target',
        valueField: 'targetId',
        typeAhead: false,
        editable: false,
        mode: 'local',
        triggerAction: 'all',
        emptyText: 'Select target...',
        forceSelection: true,
        selectOnFocus: false,
        allowBlank: false,
        //resizable: false,
        //anchor:'50%',
        fieldLabel: getLocalizationValue('application.javascript.messageCenter.editForm.recipientsSet.sendTo'),
        hiddenName:'recipientType',
        width: 100
    });

    recipientGroupBox = new Ext.form.ComboBox({
        store: groupJsonStore, //use store for group list
        displayField: 'groupName',
        valueField: 'groupName',
        typeAhead: false,
        editable: false,
        mode: 'local',
        triggerAction: 'all',
        emptyText: getLocalizationValue('application.javascript.messageCenter.editForm.groupCombobox.emptyText'),
        forceSelection: true,
        selectOnFocus: false,
        allowBlank: false,
        //resizable: false,
        fieldLabel: getLocalizationValue('application.javascript.messageCenter.editForm.recipientsSet.group'),
        disabled: true,
        //anchor:'50%',
		hiddenName:'groups',
        width: 110
    });
    
    // disable/enable groups combobox if recipient is 'All' 
    recipientType.on('select', onSelectingRecipentTypefunction);

	// load the groups when the combo box is expanded (the groups list can be updated on the server side)
	recipientGroupBox.on('expand', function(combo) {
		groupJsonStore.removeAll();
        groupJsonStore.load( {params: { method: "loadGroup" } } ); 
    });
    
    var recipientsSet = new Ext.form.FieldSet({
        title: getLocalizationValue('application.javascript.messageCenter.editForm.recipientsSet.title'),
        collapsible: false,
        autoHeight:true,
        bodyStyle:'padding: 2px 0px 2px 2px', 
		width: 280,
        items:[
            {
                layout: 'column',
                items:[{
                    columnWidth:.5,
                    layout: 'form',
                    style: 'padding: 0px 3px 0px 3px',
			        items:[recipientType]
                },{
                    columnWidth:.5,
                    style: 'padding: 0px 0px 0px 3px',
                    layout: 'form',
                    items: [recipientGroupBox]
                }]
            }
        ]
    });

    return recipientsSet;
}



//disbale group name when selecting recipientType
function onSelectingRecipentTypefunction() {
	if(recipientType== null || recipientType.value == null){
		return;
	}

   	var newValIsAll = (recipientType.value == 'ALL');
    recipientGroupBox.setDisabled(newValIsAll);
    //if the group type is all, clear the invalidation on the group box
    if (newValIsAll){
    	recipientGroupBox.clearInvalid(); 
    }
          
}



// show the edit message window
function showMessageWindow(title, record) {
	if (title != null){
		mainWindow.setTitle(title);
		//mainWindow.renderTo(Ext.getBody());
	}
    mainWindow.show();
    if (record != null) {
        // fill in all fields if message exists
        mainForm.getForm().loadRecord(record);
        onSelectingRecipentTypefunction();
    } else {
        //clear all fields and set default values for new message
        mainForm.getForm().reset();

        // Set the current date to the "creationDateHidden" hidden field 
        // as the server side is expecting it
        //var currDateTime = new Date().format(MESSAGES_DATE_FORMAT + " " + MESSAGES_TIME_FORMAT);
        var currDateTime = new Date().format("m-d-Y H:i");
        
        
        //Set the default date and time for fields displayDateFrom and displayDateTo
        
        var futureDate = new Date();
        var expdate = futureDate.getDate() + 1;
        futureDate.setDate(expdate);
       
        
        creationDateHidden.setValue(currDateTime);
        displayDateFrom.setValue(currDateTime);
        displayDateTo.setValue(futureDate);
        colorField.setValue('FFFFFF');
      
        
        
        // set active all location destination by default
        tickerTapeCheckbox.setValue(true);
        splashCheckbox.setValue(true);
        boardCheckbox.setValue(true);
        // set default priority level
        priorityLevelCombo.setValue(3);
        // set default recipient
        recipientType.setValue('ALL');
        recipientGroupBox.setDisabled(recipientType.value == 'ALL');  
        //bug ws-297 active tab should always be the mandatory and not the optional
        tabPanel.setActiveTab(tabPanel.getItem('mandatorySet'));
        
    }
}
/*
This private function is responsible for acting aupon a change of state of locations.
allDisabledFlag - boolean flag indicating whether all locations are disabled
*/
function onLocationsStateChange(allDisabledFlag){
	ReadOnceChbox.setDisabled(allDisabledFlag);
    enableRepeat.setDisabled(allDisabledFlag);
    if (allDisabledFlag){
	    var title = getLocalizationValue('application.javascript.messageCenter.editForm.title');
		var msg = getLocalizationValue('application.javascript.messageCenter.editForm.validation.noLocationsWarning');
			
		Ext.MessageBox.alert(title, msg);
	}
    
}
