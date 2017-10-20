/***************************************************************************
 *  @class
 *  Push Handler class                                                     *
 *
 *  to register event handlers use the following code:
 *
 *      Push.registerEventHandler( 'myKeyword', onMyKeywordHandler);
 *   
 *  
 *    function onMyKeywordHandler(param) {
 *       alert("onMyKeyword - " + param.name);
 *       Push.unregisterEventHandler('moshe', onmosheHandler);
 *    }
 *
 ***************************************************************************/
  
Ajax.Push = Class.create();


Ajax.Push.prototype = {
  initialize: function() {
      this['failed0'] = 0;
      this['failed1'] = 1000;
      this['failed2'] = 5000;
      this['failed3'] = 30000;

      this.failCount=0;
      this.exit = false;
      this.registerEventHandler("duplicate",this._OnDuplicate.bind(this));
      this.registerEventHandler("stopping",this._OnStopping.bind(this));
      this.registerEventHandler("exception",this._OnException.bind(this));
      this.registerEventHandler("renew",this._OnStopAccumulating.bind(this));      
      this.failCount = 0;
      this.timeout = 180000;
      this.servletPrefix = "/JacadaWorkspaceCommon/push/";

  },
  
  /**
   * This method initializes the push mechanism in the server side
   * @param {} sessionId - the agent's session id
   * @param {} contextPath - the application context path
   * @param {} pushServerName - the push server name. this paramter contains the DedicatedPushConnectionURL value. the default value is "Not Set".    
   * @param {} groupBasedSelector - the agent's group list
   * @param {} agentName - the agent name
   */
  init : function(sessionId, contextPath,pushServerName,groupBasedSelector,agentName) {
    this.sessionId = sessionId;
    this.contextPath = contextPath;
    this.groupBasedSelector = groupBasedSelector;
    this.agentName = agentName;
    if (pushServerName != null && pushServerName != "Not Set" ){
    	this.servletPrefix = pushServerName + this.servletPrefix;
    } 
    new Ajax.Request(this.servletPrefix + "startPush?sessionid=" + this.sessionId + "&contextPath=" + encodeURIComponent(this.contextPath)
    	+"&groupBasedSelector="+encodeURIComponent(this.groupBasedSelector)+"&agentName="+encodeURIComponent(this.agentName),
     { method: 'get', contentType: 'text/xml', asynchronous : false });
	new Ajax.Request(this.contextPath+'/stopPushAccumulation.jsp', { method: 'get', asynchronous : false });     
  },
  
  /**
   * This method setup the connection between the server and the browser. 
   * @param {} sessionId - the agent's session id
   * @param {} contextPath - the application context path
   */
  listen : function(sessionId, contextPath) {
  	if (arguments.length == 2) {
		this.sessionId = sessionId;
   	this.contextPath = contextPath;
	}
   	Push.start();
  },
  
  /**
   * This method setup the connection between the server and the browser. 
   */
  start: function() {
     this.exit = false;
     this._doListen();
  },
  
  /**
   * This method terminates the connection between the server and the browser.
   */  
  stop: function() {
     this.exit = true;
     if (this.currentTimer != null) {
         clearTimeout(this.currentTimer);
     }
     if (this.request != null) {
        try {
            this.request.transport.abort();
        } catch (e) {};
     }
     
     new Ajax.Request(this.servletPrefix + "stopPush?nocache=" + Date.now(), { method: 'get', asynchronous : false });
  },

  /**
   * This function registers event handler 
   * @param {} keyword - the event keyword
   * @param {} handler - the specific function that is called during the event
   * @param {} reset - indicates whether an existing event handler should be replaced 
   */	
  registerEventHandler: function(keyword, handler, reset) {
     var shouldReset = reset || false;
     var handlerList = null;
     if (!shouldReset) {
       handlerList = this['on' + keyword];
     }
     if (handlerList == null) {
        handlerList = new Array();
        this['on' + keyword]= handlerList;
     }
     
     this.unregisterEventHandler(keyword, handler);
     handlerList.push(handler);
  },

  /** 	
   * This function unregisters event handler 
   * @param {} keyword - the event keyword
   * @param {} handler - the specific function that is called during the event
   */
  unregisterEventHandler: function(keyword, handler) {
     
     var handlerList = this['on' + keyword];
     if (handlerList == null) {
        return false;
     }
     for (var i = 0; i < handlerList.length; i++) {
        if (handlerList[i]==handler) {
            handlerList.splice(i,1);
            return true;
        }
     }
     return false;
  },

  /** 	
   * This function unregisters all event handler for a provided keyword 
   * @param {} keyword - the event keyword
   */
  unregisterAllEventHandlers: function(keyword) {
     this['on' + keyword] = null;
  },
	  
  /** 	
   * This function set client timeout. Default is 180,000 milliseconds (3 minutes). 
   * @param {} timeout - the timeout in milliseconds
   */
    setTimeout : function(timeout) {
    	this.timeout = timeout;
    },

/*
* This method maintains the connection between the browser and the server by calling the eventProcessor servlet
*/
    _doListen: function() {
        //debugger;
        $W().LogManager.getLogger("client.push").trace('>>_doListen');
        this.request = new Ajax.Request(this.servletPrefix + "eventProcessor?sessionid=" + this.sessionId + "&contextPath=" + encodeURIComponent(this.contextPath)
                + "&groupBasedSelector=" + encodeURIComponent(this.groupBasedSelector) + "&agentName=" + encodeURIComponent(this.agentName),
        {method: 'get', contentType: 'text/xml', onSuccess : this._successResponse.bind(this), onFailure: this._failureResponse.bind(this)});
        if (this.currentTimer != null) {
            clearTimeout(this.currentTimer);
        }
        this.currentTimer = setTimeout('Push._reset();', this.timeout);
        $W().LogManager.getLogger("client.push").trace('<<_doListen ' + this.request);
    },

/*
* This method handles a successful response from the eventProcess servlet
*/
    _successResponse: function(response) {
        $W().LogManager.getLogger("client.push").trace('>>_successResponse');
        var functionStr;
        if (this.exit) {
            return false;
        }
        try {
            var receivedArray = eval('(' + response.responseText + ')');
            $W().LogManager.getLogger("client.push").trace('_successResponse - responseText ' + response.responseText);
            for (var k = 0; k < receivedArray.length; k++) {
                var receivedObject = eval('(' + receivedArray[k] + ')');
                var keyword = receivedObject.keyword;
                if (keyword != "exception") {
                    this.failCount = 0;
                }
                var data = receivedObject.data;
                $W().LogManager.getLogger("client.push").trace('_successResponse - keyword ' + keyword);
                var handlerList = this['on' + keyword];
                if (handlerList != null) {
                    var size = handlerList.length;
                    var i = 0;
                    while (i < size) {
                        //for (var i = 0; i < handlerList.length; ++i) {
                        try {
                            // invoke handler
                            functionStr = handlerList[i].toString();
                            var index = functionStr.indexOf("{");
                            if (index > 1) {
                                functionStr = functionStr.substring(0, index);
                            }
                            $W().LogManager.getLogger("client.push").trace('>> calling \'' + keyword + '\' handler ' + functionStr);
                            var shouldUnregister = handlerList[i](data);
                            $W().LogManager.getLogger("client.push").trace('<< calling \'' + keyword + '\' handler ' + functionStr);
                            if (shouldUnregister == true) {
                                // remove the handler from the handlers array
                                handlerList.splice(i, 1);
                                i--;
                                size--;
                            }
                        } catch(ex) {
                        	Jacada.Logger.error(ex);
                        	var msg = (ex.description?ex.description:ex.message);
                            $W().LogManager.getLogger("client.push").error("got exception while trying to call a push handler for keyword: "+ keyword + "; Exception: " + msg);
                        }
                        i++;
                    }
                }
            }
            if (this.currentTimer != null) {
                clearTimeout(this.currentTimer);
            }
            if (this.exit) {
                return false;
            }
            this.currentTimer = setTimeout('Push._doListen();', 10);
        } catch (e) {
            var message = "got exception in the push mechanism, stop listening to pushed messages, the exception is:" + e;
            var logger = LogManager.getLogger("client.push");
            logger.error(message);
            location.href = "SYSTEM/errorPage.jsp";
        }
    },

/*
* This method handles a failed response (Http errors) from the eventProcess servlet
*/
    _failureResponse : function(response) {
        if (this.exit) {
            return false;
        }
        var status = this.request.transport.status;
        //alert("Push Failure, status  "+status);
        var message = "Push Failure, status  " + status;
        var logger = LogManager.getLogger("client.push");
        logger.error(message);

        var waitTime = this['failed' + this.failCount++] + 10;
        if (this.failCount <= 4 && status != 404) {
            if (this.currentTimer != null) {
                clearTimeout(this.currentTimer);
            }
            this.currentTimer = setTimeout('Push._doListen();', waitTime);
        } else {
            logger.error('reached max push retries, push will be disabled for this session');
            if (this.currentTimer != null) {
                clearTimeout(this.currentTimer);
            }
        }

  },

	/*
	* This method handles the case that the browser does not receive any response from the eventProcess servlet.
	* It stops restarts the push (invalidates push session) at the server side.
	*/
    _abort : function() {
        //alert('in abort');
        if (this.request != null) {
            this.stop();
            this.exit = false;
            $W().LogManager.getLogger("client.push").error('got timeout, aborting request, and resending');
            if (this.currentTimer != null) {
                clearTimeout(this.currentTimer);
            }
            this.currentTimer = setTimeout('Push._doListen();', 10);
        }
    },
    
	/*
	* This method handles the case that the browser does not receive any response from the eventProcess servlet.
	* It resets the push by restarting subscriber as the server side.
	*/
    _reset : function(){
    	$W().LogManager.getLogger("client.push").trace('>> _reset ');
    	if(this.request != null){
    		$W().LogManager.getLogger("client.push").warning('got client timeout, reseting push');
			new Ajax.Request(this.servletPrefix + "resetPush?sessionid=" + this.sessionId + "&contextPath=" + encodeURIComponent(this.contextPath)
				+ "&groupBasedSelector=" + encodeURIComponent(this.groupBasedSelector) + "&agentName=" + encodeURIComponent(this.agentName),
				{ method: 'get', asynchronous : false });
            if (this.currentTimer != null) {
                clearTimeout(this.currentTimer);
            }
            this.currentTimer = setTimeout('Push._doListen();', 10);
    	}
    	$W().LogManager.getLogger("client.push").trace('<< _reset');
    }, 

  /*
   * This method handles the duplicate push exception that is thrown from the eventProcessor.
   */	
  _OnDuplicate : function(response) {
      this.stop();
      //alert("Got duplicate push handlers, exiting");
      var message = "Got duplicate push handlers, exiting";
      var logger = LogManager.getLogger("client.push");
      logger.error(message);
      //window.opener = window; 
      //window.close();
      location.href = "SYSTEM/errorPage.jsp";

  },
  
  /*
   * This method handles the stopping event 	
   */	
  _OnStopping : function(response) {
      this.stop();
  },

  /*
   * This method handles the exception event (exception is thrown in the eventProcessor servlet). 	
   */	
  _OnException : function(response) {
      this.failCount++;
      $W().LogManager.getLogger("client.push").error("Got exception is push handler, for "+this.failCount+" in a row " +response.message);
      if (this.failCount > 3) {
          this.stop();
          //alert("Got duplicate push handlers, exiting");
          var message = "Got exception is push handler, exiting "+response.message;
          var logger = LogManager.getLogger("client.push");
          logger.fatal(message);

          location.href = "SYSTEM/errorPage.jsp";
      }

  }, 
  
  /*
   * This method handles the stopAccumulating event. 
   * This event occurs when a push connection between the browser and the server has been established.  	
   */	 
  _OnStopAccumulating : function(response) {
  		 new Ajax.Request(this.contextPath+'/stopPushAccumulation.jsp', { method: 'get', asynchronous : false });
  } 
  
};


var Push = new Ajax.Push();



