Ext.define('Jacada.user.ui.cti.DialList', {
	    extend: 'Ext.window.Window',
	    
	    id: 'ctiDialListWidnow',
	    title: $W().localeManager.getLocalizationValue('application.javascript.portlet.label.dialList'),
	    layout: 'fit',
		width: 773,
		height: 500,
		minHeight: 500,
        minWidth: 773,
		modal: true,
		constrain: true,
		collapsible: false,
		closeAction: 'hide',
		resizable: true,
		draggable: true,

		//The name of the property which contains the Array of row objects in the store 
		RESULTS: "results",
		//Name of the property from which to retrieve the total number of records in the store
		TOTAL_COUNT: "totalCount",
		DialList_JSON_URL: $W().CONTEXT_PATH + '/dialList.json',
		//stores and grids for easier access
		addressBookStore: null,
		addressBookGrid: null,
		recentlyDialedStore: null,
		recentlyDialedGrid: null,
		//transfer type and action used to present numbers and dial
		transferImpl: 'Standard',
		action: null,
		hidableToolbarItems: [], //if address book is empty, we will need to hide these items
		
		
	    initComponent: function() {
	        var me = this;
	        $W().dialListWindow = this;
	        var items = [];
	        items.push(me.buildDialListPanel());
	        items = items.compact();
	        
	        Ext.applyIf(me, {
	        	items: items,
	        	listeners: {
	        		show: function(){$W().HideCurrentVisibleTab();},
	        		hide: function(){$W().ShowCurrentVisibleTab();}
	        	}
	        });
	        me.callParent(arguments);
	    },
	    buildDialListPanel: function(){
	    	var dialListPanel = Ext.create('Ext.panel.Panel', {
	    		layout: {type:'vbox', align: 'stretch'},
	    		//width: 570,
	    		//height: 500,
	    		id: 'dialListPanel',
	    		border: false,
	    		tbar: this.buildMainToolbar(),
	    		items: [
	    		        this.buildAddressBooksGrid(),
	    		        this.buildRecentlyDialedGrid()
	    		]
	    	});
	    	return dialListPanel;
	    },
	    buildMainToolbar: function(){
	    	Jacada.Logger.debug("Dial List - building main toolbar");
	    	var toolbarItems = new Array();
	    	toolbarItems.push('->');
	    	var filter = this.createAddressBookFilter(
	    			$W().localeManager.getLocalizationValue('application.javascript.portlet.label.filter.number'), 'number');
	    	this.hidableToolbarItems.push(filter);
	    	toolbarItems.push(filter);
	    	
	    	filter = this.createAddressBookFilter(
	    			$W().localeManager.getLocalizationValue('application.javascript.portlet.label.filter.name'), 'name');
	    	this.hidableToolbarItems.push(filter);
	    	toolbarItems.push(filter);

	    	filter = this.createAddressBookFilter(
	    			$W().localeManager.getLocalizationValue('application.javascript.portlet.label.filter.description'), 'desc');
	    	this.hidableToolbarItems.push(filter);
	    	toolbarItems.push(filter);
	    	
	    	var separator = Ext.create('Ext.toolbar.Separator');
	    	this.hidableToolbarItems.push(separator);
	    	toolbarItems.push(separator);
	    	var undoFilterButton = this.createUndoFilterButton();
	    	this.hidableToolbarItems.push(undoFilterButton);
	    	toolbarItems.push(undoFilterButton);
	    	toolbarItems.push(this.createDialPadButton());
	    	toolbarItems.push('-');
	    	return toolbarItems;
	    },
	    createAddressBookFilter: function(text, field){
	    	var txtField = Ext.create('Ext.form.field.Text', {
	    		id: field + 'FilterField',
	    		enableKeyEvents : true,
	    		emptyText : text
	    	});	
	    	txtField.on('keyup', function(textField, e){
	    		this.addressBookStore.filterBy(this.filterAddressBook);
	    	}, this /*scope window*/);
	    	return txtField;
	    },
	    filterAddressBook: function(rec, id){
	    	//Filter a field only if a filter input was inserted by the user
	    	//Filtering is case insensitive and 'AND' operation is done between the 3 filters
	    	var win = $W().dialListWindow;
	    	var numberFilterText = Ext.getCmp('numberFilterField');
	    	if(numberFilterText != null && numberFilterText.getValue() != ''){
	    		if(!win.containsCaseInsensitive(rec.get("transferNumber"), numberFilterText.getValue())){
	    			return false;
	    		}
	    	}
	    	var nameFilterText = Ext.getCmp('nameFilterField');
	    	if(nameFilterText != null && nameFilterText.getValue() != ''){
	    		if(!win.containsCaseInsensitive(rec.get("transferName"), nameFilterText.getValue())){
	    			return false;
	    		}
	    	}
	    	var descriptionFilterText = Ext.getCmp('descFilterField');
	    	if(descriptionFilterText != null && descriptionFilterText.getValue() != ''){
	    		if(!win.containsCaseInsensitive(rec.get("transferDescription"), descriptionFilterText.getValue())){
	    			return false;
	    		}
	    	}
	    	//If all 3 filters match - return true
	    	return true;
	    },
	    containsCaseInsensitive: function(recordValue, filterValue){
	    	var lowerRecord = recordValue.toLowerCase();
	    	var lowerFilter = filterValue.toLowerCase();
	    	return (lowerRecord.indexOf(lowerFilter) != -1);
	    },
	    createUndoFilterButton: function(){
	    	return Ext.create('Ext.button.Button', {
	    		text : $W().localeManager.getLocalizationValue('application.javascript.toolbar.dialPad.UndoFilterButton'),
	    		handler : function() {
	    	    	var filterText = Ext.getCmp('numberFilterField');
	    	    	filterText.setValue("");
	    	    	filterText = Ext.getCmp('nameFilterField');
	    	    	filterText.setValue("");
    				filterText = Ext.getCmp('descFilterField');
    				filterText.setValue("");
	    			this.addressBookStore.clearFilter();
	    		}
	    	});
	    },
	    createDialPadButton: function(){
	    	return Ext.create('Ext.button.Button', {
	    		text : $W().localeManager.getLocalizationValue('application.javascript.toolbar.dialPad.portletTitle'),
	    		handler : function() {
	    					Jacada.Logger.debug("Dial List. dial pad requested for action: " + $W().dialListWindow.action);
	    					$W().cti.onShowDialPadWindow($W().dialListWindow.action);
	    					$W().dialListWindow.hide();
	    				 }
	    	});
	    },
	    buildAddressBooksGrid: function(){
	    	Jacada.Logger.debug("Dial List - building address book grid");
	    	var addressBookStore = Ext.create('Ext.data.JsonStore', {
	    		fields: [
	    		    {name: 'transferNumber'},
	    		    {name: 'transferName'},
	    		    {name: 'transferDescription'}
	    		],
	    		sorters: [{
	    			property: 'transferName',
	    			direction: 'ASC'
	    		}],
	    		proxy: {
	    			type: 'ajax',
	    			url: this.DialList_JSON_URL,
	    			reader: {
	    				root: this.RESULTS,
	    				totalProperty: this.TOTAL_COUNT
	    			}
	    		}
	    	});
	    	var addressBookGrid = Ext.create('Ext.grid.Panel', {
	    		id : 'addressBookGridId',
	    		title : $W().localeManager.getLocalizationValue('application.javascript.portlet.label.addressBook'),
	    		border : false,
	    		//bodyBorder : true,
	    		flex: 1,
	    		autoscroll : true,
	    		store : addressBookStore,
	    		columns : [ {
	    			id : 'addressBookNumber',
	    			dataIndex : 'transferNumber',
	    			header : $W().localeManager.getLocalizationValue('application.javascript.portlet.label.number'),
	    			flex: 1
	    		}, {
	    			id : 'addressBookName',
	    			dataIndex : 'transferName',
	    			header : $W().localeManager.getLocalizationValue('application.javascript.portlet.label.name'),
	    			flex: 1
	    		}, {
	    			id : 'addressBookDesc',
	    			dataIndex : 'transferDescription',
	    			header : $W().localeManager.getLocalizationValue('application.javascript.portlet.label.description'),
	    			flex: 1
	    		} ],
	    		autoExpandColumn : 'addressBookDesc', 
	    		viewConfig : {forceFit : true}
	    	});
	    	
	    	addressBookStore.on("datachanged",
	    			function(store){
			    		this.recentlyDialedStore.load({params:{method:'getRecentlyDialed', transferImpl: this.transferImpl}});
			    	},
			    	this //scope window
			);

	    	addressBookGrid.on('itemdblclick', function(grid, record, item) {
	        	this.dialNumber(record, 'transferNumber');
	        }, this /*scope window*/);
	    	
	    	this.addressBookStore = addressBookStore;
	    	this.addressBookGrid = addressBookGrid;
	    	return addressBookGrid;
	    },
	    buildRecentlyDialedGrid: function(){
	    	Jacada.Logger.debug("Dial List - building recently dialed grid");
    		var recentlyDialedStore = Ext.create('Ext.data.JsonStore', {
    			fields: [ {
    				name: 'dialedNumber'
    			}, {
    				name: 'callDateStr'
    			} ],
	    		proxy: {
	    			type: 'ajax',
	    			url: this.DialList_JSON_URL,
	    			reader: {
	    				root: this.RESULTS,
	    				totalProperty: this.TOTAL_COUNT,
	    				idProperty: 'dummyID'
	    			}
	    		}
    		});
    		var recentlyDialedGrid = Ext.create('Ext.grid.Panel', {
    			id : 'recentlyDialedGridId',
    			title : $W().localeManager.getLocalizationValue('application.javascript.portlet.label.recentlyDialedNumbers'),
    			border : false,
    			flex: 1,
    			//bodyBorder : true,
    			autoscroll : true,
    			store : recentlyDialedStore,
    			columns : [ {
    				id : 'recentlyDialedNumber',
    				dataIndex : 'dialedNumber',
    				header : $W().localeManager.getLocalizationValue('application.javascript.portlet.label.number'),
    				flex: 1
    			}, {
    				id : 'recentlyDialedDate',
    				dataIndex : 'callDateStr',
    				header : $W().localeManager.getLocalizationValue('application.javascript.portlet.label.time'),
    				flex: 1
    			} ],
    			autoExpandColumn : 'recentlyDialedDate', 
    			viewConfig : {forceFit : true}
    		});
    		
    		recentlyDialedGrid.on('itemdblclick', function(grid, record, item) {
    	    	this.dialNumber(record, 'dialedNumber');
    	    }, this/*scope window*/);
    		
    		this.recentlyDialedStore = recentlyDialedStore;
    		this.recentlyDialedGrid = recentlyDialedGrid;
    		return recentlyDialedGrid;
	    },
	    dialNumber: function(record, field){
	    	var dn = record.get(field);
    		Jacada.Logger.debug("Dial List. Dialing number " + dn + ". Action: " + this.action);
	    	this.hide();
	    	$W().cti._doOperationWithDn(this.action, dn);
	    },
	    openDialList: function(transferImpl, action){
	    	Jacada.Logger.debug("Dial List. openDialList. transferImpl: " + transferImpl + ", action: " + action);
	    	this.transferImpl = transferImpl;
	    	this.action = action;
	    	this.addressBookStore.load({params:{method:'getAddressBook', transferImpl: this.transferImpl}});
	    	this.show();
	    }
});    