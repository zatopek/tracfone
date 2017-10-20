Ext.define('Jacada.system.ui.directory.DirectoryPanel', {
    extend: 'Ext.panel.Panel',
    itemId: 'directoryPanel',
    layout: {
    	type: 'vbox',
    	align: 'stretch'
    },
    bodyStyle : 'background:none',
    bodyCls: 'baseColor',
    fieldToSet: null,
    border: false,
    defaults: {
    	border: false
    },
    autoScroll: true,
    initComponent: function () {
    	var me = this;
    	var items = [];
    	items.push(me.createSearchPanel(me));
    	items.push(me.createSearchMessage());
    	items.push(me.createGridTable(me));
    	items.push(me.createSelectedContactsPanel(me));
    	
        Ext.applyIf(me, {
        	items: items,
	        buttons: [
	  	              { text: getLocalizedValue('done'),
	  	            	  width: '100px',
	  	            	  itemId: 'done',
	  	            	  style: 'margin:2px',
	  	            	  disabled: true,
	  	            	  handler: function(){
		  	            	  var valueToAdd = me.getContactsToAddField().getValue();
		  	            	  var currentValue = me.fieldToSet.getValue();
		  	            	  
		  	            	  if(currentValue && valueToAdd){
		  	            		valueToAdd = currentValue + ';' + valueToAdd;
		  	            	  }else if(currentValue){
		  	            		valueToAdd = currentValue;
		  	            	  }
		  	            	  
		  	            	  me.fieldToSet.setValue(valueToAdd);
		  	            	  me.up().close();
	  	              }},
	  	              { text: getLocalizedValue('cancel'),width: '100px', itemId: 'cancel', style: 'margin:8px',  handler: function(){me.up().close();}}
	  	            ]
        });
        
    	me.callParent(arguments);
    },
    searchContact: function(){
    	var me = this;
    	var expression = me.getSearchContacsInputField().getValue();
    	if(expression){
	    		var resultGridStore = me.getComponent('resultsGridPanel').getStore();
	    		var proxy = resultGridStore.getProxy(); 
	    		proxy.jsonData = { expression: expression };
	    		resultGridStore.load();
    	}
    	
    },
    
    createSearchPanel: function(me){
    	return {
    		xtype: 'panel',
    		itemId: 'searchContactPanel',
    		bodyStyle : 'background:none',
    		padding: '10 5 10 5',
    		layout: {
    			type: 'hbox'
    		},
    		items: [{
				xtype: 'textfield',
				itemId: 'searchContactField',
				emptyText : getLocalizedValue('search.searchfield.emptyText'),
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
				text: getLocalizedValue('search.button.text'),
				width: '65px',
				cls: 'actionButton',
 		    	margin: '0 5 0 0',
 		    	handler: function(){
 		    		me.searchContact();
 		    	}
    	}]
    	
    	};
    },
    createSearchMessage: function(){
    	return {
    		xtype: 'label',
    		itemId: 'SearchContactsMessage',
    		margins: '5 5 5 10',
    		html: getLocalizedValue('search.message'),
    		cls: 'textAlertColor',
    		hidden: true
    	};
    },
    createGridTable: function(me){
    	Ext.define('User', {
    	    extend: 'Ext.data.Model',
    	    fields: [{name: 'email', mapping: 'attributes.EmailAddress', sortType: 'asUCString'},
    	             {name: 'firstName', mapping: 'attributes.FirstName', sortType: 'asUCString'},
    	             {name: 'lastName', mapping: 'attributes.LastName', sortType: 'asUCString'}]
    	    });
    	
    	
    	return {
			xtype: 'grid',
			title: getLocalizedValue('search.grid.title'),
			itemId: 'resultsGridPanel',
			flex: 1,
			border: true,
			margins: '5 10 5 10',
			height: 300,
			store: {
				xtype: 'store',
				model: 'User',
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
				{text: getLocalizedValue('search.grid.column.firstName'), dataIndex: 'firstName',flex: 1, renderer: me.contactDataCellRenderer},
				{text: getLocalizedValue('search.grid.column.lastName'), dataIndex: 'lastName', flex: 1, renderer: me.contactDataCellRenderer},
				{text: getLocalizedValue('search.grid.column.email'), dataIndex: 'email', flex: 1, renderer: me.contactDataCellRenderer}
			],
		    viewConfig: {
				listeners: {
					itemdblclick: function(dataview, record, item, index, e) {
						this.up().addSelection();
					}
				}
			},
			addSelection: function(){
				var selection = this.getView().getSelectionModel().getSelection()[0];
				if(selection){
					var selectionText = selection.data.email;
					if(!selectionText){
						Ext.MessageBox.show({
					           title: getLocalizedValue('alert'),
					           msg: getLocalizedValue('search.notdefined'),
					           buttons: Ext.MessageBox.OK,
					           icon: Ext.MessageBox.WARNING
					       });
						return;
					}
					var contactsToAddTextField = this.up().getContactsToAddField();
					if(contactsToAddTextField.getValue()){
						selectionText = ';' + selection.data.email
					}
					contactsToAddTextField.setValue(contactsToAddTextField.getValue() + selectionText);
				}
			}
		};
    },
    createSelectedContactsPanel: function(me){
    	return {
			xtype: 'panel',
			itemId: 'contactsToAddPanel',
			margins: '10',
			bodyStyle : 'background:none',
			layout: {
				type: 'hbox'
			},
		items:[{
			xtype: 'textfield',
			itemId: 'contactsToAddField',
			emptyText : getLocalizedValue('search.contactsToAdd.emptyText'),
			padding: '0 10 3 5',
			flex: 1,
			listeners:{
				change:function( _this, newValue, oldValue, eOpts ){
					var doneButton = me.getDoneButton();
					_this.getValue() ? doneButton.enable() : doneButton.disable();
				}
			}
		}]};

    },
    contactDataCellRenderer: function(value, metaData, record, row, col, store, gridView) {
    	var dataIndex = metaData.column.dataIndex;
    	if(!value){
    		value = '';
    	}

    	//add tooltip to all cells
    	metaData.tdAttr = 'data-qtip="' + value + '"';
    	
        return value;
    },
    getResultGridPanel: function(){
    	return this.getComponent('resultsGridPanel');
    },
    getSearchContacsInputField: function(){
    	return this.getComponent('searchContactPanel').getComponent('searchContactField');
    },
    getContactsToAddField: function(){
    	return this.getComponent('contactsToAddPanel').getComponent('contactsToAddField');
    },
    getSearchContactsResultsMessage: function(){
    	return this.getComponent('SearchContactsMessage');
    },
    getDoneButton: function(){
    	return this.down('#done');
    }
});

function getLocalizedValue(key){
	return $W().localeManager.getLocalizationValue('application.javascript.directory.'+key);
}

