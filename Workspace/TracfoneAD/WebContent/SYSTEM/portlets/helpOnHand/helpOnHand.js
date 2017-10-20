var resultsGridPanel;
var conn = new Ext.data.Connection();
var documentLocation = 'tab';
var helpOnHandStore;
var helpMsgPanel;
var msgTp;
var msgGotResults = {
        msg: getLocalizationValue('application.javascript.helpOnHand.msg.gotResults'),
        icon: ''
        };
		
var msgNoSearch = {
        msg: getLocalizationValue('application.javascript.helpOnHand.msg.noSearch'),
        icon: ''
        };
        
var msgNoResult = {
        msg: getLocalizationValue('application.javascript.helpOnHand.msg.noResult'),
        icon: ''
        };
        
var msgSearchInProgress = {
        msg: getLocalizationValue('application.javascript.helpOnHand.msg.searchInProgress'),
        icon: '<span class="helpIcon"></span>'
        };


function urlRender(value,metadata,record,rowIndex,colIndex,store) {
	var index = rowIndex+1;
	var result = index +'. <a href="javascript:generalOpenDocument(\''+documentLocation + '\',\'' + record.data['url']+'\');">'+ record.data['title'] +'</a>'; 
	return result;
	

}

Ext.onReady(function(){  
	   
	   registerForMessages();
	   
	// the grid panel for the results list
   		resultsGridPanel = new Ext.grid.GridPanel({
   			id: 'helpOnHandId',
   			border: false,
        	bodyBorder: false,
			width: '100%',
		    height: 90,
   			//title:'Help On Hand Results',
        	store:createHelpOnHandStore(), 
        	columns: [
            	{id:'title',renderer:urlRender, dataIndex: 'title'}
        	],    
			renderTo:  'helpOnHand',
       	 	autoExpandColumn: 'title', // when there is free space to grow, resize only this column
       	 	viewConfig:{forceFit:true}//causes the column to fit the grid 
    	});
     
   
   // panel for messages and icons
   helpMsgPanel = new Ext.Panel({
        	id:'helpMsgId',
        	renderTo:  'helpMsg',
			width: '100%',
		    height: '40%', 	
        	border: false,
        	bodyBorder: false
        });
   
   //template for the messages 
  	msgTp = new Ext.Template( '<p class="helpMsgClass">{icon}</br>{msg}</p>');
   
   //ajax to get document loaction
  	conn.request({
        url: HELPONHAND_JSON_URL,
        method: 'POST',
        params: { method: "getDocumentLocation"},
        success: function(responseObject) {
            documentLocation = responseObject.responseText;
        },
        failure: function() {
             Ext.Msg.alert(getLocalizationValue('application.javascript.helpOnHand.alert.errorTitle'), getLocalizationValue('application.javascript.helpOnHand.alert.errorMsg'));
        }
  	});
   
   
  // document.body.onresize = new Function("resizeContent()");
   //resizeContent();
   handleNoSearchPerformedEvent();

});

// creates the store for the list of results
function createHelpOnHandStore() {

	helpOnHandStore = new Ext.data.JsonStore({			
    	root:'results',
	    totalProperty: 'totalCount',
    	fields:['title', 'url'],
	    url:HELPONHAND_JSON_URL
		});
	helpOnHandStore.on('load', onLoadResults);
	return helpOnHandStore;
}

function resizeContent() {
	//var body = document.body;
	//resultsGridPanel.setWidth(this.frameElement.offsetWidth-10);//body.clientWidth
	//resultsGridPanel.getEl().repaint();
	//resultsGridPanel.doLayout();
	helpMsgPanel.setWidth(this.frameElement.offsetWidth-10);
	//helpMsgPanel.getEl().repaint();
	helpMsgPanel.doLayout();
	
}

/*
 * Register for a Push messages invoked by the help on hand service
 */
function registerForMessages(){
	$W().Push.registerEventHandler( 'HELP_SEARCH_IN_PROGRESS', handleSearchInProgressEvent);
	$W().Push.registerEventHandler( 'HELP_NO_SEARCH_PERFORMED', handleNoSearchPerformedEvent);
	$W().Push.registerEventHandler( 'HELP_NO_SEARCH_RESULTS', handleNoSearchResultsEvent);
	$W().Push.registerEventHandler( 'HELP_GET_UPDATE', handleGetUpdateEvent);
}

/*
 * Unregister all Push messages handlers before portlet is removed
 */
function onPortletRemoval() {
	$W().Push.unregisterEventHandler('HELP_SEARCH_IN_PROGRESS', handleSearchInProgressEvent);
	$W().Push.unregisterEventHandler( 'HELP_NO_SEARCH_PERFORMED', handleNoSearchPerformedEvent);
	$W().Push.unregisterEventHandler( 'HELP_NO_SEARCH_RESULTS', handleNoSearchResultsEvent);
	$W().Push.unregisterEventHandler( 'HELP_GET_UPDATE', handleGetUpdateEvent);
}

function handleSearchInProgressEvent(){
resultsGridPanel.setVisible(false);

//set the msg in the template
 msgTp.overwrite(helpMsgPanel.body, msgSearchInProgress);
                
 showMsgs();
}

function handleNoSearchPerformedEvent(){

	helpOnHandStore.removeAll();
	resultsGridPanel.setVisible(false);
	//set the msg in the template
	 msgTp.overwrite(helpMsgPanel.body, msgNoSearch);
	 
	showMsgs();
	
	$W().undoToolbarNotification("HelpOnHandWindow");
}

function handleNoSearchResultsEvent(){

	//set the msg in the template
	 msgTp.overwrite(helpMsgPanel.body, msgNoResult);
	 
	showMsgs();
}

function handleGetUpdateEvent(){

	helpOnHandStore.load();
}

function hideMsgs(){
	helpDiv = document.getElementById('helpMsg');
	helpDiv.style.display = 'none';
	helpMsgPanel.setVisible(false);
	helpMsgPanel.hide();
}

function showMsgs(){
	helpDiv = document.getElementById('helpMsg');
	helpDiv.style.display = 'inline';
	helpMsgPanel.setVisible(true);
	helpMsgPanel.show();
}

function onLoadResults(store){
	if(store.getTotalCount() > 0){
		resultsGridPanel.setVisible(true);
		//hideMsgs();
		//show msg 'you may find this helpful'
		//set the msg in the template
			msgTp.overwrite(helpMsgPanel.body, msgGotResults);
			showMsgs();
		// notify toolbar
		$W().notifyToolbarButton("HelpOnHandWindow"); 
		
	}
	else {
		resultsGridPanel.setVisible(false);
		showMsgs();
	}
}

/**
 * This method is used in case reload = true.
 * It should perform all relevant reload and reset operations, 
 * without destroying the ExtJS components.
 */
function reloadAll(){
	//register for push messages
 	registerForMessages();
 	handleNoSearchPerformedEvent();
 	
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
