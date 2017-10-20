/* This class is the manager of the timeline feature. It holds references to all the created timelines.
* It also contains API for runtime, for example: addEvent/loadEvents
*/


var PROCEED_WITHOUT_DEFAULT_CLICK_HANDLING = "PROCEED_WITHOUT_DEFAULT_CLICK_HANDLING";	
var origClickHadler;
//saving original click handler
origClickHadler = Timeline.OriginalEventPainter.prototype._showBubble;
		//overriding the on click
		Timeline.OriginalEventPainter.prototype._showBubble = function(x, y, evt) {
			
			var userRes = '';
			//alert("will try to activate my handler");
			if(typeof userClickHandler != "undefined"){
				userRes = userClickHandler(x,y,evt);
			}
     		
     		if (userRes != PROCEED_WITHOUT_DEFAULT_CLICK_HANDLING){
    			origClickHadler.call(this,x,y,evt);
    		}
    	};
/**
* @class
* This class is the manager of the timeline feature. It holds references to all the created timelines.
* It also contains API for runtime, for example: addEvent/loadEvents
*/
var TimelineManager = Class.create(
/** 
@lends TimelineManager.prototype 
*/ 
{
	initialize: function() {
		
		filtersPerTimeline={};
		timelineIdToElem={};
		timelineIdToDiv={};
		
		
    	this._registerToPush();
    	

		
	},
	
	
	
	getTimelineClickHandler: function(){
		return origClickHadler;
	},
	
	getTimelineElem: function(id) {
		return timelineIdToElem[id];
	},
	
	getAllTimelineElements: function(id) {
		return timelineIdToElem;
	},
	
	getTimelineDiv: function(id) {
		return timelineIdToDiv[id];
	},
	
	addTimelineElem: function(id,tl,tlDiv,doc) {
		timelineIdToElem[id] = tl;
		timelineIdToDiv[id] = tlDiv;
	},

	_registerToPush: function(){
		 $W().Push.registerEventHandler( 'addTimelineEvent', this.pushAddEvent.bind(this));
		 $W().Push.registerEventHandler( 'refreshTimeline', this.refreshTimeline.bind(this));  
		 $W().Push.registerEventHandler( 'loadTimelineEvents', this.pushLoadEvents.bind(this));  
		 $W().Push.registerEventHandler( 'addManyTimelineEvents', this.pushAddManyEvents.bind(this));  
		 $W().Push.registerEventHandler( 'removeAllTimelineEvents', this.pushRemoveAllEvents.bind(this));  
	},
	
	
	_findBand: function(tlId, blId){
		//adding the bands to the timeline div 
		var tlDiv = $W().timelineManager.getTimelineDiv(tlId);
		//go over bands and find relevant band
	 	var bands = tlDiv.bandInfos;
		for(var i=0; i < bands.length; i++){
			if (bands[i].jId == blId){
				return bands[i];
			}
		}
		this._debug("The given band id: "+ blId+" was not found in the given timeline id: "+tlId);
		return null;	
	},
	
	
	_debug: function(msg){             
        $W().LogManager.getLogger("timelineJS").debug(this._getLogHeader() + msg );
  	},
  
  	_error: function(msg){
        $W().LogManager.getLogger("timelineJS").error(this._getLogHeader() + msg );
  	},
  	
	_addEventInternal: function(tlId, blId, myEvent, shouldFireUpdate){
		var band = this._findBand(tlId, blId);
		if (band == null){
			return;
		}
		var eventSource = band.eventSource;
		
		//override link to open in the dedicated tag
		_overrideLinkToOpenInTab(myEvent);
		//convert to simili event
		var url = '.';
	    var dateTimeFormat = null;
	    var base = eventSource._getBaseURL(url);    
	  	var parseDateTimeFunction = eventSource._events.getUnit().getParser(dateTimeFormat);
	 	var evt = new Timeline.DefaultEventSource.Event({
	                          id: ("id" in myEvent) ? myEvent.id : undefined,
	                       start: parseDateTimeFunction(myEvent.start),
	                         end: parseDateTimeFunction(myEvent.end),
	                 latestStart: parseDateTimeFunction(myEvent.latestStart),
	                 earliestEnd: parseDateTimeFunction(myEvent.earliestEnd),
	                     instant: myEvent.isDuration || false,
	                        text: myEvent.title,
	                 description: myEvent.description,
	                       image: eventSource._resolveRelativeURL(myEvent.image, base),
	                        link: eventSource._resolveRelativeURL(myEvent.link, base),
	                        icon: eventSource._resolveRelativeURL(myEvent.icon, base),
	                       color: myEvent.color,				
	                   textColor: myEvent.textColor,
	                   hoverText: myEvent.hoverText,
					   classname: myEvent.classname,
					   tapeImage: myEvent.tapeImage,
					  tapeRepeat: myEvent.tapeRepeat,
					     caption: myEvent.caption,
	                     eventID: myEvent.eventID
	            });
	          
		Timeline.DefaultEventSource.prototype.add.call(band.eventSource,evt);
		
		if (shouldFireUpdate && shouldFireUpdate == true){
			//After adding all of your events at a given time, call
			eventSource._fire("onAddMany", []); 
		}
			
	},
	
	
	
	/*
	Runtime functions
	*/
	
	/**
	 * This method adds a timeline event to a specific timeline band according to the give Ids.
	 * @param tlId - id of the relevant timeline.
	 * @param blId - id of the relevant timeline band.
	 * @param evt - a timeline event to be added. 
	 
	The events should have the following array format:
	var event = 
        {'start': 'May 28 2006 09:00:00 GMT',
        'end': 'Jun 15 2006 09:00:00 GMT',
         'isDuration' : true,
        'title': 'event1',
        'description': 'description1',
        'image': 'myImage.gif'
       //more event attributes.......
        };    
	*/
	addEvent: function(tlId, blId, myEvent){
		this._addEventInternal(tlId, blId, myEvent, true);
	},
	
	
	/**
	 * This method refreshes a specific timeline according to the give Id.
	 * @param tlId - id of the relevant timeline.
	 */
	refreshTimeline: function(tlId){
		
		if ($W().timelineManager.getTimelineElem(tlId)){
			$W().timelineManager.getTimelineElem(tlId).paint();
		}
	},
	
	/**
	 * This method loads timeline events to a specific timeline band according to the give Ids, any events existing prior to this call will be removed.
	 * Note: This method should not be used to send many events since it uses push.
	 * @param tlId - id of the relevant timeline.
	 * @param blId - id of the relevant timeline band.
	 * @param events - a list timeline event to be loaded. 
	The events should have the following array format:
	var events = [
        {'start': 'May 28 2006 09:00:00 GMT',
        'end': 'Jun 15 2006 09:00:00 GMT',
         'isDuration' : true,
        'title': 'event1',
        'description': 'description1',
        'image': 'myImage.gif'
       //more event attributes.......
        },
        
        
         {'start': 'May 28 2006 09:00:00 GMT',
        'end': 'Jun 15 2006 09:00:00 GMT',
         'isDuration' : true,
        'title': 'event2',
        'description': 'description2',
        'image': 'myImage.gif'
       //more event attributes.......
        }
	] //end of events
	*/
	loadEvents: function(tlId, blId, events){
		var band = this._findBand(tlId, blId);
		if (band == null){
			return;
		}
		
		band.eventSource.clear();
		
		this.addManyEvents(tlId, blId, events);
	},
	
	/**
	 * This method adds timeline events to a specific timeline band according to the give Ids.
	 * Note: This method should not be used to send many events since it uses push.
	 * @param tlId - id of the relevant timeline.
	 * @param blId - id of the relevant timeline band.
	 * @param events - a list timeline event to be added. 
	The events should have the following array format:
	var events = [
        {'start': 'May 28 2006 09:00:00 GMT',
        'end': 'Jun 15 2006 09:00:00 GMT',
         'isDuration' : true,
        'title': 'event1',
        'description': 'description1',
        'image': 'myImage.gif'
       //more event attributes.......
        },
        
        
         {'start': 'May 28 2006 09:00:00 GMT',
        'end': 'Jun 15 2006 09:00:00 GMT',
         'isDuration' : true,
        'title': 'event2',
        'description': 'description2',
        'image': 'myImage.gif'
       //more event attributes.......
        }
	] //end of events
	*/
	addManyEvents: function(tlId, blId, events){
		var shouldFireUpdate = false;
		for(var i=0; i< events.size();i++){
			var evt = events[i];
			//for the last event we update 
			if (i == events.size()-1){
				shouldFireUpdate = true;
			}
			
			this._addEventInternal(tlId, blId, evt, shouldFireUpdate);
		}
			
		
	},
	
	
	/**
	 * This method removes all timeline events of a specific timeline band according to the give Ids.
	 * @param tlId - id of the relevant timeline.
	 * @param blId - id of the relevant timeline band.
	 */
	removeAllEvents: function(tlId, blId){
		var band = this._findBand(tlId, blId);
		var eventSource = band.eventSource;
		eventSource.clear();
	},
	
	updateLinkToOpenInSeperateTab: function(events){
		for(var i=0; i< events.size();i++){
			var evt = events[i];
			_overrideLinkToOpenInTab(evt);
		}

	},
	
	/*
	Push handlers methods
	*/
	pushAddEvent: function(timelinePushData){
		var inputEvents = _getPushedEvents(timelinePushData);
		this.addEvent(timelinePushData.tlId, timelinePushData.blId, inputEvents[0])
	},
	
	pushAddManyEvents: function(timelinePushData){
		var inputEvents = _getPushedEvents(timelinePushData);
		this.addManyEvents(timelinePushData.tlId, timelinePushData.blId, inputEvents);
	},
	
	pushLoadEvents: function(timelinePushData){
		var inputEvents = _getPushedEvents(timelinePushData);
		this.loadEvents(timelinePushData.tlId, timelinePushData.blId, inputEvents);
	},
	
	pushRemoveAllEvents: function(timelinePushData){
		this.removeAllEvents(timelinePushData.tlId,timelinePushData.blId); 
	},
	
	_getLogHeader: function() { 
	    return " timelineManager.js  ";
	}
	
});
//static methods - doesnt concern the Simile timeline itself

function _openLinkInNewTab(link){
    $W().ShowTabById('TimelineTab');
    $W().loadintoIframe('TimelineTabFrame', link);   
}

function _getPushedEvents(timelinePushData){
    return eval('(' +timelinePushData.eventsJsonString+')');
}

function _overrideLinkToOpenInTab(evt){
	var origLink = evt.link;
	///checking the link exists and that we didnt already add the special function
    if(origLink != null && origLink.indexOf("_openLinkInNewTab") <0 ){  
    	evt.link = "javascript:_openLinkInNewTab('" + origLink + "')";
    }
}

