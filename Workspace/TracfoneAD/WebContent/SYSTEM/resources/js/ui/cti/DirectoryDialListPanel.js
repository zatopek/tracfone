Ext.define('Jacada.system.ui.cti.DirectoryDialListPanel', {
    extend: 'Ext.panel.Panel',
    itemId: 'directoryDialListPanel',
    layout: {
    	type: 'vbox',
    	align: 'stretch'
    },
    bodyStyle : 'background:none',
    bodyCls: 'baseColor',
    action: null,
    initComponent: function(){
    	var me = this;
    	var items = [];
    	items.push(me.createSearchPanel(me));
    	items.push(me.createSearchMessage(me));
    	items.push(me.createContactsGridPanel(me));
    	items.push(me.createRecentlyDialedGridPanel(me));
    	items.push(me.createManualDialPanel(me));
    	
        Ext.applyIf(me, {
        	items: items,
	        buttons: [
	  	              { text: me.getLocalizedValue('dial'),
	  	            	  width: '100px',
	  	            	  itemId: 'dial',
	  	            	  style: 'margin:2px',
	  	            	  disabled: true,
	  	            	  handler: function(){
	  	            		me.dialNumber(me.down('#numberToDial').getValue());
		  	            	me.up().close();
	  	              }},
	  	              { text: me.getLocalizedValue('cancel'),width: '100px', itemId: 'cancel', style: 'margin:8px',  handler: function(){me.up().close();}}
	  	            ]
        });
    	me.callParent(arguments);
    },
    createSearchMessage: function(me){
    	return {
    		xtype: 'label',
    		itemId: 'SearchContactsMessage',
    		margins: '5 5 5 10',
    		html: me.getLocalizedValue('search.message'),
    		cls: 'textAlertColor',
    		hidden: true
    	};
    },
    createSearchPanel: function(me){
    	return {
    		xtype: 'panel',
    		border: false,
    		itemId: 'searchContactPanel',
    		bodyStyle : 'background:none',
    		padding: '10 5 10 5',
    		layout: {
    			type: 'hbox'
    		},
    		items: [{
				xtype: 'textfield',
				itemId: 'searchContactField',
				emptyText : me.getLocalizedValue('search.searchfield.emptyText'),
				padding: '0 10 3 5',
				flex: 1,
				enableKeyEvents: true,	
 	        	listeners: {
 	        		keypress: function(textfield, e, eOpts){
 	        			if(e.getKey() == e.ENTER){
 	        				me.searchContact();
 	        			}
 	        		}
 	        	}
			},{
				xtype: 'button',
				itemId: 'searchContactButton',
				text: me.getLocalizedValue('search.button.text'),
				width: '65px',
				cls: 'actionButton',
 		    	margin: '0 5 0 0',
 		    	handler: function(){
 		    		me.searchContact();
 		    	}
	    	}]
    	
    	};
    },
    searchContact: function(){
    	var me = this;
    	var expression = me.getSearchContacsInputField().getValue();
    	if(expression){
	    		var resultGridStore = me.getComponent('contactsGridPanel').getStore();
	    		var proxy = resultGridStore.getProxy(); 
	    		proxy.jsonData = { expression: expression };
	    		resultGridStore.load();
    	}
    	
    },
    createContactsGridPanel: function(me){
    	Ext.define('ContactModel', {
    	    extend: 'Ext.data.Model',
    	    fields: [{name: 'homeNumber', mapping: 'attributes.PhoneHome', sortType: 'asUCString'},
    	             {name: 'mobileNumber', mapping: 'attributes.PhoneMobile', sortType: 'asUCString'},
    	             {name: 'businessNumber', mapping: 'attributes.PhoneBusiness', sortType: 'asUCString'},
    	             {name: 'firstName', mapping: 'attributes.FirstName', sortType: 'asUCString'},
    	             {name: 'lastName', mapping: 'attributes.LastName', sortType: 'asUCString'}]
    	    });

    	return {
			xtype: 'grid',
			title: me.getLocalizedValue('search.grid.title'),
			itemId: 'contactsGridPanel',
			flex: 1,
			collapsible: true,
			border: true,
			margins: '5 10 5 10',
			height: 300,
			viewConfig: me.getViewConfig(me),
			store: {
				xtype: 'store',
				model: 'ContactModel',
				proxy:{
					type: 'rest',
					url: $W().contextPath + '/rest/contacts/search/contact/name',
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
				},
			listeners:{
                load: function( _this, records, successful, eOpts ){
                	var searchMsg = me.getSearchContactsResultsMessage();
                	if(records){
                		records.size() == 0 ? searchMsg.show() : searchMsg.hide();
                	}else{
                		searchMsg.show();
                	}
                }
             }

			},
			columns: [
				{text: me.getLocalizedValue('search.grid.column.firstName'), dataIndex: 'firstName', renderer: me.contactDataCellRenderer},
				{text: me.getLocalizedValue('search.grid.column.lastName'), dataIndex: 'lastName', flex: 1, renderer: me.contactDataCellRenderer},
				{text: me.getLocalizedValue('search.grid.column.phone.home'), dataIndex: 'homeNumber', flex: 1, renderer: me.contactDataCellRenderer},
				{text: me.getLocalizedValue('search.grid.column.phone.mobile'), dataIndex: 'mobileNumber', flex: 1, renderer: me.contactDataCellRenderer},
				{text: me.getLocalizedValue('search.grid.column.phone.business'), dataIndex: 'businessNumber', flex: 1, renderer: me.contactDataCellRenderer}
			],
			dialSelection: function(){
				var selection = this.getView().getSelectionModel().getSelection()[0];
				if(selection){
					var selectionText = selection.data.home;
					if(!selectionText){
						Ext.MessageBox.show({
					           title: me.getLocalizedValue('alert'),
					           msg: me.getLocalizedValue('search.phone.notdefined'),
					           buttons: Ext.MessageBox.OK,
					           icon: Ext.MessageBox.WARNING
					       });
						return;
					}
					//dial phone
					alert("dial phone " + selectionText);
				}
			}
		};
    },
    createRecentlyDialedGridPanel: function(me){
    	return{
			xtype: 'grid',
			title: me.getLocalizedValue('dialList.recentlyDialed.title'),
			itemId: 'recentlyDialedGridPanel',
			flex: 1,
			collapsible: true,
			border: true,
			margins: '5 10 5 10',
			height: 300,
			viewConfig: me.getViewConfig(me),
			columns: [
				{text: me.getLocalizedValue('dialList.recentlyDialed.grid.column.number'), dataIndex: 'dialedNumber', flex:1, renderer: me.contactDataCellRenderer},
				{text: me.getLocalizedValue('dialList.recentlyDialed.grid.column.date'), dataIndex: 'callDateStr', flex: 1, renderer: me.contactDataCellRenderer}
			],
			store: {
				xtype: 'json',
				fields: [ {
    				name: 'dialedNumber'
    			}, {
    				name: 'callDateStr'
    			} ],
	    		proxy: {
	    			type: 'ajax',
	    			url: $W().CONTEXT_PATH + '/dialList.json',
	    			reader: {
	    				root: 'results',
	    				totalProperty: 'totalCount',
	    				idProperty: 'dummyID'
	    			}
	    		}
			}
    	};
    	
    },
    contactDataCellRenderer: function(value, metaData, record, row, col, store, gridView) {
    	var plainValue = '';
    	if(!value){
    		value = '';
    		return value;
    	}
    	plainValue = value;
    	var dataIndex = metaData.column.dataIndex;
    	if(dataIndex.indexOf('Number') != -1){
    		metaData.tdCls = 'voiceContext-small';
    		value = '<a href="#">' + value + '</a>';
    	}

    	//add tooltip to all cells
    	metaData.tdAttr = 'data-qtip="' + Ext.String.htmlEncode(plainValue) + '"';
    	
        return value;
    },
    createManualDialPanel: function(me){
    	return {
			xtype: 'panel',
			itemId: 'manualDialPanel',
			border: false,
			margins: '10',
			bodyStyle : 'background:none',
			layout: {
				type: 'hbox'
			},
			items:[{
				xtype: 'numberfield',
				itemId: 'numberToDial',
				emptyText : me.getLocalizedValue('dialList.manualDial.emptyText'),
				margins: '5 0 5 0',
				enableKeyEvents: true,
				flex: 1,
				listeners:{
					change:function( _this, newValue, oldValue, eOpts ){
						var dialButton = me.getDialButton();
						_this.getValue() ? dialButton.enable() : dialButton.disable();
					},
		     		keypress: function(_this, e, eOpts){
		     			if(e.getKey() == e.ENTER){
		     				if(_this.getValue()){
		     					me.dialNumber(_this.getValue());
		     					me.up().close();
		     				}
		     			}
		     		}
				}
			}]};

    },
	getViewConfig: function(me){
		return{
			listeners: {
				cellclick : function(view, cell, cellIndex, record,row, rowIndex, e) {
					var clickedDataIndex = view.panel.headerCt.getHeaderAtIndex(cellIndex).dataIndex;
		            var clickedCellValue = record.get(clickedDataIndex);
					me.handleCellClicked(clickedDataIndex, clickedCellValue);
				}
			}
		};
	},
	handleCellClicked: function(clickedDataIndex, clickedCellValue){
		if(!clickedCellValue){
			Jacada.Logger.debug("Dial List. handleCellClicked. Empty Value, ColumnName: " + clickedDataIndex + ", CellValue: " + clickedCellValue);
			return;
		}
		Jacada.Logger.debug("Dial List. handleCellClicked. ColumnName: " + clickedDataIndex + ", CellValue: " + clickedCellValue);
		if(clickedDataIndex.indexOf('Number') != -1){
			this.dialNumber(clickedCellValue);
		}else{
			Jacada.Logger.debug("Dial List. handleCellClicked. Not a phone, ColumnName: " + clickedDataIndex + ", CellValue: " + clickedCellValue);
		}
			
	},
    dialNumber: function(number){
		Jacada.Logger.debug("Dial List. Dialing Number: " + number + ". Action: " + this.action);
    	this.up().close();
    	$W().cti._doOperationWithDn(this.action, number);
    },
    loadRecentlyDialed: function(transferImpl, action){
 	   Jacada.Logger.debug("Dial List. openDialList. transferImpl: " + transferImpl + ", action: " + action);
 	   this.action = action;
 	   this.transferImpl = transferImpl;
	   this.down('#recentlyDialedGridPanel').getStore().load({params:{method:'getRecentlyDialed', transferImpl: this.transferImpl}});
    },
    getResultGridPanel: function(){
    	return this.getComponent('contactsGridPanel');
    },
    getSearchContacsInputField: function(){
    	return this.getComponent('searchContactPanel').getComponent('searchContactField');
    },
    getSearchContactsResultsMessage: function(){
    	return this.getComponent('SearchContactsMessage');
    },
    getDialButton: function(){
    	return this.down('#dial');
    },
    getLocalizedValue: function(key){
    	return $W().localeManager.getLocalizationValue('application.javascript.directory.'+key);
    }
});