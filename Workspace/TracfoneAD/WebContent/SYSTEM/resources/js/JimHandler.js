/**
 * @class
 */
JimHandler = Class.create();

 
JimHandler.prototype = {
  initialize: function() {
  }, 
  
  
  
  
/********************************************************************************
   * This is a list of examples for implementing the JimHandlers functions.
   * Uncomment the list below in order to use it.
    *********************************************************************************/

 onEndJimScript:function(str)
  {
  // these are usually the operation our sample wrap up script does
  $W().cti.saveTimers();
  $W().cti.endDisposition();
  window.parent.frames.CallLogPortletFrame.clearText(); 
 },
 
 onJimAgentNote:function(str)
  {
    window.parent.frames.CallLogPortletFrame.addText(str); 
  },
 
 onEndCallFromJimScript:function(str)
  {
  //do the same as clicking the end button
   $W().cti._onEndClicked();
  },
  
  /********************************************************************************
   * This section handles the jim-side-by-side feature
    *********************************************************************************/
  
/*
 This method receives input indicating which JSP page to load and the tab to which it should be loaded.
 Note: Currenly in concatanates the contextPath, because it is an internal iframe and doesnt have the contextpath available
 */
 onLoadJSPPage:function(str)
  { 
  	if(this.layout=="horizontal"){
  		this._getScriptIframe().src = $W().contextPath+"/"+str;
  	}else{
  		this._getWorkspaceSideIframe().src = $W().contextPath+"/"+str;
  	}
   },
 
   /*
   Only relevant in vertical mode!
 Note: This handler is attached to the iframe in js , this means that the "this" in this case is the object on which the function was attached.
 So the "this" is not the jimHandler object in this function
 */
 onWorkspaceSideLoaded:function(e)
  {
   	//activate onclick handlers only in collapsible mode
	if((this.readyState=="complete") && ($W().jimHandler.collapsible)){  	
   		this.contentWindow.document.ondblclick = $W().jimHandler.onWorkspaceSideClicked;
    }
  },
 
  /*
  Only relevant in vertical mode!
  This function should uncollapse jim
  Note:Here "this" stands for the jimIframe
  */
 onJimCollapsedSideClicked:function(str)
  {
    //uncollapse by making jim visible only when it is not during loading
    if($W().jimHandler._getJIMSideIframe().readyState=="complete" && $W().jimHandler._getWorkspaceSideIframe().readyState=="complete") {
    	//make jim visible
    	$W().jimHandler._getJIMSideDiv().style.display = "inline";
      	//hide the collapsible area
    	$W().jimHandler._getJIMCollapsibleSideDiv().style.display = "none";
    }
  },
   /*
   Only relevant in vertical mode!
  This function should collapse jim which is done by hiding jim and unhiding its collapsible
  Note:Here "this" stands for the workspaceIframe
  */
  onWorkspaceSideClicked:function(str)
  {
    if($W().jimHandler._getJIMSideIframe().readyState=="complete" && $W().jimHandler._getWorkspaceSideIframe().readyState=="complete") {
    	//hide jim area
    	$W().jimHandler._getJIMSideDiv().style.display = "none";  	
    	//make the collapsible area visible
    	$W().jimHandler._getJIMCollapsibleSideDiv().style.display = "inline";
    }
  },
  
/*
Private methods for retreiving the side by side componenets
*/
  _getScriptIframe:function(){
  	return document.getElementById("ScriptZoneId");
  },
   _getJIMSideIframe:function(){
  	return this._getScriptIframe().contentWindow.document.getElementById("JIMFrame");	
  },
  _getJIMSideDiv:function(){
  	return this._getScriptIframe().contentWindow.document.getElementById("JIMDIVPlaceHolder");	
  },
   _getJIMCollapsibleSideDiv:function(){
  	return this._getScriptIframe().contentWindow.document.getElementById("JIMCollapsedDIVPlaceHolder");
  },
   _getWorkspaceSideIframe:function(){
  	return this._getScriptIframe().contentWindow.document.getElementById("WorkspaceJSPFrame");
  },
   _getJIMHorizontalIframe:function(){
  	return document.getElementById("JIMHorizontalIframe");	
  },
  
  /*
  relevant only when jim is in horizontal mode
  */
   onLoadJimHorizontal:function(str)
  {
  	this._getJIMHorizontalIframe().src=str;
  },
  

  
 init: function() {
    // Here you should register all Jim push handlers
    // Example:
    $W().Push.registerEventHandler( 'endJimScript', this.onEndJimScript.bind(this)); 
    $W().Push.registerEventHandler( 'loadJSPPage', this.onLoadJSPPage.bind(this));
    $W().Push.registerEventHandler( 'onEndCallFromJimScript', this.onEndCallFromJimScript.bind(this));
    $W().Push.registerEventHandler( 'onJimAgentNote', this.onJimAgentNote.bind(this));
    $W().Push.registerEventHandler( 'onLoadJimHorizontal', this.onLoadJimHorizontal.bind(this));
    
    
  }
  
  }
  
  //end of class