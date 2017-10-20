/*
 *
 * The ComponentContainer Class
 * Holds all iframes of the application for layout changes
 *
 *
 */
 
ComponentContainer = Class.create();

ComponentContainer.prototype = {
    //Instance is created at the start of the index.jsp page load for the default values to be set.
        
	initialize: function () {
		this._elements = new Object();
	},
	
	_debug: function(msg)
  	{             
        $W().LogManager.getLogger("ComponentContainer").debug('ComponentContainer.js - <<' + msg );
  	},
  
  	_error: function(msg)
  	{
        $W().LogManager.getLogger("ComponentContainer").error('ComponentContainer.js - <<' + msg );
  	},
  		
	initContainer: function() {
		this._elements = document.getElementsByTagName('iframe');
	},
	
	getElement: function(elemId) {
		return this._elements[elemId];
	},
 
 	addElement: function(newElem) {
		this._elements[newElem.name] = newElem;
	}
}
/////////////////Class END////////////////////////////////////////////////////
