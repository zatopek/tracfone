var MSG_TAB_URL = CONTEXT_PATH + '/SYSTEM/portlets/tickerTape/messageTab.html';
var MESSAGE_POPUP_WIDTH = 300;
var MESSAGE_POPUP_HEIGHT = 150;
var TICKER_TAPE_DATA;

function getContent(data){
	var smallMessage = getMaximumLinesFromContent(data,10);
	//put default description so that the link can be opened
	if(smallMessage.length == 0 && data.link.length > 0){
		smallMessage=$W().localeManager.getLocalizationValue("application.javascript.messagecenter.tickerTapeSet.defaultDescription");
	}
    var messagePageContent = '<table width="100%" height="100%">'+
                        '<tr><td>'+ smallMessage +'</td></tr></table>';
    

   return messagePageContent; 
}  
function getMaximumLinesFromContent(data, maximumNumOfLines){
	content = data.content;
	if(!content || content.length == 0){
		content = data.subject;
	}
	//first lowercase all the new lines
	content = content.replace(/<BR>/g,"<br>");
	//then split it
	var lines  = content.split("<br>");
	//if there
	if (lines.length <= maximumNumOfLines ){
		return content;
	}
	
	//return only 10 lines
	var returnVal = "";
	for (var i = 0; i < maximumNumOfLines; i++) {             
        returnVal += lines[i]+"<br>";                  
    }
    return returnVal;
	
	
	
}

function show(data, position, tickerTape){
	
    tickerTape.continueScrollAfterClick();
    $W().HideCurrentVisibleTab();
	var win = Ext.create('Ext.window.Window', {
        layout:'fit',
        modal: true,
        title: data.subject,
        width:MESSAGE_POPUP_WIDTH,
        height:MESSAGE_POPUP_HEIGHT,
        closeAction:'close',
        items: [{
        	html: getContent(data)
        }],
        listeners:{
        	close: function (_this, eOpts){
        		$W().ShowCurrentVisibleTab();
        	}
        },
        buttons: [{
            text: $W().localeManager.getLocalizationValue("application.javascript.messagecenter.tickerTapeSet.showInTab"),
            handler: function(){
            	openInNewTab(data);
                win.close();
            }
        }]
    });
	win.show();
	
}

function isRssData(data){
	return (data  && data.link != null);
}
function openInNewTab(data){
    
    var w = $W();

    w.ShowTabById('TickerTapeTab');

    TICKER_TAPE_DATA = data;
    //in case of rss we disply the LINK content and not only the preview that is displayed in the tickerTape popup
    if (isRssData(data)){
    	w.loadintoIframe('TickerTapeFrame', data.link);
    }
    //in case of message we disply the content of the message as seen in the tickerTape popup
    else{
	    w.loadintoIframe('TickerTapeFrame', MSG_TAB_URL);   
	    // mark message as read only if it is Message Center message
	    // no need to do it for the RSS message
	    Ext.getCmp('messageBoard').ajaxMarkMessageAsRead(data.id);
	}	
}