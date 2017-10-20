////////////////// Presence images /////////////////
var incallImgSrc        = contextPath + "images/OnLineWithCall16x16.gif";
var incallDispImgSrc	= contextPath + "images/OnLineWithCall16x16.gif";
var onlineImgSrc        = contextPath + "images/OnLine16x16.gif";
var afterCallImgSrc     = contextPath + "images/OnLineBusy16x16.gif";
var inImImgSrc          = contextPath + "images/OnLineWithChat16x16.gif";
var offlineImgSrc		= contextPath + "images/OffLine16x16.gif";
var deleteImgSrc        = contextPath + "images/delete.gif";

////////////////// Presence labels /////////////////
// These constants should be equal to com.jacada.jad.im.common.InstantMessagingPresence enum
var IM_PRESENCE_IN_CALL = "In call";
var IM_PRESENCE_IN_CALL_DISPOSITIONING = "In call dispositioning";
var IM_PRESENCE_ONLINE = "Online";
var IM_PRESENCE_AFTER_CALL_WORK = "After call work";
var IM_PRESENCE_IN_IM_CONVERSATION = "In IM conversation";
var IM_PRESENCE_OFFLINE = "Offline";

// width of the buttons inside the chat tab
var SEND_BUTTON_WIDTH		= 80;
var END_BUTTON_WIDTH		= 80;

//This file is responsible for showing the current messages in the instant messaging  portlet.
var currentTab;
var tabs;
var conn = new Ext.data.Connection();
var currentUserName = 'Current User';
var HistoryRecord = Ext.data.Record.create([
    {name: 'username', mapping: 'username'},
    {name: 'time', mapping: 'time'},
    {name: 'message', mapping: 'message'}
]);
//history tabs cache, enables quick access to tabs by the contact name
var tabsMap = [];
var enabledTabsMap = new Object();
var contactListTab;
var portletDisabled = false;
var loginSuccesfful = "false";
var reconnectButton;
var connErrorMsg;
var loginErrorMsg;
var chatPortlet;

///////// contact list variables ////////
var userPrivileges;
var isMultiChatEnabled = false;
var isAgentInConversation = false;
// list of all contacts with presence change timestamp -
// this is to display the call\disposition time in the presence tooltip
var contactPresenceTime = new Object();

var supervisorsStore = new Ext.data.JsonStore({
    root:'users',
    fields:['id','name','status'],
    url:CONTACT_LIST_JSON_URL
});

var expertsStore = new Ext.data.JsonStore({
    root:'users',
    fields:['id','name','status'],
    url:CONTACT_LIST_JSON_URL
});

var peersStore = new Ext.data.JsonStore({
    root:'users',
    fields:['id','name','status'],
    url:CONTACT_LIST_JSON_URL
});

var agentsStore = new Ext.data.JsonStore({
    root:'users',
    fields:['id','name','status'],
    url:CONTACT_LIST_JSON_URL
});

var searchStore = new Ext.data.JsonStore({
	root:'users',
    totalProperty: 'totalCount',
    baseParams: { method: "searchUsers" },
    fields:['id','name','status'],
    url:CONTACT_LIST_JSON_URL
});

//workaround to make HtmlEditor enable/disable
Ext.override(Ext.form.HtmlEditor, {
    onDisable: function(){
        if(this.rendered){
            this.wrap.mask();
        }
        Ext.form.HtmlEditor.superclass.onDisable.call(this);
    },
    onEnable: function(){
        if(this.rendered){
            this.wrap.unmask();
        }
        Ext.form.HtmlEditor.superclass.onEnable.call(this);
    }
});
/* Modified code for firefox support for Chat Portlet*/
Ext.override(Ext.TabPanel, {
    onDisable: function(){
        if(this.rendered){
        	if(Ext.isIE){
            	this.bwrap.mask();
        	}
        	else{
            	this.el.mask();
        	}
        }
        Ext.TabPanel.superclass.onDisable.call(this);
    },
    onEnable: function(){
        if(this.rendered){
        	if(Ext.isIE){
            	this.bwrap.unmask();
        	}
        	else{
            	this.el.unmask();
        	}
        }
        Ext.TabPanel.superclass.onEnable.call(this);
    }
});

Ext.grid.GridView.override({
    // added scroll to bottom method:
    scrollToBottom : function() {
    	var s = this.scroller.dom;
    	s.scrollTop = s.scrollHeight;
    	s.scrollLeft = 0;
    }
});

Ext.onReady(function(){
	
	Ext.QuickTips.init();
  	//subscribe for push events notifications
  	registerForMessages();
  	
  	reconnectButton = new Ext.Button({
        id:'reconnectBtn',
        //anchor:  '100%',
	    text: getLocalizationValue('application.javascript.contactList.button.reconnect'),
	    minWidth: SEND_BUTTON_WIDTH,
	    handler: reconnect,
	    hidden: true
	});
	
	loginErrorMsg = new Ext.form.Label({
		id: 'loginErrorMsg',
		hidden: true,
		//anchor:  '100%',
		style: 'font-size: 12px;',
		html: getLocalizationValue('application.javascript.contactList.label.loginError')
	});
	connErrorMsg = new Ext.form.Label({
		id: 'connErrorMsg',
		hidden: true,
		//anchor:  '100%',
		style: 'font-size: 12px;',
		html: getLocalizationValue('application.javascript.contactList.label.connectionError')
	});
	
	
    
  	//obtain currentUserName - this request can be replaced with jsp expression during page loading
  	conn.request({
        url: CONTACT_LIST_JSON_URL,
        method: 'POST',
        params: { method: "getCurrentUserName"},
        success: function(responseObject) {
            currentUserName = responseObject.responseText;
        },
        failure: function() {
             Ext.Msg.alert(getLocalizationValue('application.javascript.messagingWindow.alert.errorTitle'), getLocalizationValue('application.javascript.messagingWindow.alert.errorMsg'));
        }
  	});
  	
  	// get user priviliges - this request can be replaced with jsp expression during page loading or js API
  	conn.request({
        url: CONTACT_LIST_JSON_URL,
        method: 'POST',
        params: { method: "getUserPrivileges"},
        success: function(responseObject) {
        	userPrivileges = eval("(" + responseObject.responseText + ")");
        	// go over user priviliges and hide contacts
        	if (!userPrivileges["agentChatEnabled"]) {
        		var agentsPanel =  contactListTab.getComponent(0);
        		agentsPanel.hide();
        		if (!userPrivileges["peersChatEnabled"]) {
        			// if both privs are off, hide the search field
        			contactListTab.getComponent(4).hide();
        		}
        	}
        	if (!userPrivileges["peersChatEnabled"]) {
        		var peersPanel =  contactListTab.getComponent(1);
        		peersPanel.hide();
        	}
        	if (!userPrivileges["expertsChatEnabled"]) {
        		var expertsPanel =  contactListTab.getComponent(2);
        		expertsPanel.hide();
        	}
        	if (!userPrivileges["supersChatEnabled"]) {
        		var supersPanel =  contactListTab.getComponent(3);
        		supersPanel.hide();
        	}
        },
        failure: function() {
             Ext.Msg.alert(getLocalizationValue('application.javascript.contactList.alert.errorTitle'), getLocalizationValue('application.javascript.contactList.alert.errorMsg'));
        }
    });
  	
  	
  	/* Modified code for firefox support for Chat Portlet*/
    
        if(Ext.isIE){
        	    tabs = new Ext.TabPanel({
		    	width: TABS_WIDTH,
		    	anchor:  '100% 100%',
		    	renderTo: Ext.getBody(),
		    	layoutOnTabChange: true,
		        resizeTabs:true, 
		        minTabWidth: TABS_WIDTH,
		        tabWidth: TABS_WIDTH,
		        enableTabScroll:true,
		        autoScroll: false,
		        forceLayout:  true,
		        defaults: {autoScroll:false}
		    });
        }
        else{
        	    tabs = new Ext.TabPanel({
	        	width: 325,
	        	height:400,
	        	layoutOnTabChange: true,
	            resizeTabs:true, 
	            minTabWidth: TABS_WIDTH,
	            tabWidth: TABS_WIDTH,
	            enableTabScroll:true,
	            autoScroll: false,
	            forceLayout:  true,
	            defaults: {autoScroll:false}
        });
        }
        
    tabs.on('beforeremove', removeTabEvent);
    tabs.on('tabchange', tabChangeEvent);
    
    // add the contact list tab
    contactListTab = getContactListTab(); 
	tabs.add(contactListTab).show();
	tabs.setActiveTab(contactListTab);
	
	document.body.onresize = new Function("resizeContent()");
   
  	chatPortlet = new Ext.Panel({
  		layout:  'anchor',
        frame: true,
        items: [loginErrorMsg, connErrorMsg, reconnectButton, tabs]
    });
  	   
    chatPortlet.render('formPlaceholder');    
    resizeContent();
    
 // login - moved to the end so that when loading the contacts we know all the UI components 
    // are rendered.
  	conn.request({
        url: CONTACT_LIST_JSON_URL,
        method: 'POST',
        params: { method: "login" },
        success: function(responseObject) {
        	loginSuccesfful = responseObject.responseText;
        	if (loginSuccesfful == "false") {
		    	// add reconnect btn and msg
		    	reconnectButton.show();
		    	loginErrorMsg.show();
		    	// disable all controls
		    	disablePortlet();
		    } else {
		    	updateContactList();
		    }
        },
        failure: function() {
	     	Ext.Msg.alert(getLocalizationValue('application.javascript.messagingWindow.alert.errorTitle'), getLocalizationValue('application.javascript.messagingWindow.alert.errorMsg'));
        }
    });
      
    
});

/*
 * resize the inner components according to the portlet size
 */
function resizeContent() {
	//changing the width and height to allow the wrapping window frame
	/* Modified code for firefox support for Chat Portlet*/
	var width = $W().toolbarWindows[portletName] != undefined ? (Ext.isIE ? 20 : 40) : 0;
	var height = $W().toolbarWindows[portletName] != undefined ? 40 : 0;

	if(Ext.isIE || Ext.isChrome){
	chatPortlet.setWidth(this.frameElement.offsetWidth-width);
	chatPortlet.setHeight(this.frameElement.offsetHeight-height);
	}
	else{
	chatPortlet.setWidth(this.el.offsetWidth-width);
	chatPortlet.setHeight(this.el.offsetHeight-height);
	}
	chatPortlet.doLayout();
	chatPortlet.getEl().repaint();
}

// do layout on every tab change because of 
// problem with layout when portlet is minimized or hidden
function tabChangeEvent(tabpanel, tab) { 
	tab.doLayout();
	tab.syncSize();
	// WS-1805: find the add contacts tab and hide the result list
	var tabTitle = getLocalizationValue('application.javascript.contactList.searchTabTitle');
	var searchTab = findTab(tabTitle);
	if (searchTab != null) {
		searchTab.getComponent(0).collapse();
	}
	
}

// reconnect button handler
function reconnect() {
	reconnectButton.disable();
	conn.request({
        url: CONTACT_LIST_JSON_URL,
        method: 'POST',
        params: { method: "reconnect" },
        success: function(responseObject) {
        	loginSuccesfful = responseObject.responseText;
        	if (loginSuccesfful == "true") {
		    	// remove reconnect btn and msg
		    	reconnectButton.hide();
		    	loginErrorMsg.hide();
		    	// enable all controls
		    	enablePortlet();
		    } else {
		    	reconnectButton.enable();
		    }
        },
        failure: function() {
	     	Ext.Msg.alert(getLocalizationValue('application.javascript.messagingWindow.alert.errorTitle'), getLocalizationValue('application.javascript.messagingWindow.alert.errorMsg'));
        }
    });
}

function connectionDown() {
	disablePortlet();
	// get contact list with offline users
	updateContactList();
	connErrorMsg.show();
}

function connectionUp() {
	connErrorMsg.hide();
	enablePortlet();
}

// disable portlet in case no connection to server
function disablePortlet() {
	portletDisabled = true;
	// disable the search combo - not necessary anymore because combo box is not in the contact list tab
	contactListTab.getComponent(4).disable;
	// set contact list tab as active
	tabs.setActiveTab(contactListTab);
	// disable all other tabs
	for (var i=0; i<tabsMap.length; i++) {
		var currentTab = tabsMap[i];
		currentTab.disable();
    }
	tabs.disable();
}

// enable portlet when connection to server is back up
function enablePortlet() {
	// enable all tabs
	for (var i=0; i<tabsMap.length; i++) {
		var currentTab = tabsMap[i];
		currentTab.enable();
    }
	tabs.enable();
	// enable the search combo
	contactListTab.getComponent(4).enable;
	// get updated contact list
	//updateContactList();
	portletDisabled = false;
}

//disable all chatting controls of a chat tab
function disableControls(tab) {
	tab.getComponent(tab.title + 'inputField').disable();
    var btns = tab.getComponent(tab.title +'btns');
    btns.buttons[1].disable();
    btns.buttons[0].disable();
    tab.focus();
}

//enable all chatting controls of a chat tab
function enableControls() {
	var currentTab = tabs.getActiveTab();
	currentTab.getComponent(currentTab.title + 'inputField').enable();
    var btns = currentTab.getComponent(currentTab.title +'btns');
    btns.buttons[1].enable();
    btns.buttons[0].enable();
}

//listener called when the input was activated
function onInputActivated(e) {
	//upon activation try to cancel flashing
	cancelFlashingTab();

	//register the events for this input (taken from a forunm in extjs) 
	 var editor = this.container.dom.childNodes[1].lastChild.contentWindow.document;
	//Used addEvent instead of attachEvent for firefox support. 
	 addEvent(editor, 'keyup',checkEditorValue, false);
	 checkEditorValue();
}

//listener called when the input was activated
function onGridActivated() {
	//upon activation try to cancel flashing
	cancelFlashingTab();

	//register the events for this input (taken from a forunm in extjs)
	 iframe = this.container.dom.childNodes[0].lastChild.document;
	 iframe.attachEvent('onclick', cancelFlashingTab, this);//end of attachevent*/
}

//function called to cancel a flashing tab only if it is the current tab
function cancelFlashingTab() {
	var tab = tabs.getActiveTab();
	if ((tab == null) || (tabs.getTabEl(tab) == null)){
		return;
	}
	//check if the current tab is flashing
	if (Ext.fly(tabs.getTabEl(tab)).child('.x-tab-strip-text').hasClass("flashingTab")){
         Ext.fly(tabs.getTabEl(tab)).child('.x-tab-strip-text').stopFx();
         Ext.fly(tabs.getTabEl(tab)).child('.x-tab-strip-text').removeClass("flashingTab");
         Ext.fly(tabs.getTabEl(tab)).child('.x-tab-strip-text').setStyle("background-color",getBgColorUponFlashingStopped());  
    }
	
} 

//listener called to remove tab from cache when tab is closed
function removeTabEvent(tabpanel, tab) { 
    if(enabledTabsMap[tab.getId()] == true) {
        //send end conversation system message'
        conn.request({
            url: CONTACT_LIST_JSON_URL,
            method: 'POST',
            params: { method: "endConversation", userId:tab.title},
            success: function(responseObject) {
                //enabledTabsMap[tab.getId()] = false;
             },
             failure: function() {
	             Ext.Msg.alert(getLocalizationValue('application.javascript.messagingWindow.alert.errorTitle'), getLocalizationValue('application.javascript.messagingWindow.alert.errorMsg'));
                 return false;
             }
        });
    }    
    endConversation(tab.title);
    
    removeIndex = tabsMap.length;    
    for(var i=0; i<tabsMap.length; i++) {
        if(tabsMap[i].title == tab.title) {
            removeIndex = i;    
        }
    }
    tabsMap.splice(removeIndex, 1);
}

// push handler for start conversation messages from a contact
function startConversationReceived(param) {
	var sender = param.userName;
	var extension = param.extension;
	var msg = getLocalizationValue('application.javascript.messagingWindow.agent') + " " + sender;
	if ((extension != undefined) && (extension != "")) {
		msg = msg + ", " + getLocalizationValue('application.javascript.messagingWindow.extension') + " " + extension + ",";
	}
	msg = msg + " " + getLocalizationValue('application.javascript.messagingWindow.startConversationMsg'); 
	var currentTab = tabs.getActiveTab();
	onStartConversation(sender, msg);
	if (!shouldSwitchToTab()) {
		// move back to previous tab and flash the new tab header
		tabs.setActiveTab(currentTab);
		flashTabWithNewMessage(findTab(sender),getBgColorUponNewMessage(),getFlashNumOfTimesUponNewMessage());
		tabs.scrollToTab(findTab(sender), true);
	}
	// Handle contact list tab -
	afterConversationStarted();
	notifyToolbar();
}

// check if need to switch to new tab
// return true if only one active chat
function shouldSwitchToTab() {
	// only one chat tab exist
	if (tabsMap.length < 2) {
		return true;
	}
	// more then one tab - check how many are enabled
	var enabledCount = 0;    
    for(var id in enabledTabsMap) {
        if(enabledTabsMap[id] == true) {
        	enabledCount = enabledCount + 1;
        }
	}
	if (enabledCount == 1) {
		return true;
	}
	return false;
}

//push handler for start conversation messages triggered by the user
function startConversation(param) {
	var sender = param.userName;
	var extension = param.extension;
	var msg = getLocalizationValue('application.javascript.messagingWindow.startConversationWithMsg') + " " + sender;
	if ((extension != undefined) && (extension != "")) {
		msg = msg + ", " + getLocalizationValue('application.javascript.messagingWindow.extension') + " " + extension;
	}
	onStartConversation(sender, msg);
}

//open new conversation tab if needed 
function onStartConversation(sender, msg) {
	if(isNewTabRequired(sender)) {
		//create datastore for new conversation
        var store = new Ext.data.SimpleStore({
            root: sender + 'history',
            fields: ['username','time','message']
        });
        
        //create grid to represent conversation
        var grid = new Ext.grid.GridPanel({
        	anchor: '100%, 100%',
            store: store,
            trackMouseOver:false,
            disableSelection:true,
            hideHeaders: true,
            loadMask: true,
            layout: 'fit',
            //listeners: {activate: onGridActivated},
            cls: 'overrideExtjsStyling',

            // grid columns
            columns:[{
                id: 'username',
                dataIndex: 'username',
                width: 150,
                renderer: renderUsername,
                sortable: true
            }],

            // customize view config
            viewConfig: {
                forceFit:true,
                enableRowBody:true,
                showPreview:true,
                getRowClass : function(record, rowIndex, p, store){
                        p.body = record.data.message;
                        return 'x-grid3-row-expanded word-wrap-in-chat';
                }
            },

            // paging bar on the bottom
            bbar:null
        });
        grid.on("activate", onGridActivated); // handle tab header flashing
        
        var historyPanel = new Ext.Panel({
        	id:sender + 'historyPanel',
        	anchor: '100%, 50%',
        	//defaults:{ autoScroll: true },
		    layout: 'anchor',
        	items: [grid]        	
        })
        
        var sendButton = new Ext.Button({
        	id:sender + 'sendBtn',
	        text: getLocalizationValue('application.javascript.messagingWindow.button.sendMessage'),
	        minWidth: SEND_BUTTON_WIDTH,
	        handler: sendMessage
	    });
	
	    var endButton = new Ext.Button({
	    	id:sender + 'endBtn',
	        text: getLocalizationValue('application.javascript.messagingWindow.button.endConversation'),
	        minWidth: END_BUTTON_WIDTH,
	        handler: endConversationHandler
	    });
	    
	    var buttonsPanel = new Ext.Panel({
	    	id:sender + 'btns',
	    	anchor: '100%, 10%',
	    	buttons: [sendButton, endButton]
	    });
	  
	    var input = new Ext.form.HtmlEditor({
	    	id:sender + 'inputField',
	        labelSeparator: '',
	        fieldLabel: '',
	        hideLabel: true,
	        header:false,
	        anchor: '100%, 35%',
	        enableFont:false,
	        enableAlignments:false,
	        enableSourceEdit:false,
	        enableFontSize:false,
	        listeners: {
			    initialize: function(e) {
			    	// a workaround taken from extJS forum to a bug
			    	//where a white space is added to the html editor on initialize.
			    	//In IE7 we need to updateToolbar() or the execCmd does not appear to have any effect
			       e.execCmd('delete');
			       if (Ext.isIE) {
			         e.updateToolbar();
			         e.focus();
			       }
			    }
			    , delay: 50 
			}
	    });
	    input.on("activate", onInputActivated);
	    
        var chatForm = new Ext.Panel({
			tabTip: sender,
	        width: TABS_WIDTH,
	        resizeTabs:true, 
	        minTabWidth: TABS_WIDTH,
	        header:false,
	        title:sender,
	        closable: true,
	        id:sender,
	        frame: true,
	        hideMode:'offsets',
	        layout: 'anchor',
			items: [historyPanel,input, buttonsPanel]
	    });
	   	chatForm.on("activate", onGridActivated);

        //add new conversation tab
        tabs.add(chatForm);
        
        //add it to cache
        tabsMap[tabsMap.length] = chatForm;
        enabledTabsMap[chatForm.getId()] = true;
        
        /* Modified code for firefox support for Chat Portlet*/
        if(Ext.isIE){
        	tabs.setActiveTab(chatForm);
        }
        else {
			try{
				tabs.activate(chatForm);
        	}catch (e) {
				
			}
		}
		
        addMessage(getLocalizationValue('application.javascript.messagingWindow.systemName'), msg, sender);
        input.focus();
    } else if (!enabledTabsMap[sender]) {
    	// tab exists but disabled - switch to tab and enable it
    	var activeTab = findTab(sender);
    	tabs.setActiveTab(activeTab);
    	enableControls();
    	enabledTabsMap[sender] = true;
    	addMessage(getLocalizationValue('application.javascript.messagingWindow.systemName'), msg, sender);
    	var input = activeTab.getComponent(activeTab.title + 'inputField');
        input.focus();
    } else {
    	// tab exists and is enabled - switch to tab
    	tabs.setActiveTab(findTab(sender));
    }
    
    var activeTab = findTab(sender);
    var input = activeTab.getComponent(activeTab.title + 'inputField');
    input.focus();
}

// trim long messages
function checkEditorValue() {
	if (portletDisabled) {
		return;
	}
	var currentTab = tabs.getActiveTab();
	// get html editor and sync it with the actual text in the iframe -
	var input = currentTab.getComponent(currentTab.title + 'inputField');
	input.syncValue();
	var text = input.getValue();
	
	// trim chat message that exceeds max size -	
	if (text.length > getMaxMessageSize()) {
		input.setValue(text.substr(0,getMaxMessageSize()));
	}
}

//check in cache if new tab required for given username
function isNewTabRequired(username) {
    if(tabsMap.length == 0) {
        return true;
    }

    var result = true;

    for (var i=0; i<tabsMap.length; i++) {
        if(tabsMap[i].title == username) {
            result = false;
            break;
        }
    }

    return result;
}

//add message to conversation tab
function addMessage(sender, message, tabName) {
	var date = new Date();
	var newRecord = new HistoryRecord({
        username: sender,
        time: date.format(CHAT_DATE_FORMAT + " " + CHAT_TIME_FORMAT),
        message: message
    });
	
	var historyPanel = findTab(tabName).getComponent(tabName + 'historyPanel').getComponent(0);
	historyPanel.getStore().add(newRecord);
	historyPanel.getView().scrollToBottom();
	
	tabs.scrollToTab(findTab(tabName), true); // sync the tab header
}

//incoming message push listener
function incomingMessage(param) {
	if (tabs.items.getCount() > 0)
    	currentTab = tabs.getActiveTab();

	var startDetails = new Object();
	startDetails.userName = param.sender;
    delete startDetails;
    addMessage(param.sender, param.message, param.sender);
    
    if (currentTab.id != param.sender) {   
    	var tab = findTab(param.sender);
    	flashTabWithNewMessage(tab,getBgColorUponNewMessage(),getFlashNumOfTimesUponNewMessage());
    } 
    
    notifyToolbar(); 
}

function notifyToolbar() {
	if ($W().toolbarWindows[portletName] != undefined) {
		if ($W().toolbarWindows[portletName].hidden || $W().toolbarWindows[portletName].collapsed) {
			// notify toolbar only if window isn't open
			$W().notifyToolbarButton(portletName);
		}
	} 
}

function flashTabWithNewMessage(tab, bgColor, numberOfTimes) {
	//mark this tab as a flashing one, so that we can unflash when it comes to focus
	Ext.fly(tabs.getTabEl(tab)).child('.x-tab-strip-text').addClass("flashingTab");
	
	var options = {
		    attr: "background-color", //can be any valid CSS property (attribute) that supports a color value
		    easing: 'easeIn',
		    duration: 1
			};
			
	while (numberOfTimes > 0)
	{	
		//setting the color to be used for the fade-in
		Ext.fly(tabs.getTabEl(tab)).child('.x-tab-strip-text').setStyle("background-color",bgColor);
		//flash the tab using the fade-in method
		Ext.fly(tabs.getTabEl(tab)).child('.x-tab-strip-text').fadeIn(options);
		numberOfTimes--;
		
	}
}

function findTab(tabTitle) {
	//going over tabs
    for (var i=0; i<tabsMap.length; i++) {
    	if(tabsMap[i].title == tabTitle) {
    		return tabsMap[i];
        }
    }
    return null;
}

//used to show messages from different users in different colors
function renderUsername(value, p, r){
    return String.format('<b><font color="' + getColor(r.data['username']) + '">{0}&nbsp;({1}):</b></font>',  r.data['username'], r.data['time']);
}

function getColor(username) {
    if(username != currentUserName) {
        return "red";
    }

    return "blue";
}

//send message button handler
function sendMessage() {
	var input = tabs.getActiveTab().getComponent(tabs.getActiveTab().title + 'inputField');
	var msg = input.getValue();
    if(msg != '') {
    	msg = cleanMessage(msg);
        addMessage(currentUserName, msg, tabs.getActiveTab().title);

        conn.request({
            url: CONTACT_LIST_JSON_URL,
            method: 'POST',
            params: { method: "sendMessage", recipient:tabs.getActiveTab().title, message:msg},
		    success: function(responseObject) {
                input.reset();
            },
             failure: function() {
	             Ext.Msg.alert(getLocalizationValue('application.javascript.messagingWindow.alert.errorTitle'), getLocalizationValue('application.javascript.messagingWindow.alert.errorMsg'));
             }
        });

        input.focus();
    }
}

//end conversatiob button handler
function endConversationHandler() {
    endConversation(tabs.getActiveTab().title);

    //send end conversation system message'
    conn.request({
        url: CONTACT_LIST_JSON_URL,
        method: 'POST',
        params: { method: "endConversation", userId:tabs.getActiveTab().title},
        success: function(responseObject) {
         },
         failure: function() {
	             Ext.Msg.alert(getLocalizationValue('application.javascript.messagingWindow.alert.errorTitle'), getLocalizationValue('application.javascript.messagingWindow.alert.errorMsg'));
         }
    });
}

// push handler for end conversation by supervisor
function overrideConversation(param) {
	var msg = getLocalizationValue('application.javascript.messagingWindow.overrideConversationMsg1') + " " + param;
	msg = msg + " " + getLocalizationValue('application.javascript.messagingWindow.overrideConversationMsg2');
	onEndConversation(param, msg);
	notifyToolbar();
}

// push handler for end conversation by the other contact
function endConversationReceived(param) {
	endConversation(param);
	notifyToolbar();
}

function endConversation(param) {
	var msg = getLocalizationValue('application.javascript.messagingWindow.endConversationMsg') + " " + param;
	onEndConversation(param, msg);
}

function onEndConversation(param, msg) {
    if (tabs.items.getCount() > 0)
        currentTab = tabs.getActiveTab();

    for(var id in enabledTabsMap) {
        if((enabledTabsMap[id] == true) && tabs.getItem(id).title == param) {
        	var tab = tabs.getItem(id)
            
            // move focus from html editor to one of the btns, to disable writing in the editor -
			var btns = tab.getComponent(tab.title +'btns');
		    btns.buttons[1].focus();
		    
            addMessage(getLocalizationValue('application.javascript.messagingWindow.systemName'), msg, param);
            enabledTabsMap[id] = false;
            disableControls(tab);
            		    
		    if (currentTab.id != id) {   
		    	flashTabWithNewMessage(tab,getBgColorUponNewMessage(),getFlashNumOfTimesUponNewMessage());
		    } 
        }
    }
    
	// Handle contact list tab -
	afterEndConversation();	
}

//using methods to retrieve the flashing color so that it can be overriden if needed
function getBgColorUponNewMessage() {
	return "6699CC";
}

//using methods to retrieve the stop-flashing color so that it can be overriden if needed
function getBgColorUponFlashingStopped() {
	return "transparent";
}
//using methods to retreive the flashing number of times so that it can be overriden if needed
function getFlashNumOfTimesUponNewMessage() {
	return 10;
}

//bug ws-794 when inserting automated links , add a parameter so the link will be opened in a different window
function cleanMessage(msgToClean){
	newMsg = msgToClean;
	linkIndex = msgToClean.indexOf("<A href");
	if(linkIndex != -1) {
		linkIndex = linkIndex + 3;
		
		first = msgToClean.substring(0, linkIndex);
		second = msgToClean.substring(linkIndex, msgToClean.length);
		newMsg = first + "target=\"_blank\" " + second;
		return cleanMessage(newMsg);
	} else {
		return msgToClean;
	}	
}

// this method is used to determine the maximum size of a single chat message.
function getMaxMessageSize() {
	return 700;
}

//subscribe for push events notifications
function registerForMessages() {
	$W().Push.registerEventHandler( 'END_CONVERSATION_NOTIFICATION', endConversationReceived);
    $W().Push.registerEventHandler( 'END_CONVERSATION_BY_SUPERVISOR_NOTIFICATION', overrideConversation);
    $W().Push.registerEventHandler( 'START_CONVERSATION_NOTIFICATION', startConversation);
    $W().Push.registerEventHandler( 'START_CONVERSATION_RECEIVED_NOTIFICATION', startConversationReceived);
    $W().Push.registerEventHandler( 'SEND_MESSAGE_NOTIFICATION', incomingMessage);    
    $W().Push.registerEventHandler( 'CONTACT_PRESENCE_NOTIFICATION', setContactPresence);
    $W().Push.registerEventHandler( 'UPDATE_CONTACT_LIST_NOTIFICATION', updateContactList);
    $W().Push.registerEventHandler( 'CONNECTION_DOWN_NOTIFICATION', connectionDown);
    $W().Push.registerEventHandler( 'CONNECTION_UP_NOTIFICATION', connectionUp);
}

function onPortletDisplay() {
	var frame = $W().document.getElementById(portletName + "Frame");
	if ((frame != null) && (frame.portletRemoved != undefined)) {
		frame.src = "SYSTEM/portlets/chat/chat.jsp";
	}
}

function onPortletRemoval() {
	// close all active chats before closing the portlet -
	for(var id in enabledTabsMap) {
        if(enabledTabsMap[id] == true) {
        	//synchronous Ajax must be used explicitly to ensure that relevant data is comming before logout request.
        	var prefs = "method=endConversation&userId=" + id;
			new Ajax.Request(CONTACT_LIST_JSON_URL, { method: 'POST', parameters: prefs, asynchronous : false });
        }
    }
    if ($W().logged == true) {
	    // set user presence as offline
	    conn.request({
	        url: CONTACT_LIST_JSON_URL,
	        method: 'POST',
	        params: { method: "logout" },
	        success: function(responseObject) {},
	        failure: function() {
		     	Ext.Msg.alert(getLocalizationValue('application.javascript.messagingWindow.alert.errorTitle'), getLocalizationValue('application.javascript.messagingWindow.alert.errorMsg'));
	        }
	    });
    }
    // unregister all push handlers -
	$W().Push.unregisterEventHandler( 'END_CONVERSATION_NOTIFICATION', endConversationReceived);
    $W().Push.unregisterEventHandler( 'END_CONVERSATION_BY_SUPERVISOR_NOTIFICATION', overrideConversation);
    $W().Push.unregisterEventHandler( 'START_CONVERSATION_NOTIFICATION', startConversation);
    $W().Push.unregisterEventHandler( 'START_CONVERSATION_RECEIVED_NOTIFICATION', startConversationReceived);
    $W().Push.unregisterEventHandler( 'SEND_MESSAGE_NOTIFICATION', incomingMessage);    
   	$W().Push.unregisterEventHandler( 'CONTACT_PRESENCE_NOTIFICATION', setContactPresence);
    $W().Push.unregisterEventHandler( 'UPDATE_CONTACT_LIST_NOTIFICATION', updateContactList);  
    $W().Push.unregisterEventHandler( 'CHAT_DISABLED', connectionDown);
    $W().Push.unregisterEventHandler( 'CHAT_ENABLED', connectionUp);  
    // set removed flag on portlet iframe -
    var frame = $W().document.getElementById(portletName + "Frame");
	if ((frame != null)) {
		frame.portletRemoved = true;
	}
}

//////////////////////////////// Contact List Tab //////////////////////////////////////////////////////

// Create the contact list tab
function getContactListTab() {
	// like the privileges request - can be moved to jsp
	conn.request({
        url: CONTACT_LIST_JSON_URL,
        method: 'POST',
        params: { method: "isMultiChatEnabled"},
        success: function(responseObject) {
            isMultiChatEnabled = responseObject.responseText;
        },
        failure: function() {
             Ext.Msg.alert(getLocalizationValue('application.javascript.contactList.alert.errorTitle'), getLocalizationValue('application.javascript.contactList.alert.errorMsg'));
        }
    });
  	searchStore.load();

	var agentsGrid = new Ext.grid.GridPanel({
        store:agentsStore, 
        id: 'agentsGrid',
        columns: [
            {renderer:nameRender, dataIndex: 'name', id: 'name'},
            {width: 30, renderer: statusRender, dataIndex: 'status'},
            {width: 30, renderer: deleteFavoriteRender, dataIndex: 'name'}
        ],
        autoExpandColumn: 'name',
        anchor: '100%, 100%',
        autoHeight:true,
        hideHeaders: true,
        iconCls: 'icon-grid'
    });
    var agentsPanel = new Ext.Panel({
    	id: 'agentsPanel',
    	layout: 'anchor',
        title:getLocalizationValue('application.javascript.contactList.favoritesTitle'),
        collapsible:true,
        collapsed: true,
        anchor: '100%',
        items: [agentsGrid]
    });
	
    
    var peersGrid = new Ext.grid.GridPanel({
        store:peersStore, 
        columns: [
            {renderer:nameRender, dataIndex: 'name', id: 'name'},
            {width: 30, renderer: statusRender, dataIndex: 'status'},
            {width: 30, renderer: deletePeerRender, dataIndex: 'id'}
        ],
        autoExpandColumn: 'name',
        anchor: '100%, 100%',
        autoHeight:true,
        hideHeaders: true,
        iconCls: 'icon-grid'
    });
    var peersPanel = new Ext.Panel({
        title:getLocalizationValue('application.javascript.contactList.peersTitle'),
        collapsible:true,
        collapsed: true,
        layout: 'anchor',
        anchor: '100%',
        items: [peersGrid]
    });
	
    
    var expertsGrid = new Ext.grid.GridPanel({
        store:expertsStore, 
        columns: [
            {renderer:nameRender, dataIndex: 'name', id: 'name'},
            {width: 30, renderer: statusRender, dataIndex: 'status'}
        ],
        autoExpandColumn: 'name',
        anchor: '100%, 100%',
        autoHeight:true,
        hideHeaders: true,
        iconCls: 'icon-grid'
    });
    var expertsPanel = new Ext.Panel({
        title:getLocalizationValue('application.javascript.contactList.expertsTitle'),
        collapsible:true,
        collapsed: true,
        layout: 'anchor',
        anchor: '100%',
        items: [expertsGrid]
    });
    
    var supersGrid = new Ext.grid.GridPanel({
        store:supervisorsStore, 
        columns: [
            {renderer: superNameRender, dataIndex: 'name', id: 'name'},
            {width: 30, renderer: statusRender, dataIndex: 'status'}
        ],
        autoExpandColumn: 'name',
        anchor: '100%, 100%',
        autoHeight:true,
        hideHeaders: true,
        iconCls: 'icon-grid'
    });
    var supersPanel = new Ext.Panel({
        title:getLocalizationValue('application.javascript.contactList.supervisorsTitle'),
        collapsible:true,
        collapsed: true,
        layout: 'anchor',
        anchor: '100%',
        items: [supersGrid]
    });
        
    var searchLinkPanel = new Ext.Panel({
       id:'searchLinkPanel',
       html: '<a href="#searchLinkPanel" onclick="openSearchTab()" id="searchLinkPanel" style="float: left;">' + getLocalizationValue('application.javascript.contactList.searchLink') + '</a>'
    });
    
    var container = new Ext.Panel({
        header:false,
		tabTip: getLocalizationValue('application.javascript.contactList.title'),
        title:getLocalizationValue('application.javascript.contactList.title'),
        id:"ContactList",
        frame: true,
	    hideMode:'offsets',
        autoScroll: false,
        layout: 'anchor',
        items: [agentsPanel, peersPanel, expertsPanel, supersPanel, searchLinkPanel]
    });
    
    return container;
}

function openSearchTab() {
	var tabTitle = getLocalizationValue('application.javascript.contactList.searchTabTitle');
	var searchTab = findTab(tabTitle);
	if (searchTab != null) {
		tabs.setActiveTab(searchTab);
	} else {
		// Custom rendering Template
	    var resultTpl = new Ext.XTemplate(
	        '<tpl for="."><div class="search-item">',
	            '<h2><span>{name}</h2>',
	        '</div></tpl>'
	    );
	    
	    var search = new Ext.form.ComboBox({
	        emptyText: getLocalizationValue('application.javascript.contactList.emptyText'),
	        store: searchStore,
	        listeners: {
		        // WS-713: delete the previous query in the beforequery event or set.
		        // this will reload the store the next time it expands.
		        beforequery: function(qe){
		        	delete qe.combo.lastQuery;
		        }
		    },
	        listAlign:'tl-bl',
	        minChars: SEARCH_MIN_CHARS,
	        displayField:'name',
	        loadingText: getLocalizationValue('application.javascript.contactList.loadingText'),
	        anchor: '100%',
	        id: tabTitle + 'combo',
	        pageSize:SEARCH_RESULTS_PAGE_SIZE,
	        hideTrigger:true,
	        tpl: resultTpl,
	        itemSelector: 'div.search-item',
	        onSelect: function(record){ 
	            conn.request({
	                url: CONTACT_LIST_JSON_URL,
	                method: 'POST',
	                params: { method: "addToFavorites", id:record.data['name']},
	                success: function(responseObject) {
	                    groupName = responseObject.responseText;
	                    // open\expand the relevant contact list
        				if (groupName == "Agents") {
        					tabs.setActiveTab(contactListTab);
        					contactListTab.getComponent(0).expand(true);
        				} else if (groupName == "peers") {
        					tabs.setActiveTab(contactListTab);
        					contactListTab.getComponent(1).expand(true);
        				}
        				updateContactList();
	                },
	                failure: function() {
	                    Ext.Msg.alert(getLocalizationValue('application.javascript.contactList.alert.errorTitle'), getLocalizationValue('application.javascript.contactList.alert.errorMsg'));
	                }
	            });
	
	            this.clearValue();
	            this.collapse();
	            this.preFocus();
	            
	            searchStore.clearFilter(true);
	        }
	    });
	    
		var searchTab = new Ext.Panel({
			tabTip: tabTitle,
	        width: TABS_WIDTH,
	        minTabWidth: TABS_WIDTH,
	        resizeTabs:true, 
	        header: false,
	        title: tabTitle,
	        closable: true,
	        id: tabTitle,
	        frame: true,
	        hideMode:'offsets',
	        layout: 'anchor',
			items: [search]
	    });
        //add new conversation tab
        tabs.add(searchTab);
        tabs.setActiveTab(searchTab);
        //add it to cache
        tabsMap[tabsMap.length] = searchTab;
	}	
}

// not in use
function getEmptyPanel() {
	var panel = new Ext.Panel({
	        anchor: '100%'
	});
	panel.setContent("");
	return panel;
}

//name should be displayed as a link if user is online
function nameRender(value,parent,record) {
	// displayBusyContact will be true if user is supervisor and the contact is not offline
 	var displayBusyContact = (isMultiChatEnabled == 'true' && record.data['status']!=IM_PRESENCE_OFFLINE);
 	// will return a link if displayBusyContact is true or the contact is available and the user is not in chat
    if((record.data['status']==IM_PRESENCE_ONLINE || displayBusyContact) && !isAgentInConversation) {
        return '<a href="#userName" onclick="onNameClick(\'' + record.data['name'] + '\')">' + value + '</a>'
    }
    return value;
}

//name should be displayed as a link if user is online
function superNameRender(value,parent,record) {
 	if((record.data['status']!=IM_PRESENCE_OFFLINE) && !isAgentInConversation) {
        return '<a href="#userName" onclick="onNameClick(\'' + record.data['name'] + '\')">' + value + '</a>'
    }
    return value;
}

//invoked by clicking on active user name
function onNameClick(id) {
	if (portletDisabled) {
		return;
	}
    conn.request({
        url: CONTACT_LIST_JSON_URL,
        method: 'POST',
        params: { method: "startConversation", userId:id},
        success: function(responseObject) {
        	afterConversationStarted();
        },
         failure: function() {
             Ext.Msg.alert(getLocalizationValue('application.javascript.contactList.alert.errorTitle'), getLocalizationValue('application.javascript.contactList.alert.errorMsg'));
         }
    });
}

function afterConversationStarted() {
	if (isMultiChatEnabled == "false") {
    	// disable all links
    	isAgentInConversation = true;
    	updateContactList();
    }
}

function afterEndConversation() {
	if ((isMultiChatEnabled == "false") && (getActiveChatCount() == 0)) {
    	// enable all links
    	isAgentInConversation = false;
    	updateContactList();
    }
}

// returns the number of currently active chat session
function getActiveChatCount() {
	var count = 0;
	for(var id in enabledTabsMap) {
        if (enabledTabsMap[id] == true) {
        	count++;
        }
	} 
    return count;
}

//display picture depending on user status
function statusRender(value,parent,record) {
    if(value == IM_PRESENCE_IN_CALL) return '<img id="' + record.data['name'] + '_presence" src="' + incallImgSrc + '" alt="' + getLocalizationValue('application.javascript.contactList.image.tooltip.incall') + '" onmouseover="setInCallTime(\'' + record.data['name'] + '\')"/>';
    if(value == IM_PRESENCE_ONLINE) return '<img src="' + onlineImgSrc + '" alt="' + getLocalizationValue('application.javascript.contactList.image.tooltip.online') + '"/>';
    if(value == IM_PRESENCE_AFTER_CALL_WORK) return '<img id="' + record.data['name'] + '_presence" src="' + afterCallImgSrc + '" alt="' + getLocalizationValue('application.javascript.contactList.image.tooltip.aftercall') + '" onmouseover="setACWTime(\'' + record.data['name'] + '\')"/>';
    if(value == IM_PRESENCE_IN_IM_CONVERSATION) return '<img src="' + inImImgSrc + '" alt="' + getLocalizationValue('application.javascript.contactList.image.tooltip.inim') + '" />';
    if(value == IM_PRESENCE_OFFLINE) return '<img src="' + offlineImgSrc + '" alt="' + getLocalizationValue('application.javascript.contactList.image.tooltip.offline') + '" />';
}

function setInCallTime(contactId) {
	setPresenceTime(contactId, getLocalizationValue('application.javascript.contactList.image.tooltip.incall'));
}

function setACWTime(contactId) {
	setPresenceTime(contactId, getLocalizationValue('application.javascript.contactList.image.tooltip.aftercall'));
}

// calc time of contact in current presence 
// and set this time in the tooltip of the presence image.
// (relevant only for in call and after call work)
function setPresenceTime(contactId, presenceMsg) {
	var msg = presenceMsg;
	var currTime = new Date();
	var startTime = contactPresenceTime[contactId];
	if (startTime != null) {
		var diff = currTime.getTime() - startTime.getTime();
		var milliseconds=Math.floor(diff % 1000);
			diff=diff/1000;
		var seconds=Math.floor(diff % 60);
			diff=diff/60;
		var minutes=Math.floor(diff % 60);
			diff=diff/60;
		var hours=Math.floor(diff % 24);
			diff=diff/24;
		msg = msg + " (" + hours + 'h ' + minutes + 'm ' + seconds + 's)'; 
	}
	var target_element = document.getElementById(contactId + "_presence");
	if(target_element != null){
		target_element.alt = msg;
	}
}

function setContactPresence(contactId) {
	if (contactPresenceTime[contactId] != null) {
		delete contactPresenceTime[contactId];
	}
	contactPresenceTime[contactId] = new Date();
	updateContactList();
}

//show 'delete' button for every user in favorites, based on 'id' column in JsonStore
function deleteFavoriteRender(value) {
    return '<a href="#deleteFav" onclick="onDeleteFavoriteClick(\'' + value + '\')"><img src="' + deleteImgSrc + '" alt="' + getLocalizationValue('application.javascript.contactList.image.tooltip.deleteAgent') + '" /></a>';
}

//show 'delete' button for every user in peers, based on 'id' column in JsonStore
function deletePeerRender(value) {
    return '<a href="#deletePeer" onclick="onDeletePeerClick(\'' + value + '\')"><img src="' + deleteImgSrc + '" alt="' + getLocalizationValue('application.javascript.contactList.image.tooltip.deleteAgent') + '" /></a>';
}

//invoked by clicking on 'delete' button for user in favorites
function onDeleteFavoriteClick(id) {
	if (portletDisabled) {
		return;
	}
    agentsStore.load( {params: { method: "removeFromFavorites", delId:id} } );
}

//invoked by clicking on 'delete' button for user in favorites
function onDeletePeerClick(id) {
	if (portletDisabled) {
		return;
	}
    peersStore.load( {params: { method: "removeFromPeers", delId:id} } );
}

//used to display nothing in 'id'('delete') column for supervisors
function emptyRender(value) {
    return "";
}

// we should consider changing this method - not reason to have 4 requests to the server every time.
function updateContactList() {
	supervisorsStore.load( {params: { method: "loadSupervisors"} } );
	expertsStore.load( {params: { method: "loadExperts"} } );
	peersStore.load( {params: { method: "loadPeers"} } );
    agentsStore.load( {params: { method: "loadFavorites"} } );
}

// called by the toolbar wrapper when the portlet is shown
// same functionality as for onPortletExpand
function onPortletShow(reloadContentOnNextOpen) {
	onPortletExpand();
	resizeContent();
}

// called by the toolbar wrapper when the portlet is expanded
function onPortletExpand(){
    //if the chat ended while the portlet is minimized,
   	//the editor is still active see WS-1042 
   	for (var i=0; i < tabsMap.length; i++) {
        var currentTab = findTab(tabsMap[i].title);
	   	var currentTabId = currentTab.id;
	   	if ((currentTabId != "ContactList")&&(currentTabId != "Add Contacts") ){
	   		if (!enabledTabsMap[currentTabId]) {
				currentTab.getComponent(currentTab.title + 'inputField').disable();
	   		}
	   		var historyPanel = currentTab.getComponent(currentTab.title + 'historyPanel').getComponent(0);
			historyPanel.getView().scrollToBottom();
	   	}
    }   	
   	tabs.syncSize();
}