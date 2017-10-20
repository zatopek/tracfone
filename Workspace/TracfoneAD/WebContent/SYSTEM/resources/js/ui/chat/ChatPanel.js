Ext.define('Jacada.system.ui.chat.ChatPanel', {
    extend: 'Ext.panel.Panel',
  
    chatClosed: false,
    border : false,
    defaults : {
		border : false
	},
    
    itemId: 'chatPanel',
    layout:{
        type: 'vbox',
        align: 'stretch'
    },
    direction:{
    	INBOUND_TO_AGENT: 'InboundToAgent',
    	OUTBOUND_FROM_AGENT: 'OutboundFromAgent'
    },
    listeners: {
    	destroy: function(thisPanel, eOpts){
    		thisPanel.unRegisterForMessages();
    	},
    	activate: function(messagesForm, opts){
    		this.down("#messagesForm").body.scroll('bottom',Infinity);
    	}
    },
    items:[
        {
            itemId: 'messagesForm',
            layout: 'vbox',
            border: false,
            flex: 1,
            autoScroll: true
        },
        {
            layout:{
                type: 'hbox',
                align: 'stretch',
                padding: '5 5 5 2'
            },
            items: [
            {
                xtype: 'textfield',
                itemId: 'msgEditor',
                flex: 1,
                padding: '1 5 0 3',
                enableKeyEvents: true,	
 	        	listeners: {
 	        		keypress: function(textfield, e, eOpts){
 	        			if(e.getKey() == e.ENTER){
 	        				this.up('#chatPanel').sendAgentMessage();
 	        			}
 	        		},
 	        		change: function(textfield, newValue, oldValue, eOpts){
 	        			var btn = this.up().getComponent('sendBtn');
 	        			btn.setDisabled(textfield.getRawValue().trim().length == 0);
 	        			textfield.focus();
 	        		}
 	        	}
 	        		
            },
            {
                xtype: 'button',
                text: $W().localeManager.getLocalizationValue('application.javascript.chat.send'),
                itemId: 'sendBtn',
                cls: 'actionButton',
                disabled: true,
                minWidth: 100,
                handler: function(){
                	this.up('#chatPanel').sendAgentMessage();
                }
            }
            ]
        }
    ],
    setMsgEditorValue:function(value){
    	this.down('#msgEditor').setValue(value);
    },
    sendAgentMessageFromRemote:function(value){
    	if(!value){
    		return;
    	}
    	this.addAgentMessage(value);
    	this.prepareAndSendAgentMessage(value);
    },
    sendAgentMessage: function(){
    	var msg = this.down('#msgEditor').getValue();
    	if(msg.trim().length == 0){
    		return;
    	}
    	this.down('#msgEditor').reset();
    	this.addAgentMessage(msg);
    	this.prepareAndSendAgentMessage(msg);
    },
    prepareAndSendAgentMessage: function(value){
    	var chatMessage = {
    			Message: Base64.encode(value),
    			Author: Base64.encode($W().agentName),
    			MimeType: 'text/plain'
    		}; 
        	$W().mediaAPI.clickButton('sendChatMessage', this.up().chat.uniqueId, 'chat', chatMessage);
    },
    addCustomerMessage: function(customerName, msg){
    	this.addUserMessage(Base64.decode(customerName), 'chat-customer-name' , Base64.decode(msg));
    },
    addAgentMessage: function(msg){
    	this.addUserMessage($W().localeManager.getLocalizationValue('application.javascript.chat.agentname'), 'chat-agent-name' , msg);
    },
    addSystemMessage: function(msg, msgId){
    	if(!msg){
    		msg = $W().localeManager.getLocalizationValue('application.javascript.chat.system.message.' + msgId);
    	}
    	msg = Ext.String.htmlEncode(msg);
    	msg = this.convertLinks(msg);
    	var messagesForm = this.down("#messagesForm");
    	var message = '<hr>';
    	message += '<font class="chat-time-msg">['+Ext.Date.format(new Date(), TIME_FORMAT)+']</font> ';
    	message += '<font class="chat-system-name">System:</font> ';
    	message += msg + '<br>';
    	messagesForm.add({
            html: message,
            border: false
        });
    	messagesForm.body.scroll('bottom',Infinity);
    },
    addUserMessage: function(sender, senderStyle, msg){
    	msg = Ext.String.htmlEncode(msg);
    	msg = this.convertLinks(msg);
    	var messagesForm = this.down("#messagesForm");
    	var message = '<font class="chat-time-msg">['+Ext.Date.format(new Date(), TIME_FORMAT)+']</font> ';
    	message += '<font class="'+senderStyle+'">'+sender+':</font> ';
    	message += msg;
    	messagesForm.add({
            html: message,
            border: false
        });
    	messagesForm.body.scroll('bottom',Infinity);
    },
    convertLinks: function(msg){
    	var parts = msg.split(' ');
    	var links = new Object();
    	parts.each(function (part){
    			if(part.indexOf('http') >= 0){
    				var link = '<a href="'+part+'" target="_blank" >'+part+'</a>';
    				links[part] = link;
    			}
    		}
    	);
    	for(var p in links){
    		msg = msg.replace(p, links[p]);
    	}
    	return msg;
    },
    initComponent: function() {
	    var me = this;
	    Ext.applyIf(me, {
	    });
	    me.callParent(arguments);
	    me.registerForMessages();
	},
	registerForMessages: function(){
		this.pushBinding = this.processNewChatMessage.bind(this);
		$W().Push.registerEventHandler('newChatMessage', this.pushBinding);
	},
	unRegisterForMessages: function(){
		$W().Push.unregisterEventHandler('newChatMessage', this.pushBinding);
	},
	processNewChatMessage: function(data){
		data = Ext.decode(data);
		this.processMessages(data);
	},
	processMessages: function(data){
		//get messages only for this context
		if(this.up().chat.interactionId == data.interactionId){
			var total = data.messages.length;
			for (var i = 0; i < total; i++) {
				var msg = data.messages[i];
				if(msg.messageType == "UserMessage"){
					if(msg.direction == this.direction.INBOUND_TO_AGENT){
						this.addCustomerMessage(msg.author, msg.message);
					}else if(msg.direction == this.direction.OUTBOUND_FROM_AGENT){
						this.addAgentMessage(Base64.decode(msg.message));
					}
				}else if(msg.messageType == "SystemMessage"){
					this.addSystemMessage(msg.message, msg.messageId);
				}else{
					Jacada.Logger.warn("Unknown message type: " + msg.messageType);
				}
			}
		}
	},
	disableChatWindow: function(closingReason){
		this.chatClosed = true;
		this.down('#msgEditor').disable();
		this.down('#sendBtn').disable();
		if(closingReason){
			this.addSystemMessage($W().localeManager.getLocalizationValue('application.javascript.chat.closingreason.' + closingReason));
		}else{
			Jacada.Logger.debug("No closing reason provided");
		}
	},
	isChatClosed: function(){
		return this.chatClosed;
	}
	
});