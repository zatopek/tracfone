/***************************************************************************
 *  @class OneXAgentClient
 *  Avaya OneX client                                                      *
 *
 ***************************************************************************/
var OneXAgentClient = Class.create();

OneXAgentClient.prototype = {
    initialize: function() {
        this['failed0'] = 0;
        this['failed1'] = 1000;
        this['failed2'] = 5000;
        this['failed3'] = 30000;
        this.failCount=0;
        this.pollTimeout = 1000;
        this.methods = {
            onNextNotificationResponse : function (responseCode, notification) {
                var methodName = 'on' + notification.nodeName;
                var params = this._parseResponseAsArray(notification);
                if (methodName != 'onQueueEmpty') {
	                if (this.methods[methodName]) {
	                    this.methods[ methodName ].apply( this, Array.prototype.slice.call( params, 0 ));
	                }
                }
            },
            onQueueEmpty : function (objectId, notificationId, timeStamp) {
                this.callback.onQueueEmpty(objectId, notificationId, timeStamp);
            },
            onVoiceInteractionCreated : function (NotificationId, ObjectId, TimeStamp, WorkItemId, RemoteUser, Topic, RemoteAddress,
                                                  PromptedDigits, UUI ) {            	
                this.callback.onVoiceInteractionCreated(NotificationId, ObjectId,TimeStamp, WorkItemId, RemoteUser, Topic, RemoteAddress,
                                                                                PromptedDigits, UUI );

            },
            onVoiceInteractionTerminated : function(NotificationId,ObjectId,TimeStamp, WorkItemId, RemoteUser, Topic, RemoteAddress,
                                                    PromptedDigits, UUI) {
                this.callback.onVoiceInteractionTerminated(NotificationId,ObjectId,TimeStamp, WorkItemId, RemoteUser, Topic, RemoteAddress,
                                                                                                              PromptedDigits, UUI);
            },
            onWorkItemAdded : function (NotificationId, ObjectId, TimeStamp, Topic) {
                this.callback.onWorkItemAdded(NotificationId, ObjectId, TimeStamp, Topic);
            },
            onWorkItemRemoved : function (NotificationId, ObjectId, TimeStamp, Topic) {
                this.callback.onWorkItemRemoved(NotificationId, ObjectId, TimeStamp, Topic);
            },
            onVoiceInteractionMissed : function (NotificationId, ObjectId, TimeStamp, WorkItemId, RemoteUser, Topic) {
                this.callback.onVoiceInteractionMissed(NotificationId, ObjectId, TimeStamp, WorkItemId, RemoteUser, Topic);
            },
            onIMInteractionCreated : function(NotificationId, ObjectId, TimeStamp, WorkItemId, Topic) {
                this.callback.onIMInteractionCreated(NotificationId, ObjectId, TimeStamp, WorkItemId, Topic);
            },
            onIMInteractionTerminated : function(NotificationId, ObjectId, TimeStamp, WorkItemId, Topic) {
                this.callback.onIMInteractionTerminated(NotificationId, ObjectId, TimeStamp, WorkItemId, Topic);
            }
        };
    },

    /** @param port that the client registers on is in the range 60000-61000. The
    *   exact port number to which to listen for can be found in HKCU/Software/Avaya
    *   one-X Agent/Settings/APIPort.
    *   @param client This should be a unique name that should be provided when registering the
    *   client.
    **/
    init: function (port, clientName, clientid) {
        this.port = port;
        this.clientName = clientName;
        this.clientid = clientid;
        this.baseURL = "http://127.0.0.1:" + port + "/onexagent/api";
        this.voiceURL = this.baseURL + "/voice";
    },

    /** User trigger operations should be asynchronous **/
    _runOperation : function(url) {
        $W().LogManager.getLogger("client.onex").debug('>> runOperation: ' + url);
        var response = {};
        var params = 'nocache=' + new Date().getTime();
        this.request =  new Ajax.Request(url ,{method: 'get',
                                                    contentType: "application/xml",
                                                    asynchronous : false,
                                                    parameters: params
                                                    });
        if (this.request != 'undefined' && this.request.transport.status == '200') {
        	xmlDoc = this.getXMLDoc(this.request.transport);
        	response = this._parseResponse(xmlDoc);
        	if (response['ResponseCode'] != 0) {
        	    this.callback.onApplicationErrorHandler(response);
        	}
        } else {
            response['ResponseCode'] = -1;
            this._onFailure();
        }
        $W().LogManager.getLogger("client.onex").debug('>> runOperation: ' + response['ResponseCode']);
        return response;
    },
    getXMLDoc : function (transport) {
        xmlDoc = transport.responseXML.documentElement;
        if (xmlDoc == null) {
            if (transport.responseText != null) {
                if (typeof DOMParser != "undefined") {
                    parser = new DOMParser();
                    xmlDoc = parser.parseFromString(transport.responseText, "text/xml");
                } else {
                    xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
                    xmlDoc.async=false;
                    xmlDoc.loadXML(transport.responseText);
                }
                xmlDoc = xmlDoc.documentElement;
            }
        }
        return xmlDoc;
    },
    /** onSuccess handler **/
    _onSuccess : function(response) {        
        var xmlDoc = this.getXMLDoc(response);
        var methodName = 'on' + xmlDoc.nodeName;
        var params = this._parseResponseAsArray(xmlDoc);
        if (this.methods[methodName]) {
            this.methods[ methodName ].apply( this, Array.prototype.slice.call( params, 0 ));
        }
        this.currentTimer = setTimeout('OneXAgent.nextnotification();', this.pollTimeout);
    },

    /** onFailure handler **/
    _onFailure : function(response) {
        this.callback.onCommunicationErrorHandler(response);
        var status = this.request.transport.status;
        var message = "OneX client failure response, status  " + status;
        var logger = $W().LogManager.getLogger("client.onex");
        logger.error(message);

        /*var waitTime = this['failed' + this.failCount++] + 10;
        if (this.failCount <= 4 && status != 404) {
            debugger;
            this._stopPolling();
            this.currentTimer = setTimeout('OneXAgent.registerclient();', waitTime);
        } else {
            this._stopPolling();
            logger.error('reached max retries, OneX client will be disabled for this session');
        } */
    },

    _parseResponse: function (xmlRoot) {
        return xml2json(xmlRoot);
    },
    _parseResponseAsArray : function (xmlRoot) {
        return xml2array(xmlRoot);
    },
    _notificationHandler : function () {

    },

    _executeRequest : function (url) {
        $W().LogManager.getLogger("client.onex").debug('>> executeRequest: ' + url);
        var params = 'nocache=' + new Date().getTime();
        this.request = new Ajax.Request(url,{method: 'get', contentType: "application/xml",
                                            onSuccess : this._onSuccess.bind(this),
                                            onFailure: this._onFailure.bind(this),asynchronous : false,
                                            parameters : params});
    },

    _prepareRequest : function (operation) {
        var params=null;
        for (var i = 1; i < arguments.length; i=i+2) {
            params = arguments[i] + "=" + arguments[i+1];
        }        
        if (params != null) {
            this.url = this.voiceURL + "/" + operation + "?clientid=" + this.clientid + "&" + params;
        } else {
            this.url = this.voiceURL + "/" + operation + "?clientid=" + this.clientid;
        }
        return this.url;
    },
    /**
    *  This function return response object
    *  Response code
    *  ClientID
    **/
    registerclient : function () {
        this.url = this.baseURL + "/registerclient?name=" + this.clientName;
        var response = this._runOperation(this.url);
        if (response.ResponseCode == 0) {
            this.clientid = response.ClientId;
            this._startPolling();
        }
        return response;
    },
    unregisterclient : function () {
        this._stopPolling();
        this.url = this.baseURL + "/unregisterclient?clientid=" + this.clientid;
        return this._runOperation(this.url);        
    },
    nextnotification : function () {
        this.url = this.baseURL + "/nextnotification?clientid=" + this.clientid;
        this._executeRequest(this.url);
    },
    makecall : function (number) {
        this.url = this._prepareRequest("makecall", "number", number);
        return this._runOperation(this.url);        
    },
    hold : function (interactionid) {
        this.url = this._prepareRequest("hold", "interactionid", interactionid);
        return this._runOperation(this.url);        
    },
    unhold : function (interactionid) {
        this.url = this._prepareRequest("unhold", "interactionid", interactionid);
        return this._runOperation(this.url);        
    },
    mute : function () {
        this.url = this._prepareRequest("mute");
        return this._runOperation(this.url);        
    },
    unmute : function () {
        this.url = this._prepareRequest("unmute");
        var response = this._runOperation(this.url);
        return response;
    },
    accept : function (interactionid) {
        this.url = this._prepareRequest("accept", "interactionid", interactionid);
        return this._runOperation(this.url);        
    },
    release : function (interactionid) {
        this.url = this._prepareRequest("release", "interactionid", interactionid);
        return this._runOperation(this.url);        
    },

    _startPolling : function() {
        this.nextnotification();
    },

    _stopPolling : function() {
        if (this.currentTimer != null) {
            clearTimeout(this.currentTimer);
        }
        if (this.request != null) {
            this.request.transport.abort();
        }
    },

    setCallback : function (callback) {
        this.callback = callback;
    },

    setPollTimeout: function(timeout) {
        this.pollTimeout = timeout;
    }

}

var OneXAgent = new OneXAgentClient();
