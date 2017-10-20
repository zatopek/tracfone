Ext.define('Jacada.system.ui.conversationHistory.AgentHistoryPanel', {
	extend : 'Ext.grid.Panel',
	itemId : 'conversationHistoryPanel',
	minHeight: 200,
	height: 800,
	border: false,
	autoScroll: true,
	bodyStyle : 'background:none',
	maxNumberOfRows: 2500,
	maxDaysOld: 100,
	TYPE_EMAIL: '2D3B269B-D04D-44BB-A734-83037FD0C4BF',
	TYPE_CHAT: '76DCA267-112E-40A9-A538-487B346F8F9A', 
	TYPE_VOICE: '2E059E8E-8A55-4CFF-AB76-3FC96754D720',
	CLICKABLE_COLUMN_INDEX : 0,
	observerAllEvents: true,
	pushHandler: null, //keeps a reference to push handler function

	initComponent : function() {
		var me = this;
		tm = new Ext.util.TextMetrics();
		me.createModel();
		Ext.applyIf(me,{
			store: me.createStore(me),
			columns:me.createColumns(me),
			viewConfig: me.getViewConfig(me),
			dockedItems:[{
		        xtype: 'toolbar',
		        itemId: 'searchToolbar',
		        padding: '5 10 5 10',
		        dock: 'top',
		        defaults:{
		        	labelWidth: 50,
		        	padding: '5 10 5 10',
		        	enableKeyEvents: true,
	 	        	listeners: {
	 	        		keypress: function(textfield, e, eOpts){
	 	        			if(e.getKey() == e.ENTER){
	 	        				me.searchConversation(me);
	 	        			}
	 	        		},
	 					change: function( _this, newValue, oldValue, eOpts ){
	 						me.validateInput(me);
	 					}
	 	        	}
		        },
		        items:[{
						xtype: 'textfield',
						itemId: 'searchAgentIdField',
						fieldLabel: me.getLocalizedValue('search.agentId'),
						value: $W().agentCTIName == "null"?'':$W().agentCTIName,
						padding: '5 0 5 0',
						width: 130,
						hidden: !me.isAgentIdFilterVisible()
					},{
						xtype: 'numberfield',
						itemId: 'searchDaysOldField',
						fieldLabel: me.getLocalizedValue('search.daysOld'),
						width: 120,
						value: me.getDaysOldDefaultValue(),
						maxValue: me.maxDaysOld,
				        minValue: 0
					}, {
						xtype: 'numberfield',
						itemId: 'searchNumberOfRowsField',
						fieldLabel: me.getLocalizedValue('search.numberOfRows'),
						width: 140,
						labelWidth: 60,
						value: 100,
						maxValue: me.maxNumberOfRows,
				        minValue: 0
					},{
							xtype: 'button',
							cls: 'actionButton',
							itemId: 'searchButton',
							width: 100,
					        text: me.getLocalizedValue('search.searchButtonLabel'),
					        handler: function(){
					        	me.searchConversation(me);
					        }
						},{
						xtype: 'panel',
						itemId: 'resultsMessagePanel',
						bodyStyle : 'background:none',
						border: false,
						items:[{
				    		xtype: 'label',
				    		itemId: 'resultsMessageLabel',
				    		margins: '5 5 5 10',
				    		html: me.getLocalizedValue('search.message'),
				    		cls: 'textAlertColor',
				    		hidden: true
						}]
					}]
			}],
			listeners:{
				contextStarted: function(type, data){
        			if(this.loadingItem && data.interactionId && (data.interactionId.toLowerCase() == this.loadingItem.interactionId.toLowerCase())){
    		    		me.cancelTimeout(me);
        			}
        		},
        		contextTabChanged: function(type, data){
        			me.onContextTabChanged(type, data);
        		},
        		//to avoid push handlers leak, we need to unregister the handler 
        		destroy: function(thisPanel, eOpts){
        			thisPanel.unregisterForMessages();
        		}
			}
		});
		me.callParent(arguments);
		me.searchConversation(me);
		Ext.getCmp('contextNavigation').registerContextListener(me);
		me.registerForMessages();
	},
	onContextTabChanged: function(type, data){
		var me = this;
		//in case history item already loaded, we won't get contextStarted event
		if(this.loadingItem && (data.itemId.toLowerCase().indexOf(this.loadingItem.interactionId.toLowerCase())>0)){
    		me.cancelTimeout(me);
		}
	},
	validateInput: function(me){
		var searchButton = me.down('#searchButton');
		var daysOldField = me.down('#searchDaysOldField');
		var numberOfRowsField = me.down('#searchNumberOfRowsField');
		if(!daysOldField.isValid() || !numberOfRowsField.isValid() ){
			searchButton.disable();
			return false;
		}else{
			searchButton.enable();
			return true;
		}
	},
	getDaysOldDefaultValue: function(){
		return 1;
	},
	getViewConfig: function(me){
		return{
			listeners: {
				itemdblclick: function(dataview, record, item, index, e) {
					me.retrieveMediaItem(record.data);
				},
				cellclick : function(view, cell, cellIndex, record,row, rowIndex, e) {
					me.handleCellClicked(cellIndex, record.data);
				}
			}
		};
	},
	handleCellClicked: function(cellIndex, data){
		if(this.getClickableCellIndex() == cellIndex){
			this.retrieveMediaItem(data);
		}
	},
    getSelected: function(me){
    	var selection = me.getView().getSelectionModel().getSelection()[0];
         if (selection) {
             return selection.data;
         }
         return null;
    },
    retrieveMediaItem:function(data){
    	var me = this;
    	if(!me.canOpenHistoryItem(data)){
    		return;
    	}
    	me.loadingItem = data;
    	this.setLoading(this.getLocalizedValue('loadingText'));
    	me.loadingTimeout = setTimeout(function(){
    		me.cancelTimeout(me);
    	}, 60000);
		Jacada.Logger.debug("retrieveMediaItem " + me.getId() + ", timeout set " + me.loadingTimeout + ", interactionId: " + data.interactionId);
    	var params = {
    			interactionId: data.interactionId
    	};
    	
    	if(!this.observerAllEvents){
    		var contextNavigation = Ext.getCmp('contextNavigation');
    		contextNavigation.registerContextListener(me, contextNavigation.buildGroupId(data.interactionId, data.type));
    	}
    	
        $W().mediaAPI.clickButton('retrieveMediaItem', data.interactionId, data.type, params);
	},
	cancelTimeout: function(){
		Jacada.Logger.debug("cancelTimeout " + this.getId() 
				+ "loadingTimeout: " + this.loadingTimeout + ", interactionId: " + this.loadingItem);
		if(this.loadingTimeout){
			clearTimeout(this.loadingTimeout);
		}
    	if(!this.observerAllEvents){
    		var contextNavigation = Ext.getCmp('contextNavigation');
    		contextNavigation.unregisterContextListener(this, contextNavigation.buildGroupId(this.loadingItem.interactionId, this.loadingItem.type));
    	}
    	this.loadingItem = null;
    	this.loadingTimeout = null;
    	this.setLoading(false);
	},
	isAgentIdFilterVisible: function(){
		return true;
	},
	searchConversation: function(me){
		me.getStore().removeAll();
		if(!me.validateInput(me)){return;}
		var agentIdFieldValue = me.down('#searchAgentIdField').getValue();
		if(!agentIdFieldValue || agentIdFieldValue.trim().length == 0){
			var searchMsg = me.down('#resultsMessageLabel');
			searchMsg.show();
			return;
		}
		var daysOldFieldValue = me.down('#searchDaysOldField').getValue();
		var numberOfRowsValue = me.down('#searchNumberOfRowsField').getValue();
		var store = me.getStore();
		store.getProxy().jsonData = {agentId: agentIdFieldValue, daysOld: daysOldFieldValue, numberOfRows: numberOfRowsValue};
		store.load();
	},
	createColumns: function(me){
		return [{text: me.getLocalizedValue('grid.column.type'), dataIndex: 'type', renderer: me.conversationDataCellRenderer, width: 70},
		        {text: me.getLocalizedValue('grid.column.fromAddress'), dataIndex: 'fromAddress', renderer: me.conversationDataCellRenderer, width: 120},
		        {text: me.getLocalizedValue('grid.column.toAddress'), dataIndex: 'toAddress', renderer: me.conversationDataCellRenderer,width: 120},
		        {text: me.getLocalizedValue('grid.column.subject'), dataIndex: 'subject', renderer: me.conversationDataCellRenderer, flex: 1, minWidth: 120},
		        {text: me.getLocalizedValue('grid.column.state'), dataIndex: 'state', renderer: me.conversationDataCellRenderer},
		        {text: me.getLocalizedValue('grid.column.established'), dataIndex: 'established', renderer: me.conversationDataCellRenderer},
		        {text: me.getLocalizedValue('grid.column.closed'), dataIndex: 'closed', renderer: me.conversationDataCellRenderer},
		        {text: me.getLocalizedValue('grid.column.suspendTo'), dataIndex: 'suspendTo', renderer: me.conversationDataCellRenderer},
		        {text: me.getLocalizedValue('grid.column.suspendReason'), dataIndex: 'suspendReason', renderer: me.conversationDataCellRenderer, flex: 1, minWidth: 130}];
	},
	createModel: function(){
		var me = this;
		Ext.define('ConversationModel',{
			extend:'Ext.data.Model',
			fields: me.getModelFields(me),
			idProperty: 'interactionId'
		});

	},
	getServiceUrl: function(){
		return $W().contextPath + '/rest/conversationHistory/search/agent';
	},
	getModel: function(){
		return 'ConversationModel';
	},
	getModelFields: function(me){
		return [
		        {name: 'type', mapping:'attributes.serverInstanceType', sortType: 'asUCString', convert:me.typeFieldConverter.bind(me)},
		         {name: 'fromAddress', mapping:'attributes.fromAddress', sortType: 'asUCString', convert:me.emailFieldConverter},
		         {name: 'toAddress', mapping:'attributes.toAddress', sortType: 'asUCString', convert:me.emailFieldConverter},
		         {name: 'subject', mapping:'attributes.subject', sortType: 'asUCString', convert:me.emailFieldConverter},
		         {name: 'state', mapping: 'attributes.state', sortType: 'asUCString'},
		         {name: 'established', mapping: 'attributes.establishedDateTime'},
		         {name: 'closed', mapping: 'attributes.closedDateTime'},
		         {name: 'suspendTo', mapping: 'attributes.suspendToDateTime'},
		         {name: 'suspendReason', mapping: 'attributes.suspendReason', sortType: 'asUCString', convert:me.emailFieldConverter},
		         {name: 'interactionId', mapping: 'attributes.interactionId'},
		         {name: 'conversationId', mapping: 'attributes.conversationId'}];
	},
	typeFieldConverter: function(value, record){
		if(value == this.TYPE_EMAIL){
			return "email";
		}
		if(value == this.TYPE_CHAT){
			return "chat";
		}
		if(value == this.TYPE_VOICE){
			return "voice";
		}
	},
	emailFieldConverter: function(value, record){
		if(!value){
			return '';
		}
		value = value.replace(/\"/g, '');
		value = Ext.String.htmlEncode(value);
		return value;
	},
	createStore: function(me){
		return{
			xtype: 'store',
			model: me.getModel(),
			itemId: 'conversationStore',
			proxy:{
				itemId: 'conversationStoreProxy',
				type: 'rest',
				url: me.getServiceUrl(),
				limitParam: false,
                startParam: false,
                pageParam: false,
                actionMethods: {create: 'POST', read: 'POST', update: 'POST', destroy: 'POST'},
                headers : {
        		    'accept': 'application/json'		    
        		},
				reader:{
					type: 'json',
					root: 'conversations',
					totalProperty: 'totalCount'
				},
				writer: {
					type: 'json',
					encode: true
				},
	            doRequest: function(operation, callback, scope) {//allow sending json using post
	                var writer  = this.getWriter(),
	                    request = this.buildRequest(operation, callback, scope);
	                   
	                if (operation.allowWrite()) {
	                    request = writer.write(request);
	                }
	               
	                Ext.apply(request, {
	                    headers       : this.headers,
	                    timeout       : 700000,
	                    scope         : this,
	                    callback      : this.createRequestCallback(request, operation, callback, scope),
	                    method        : this.getMethod(request),
	                    jsonData        : this.jsonData,
	                    disableCaching: false // explicitly set it to false, ServerProxy handles caching
	                });
	                Ext.Ajax.request(request);               
	                return request;
	            }
			},
			listeners:{
                load: function( _this, records, successful, eOpts ){
                	var searchMsg = me.down('#resultsMessageLabel');
                	if(records){
                		records.size() == 0 ? searchMsg.show() : searchMsg.hide();
                	}else{
                		_this.removeAll();
                		searchMsg.show();
                	}
                }
             }
			
		};
	},
    /**
     * Custom function used for column renderer
     */
    conversationDataCellRenderer: function(value, metaData, record, row, col, store, gridView) {
    	var me = this;
    	var dataIndex = metaData.column.dataIndex;
    	var plainValue;
    	if(dataIndex == 'established' || dataIndex == 'closed' || dataIndex == 'suspendTo'){
    		if(value){
    			var timezoneOffset =  new Date(value).getTimezoneOffset() * 60000;
    			value = Ext.Date.format(new Date(value-timezoneOffset), DATE_FORMAT + " " + TIME_FORMAT);
    		}
    	}else if(dataIndex == 'state'){
    		value =  $W().localeManager.getLocalizationValue('application.javascript.agentHistory.state.' + value);
    	}else if(dataIndex == 'type'){
    		if(value == "email"){
    			metaData.tdCls = 'emailContext-small';
    		}else if(value == "voice"){
    			metaData.tdCls = 'voiceContext-small';
    		}else if(value == "chat"){
    			metaData.tdCls = 'chatContext-small';
    		}
    		value =  $W().localeManager.getLocalizationValue('application.javascript.agentHistory.type.' + value);
    		if(me.canOpenHistoryItem(record.data)){
    			plainValue = value;
    			value = '<a href="#">' + value + '</a>';
        	}
    	}
    	
    	if(!value){
    		value = '';
    		plainValue = '';
    	}else if(!plainValue){
    		plainValue = value;
    	}
    	//value = Ext.String.htmlEncode(value);
    	//add tooltip to all cells
    	metaData.tdAttr = 'data-qtip="' + Ext.String.htmlEncode(plainValue) + '"';
    	
        return value;
    },
    canOpenHistoryItem: function(data){
    	if(data.state == 7){ //closed
        	return true;
        }
    	return false;
    },
	getLocalizedValue: function(key){
		return $W().localeManager.getLocalizationValue('application.javascript.agentHistory.'+key);
	},
	getClickableCellIndex: function() {
        return this.CLICKABLE_COLUMN_INDEX;
    },
    updateWorkItem: function(workItemStr) {
        var me = this;
        var workItem = JSON.parse(workItemStr);
        var record = this.getStore().getById(workItem.uniqueId);
        Jacada.Logger.debug('HistoryPanel.updateWorkItem ' + me.getId() + ' uniqueId: ' 
        		+ workItem.uniqueId + ', WorkItemState: ' + workItem.WorkItemState + ', record: ' + record);
        if (record != undefined) {
            record.data.state = workItem.WorkItemState;
            record.commit();
        }
    },
    registerForMessages: function() {
    	this.pushHandler = this.updateWorkItem.bind(this);
        $W().Push.registerEventHandler( 'UpdateWorkItemHistory', this.pushHandler);
    },
    unregisterForMessages: function() {
        $W().Push.unregisterEventHandler( 'UpdateWorkItemHistory', this.pushHandler);
    }
});//Conversation History panel End
