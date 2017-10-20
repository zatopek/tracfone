
//The name of the property which contains the Array of row objects in the store 
var RESULTS = "results";
//Name of the property from which to retrieve the total number of records in the store
var TOTAL_COUNT = "totalCount";

var addressBookGrid;
var recentlyDialedGrid;
var addressBookStore;
var recentlyDialedStore;
var mainToolBar;
var dialPadButton;
var mainPanel;
var hidableToolbarItems = []; //if address book is empty, we will need to hide these items
var numberFilterText = null;
var nameFilterText = null;
var descriptionFilterText = null;

Ext.onReady(function(){
	createGrids();
	createDialPadButton();
	createMainToolbar();
	createMainPanel();
	addressBookStore.load({params:{method:'getAddressBook', transferImpl: $W().cti.dialList.transferImpl}});
});

function createGrids(){
	createAddressBookGrid();
	createRecentlyDialedGrid();
}

function createDialPadButton(){
	dialPadButton = new Ext.Toolbar.Button({
		text : $W().localeManager.getLocalizationValue('application.javascript.toolbar.dialPad.portletTitle'),
		handler : function() {
					$W().cti.onShowDialPadWindow($W().cti.dialList.action);
					$W().toolbarWindows['dialListWindow'].hide();
				 }
	});
}

function createUndoFilterButton(){
	var undoFilterButton = new Ext.Toolbar.Button({
		text : $W().localeManager.getLocalizationValue('application.javascript.toolbar.dialPad.UndoFilterButton'),
		handler : function() {
			if(numberFilterText != null){
				numberFilterText.setValue("");
			}
			if(nameFilterText != null){
				nameFilterText.setValue("");
			}
			if(descriptionFilterText != null){
				descriptionFilterText.setValue("");
			}
			addressBookStore.clearFilter();
		}
	});
	mainToolBar.add(undoFilterButton);
	hidableToolbarItems.push(undoFilterButton);
	var separator = mainToolBar.addSeparator();
	hidableToolbarItems.push(separator);
}

function createMainToolbar(){
	mainToolBar = new Ext.Toolbar({});
}

function createMainPanel(){	
	mainPanel = new Ext.Panel( {
		renderTo : 'dialListDiv',
		layout: 'anchor',
		height : 500,
		width : 550,
		id : 'dialListPanel',
		border : true,
		tbar : mainToolBar
	});

	createAddressBookFilter('Filter by number', 'number');
	createAddressBookFilter('Filter by name', 'name');
	createAddressBookFilter('Filter by description', 'desc');
	createUndoFilterButton();
	
	mainPanel.add(addressBookGrid);
	mainPanel.add(recentlyDialedGrid);
	mainToolBar.add(dialPadButton);
	mainToolBar.addSeparator();

	mainPanel.doLayout();
}

function createAddressBookFilter(text, field){
	var txtField = new Ext.form.TextField( {
		enableKeyEvents : true,
		emptyText : text
	});	
	txtField.on('keyup', function(textField, e){
		if(field == 'number'){
			numberFilterText = textField;
		}else if(field == 'name'){
			nameFilterText = textField;
		}else if(field == 'desc'){
			descriptionFilterText = textField;
		}
		addressBookStore.filterBy(filterAddressBook);
	});
	mainToolBar.addField(txtField);
	hidableToolbarItems.push(txtField);
	var separator = mainToolBar.addSeparator();
	hidableToolbarItems.push(separator);
}

function filterAddressBook(rec, id){
	//Filter a field only if a filter input was inserted by the user
	//Filtering is case insensitive and 'AND' operation is done between the 3 filters 
	if(numberFilterText != null && numberFilterText.getValue() != ''){
		if(!containsCaseInsensitive(rec.get("transferNumber"), numberFilterText.getValue())){
			return false;
		}
	}
	if(nameFilterText != null && nameFilterText.getValue() != ''){
		if(!containsCaseInsensitive(rec.get("transferName"), nameFilterText.getValue())){
			return false;
		}
	}
	if(descriptionFilterText != null && descriptionFilterText.getValue() != ''){
		if(!containsCaseInsensitive(rec.get("transferDescription"), descriptionFilterText.getValue())){
			return false;
		}
	}
	//If all 3 filters match - return true
	return true;
}

function containsCaseInsensitive(recordValue, filterValue){
	var lowerRecord = recordValue.toLowerCase();
	var lowerFilter = filterValue.toLowerCase();
	return (lowerRecord.indexOf(lowerFilter) != -1);
}

function createAddressBookGrid(){
	addressBookStore = new Ext.data.JsonStore( {
		name : 'addressBook',
		root : RESULTS,
		totalProperty : TOTAL_COUNT,
		fields : [ {
			name : 'transferNumber'
		}, {
			name : 'transferName'
		}, {
			name : 'transferDescription'
		} ],
		url : DialList_JSON_URL,
		sortInfo : {
			field : 'transferName',
			direction : 'ASC'
		}
	});
	addressBookGrid = new Ext.grid.GridPanel( {
		name : 'addressBook',
		id : 'addressBookGridId',
		title : $W().localeManager.getLocalizationValue('application.javascript.portlet.label.addressBook'),
		border : true,
		bodyBorder : true,
		anchor: '97%, 48%',
		autoscroll : true,
		store : addressBookStore,
		columns : [ {
			id : 'addressBookNumber',
			dataIndex : 'transferNumber',
			header : $W().localeManager.getLocalizationValue('application.javascript.portlet.label.number')
		}, {
			id : 'addressBookName',
			dataIndex : 'transferName',
			header : $W().localeManager.getLocalizationValue('application.javascript.portlet.label.name')
		}, {
			id : 'addressBookDesc',
			dataIndex : 'transferDescription',
			header : $W().localeManager.getLocalizationValue('application.javascript.portlet.label.description')
		} ],
		autoExpandColumn : 'addressBookDesc', 
		viewConfig : {forceFit : true}
	});
	
	addressBookStore.on("datachanged", function(store){
		if(addressBookStore.getTotalCount() == 0){
			addressBookGrid.setVisible(false);
			hidableToolbarItems.each(function(item){
				item.setVisible(false);
			});
		}else{
			addressBookGrid.setVisible(true);
			hidableToolbarItems.each(function(item){
				item.setVisible(true);
			});
		}
		recentlyDialedStore.load({params:{method:'getRecentlyDialed', transferImpl: $W().cti.dialList.transferImpl}});
	});

	addressBookGrid.on('rowdblclick', function(grid, rowIndex, e) {
    	var record = grid.getStore().getAt(rowIndex);
    	dialNumber(record, 'transferNumber');
    }); 
}

function dialNumber(record, field){
	var dn = record.get(field);
	$W().toolbarWindows['dialListWindow'].hide();
	$W().cti.doAction($W().cti.dialList.action, dn);
}

function createRecentlyDialedGrid(){

	recentlyDialedStore = new Ext.data.JsonStore( {
		root : RESULTS,
		totalProperty : TOTAL_COUNT,
		idProperty : 'dummyID',
		fields : [ {
			name : 'dialedNumber'
		}, {
			name : 'callDateStr'
		} ],
		url : DialList_JSON_URL
	});
	recentlyDialedGrid = new Ext.grid.GridPanel( {
		id : 'recentlyDialedGridId',
		title : $W().localeManager.getLocalizationValue('application.javascript.portlet.label.recentlyDialedNumbers'),
		border : true,
		bodyBorder : true,
		autoscroll : true,
		anchor: '97%, 48%',
		store : recentlyDialedStore,
		columns : [ {
			id : 'recentlyDialedNumber',
			dataIndex : 'dialedNumber',
			header : $W().localeManager.getLocalizationValue('application.javascript.portlet.label.number')
		}, {
			id : 'recentlyDialedDate',
			dataIndex : 'callDateStr',
			header : $W().localeManager.getLocalizationValue('application.javascript.portlet.label.time')
		} ],
		autoExpandColumn : 'recentlyDialedDate', 
		viewConfig : {forceFit : true}
	});
	
	recentlyDialedGrid.on('rowdblclick', function(grid, rowIndex, e) {
    	var record = grid.getStore().getAt(rowIndex);
    	dialNumber(record, 'dialedNumber');
    });
	
	recentlyDialedStore.on("datachanged", function(store){
		if(recentlyDialedStore.getTotalCount() == 0){
			recentlyDialedGrid.setVisible(false);
		}else{
			recentlyDialedGrid.setVisible(true);
		}
		if(recentlyDialedGrid.isVisible() && addressBookGrid.isVisible()){
			recentlyDialedGrid.setHeight(235);
			addressBookGrid.setHeight(235);
		}else if(recentlyDialedGrid.isVisible() && !addressBookGrid.isVisible()){
			recentlyDialedGrid.setHeight(500);
		}else if(!recentlyDialedGrid.isVisible() && addressBookGrid.isVisible()){
			addressBookGrid.setHeight(500);
		}
		mainPanel.doLayout(); 
	});
}

//called by the toolbar wrapper when the portlet is shown
function onPortletShow(reloadContentOnNextOpen) {
	addressBookStore.load({params:{method:'getAddressBook', transferImpl: $W().cti.dialList.transferImpl}});
}
