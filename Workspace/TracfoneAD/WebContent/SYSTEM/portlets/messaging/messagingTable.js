var ITEMS_ON_PAGE = 10;
var grid, jsonStore, viewPanelTemplate, groupJsonStore, selectionModel, deleteButton, viewPanel;

   
                           
Ext.onReady( function() {
    registerForMessages();

	// store for messages
    jsonStore = new Ext.data.JsonStore( {
        root: 'messages',
        totalProperty: 'totalCount', 
        remoteSort:true,//bug ws-729 this is for sorting in the server, we cannot sort in client because of pagination
        sortInfo: { // this will hold thw sort info during the sorting, upon login we want the sorting to be creationDate-ascending
			field: 'creationDate',
			direction: 'ASC'
			},  
		/*
		Important note regrding the fields: as part of bugfix ws-729 we perfore server-sort by sending the field to be sorted.
		The sorted field is one of the list below and must match the fields existing in Message.java class otherwise the sort will throw an excpetion.
		So if a field in Message.java changes we also need to change here.
		*/	
        fields: [
            {name:'id'}, 
            {name:'subject', type:'string'}, 
            {name:'content', type:'string'}, 
            {name:'creationDate', type:'string'},
            {name:'activationDate', type:'string'},
            {name:'expiryDate', type:'string'},,
            {name:'repeating', type:'boolean'},
            {name:'repeatingPeriodType', type:'string'},            
            {name:'recipientType', type:'string'},
			{name:'groups', type:'string'},
            {name:'readOnce', type:'boolean'},
            {name:'showOnWelcomeScreen', type:'boolean'},
            {name:'showOnMessageBoard', type:'boolean'},
            {name:'showOnTickerTape', type:'boolean'},
            {name:'flashOnTickerTape', type:'boolean'},
            {name:'pauseOnTickerTape', type:'boolean'},
            {name:'priorityLevel', type:'int'},
            {name:'colorOnTickerTape', type:'string'},
            {name:'mustRead', type:'boolean'}
            ],
        listeners: {
            loadexception: function(proxy, store, response, e) {
                alert(getLocalizationValue('application.javascript.messageCenter.loadMessage.warning') + e);
            }
        },
        
        url: MESSAGING_JSON_URL
    }); 

    jsonStore.load( {params: { start: 0, limit: ITEMS_ON_PAGE } } );
        
    // store for groups    
    groupJsonStore = new Ext.data.JsonStore( {
        root: 'groups',
        fields: [ {name:'groupName'} ],
        listeners: {
            loadexception: function(proxy, store, response, e) {
                alert(getLocalizationValue('application.javascript.messageCenter.loadGroup.warning') + e);
            }
        },
        url: MESSAGING_JSON_URL
    });
    groupJsonStore.load( {params: { method: "loadGroup" } } );
        
    deleteButton = new Ext.Button({
        text: getLocalizationValue('application.javascript.messageCenter.deleteButton'),
        disabled: true,
        handler: onDeleteItems
    });
        
    var pagingBar = new Ext.PagingToolbar({
        pageSize: ITEMS_ON_PAGE,
        store: jsonStore,
        displayInfo: true,
        displayMsg: getLocalizationValue('application.javascript.messageCenter.filledGrid.message'), //'Displaying items {0} - {1} of {2}',
        emptyMsg: getLocalizationValue('application.javascript.messageCenter.emptyGrid.message'),
        items:[
            '-', 
            deleteButton
            , {
                text: getLocalizationValue('application.javascript.messageCenter.addButton'),
                handler: onAddItem
            } 
        ]
    });    
        
    var model = new Ext.grid.ColumnModel([
        { header:getLocalizationValue('application.javascript.messageCenter.column.subject'), width:150, dataIndex:'subject', sortable:true },
        { header:getLocalizationValue('application.javascript.messageCenter.column.content'), width:150, dataIndex:'content', renderer: renderMsgBody, sortable:true},
        { header:getLocalizationValue('application.javascript.messageCenter.column.recipient'), width:100, dataIndex:'recipient', renderer: renderRecipient, sortable:true },
        { header:getLocalizationValue('application.javascript.messageCenter.column.activationDate'),  width:100, dataIndex:'activationDate', sortable:true, renderer: renderDate },
        { header:getLocalizationValue('application.javascript.messageCenter.column.expirationDate'), width:100, dataIndex:'expiryDate', sortable:true, renderer: renderDate }
    ]);
                
    selectionModel = new Ext.grid.RowSelectionModel( {singleSelect: false} );

    selectionModel.on('selectionchange', function(model){
        if (model.getCount() == 0){
            // disable Delete button
            deleteButton.disable();
            viewPanel.hide();

        }
        else {
            deleteButton.enable();
            viewPanel.show();

        }
    });

    selectionModel.on('rowselect', function(model, rowIndex, record){
        var data = jsonStore.getAt(rowIndex).data;
        viewPanel.getForm().loadRecord(record);
        Ext.getCmp('subjectDetailsField').getEl().update(data.subject+'<hr/>');
        Ext.getCmp('contentDetailsField').getEl().update(data.content);
        viewPanel.show();
        
    });
    
    // message grid for message center
    grid = new Ext.grid.GridPanel( {
        ds: jsonStore,
        autoHeight: true,
        cm: model,
        sm: selectionModel, 
        renderTo: 'messageListDiv',
        bbar: pagingBar,
        cls: 'overrideExtjsStyling',
        viewConfig: {forceFit: true}
    });
      
    grid.on('rowdblclick', function(grid, rowIndex, e) {
    	var editTitle = getLocalizationValue('application.javascript.messageCenter.editForm.editTitle');
        showMessageWindow(editTitle, jsonStore.getAt(rowIndex));
    });  

    //grid.render();
    //-----------------------------------
    var locations = [{
            xtype:'checkbox',
            fieldLabel: getLocalizationValue('application.javascript.messageCenter.editForm.locationSet.welcomeScreen'),
            name: 'showOnWelcomeScreen',
            disabled: true
        },{
            xtype:'checkbox',
            fieldLabel: getLocalizationValue('application.javascript.messageCenter.editForm.locationSet.messageBoard'),
            name:'showOnMessageBoard',
            disabled: true
        }
        ];
    //if the ticker tape is enabled adding this section too
    if (tickerTapeEnabled){
    	locations[locations.length] = {
                xtype:'checkbox',
                fieldLabel:getLocalizationValue('application.javascript.messageCenter.editForm.locationSet.tickerTape'),
                name: 'showOnTickerTape',
                disabled: true
            };
    }
        
    viewPanel = new Ext.FormPanel({
        title: getLocalizationValue('application.javascript.messageCenter.messageDetails'),
        collapsible:true,
        renderTo: 'viewPanelDiv',
        autoHeight:true,
        items: [
            {   
                style: 'padding: 2px 10px 2px 10px;',
                xtype: 'box',
                id:'subjectDetailsField',
                cls:'x-form-item',
                autoEl: {cn: '<br/> <hr/>'}
            },
            {   
                style: 'padding: 2px 10px 2px 10px;',
                xtype: 'box',
                id:'contentDetailsField',
                cls:'x-form-item',
                autoEl: {cn: ''}
            },
            {
            layout:'column',
            defaultType:'fieldset',
            style: 'padding: 2px 10px 2px 10px;',
            border:false,
            items:[
            {
                columnWidth:.5,
                layout: 'form',
                title:getLocalizationValue('application.javascript.messageCenter.editForm.locationSet.title'),
                width:'450px',
                height:'450px',
                style: 'padding: 2px 5px 2px 5px;margin: 2px;',
                items: locations
            },
            {
                columnWidth:.5,
                width:'450px',
                height:'450px',
                layout: 'form',
                title:getLocalizationValue('application.javascript.messageCenter.editForm.propertiesSet.title'),
                style: 'padding: 2px 5px 2px 5px;margin: 2px;',
                items: [{
                    xtype:'checkbox',
                    fieldLabel: getLocalizationValue('application.javascript.messageCenter.editForm.propertiesSet.mustRead'),
                    name: 'mustRead',
                    disabled: true
                }, {
                    xtype:'checkbox',
                    fieldLabel: getLocalizationValue('application.javascript.messageCenter.editForm.propertiesSet.readOnce'),
                    name: 'readOnce',
                    disabled: true
                }]
            }]
        }]

    });

    viewPanel.hide();
    //-----------------------------------


});

// return message content as one line 
function renderMsgBody(value, p, record) {
    var contentnInOneLine = record.data.content.replace(/<\s*BR\s*\/?\s*>*/gi, " ");
    return contentnInOneLine;//value;
}

function renderDate(value, metaData, record, rowIndex, colIndex, store){
	return value;//.format(MESSAGES_DATE_FORMAT + " " + MESSAGES_TIME_FORMAT);
}

// return recipient or group name for specified message
function renderRecipient(value, p, record){
    if (record.data.recipientType == 'ALL'){
        return 'All';
    }
    return record.data.groups;

}

// show confirmation before deleting
function onDeleteItems() {
    var m = grid.getSelectionModel().getSelections();
    if(m.length > 0)
    {

        Ext.Msg.confirm(getLocalizationValue('application.javascript.messageCenter.deleteConfirmation.title'), getLocalizationValue('application.javascript.messageCenter.deleteConfirmation.message'), function(btn){
            if (btn == 'yes'){
                deleteMessages();
            }
        });
    }
}

// delete selected message
function deleteMessages()
{
    var selectedItems = grid.getSelectionModel().getSelections();
    var s = "";
    for (var i = 0; i < selectedItems.length; i++) {             
        s = (s == "" ? "" : s + ":") + selectedItems[i].get("id");                  
    }
    if (s != "") {
        jsonStore.load( {params: { start: 0, limit: ITEMS_ON_PAGE, delData: s, method: "delete"} } );
    }
}   

// method shows message edit window for new message
function onAddItem() {
	var addTitle = getLocalizationValue('application.javascript.messageCenter.editForm.title');
    showMessageWindow(addTitle);
}

// method saves created/updated message 
function onSaveMessage(values) {
	var realValues = {};
    for (var key in values) {
        if (key.indexOf("ext-comp-") < 0) 
            realValues[key] = values[key];
    }
    
    //replace the combobox display name in the real numeric id
    realValues.priorityLevel = priorityLevelCombo.value;   
    //submit the updated fields to the server because the values in the formPanel are not always up-to-date
    realValues.activationDate=displayDateFrom.getValue().format("m-d-Y H:i");
    realValues.expirationDate=displayDateTo.getValue().format("m-d-Y H:i");
    
    var obj = Ext.util.JSON.encode(realValues);
    jsonStore.load( { params: { start: 0, limit: ITEMS_ON_PAGE, method: "update", object: obj} } ); 
    
    //WS-1653 removing the params method after it was sent to the server, so that next time we sort it will not be sent to server as part of the lastOptions of the store
	delete jsonStore.lastOptions.params.object;
	delete jsonStore.lastOptions.params.method;
}

//workaround for bug ws-782, the problem is that the displayFrom/dispalyTo are not updated immediately with the new values , so
//in case the user updated these fields and cliked "save" imeediately then update these fileds
function updateDateFields(){
	displayDateFrom.updateDate();   
	displayDateFrom.updateTime();
	displayDateFrom.updateHidden();
	
	displayDateTo.updateDate();   
	displayDateTo.updateTime();
	displayDateTo.updateHidden();
	
}

// method is called after getting push notification and updates message from datatable
function doRefresh(){
    jsonStore.load( {params: { start: 0, limit: ITEMS_ON_PAGE } } );
}

// registration push notification event
function registerForMessages(){
        $W().Push.registerEventHandler( 'UPDATE_NOTIFICATION', doRefresh);
}

