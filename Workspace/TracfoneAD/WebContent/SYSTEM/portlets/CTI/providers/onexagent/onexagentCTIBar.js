/**
*  @class OneXAgentCTIBar
*  This class uses OneXAgentClientAPI and updates UI
**/

CTIBarOneX = Ext.extend(Ext.Panel, {
	constructor: function(config) {
		config = Ext.apply({
			layout:'border',
			frame: true,
			renderTo: Ext.getBody(),			
			height: 79,
			defaults:{margins:'0 5 0 0'},
			items: this.getCTIItems()
        }, config);

		CTIBarOneX.superclass.constructor.call(this, config);       
	},

	init: function(){		
	    var response = OneXAgentAPI.registerclient();
	    if (response.ResponseCode == 0) {	    	
            setState('ready');
	    }
	},
	setCurrentInteractionId : function (interactionid) {
	    this.interactionid = interactionid;
	},
	setCurrentInteractionUUI : function (uui) {
	    this.uui = uui;
	},
	setCurrentState : function (currentState) {
        this.state = currentState;
	},
	getCurrentState : function () {
        return this.state;
    },
    unregisterclient: function() {
        OneXAgentAPI.unregisterclient();
    },
	dialFromDialPadWindow: function(number) {
	    if (number == null) {
            return;
	    }
		var response = OneXAgentAPI.makecall(number);
		if (response.ResponseCode == 0) {
		    setState('dialing');
		}
	},
	getCTIItems: function() {
		_this = this;
		return [
		       {
		        	cls: 'corporate-logo' ,
		    		xtype: 'box',
		    		region: 'west',
		    		border: false,		    		
		    		margins: '0 0 0 50'
		        },
		        {
					xtype: 'label',
					id: 'status',
					itemId: 'status',
					region: 'center',
					width: '400px',
					margins: '20 0 0 50'
		        },
		        {
		            xtype: 'panel',		            
		            id: 'buttons',
		            itemId: 'buttons',
		            region: 'east',
		            width: 350,
		            layout: {
		                type: 'hbox'
		                //pack: 'end'		            	
		            },
		            defaults:{
		            	margins: '0 0 0 5'
		            },
		            items: [
		            {
                            xtype: 'button',
                            id: 'dial',
                            itemId: 'dialBtn',
                            text: 'Dial',
                            icon: $W().contextPath + '/USER/resources/themes/Jacada/images/buttons/Icons/dial.gif',
                            height: 65,
                            width: 65,                       
                            scale: 'large',
                            handler: function(button, event){
                                //set the callback for the dialpad
                                $W().cti = _this;
                                openDialPadPortletWindow();
                            },
                            iconAlign: 'top'
                        },{
                            xtype: 'button',
                            id: 'answer',
                            itemId: 'answerBtn',
                            text: 'Answer',
                            /*cls: 'middle',*/
                            icon: $W().contextPath + '/USER/resources/themes/Jacada/images/buttons/Icons/answer.gif',
                            height: 65,
                            width: 65,                            
                            scale: 'large',
                            handler: function(button, state){
                                var response = OneXAgentAPI.accept($W().CTIBar.interactionid);
                                if (response.ResponseCode == 0) {
                                    setState('incall');
                                }
                            },
                            iconAlign: 'top'
                        },{
                            xtype: 'button',
                            id: 'end',
                            itemId: 'endBtn',
                            text: 'End',
                            icon: $W().contextPath + '/USER/resources/themes/Jacada/images/buttons/Icons/end.gif',
                            height: 65,
                            width: 65,                            
                            scale: 'large',
                            handler: function(button, event){
                                var response = OneXAgentAPI.release($W().CTIBar.interactionid);
                                if (response.ResponseCode == 0) {
                                    setState('ready');
                                }
                            },
                            iconAlign: 'top'
                        },{
                            xtype: 'button',
                            id: 'hold',
                            itemId: 'holdBtn',
                            text: 'Hold',
                            icon: $W().contextPath + '/USER/resources/themes/Jacada/images/buttons/Icons/hold.gif',
                            height: 65,
                            width: 65,                            
                            scale: 'large',
                            iconAlign: 'top',
                            enableToggle: true,
                            toggleHandler: function (button, state ){
                                if(button.pressed){
                                    button.setIcon($W().contextPath + '/USER/resources/themes/Jacada/images/buttons/Icons/hold-off.gif');
                                    button.setText('Unhold');
                                    var response = OneXAgentAPI.hold($W().CTIBar.interactionid);
                                    if (response.ResponseCode == 0) {
                                        setState('inhold');
                                    }
                                }else{
                                    button.setIcon($W().contextPath + '/USER/resources/themes/Jacada/images/buttons/Icons/hold.gif');
                                    button.setText('Hold');
                                    var response = OneXAgentAPI.unhold($W().CTIBar.interactionid);
                                    if (response.ResponseCode == 0) {
                                        setState('incall');
                                    }
                                }
                            }
                        },{
                            xtype: 'button',
                            id: 'mute',
                            itemId: 'muteBtn',
                            text: 'Mute',
                            icon: $W().contextPath + '/USER/resources/themes/Jacada/images/buttons/Icons/conf.gif',
                            height: 65,
                            width: 65,                            
                            scale: 'large',
                            iconAlign: 'top',
                            enableToggle: true,
                            toggleHandler: function (button, state ){
                                if(button.pressed){
                                    button.setText('Unmute');
                                    button.setIcon($W().contextPath + '/USER/resources/themes/Jacada/images/buttons/Icons/conf_dis.gif');
                                    var response = OneXAgentAPI.mute();
                                }else{
                                    button.setIcon($W().contextPath + '/USER/resources/themes/Jacada/images/buttons/Icons/conf.gif');
                                    OneXAgentAPI.unmute();
                                    var response = button.setText('Mute');
                                }
                            }
                        }
		            ]
		        }

		 ];
    }
    
    
});

CTIBarOneX.states = {
    ready : {
        answerBtn :     {enabled: false},
        holdBtn :       {enabled: false},
        muteBtn :       {enabled: true},
        dialBtn :       {enabled: true},
        endBtn :        {enabled: false},
        status:         { text: $W().localeManager.getLocalizationValue("application.javascript.ctiCallInfoBar.label.status.ready")}
    },
    ringing : {
        answerBtn :     {enabled: true},
        holdBtn :       {enabled: false},
        muteBtn :       {enabled: true},
        dialBtn :       {enabled: false},
        endBtn :        {enabled: false},
        status:         {text: $W().localeManager.getLocalizationValue("application.javascript.ctiCallInfoBar.label.status.ringing")}
    },
    incall : {
        answerBtn :     {enabled: false},
        holdBtn :       {enabled: true},
        muteBtn :       {enabled: true},
        dialBtn :       {enabled: false},
        endBtn :        {enabled: true},
        status  :       {text : $W().localeManager.getLocalizationValue("application.javascript.ctiCallInfoBar.label.status.incall")}
    },
    inhold : {
        answerBtn :     {enabled: false},
        holdBtn :       {enabled: true},
        muteBtn :       {enabled: true},
        dialBtn :       {enabled: false},
        endBtn :        {enabled: false},
        status  :       {text : $W().localeManager.getLocalizationValue("application.javascript.ctiCallInfoBar.label.status.inHold")}
    },
    dialing : {
        answerBtn :     {enabled: false},
        holdBtn :       {enabled: false},
        muteBtn :       {enabled: true},
        dialBtn :       {enabled: false},     
        endBtn :        {enabled: true},
        status:         {text: $W().localeManager.getLocalizationValue("application.javascript.ctiCallInfoBar.label.status.dialing")}
    }
}

function onQueueEmpty(objectId, notificationId, timeStamp) {
    //$('footer').textContent = "onQueueEmpty";
    //$('content').textContent += objectId + ", " + notificationId + ", " + timeStamp;
}

function toggle(id, current, next, currentFunction, nextFunction) {
    var args = Array.prototype.slice.call(arguments);
    if ($(id).value == current) {
        var response = currentFunction.apply(OneXAgentAPI, args.slice(5));
        if (response.ResponseCode == 0) {
            $(id).value = next;
        }
    } else if ($(id).value == next) {
        var response = nextFunction.apply(OneXAgentAPI, args.slice(5));
        if (response.ResponseCode == 0) {
            $(id).value = current;
        }
    }
}

function register() {
    toggle("registerButton", "Register", "UnRegister", OneXAgentAPI.registerclient, OneXAgentAPI.unregisterclient);
}

function answer(interactionid) {
	OneXAgentAPI.accept(interactionid);
}

function mute() {
    toggle("muteButton", "Mute", "UnMute", OneXAgentAPI.mute, OneXAgentAPI.unmute);
}

function hold() {
    toggle("holdButton", "Hold", "UnHold", OneXAgentAPI.hold, OneXAgentAPI.unhold, interactionid);
}

function call() {
    //toggle("callButton", "Register", "UnRegister");
}


function onVoiceInteractionCreated(NotificationId, ObjectId, TimeStamp, WorkItemId, RemoteUser, Topic, RemoteAddress, PromptedDigits, UUI ) {
    $W().CTIBar.setCurrentInteractionId(ObjectId);
    $W().CTIBar.setCurrentInteractionUUI(UUI);
    if ($W().CTIBar.getCurrentState() != 'dialing') {
        setState('ringing');
    } else {
        setState('incall');
    }
}

function onVoiceInteractionTerminated(NotificationId, ObjectId, TimeStamp, WorkItemId, RemoteUser, Topic, RemoteAddress, PromptedDigits, UUI) {
	setState('ready');
	$W().CTIBar.setCurrentInteractionUUI(UUI);
}

function onVoiceInteractionMissed(NotificationId, ObjectId, TimeStamp, WorkItemId, RemoteUser, Topic) {
	setState('ready');
    updateStatus("Missed call from " + RemoteUser);
}

function updateStatus(status) {
	var statusLbl = $W().CTIBar.getComponent('status');
	statusLbl.setText(status);
	statusLbl.removeClass('onex-error');
}

function setState(clientStateName) {
   $W().CTIBar.setCurrentState(clientStateName);
   state = CTIBarOneX.states[clientStateName];
   setButtons(state);
   setStatus(state);
   $W().showLogout(clientStateName == 'ready');
}
function setButtons(state) {
    for (var name in this.state) {
        var comp = $W().CTIBar.getComponent('buttons').getComponent(name);
        if (comp != null) {
            if (state[name].enabled) {
                comp.enable();
            } else if (state[name].enabled != 'undefined' && state[name].enabled == false){
                comp.disable();
            }
            /*if (state[name].pressed != 'undefined') {
            	comp.toggle();
            }*/
        }
    }
}
function setStatus(state) {
    updateStatus(state.status.text);
}
/**
* This method is invoked when OneX returns Error response
*/
function applicationErrorHandler(response) {
	var msg = $W().localeManager.getLocalizationValue("application.javascript.ctiCallInfoBar.label.errorMessage.ApplicationError");
	if (response.ResponseCode == 1) {
		msg = $W().localeManager.getLocalizationValue("application.javascript.ctiCallInfoBar.label.errorMessage.AlreadyRegistered");
	}
    showErrorStatus(msg);
}

/**
* This method is invoked when there is a communication error with OneX
*/
function communicationErrorHandler(response) {
    showErrorStatus($W().localeManager.getLocalizationValue("application.javascript.ctiCallInfoBar.label.errorMessage.CommunicationError"));
}

function showErrorStatus(msg) {
    var errorLbl = $W().CTIBar.getComponent('status');
    errorLbl.setText(msg);
    errorLbl.addClass('onex-error');
}

Ext.EventManager.onWindowResize(function(w, h){
    $W().CTIBar.doLayout();      
});