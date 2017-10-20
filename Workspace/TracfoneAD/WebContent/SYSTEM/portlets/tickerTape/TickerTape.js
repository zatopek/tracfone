// Based on TickerTape component by Colin Ramsay:

// *******************************************************************
// Copyright (c) 2007 Colin Ramsay
//
// Permission is hereby granted, free of charge, to any person
// obtaining a copy of this software and associated documentation
// files (the "Software"), to deal in the Software without
// restriction, including without limitation the rights to use,
// copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the
// Software is furnished to do so, subject to the following
// conditions:
//
// The above copyright notice and this permission notice shall be
// included in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
// OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
// HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
// WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
// FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
// OTHER DEALINGS IN THE SOFTWARE.
// 
// Cross browser mouseenter and mouseleave courtest of stchur:
// http://ecmascript.stchur.com/2007/03/15/mouseenter-and-mouseleave-events-for-firefox-and-other-non-ie-browsers/
//
// TickerTape v1.1 - http://colinramsay.co.uk/tickertape/
// *******************************************************************
/* 
UPDATE_TAPE_THRESHOLD_NUM_OF_ITEMS is The number of items that are part of the ticker tape but NOT appearing on the ticker tape currently (are about to appear soon) 
after we have less then this number we would like to update the ticker tape so that it will be ready to show these extra items when they come into sight.
Currently we set this number to 2 so that we update as soon as there are 2 items that are about to apear, this number can be increased in the future if we identify overhead with these frequent updates
*/
var UPDATE_TAPE_THRESHOLD_NUM_OF_ITEMS = 2; 
var MAX_LENGTH = 40; // maximal length of ticker tape item

// hash with key - message id and value - need to stop message at center screen
var centerMessageIdArray = new Array();

function TickerTape(dataProviderCallback, cssClassName, placeHolderId, scrollInterval, onItemClickCallback) {

    // Request data from this callback.
    this.dataProviderCallback = dataProviderCallback;

    // The classname which will be assigned to the tickertape container
    // Note: this is assigned in addition to 'basicTickerTape'.
    this.cssClassName = cssClassName;

    // How many milliseconds to wait between scrolling an item.
    this.scrollInterval = scrollInterval;

    // ID of the placeholder element for the Ticker Tape
    this.placeHolderId = placeHolderId;

    // The total number of pixels which have been scrolled since the
    // ticker started. Used to keep track of where to scroll to next.
    this.totalScroll = 0;

    // Used to track the window.setInterval id for the scroll
    // so that we only have one scroll going at once.
    this.scrollIntervalId = null;

    // Tracks the item within the container which was just scrolled.
    this.currentChild = 0;

    // Has the scroll been paused by user interaction?
    this.isScrollPaused = false;

    // If a scroll is paused, we can use this to resume
    // Otherwise it simply tracks how much we need to scroll for 
    // the currently scrolling element.
    this.amountToScroll = 0;

    // DIV including all other elements
    this.tickerTapeWrapper = null;

    // Callback that will be invoked on user's click on an item
    this.onItemClickCallback = onItemClickCallback; 

    // stop ticker tape after click on message
    this.pauseAfterClick = false;

    // Start it up!
    this.init();
};


String.prototype.truncate = function(maxlength){
    if(this.length > maxlength)
    {
        var lastSpacePosition = this.indexOf(' ');
        if (lastSpacePosition > maxlength || lastSpacePosition == -1)
        {
            return (this.substring(0, maxlength) + '...');
        }
        else
        {
            var previousPosition = lastSpacePosition;
            while (lastSpacePosition < maxlength && lastSpacePosition != -1)
            {
                previousPosition = lastSpacePosition;
                lastSpacePosition = this.indexOf(' ', lastSpacePosition + 1);
                //alert(previousPosition);
            }
            return this.substring(0, previousPosition) + ' ...';
        }
    }
    else {
        return this;
    }
}



// Creates a <div> element at the point where the TickerTape script
// was included. The <div> has a class of tickerTape and a random id.
TickerTape.prototype.createDom = function() {

    // Generate a random number and use it to build for the id of the <ul>
    var randomId = "tickerTape" + Math.floor(Math.random()*999);

    var placeHolder = document.getElementById(this.placeHolderId);

    // Write out a <div> element to the calling document
    placeHolder.innerHTML = '<div class="'+ this.cssClassName +' basicTickerTape" id="' + randomId +'"><ul></ul></div>';

    this.tickerTapeWrapper = document.getElementById(randomId);

    xb.addEvent(this.tickerTapeWrapper, 'mouseenter', this.pauseScroll.simpleBind(this));

    xb.addEvent(this.tickerTapeWrapper, 'mouseleave', this.resumeScroll.simpleBind(this));

    // Assign the new <div> element to a property of the tickertape class for easy access
    this.container = this.tickerTapeWrapper.getElementsByTagName('ul')[0];
}


TickerTape.prototype.update = function() {

   // Probably should swap this call to eval for something safer?   
   var data = this.dataProviderCallback(this);
    
    //fo ws-505 - vars for calculating how much space the messages take, 
    //if we dont have enough messages to fill the tape we should have empty messages to fill up instead of adding the same message over and over again
    var currentExpectedMessagesWidth = this.calculateDataSpace();
	   
    //for bug 505 we need the container width to check if we have enough space for all messages
    var containerWidth = this.getElementWidth(this.tickerTapeWrapper);
 

    // Remember the number returned in this request so we can use it elsewhere
    var numberReturned = data.length;

    // "Save" the current context so it can be used in the setInterval callback
    var context = this;
    
    //messagesDebugMessage is for debugging. uncomment the print line for printing debug messages
    var messagesDebugMessage ="";
    

    // Now loop through all the returned items and build HTML from them
    for(var i in data) {

        var priorityLevel = data[i].priorityLevel; // expecting number in 1..5
        var probability = priorityLevel*20; // probability in percents
        
         //bug ws505 :ignore priority&propability if needed by assigning it to 100 when there is enough space for all messages
        if (priorityLevel && currentExpectedMessagesWidth < containerWidth){
        	probability = 100;
        }
       

        if (Math.random() * 100 < probability) {
       

            // Produces HTML like this:
            var listItem = document.createElement('li');
            var title = document.createElement('p');
    
            var item = data[i];
            
            title.innerHTML = item.subject.truncate(MAX_LENGTH);

            // add to every ticker tape element attribute "messageId" with message id
            // if message is deleted every tag with such attribute and the same id will remove from ticker tape
            listItem.setAttribute("messageId", item.id);

            // add style class to ticker tape item with active "Flash Message" flag
            if (item.flashOnTickerTape){
                title.className = "tickerTapeBlink";
            }

            // add attribute "centerMessageId" to tickerTape item with message id
            // and add message id to centerMessageIdArray with default value 'true' 
            // if item position at center and it has such attribute 
            // and centerMessageIdArray contains 'true' value for this item id ticker tape stop scrolling
            if (item.pauseOnTickerTape){
                listItem.setAttribute("centerMessageId", item.id);
                if (centerMessageIdArray[item.id] == null){
                    centerMessageIdArray[item.id] = true;
                }
            }
            
            //If the item has a color defined, use it
            if(item.colorOnTickerTape){
            	var color = item.colorOnTickerTape;
            	if(color.indexOf('#') < 0){
            		color = '#'+color;
            	}
                title.style.color = color;
            }else{
                //use default white color if item color is not defined
                title.style.color="#FFFFFF";
            }
            title.setAttribute("tickerTapeColor", title.style.color);

            // in Javascript, scope of a local variable is all function body
            // so we need something more local
            function generateCallback(data, element) {
                return function() { context.onItemClickCallback(data, element, context); };
            }
            title.onclick = generateCallback(item, title);   
            listItem.appendChild(title);
            // Add the built item to the document
            this.container.appendChild(listItem);
            messagesDebugMessage += title.innerHTML+" ";
        }
      }
     
     //bug ws-505 :append empty messages at the end when there is enough space
      if (currentExpectedMessagesWidth < containerWidth && numberReturned > 0){
      var emtyMessageCounter = 0;
      messagesDebugMessage += " number of data is:"+numberReturned+" therefore will fill up with empty messages"

      	while (currentExpectedMessagesWidth < containerWidth){
      		 // Produces HTML like this:
          var emptyListItem = document.createElement('li');
          var emptyTitle = document.createElement('p');         
 		//mark the empty messages
          emptyListItem.setAttribute("messageId", EMPTY_MESSAGE_ID);
          emptyListItem.appendChild(emptyTitle);
          // Add the built item to the document
          this.container.appendChild(emptyListItem);
          
          //for bug ws-505:accumulate the spacethis item uses
          currentExpectedMessagesWidth += this.getElementWidth(emptyListItem);
          emtyMessageCounter++;
          
      	}
      	
      }
      if (numberReturned>0)
      	$W().LogManager.getLogger("CTIJS").debug(messagesDebugMessage+" num of added empty messages is:"+emtyMessageCounter);

    

    return numberReturned;
}


// Pauses a scroll if it is currently taking place.
TickerTape.prototype.pauseScroll = function() {

    if(this.scrollIntervalId) {
        window.clearInterval(this.scrollIntervalId);
        this.scrollIntervalId = null;
        this.isScrollPaused = true;
        this.currentChild--;
    }
}


// 
TickerTape.prototype.resumeScroll = function() {

    this.isScrollPaused = false;
}

// Stop a scroll if user click on ticker tape item
TickerTape.prototype.stopScrollAfterClick = function(){
    this.pauseAfterClick = true;
}

// Continue a scroll after message modal window close
TickerTape.prototype.continueScrollAfterClick = function(){
    this.pauseAfterClick = false;
}


// Scrolls the innerContainer by an amount determined by the current element height.
TickerTape.prototype.scroll = function() {

    // Do not scroll if paused, or if another scroll is taking place
    if(!this.isScrollPaused && !this.scrollIntervalId && !this.pauseAfterClick) {

        // Find the element we are about to scroll and compute its top and bottom margins
        var element = this.container.childNodes[this.currentChild];

        if (element == null) {
            this.update();
            return;
        }

        // Amount to scroll will be zero unless we are resuming after a pause.
        // If resuming, we do not want to recalculate the amount to scroll, instead we
        // need to start from where we left off before the pause
        if(this.amountToScroll == 0) {
            this.amountToScroll = this.getElementWidth(element);
        }

        // "Save" the current context so it can be used in the setInterval callback
        var context = this;

        // Begin the scroll
        this.scrollIntervalId = window.setInterval(function() {

            context.totalScroll++;
            context.amountToScroll--;

            context.container.style.left = (-context.totalScroll) + 'px';

            if(context.amountToScroll == 0) {
                window.clearInterval(context.scrollIntervalId);
                context.scrollIntervalId = null;
            }
        }, 20);

        // Delete unnecessary items - to avoid a memory leak
        if (this.currentChild > 0) {
            var elementToRemove = this.container.childNodes[0];
            this.totalScroll -= this.getElementWidth(elementToRemove);
            this.container.style.left = (-this.totalScroll) + 'px';
            this.container.removeChild(elementToRemove);
            this.currentChild--;
        }

        this.currentChild++;

        // Since we've scrolled some elements we may need to load more
        // to ensure there are always items in the container.
        this.updateIfNecessary();
    }
        // get tickerTape width
        var tickerTapeWidth = this.getElementWidth(this.tickerTapeWrapper)
        // stop message on the center of screen
        var position = -this.totalScroll;
        for (var childIndex = 0; childIndex < this.container.childNodes.length; childIndex++){
            var childElement = this.container.childNodes[childIndex];
            position += childElement.offsetWidth;
            // check that message item has "centerMessageId" attribute and has not stoped on center before and position equals center of  screen 
            // if all conditions are satisfied ticker tape stop a scroll
            if (childElement.getAttribute("centerMessageId") != null && centerMessageIdArray[childElement.getAttribute("centerMessageId")] && (Math.abs(tickerTapeWidth/2 - position) < 10 ) ){
                this.isScrollPaused = true;
            }
        }

}


// Only calls update if the currentChild has passed the update threshold.
TickerTape.prototype.updateIfNecessary = function() {

    var containerWidth = this.getElementWidth(this.tickerTapeWrapper);
	
    do {

        var sumWidth = 0;
        var count = 0;
        var extraCount = 0;

        //sum up the containers child width
        for (var i = this.currentChild; i < this.container.childNodes.length; i++) {

            count ++;
            if (sumWidth > containerWidth) 
                extraCount++;
            
            sumWidth += this.getElementWidth(this.container.childNodes[i]);
        }

		//In order to prevent too many updates, we update only when we know for sure that there are less than UPDATE_TAPE_THRESHOLD_NUM_OF_ITEMS, i.e the ticker tape is about to show a new message -therefore we need to update it
        if (extraCount <= UPDATE_TAPE_THRESHOLD_NUM_OF_ITEMS) {
            var returned = this.update();
    
            if (returned == 0)
                break;
        }
        else{
       		 var k = 0;
        }

    } while (extraCount <= UPDATE_TAPE_THRESHOLD_NUM_OF_ITEMS);
}


// Called when the TickerTape class is instantiated.
TickerTape.prototype.init = function() {
    this.createDom();
    this.updateIfNecessary();

    var timeoutCallback = this.scroll.simpleBind(this);
    window.setInterval(function() { timeoutCallback(); }, this.scrollInterval);
}


// Computes the height including top and bottom margins of an element
TickerTape.prototype.getElementHeight = function(element) {

    var height = element.offsetHeight;
    var topMargin = 0;
    var bottomMargin = 0;

    if (element.currentStyle) {
        topMargin       = element.currentStyle['marginTop'];
        bottomMargin    = element.currentStyle['marginBottom'];
    } else if (window.getComputedStyle) {
        topMargin = document.defaultView.getComputedStyle(element,null).getPropertyValue('margin-top');
        bottomMargin = document.defaultView.getComputedStyle(element,null).getPropertyValue('margin-bottom');
    }
    
    var isSafari = false;
    
    if(navigator.vendor && navigator.vendor.indexOf('Apple') > -1) {
        isSafari = true;
    }
    
    if(!isSafari) {
        topMargin = topMargin.replace('px', '');
        bottomMargin = bottomMargin.replace('px', '');
    }

    if(topMargin == 'auto') topMargin = 0;
    if(bottomMargin == 'auto') bottomMargin = 0;

    return parseFloat(height) + parseFloat(topMargin) + parseFloat(bottomMargin);
}


// Computes the height including top and bottom margins of an element
TickerTape.prototype.getElementWidth = function(element) {

    var height = element.offsetWidth;
    var leftMargin = 0;
    var rightMargin = 0;

    if (element.currentStyle) {
        leftMargin  = element.currentStyle['marginLeft'];
        rightMargin = element.currentStyle['marginRight'];
    } else if (window.getComputedStyle) {
        leftMargin = document.defaultView.getComputedStyle(element,null).getPropertyValue('margin-left');
        rightMargin = document.defaultView.getComputedStyle(element,null).getPropertyValue('margin-right');
    }
    
    var isSafari = false;
    
    if(navigator.vendor && navigator.vendor.indexOf('Apple') > -1) {
        isSafari = true;
    }
    
    if(!isSafari) {
        leftMargin = leftMargin.replace('px', '');
        rightMargin = rightMargin.replace('px', '');
    }

    if(leftMargin == 'auto') leftMargin = 0;
    if(rightMargin == 'auto') rightMargin = 0;

    return parseFloat(height) + parseFloat(leftMargin) + parseFloat(rightMargin);
}


// Simple version of the Prototype library's bind() which will only work in
// this case, but doing it this way removes the need for Prototype's $A support.
Function.prototype.simpleBind = function() {

    var __method = this;
    var args =  [arguments[1]];
    var object =    arguments[0];

    return function() {
        return __method.apply(object, args);
    }
}


// Cross browser way of getting XMLHttpRequest from Jonathan Snook, see:
// http://snook.ca/archives/javascript/short_xmlhttprequest_abstraction/
/*@cc_on
@if (@_jscript_version >= 5 && @_jscript_version < 5.7)
  function XMLHttpRequest() {
    try{
      return new ActiveXObject('Msxml2.XMLHTTP');
      }catch(e){}
  }
@end
@*/
TickerTape.prototype.calculateDataSpace = function() {
	var data = this.dataProviderCallback(this);
	var sumWidth = 0;
	 // Now loop over data and calculate the expected size
    for(var i in data) {
    
    	 // Produces HTML like this:
            var listItem = document.createElement('li');
            var title = document.createElement('p');
    
            var item = data[i];
            
            //checking if this item is a message item
            if(!item.subject){
            	continue;
            }
            
            title.innerHTML = item.subject.truncate(MAX_LENGTH);

            // add to every ticker tape element attribute "messageId" with message id
            // if message is deleted every tag with such attribute and the same id will remove from ticker tape
            listItem.setAttribute("messageId", item.id);

           
            listItem.appendChild(title);

             // Add the built item to the document just for a second so that we can calculate its size in the container
            this.container.appendChild(listItem);
            
            //for bug ws-505:accumulate the spacethis item uses
            sumWidth += this.getElementWidth(listItem);
            //after calculating zise remove the element
            this.container.removeChild(listItem);
    
	}
	
	return sumWidth;
}

 

var xb =
{
    evtHash: [],

    ieGetUniqueID: function(_elem)
    {
        if (_elem === window) { return 'theWindow'; }
        else if (_elem === document) { return 'theDocument'; }
        else { return _elem.uniqueID; }
    },

    addEvent: function(_elem, _evtName, _fn, _useCapture)
    {
        if (typeof _elem.addEventListener != 'undefined')
        {
            if (_evtName == 'mouseenter')
                { _elem.addEventListener('mouseover', xb.mouseEnter(_fn), _useCapture); }
            else if (_evtName == 'mouseleave')
                { _elem.addEventListener('mouseout', xb.mouseEnter(_fn), _useCapture); } 
            else
                { _elem.addEventListener(_evtName, _fn, _useCapture); }
        }
        else if (typeof _elem.attachEvent != 'undefined')
        {
            var key = '{FNKEY::obj_' + xb.ieGetUniqueID(_elem) + '::evt_' + _evtName + '::fn_' + _fn + '}';
            var f = xb.evtHash[key];
            if (typeof f != 'undefined')
                { return; }
            
            f = function()
            {
                _fn.call(_elem);
            };
        
            xb.evtHash[key] = f;
            _elem.attachEvent('on' + _evtName, f);
    
            // attach unload event to the window to clean up possibly IE memory leaks
            window.attachEvent('onunload', function()
            {
                _elem.detachEvent('on' + _evtName, f);
            });
        
            key = null;
            //f = null;   /* DON'T null this out, or we won't be able to detach it */
        }
        else
            { _elem['on' + _evtName] = _fn; }
    },  

    removeEvent: function(_elem, _evtName, _fn, _useCapture)
    {
        if (typeof _elem.removeEventListener != 'undefined')
            { _elem.removeEventListener(_evtName, _fn, _useCapture); }
        else if (typeof _elem.detachEvent != 'undefined')
        {
            var key = '{FNKEY::obj_' + xb.ieGetUniqueID(_elem) + '::evt' + _evtName + '::fn_' + _fn + '}';
            var f = xb.evtHash[key];
            if (typeof f != 'undefined')
            {
                _elem.detachEvent('on' + _evtName, f);
                delete xb.evtHash[key];
            }
        
            key = null;
            //f = null;   /* DON'T null this out, or we won't be able to detach it */
        }
    },
    
    mouseEnter: function(_pFn)
    {
        return function(_evt)
        {
            var relTarget = _evt.relatedTarget;             
            if (this == relTarget || xb.isAChildOf(this, relTarget))
                { return; }

            _pFn.call(this, _evt);
        }
    },
    
    isAChildOf: function(_parent, _child)
    {
        if (_parent == _child) { return false };
        
        while (_child && _child != _parent)
            { _child = _child.parentNode; }
        
        return _child == _parent;
    }   
};