

CTIClient = Class.create();

CTIClient.prototype = {
  initialize: function() {
  }, 
  
  init: function() {
  	 this.ctiAPI = $W().ctiAPI;
     this._initCommon();
     this._init();
     overrideCtiInit(this);    
     
     var ctiClientInfo = new Object();
     ctiClientInfo.clientStateName = 'not_initialized'; 
     this.showState(ctiClientInfo);
     
     this.setTimerClassName("");
     this.buildDialListToolbarItem();
     return this.ctiAPI.finishInitAPI();
     
  }, 
  //Should be used when button must be hidden but take place
  //So other item won't move
  setButtonVisibility: function(button, isVisible){
  	if(isVisible){
  		button.removeCls('hiddenButton');
  	}else{
  		button.addCls('hiddenButton');
  	}
  },
  /*
   * Returns false if both lists are empty or if the feature is not enabled by the DialList privilege  
   */
  isDialListEnabled: function(transferImpl){
	  var url = "../../../dialList.json";
      var pars = 'method=isShowDialList&transferImpl=' + transferImpl;
      var request = new Ajax.Request(url, { method: 'get', parameters: pars, asynchronous : false });
      if (request.success()) {
    	  var data = request.transport.responseText;
    	  if(data == "false"){
    		  return false;
    	  }else if(data == "true"){
    		  return true;
    	  }
      }
  },
  
  buildDialListToolbarItem: function() {
	 	_this = this;
	  	var config;
		if($W().toolbarItems['dialListWindow'] == null){
			config = new Object();
			config.id = 'dialListWindow';
			config.tag == "portlet";
			config.portletTitle = 'application.javascript.portlet.label.dialList';
			config.modal = true;
			config.width = 550;
			config.height = 500;
			config.reloadContentOnNextOpen = true;
			config.enablePortletDragging = true;
			config.portletURL = 'SYSTEM/portlets/dialList/dialList.jsp';
			$W().addToolbarItem(config);
			$W().toolbarItems[config.id] = config;
		}else{
			config = $W().toolbarItems[config.id];
		}
		$W().cti.dialList = new Object();
		$W().openDialList = function(transferImpl, action){
			$W().cti.dialList.action = action;
			if(transferImpl != null){
				$W().cti.dialList.transferImpl = transferImpl;
				//WS-3039: Transfer connect doesn't work
				if(transferImpl == 'Connect' && action != 'coldTransfer'){
					$W().cti.dialList.action += 'Connect';
				}
			}else{
				$W().cti.dialList.transferImpl = 'standard';
			}
			if(!_this.isDialListEnabled($W().cti.dialList.transferImpl)){
				$W().cti.onShowDialPadWindow($W().cti.dialList.action);
			}else if($W().toolbarWindows['dialListWindow'] != undefined){
				showPopupWindow(config);
			}
		};
	  },
  
  setOutboundAllow: function(isAllowed) {
    this.outboundCalls = isAllowed;
  },
  
  _initCommon: function() {
     $W().Push.registerEventHandler( 'UpdateCTIClient', this.showState.bind(this));   
     //to allow state machine to save timers
     $W().Push.registerEventHandler( 'saveTimers',         this.saveTimers.bind(this));  
     $W().Push.registerEventHandler( 'callDispositionEnded', this.onDispositionScriptEnded.bind(this)); 
     // circular commands are received back here from the auxilary controller
     $W().Push.registerEventHandler( 'transfer_to', this._onTransferTo.bind(this));
     $W().Push.registerEventHandler( 'consult_to', this._onConsultTo.bind(this));
     $W().Push.registerEventHandler( 'dial_to', this._onDialTo.bind(this));
     //clean error field
     $W().Push.registerEventHandler( 'cleanCTIError', this.cleanError.bind(this));
   
    
    /****************** Client Variables ***********************************/        
    this.ctiOperationInProgress = false;  // when true we block agent operations until the server reply  
    
    this.ctiClientInfo = null;       // store the last info object received from the server    
    this.state = null;               // store the state, for BW compatibility
    this.stateName = "";             // store the stateName, for BW compatibility    
    this.totalCallTime = 0;          // store the total time of all the calls in this session  
    this.totalItemTime = 0;     // store the total time of all the items in this session 
    if (!this.prefferedTransferType)
    {
        this.prefferedTransferType = 'transfer';  // store the meaning of the generic transfer button; use 'transfer' to move decision to server side    
    }
    this.prevStateNameNotCurrent = 'not_initialized';
    /***********************************************************************/        
  
    this._assignButtons();
    this._setRAP();
    this._setButtonsText();
    this._setButtonsHandlers();     
    this._createCallTimers();
    this._createItemTimers();
     
    this.popup = window.createPopup(); //FIREFOX ISSUE
   // Push handlers for the scriptAPI
     /***********************************************************************/        
    // push handlers for CTI activation from script code     
    //most of the handlers already have specific button to bind to, if not a function is used
     $W().Push.registerEventHandler( 'activate_answer',         this.answerBtn.onclick.bind(this));
     $W().Push.registerEventHandler( 'activate_coldTransfer',   this._onPushColdTransfer.bind(this));
     $W().Push.registerEventHandler( 'activate_warmTransfer',   this._onPushWarmTransfer.bind(this));
     $W().Push.registerEventHandler( 'activate_handshakeTransfer',   this._onPushHandshakeTransfer.bind(this));
     $W().Push.registerEventHandler( 'activate_consultation',   this._onCTIButtonClicked.bind(this,'consult'));
     $W().Push.registerEventHandler( 'activate_dial',           this._onCTIButtonClicked.bind(this,'dial'));
     $W().Push.registerEventHandler( 'activate_disconnect',     this.endBtn.onclick.bind(this));
     $W().Push.registerEventHandler( 'activate_hold',           this.holdBtn.onclick.bind(this));
     $W().Push.registerEventHandler( 'activate_holdOff',        this.holdOffBtn.onclick.bind(this));
     $W().Push.registerEventHandler( 'activate_joinConference', this.doConferenceAction.bind(this,'joinCall'));
     $W().Push.registerEventHandler( 'activate_transferFromConsultation', this.doConferenceAction.bind(this,'transferCallFromConsult'));
     $W().Push.registerEventHandler( 'activate_returnFromConsultation', this.doConferenceAction.bind(this,'returnCall'));
     $W().Push.registerEventHandler( 'activate_returnFromWarmTransfer', this.doCompleteTransferAction.bind(this,'returnCall'));
     $W().Push.registerEventHandler( 'activate_completeWarmTransfer', this.doCompleteTransferAction.bind(this,'completeTransfer'));
     $W().Push.registerEventHandler( 'activate_logout',          this.ctiAPI.doLogoutAPI.bind(this.ctiAPI));
     $W().Push.registerEventHandler( 'activate_setAgentStatus', this._onPushSetAgentStatus.bind(this));
     $W().Push.registerEventHandler( 'activate_transfer',       this.doAction.bind(this,'transfer'));
     $W().Push.registerEventHandler( 'activate_acceptCustomItem',         this.answerOpenMediaBtn.onclick.bind(this));
     $W().Push.registerEventHandler( 'activate_releaseCustomItem',         this.endOpenMediaBtn.onclick.bind(this));
     //for transfer connect
     $W().Push.registerEventHandler( 'activate_warmTransferConnect',   this._onPushWarmTransferConnect.bind(this));
     $W().Push.registerEventHandler( 'activate_handshakeTransferConnect',   this._onPushHandshakeTransferConnect.bind(this));
    
     

    
},   
  
  _init: function() {
    this.dialPadWindowHasValidValue = false;
  },
  
  _onReady: function() {
    $W().cti._setCallTimersEnable();
  }, 
  
  _onNotReady: function() {    
  },  
  
  
  onDispositionScriptStarted: function () {
  },
  
  
  
  onDispositionScriptEnded: function () {
    /*if (this.state.inCall==true) {
        $W().cti.startCallDisposition(true);
        $W().ctiAPI.pushSetTimers();
        setTimeout("$W().cti.endDisposition()",400);
    } else {*/
        $W().ctiAPI.pushSetTimers();
        $W().cti.endDisposition();
    //} 
  },
  
 
  /********************************************************************************
   * returns true if the state is some version of disposition
   *********************************************************************************/
	isStateOfDisposition: function(stateName){
		return (stateName.indexOf("disposition") != -1);
	}, 

  addTransferType: function(transferType) { 
    
    var transferTypeFirstLower = (transferType.charAt(0)).toLowerCase() + transferType.substring(1); 
    var transferBtnName = transferTypeFirstLower + 'Btn';
    
    //$(transferBtnName).canBeEnabled = true;  
    if (!this.prefferedTransferType || this.prefferedTransferType == "transfer")
    {
        this.prefferedTransferType = transferTypeFirstLower;    
    }  
    
    
  },


 _createCallTimers: function() {
    this.totalTimer = new Timer('TotalTime');
    this.callTimer = new Timer('CallTime');
    this.holdTimer = new Timer('HoldTime');
    this.wrapupTimer = new Timer('WrapUpTime');
    this.preparationTimer = new Timer(null);
    this.timerID  = setInterval(this.onTimerEvent.bind(this), 1000);         
  },
  
  _createItemTimers: function() {
  
    this.totalItemTimer = new Timer('TotalItemTime');
    this.itemTimer = new Timer('ItemTime');
    
    this.itemTimerID  = setInterval(this.onItemTimerEvent.bind(this), 1000);         
  },


	//this function is for assigining specific validators to the buttons before running their operations
	//al validators will recieve the operation and button as parameters and MUST return true/false
	_assignOnClickValidatorsToButtons: function() {
		this.startBtn.validator=this._onStartClickedValidator;
	},

	_assignOperationsToButtons: function() {
	 	//this map contains pairs of operationKey->button, whereas the keys are mapped to real strings in the CTIClientAPI
	 	//The key had to be a string so it couldnt be button->operationKey
		this.operationToButtonMap = {
			startOutboundKey: this.startOutboundBtn, 
			startKey: this.startBtn,
			answerKey: this.answerBtn,
			endKey: this.endBtn,  
			holdKey: this.holdBtn, 
			holdOffKey: this.holdOffBtn,
			joinKey: this.joinBtn, 
			resyncKey: this.resyncBtn,
			endOpenMediaKey: this.endOpenMediaBtn,
			answerOpenMediaKey: this.answerOpenMediaBtn,
			readyKey: this.readyBtn
		};
		//adding more buttons to the map in case of transerTypes
		if (this.supportMultiTransferTypes == true){
		 this.operationToButtonMap['completeTransferKey'] = this.completeTransferBtn;
		}
		
	
	},

  _assignButtons: function() {
    this.startOutboundBtn = $('StartOutboundBtn');
    this.startBtn = $('StartBtn');
    this.answerBtn = $('AnswerBtn');
    this.endBtn = $('EndBtn');
    //open media buttons
    this.endOpenMediaBtn = $('EndOpenMediaBtn');
    this.answerOpenMediaBtn = $('AnswerOpenMediaBtn');
    this.generalEndBtn = $('GeneralEndBtn');
    this.endPopupBtn = $('EndPopupBtn');
    
    
    this.dialBtn = $('DialBtn');
    this.sendDTMFBtn = $('SendDTMFBtn');
    this.holdBtn = $('HoldBtn');
    this.holdOffBtn = $('HoldOffBtn');
    this.consultBtn = $('ConsultBtn');
    this.joinBtn = $('JoinBtn');
    this.busyBtn = $('BusyBtn');
    this.readyBtn = $('ReadyBtn');    
    this.resyncBtn = $('ResyncBtn');
    this.consultPopupBtn = $('ConsultPopupBtn');
    //we have one transfer type
     this.transferBtn = $('TransferBtn');
    // this.rightTransferBtn = $('rightTransferBtn');
    if ($('TransferPopupBtn')) { 
       this.transferPopupBtn = $('TransferPopupBtn');
        this.supportMultiTransferTypes = true;
        this.completeTransferBtn = $('CompleteTransferBtn');
    } else{     
        this.supportMultiTransferTypes = false;
    }
         
    //only if soft return is enabled do we define the buttons.
    if (UserCTIRoles.CTIEnableSoftReturnButton) {
    	this.consultToggleToSuperBtn = $('ConsultToggleToSuperBtn');
    	this.warmTransferToggleToSuperBtn = $('WarmTransferToggleToSuperBtn');
    }
    
    // note the datasource name was changed (no {}), and so was the element name...
    this.combo = $('pageFlow.callerId');
  },
  
  _setRAP: function() {
    this.startOutboundBtn.allowed = UserCTIRoles.CTIStartOutboundCallUser;    
    this.startBtn.allowed         = UserCTIRoles.CTIBasicUser;
    this.answerBtn.allowed        = UserCTIRoles.CTIStartUser; // xxx add answer role?
    this.endBtn.allowed           = UserCTIRoles.CTIBasicUser;
    //open media buttons
    this.endOpenMediaBtn.allowed = UserCTIRoles.CTIEndUser; // xxx add end open media role?
    this.answerOpenMediaBtn.allowed = UserCTIRoles.CTIStartUser; // xxx add answer open media role?
    this.generalEndBtn.allowed  = UserCTIRoles.CTIStartUser;// xxx add
    this.endPopupBtn.allowed  = UserCTIRoles.CTIStartUser;// xxx add
    this.endPopupBtn.canBeEnabled = true;
    
    this.transferBtn.allowed      = UserCTIRoles.CTITransferUser;
   
    
    this.dialBtn.allowed          = UserCTIRoles.CTIDialUser;
    this.holdBtn.allowed          = UserCTIRoles.CTIHoldUser;
    this.holdOffBtn.allowed       = UserCTIRoles.CTIHoldUser;
    this.consultBtn.allowed       = UserCTIRoles.CTIConsultUser;
    this.joinBtn.allowed          = UserCTIRoles.CTIConsultUser;
    this.busyBtn.allowed          = UserCTIRoles.CTIBusyReadyUser;
    this.readyBtn.allowed         = UserCTIRoles.CTIBusyReadyUser;
    //for knowing how large the join-popup should be we check if transfer is allowed from vonsult
    this.transferAllowedFromConsult         = UserCTIRoles.CTITransferAllowedFromConsult;
    // xxx fix this - add role for resync user
    this.resyncBtn.allowed        = true;
    this.consultPopupBtn.allowed  = UserCTIRoles.CTIConsultUser;


   
    
    this.dialBtn.canBeEnabled = true; //dialBtnCanBeEnabled;
    this.consultPopupBtn.canBeEnabled = true; //consultBtnCanBeEnabled;
    if (this.supportMultiTransferTypes == true){
    this.transferPopupBtn.allowed  = UserCTIRoles.CTIConsultUser;
        this.transferPopupBtn.canBeEnabled = true; //consultBtnCanBeEnabled;
        this.completeTransferBtn.allowed      = UserCTIRoles.CTITransferUser;
    }

  },
  
    
  /***********************************************************************************
  PUSH Handlers for the pushAPI
  ************************************************************************************/



  _onPushLogin: function(param) {
    // not implemented
  },


  _onPushSetAgentStatus: function(param) {
    //checking if we got a reason
    //separate status and reason because when there is a reason the sent string will look like this: myStatus|myReasonCode
    var seperator ='|';
    var seperatorPos = param.indexOf(seperator);
    var reason = null;
    if  (seperatorPos != -1) {
        var reasonLength = param.length - (seperatorPos+1);
        reason = param.substr(seperatorPos+1, reasonLength);
        param = param.substr(0,seperatorPos);
        
    }
    if(param == 'ready') {
        this.readyBtn.click();
    }
    else if(param == 'notready') {
        //only on busyClicked  we currently use the reason
        this.busyBtn.onclick(reason);
    }
  },
  
  
  _onPushWarmTransfer: function(param) {
     //allow warm transfer from scriptAPI only if the "transfer" button is enabled
     if (this._buttonDisabled('transfer'))
    {
        return;
    }
    
    this.doAction('warmTransfer', param);
  },
  
  
  _onPushColdTransfer: function(param) {
    //allow cold transfer from scriptAPI only if the "transfer" button is enabled
     if (this._buttonDisabled('transfer'))
    {
        return;
    }
    this.doAction('coldtransfer', param);
  },
  
  _onPushHandshakeTransfer: function(param) {
    //this._onCTIButtonClicked('handshakeTransfer', param);
    //allow handshake transfer from scriptAPI only if the "transfer" button is enabled
     if (this._buttonDisabled('transfer'))
    {
        return;
    }
    this.doAction('handshakeTransfer', param);
  },

 _onPushWarmTransferConnect: function(param) {
     //allow warm transfer from scriptAPI only if the "transfer" button is enabled
     if (this._buttonDisabled('transfer'))
    {
        return;
    }
    this.selectedTransferImpl = 'Connect';
    this.doAction('warmTransferConnect', param);
  },
 
 _onPushHandshakeTransferConnect: function(param) {
    //allow handshake transfer from scriptAPI only if the "transfer" button is enabled
     if (this._buttonDisabled('transfer'))
    {
        return;
    }
    this.selectedTransferImpl = 'Connect';
    this.doAction('handshakeTransferConnect', param);
  },
 
  

  
  _setButtonsHandlers: function() {
 	/*******
 	The regular use case is that every button is mapped to a supported operation. 
 	Add to this section buttons that are mapped to operations - These buttons onClick will perform the operation (due to the "for" loop following this section. 
 	*********/ 
 	this._assignOperationsToButtons();
    this._assignOnClickValidatorsToButtons();
  	//assigning all the buttons that were mapped to supported operations to run using the ctiAPI
	for (key in this.operationToButtonMap) {
		//if the operation is supported by the CTIAPI
		var supportedOp = this.ctiAPI.supportedButtonOperationsMap[key];
		if (supportedOp != null){
			//assign to each button a new property called operation which is the string operation axpected in the ctiAPI
			var button = this.operationToButtonMap[key];
			/*
			IMPORTAND NOTE: using "bind" and not "bindAsEventListener" since in the prototype version we are using 
			"bind" passes parameters to the handler wheras "bindAsEventListener" passes the event but not parameters
			*/
			button.onclick = this._handleButtonWithOperationClicked.bind(this,supportedOp,button);	
		}
	}
  	
  	
	
	
	/****
	special cases: 
	this cases ca be one of the following:
	1. the button has special logic
	2.The button initiates a UI thing and not an operation to the server
	****/
	//1.buttons that open popup with options
	this.dialBtn.onclick = this._onCTIOptionButtonClicked.bind(this,'dial');
	if(this.sendDTMFBtn != null){
		this.sendDTMFBtn.onclick = this.onShowDialPadWindow.bind(this,'sendDTMF');
	}
	this.transferBtn.onclick = this._onTransferClicked.bind(this,'transfer');
	this.consultBtn.onclick = this._onCTIOptionButtonClicked.bind(this,'consult');
	//2.special cases
	this.combo.onselected = this.startBtn.onclick;
    if (this.supportMultiTransferTypes == true){
        this.transferPopupBtn.onclick = this._onTransferPopupClickedEx.bindAsEventListener(this);
    }
    this.endPopupBtn.onclick = this._onEndPopupClicked.bindAsEventListener(this);
    this.generalEndBtn.onclick = this._onEndPopupClicked.bindAsEventListener(this);
    this.busyBtn.onclick = this._onBusyClicked.bindAsEventListener(this);
    this.consultPopupBtn.onclick = this._onConsultPopupClicked.bindAsEventListener(this);
    //assign handler only if soft return (toggle) is enabled.
    if (UserCTIRoles.CTIEnableSoftReturnButton) {
    	this.consultToggleToSuperBtn.onclick = this._onToggleToSuperClicked.bindAsEventListener(this);
    	this.warmTransferToggleToSuperBtn.onclick = this._onToggleToSuperClicked.bindAsEventListener(this);
    }
         
    },
    
   getButtonText: function(btnId, textKey, fullKey) {
    	//if the given key is the full path use it
    	if (fullKey != null && fullKey == true) {
    		return $W().localeManager.getLocalizationValue(textKey);
    	}
    	//otherwise use the default prefix for cti buttons
    	var completeTextKey = 'application.javascript.ctiButtonsBar.label.'+textKey;
        return $W().localeManager.getLocalizationValue(completeTextKey);  
    },
  

  _setButtonsText: function() {
        
    this.startOutboundBtn.childNodes[0].childNodes[0].innerHTML = this.getButtonText('startOutboundBtn', 'startWithShort');  
    this.startBtn.childNodes[0].childNodes[0].innerHTML = this.getButtonText('startBtn', 'startWithShort'); 
    this.answerBtn.childNodes[0].childNodes[0].innerHTML = this.getButtonText('answerBtn', 'answerWithShort'); 
    this.endBtn.childNodes[0].childNodes[0].innerHTML = this.getButtonText('endBtn', 'endCallWithShort'); 
    this.answerOpenMediaBtn.childNodes[0].childNodes[0].innerHTML = this.getButtonText('answerOpenMediaBtn', 'answerWithShort'); 
    this.endOpenMediaBtn.childNodes[0].childNodes[0].innerHTML = this.getButtonText('endOpenMediaBtn', 'endItemWithShort'); 
    this.generalEndBtn.childNodes[0].childNodes[0].innerHTML = this.getButtonText('generalEndBtn', 'endWithShort'); 
    this.transferBtn.childNodes[0].childNodes[0].innerHTML = this.getButtonText('transferBtn', 'transfer'); 
    if (this.supportMultiTransferTypes == true){
       // this.rightTransferBtn.style.display = 'none';
        //this.transferBtn.childNodes[0].childNodes[0].style.width = '88px';
        this.completeTransferBtn.childNodes[0].childNodes[0].innerHTML = this.getButtonText('completeTransferBtn', 'completeTransfer'); 
    }     
    this.joinBtn.childNodes[0].childNodes[0].innerHTML = this.getButtonText('joinBtn', 'joinWithShort'); 
    this.consultBtn.childNodes[0].childNodes[0].innerHTML = this.getButtonText('consultBtn', 'confWithShort'); 
    this.holdBtn.childNodes[0].childNodes[0].innerHTML = this.getButtonText('holdBtn', 'holdWithShort'); 
    this.holdOffBtn.childNodes[0].childNodes[0].innerHTML = this.getButtonText('holdOffBtn', 'offholdWithShort'); 
    this.dialBtn.childNodes[0].childNodes[0].innerHTML = this.getButtonText('dialBtn', 'dialWithShort');
    if(this.sendDTMFBtn != null){
    	this.sendDTMFBtn.childNodes[0].childNodes[0].innerHTML = this.getButtonText('sendDTMFBtn', 'sendDTMFWithShort');
    }
    this.busyBtn.childNodes[0].childNodes[0].innerHTML = this.getButtonText('busyBtn', 'busyWithShort'); 
    this.readyBtn.childNodes[0].childNodes[0].innerHTML = this.getButtonText('readyBtn', 'readyWithShort'); 
    this.resyncBtn.childNodes[0].childNodes[0].innerHTML = this.getButtonText('resyncBtn', 'reconnect');
    //check if soft return is enabled before setting the button text (otherwise the buttons do not exist)
    if (UserCTIRoles.CTIEnableSoftReturnButton) {
    	this.consultToggleToSuperBtn.childNodes[0].childNodes[0].innerHTML = this.getButtonText('consultToggleToSuperBtn', 'toggleToSuper');
        this.warmTransferToggleToSuperBtn.childNodes[0].childNodes[0].innerHTML = this.getButtonText('warmTransferToggleToSuperBtn', 'toggleToSuper');
    }
  },
  
  
 
  
  

  /***********************************************************************************
  PRIVATE METHODS
  ************************************************************************************/
//THIS is the main function that runs when clicking a button that is mapped to a supported operation
	_handleButtonWithOperationClicked:function(op, button){
	 	//we dont run the operation when there a validator exists and failed 
		if(button.validator && button.validator(op,button)==false){
			return;
		}
		//send a dn if the button is related ot one
		if(button.dn && button.dn != ''){
			return this._onCTIButtonClicked(op, button.dn);
		}
		
		return this._onCTIButtonClicked(op);
		
	},
   
  _onStartClickedValidator: function(op,button) { 
  	 if(button.btnDisabled)
    {
        return false;
    }    
    var value = $F('pageFlow.callerId');

    var validated = false;
    if (value != null) {
      if (value.length == 7) {
        if (!isNaN(value)) {
          var objRegExp  = /(^(\-|\+)?\d\d*$)/;
          validated = objRegExp.test(value);
        }
      }
    }
        
    if (!validated) {
      alert ($W().localeManager.getLocalizationValue('application.javascript.ctiButtonsBar.alert.illegalCallId'));
      return false; 
    }
    //attach the dn to the button
    button.dn = value;
    return true;
  },
 
  
  
  _checkReasonExists: function(reason) {
    var DEFAULT_OBJECT_VALUE = '[object]';
    if (reason != null && reason != '' && reason != DEFAULT_OBJECT_VALUE) {
        return true;
    }
    return false;
  },
  _onBusyClicked: function(reason) {
  
    //if there is a reason pass with a reason other wise as usual
    if (this._checkReasonExists(reason) == true) {
        this._onCTIButtonClicked('busy', reason);
        return;
    }
    //open reason list when a reason wasnt given and such a list exists
     if (__use_busy_code_list__) // global variable, defined in index.jsp
    {
        this._onCTIOptionButtonClicked('busy');
    }
    else
    {
       this._onCTIButtonClicked('busy');
    }
  },  


  _onToggleToSuperClicked: function() {
	  
	  this.doAction('toggleToSuper');	  	  
  },
  
  _onToggleToCustomerClicked: function() {
	  
	  this.doAction('toggleToCustomer');	  	  
  },
 _onTransferClicked: function(type) {  
    if(UserCTIRoles.CTITransferConnectAllowed) {
        this._onMainTransferPopupClicked();
    }
    else{       
        this._onCTIOptionButtonClicked('transfer'); //this.prefferedTransferType);    
    }
  },

  _onCTIOptionButtonClicked: function(operation) {
     
     if (this._buttonDisabled(operation))
    {
        return;
    }
     
    $('ErrorStatus').innerHTML = "";
    $('ErrorStatus').title = "";
     
    this.showOutboundNumbers(this[operation + 'Btn'], operation);
  },
  
  
  // dn can be null if not needed
  _onCTIButtonClicked: function(operation, dn, location) {
    if (this._buttonDisabled(operation))
    {
        return;
    }
    //for multi channel
    var channel = this._getButtonChannel(operation);
    // remove last error status, but only in case this is not manual mode
    if (!this.isManualMode()) {
    	$('ErrorStatus').innerHTML = "";
    	$('ErrorStatus').title = "";
    }
    
    return this.ctiAPI.clickButton(operation,dn,location, channel); 
  },


_buttonDisabled: function(operation) {
    if (this.ctiOperationInProgress)
    {
        return true;
    }
    
    var button = $(operation + 'Btn');
    if (!button)
    {
        alert('error in _buttonDisabled; button not found: ' + operation + 'Btn');
        return true;
    }
    
    if (button.enabled == false || button.btnDisabled == true || button.allowed == false)  
    {
        var msg = 'The operation '+operation +' cannot be executed because the '+operation+' button is currently disabled.';
        this.ctiAPI._error(msg);
        //activating the user's handler
        this.ctiClientErrorHandler(this.ctiClientInfo, msg);
        return true;                
    }
    
    return false;
  },


  changeButtonState: function(element, newState) {
        var btn = document.getElementById("middle" + element.id);
        if (btn != null) {
            btn.className = "button middle" + newState;
        }
  },
  
   _setEnabledDisabled: function(element, isEnabled) {       
        if (element.canBeEnabled==null) {
            element.canBeEnabled=true;
        }
        element.btnDisabled = !isEnabled || !element.canBeEnabled;
        if (element.btnDisabled) {            
            if (element.className.indexOf("popUpButton") == 0) {
                element.className = "popUpButtonDisabled";
            } else {
                this.changeButtonState(element, "Disabled");
            }
        } else {
            if (element.className.indexOf("popUpButton") == 0) {
                element.className = "popUpButton";
            } else {
                element.className = "def";
                this.changeButtonState(element, "");
            }
        }     
  },  
     
   _changePhoneStatus: function(txt, txtClass) {
     if(txt != null) {
        $('PhoneStatus').innerHTML = txt;
        $('PhoneStatus').title = txt;
     }
     
     if(txtClass != null) {
        $('PhoneStatus').className = txtClass;
     }
  },

  
  //transfer operation with attaching data
_onTransferWithAttachedDataClicked: function(operation, dn, key,value, location) {
   
    this._onStoreAttachDataForConsultOperation(key,value);
    this.doAction(operation, dn, location);

},
  /********************************************************************************
   * show the CTI UI according to the ctiClientInfo object received from the server
   *********************************************************************************/
  showState: function(ctiClientInfo) { 
    var clientStateName = ctiClientInfo.clientStateName; 
    if(this.ctiClientInfo != null){
        var prevStateName = this.ctiClientInfo.clientStateName;
        var prevIsInSemiManual = this.ctiClientInfo.isInSemiManual;
    }
    
     if(this.ctiClientInfo != null && this.ctiClientInfo.clientStateName != "current"){
        this.prevStateNameNotCurrent = this.ctiClientInfo.clientStateName;
    }
    
    this.ctiClientInfo = ctiClientInfo;  
    
    // handle busy/ready
    var busy = this.ctiClientInfo.bBusy;
    
    //in case we are in outbound mode, override "busy" as "ready", and disable the button
    //the indication this.startOutboundBtn.allowed is not good need a different flag
    if (this.outboundCalls == true) {
        busy = false;
        this.busyBtn.canBeEnabled = false;
    }
    
    if(!($("ReadyBtn").btnDisabled && 
         $("BusyBtn").btnDisabled &&
         clientStateName == "current" ))
    {//change busy\ready button only if not manual
        if (busy)
        {   
            this.readyBtn.style.display = 'inline';
            this.busyBtn.style.display = 'none';
            this._setEnabledDisabled(this.readyBtn, true);
            this._setEnabledDisabled(this.busyBtn, false);
        }
        else
        {
            this.readyBtn.style.display = 'none';
            this.busyBtn.style.display = 'inline';
            this._setEnabledDisabled(this.readyBtn, false);
            this._setEnabledDisabled(this.busyBtn, true);
        }
    }
    
    // in ringing, disable both ready & busy buttons
    if (ctiClientInfo.clientStateName == "ringing" ||
        ctiClientInfo.clientStateName == "inwork_dialing" ||
        ctiClientInfo.clientStateName == "inwork_incall" ||
        ctiClientInfo.clientStateName == "inwork_inhold" ||
        ctiClientInfo.clientStateName == "internal_ringing" ||
        ctiClientInfo.clientStateName == "cold_transfer_in_progress" ||
        ctiClientInfo.clientStateName == "warm_transfer_in_progress" ||
        ctiClientInfo.clientStateName == "consult_in_progress" ||
        //In state In Call - Soft Return all buttons should be disabled, including 
        //Busy/Ready
        ctiClientInfo.clientStateName == "inconsultation_toggle" ||
        ctiClientInfo.clientStateName == "in_warm_transfer_consultation_toggle")
    {
        this._setEnabledDisabled(this.readyBtn, false);
        this._setEnabledDisabled(this.busyBtn, false);
    }
        
      
    // show the error status received from the server, if there is one
    var errorMsg = this.ctiClientInfo.errorMessage;
    var errMsgParam = this.ctiClientInfo.errorMessageParam;
    // special case - in case the previsous state was semiManual we clear the error. 
    // This covers some end-cases when the login API does not clear the error
    if((errorMsg == null || errorMsg == "") && (clientStateName != 'current')){
    	this.cleanError();
    }
    if (errorMsg != null && errorMsg != "")
    {
    	$('ErrorStatus').innerHTML = $W().localeManager.getLocalizationValue(errorMsg);
    	if(errMsgParam != null && errMsgParam !=""){
    		$('ErrorStatus').innerHTML += errMsgParam;
    	}
    		
        $('ErrorStatus').title = $('ErrorStatus').innerHTML;
        this.ctiClientErrorHandler(ctiClientInfo, errorMsg);
    }
    
    //settings the busy reason even if the state name hasn't changed
    this._handleReasonCodeInfo(ctiClientInfo);
         
    
      
    // if no need to change current state, just ready/busy
    if (ctiClientInfo.clientStateName == "current")
    {
        return;    
    }
    
    this.state = CTIClient.states[clientStateName];    
    this.stateName = clientStateName;

    if (!this.state)
    {        
        alert('unexpected state: ' + clientStateName);
        return;
    }    
    
    
    this._setCanBeEnabled(this.transferBtn, this.ctiClientInfo.hasTransferInfo);
    if (this.supportMultiTransferTypes == true){
        this._setCanBeEnabled(this.transferPopupBtn, this.ctiClientInfo.hasTransferInfo);
    }
    //this._setCanBeEnabled(this.dialBtn, this.ctiClientInfo.hasDialInfo);
    this._setCanBeEnabled(this.consultBtn ,this.ctiClientInfo.hasConsultInfo);
    this._setCanBeEnabled(this.consultPopupBtn, this.ctiClientInfo.hasConsultInfo);  
    
    
    for (var name in this.state) {
        
        var element = $(name);
        if (element != null) {
	        if(this.state[name].visible != null){
	        	//Handle the DTMF and the dial buttons separately
            	//(Implemented here and not in ctiStates since the DTMF feature can be disabled while dial operation isn't)
	        	if(element.id == 'SendDTMFBtn' || element.id == 'DialBtn'){
	        		this.handleDialDTMFButtons(element, this.state);
	        	//Handle other cases
	        	}else if (this.state[name].visible) {
	                element.style.display = 'inline';
	            } else {
	                element.style.display = 'none';
	            }
	            this._setEnabledDisabled(element, this.state[name].enabled);  
	        }   
        }
        
    }
    
    
    this._handleTimers(); 
    if(this.isStateOfDisposition(this.prevStateNameNotCurrent) &&
		!this.isStateOfDisposition(clientStateName) &&
		this.prevStateNameNotCurrent != clientStateName) {
		
		this.saveTimers();
	}  
            
    var status = this.state.status;
    if(status != null) {
            this._changePhoneStatus(status.text, status.clss);
    }
    
    this._handleConstMessage(this.state);
   
    
    var logout = this.state.logout;
    var stateAllowLogout = false;
    if(logout != null && logout.visible != null) {
        $W().showLogout( logout.visible );
        stateAllowLogout = logout.visible ? true : false;
    }    
    $W().handleCTILoginLogoutLink(this.ctiClientInfo.isDisplayCTILoginLinks,this.ctiClientInfo.isInSemiManual,stateAllowLogout);
    
    $('TotalItemNumber').innerHTML = this.ctiClientInfo.numberOfCustomItems;
     $('TotalCallNumber').innerHTML = this.ctiClientInfo.numberOfCalls;
     $('RtnTxt').innerHTML = this.ctiClientInfo.callId;
   
   
    // show/hide the RTN combo    
    var rtnCombo = this.state.rtnCombo;
    if(rtnCombo != null && rtnCombo.active ) {        
        $('RtnCombo').style.display = 'inline';                
        $('RtnTxt').style.display = 'none';
        $('RtnCombo').btnDisabled = false;        
        /*
        if (rtnCombo.enabled == true)
        {
            $('RtnCombo').btnDisabled = false;        
        }
        else
        {
           $('RtnCombo').btnDisabled = true;        
        }
        */
    }
    else
    {
        $('RtnCombo').style.display = 'none';       
        $('RtnTxt').style.display = 'inline';
    }
        
    
    // run custom functions that appear in the 'functionsToRun' property, e.g. functionsToRun: { function1: "_removeAddContent"}
        
    var functionsToRun = this.state.functionsToRun;    
    
    if(functionsToRun != null) {
        for (var i=1; functionsToRun["function" + i] != null ; i++)
        {
            var funcName = functionsToRun["function" + i];
            if (cti[funcName] != null)
            {                
                cti[funcName]();
            }
            else
            {
                alert('CTIClient.js: functionsToRun - function not found: ' + funcName);
            }
        }
    }        
        
    if (this.onstatechanged != null) {
       this.onstatechanged(this.state);
    }  
    
    //last but not least
    //this._handleTimers();       
  },
  
  //This method handles the dial and DTMF buttons visibility 
  //In case the DTMF button is visible the dial button becomes hidden
  //With this implementation the buttons in the CTIStates can appear in any order
  handleDialDTMFButtons: function(element, state){  
	  if(element.id == 'DialBtn'){
		  //Send DTMF is enabled and visible
		  if($('sendDTMFBtn')!= null && state['sendDTMFBtn'].visible){
			  element.style.display = 'none';
		  //Send DTMF is disabled or not visible and dial button is visible	  
		  }else if(state['dialBtn'].visible){
			  element.style.display = 'inline';
		  }else{
			  element.style.display = 'none';
		  }
	  }else if(element.id == 'SendDTMFBtn'){
		  //Send DTMF is enabled and visible
		  if(state['sendDTMFBtn'].visible){
			  element.style.display = 'inline';
			  $('dialBtn').style.display = 'none';
		  }else{
			  element.style.display = 'none';
		  }
	  }
  },

  
  // *******************************
  //This method is responsible for displaying the relevant reason code information when relevant
  _handleReasonCodeInfo: function(ctiClientInfo){
	var displayText = '';
  	if (!$('auxReason')){
  		return;
  	}
  	$('auxReason').innerHTML = ''; 
    if ((ctiClientInfo.clientStateName == 'current' && this.stateName == 'notready') || (ctiClientInfo.clientStateName == 'notready') ){
	    if(ctiClientInfo.reasonCode &&  ctiClientInfo.reasonCode.length > 0) {
	    	
	    	//display code
	    	displayText = ctiClientInfo.reasonCode;
	    	
	    	//check if name exists, and if so - display it
	    	if(ctiClientInfo.reasonCodeInfo &&  ctiClientInfo.reasonCodeInfo.length > 0) {
	    		
	    		displayText = displayText+	" - " +ctiClientInfo.reasonCodeInfo;	    		
	    	}
	    	
	    	$('auxReason').innerHTML = displayText;	    	
	    }            
          
            
    }   
  },
  
  _handleTimers: function() {
    // reset timers that the server asked to reset
    
    var date = new Date();        
    
    if (this.ctiClientInfo.resetCallTimer == true)
    {
        this['callTimer'].reset(date); 
    }
    if (this.ctiClientInfo.resetHoldTimer == true)
    {
        this['holdTimer'].reset(date); 
    }
    if (this.ctiClientInfo.resetWrapupTimer == true)
    {
        this['wrapupTimer'].reset(date); 
    }
    if (this.ctiClientInfo.resetPreparationTimer == true)
    {
        this['preparationTimer'].reset(date); 
    }
    
    // start/stop/reset timers according to cti client state
    
    this._handleCTITimer('totalTimer', date);
    this._handleCTITimer('callTimer', date);
    this._handleCTITimer('holdTimer', date);    
    this._handleCTITimer('wrapupTimer', date);
    this._handleCTITimer('preparationTimer', date);  
    this._handleCTITimer('totalTimer', date);
    this.onTimerEvent();
    
    this._handleItemCTITimer('itemTimer', date);
    this._handleItemCTITimer('totalItemTimer', date);
    this.onItemTimerEvent();
    
    // if needed, compute AHT etc. (e.g. when call ends)
    if (this.state.summarizeTimers != null && 
        this.state.summarizeTimers.active  == true)
    {        
        this._summarizeTimersAfterCall(date);
    }
  },
  
  _handleConstMessage: function(state) {
   // show the state-related error message, e.g. "Not connected to CTI" for manual modes
    var constStatus = state.constantMessage;   
    var constStatusText = "";
    if (constStatus != null && constStatus.text != null)
    {
        constStatusText = constStatus.text;
    } 
    $('ConstantStatus').innerHTML = constStatusText; 
    
    
    //show title of the constantmessage if exists    
    if (state.constantMessageTitle != null && state.constantMessageTitle.text != null)
    {
        $('ConstantStatus').title = state.constantMessageTitle.text;
    }
    else{ 
        $('ConstantStatus').title = constStatusText;  
    }
    if (constStatusText != "")
    {    
        $('ConstantStatus').className = constStatus.clss;   
    }
  },
  
 
  
  _updateItemAHT: function() {
  if(this.ctiClientInfo.numberOfCustomItems == null)
  {
    //alert('this.ctiClientInfo.numberOfCustomItems is null please init...');
    this.ctiClientInfo.numberOfCustomItems = 1;
  }
    if (this.ctiClientInfo.numberOfCustomItems == 0) {
      $('AHT').innerHTML = '00:00:00';
    } else {
      var avg = this.totalItemTime / this.ctiClientInfo.numberOfCustomItems;
      avg = Math.round( avg / 1000);
      $('AHT').innerHTML = getTimeString(avg);
    }    
  },
  
  _updateAHT: function() {    
	  if (this.ctiClientInfo.numberOfCalls == undefined ||this.ctiClientInfo.numberOfCalls == 0) {
      $('AHT').innerHTML = '00:00:00';
    } else {
      var avg = this.totalCallTime / this.ctiClientInfo.numberOfCalls;
      avg = Math.round( avg / 1000);

      $('AHT').innerHTML = getTimeString(avg);
    }    
  },
  
  _handleItemCTITimer: function(timerName, date) {
    if(this.state["itemState"] != null){
        this._handleCTITimer(timerName, date);
    }
    
  },
  
  _handleCTITimer: function(timerName, date) {
    var timerData = this.state[timerName];
    if (!timerData)
    {
        alert('timer data not found: ' + timerName + ' in state: ' + this.stateName);
        return; 
    }
    
    if (timerData.reset == true)
    {
        this[timerName].reset(date);       
    }    
    
    this[timerName].stop(date);           
    if (timerData.active == true)
    {
        this[timerName].start(date);       
    }    
  },
    
  onItemTimerEvent: function() {
   
     var date = new Date()

     this.itemTimer.showTime(date);
     
     
     var elapsedSecs = this.itemTimer.getElapsedTime(date) ; 
     
     this.totalItemTimer.elapsedSecs = elapsedSecs;
     this.totalItemTimer.showTime(date);
  },

  onTimerEvent: function() {
     var date = new Date()

     this.callTimer.showTime(date);
     this.holdTimer.showTime(date);
     this.wrapupTimer.showTime(date);
     this.preparationTimer.showTime(date); 
     
     
     var elapsedSecs = this.callTimer.getElapsedTime(date) +
                       this.holdTimer.getElapsedTime(date) +
                       this.wrapupTimer.getElapsedTime(date) +
                       this.preparationTimer.getElapsedTime(date); 
     
     this.totalTimer.elapsedSecs = elapsedSecs;
     //this.totalTimer.showTime(date);
	 this.totalTimer.showElapsedSecs(date);
  },
    
  _onTransferTo: function(dn, transferType, location) {    
    
    if(dn != null) {
        if (!transferType || transferType == "")
        {    
            this._doOperationWithDn(this.prefferedTransferType, dn, location);
        }
        else
        {
            this._doOperationWithDn(transferType, dn, location);
        }
    }
  },

  _onConsultTo: function(param, location) {
    if(param != null) {
      this._doOperationWithDn('consult', param, location);
    }
  },

  _onDialTo: function(param, location) {
    if(param != null) {        
        this._doOperationWithDn('dial', param, location);
    }    
  },
  
  _onAttachData: function(key, value, id) {
    if(key != null && value != null) {        
        this.ctiAPI.attachDataAPI('attachData', key, value, id);
    }    
  },
  
   _onDeleteAttachData: function(key, id) {
    if(key != null) {        
        this.ctiAPI.attachDataAPI('deleteAttachData', key, "", id);
    }    
  },
  
   _onStoreAttachDataForConsultOperation: function(key, value) {
    if(key != null && value != null) {    
        this.ctiAPI.attachDataAPI('storeAttachData', key, value);
    }    
  },
  _doOperationWithDn: function(operation, dn, location) {
    var channel = this._getButtonChannel(operation);
    return this.ctiAPI.clickButton(operation, dn, location, channel);
  },
  
  
  _setCanBeEnabled: function(element, isEnabled) {
      element.canBeEnabled = isEnabled;
      if (this.state[element.id] != null) {
         this._setEnabledDisabled(element,(isEnabled && this.state[element.id].enabled));
      } 
  },  
  
  _getButtonChannel: function(operation){
    var button = operation+"Btn";
    if (this.state[button] != null && this.state[button].channel != null)
    {
        return this.state[button].channel;
    }
    return null;
  },

_removeAddContent : function() {
    parent.removeAddContent();
} ,



saveTimers: function() {      
     var date = new Date();
     
 
      var elapsedTime = this.callTimer.getTotalTime() +
                       this.holdTimer.getTotalTime() +
                       this.wrapupTimer.getTotalTime() +
                       this.preparationTimer.getTotalTime(); 
     
     this.totalCallTime += elapsedTime;
	 
     this._updateAHT();

     var parm = '&callTimer=' + this.callTimer.getElapsedTime(date);
     parm    += '&holdTimer=' + this.holdTimer.getElapsedTime(date);
     parm    += '&wrapupTimer=' + this.wrapupTimer.getElapsedTime(date);
     parm    += '&preparationTimer=' + this.preparationTimer.getElapsedTime(date); 
     parm    += '&totalCalls=' + this.ctiClientInfo.numberOfCalls;
     parm    += '&totalCallTime=' + Math.round(this.totalCallTime / 1000);
     parm    += '&last=';

     this.ctiAPI.setTimers(parm); 
     this.callTimer.updateColor();
     this.holdTimer.updateColor();
     this.wrapupTimer.updateColor();
     this.totalTimer.updateColor();
  },
  
  saveItemTimers: function() {  
     
     var date = new Date();
     
     //this._summarizeItemTimersAfterCall(date);

     //var elapsedSecs = this.itemTimer.getElapsedTime(date) ; 
     var elapsedSecs = this.itemTimer.getTotalTime();
     this.totalItemTime += elapsedSecs;
     this._updateItemAHT();

     /*no need to send to server since it is not saved on the server side
      * var parm = 'itemTimer=' + this.itemTimer.getElapsedTime(date); 
     parm    += '&totalItems=' + this.ctiClientInfo.numberOfCustomItems;
     parm    += '&totalItemTime=' + this.totalItemTime;
     parm    += '&last=';
     
     this._makeAction('setItemTimers', parm, false)*/; 
  },

///////////////////////////////////////////////////////////////////////////////////////
  
  
  
  _stopTimers: function(date) {
     this.totalTimer.stop(date);
     this.callTimer.stop(date);
     this.holdTimer.stop(date);
     this.wrapupTimer.stop(date);
     this.preparationTimer.stop(date);
     
     this.onTimerEvent();
  },

  _resetTimers: function(date) {
     this.totalTimer.reset(date);
     this.callTimer.reset(date);
     this.holdTimer.reset(date);
     this.wrapupTimer.reset(date);
     this.preparationTimer.reset(date);

     this.onTimerEvent();
  },
  
  handleBusyReasons: function (DOMobj, outboundType){
	  var url = 'confDialList/Controller.jpf';
	  var pars = 'method=' + outboundType;
	  var request = new Ajax.Request(url, { method: 'get', parameters: pars, asynchronous : false });
	  if (request.success()) {
		  this.popup = window.createPopup();
		  this.popup.document.cti = this;
		  this.popup.document.write(request.transport.responseText); 
		  var shouldDisplay = (this.popup.document.body)&&(this.popup.document.body.innerText.length > 0);
		  if (shouldDisplay) {
			  this.origDOMobj = DOMobj;
			  this.contShowOutboundNumbers();
		  }
	  }
  },
 
 // show the transfer or conference numbers list
  //note: this method should not move to CTIClientAPI since it is related straight to UI
  showOutboundNumbers: function(DOMobj, outboundType) {
	//Open dial list window in case the action is dial or consult, transferImpl=standard (DialListJsonController)
	  if(outboundType == 'dial' || outboundType == 'consult'){
		  $W().openDialList(null, outboundType);
	//Busy reasons support (confDialList/Controller.jpf)
	  }else if(outboundType == 'busy'){
		  this.handleBusyReasons(DOMobj, outboundType);
	//Open dial list window in case the action is a transfer action (DialListJsonController)	 
	  }else{
		$W().openDialList(this.selectedTransferImpl, outboundType);
	  }
  },
   
 // This is a workaround
 // we need to wait for the scrollWidth to be updated after the Ajax response text is inserted.
 // here we have a timmer that is waiting for the scroll width to be larger then 1
 // another way to solve this is to set IE to "update every visit to page"
  contShowOutboundNumbers: function(){
  	// We tried to understand what is the need for calling show(0,0,0..),
  	// without calling the show the real scroll width is not updated and remain 0
  	// then we found this MSDN note about the subject (height and width have the same issue).
  	// From MSDN:
  	// The following popup object is used only to detect what height the 
    // displayed popup object should be using the scrollHeight property. 
    // This is important because the size of the popup object varies 
    // depending on the length of the definition text. This first 
    // popup object is not seen by the user.
  
  	this.popup.show(0, 0, 0, 0, this.origDOMobj);
  	var realWidth = this.popup.document.body.scrollWidth;
  	this.popup.hide();
  	
  	if(realWidth <= 1){
  		setTimeout(this.contShowOutboundNumbers.bind(this),100);
  	} else {
  		//need to calculate the x position of the popup, which should be right 
  		//aligned with the button (right end of the button with the right end of the pop up)
  		var xCor = 0-(realWidth+22)+this.origDOMobj.scrollWidth;
  		var yCor = this.origDOMobj.scrollHeight;
  		this.popup.show(xCor, yCor, realWidth+22, 100, this.origDOMobj);
  	}
  },
  
  doConferenceAction: function(action) {
    
    if (this._buttonDisabled('join'))
    {
    return;
    }
    if (action == 'joinCall'){
        this.joinBtn.click();
        return;
    } else if (action == 'returnCall'){
        this.doAction('returnCall','');
        return;
    } else if (action == 'transferCallFromConsult'){
         // not using _onCTIButtonClicked function because there is no such button and _onCTIButtonClicked checks if button exists
    	this.doAction('transferFromConsult','')
        return;
    } else if (action == 'toggleToCustomer') {
    	
    	this._onToggleToCustomerClicked();
    	return;    	
    }
  },
  
  //shows  transfer list under the main transfer button
   showTransferList: function(action) { 
    var button = $(TransferBtn);
    if (!button)
    {
        alert('error in showTransferList; button not found: ' + Transfer + 'Btn');
        return;
    }
    //this[action + 'Btn'] = button;
    this.showOutboundNumbers(button, action);
    
    
  },
  doEndAction: function(action) { 
   if (this._buttonDisabled('generalEnd')){
        return;
   }
    if (action == 'endCall'){
        this.endBtn.click();
    }
    else if(action == 'endItem'){
        this.endOpenMediaBtn.click();    
    } else {
         alert('unexpected action: ' + action);
        return;
    }
    
  },
  doCompleteTransferAction: function(action) { 
   if (this._buttonDisabled('completeTransfer'))
   {
   return;
   }
    if (action == 'completeTransfer'){
    	if (this.popup) {
       		this.popup.hide();
    	}
       this._onCTIButtonClicked('completeTransfer');
    }
    else if(action == 'returnCall'){
        this.doAction('returnCall','');  
    } else if (action == 'toggleToCustomer') {
  	
    	this._onToggleToCustomerClicked();
    	return;    	
    } else {
         alert('unexpected action: ' + action);
        return;
    }
    
  },
  
  doSelectedTransfer: function(type) { 
   this.selectedTransferImpl = type;
    this._onTransferPopupClicked();
  },
  
  doAction: function(action, dn, location) { 
    if (this.popup) {
       this.popup.hide();
    }
    
    this._doOperationWithDn(action, dn, location);        
  },
  
  
 _onEndPopupClicked: function() {
     if(this.endPopupBtn.btnDisabled || 
        (this.waitEventTimer != null && this.isTimerIgnoreClick)) {
        return;
    }

    // remove last error status
    $('ErrorStatus').innerHTML = "";
    $('ErrorStatus').title = "";

    var url = 'consultPopup/Controller.jpf';
    var pars = 'method=' + 'end';
    var request = new Ajax.Request(url, { method: 'get', parameters: pars, asynchronous : false });

    if (request.success()) {
        this.popup = window.createPopup();
        this.popup.document.cti = this;
    
        this.popup.document.write(request.transport.responseText); 
        this.popup.document.body.scroll="no";
        
        //set text for popup buttons and display -
        btn = this.popup.document.getElementById('middleEndBtn');
        if (btn != null) {
            btn.childNodes[0].innerHTML = this.getButtonText('endBtn', 'endCallWithShort');
        }
        btn = this.popup.document.getElementById('middleEndOpenMediaBtn');
        if (btn != null) {
            btn.childNodes[0].innerHTML = this.getButtonText('endOpenMediaBtn', 'endItemWithShort'); 
        }
        
        this.popup.show(0, 39, 100, 84, this.generalEndBtn);
    }
  },
  
  //when transfer connect is enabled this is the main transfer popup to choose between the 2 transfer available
  _onMainTransferPopupClicked: function(event) {
  if(this.transferPopupBtn.btnDisabled || 
        (this.waitEventTimer != null && this.isTimerIgnoreClick)) {
        return;
    }
  // remove last error status
    $('ErrorStatus').innerHTML = "";
    $('ErrorStatus').title = "";

    var url = 'consultPopup/Controller.jpf';
    var pars = 'method=' + 'mainTransfer';
    var request = new Ajax.Request(url, { method: 'get', parameters: pars, asynchronous : false });

    if (request.success()) {
        this.popup2 = window.createPopup();
        this.popup2.document.cti = this;
    
        this.popup2.document.write(request.transport.responseText); 
        this.popup2.document.body.scroll="no";
        
        //set text for popup buttons and display -
        var btn = this.popup2.document.getElementById('middleTransferStandardBtn');
        if (btn != null) {
            btn.childNodes[0].innerHTML = this.getButtonText('TransferStandardBtn', 'transferStandard');
        }
        btn = this.popup2.document.getElementById('middleTransferConnectBtn');
        if (btn != null) {
            btn.childNodes[0].innerHTML = this.getButtonText('TransferConnectBtn', 'transferConnect');
        }
        this.popup2.show(0, 39, 100, 84, this.transferBtn);
    }
  },

  
  _onConsultPopupClicked: function(event) {
    if(this.consultPopupBtn.btnDisabled || 
        (this.waitEventTimer != null && this.isTimerIgnoreClick)) {
        return;
    }

    // remove last error status
    $('ErrorStatus').innerHTML = "";
    $('ErrorStatus').title = "";

    var url = 'consultPopup/Controller.jpf';
    var pars = 'method=' + 'consult';
    var request = new Ajax.Request(url, { method: 'get', parameters: pars, asynchronous : false });

    if (request.success()) {
    	var buttonCounter = 0;
        this.popup = window.createPopup();
        this.popup.document.cti = this;
    
        this.popup.document.write(request.transport.responseText); 
        this.popup.document.body.scroll="no";
        
        //set text for popup buttons and display -
        var btn = this.popup.document.getElementById('middleConsultJoinBtn');
        if (btn != null) {
        	buttonCounter++;
            btn.childNodes[0].innerHTML = this.getButtonText('ConsultJoinBtn', 'join');
        }
        btn = this.popup.document.getElementById('middleConsultReturnBtn');
        if (btn != null) {
        	buttonCounter++;
            btn.childNodes[0].innerHTML = this.getButtonText('ConsultReturnBtn', 'return');
        }
        if (this.transferAllowedFromConsult) {
            btn = this.popup.document.getElementById('middleConsultTransferBtn');
            if (btn != null) {
            	buttonCounter++;
                btn.childNodes[0].innerHTML = this.getButtonText('ConsultTransferBtn', 'transfer');
            }
        }
        btn = this.popup.document.getElementById('middleConsultToggleToCustomerBtn');
        if (btn != null) {
        	buttonCounter++;
            btn.childNodes[0].innerHTML = this.getButtonText('ConsultToggleToCustomerBtn', 'toggleToCustomer');
        }
        this.popup.show(0, 39, 120, 40*buttonCounter+4, this.joinBtn);
    }
  },
  
  //to decide which transfer flow to activate - regular or connect
   _onTransferPopupClickedEx: function(event) {
  
  	  //if transfer connect is allowed AND this is not the complete of warm transfer,
  	  //only then, use the main transfer-pop-up
      if(UserCTIRoles.CTITransferConnectAllowed &&
      	!(this.completeTransferBtn && !this.completeTransferBtn.btnDisabled )) {
        this._onMainTransferPopupClicked();
      }
      else{
        this._onTransferPopupClicked();
      }
  },
  
  
  _onTransferPopupClicked: function(event) {
    if(this.transferPopupBtn.btnDisabled || 
        (this.waitEventTimer != null && this.isTimerIgnoreClick)) {
        return;
    }
    // remove last error status
    $('ErrorStatus').innerHTML = "";
    $('ErrorStatus').title = "";
    
    //checking if we are in complete transfer state- if so the popup location and content is affected
    var completeTransferState = (this.completeTransferBtn && !this.completeTransferBtn.btnDisabled);


    var url = 'consultPopup/Controller.jpf';
    if (completeTransferState == true) {
        var pars = 'method=' + 'completeTransfer';
    } else {
    var pars = 'method=' + 'transfer';
    }
    var request = new Ajax.Request(url, { method: 'get', parameters: pars, asynchronous : false });

    if (request.success()) {
        this.popup = window.createPopup();
        this.popup.document.cti = this;
    
        this.popup.document.write(request.transport.responseText); 
        this.popup.document.body.scroll="no";
        
        //set text for popup buttons and display -
        var btn;
        if (completeTransferState == true) {
            btn = this.popup.document.getElementById('middleTransferCompleteBtn');
            if (btn != null) {
                btn.childNodes[0].innerHTML = this.getButtonText('TransferCompleteBtn', 'completeTransfer');
            }
            btn = this.popup.document.getElementById('middleTransferReturnBtn');
            if (btn != null) {
                btn.childNodes[0].innerHTML = this.getButtonText('TransferReturnBtn', 'return');
            }
            btn = this.popup.document.getElementById('middleWarmTransferToggleToCustomerBtn');
            if (btn != null) {
                btn.childNodes[0].innerHTML = this.getButtonText('WarmTransferToggleToCustomerBtn', 'toggleToCustomer');
                this.popup.show(0, 39, 120, 124, this.completeTransferBtn);
            }
            else {
            	this.popup.show(0, 39, 120, 84, this.completeTransferBtn);
            }
        } else {
            var transferBtns = 0;
            btn = this.popup.document.getElementById('middlehandshakeTransferBtn');
            if (btn != null) {
                btn.childNodes[0].innerHTML = this.getButtonText('handshakeTransferBtn', 'handshake');
                transferBtns++;
            }
            btn = this.popup.document.getElementById('middlewarmTransferBtn');
            if (btn != null) {
                btn.childNodes[0].innerHTML = this.getButtonText('warmTransferBtn', 'warm');
                transferBtns++;
            }
            btn = this.popup.document.getElementById('middlecoldTransferBtn');
            //cold transfer is not relevant for TransferConnect
            if (btn != null && this.selectedTransferImpl != 'Connect') {
                btn.childNodes[0].innerHTML = this.getButtonText('coldTransferBtn', 'cold');
                transferBtns++;
            }            
            if(UserCTIRoles.CTITransferConnectAllowed){
                //give the popup a title of the transfer he choose
                title = this.popup.document.getElementById('TransferTitle');
                title.innerHTML = this.getButtonText('', 'transfer'+this.selectedTransferImpl+'Title');
                title.className = "ctiTableHeader";
                
                this.popup.show(0, 39, 120, transferBtns*39 + 17, this.transferBtn);
            } else {
                this.popup.show(0, 39, 120, transferBtns*39 + 5, this.transferBtn);
            }

        }
    }
  },
  
  /********************************************************************************/
  /** SLA Related methods - start
  /********************************************************************************/
  setTimerClassName: function(className){
  	this.timerClassName = className;
  },
  
  getTimerClassName: function(){
  	return this.timerClassName;
  },
  
  setTimerColorBySLA: function(slaStage){
 	className = "normal-counter";
 	if(slaStage == "begin"){
 		className = "begin-counter";
 	} else if (slaStage == "middle"){
 		className = "middle-counter";
 	} else if (slaStage == "end"){
 		className = "end-counter";
 	}
 	
 	this.setTimerClassName(className);
 },
 
  /********************************************************************************/
  /** SLA Related methods - end
  /********************************************************************************/
    onShowDialPadWindow: function(action) {
    this.dialPadWindowActionSource = action;
   
    // remove last error status
    $('ErrorStatus').innerHTML = "";
    $('ErrorStatus').title = "";
    openDialPadPortletWindow();

  },
  
   dialFromDialPadWindow: function(number) {
	if(this.dialPadWindowActionSource == 'sendDTMF'){
		return this.ctiAPI.sendDTMFAPI(number);
	}
    var operation = '';
    //in case of transfer operation check the te transfer button
    if ((this.dialPadWindowActionSource.toLowerCase()).indexOf('transfer')!=-1) {
        operation = 'Transfer'
    } else if((this.dialPadWindowActionSource.toLowerCase()).indexOf('consult')!=-1) {
        operation = 'Consult';
    
    } else if((this.dialPadWindowActionSource.toLowerCase()).indexOf('dial')!=-1) {
        operation = 'Dial';
    }
    //check button when there is an operation 
    if (operation != null && operation != '' ) {
        //check relevant button
        var button = $(operation + 'Btn');
        if (!button || button.enabled == false || button.btnDisabled == true || button.allowed == false)  {
        	var alertMsg = $W().localeManager.getLocalizationValue('application.javascript.ctiButtonsBar.alert.cannotDialBecauseRelevantButtonDisabledBegin');
        	//when possible take the already localized text
        	if (button && button.childNodes[0].childNodes[0].innerHTML && button.childNodes[0].childNodes[0].innerHTML !='') {
        		alertMsg +=button.childNodes[0].childNodes[0].innerHTML+' ';	
        	}else{
        		alertMsg +=operation+' ';
        	}
        	alertMsg += $W().localeManager.getLocalizationValue('application.javascript.ctiButtonsBar.alert.cannotDialBecauseRelevantButtonDisabledEnd');
            alert(alertMsg);
            var msg = 'The operation '+operation +' cannot be executed because the '+operation+' button is currently disabled.';
            this.ctiAPI._error(msg);
            //activating the user's handler
            this.ctiClientErrorHandler(this.ctiClientInfo, msg);
            return;       
        } 
    }

    return this.doAction(this.dialPadWindowActionSource, number)
  },


  
  isDialEnabled: function() {
    return !this.dialBtn.btnDisabled;
  },
  
  isManualMode: function()
  {	
  	if(this.stateName.indexOf('manual') != -1) {
  		return true;
  	}else {
  		return false;
  	}
  },
  
     
  allowLayoutActions: function()
  {
  
    return (( this.stateName == 'not_initialized' ||
              this.stateName.indexOf('manual_ready')!=-1 ||    
              this.stateName == 'ready_to_start_outbound' ||  
              this.stateName == 'notready') && this.ctiOperationInProgress != true);
  },
  
  startCallDisposition: function(shouldHangCall) {
    var arrArgs = $A(arguments);
    if (arrArgs.length>0 && shouldHangCall==false) {
        $W().loadDisposition();   
    }
    else {
        this.endBtn.click();
    }
  },
  
  endDisposition:function()
  {    
        // remove last error status
        $('ErrorStatus').innerHTML = "";
       return this.ctiAPI.endDispositionAPI();
  },
  
  cleanError: function(){
	  	// remove last error status
	    $('ErrorStatus').innerHTML = "";
	    $('ErrorStatus').title = "";
  },
  
   /********************************************************************************
   * Error handler function should be filled up by the user.
   This function is automatically called upon recieving an error message or calling a disabled button
   *********************************************************************************/
  ctiClientErrorHandler: function(ctiClientInfo, data) { 
    this.ctiAPI._debug("Activating cti error handler: " + data);
  },

  /**********************************************************/
    //New API for using the CTIClient.js from the outside.
    /**********************************************************/
    
/**
 * This function ends the current Multimedia item handling.
 * @param workitemId - not in use
 */
  releaseCustomItemAPI:function(workitemId)
  {  
        this.endOpenMediaBtn.click();
  },  
  
  /**
 * This function answers the current incoming Multimedia item.
 * @param workitemId - not in use
 */
  acceptCustomItemAPI:function(workitemId)
  {  
        this.answerOpenMediaBtn.click();
  },
    
/**
 * This function answers the current incoming call.
 * @param workitemId - not in use
 */
  answerCallAPI:function(workitemId)
  {  
        this.answerBtn.click();
  },
  
  /**
 * This function transfers the current call to the given destination according to the given transfer type.
 * @param workitemId - not in use
 * @param destination - the number to transfer to
 * @param transferType - the transfer type (handshake and warm are supported for genesys)
 * @param location - relevant in a multi-site environmet, the Genesys TServer name
 * @param key - the attached data key.
 * @param value - the attached data value.
 */
  transferCallAPI:function(workitemId, destination, transferType, location, attachedKey, attachedValue)
  {  
        if (attachedKey !=null && attachedKey.length >0 && attachedValue != null && attachedValue.length > 0) {
            this._onTransferWithAttachedDataClicked(transferType, destination, attachedKey, attachedValue, location);
        }
        else {
            this._onTransferTo(destination, transferType, location);
        }
  },
  
 /**
 * This function sets the agent's status according to the given mode.
 * @param status - the agent's status , only ready and notready
 * @param workmode - the agent's workmode , relevant only in notready case
 */
  setAgentStatusAPI:function(status,workmode)
  {  
        if(status == 'ready') {
            this.readyBtn.click();
        }
        else if(status == 'notready') {
            if (workmode == 'unknown'){
                //this._onBusyClicked();
                this.busyBtn.click();
            }
            else if (workmode == 'afterCallWork'){
                 this.doAction('afterCallWork', '');
            }
        }
  },
  
  /**
 * This function attaches the given data [key-value] to the given callId.
 * @param workitemId - can be passed empty, in such case the data will be attached to the customer call
 * @param key - the attached data key.
 * @param value - the attached data value.
 */
  attachUserDataAPI:function(key, value, workitemId)
  {  
        this._onAttachData(key, value, workitemId);
        
  },
  
   /**
 * This function deletes a specific key-value pair attaches the given data [key-value].
 * @param workitemId - can be passed empty, in such case the data will be attached to the customer call
 * @param key - the attached data key.
 * @param value - the attached data value.
 */
  deleteAttachedUserDataAPI:function(key, workitemId)
  {  
        this._onDeleteAttachData(key, workitemId);
       
  },
  
  
  
    /**
 * This function updates a specific key-value pair attaches the given data [key-value].
 * @param workitemId - can be passed empty, in such case the data will be attached to the customer call
 * @param key - the attached data key.
 * @param value - the attached data value.
 */
  updateAttachedUserDataAPI:function(key, value, workitemId)
  {  
        this._onAttachData(key, value, workitemId);
  },
  
  /**
 * This function performs an outbound call to the given number.
 * @param workitemId - not in use
 * @param location - relevant in a multi-site environmet, the Genesys TServer name
 */
  dialCallAPI:function(destination, location)
  {  
        this._onCTIButtonClicked('dial',destination, location);
  },
  
   /**
 * This function releases the current workItem.
 * @param workitemId - not in use
 */
  releaseItemAPI:function()
  {  
        this.endBtn.click();
  },
  
  
  
  /**************** More operations not mandatory for KS2000**********************/
  /**
 * This function holds the current call.
 * @param workitemId - not in use
 */
  holdCallAPI:function(workitemId)
  {  
        this.holdBtn.click()
  },
  
    /**
 * This function off holds the current call.
 * @param workitemId - not in use
 */
  offHoldCallAPI:function(workitemId)
  {  
        this.holdOffBtn.click();
  },
  
  
  
  /**********************************************************/
    //End of New API for using the CTIClient.js from the outside.
    /**********************************************************/
 
 /********/
 /*     Methods to control the displayed timers - Item or Call*/
 /********/
 
 
 _setCallTimersEnable:function()
 {
    //BUG 57518 this.saveItemTimers();
    this._setItemTimersDisable();
    this._updateAHT();
    //show call timer, total call time, totals calls and AHT for calls
    $("CallTime").style.visibility = "visible";
    $("CallTime").style.display = 'inline';
    $("TotalTime").style.visibility = "visible";
    $("TotalTime").style.display = 'inline';
    $("TotalCallNumber").style.visibility = "visible";
    $("TotalCallNumber").style.display = 'inline';
    $("CallTimeCaption").innerHTML = $W().localeManager.getLocalizationValue("application.javascript.ctiCallInfoBar.label.callTime");
    $("TotalCallCaption").innerHTML = $W().localeManager.getLocalizationValue("application.javascript.ctiCallInfoBar.label.totalCalls");//"Total Items:&nbsp;&nbsp;&nbsp;";
    
    
 },
 
 _setCallTimersDisable:function()
 {
    //hide call timer, total call time, totals calls and AHT for calls
    $("CallTime").style.visibility = "hidden";
    $("CallTime").style.display = 'none';
    $("TotalTime").style.visibility = "hidden";
    $("TotalTime").style.display = 'none';
    $("TotalCallNumber").style.visibility = "hidden";
    $("TotalCallNumber").style.display = 'none';
 },
 
 _setItemTimersEnable:function()
 {
    this._setCallTimersDisable();
    this._updateItemAHT();
    //show item timer, total item time, totals items and AHT for items
    $("ItemTime").style.visibility = "visible";
    $("ItemTime").style.display = 'inline';
    $("TotalItemTime").style.visibility = "visible";
    $("TotalItemTime").style.display = 'inline';
    $("TotalItemNumber").style.visibility = "visible";
    $("TotalItemNumber").style.display = 'inline';
    $("CallTimeCaption").innerHTML = $W().localeManager.getLocalizationValue("application.javascript.ctiCallInfoBar.label.itemTime");
    $("TotalCallCaption").innerHTML = $W().localeManager.getLocalizationValue("application.javascript.ctiCallInfoBar.label.totalItems");//"Total Items:&nbsp;&nbsp;&nbsp;";
 },
 
 _setItemTimersDisable:function()
 {
    //hide item timer, total item time, totals items and AHT for items
    $("ItemTime").style.visibility = "hidden";
    $("ItemTime").style.display = 'none';
    $("TotalItemTime").style.visibility = "hidden";
    $("TotalItemTime").style.display = 'none';
    $("TotalItemNumber").style.visibility = "hidden";
    $("TotalItemNumber").style.display = 'none';
 },
 
_testErrMsgLocalization:function()
{

	var errMsgs=new Array() ;
	var j=0;
	errMsgs[j++] = "application.javascript.ctiCallInfoBar.label.errorMessage.callForwarded";
	errMsgs[j++] = "application.javascript.ctiCallInfoBar.label.errorMessage.supervisorBusy";
	errMsgs[j++] = "application.javascript.ctiCallInfoBar.label.errorMessage.customerUnreachable";
	errMsgs[j++] = "application.javascript.ctiCallInfoBar.label.errorMessage.supervisorUnreachableForConsultation";
	errMsgs[j++] = "application.javascript.ctiCallInfoBar.label.errorMessage.supervisorUnreachableForTransfer";
	errMsgs[j++] = "application.javascript.ctiCallInfoBar.label.errorMessage.consultFailed";
	errMsgs[j++] = "application.javascript.ctiCallInfoBar.label.errorMessage.dailFailed";
	errMsgs[j++] = "application.javascript.ctiCallInfoBar.label.errorMessage.transferFailed";
	errMsgs[j++] = "application.javascript.ctiCallInfoBar.label.errorMessage.completeTransferFailed";
	errMsgs[j++] = "application.javascript.ctiCallInfoBar.label.errorMessage.joinFailSuperNotInCall";
	errMsgs[j++] = "application.javascript.ctiCallInfoBar.label.errorMessage.customerNotObtainable";
	errMsgs[j++] = "application.javascript.ctiCallInfoBar.label.errorMessage.supervisorNotObtainable";
	errMsgs[j++] = "application.javascript.ctiCallInfoBar.label.errorMessage.missedCall";
	errMsgs[j++] = "application.javascript.ctiCallInfoBar.label.errorMessage.coldTransferFailed";
	errMsgs[j++] = "application.javascript.ctiCallInfoBar.label.errorMessage.noTransferToCustomer";
	errMsgs[j++] = "application.javascript.ctiCallInfoBar.label.errorMessage.customerBusy";
	
	
	//var errMsgs = ["application.javascript.ctiCallInfoBar.label.errorMessage.callForwarded","application.javascript.ctiCallInfoBar.label.errorMessage.callForwarded"];
	 for (var i =0; i<errMsgs.length; i++) {
        $W().LogManager.getLogger("CTIJS").debug("given key: " + errMsgs[i]);
        $W().LogManager.getLogger("CTIJS").debug("found value: " + $W().localeManager.getLocalizationValue(errMsgs[i]));
        
    }
},
/**
 * This function returns whether we are in manual mode or not
 */
  isManualMode:function()
  {  
  		if(this.stateName.indexOf('manual')!=-1){
  			return true;
  		} else {
  			return false;
  		}
  },
  
  _getLogHeader: function(ctiObj){ 
		return " CTI.js - <<" + ctiObj.extension + ">> ";
  },

  _getLogTrailer: function(ctiObj){     
		var text = "\t\t\t>> CTI Object:\t";
		
		text += "\t" + "stateName: "        + ctiObj.stateName;
		text += "\t" + "callerid: "         + ctiObj.callerid;
		text += "\t" + "LastStateReceived: "+ ctiObj.LastStateReceived;
		text += "\t" + "connected: "        + ctiObj.connected;
		text += "\t" + "outboundCalls: "    + ctiObj.outboundCalls;
		text += "\t" + "busy: "             + ctiObj.busy;
		text += "\t" + "notready: "         + ctiObj.notready;    
		text += "\t" + "InCallFinish: "     + ctiObj.InCallFinish;
		text += "\t" + "waitEventTimer: "   + ctiObj.waitEventTimer;    
		text += "\t" + "state.status.text: "+ this.state.status.text;
		    
		return text;
  }
}
  
function callerIdChanged() {
   var cti = $W().cti;
   cti.comboStartCall();
}

function doOnBusyOutboundCall(elem, event)
{
    // script developer may add functionality, e.g. to avoid disposition, log the call as busy etc.
}

function doOnFailOutboundCall(elem, event)
{
    // script developer may add functionality, e.g. to avoid disposition, log the call as busy etc.
}

function overrideCtiInit(ctiObject)
{
 // if needed, override this function in USER level; e.g.:
 // ctiObject.startBtn.allowed = false;
 // ctiObject.readyBtn.allowed = false;  
}

// Returns the elapsed time to change the color of the counter to red.
function getCallCounterThresholdInSec() {
    return 120;
}
