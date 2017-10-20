CTIClientAPI = Class.create();

CTIClientAPI.prototype = {
	initialize: function() 
	{
  	}, 
  
  
  	init:function(ctiBarUrl, serverUrl)
	{
		this._initSupportedButtonOperationsMap();
		this._initSupportedControllerActions();
		this.ctiBarUrl = ctiBarUrl;
		if(serverUrl){
			this.url = serverUrl;
		}else{
			this.url = "SYSTEM/portlets/CTI/CTIController.jpf";
		}
	},
	
	notifyScriptUnloaded: function() {
  		var urlParams = "";
		
	  	return this._sendActionToController('notifyScriptUnloaded',urlParams);
    }, 
	
	/**********************************************************/
	//New API for using the CTIClient.js from the outside.
	/**********************************************************/
	/*
	attachData API - This method is responsible for the "attachData" in the controller.
	*/
  	attachDataAPI: function(operation, key, value, id) {
  		var urlParams = "";
		urlParams += this._createUrlParam('operation',operation);
		urlParams += this._createUrlParam('id',encodeURIComponent(id));
		urlParams += this._createUrlParam('key',encodeURIComponent(key));
		urlParams += this._createUrlParam('value',encodeURIComponent(value));		
	  
	  	return this._sendActionToController('attachData',urlParams);
       },     	     
	/*
	doLogout API - This method is responsible for the "doLogout" in the controller.
	*/
  	doLogoutAPI: function() {
  		return this._sendActionToController('doLogout',"");
    },
    
    /*
	doLogin API - This method is responsible for the "doLogin" in the controller.
	* will login the agent to the extension
	*/
  	doLoginAPI: function() {
  		return this._sendActionToController('doLogin',"");
    },
    
    /*
	endDisposition API - This method is responsible for the "endDisposition" in the controller.
	*/
  	endDispositionAPI: function() {
  		return this._sendActionToController('endDisposition',"");
    },
	/*
	finishInit API - This method is responsible for the "finishInit" in the controller.
	*/
  	finishInitAPI: function() {
  		return this._sendActionToController('finishInit',"");
    },     	     
	 
	
	/*
	clickButton API - This method is responsible for the "buttonClicked" in the controller.
	This method activates a controller in server side for performing the given operation.
	Input parameters:
	dn - the relevant number for this operation if exists, relevant only for dial/trnadfer/consult operation.
	location - the relevant location of the dn if exists (relevant for multi-site environment).
	channel - specify a specific channel (voice/customItem)to bound the operation to a specific channel or leave the parameter empty for performing the 	operation on both channels.
	operation -  the relevant operation to perform, this parameter is mandatory.
	*/
	clickButton: function(operation, dn, location, channel) {
		this._validateButtonOperation(operation);		
		var urlParams = "";
		urlParams += this._createUrlParam('operation',operation);
		urlParams += this._createUrlParam('dn',dn);
		urlParams += this._createUrlParam('location',location);
		urlParams += this._createUrlParam('channel',channel);
		
		return this._sendActionToController('clickButton',urlParams);
	}, 
	
    /*
	sendDTMF API - This method is responsible for the "sendDTMF" in the controller.
	*/
  	sendDTMFAPI: function(digits) {
  		var urlParams = "";
		urlParams += this._createUrlParam('digits',digits);
  		return this._sendActionToController('sendDTMF',urlParams);
    },


  /*****************************************************************************
  	Timers API
  ******************************************************************************/
  
  pushSetTimers: function () {
  	this._sendActionToController('pushSetTimers'); 
  },
  
   setTimers: function (param) {
  	this._sendActionToController('setTimers',param); 
  },
  
  /*****************************************************************************
  	DEBUG API
  ******************************************************************************/
 
  _debug: function(msg)
  {             
        $W().LogManager.getLogger("CTIJS").debug(this._getLogHeader() + msg);
  },
  
  _error: function(msg)
  {
        $W().LogManager.getLogger("CTIJS").error(this._getLogHeader() + msg);
  },
  /*****************************************************************************
  	PRIVATE methods API
  ******************************************************************************/
 
   /*
	 This method will map logical operation keys to the operation string as supported in the server-side.
	 The list of supported operations in the server appears in the class CTIControllerSupportedOperations:
	 public static final String ANSWER_OPEN_MEDIA = "answerOpenMedia";
	 public static final String END_OPEN_MEDIA = "endOpenMedia";
	 public static final String END = "end";
	 public static final String ANSWER = "answer";
	 public static final String HOLD = "hold";
	 public static final String HOLD_OFF = "holdOff";
	 public static final String RETURN = "return";
	 public static final String JOIN = "join";
	 public static final String CONSULT = "consult";
	 public static final String HANDSHAKE_TRANSFER = "handshaketransfer";
	 public static final String WARM_TRANSFER = "warmtransfer";
	 public static final String COLD_TRANSFER = "coldtransfer";
	 public static final String TRANSFER = "transfer";
	 public static final String DIAL = "dial";
	 public static final String START = "start";
	 public static final String TRANSFER_FROM_CONSULT = "transferFromConsult";
	 public static final String RETURN_CALL = "returnCall";
	 public static final String COMPLETE_TRANSFER = "completeTransfer";
	 public static final String START_OUTBOUND = "startOutbound";
	 public static final String AFTERCALLWORK = "aftercallwork";
	 public static final String BUSY = "busy";
	 public static final String RESYNC = "resync";
	 public static final String READY = "ready";
	 */    
	_initSupportedButtonOperationsMap: function()
	{   
		this.supportedButtonOperationsMap = {
			answerOpenMediaKey: 'answerOpenMedia',
			endOpenMediaKey: 'endOpenMedia',
			endKey: 'end', 
			answerKey: 'answer', 
			holdKey: 'hold', 
			holdOffKey: 'holdOff', 
			returnKey: 'return', 
			joinKey: 'join', 
			consultKey: 'consult', 
			handshaketransferKey: 'handshaketransfer', 
			warmtransferKey: 'warmtransfer', 
			coldtransferKey: 'coldtransfer', 
			transferKey: 'transfer', 
			dialKey: 'dial',
			startKey: 'start', 
			transferFromConsultKey: 'transferFromConsult',  
			returnCallKey: 'returnCall',
			completeTransferKey: 'completeTransfer', 
			startOutboundKey: 'startOutbound', 
			aftercallworkKey: 'aftercallwork', 
			busyKey: 'busy', 
			resyncKey: 'resync',
			readyKey: 'ready',
			handshaketransferconnectKey: 'handshaketransferconnect', 
			warmtransferconnectKey: 'warmtransferconnect',
			toggleToCustomerKey: 'toggleToCustomer',
			toggleToSuperKey: 'toggleToSuper',
			answerEmailKey: 'answerEmail',
			replyEmailKey: 'replyEmail',
			replyAllEmailKey: 'replyAllEmail',
			forwardEmailKey: 'forwardEmail',
			sendEmailKey: 'sendEmail',
			closeEmailKey: 'closeEmail'
		};
		 
	},
	/*
	This map holds the name of the methods that are supported by our ctiControllerLogic.
	 * pushSetTimers
	 * doLogout
	 * setTimers
	 * endDisposition
	 * finishInit
	 * buttonClicked
	 * attachData 
	*/
	_initSupportedControllerActions: function()
	{   
		this.supportedControllerActionsArray = new Array
		(
		'pushSetTimers',
		'doLogout',
		'setTimers',
		'endDisposition',
		'finishInit',
		'clickButton',
		'attachData',
		'notifyScriptUnloaded',
		'doLogin',
		'sendDTMF'
		);
	}, 
	
	/*
	This method validates that the given buttonOperation appears in the supported button operation list.
	If it doesnt appear, a debug message is logged. (not logging in error mode because a user may extend our controller to support more operations
	*/
	_validateButtonOperation: function(operation)
	{
		if(!this.supportedButtonOperationsMap){
			return;
		}
		for (key in this.supportedButtonOperationsMap) {
			var value = this.supportedButtonOperationsMap[key];
			
			//not going over property in the map that were not built by us
      		if (!(typeof(value)=='string')) continue;
			//checking if the operation is supported (ignore case)
			if(operation.toLowerCase() == value.toLowerCase()){
				//validation succeeded, so exit
				return;
			}
		}
		
		//reached here, so the operation is not supported out of the box
		alert(operation+" NOT validated");
		this._debug("The given operation: "+operation+" is not supported in system level. Supporting the operation should be done in project-level."); 

		
	},
	/*
	This method validates that the given action appears in the supported methodss list.
	If it doesnt appear, a debug message is logged. (not logging in error mode because a user may extend our controller to support more operations
	*/
	_validateControllerOperation: function(operation)
	{
		for (var index =0; index <this.supportedControllerActionsArray.length;index++){
			if (this.supportedControllerActionsArray[index]==operation){
				return;
			}
		}
	
			
		//reached here, so the operation is not supported out of the box
		alert(operation+" NOT validated");
		this._debug("The given operation: "+operation+" is not supported in system level. Supporting the operation should be done in project-level."); 
	},
	/*
	private method for creating url parameters, for example returns &dn=603
	*/
	_createUrlParam: function(keyParam,valParam)
	{
		var urlParam="";
	    if (valParam != null)
	    {
	        urlParam = "&"+keyParam+"=" + valParam;
	    }
	    return urlParam;
	},
	
	/*
	This is the access point to the server
	*/
	_sendActionToController: function(action,urlParams){
		
		this._validateControllerOperation(action);  
     	var pars = 'action='+action;
     	if (urlParams != null) {
     		pars += urlParams;
     	}
     	var msg = "in _sendActionToController: url= "+this.url+"; parameters= " + pars;
     	this._debug(msg);            
    	return new Ajax.Request(this.url, { method: 'get', parameters: pars, asynchronous : false });
		
	},
	
	_getLogHeader: function(){
		return 'CTIClientAPI.js ';
	}
	

}
