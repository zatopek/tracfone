
/**
 * @class NestedApplicationDisplayManager.<b> 
 * NestedApplicationDisplayManager is a manager for handling the clipping mechanism in Workspace.<b> 
 * The idea of clipping is using the ActiveX API for instructing it not to draw certain areas, <b>
 * Instead, in the undrawn areas portlets will be shown.<b> 
 * In order to use this mechanism portlets need to register to this manager,<b> 
 * as a result the manager will keep track of the portlet's location and instruct to clip out this area.<b>
 * See documentation for more information of how to register a portlet as part of the clipping mechanism.<b>
 * @see #displayPortletOnTopOfNestedApplication - for details on the usage of this class.<b>
 * @see #registerIframeInNestedApplication - for details on the usage of this class.<b>
 * @see #unRegisterIframeInNestedApplication - for details on the usage of this class.<b> 
  
 */
NestedApplicationDisplayManager = Class.create();
//this delimeter is the needed for the activeX for parsing the given position
var delimeter = '|';
var mytop = 0;
var myleft = 0;
NestedApplicationDisplayManager.prototype = {

  initialize: function() {
    
  }, 
  
 
  /**
  * This method is responsible for initializing the internal state of the NestedApplicationDisplayManager.<b>
  * It should be called whenever initalizing a new NestedApplicationDisplayManager.<b> 
  */
  init: function(){
    this.iframesId = new Array();
    
    //updating the activeX when the window is resized
    if( window.attachEvent ) {
        window.attachEvent("onresize", this.onResizeWindow.bindAsEventListener(this));
    }
    
    //saving the window's position for cathching window's movememnt - couldnt do it with a onMove listener so used a timer
    mytop = window.screenTop;
    myleft = window.screenLeft;
    setInterval  ( "checkmove()", 100 );//this timer checks if the window moved
   
  },
  
 
  /**
  * This method is responsible for registering all iframes that have the special attribute: "displayPortletOnTopOfNestedApplication".<b> 
  * It is called at the end of the main index.jsp, after all frames were initialized.
  */
  registerIframesInNestedApplication: function() {
	var allFrames = document.getElementsByTagName("iframe");
  	for(var i=0; i<allFrames.length; i++)
    {
		try {
			if (allFrames[i].displayPortletOnTopOfNestedApplication == 'true') {
				this.displayPortletOnTopOfNestedApplication(allFrames[i]);
			}
			if (allFrames[i].frameElement && allFrames[i].frameElement.displayPortletOnTopOfNestedApplication == 'true') {
				this.displayPortletOnTopOfNestedApplication(allFrames[i].frameElement);
			}
		}catch(e){
			//this is required because in case of nesting extrnal iframes e.g cnn we will get "access denied" when accessing the iframe
			this._debug("in registerIframesInNestedApplication function. The following exception was thrown when trying to register an iframe:"+e.description+"This can happen when nesting external urls.");
		}
    }
    
  },
  
  /**
  * This method will register the given iframe in this class.<b> 
  * Internaly, this method will register the given iframe in the current ActiveX.<b>
  * Internaly, this method will add eventListeners to the Iframe for “onMove,“ “onResize”  for updating the current activeX regarding these changes.<b>
  * This method can be called in project level whenever a portlet is added to the screen.
  * @param (String) iframeId This is the id of the iframe that should be registered to the clipping mechanism.<b> 
  */
  registerIframeInNestedApplication: function(iframeId) { 
  
  this._debug("updateIframeInNestedApplication "+ "registering: "+iframeId);
  iframe  = document.getElementById(iframeId);
    if (!iframe){
        this._error("in displayPortletOnTopOfNestedApplication function. The given iframe was not found in the document. Therefore the function will not be activated.");
        return;
    } 
    
    this.iframesId.push(iframeId);
  
    
    
    
    //2. call the activeX api for registration
    if (this.currentActiveX != null) {
        this.currentActiveX.RegisterObject(iframeId);
    }
    //for bug ws-679: noticed in IE7 that nore the onmove or onresize events take affect if the application is shown upon login
    //so first of all update regarding the iframe position, [if it is not displayed yet there will not be any left/right/bottom/top params to send and update]
    this._updateIframeInActiveX(iframe);
  
    //3. register listener
    addEvent(iframe, 'move',this.updateIframeInNestedApplication.bindAsEventListener(this), false);
    addEvent(iframe, 'resize',this.updateIframeInNestedApplication.bindAsEventListener(this), false);
    
    
  },
  
  /**
  * This method will unregister the given iframe in the given iframe in this class.<b>
  * Internaly, this method will unregister the given iframe in the current ActiveX.<b>
  * Internaly, this method will detouch eventListeners to the Iframe for “onMove,“ “onResize”  for updating the current activeX regarding these changes.<b>
  * This method can be called in project level whenever a portlet is removed from the screen.
  * @param (String) iframeId This is the id of the iframe that should be unregistered from the clipping mechanism.<b> 
  */
  unRegisterIframeInNestedApplication: function(iframeId) { 
    
   var beforeRemLen = this.iframesId.length;
   
    this.iframesId = removeStringFromArray (this.iframesId, iframeId);
    //if the length remained after the removal then there was no removal becuase the iframe was not registered
    if (beforeRemLen == this.iframesId.length){
     	this._debug( "UN registering: "+iframeId+" was not performed because this iframe is not registered");
     	return;
    }
    this._debug("updateIframeInNestedApplication "+ "UN registering: "+iframeId);
    //2. call the activeX api
    if (this.currentActiveX != null) {
        this.currentActiveX.UnRegisterObject(iframeId);
    }
    
    iframe  = document.getElementById(iframeId);
    
    
    //3. unregister listener
    //iframe.detachEvent('onmove',this.updateIframeInNestedApplication.bindAsEventListener(this));
    //iframe.detachEvent('onresize',this.updateIframeInNestedApplication.bindAsEventListener(this));
    
    removeEvent(iframe, 'move', this.updateIframeInNestedApplication.bindAsEventListener(this));
    removeEvent(iframe, 'resize', this.updateIframeInNestedApplication.bindAsEventListener(this));

  },
  
  /**
  * This function will register the given object as the current activeX. It is assumed there is only one active ActiveX at a certain time. <b> 
  * This manager will use the ActiveX API to register all its registered Iframes to the new current ActiveX. <b>
  * This manager will also update the current ActiveX with the position of all registered Iframes. <b>
  * This method is added in our showTab function which is when an activeX becomes active. <b>
  * @private - this method is private.<b> 
  */
  setCurrentActiveNestedApplication : function(activeXId,activeX) { 
  //un set previous activeX if exists
  if (this.currentActiveX != null){
    this.clearCurrentActiveNestedApplication(activeXId);
  }
    this.currentActiveX = activeX;
     
    //re - register all iframes in activeX , no need to register the listeners again. 
     for(var i=0; i<this.iframesId.length; i++)
    {
        var iframe =document.getElementById(this.iframesId[i]);
        //update activeX
        this.currentActiveX.RegisterObject(this.iframesId[i]);
        this._updateIframeInActiveX(iframe);
    }
  },
  
  /**
  * This function will unregister the current activeX. It is assumed there is only one active ActiveX at a certain time. <b>
  * This manager will use the ActiveX API to unregister all its registered Iframes to the new current ActiveX. <b>
  * This manager will also update the current ActiveX with the position of all registered Iframes. <b>
  * This method is added in hideTab function which is when an activeX becomes inactive. <b>
  * @private - this method is private.<b>
  */
  clearCurrentActiveNestedApplication: function(activeXId) { 
    
    //unset only if this is the current activeX
    if (this.currentActiveX == null || activeXId != this.currentActiveX.id){
        return;
    }
    //un - register all iframes in activeX , no need to register the listeners again. 
     for(var i=0; i<this.iframesId.length; i++)
    {
        var iframe = document.getElementById(this.iframesId[i]);
        //unregister in activeX
        this.currentActiveX.UnregisterObject(this.iframesId[i]);
    }
    this.currentActiveX = null;
  },
  
  /**
  * This is the internal eventListener that will be added to registered iframe.<b> 
  * This method will retrieve the Iframe’s position and update the ActiveX about the new absolute position using the ActiveX API.<b> 
  * Note: There is no need to call this method upon resize/move of the activeX, because when the activeX changes position it goes over its registered Iframes, and calculates everything.[this is ok since the given positions are absolute).<b> 
  * @private - this method is private.<b>
  */
  updateIframeInNestedApplication: function(e) { 
  var iframe = e.srcElement;
    if (!iframe){
        return;
    }
    
    
    this._updateIframeInActiveX(iframe);
  
  },
  
  /**
  * This method is the handler for the "resize" event.<b> It will update the registered iframes location in the activeX.<b>  
  * @private - this method is private.<b>
  */
  onResizeWindow: function(e) { 
    //no need to do anything when there is no active nested appliaction
    if(!this.currentActiveX){
        return;
    }
    //when a window is resized then we need to update the current activeX
     //re - update all iframes in activeX , no need to register the listeners again. 
     for(var i=0; i<this.iframesId.length; i++)
    {
        var iframe = document.getElementById(this.iframesId[i]);
        //update activeX
        this._updateIframeInActiveX(iframe);
    }
  },
  
  /**
   * This API is intended to the standard end-user.<b> 
   * This method is responsible for registering/unregistering the given iframe when it becomes visible.<b> 
   * It can be either activated by the user by passing this function as the "onload" method or it can be called in the initialization of the portal.<b>
   * @param (frame) frameObj This is the frame element that should be displayed on top of nested applications, i.e should use the clipping mechanism.<b>  
  */
  displayPortletOnTopOfNestedApplication: function(frameObj) { 
  	if (!frameObj){
        this._error("in displayPortletOnTopOfNestedApplication function. The given iframe is null. Therefore the function will not be activated.");
        return;
    } 
    if (!frameObj.id || frameObj.id==''){
        this._error("in displayPortletOnTopOfNestedApplication function. The given iframe id is null or empty. Therefore the function will not be activated.");
        return;
    }
    //set the register/unregister method as a listener on the onShow/onHide event
    this.registerIframeInNestedApplication(frameObj.id);
    
 },
 
  /**
   * This API is for handling the case in which a nested tab is maximized. It will be called from the maximaizeTab method.<b> 
   * In such case all registered portlets should still appear on top of the nested application.<b> 
   * The project should override this code for deciding in case the layout/size of the portlet should change in such case.<b>
   * @param (frame) frameObj This is the frame element that should be displayed on top of nested applications, i.e should use the clipping mechanism.<b> 
   * @param (frame) nestedFrame This is the iframe of the nested application which is maximized.<b> 
   */
  onNestedTabMaximized: function(frameObj, nestedFrame) { 
   //no need to do anything when there is no active nested appliaction or a document from the document search
    if(!this.currentActiveX && nestedFrame.id != "SearchResultTabFrame"){
        return;
    }
    //when a nested tab is maximized then we need to update the current activeX
     //re - update all iframes in activeX , no need to register the listeners again. 
     for(var i=0; i<this.iframesId.length; i++)
    {
        var frameElement = document.getElementById(this.iframesId[i]);
        //saving the real parent for onMinimize function
        var realParent = frameElement.parentElement;
        //saving real parent and real zindex before changing it
        frameElement.realParent = realParent; 
        frameElement.realZindex = frameElement.style.zIndex;
        
        //applying changes allowing this portlet to appear on top of a maximized application
        parent.document.body.appendChild(frameElement);      
        var nestedFrameZindex = nestedFrame.style.zIndex
        frameElement.style.zIndex = nestedFrameZindex+1;//using 5001 so that it would be on top of the nested application
        
       
    }
  
  },

   /**
    * This API is for handling the case in which a nested tab is minimized. It will be called from the minimizeTab method.<b> 
    * In such case all registered portlets should still appear on top of the nested application.<b> 
    * The user should override this function for deciding whether the layout/size of the portlet should change is such case.<b>
    * @param (frame) frameObj This is the frame element that should be displayed on top of nested applications, i.e should use the clipping mechanism.<b> 
   */
  onNestedTabMinimized: function(frameObj) { 
    //no need to do anything when there is no aactive nested appliaction
    if(!this.currentActiveX){
        return;
    }
      for(var i=0; i<this.iframesId.length; i++)
    {
         var frameElement = document.getElementById(this.iframesId[i]);
      
        //restoring parent and zindex
        frameElement.realParent.appendChild(frameElement);
        frameElement.style.zIndex = frameElement.realZindex
        
    }
  },
  
 /**
 This is the internal method which updates the activeX with the locationof the iframe.<b> 
 @private This method is private.<b> 
 */
  _updateIframeInActiveX: function(iframe){
    var left = YAHOO.util.Dom.getXY(iframe)[0];
    left = left +$W().screenLeft;
    var top = YAHOO.util.Dom.getXY(iframe)[1];
    top = top + $W().screenTop;
    var right = left+iframe.offsetWidth;
    var bottom = top+iframe.offsetHeight;
	//theoretically an iframe that has no display should not be registered, but if somehow it is, update with zero params to avoid real clipping
	if (iframe.style.display == 'none'){
		left = 0;
		top = 0;
		right = 0;
		bottom = 0;
	}
    var params = left+delimeter+top+delimeter+right+delimeter+bottom;
    
    //this._debug("_updateIframeInActiveX "+" id: "+iframe.id+ "left :"+left+ " top: "+top + " right: "+right+ " bottom: "+bottom);
  
    //this._debug("sending the following params: "+ params);
    if (this.currentActiveX != null){
        this.currentActiveX.UpdateObject(iframe.id,params);
    }
  },
   /**
 This is the internal method for hiding the activeX. It is used when displaying modal portlets from the toolbar.<b> 
 @private This method is private.<b>
 */
 hideCurrentActiveX: function(){
  	if(this.currentActiveX){
  		this.currentActiveX.HideApplications();
  	}
  },
 /**
 This is the internal method for showing the activeX. It is used when closing modal portlets from the toolbar.<b> 
 @private This method is private.<b>
 */
  showCurrentActiveX: function(){
  	if(this.currentActiveX){
  		this.currentActiveX.ShowApplications();
  	}
  },
  /**
  @private - This method is for reporting errors.<b> 
  */
  _error: function(msg)
  {
        $W().LogManager.getLogger("NestedApplicationDisplayManager").error(this._getLogHeader(this) + msg );
  },
 /**
  @private - This method is for reporting debug information.<b>
  */
   _debug: function(msg)
  {             
        $W().LogManager.getLogger("NestedApplicationDisplayManager").debug(this._getLogHeader(this) + msg );
  },
   /**
  @private - This method is private.<b>
  @return - the log header of this class.<b> 
  */
  _getLogHeader: function(){
  	return " NestedApplicationDisplayManager.js  ";
  }
 
}
 /**
  @private - This method is is the method that tests whether the window has changed.<b> It is activated every certain interval.<b> 
  */
 function checkmove()
  {
    var hasChanged;
    if(mytop != window.screenTop || myleft != window.screenLeft){
        //update new xy positions
        mytop = window.screenTop;
        myleft = window.screenLeft;
        hasChanged = true;
    }
    if (hasChanged){
         //alert('top windo changed');
        $W().displayManager.onResizeWindow();
    }
  }
  


function removeStringFromArray (arr, str)
{
    newArr = new Array();
    for(var i=0; i<arr.length; i++)
    {
        if( arr[i] != str )
            newArr.push( arr[i] );
    }

    return newArr;
}