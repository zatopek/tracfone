<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%@ page language="java" contentType="text/html;charset=UTF-8"%>
<%@ page import="org.springframework.context.ApplicationContext"%>
<%@ page import="org.springframework.web.context.support.WebApplicationContextUtils"%>
<%@ page import="com.jacada.jad.messaging.rss.RssProvider"%>

<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    
    <style type="text/css">
        @import "tickertape.css";
    </style>
	<%@ include file = "/SYSTEM/resources/jspf/includes/extjsPortletIncludes.jspf"%>

    <script type="text/javascript" src="TickerTape.js"></script>

    <script type="text/javascript">

	var EMPTY_MESSAGE_ID = "emptyMessageId";
    var MESSAGING_JSON_URL = "${pageContext.request.contextPath}/messaging.json";
    //taking the user-gmt-offset that was initialized upon login (in the main index.jsp)
	var offset = $W().agentGMToffset;
    function messagesData() { 
        return jsonStore.data; 
    }

    var TICKER_TAPE_HEIGHT = 15;
    var RSS_DATA = [ 

<%             
    String contextPath = request.getContextPath();
    String projectId = contextPath.replaceAll("/", "");

    ApplicationContext ctx = WebApplicationContextUtils.getWebApplicationContext(request.getSession().getServletContext());
    RssProvider rssProvider = (RssProvider)ctx.getBean("rssProvider");

 %>  
   <%=rssProvider.constructRssDataFromAllFeeds(projectId)%>
   
    ];

    window.parent.Push.registerEventHandler( 'RSSNotificationMessageUpdated', onRSSNotificationMessageUpdated, true);    
    window.parent.Push.registerEventHandler( 'RSSNotificationMessageAdd', onRSSNotificationMessageAdd, true);
    window.parent.Push.registerEventHandler( 'RSSNotificationMessageRemove', onRSSNotificationMessageRemove, true);    
           
    function onRSSNotificationMessageAdd(jsonFeedEntry) {
        var rssItem = eval('(' + jsonFeedEntry + ')');            
        RSS_DATA[RSS_DATA.length] = rssItem;
    }
    
   

    function onRSSNotificationMessageRemove(jsonFeedMessage) {
        var rssItem = eval('(' + jsonFeedMessage + ')');
        for (var i = 0; i < RSS_DATA.length; i++) {
            if (RSS_DATA[i].subject == rssItem.subject) {
                RSS_DATA.splice(i, 1);
                i--;
            }
        }
    }  
    
    function onRSSNotificationMessageUpdated(jsonFeedMessage) {
        var rssItem = eval('(' + jsonFeedMessage + ')');
        for (var i = 0; i < RSS_DATA.length; i++) {
            if (RSS_DATA[i].subject == rssItem.subject) {
                RSS_DATA[i] = rssItem;
            }
        }
    }  

    Ext.onReady(function() {
   
            Ext.QuickTips.init();

            var jsonStore = new Ext.data.JsonStore( {
                root: 'messages',
                totalProperty: 'totalCount',
                fields: [
                    {name:'id'}, 
                    {name:'subject', type:'string'}, 
                    {name:'content', type:'string'}, 
                    {name:'priorityLevel', type:'int'},
                    {name:'colorOnTickerTape', type:'string'},
                    {name:'flashOnTickerTape', type:'boolean'},
                    {name:'pauseOnTickerTape', type:'boolean'},
                ],
                listeners: {
                    loadexception: function(proxy, store, response, e) {
                        alert("Cannot load data: " + e);
                    }
                },
                url: MESSAGING_JSON_URL
            });
			
			
            jsonStore.load( { params: { method: "loadUserMessages", destination: "tape", userGMTOffset: offset } } );

            Ext.apply(Ext.QuickTips.getQuickTip(), {
                maxWidth: 150,
                minWidth: 100,
                showDelay: 1,
                trackMouse: true
            });

            function getMessagesArray(tt) {
                var array = new Array();
                jsonStore.each(function(item) { array[array.length] = item.data; } );
                calculateTickerTapeHeight("div2", array.length);
                return array;
            }

            function getRssArray(tt){
                calculateTickerTapeHeight("div1", RSS_DATA.length);
                return RSS_DATA;
            }
            
            function calculateTickerTapeHeight(divId, length){
            	var visibleHeight = TICKER_TAPE_HEIGHT+"px";
            	var hiddenHeight = "0px";
            	 var iframe = $D().getElementById('TickerTapeIframeId');
                 var innerDoc = (iframe.contentDocument) ? iframe.contentDocument : iframe.contentWindow.document;
                 var div = innerDoc.getElementById(divId);
                 var tpContainer;
                 if($W().tickerTapePosition == "bottom"){
                	 tpContainer = $W().workspaceUI.items.getByKey('south-panel');
                 }else{
                	 tpContainer = $W().workspaceUI.items.getByKey('north-panel');
                 }
                 var tpContainerHeight = tpContainer.getHeight();
                 if(length == 0){
                	 //no messages to show, hide the tickertape if visible
                 	if(div.style.height == visibleHeight){
                 		div.style.height = "0px";
                 		tpContainer.setHeight(tpContainerHeight-TICKER_TAPE_HEIGHT);
                 	}
                 }else{
                	 //we have messages to show, increase the tickertape height if hidden
                 	if(div.style.height == hiddenHeight){
                 		div.style.height = TICKER_TAPE_HEIGHT+"px";
                 		tpContainer.setHeight(tpContainerHeight+TICKER_TAPE_HEIGHT);
                 	}
                 }
            }


            function onItemClick(data, element, tickerTape) {
                var position = getPosition(element);
                tickerTape.stopScrollAfterClick();
                parent.tickerTapeMessageWindow(data, position, tickerTape);
                // if message was clicked set new value for message id in centerMessageIdArray
                // so next time message wouldn't stop at center of screen.
                centerMessageIdArray[data.id] = false;
            }

            var ticker1 = new TickerTape( getRssArray, 'horizontalTickerTape', 'div1', 50, onItemClick);
            var ticker2 = new TickerTape( getMessagesArray, 'horizontalTickerTape', 'div2', 50, onItemClick);

            $W().Push.registerEventHandler( 'UPDATE_NOTIFICATION', function(param) {
            	//counter for identifying whether all messages were deleted - 
            	//in such case also delete all the empty messages that were built for padding
            	var noneEmptyMsg = 0;
                // after message deleting get all deleted messages id separated by ':' as string
                // parse string and get array with deleted messages id
                var deletedMessagesId = param.split(":");
                if (deletedMessagesId.length > 0){
                    // remove item from ticker tape if  item attribute 'messageId' equals deleted message id

                    for(var i = ticker2.container.childNodes.length - 1; i >= 0 ; i--) {
                        var node = ticker2.container.childNodes[i];
                        if (node == null)
                            continue;
                        var id = node.getAttribute("messageId");

        
                        if (id == null)
                            continue;
                         
                          if (id != EMPTY_MESSAGE_ID){
                          	noneEmptyMsg++;
                          }
                        // remove tags for deleted messages from ticker tape element
                        for (var index = 0; index < deletedMessagesId.length; index++){
                            if (deletedMessagesId[index] == id){
                            	noneEmptyMsg--;
                                ticker2.container.removeChild(node);
                                if (centerMessageIdArray[deletedMessagesId[index]]){
                                    centerMessageIdArray[deletedMessagesId[index]] = false;
                                }
                            }
                        }
                    }//end of loop
                    
                    // if ticker tape was stopped by message with active 'pause at center' flag and this message was deleted
                    // resume a scroll of ticker tape
                    if(ticker2.isScrollPaused){
                        var result = false;
                        for (var index = 0; index < centerMessageIdArray.length; index++){
                            if(centerMessageIdArray[index]){
                                result = true;
                            }
                            
                        }
                        ticker2.isScrollPaused = false;

                    }
					if (noneEmptyMsg == 0){
						removeEmptyMessage(ticker2);
					}
                }
                jsonStore.load( {params: { method: "loadUserMessages", destination: "tape", userGMTOffset: offset } } );
            });
    });

	function removeEmptyMessage(ticker2){
		$W().LogManager.getLogger("TICKERTAPE").debug("Ticker tape is empty therefore removing all empty messages as well." );
		for(var i = ticker2.container.childNodes.length - 1; i >= 0 ; i--) {
			var node = ticker2.container.childNodes[i];
                    	if (node == null)
                        	continue;
                    	var id = node.getAttribute("messageId");
                    	if (id == EMPTY_MESSAGE_ID){
                    		ticker2.container.removeChild(node);
                    	}
		}
	}
	
    function getPosition(element){
        var parentElement = element;
        var top = parentElement.offsetTop;
        var left = parentElement.offsetLeft;
        while (parentElement.offsetParent != null){
            parentElement = parentElement.offsetParent;
            top += parentElement.offsetTop;
            left += parentElement.offsetLeft;
        } 
        var position = new Object();
        position.top = top;
        position.left = left;
        return position;
    }

        
    function showTickerTapeMessage(data){
        var div = window.parent.document.getElementById("messageWindowPopupGround");
        var scrollWidth = window.parent.document.body.scrollWidth;
        var scrollHeight = window.parent.document.body.scrollHeight;
        var modalBox = window.parent.document.getElementById("modalWindow");
        div.style.filter = "alpha(opacity=80)";

        div.style.width = scrollWidth;
        div.style.height = scrollHeight;
        div.style.opacity = 0.8;
        div.style.display = "block";

        modalBox.style.display = "block";


        posleft = Math.round(scrollWidth / 2) - 150;
        postop = window.parent.document.body.scrollHeight - 600;


        modalBox.style.left = posleft;
        modalBox.style.top = window.parent.document.body.scrollTop + 300;
    }

            
    function blinkTickerTape() {
        var elements = getElementsByClassName("tickerTapeBlink");
        for (var i = 0; i < elements.length; i++) {
            var s = elements[i];
            var oldColor = s.getAttribute("tickerTapeColor");
            s.style.color = (s.style.color == 'black') ? oldColor : 'black';
            //s.style.visibility = (s.style.visibility == 'visible') ? 'hidden' : 'visible';
        }
    }

    function getElementsByClassName(classname)  {
        var node = document.getElementsByTagName("body")[0];
        var a = [];
        var re = new RegExp('\\b' + classname + '\\b');
        var els = node.getElementsByTagName("*");
        for (var i=0, j=els.length; i < j; i++)
            if (re.test(els[i].className))
                a.push(els[i]);
        return a;
    }

    function onloadBody() {
        setInterval('blinkTickerTape()', 400);
    }
    
    </script>
</head>
<body style="padding:0; margin:0; border: 0; background-color:black;" onload="onloadBody()" onkeydown="onKeyDownHandler(event);">
    <div id="div1" style="height: 15px"></div>
    <div id="div2" style="height: 15px"></div>
</body>
</html>