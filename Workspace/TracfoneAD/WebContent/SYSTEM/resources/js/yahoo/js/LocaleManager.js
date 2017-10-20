/**
 * @class LocaleManager.<b> 
 * The Locale Manager Class. 
 * This class exposes API for getting localized texts
 * in the client side. It can be used for application
 * level localization.
 * Note that this class alows access only to texts that were
 * defined for client side usage. This definition is done by
 * setting localization keys that start with "application.javascript".
 * An instance of this class is created during the agent login
 * and is avalibale in the following way - $W().localeManager .<br> 
 * For getting localized texts for script level uasge in the client side,
 * use the script Locale Manager, also available on the main document - $W().scriptLocaleManager. 
 * This class provides access to localization keys that start with "script.javascript".
 */ 
LocaleManager = Class.create();

LocaleManager.prototype = {
	/**
	 * Initialization method. 
	 * Called from the main page during the login.
	 */
	initialize: function () {
		this.init = false;	
		this.locale = "en";
		this.type = "portal";
		this.values = "";
		this.localeURL = 'SYSTEM/portlets/localeManager/loadLocale.jsp';
	},
	
	/**
	 * This metod returns a localized text according to the given key.
	 * If the a text is not found for this key, it will return the key.
	 * Note that a valid localization key must start with "application.javascript"
	 * or "script.javascript" in order to be available by this manager.
	 * @param key A valid localization key. This key should be defined
	 * in the resource bundle properties file. 
 	 */
	 getLocalizationValue: function( key ) {
	 	var keyStr = key.replace(/\./g, "_");
	 	var value = this.values[keyStr];
	 	if (typeof value == 'undefined') {
        	return key;
        }
        return value;
    },
    
    getLocale: function() {
     	return this.locale;
     },
     
     setLocale: function( locale ) {
     	this.locale = locale;
     },
     
    loadLocale: function() {
  		var pars = "localeType=" + this.type;
  		var request = new Ajax.Request(this.localeURL, {method: 'get', parameters: pars, asynchronous : false});
    	if (request.success()) {
    		this.values = eval('(' + request.transport.responseText + ')');
    	}
    },
	
	_debug: function(msg){             
        $W().LogManager.getLogger("LOCALEMANAGERJS").debug(this._getLogHeader() + msg + this._getLogTrailer());
  	},
  	
	_getLogHeader: function(){ 
	    return " LocaleManager.js - <<" ;
	},

	_getLogTrailer: function(){     
	    var text = "\t\t\t>> Locale Object:\t";
	    text += "\t" + "locale: "        + this.locale;        
	    return text;
	}
}
/////////////////Class LOCALe Manger END////////////////////////////////////////////////////

ScriptLocaleManager = Class.create();

ScriptLocaleManager.prototype = Object.extend(new LocaleManager(),{
	initialize: function () {
		this.init = false;	
		this.locale = "en";
		this.type = "script";
	}
  	
});
/////////////////ScriptLocaleManager END////////////////////////////////////////////////////

