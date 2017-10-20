/** 
 * @class JAD.js - This file contains utility methods.
 */
/**
 * Accessor method for retrieving the main window.<br>
 * Should be used in the following way $W.
 * @return the main window.
 */
var $W = getMainWindow;
var theNewW = findMainWindow();

/**
 * Accessor method for retrieving the main document.<br>
 * Should be used in the following way $D.
 * @return the main document.
 */
var $D = getMainDocument;
function findMainWindow(){
	var w = window;
    while (w != w.parent) {
        w = w.parent;
    }
    
    while (w.opener != null) {
        w = w.opener;
    }

    while (w != w.parent) {
        w = w.parent;
    }
    
    return w;
}
//private method 
function getMainWindow() {
	return  theNewW;

}
//private method 
function getMainDocument() {
    return getMainWindow().document;
}

/**
 * This method finds an iframe in the given document according to the given frameId.<br>
 * @param (String) iframeid This is the id of the iframe.<br> 
 * @param (document) doc This is the document in which the iframe should be found.<br>  
 * @return an iframe element.
 */
function findIFrameInDoc(iframeid, doc) {
    var iframes = doc.getElementsByTagName("IFRAME");
    for (i=0; i<iframes.length; i++) {
        if (iframes[i].name == iframeid) {
            return iframes[i];
        }
    }
     
    return null;
}
/**
 * This method finds an iframe in this document according to the given frameId.<br>
 * @param (String) iframeid This is the id of the iframe.<br>
 * @return an iframe element in the current document.
 */
function findIFrame(iframeid) {
    var w = window;
    var frame = findIFrameInDoc(iframeid, w.document);
    
    while (frame == null && w != w.parent) {
        w = w.parent;
        
        frame = findIFrameInDoc(iframeid, w.document);
    }

    return frame;
}

/**
 * This method loads a given url into an iframe according to the given frameId.<br>
 * @param (String) iframeid This is the id of the iframe to load into.<br>
 * @param (String) url This is the url to load to the iframe.<br> 
 */
function loadintoIframe(iframeid, url){
	logToConsole('loadintoIframe '+iframeid+'  '+url);
	if($W().LayoutByContext){
		iframeid = Ext.getCmp('contextNavigation').getActiveTabIdByContext(iframeid);
		logToConsole('loadintoIframe actual iframe='+iframeid);
	}
  var frame = findIFrame(iframeid);
  logToConsole('iframe found: '+(frame != null));
  if (frame != null) {
     frame.src = url;
  }
}

function logToConsole(message){
	if(typeof console != 'undefined'){
		console.log(message);
	}
}
/**
 * This method reports an audit event to the server .<br>
 * @param (String) actionName This is the action to be audited.<br>
 * @param (String) parent This is the context of the audited action. Possible values are: "interaction", "agentSession".<br>
 * @param (String) paramName This is the name of the parameter to be audited. The context of the parameter is the actionName.<br>
 * @param (String) paramValue This is the value of the parameter to be audited. The context of the parameter is the actionName.<br> 
 */
function sendAuditEvent(actionName, parent, paramName, paramValue) {
	if($W().isAuditEnabled != false){
		var url = 'Controller.jpf';
	    var pars = 'action=auditClientAction';
	    pars += '&actionName=' + encodeURIComponent(actionName);
	    pars += '&parent=' + encodeURIComponent(parent);
	    if (paramName != undefined) {
		    pars += '&paramName=' + encodeURIComponent(paramName);
		    pars += '&paramValue=' + encodeURIComponent(paramValue);
		}
	
	    new Ajax.Request(url, { method: 'post', parameters: pars, asynchronous : true });
	}
}

/**
 * A cross browser method to add an event to an element.
 * @param el the element 
 * @param eventType - A string representing the event to bind, without the "on" prefix. For example, "click", "mousedown" etc.
 * @param listener - The object or function to fire when the event fires.
 * @param useCapture - Boolean indicating whether to bind the event as it is propogating 
 *                      towards the target node, (event Capture), or as the event bubbles upwards from the target (event bubble). 
 *                      Set to true or false, respectively.
 */
function addEvent(el, eventType, listener, useCapture) {
	if (el.addEventListener) {
		el.addEventListener(eventType, listener, useCapture);
	} else if (el.attachEvent) {
		el.attachEvent('on' + eventType, listener);
	}
}

function removeEvent(el, eventType, listener) {
	if (el.removeEventListener) {
		el.removeEventListener(eventType, listener, false);
	} else if (el.detachEvent) {
		el.detachEvent('on' + eventType, listener);
	}
}

function loadXml(xmlAsString) {
	xmlAsString = trim(xmlAsString);
	var xmlDoc;
	if (window.DOMParser){
	  parser = new DOMParser();
	  xmlDoc=parser.parseFromString(xmlAsString,"text/xml");
	}else{ // Internet Explorer
	  xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
	  xmlDoc.async="false";
	  xmlDoc.loadXML(xmlAsString); 
	}
	return xmlDoc;
}

//Removes leading whitespaces
function leftTrim( value ) {
	
	var re = /\s*((\S+\s*)*)/;
	return value.replace(re, "$1");
	
}

// Removes ending whitespaces
function rightTrim( value ) {
	
	var re = /((\s*\S+)*)\s*/;
	return value.replace(re, "$1");
	
}

function showPopupWindow(config) {
	if($W().toolbarItems[config.id] == null){
		config.tag = "portlet";
		$W().addToolbarItem(config);
		$W().toolbarItems[config.id] = config;
	}
	//wait till the iframe is loaded
	windowLoadedIntervalID = window.setInterval(function() { internalLoadWindow(config.id); },200);
}

//for internal use only
function internalLoadWindow(windowId) {
	if ($W().toolbarWindows[windowId]){
		//first thing, stop the interval
		clearInterval(windowLoadedIntervalID);
		$W().runToolbarItem(windowId);
	}
}

function trim( value ) {
	
	return leftTrim(rightTrim(value));
	
}

var expDays = 30;
var exp = new Date(); 
exp.setTime(exp.getTime() + (expDays*24*60*60*1000));






