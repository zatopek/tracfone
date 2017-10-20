/*
This file contains the timeline API to be included in each page containing a timeline element.
This API may use the timelineManager object for timeline management. (and not the other way around)
*/
var resizeTimerID = null;
var DEFAULT_JSON_EMPTY_EVENTS = {'events' : []}
var initializedTlInDoc = new Array();
function startTimelineTag(id, cssClass) {
	addTimeline(id, cssClass);	
}
	
function endTimelineTag(id) {
		drawTimeline(id);
		finishInit(id);
}
	
function startTimelineBandTag(params) {
	addBandToTimelineAccordingToParams(params);
}
	
function endTimelineBandTag(tlId, bandId, interval_unit ) {
}
	
	
function addBandToTimelineAccordingToParams(params) {
	/*
    Handling jacada specific logic before creating a band
    */
    this._handleJacadaAttributesBeforeCreatingBand(params);
    
	var eventSource = new Timeline.DefaultEventSource();
	//create a simili band by using the attributes provided
	var band = Timeline.createBandInfo({
         eventSource:    eventSource,
         intervalUnit:   params.intervalUnit,
         intervalPixels: params.intervalPixels,
         width:          params.width, //70% of height
         date:           params.dateInFocus,
         theme: 		 params.theme,//this theme was created during the jacada logic method
         zoomIndex:		 params.zoomIndex,
         zoomSteps: 	 params.zoomSteps
     });
     
     /*
     Handling jacada specific logic
     */
     _handleJacadaAttributesAfterCreatingBand(params, band);
}

	
	
	
	
	
	
	
function _handleJacadaAttributesBeforeCreatingBand(params){
	  var theme1 = Timeline.ClassicTheme.create();
          
          
	//handle auto width
	if (!params.width){
		theme1.autoWidth = true; // Set the Timeline's "width" automatically.
                                     // Set autoWidth on the Timeline's first band's theme,
                                     // will affect all bands.                        	
	}
	
	//handle startDate and endDate
	if (params.startDate){
		theme1.timeline_start = new Date(params.startDate)
		
	}
	if (params.endDate){
		theme1.timeline_stop = new Date(params.endDate);
	}
	
	
	//add the theme to be part of the params
	params.theme = theme1;
	
    //handle zoomInOnscroll
    if (params.zoomInOnScroll){
    	params.zoomIndex = 10;
    	
        params.zoomSteps =      new Array(
              {pixelsPerInterval: 280,  unit: Timeline.DateTime.HOUR},
              {pixelsPerInterval: 140,  unit: Timeline.DateTime.HOUR},
              {pixelsPerInterval:  70,  unit: Timeline.DateTime.HOUR},
              {pixelsPerInterval:  35,  unit: Timeline.DateTime.HOUR},
              {pixelsPerInterval: 400,  unit: Timeline.DateTime.DAY},
              {pixelsPerInterval: 200,  unit: Timeline.DateTime.DAY},
              {pixelsPerInterval: 100,  unit: Timeline.DateTime.DAY},
              {pixelsPerInterval:  50,  unit: Timeline.DateTime.DAY},
              {pixelsPerInterval: 400,  unit: Timeline.DateTime.MONTH},
              {pixelsPerInterval: 200,  unit: Timeline.DateTime.MONTH},
              {pixelsPerInterval: 100,  unit: Timeline.DateTime.MONTH} // DEFAULT zoomIndex
            );
    	
    }
    
    
    
	
	
	
}

function addTimeline(id, cssClass) {
	  var divTag = document.createElement("div");
	  divTag.id = id;
	  if (cssClass && cssClass.length > 0){
	  	divTag.className = cssClass;
	  	//marking all timelines with a special attribute
	  	divTag.setAttribute("timelineAttr",true);
	  }	
	  document.body.appendChild(divTag);
	  
	  //initialize bandinfo array for this timeline
	  divTag.bandInfos = new Array();
}



function drawTimeline(id) {
		var tlDiv = document.getElementById(id);
		
		var tl = Timeline.create(tlDiv, tlDiv.bandInfos);
		
		//have a reference from the div to the tl element
		tlDiv.setAttribute("timelineElementAttr",tl);
	 	
	 	//save in our map
	 	$W().timelineManager.addTimelineElem(id, tl, tlDiv, this);
	 	
	 	//load sources into the bands and filters
	 	var bands = tlDiv.bandInfos;
		for(var i=0; i < bands.length; i++){
			bandEventSource = bands[i].eventSource;
			
			
			bandEventSource.loadJSON(bands[i].startupJsonEvents, '.'/*url*/);
			
			
			//setup filters after the painting was done
	    	tl.getBand(i).getEventPainter().setFilterMatcher(bands[i].filterHandler);	
		
			 
		}
		
		
		
		
		//draw the timeline
		 tl.layout();
		
	
}

/*
	This method goes over the timelines in the current document and attaches handler of a resize event.
	This API can be used independently when finishing adding a timeline via js API.
	This API is called automatically when using the dedicated jacada timeline tag.
	*/
	
function finishInit(id) {
		
		initializedTlInDoc[initializedTlInDoc.length] = id;
		if( window.attachEvent ) {
				document.body.onresize = onResize;
		}
		
		
}
/*
*This function is the onResize handler. It is responsible for going over all timelines in the document and activating the handleResize per timeline.
*/
function onResize(){
	for (var i = 0; i < initializedTlInDoc.length; i++) {
		handleTimeLineOnResizeWindow(initializedTlInDoc[i]);
	}
}


/*
	Private functions
	*/
function _handleJacadaAttributesAfterCreatingBand(params, band){
	//adding the bands to the timeline div 
	tlDiv = document.getElementById(params.tlId);
	var numOfBands = tlDiv.bandInfos.length;
	tlDiv.bandInfos[numOfBands] = band;
	
	//adding to the band the event source file/json
	band.filterHandler = params.filterHandler;
	
	if (params.startupJsonEvents){
		//adding to the band the event source file/json
		band.startupJsonEvents = params.startupJsonEvents;
	}
	else{
		band.startupJsonEvents = DEFAULT_JSON_EMPTY_EVENTS;
	}

	$W().timelineManager.updateLinkToOpenInSeperateTab(band.startupJsonEvents.events);
			
	
	//unique id of jacada
	band.jId = params.bId;
	
	
	
	//handle sync band
	if (params.linkToOtherBand){
		var otherBandIndex = _findBandIndex(tlDiv, params.linkToOtherBand);
		 band.syncWith = otherBandIndex;
	}
	
	//handle date format
	if (params.dateFormat){
		band.startupJsonEvents.dateTimeFormat = params.dateFormat;
	}
	
	//Storing initial dateInFocus because it 
	//ruined during layout after resize
	band.dateInFocus = params.dateInFocus;
	band.isDateInFocusSet = false;
	
}



function _findBandIndex(tlDiv, blId){
		
		//go over bands and find relevant band
	 	var bands = tlDiv.bandInfos;
		for(var i=0; i < bands.length; i++){
			if (bands[i].jId == blId){
				return i;
			}
		}
		return null;	
}


function handleTimeLineOnResizeWindow(id) {
	var theTlDiv = document.getElementById(id);
	//should not happen
	if (theTlDiv == null){
		return;
	}
	
//	 if (resizeTimerID == null) {
	 
//         resizeTimerID = window.setTimeout(function() {
            //go over timelines and call their layout() function
				var tl = $W().timelineManager.getTimelineElem(id);
          	//Handling resize only for timeline in resized document
			if(tl != null && (typeof tl != 'undefined')){
		    	tl.layout();
		    	for(i = 0, count = tl.getBandCount(); i < count; i++){
		    		var band = tl.getBand(i);
		    		//If it's the first resize we need to set initial date.
		    		//It's required because timeline can be in Tab.
						if (!theTlDiv.bandInfos[i].isDateInFocusSet) {
							band.setCenterVisibleDate(new Date(theTlDiv.bandInfos[i].dateInFocus));
			    		band.isDateInFocusSet = true;
			    	}else{
			    		break;
			    	}
		    	}
			}
         	resizeTimerID = null;
//         }, 500);
         
//     }

}
