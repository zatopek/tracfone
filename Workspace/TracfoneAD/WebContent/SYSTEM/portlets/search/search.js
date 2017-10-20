// contains all the UI
var container; 
// contains the results panels from the bridges
var resultsPanel; 
// number of defined bridges
var count = 0; 
// an array that hold all the bridges stores
var stores = new Array(); 
// an array that hold all the results panels for the defined bridges
var results = new Array(); 
// an array that hold all the records tha represents the bridge
var bridgesRecords = new Array(); 
// an array that hold all the paging bars of the results panels
var pagingBars = new Array(); 
var queryForm; 
var query;
var dummyRecord;

/*
 * The search portlet UI is structured as following:
 * The main container holds queryPanel and resultsPanel.
 * The queryPanel holds the text field with the search button.
 * The resultsPanel structure depends on the value of the 'count' variable
 * (that is the number of the configured search bridges)
 * If the count > 1, the resultsPanel will hold a panel per search bridge.
 * These panel are GridPanels that are built in the buildResultsPanelForBridge() function
 * If the count == 1. the resultsPanel is not visisble, instead another panel 
 * built with buildResultsPanelForBridge() function will be added to the container,
 * so the user will see only one panel and not a panel within a panel
 * 
 */
Ext.onReady(function(){  
	// the main panel
    container = new Ext.Panel({
        renderTo: 'formPlaceholder',
        autoScroll: false
    });    
      
	var queryPanel = buildQueryPanel();
    container.add(queryPanel);
    // panel that holds all the serach results    
    resultsPanel = buildMainResultsPanel();
    container.add(resultsPanel);

    createDummyRecord();
   document.body.onresize = new Function("resizeContent()");
   resizeContent();
   // when in portlet, need to resize the queryField after the resultsPanel was added
   if (!isInToolbar()) {
	   updateQueryFieldWidth();
   }   
   createGlobalSearchStore();
});

function buildQueryPanel() {
	var queryForm =  createQueryForm();
	var queryPanel = new Ext.Panel({
		frame: false,
        layout:'form',
        items:[queryForm]       
    });
    return queryPanel;
}

// the quey form contains the text field with the icon button	
function createQueryForm(){	
	var fieldWidth = 	container.getInnerWidth();	
	queryField = new Ext.form.TriggerField({
		triggerClass : 'x-form-search-trigger',
		onTriggerClick:searchQuery,
		emptyText: getLocalizationValue('application.javascript.search.field.empty.text'),
     	width:fieldWidth,
     	 listeners: {
                specialkey: function(field, e){
                    if (e.getKey() == e.ENTER) {
                        searchQuery();
                    }
                }
            }     	
	});
	queryForm = new Ext.FormPanel({
        defaultType: 'textfield',
        layout:'table',
        items: [
            queryField      
        ]
    });    
    return queryForm;
}	

function updateQueryFieldWidth() {
	var fieldWidth = container.getInnerWidth();	
	queryField.setWidth(fieldWidth);
}
function buildMainResultsPanel() {
	// panel that holds all the serach results    
	var panel = new Ext.Panel({		
	    title:getLocalizationValue('application.javascript.search.results.panel.title'),
        autoScroll: false
    });   
	panel.doLayout();
   	resizeWidth(panel);
   	return panel;
}

function resizeContent() {
	var body = document.body;
	container.setWidth(body.clientWidth);
	container.doLayout();
	container.getEl().repaint();
	queryForm.setWidth(container.getInnerWidth());	
}

// this is a workaround - without it the panel collapse/expand arrows are not fully seen
function resizeWidth(panel) {	
	var w = container.getInnerWidth();
   	panel.setWidth(w-getReducedResultsPanelWidthOffset());
}

// when in toolbar, need to resize the panels after the search or collapse/expand 
// of the panels
function resizeHeight() {
	var h = container.getInnerHeight()+getAdditionalResizeHeight();
	var searchToolBarWindow = $W().toolbarWindows['SearchWindow'];
	if (searchToolBarWindow) {
		$W().toolbarWindows['SearchWindow'].setHeight(h);
		var div = $D().getElementById("SearchWindow-tbFrame");
		div.style.height = h +'px';	
	}
}

function isInToolbar() {
	return $W().toolbarWindows['SearchWindow'];
}
function getAdditionalResizeHeight() {
	return 40;
}

function getReducedResultsPanelWidthOffset() {
	// when in toolbar need to reduce results panel width,
	// since the panel collapse/expand arrows are not fully seen
	if (isInToolbar()) {
		return 15;
	}
	else {
		return 0;
	}
}

// creates the store for the list of the SearchBridges
// need to hold the bridges names
function createGlobalSearchStore() {
	 var globalSearchStore = new Ext.data.JsonStore({			
    	root:'results',
	    totalProperty: 'totalCount',
    	baseParams: { method: "loadAllSearchBridges" },
	    fields:['name', 'pageSize'],
	    url:SEARCH_JSON_URL
	});        
    // on load - build the bridgesRecords array
    globalSearchStore.on('load', function() {
    	count = globalSearchStore.getTotalCount();
    	for (var i = 0; i < count; i++) {
    		bridgesRecords[i] = globalSearchStore.getAt(i);    		
    	}
    	
    	fillResults();
	});
	globalSearchStore.load();
}
// iteartes on the stores array and finds the index of the specified one
function findStoreIndex(store) {
	var storeId = -1;
	for (var i = 0; i < count; i++) {
		if (store == stores[i]) {
			storeId = i;
		}
	}
	return 	storeId;
}
// the search result should be displayed as a link
function urlRender(value,metadata,record,rowIndex,colIndex,store) {
	var storeIndex = findStoreIndex(store);
	var title = record.data['title'];
	var dummy = record.data['dummy'];
	if (dummy != undefined) {
		metadata.attr = "title=\"" + title + "\"";
		return title;
	}
	var result = '<a href="javascript:openDocument('+rowIndex + ',' + storeIndex+');">'+ title +'</a>'; 
	return result;
}

// the document will be opened in a new window or in the WS tab
function openDocument(rowIndex, storeIndex) {	
	var	store = stores[storeIndex];
	var rec = store.getAt(rowIndex);
	var url = rec.data['url'];	
	generalOpenDocument(documentLocation, url);
}

// the search button pressed
function searchQuery() {
	query = queryField.getValue();
	// iterate on all the bridges and do the search
	for (var i = 0; i < count; i++) {
		var form = queryForm.getForm();
        if(!validateForm(form)){
        	return;
        }        
		var bridgePageSize = parseInt(bridgesRecords[i].get('pageSize'));		
		stores[i].load({params:{query:query, start: 0, limit: bridgePageSize}});				
	}
}

function resultsTitleMessage(bridgeName) {
	var msg;
	msg = getLocalizationValue('application.javascript.search.bridge.results.panel.title');
	msg = String.format(msg, bridgeName);
	return msg;
}

function noResultsTitleMessage(bridgeName) {
	var msg;
	msg = getLocalizationValue('application.javascript.search.bridge.no.results.panel.title');
	msg = String.format(msg, bridgeName);
	return msg;
}

function buildStoreForBridge(bridgeName) {
	var store = new Ext.data.JsonStore({			
	    	root:'results',
		    totalProperty: 'totalCount',    
		    fields:['title', 'url'],
		    baseParams: { method: "loadSearchResults", bridgeName:bridgeName },
	    	url:SEARCH_JSON_URL
		});		
		store.on('load', function(store) {
			onSearchResults(store);		
		});				
		return store;
}

function buildPagingBarForBridge(bridgePageSize, i) {
	return new Ext.PagingToolbar({
        	pageSize: bridgePageSize,       
	        store: stores[i] 
    	});    
}

function buildResultsPanelForBridge(bridgeName, i) {
	var title = resultsTitleMessage(bridgeName);
    // the grid panel for specific bridge
   	var results = new Ext.grid.GridPanel({
   		id: i+"",
		loadMask: true,
   		frame: true,
   		autoHeight:true,
   		title:title,
   		autoExpandColumn:'title',
        store:stores[i], 
        columns: [
           	{id:'title',renderer:urlRender, dataIndex: 'title'}
        ],     
       	iconCls: 'icon-grid' ,
       	hideHeaders: true,
       	bbar: pagingBars[i]      
    });
    return results;
}

function fillResults() {  
	for (var i=0; i < count; i++) {
		fillOneResult(i);
			// when the count is greater than 1, add the results[i] to the resultsPanel
			// both esults[0] and resultsPanle are non visisble now
			// and both will become visisble after the search will be performed
	    	resultsPanel.add(results[i]);    
		// load the results panel by searching for an empty string
		var bridgePageSize = parseInt(bridgesRecords[i].get('pageSize'));		
		stores[i].load({params:{query:"", start: 0, limit: bridgePageSize}});
	}	
}
// prepare the specific bridge results panel
function fillOneResult(index) {
	var bridgeName = bridgesRecords[index].get('name');
	var bridgePageSize = parseInt(bridgesRecords[index].get('pageSize'));	
	// the store for specific bridge
	stores[index] = buildStoreForBridge(bridgeName);
	pagingBars[index] = buildPagingBarForBridge(bridgePageSize, index);		
	// the grid panel for specific bridge
	results[index] = buildResultsPanelForBridge(bridgeName, index);	
}

// when results from soecific bridge arrive
function onSearchResults(store) {
	// need to calculate the index of the store first
	var storeIndex = findStoreIndex(store);
	var bridgePageSize = parseInt(bridgesRecords[storeIndex].get('pageSize'));
	var bridgeName = bridgesRecords[storeIndex].get('name');	
	// make the results[storeIndex] visisble in any case
	var tc = store.getTotalCount();
	// if there are search results
	if (tc > 0) {
		results[storeIndex].setTitle(resultsTitleMessage(bridgeName));
		if (tc <= bridgePageSize) {
			pagingBars[storeIndex].hide();
		}
		else {
			pagingBars[storeIndex].show();
		}
	}
	// no results
	else {
	store.insert(0, dummyRecord);
		//check if there is an error message
		if (store.reader.jsonData[ERROR_MESSAGE_ATTR] != null){
			dummyRecord.beginEdit();
			dummyRecord.set('title',store.reader.jsonData[ERROR_MESSAGE_ATTR]);
			dummyRecord.endEdit();
			dummyRecord.commit();
		}
		else {
			//results[storeIndex].setTitle(resultsTitleMessage(bridgeName));
			dummyRecord.beginEdit();
			dummyRecord.set('title',getLocalizationValue('application.javascript.search.no.results'));
			dummyRecord.endEdit();
			dummyRecord.commit();
		}
		pagingBars[storeIndex].hide();				
		
				
	}
	results[storeIndex].doLayout();	
	resultsPanel.doLayout();	
	resizeHeight();
	resizeWidth(results[storeIndex]);
	resizeWidth(resultsPanel);
}

function onPortletRemoval() {
	var frame = $W().document.getElementById("SearchPortletFrame");
	if ((frame != null)) {
		frame.portletRemoved = true;
	}
}

function onPortletDisplay() {
	var frame = $W().document.getElementById("SearchPortletFrame");
	if ((frame != null) && (frame.portletRemoved != undefined)) {
		frame.src = "SYSTEM/portlets/search/search.jsp";
		     		 
	}
}

// called by the toolbar wrapper when the portlet is expanded
function onPortletExpand() { 
	resizeHeight();
}

function validateForm(form){
	//the form is valid
	if(form.isValid()){
    	return true;
    }
    var msg = getLocalizationValue('application.javascript.search.query.cannot.be.empty');
	var title = getLocalizationValue('application.javascript.search.query.not.valid.title');
	Ext.MessageBox.alert(title, msg);
	return false;
}
// the dummy record will be added to the store if no results were received from the server
function createDummyRecord() {
	var myRecord = Ext.data.Record.create([
  		{ name:'title', type:'string' },
  		{ name:'url', type:'string' },
  		{ name:'dummy', type:'string' }
	]);
	var noResults = getLocalizationValue('application.javascript.search.no.results');
	var data = Ext.decode('{title:"'+noResults+'",url:"",dummy:"true"}');
	dummyRecord = new myRecord(data);
}

/**
 * This method is used in case reload = true.
 * It should perform all relevant reload and reset operations, 
 * without destroying the ExtJS components.
 */
function reloadAll() {
	for (var i=0; i < count; i++) {
		// load the results panel by searching for an empty string
		var bridgePageSize = parseInt(bridgesRecords[i].get('pageSize'));		
		stores[i].load({params:{query:"", start: 0, limit: bridgePageSize}});
	}	
	//reset query field
	queryField.reset();
}
/**
 * This method is called by the infrastructure (toolbarWrapper.jsp)
 * Whenever portlet is showed, the parameter indicates whether this is reload operation (reload = true) or not.
 */
function onPortletShow(reload){
	if(reload){
		reloadAll();
	}
}