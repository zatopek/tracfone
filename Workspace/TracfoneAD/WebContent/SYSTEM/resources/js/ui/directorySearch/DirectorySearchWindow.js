Ext.define('Jacada.system.ui.directorySearch.DirectorySearchWindow', {
	extend: 'Ext.window.Window',
	
	INPUT_FIELD: 'searchInputField',
	SEARCH_BTN: 'searchBtn',
	DISPLAY_BTN: 'displayBtn',
	
	height: 500,
	width: 700,
	minHeight: 500,
    minWidth: 700,
	layout: 'fit',
	resizable: true,
	collapsible: false,
	constrain: true,
	draggable: true,
	border: false,
	modal: true,
	closeAction: 'hide',
	itemId: 'directorySearchW',
	title: $W().localeManager.getLocalizationValue('application.javascript.directorySearch.window.title'),
	inputPanel: null,
	resultPanel: null,
	currentData: null,
	displayBtn: null,
	
	initComponent: function() {
		var me = this;
		var items = [];
		items.push(me.buildSearchInputPanel());
		items.push(me.buildSearchResultPanel());
		
        items = items.compact();
        Ext.applyIf(me, {
        	items: {
        		xtype: 'panel',
        		bodyStyle : 'background:none',
        	    bodyCls: 'baseColor',
        		layout: {
        	    	type: 'vbox',
        	    	align: 'stretch',
        	    	border: false
        	    },
        	    defaults: {
        	    	border: false
        	    },
        		items: items
        	},
        	buttons: me.buildToolbarButtons(),
        	listeners: {
        		show: me.onBeforeDirectorySearchShow,
        		hide: me.onDirectorySearchHide
        	}
        });
        me.callParent(arguments);
        me.registerForMessages();
	},
	registerForMessages: function(){
		$W().Push.registerEventHandler('multipleSearchResult', this.onMultipleSearchResult.bind(this));
	},
	buildToolbarButtons: function(){
		var me = this;
		var buttons = [];
		this.displayBtn = Ext.create('Ext.button.Button', {
    		text: $W().localeManager.getLocalizationValue('application.javascript.directorySearch.display.button'),
  	        width: '100px',
  	        itemId: me.DISPLAY_BTN,
  	        style: 'margin:2px',
  	        disabled: true,
  	        handler: function(){
  	        	me.onContactSelect(me);
  	        }
	    });
		buttons.push(this.displayBtn);
	    buttons.push({
	    	text: $W().localeManager.getLocalizationValue('application.javascript.directorySearch.cancel.button'),
	    	width: '100px',
	    	itemId: 'cancelBtn',
	    	style: 'margin:8px',
	    	handler: function(){
	    		me.close();
	    	}
	    });
	    return buttons;
	},
	buildSearchInputPanel: function(){
		var me = this;
		var inputPanel = Ext.create('Ext.form.Panel', {
			layout: 'hbox',
			padding: '10 5 10 5',
			border: false,
			items: [
			    {
			    	xtype: 'textfield',
			    	itemId: me.INPUT_FIELD,
			    	padding: '0 10 3 5',
			    	flex: 1,
		        	enableKeyEvents: true,
	 	        	listeners: {
	 	        		keypress: function(textfield, e, eOpts){
	 	        			if(e.getKey() == e.ENTER){
	 	        				me.searchDirectory();
	 	        			}
	 					},
	 					change: function( _this, newValue, oldValue, eOpts ){
	 						me.validateFields();
	 					}
	 	        	}
			    },
			    {
			    	xtype: 'button',
			    	cls: 'actionButton',
			    	itemId: me.SEARCH_BTN,
			    	disabled: true,
			    	text: me.getLocalizedValue('search.button'),
			    	handler: me.searchDirectory,
			    	scope: me
			    }
			]
		});
		this.inputPanel = inputPanel;
		return inputPanel;
	},
	
	buildSearchResultPanel: function(){
		var me = this;
		var store = me.buildSearchResultStore(me);
		var resultPanel = Ext.create('Ext.grid.Panel', {
			itemId: 'searchResultGrid',
			flex: 1,
			emptyText: '<div class="searchResults-empty" id="searchResults-empty" >'+$W().localeManager.getLocalizationValue('application.javascript.search.no.results.panel.title')+'</div>',
			padding: '10 5 10 5',
			title: me.getLocalizedValue('contacts.title'),
			store: store,
			viewConfig: me.getViewConfig(me),
			columns: me.buildSearchResultColumns(me)
		});
		this.resultPanel = resultPanel;
		return resultPanel;
	},
	buildSearchResultStore: function(me){
		var model = me.buildModel();
		return Ext.create('Ext.data.Store', {
			xtype: 'store',
			model: model,
			itemId: 'directorySearchStore',
			proxy: {
				itemId: 'directorySearchStoreProxy',
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
					root: 'contacts',
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
	                    timeout       : this.timeout,
	                    scope         : this,
	                    callback      : this.createRequestCallback(request, operation, callback, scope),
	                    method        : this.getMethod(request),
	                    jsonData        : this.jsonData,
	                    disableCaching: false // explicitly set it to false, ServerProxy handles caching
	                });
	                Ext.Ajax.request(request);               
	                return request;
	            }
             }
		});
	},
	getServiceUrl: function(){
		return $W().contextPath + '/rest/customers/search/customers';
	},
	getContactLoadUrlPrefix: function(){
		return $W().contextPath + '/rest/customers/search/customer/select';
	},
	buildModel: function(){
		var me = this;
		Ext.define('DirectorySearchModel',{
			extend:'Ext.data.Model',
			fields: me.getModelFields(me),
			idProperty: 'contactId'
		});
		return 'DirectorySearchModel';
	},
	getModelFields: function(me){
		return [ {name: 'firstName', mapping:'attributes.FirstName'},
		         {name: 'lastName', mapping:'attributes.LastName'},
		         {name: 'homePhone', mapping:'attributes.HomePhone'},
		         {name: 'mobilePhone', mapping:'attributes.MobilePhone'},
		         {name: 'businessPhone', mapping: 'attributes.BusinessPhone'},
		         {name: 'email', mapping: 'attributes.EmailAddress'},
		         {name: 'contactId', mapping: 'attributes.ContactId'}
		 ];
	},
	buildSearchResultColumns: function(me){
		return [{text: me.getLocalizedValue('grid.column.firstName'), dataIndex: 'firstName', renderer: me.searchResultsDataCellRenderer, flex: 1},
		        {text: me.getLocalizedValue('grid.column.lastName'), dataIndex: 'lastName', renderer: me.searchResultsDataCellRenderer, flex: 1},
		        {text: me.getLocalizedValue('grid.column.home'), dataIndex: 'homePhone', renderer: me.searchResultsDataCellRenderer, flex: 1},
		        {text: me.getLocalizedValue('grid.column.mobile'), dataIndex: 'mobilePhone', renderer: me.searchResultsDataCellRenderer, flex: 1},
		        {text: me.getLocalizedValue('grid.column.business'), dataIndex: 'businessPhone', renderer: me.searchResultsDataCellRenderer, flex: 1},
		        {text: me.getLocalizedValue('grid.column.email'), dataIndex: 'email', renderer: me.searchResultsDataCellRenderer, flex: 1}
		];
	},
	searchResultsDataCellRenderer: function(value, metaData, record, row, col, store, gridView) {
    	//add tooltip to all cells
		if(value){
			metaData.tdAttr = 'data-qtip="' + Ext.String.htmlEncode(value) + '"';
		}
		return value;
	},
	getViewConfig: function(me){
		return{
			listeners: {
				itemdblclick: function(dataview, record, item, index, e) {
					me.onContactSelect(me);
				},
				itemclick: function(dataview, record, item, index, e) {
					me.displayBtn.enable();
				}
			}
		};
	},
	emailFieldConverter: function(value, record){
		if(!value){
			return '';
		}
		value = value.replace(/\"/g, '');
		value = Ext.String.htmlEncode(value);
		return value;
	},
	onBeforeDirectorySearchShow: function(this_, eOpts){
		$W().HideCurrentVisibleTab();
	},
	onDirectorySearchHide: function(this_, eOpts){
		$W().ShowCurrentVisibleTab();
		this.currentData = null;
		this.resultPanel.getStore().removeAll();
		var searchBtn = this.inputPanel.getComponent(this.SEARCH_BTN).disable();
		this.inputPanel.getComponent(this.INPUT_FIELD).setValue("");
		this.displayBtn.disable();
		//clean empty text value
		document.getElementById("searchResults-empty").innerHTML='';
		//TODO abort request
	},
	validateFields: function(){
		var inputFld = this.inputPanel.getComponent(this.INPUT_FIELD).getValue();
		var searchBtn = this.inputPanel.getComponent(this.SEARCH_BTN);
		if(inputFld && inputFld.trim().length > 0){
			searchBtn.enable();
		}else{
			searchBtn.disable();
		}
	},
	onContactSelect: function(me){
		if (!me.resultPanel.getSelectionModel().hasSelection()) {
			Jacada.Logger.error("DirectorySearchWindow search button is enable without selection");
			return;
		}
		var contact = me.resultPanel.getSelectionModel().getSelection()[0];
		Jacada.Logger.debug("DirectorySearchWindow loading contact " + contact.data.contactId);
		var jsonData = {
				contactId: contact.data.contactId,
				properInteraction: true
		};
		if($W().LayoutByContext){
			//Search results were pushed from a server, 
			//we should correct contextId and interaction type
			if(me.currentData && me.currentData.interactionId){
				jsonData.interactionId = me.currentData.interactionId,
				jsonData.interactionType = me.currentData.interactionType
			}else{
				jsonData.interactionId = $W().activeContext.interactionId;
				jsonData.interactionType = $W().activeContext.interactionType;
			}
			//if interactionType is Voice, we must use correct interactionId
			if(jsonData.interactionType == $W().interactionType.Voice){
				//At the moment interactionId its a callId
				var contextNavigation = Ext.getCmp('contextNavigation');
				var groupId = contextNavigation.buildVoiceGroupId(jsonData.interactionId);
		    	var voiceNode = contextNavigation.findNode(groupId);
		    	jsonData.callId = jsonData.interactionId; 
		    	if(voiceNode && voiceNode.media){
		    		jsonData.interactionId = voiceNode.media.interactionId;
		    	}else{
		    		//No voice item exist, we need to indicate to a server
		    		//that interactionId is not what it thinks it is.
		    		jsonData.properInteraction = false;
		    	}
			}
		}else{
			//It's an old layout - type is always Voice
			jsonData.interactionType = $W().interactionType.Voice;
		}
		Ext.Ajax.request({
			url: me.getContactLoadUrlPrefix(),
            method: 'POST',
            jsonData: jsonData
		});
        me.hide();
	},
	searchDirectory: function(){
		var store = this.resultPanel.getStore();
		store.removeAll();
		var inputFld = this.inputPanel.getComponent(this.INPUT_FIELD).getValue();
		Jacada.Logger.debug("DirectorySearchWindow loading data with expression: " + inputFld);
		store.getProxy().jsonData = {expression: inputFld};
		store.load();
	},
	onMultipleSearchResult: function(data){
		Jacada.Logger.debug("DirectorySearchWindow got results from server. Loading...");
		data = Ext.JSON.decode(data);
		this.currentData = data;
		if(data.totalCount == 0){
			Jacada.Logger.debug("DirectorySearchWindow got 0 results.");
			return;
		}
		var store = this.resultPanel.getStore();
		store.loadRawData(data);
		this.show();
	},
	getLocalizedValue: function(key){
		return $W().localeManager.getLocalizationValue('application.javascript.directorySearch.'+key);
	}
});