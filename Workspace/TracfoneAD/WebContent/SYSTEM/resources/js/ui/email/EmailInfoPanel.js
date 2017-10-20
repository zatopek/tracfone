var emailRegEx = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
var nameRegEx = /^[A-Za-z0-9@\"\._-]+$/;
var emailRegExGroup = /<(.*)>/;

Ext.define('Jacada.system.ui.email.EmailInfoPanel', {
    extend: 'Ext.form.Panel',
	height: '100%',
	border: false,
    layout:{
    	type: 'vbox',
    	align: 'stretch',
		padding: 5
    },
	initComponent: function(){
		var me = this;
		var items = [];
		items.push(me.buildIncomingMessagePanel());
		items.push(me.buildReplyMessagePanel());
		items.push(me.buildAttachmentsPanel());
		items.push(me.buildTemplatesTreePicker());
		items.push(me.buildMessageEditor());
		items.push(me.buildReplyMessageEditor());
		
        items = items.compact();
        Ext.applyIf(me, {
        	items: items
        });
        me.callParent(arguments);
	},
	buildIncomingMessagePanel: function(){
		return {
			defaults: {
				margin : '0 0 0 0',
				padding: '0 0 0 10'
			},
			itemId: 'incomingMessagePanel',
			border: false,
			items:[{
				xtype: 'displayfield',
				itemId: 'incomingFromField',
				htmlEncode: true,
				fieldLabel: '<b>' + $W().localeManager.getLocalizationValue('application.javascript.email.from') +'</b>'
			},{
				xtype:'displayfield',
				itemId:'incomingToField',
				htmlEncode: true,
				fieldLabel: '<b>' + $W().localeManager.getLocalizationValue('application.javascript.email.to') +'</b>'
			},{
				xtype:'displayfield',
				itemId: 'incomingCCField',
				htmlEncode: true,
				fieldLabel: '<b>' + $W().localeManager.getLocalizationValue('application.javascript.email.cc') +'</b>'
			},{
				xtype:'displayfield',
				itemId: 'incomingSubjectField',
				htmlEncode: true,
				fieldLabel: '<b>' + $W().localeManager.getLocalizationValue('application.javascript.email.subject') +'</b>'
			},{
				xtype:'displayfield',
				itemId: 'incomingSentField',
				padding: '0 0 5 10',
				fieldLabel: '<b>' + $W().localeManager.getLocalizationValue('application.javascript.email.sent') +'</b>'
			}
			
			]
		};	
	},
	buildReplyMessagePanel: function(){
		var _this = this;
		return {
	    	xtype:'panel',
	    	border: false,
	    	margins : '0 0 0 0',
	    	itemId: 'replyMessagePanel',
	    	hidden: true,
	        fieldDefaults: {
	            anchor: '100%'
	        },
	    	layout: {
	    		type: 'vbox',
	    		align: 'stretch'
	    	},
	    	items:[
	    	       {
	    	    	   xtype: 'textfield',
	    	    	   fieldLabel: '<a class="emailActionLink" href="javascript:$W().openDirectoryWindow(\'replyToField\', \'application.javascript.email.to\');">'+$W().localeManager.getLocalizationValue('application.javascript.email.to')+'</a>',
	    	    	   itemId: 'replyToField',
	    		       name: 'To',
	    	    	   margin: '0 5 5 10'
	    	       },{
	    	    	   xtype: 'textfield',
	    	    	   fieldLabel: '<a class="emailActionLink" href="javascript:$W().openDirectoryWindow(\'replyCCField\', \'application.javascript.email.cc\');">'+$W().localeManager.getLocalizationValue('application.javascript.email.cc')+'</a>',
	    	    	   itemId: 'replyCCField',
	     		       name: 'Cc',
	    	    	   margin: '0 5 5 10'
	    	       },
		     	{
		     		xtype:'textfield',
		     		itemId: 'replySubject',
		     		grow: true,
		     		name: 'Subject',
					padding: '0 5 3 10',
		     		fieldLabel: '<b>' + $W().localeManager.getLocalizationValue('application.javascript.email.subject') +'</b>'
		     	}
	     	]
	    };
	},
	buildAttachmentsPanel: function(){
		return Ext.create('Jacada.system.ui.attachments.AttachmentsPanel');
	},
	buildTemplatesTreePicker: function(){
		var me = this;
		return {
	        xtype: 'fieldcontainer',
	        itemId: 'templatesTreePickerPanel',
	        padding: '5 5 3 10',
	        hidden: true,
	        fieldLabel: '<b>'+$W().localeManager.getLocalizationValue('application.javascript.email.templates')+'</b>',

	        layout: 'hbox',
	        items: [{
	        	xtype: 'treepicker',
		        itemId: 'templatesTreePicker',
		        store: Ext.create('Ext.data.TreeStore', {root: {}}),
		        displayField: 'text',//the node text
	            flex: 1,
	            padding: '0 5 0 0',
	            listeners:{
	            	select: function(picker, record, eOpts){
	            		var template = record.raw.template;
	            		if(template.templateNodeType != 'Folder'){
	            			Ext.Ajax.request({
	            				url : 'rest/resource/template?templateId='+template.templateIdentifier+'&sessionId='+$W().wsSessionId,
	            			    headers: {
	            			    	'Accept': 'application/xml',
	            			    	'Content-Type': 'application/xml'
	            			    },
	            			    success: function(response){
	            			        var templateObj = Ext.decode(Ext.decode(response.responseText));
	            			        templateObj.templateIdentifier = template.templateIdentifier;
	            			        me.applyTemplate(templateObj);
	            			    }
	            			});
	            		}
	            	}
	            }
	        },{
	            xtype: 'button',
	            text: '...',
	            cls: 'actionButton',
	            tooltip: $W().localeManager.getLocalizationValue('application.javascript.email.templates.tooltip'), 
	            handler: function(btn, opts){
	            	if(!me.templatesWindow){
		            	me.templatesWindow = Ext.create('Ext.window.Window', {
				    	    title: $W().localeManager.getLocalizationValue('application.javascript.email.templates'),
				    	    height: 500,
				    	    width: 700,
				    	    modal: true,
				    	    constrain: true,
				    	    closeAction: 'hide',
				    	    layout: 'fit',
				    	    items: Ext.create('Jacada.system.ui.email.TemplatesPanel'),
							buttons:[{
								text: $W().localeManager.getLocalizationValue('application.javascript.email.templates.button.insert'),
								disabled: true,
								itemId: 'btnInsert',
								handler: function(_this){
									var templatesPanel = me.templatesWindow.down('#templatesPanel');
									me.applyTemplate(templatesPanel.getTemplate());
									me.templatesWindow.hide();
								}
							},{
								text: $W().localeManager.getLocalizationValue('application.javascript.email.templates.button.cancel'),
								handler: function(){
									me.templatesWindow.hide();
								}
							}
							  ]
				    	});
		            	var templatesPanel = me.templatesWindow.down('#templatesPanel');
						templatesPanel.allowTemplateInsertion = function(allowTemplate){me.templatesWindow.down('#btnInsert').setDisabled(!allowTemplate);};
	            	}
	            	me.templatesWindow.show();
	            }
	        }]
	     };
		
	},
	applyTemplate: function(templateObj){
		var me = this;
		var workItem = templateObj.eventData.WorkItem;
		//in case a template was selected from the template window, sync the value in the templates dropdown
		var templatesTreePicker = me.getComponent('templatesTreePickerPanel').getComponent('templatesTreePicker').setValue(templateObj.templateIdentifier);
		//delete old attachments from server
		me.deleteAttachments();
		
		me.templateAttachmentsNames = new Object();
		templateObj.eventData.Attachments.each(function (att){
			me.templateAttachmentsNames[att.Name] = att.Name;
		});
		//This service connects all attachments included in the template identified by {templateId} to the email item identified by {workItemId}
		Ext.Ajax.request({
		   url : 'rest/resource/template/'+templateObj.templateIdentifier+'/'+this.email.contextId+'?sessionId='+$W().wsSessionId,
		   method: 'POST',
		   success: function(response, opts) {
			   var result = Ext.decode(response.responseText);
	           	if(result.Succeeded){
	           		var attachmentsOnServer = me.processAttachmentsResponse(result.Attachments);
	           		var attachmentsCandidates = new Array();
	           		attachmentsOnServer.each(function(attachment){
	           			//check if id exists
	           			if(me.templateAttachmentsNames[attachment.name]){
	           				attachmentsCandidates.push(attachment);
	           			}
	           		});
	           		me.email.attachments = attachmentsCandidates;
	           		me.loadAttachments();
	           		//make sure the attachments panel is visible
            		me.setAttachmentsPanelEditMode();
	           	}
		   },
		   failure: function(response, opts) {
			   Jacada.Logger.debug('failed to apply template attachments');
		   }
		});
		
		this.getReply_Subject_Field().setValue(workItem.Subject);
		this.getPreviewMessageEditor().setValue(Base64.decode(workItem.Body));
	},
	loadTemplates: function(rootNode){
		var loader = Ext.create('Jacada.system.ui.email.TemplatesLoader');
		loader.loadTemplates(rootNode);
	},
	buildMessageEditor: function(){
		return {
			layout: 'fit',
			flex: 1,
			border: false,
			items: Ext.create('Jacada.system.ui.email.EmailHtmlEditor', {
					itemId: 'previewMessageEditor',
					flex: 1,
					name: 'HtmlBody',
					toolbarVisible: true
				})
		}
	},
	buildReplyMessageEditor: function(){
		var me = this;
		return {
			layout: 'fit',
			flex: 1,
			border: false,
			items: Ext.create('Jacada.system.ui.email.EmailHtmlEditor', {
					itemId: 'messageEditor',
					flex: 1,
					toolbarVisible: false,
			    	readOnly: true,
			    	enableSourceEdit: false,
			    	callback: function(_this){
			    		//handle attachments
						var attachmentsPanel = me.getAttachmentsPanel();
						if(me.email.originalAttachments && me.email.originalAttachments.size() > 0 && _this.totalInlineAttachments < me.email.originalAttachments.size()){
							me.loadAttachments();
							attachmentsPanel.hideDeleteButtons();
							attachmentsPanel.editMode(false);
							attachmentsPanel.show();
							me.getAttachmentsFileFormPanel().hide();
						}else{
							attachmentsPanel.hide();
						}
			    	}
				})
		}
	},
	loadEmail: function(email){
		this.email = email;
		this.getMessageEditor().email = email;
		this.getPreviewMessageEditor().email = email;
		this.email.originalAttachments = this.email.attachments;
		this.resetEmailPanels();
	},
	resetEmailPanels: function(){
		var me = this;
		this.getIncoming_From_Field().setValue(this.email['From']);
		this.getIncoming_To_Field().setValue(this.email['To']);
		this.getIncoming_CC_Field().setValue(this.email['Cc']);
		this.getIncoming_Subject_Field().setValue(this.email['Subject']);
		this.getIncoming_Sent_Field().setValue(this.email['Sent']);
		this.getComponent('templatesTreePickerPanel').setVisible(false);
		
		//Making another request to load message body
		//if it's a first call
		this.email.attachments = this.email.originalAttachments;
		if(this.email.originalBody){
			this.getMessageEditor().setValue(this.email.originalBody);
		}else{
			$W().mediaAPI.loadMessageBody(this.email.uniqueId, function(responseObject, opts){
				if(!responseObject) {
					return;
				}
				//we suppose to get plain html in responseText
				if(responseObject.responseText.indexOf('<html') != 0 && responseObject.responseText.indexOf('content="text/html') < 0){
					responseObject.responseText = responseObject.responseText.replace(/\n/g, '<br />');
				}

				me.email.originalBody = responseObject.responseText;
				me.getMessageEditor().setValue(me.email.originalBody);
			});
		}
		
		this.hideReplyPanels();
	},
	loadAttachments: function(){
		//Since we load from from scratch, let's remove all attachments.
		var me = this;
		var attachmentsPanel = this.getAttachmentsPanel();
		var uniqueId = this.email.uniqueId;
		Ext.suspendLayouts();
		attachmentsPanel.removeAllAttachments();
		this.email.attachments.each(function(attachmentData){
			if(!me.getMessageEditor().inlineAttachments[attachmentData.name]){
				attachmentsPanel.addAttachment(attachmentData, uniqueId);
			}
		});
		Ext.resumeLayouts(true);
	},
	setAttachmentsPanelEditMode: function(){
		this.getAttachmentsPanel().editMode(true);
		this.getAttachmentsPanel().show();
	},
	reply: function(){
		this.setReplyIn_Subject_Field();
		this.setReplyActionInSubject($W().localeManager.getLocalizationValue('application.javascript.email.subject.reply'));
		this.setContactsIn_To_Field();
		this.deleteAttachments();
		this.showReplyPanels();
		this.prepareReplyEditor();
		this.setAttachmentsPanelEditMode();
	},
	
	replyAll: function(){
		this.setReplyIn_Subject_Field();
		this.setReplyActionInSubject($W().localeManager.getLocalizationValue('application.javascript.email.subject.reply'));
		this.setContactsIn_To_Field(true);
		this.setContactsIn_CC_Field();
		this.deleteAttachments();
		this.showReplyPanels();
		this.prepareReplyEditor();
		this.setAttachmentsPanelEditMode();
	},
	
	deleteAttachments: function(){
		var me = this;
		var attachmentsToDelete = new Array();
		this.getAttachmentsPanel().getAttachmentsContainer().items.each(function(attachmentUI){
			attachmentsToDelete.push({Id:attachmentUI.attachmentId, Name:attachmentUI.attachmentName, Size: 0});
		});
		if(attachmentsToDelete.length == 0){
			//nothing to delete
			return;
		}
		
		Ext.Ajax.request({
		   url : $W().mediaAPI.getFileManagementPrefix() + '/delete/'+this.email.contextId,
		   method: 'POST',
		   jsonData: {attachments: attachmentsToDelete},
		   success: function(response, opts) {
			   	if(!response.responseText || response.responseText.length == 0){
			   		return;
			   	}
			   var result = Ext.decode(response.responseText);
	           	if(result.Succeeded){
	           		var attachmentsOnServer = me.processAttachmentsResponse(result.Attachments);
	           		var attachmentsCandidates = new Array();
	           		attachmentsOnServer.each(function(attachment){
	           			//check if id exists
	           			if(!me.templateAttachmentsNames || me.templateAttachmentsNames[attachment.name]){
	           				attachmentsCandidates.push(attachment);
	           			}
	           		});
	           		me.email.attachments = attachmentsCandidates;
	           		me.loadAttachments();
	           		//make sure the attachments panel is visible
            		me.setAttachmentsPanelEditMode();
	           	}
		   },
		   failure: function(response, opts) {
			   Jacada.Logger.debug('failed to delete attachments');
		   }
		});
	},
	
	forward: function(){
		Ext.suspendLayouts();
		this.setReplyIn_Subject_Field();
		this.setReplyActionInSubject($W().localeManager.getLocalizationValue('application.javascript.email.subject.forward'));
		this.clearContactsIn_To_Field();
		this.clearContactsIn_CC_Field();		
		this.showReplyPanels();
		this.prepareReplyEditor();
		this.loadAttachments();
		this.setAttachmentsPanelEditMode();
		this.getAttachmentsPanel().showDeleteButtons();
		Ext.resumeLayouts(true);
	},
	applySendEmailMask: function(){
		this.setLoading($W().localeManager.getLocalizationValue('application.javascript.email.sending'));
	},
	restoreOriginalEmailContext: function(){
		this.resetEmailPanels();
	},
	validateAndSendEmail: function(){
		var me = this;
		//validate email address before sending
		if(this.validateEmails()){
			//validate subject
			var subject = this.getReply_Subject_Field().getValue();
			if(!subject || subject.trim().length == 0){
				$W().HideCurrentVisibleTab();
    			Ext.Msg.show({
    				title: $W().localeManager.getLocalizationValue('application.javascript.email.validation.title'),
    				msg: $W().localeManager.getLocalizationValue('application.javascript.email.validation.subject'),
    				buttons: Ext.Msg.YESNO,
    				icon: Ext.Msg.WARNING,
    				buttonText: {
    			        yes: $W().localeManager.getLocalizationValue('application.javascript.email.validation.yes'),
    			        no: $W().localeManager.getLocalizationValue('application.javascript.email.validation.no')
    			    },
    				fn: function(buttonId){
    					if(buttonId == "yes"){
    						$W().cti._onMediaButtonClicked('sendEmail', $W().activeContext.email.uniqueId, 'email', me.getValues());
    					}
    					$W().ShowCurrentVisibleTab();
    				}
    			});
			}else{
				$W().cti._onMediaButtonClicked('sendEmail', $W().activeContext.email.uniqueId, 'email', this.getValues());
			}
		}
	},
	
	validateEmails: function(){
		//validate that at least one email is present
		var toEmails = this.getReply_To_Field().getValue().trim();
		var ccEmails = this.getReply_CC_Field().getValue().trim();
		if((!toEmails || toEmails.length == 0) 
				&& (!ccEmails || ccEmails.length == 0)){
			$W().HideCurrentVisibleTab();
			Ext.Msg.show({
				title: $W().localeManager.getLocalizationValue('application.javascript.email.validation.title'),
				msg: $W().localeManager.getLocalizationValue('application.javascript.email.validation.noRecipient'),
				buttons: Ext.Msg.OK,
				icon: Ext.Msg.WARNING,
				fn: function(){
					$W().ShowCurrentVisibleTab();
				}
			});
			return false;
		}
		var valid = this.validateEmail(toEmails, false, $W().localeManager.getLocalizationValue('application.javascript.email.to')); 
		if(!valid){
			return false;
		}
		valid = this.validateEmail(ccEmails, true, $W().localeManager.getLocalizationValue('application.javascript.email.cc')); 
		if(!valid){
			return false;
		}
		//all emails are valid
		return true;
	},
	
	validateEmail: function(email, allowBlank, fieldName){
		if((!email || email.length == 0) && allowBlank){
			return true;
		}
		var emails = email.split(/(, *|; *)/g);
		var emailAddress, msg, valid = true;
	    for (var i = 0; i < emails.length; i++) {
	    	//skipping repeating , and ; and if it's at the end of the string
	    	emailAddress = emails[i].replace(/"</, "\" <");
	    	//this test is because of the split side effect
	    	if(emailAddress.trim() == ';' || emailAddress.trim() == ',' || (emails.length > 0 && emailAddress.trim().length == 0)){
	    		continue;
	    	}
	    	if(emailAddress.indexOf("<") == 0 && (emailAddress.indexOf(">") == emailAddress.length-1)){
	    		emailAddress = emailAddress.substring(1,emailAddress.length-1);
	    	}
	    	emailAddressArray = emailAddress.split(' ');
	    	if(emailAddressArray.length > 1){
	    		//format to validate: Dekel Yaacov <dekel@gmail.com>
	    		for(var j = 0; j < emailAddressArray.length; j++){
	    			if(j == emailAddressArray.length - 1){
	    				//last cell should contain the email address e.g. <dekel@gmail.com>
	    				if(emailAddressArray[j].indexOf('@') == -1){
	    					valid = false;
	    					break;
	    				}else{
	    					//match group 1, e.g. from: <dekel@gmail.com> get: dekel@gmail.com
	    					var emailMatch = emailRegExGroup.exec(emailAddressArray[j]);
	    					if(!emailMatch){
	    						valid = false;
	    						break;
	    					}else{
	    						if(!emailRegEx.test(emailMatch[1])){
	    							valid = false;
	    							break;
	    						}
	    					}
	    				}
	    			}else{
	    				if(!nameRegEx.test(emailAddressArray[j].replace(/'/g, "\"").replace(/"/g, ""))){
	    					valid = false;
	    					break;
	    				}
	    			}
	    		}
	    	} else if(!emailRegEx.test(emailAddress)){
	    		//format to validate: dekel@gmail.com
	    		valid = false;
    		}
	    	
	    	if(!valid){
	    		Jacada.Logger.error(emailAddress+ " is not a valid email address");
    			valid = false;
    			msg = $W().localeManager.getLocalizationValue('application.javascript.email.validation.msg');
    			msg = Ext.String.format(msg, fieldName);
    			$W().HideCurrentVisibleTab();
    			Ext.Msg.show({
    				title: $W().localeManager.getLocalizationValue('application.javascript.email.validation.title'),
    				msg: msg,
    				buttons: Ext.Msg.OK,
    				icon: Ext.Msg.WARNING,
    				fn: function(){
    					$W().ShowCurrentVisibleTab();
    				}
    			});
    			//break the loop
    			return false;
	    	}
		}
		return valid;
	},
	uploadAttachment: function(field, value){
		var me = this;
		var form = this.getAttachmentsFileFormPanel();
		Jacada.Logger.debug("Uploading file " + value + ' for ' + me.email.uniqueId);
		form.submit({
            url: $W().mediaAPI.getFileManagementPrefix() + '/' + me.email.uniqueId,
            waitMsg: 'Uploading your file...',
            success: function(fp, action) {
		    	Jacada.Logger.debug('Upload response: ' + action.response.responseText);
            	var result = Ext.decode(action.response.responseText);
            	result.serviceResponse = Ext.decode(result.serviceResponse);
            	if(result.serviceResponse.Succeeded){
            		me.email.attachments = me.processAttachmentsResponse(result.serviceResponse.Attachments);
            		me.loadAttachments();
            		//make sure the attachments panel is visible
            		me.setAttachmentsPanelEditMode();
            	}else{
            		Ext.Msg.alert('Failure', result.serviceResponse.Message);
            	}
            },
            failure: function(fp, action) {
            	Jacada.Logger.debug('Failed upload response: ' + action.response.responseText);
            	var result = Ext.decode(action.response.responseText);
            	switch (action.failureType) {
                case Ext.form.action.Action.CLIENT_INVALID:
                    Ext.Msg.alert('Failure', 'Form fields may not be submitted with invalid values');
                    break;
                case Ext.form.action.Action.CONNECT_FAILURE:
                    Ext.Msg.alert('Failure', 'Ajax communication failed');
                    break;
                case Ext.form.action.Action.SERVER_INVALID:
                	Ext.Msg.show({
                	       title      : 'Failure',
                	       msg        : result.serviceResponse,
                	       width      : 250,
                	       buttons    : Ext.MessageBox.OK,
                	       icon       : Ext.MessageBox.WARNING
                	    })
                	break;
            	}
            }
        });
	},
	deleteAttachment: function(uniqueId, attachmentId, attachmentName){
		var me = this;
		var url = $W().mediaAPI.getFileManagementPrefix() + '/' + uniqueId;
		if(attachmentId){
			url += '/' + attachmentId + '/' + attachmentName;
			Jacada.Logger.debug("Deleting file " + url);
		}else{
			Jacada.Logger.debug("Deleting all attachments for " + url);
		}
		Ext.Ajax.request({
			url : url,
			method: 'DELETE',
		    success: function(response){
		    	Jacada.Logger.debug('Delete response: ' + response.responseText);
	    		var result = [];
	    		if(response.responseText){
	    			result = Ext.decode(response.responseText);
	    		}
	    		if(result.Succeeded){
	    			Jacada.Logger.debug('Sucessfully delete attachment: ' + attachmentName);
	    			me.getAttachmentsPanel().removeAttachment(attachmentId);
	    		}else{
	    			Ext.Msg.alert('Failure', result.Message);
	    		}
		    },
		    failure: function(response){
		    	Jacada.Logger.debug('Failed delete response: ' + response.responseText);
		    	Ext.Msg.alert('Failure', response.responseText);
		    }
		});
	},
	processAttachmentsResponse: function(upperAttachments){
		var attachment, attachments = [];
		if (upperAttachments) {
			upperAttachments.each(function(upperAttachments){
				attachment = {};
				attachment.id = upperAttachments.Id;
				attachment.name = upperAttachments.Name;
				attachment.size = upperAttachments.Size;
				attachments.push(attachment);
			});
		}
		return attachments;
		
	},
	
	showReplyPanels: function(){
		this.hideIncomingMessagePanels();
		this.getComponent('replyMessagePanel').show();
		this.getPreviewMessageEditor().up().show();
		this.getComponent('templatesTreePickerPanel').setVisible(true);
		var templatesTreePicker = this.getComponent('templatesTreePickerPanel').getComponent('templatesTreePicker');
		var rootNode = templatesTreePicker.getPicker().getRootNode();
		rootNode.data.text = $W().localeManager.getLocalizationValue('application.javascript.email.templates.root');
		this.loadTemplates(rootNode);
	},
	hideReplyPanels: function(){
		this.showIncomingMessagePanels();
		this.getPreviewMessageEditor().up().hide();
		this.getComponent('replyMessagePanel').hide();
	},
	hideIncomingMessagePanels: function(){
		this.getComponent('incomingMessagePanel').hide();		
	},
	showIncomingMessagePanels: function(){
		this.getComponent('incomingMessagePanel').show();		
	},
	prepareReplyEditor: function(){
		var editor = this.getMessageEditor();
		editor.setValue('<b>' + $W().localeManager.getLocalizationValue('application.javascript.email.from') + ':</b> '  + Ext.String.htmlEncode(this.email["From"])
				+ '<br/><b>' + $W().localeManager.getLocalizationValue('application.javascript.email.sent') + ':</b> '  +  this.email['Sent']
				+ '<br/><b>' + $W().localeManager.getLocalizationValue('application.javascript.email.to') + ':</b> '  +  Ext.String.htmlEncode(this.email['To'])
				+ '<br/><b>' + $W().localeManager.getLocalizationValue('application.javascript.email.cc') + ':</b> '  +  Ext.String.htmlEncode(this.email['Cc'])
				+ '<br/><b>' + $W().localeManager.getLocalizationValue('application.javascript.email.subject') + ':</b> '  +  this.email['Subject']
				+ '<br/><br/>' + editor.getValue());
	},
	
	setReplyIn_Subject_Field: function(){
		this.getReply_Subject_Field().setValue(this.email['Subject']);
	},
	
	setReplyActionInSubject: function(action){
		this.getReply_Subject_Field().setValue(action +' '+ this.getReply_Subject_Field().getValue());
	},
	
	setContactsIn_To_Field: function(copyPrev){
		//TODO MISHA We will need to strip all emails that belong to queues
		//for example: avaya@jacada.com

		var emails = this.email['From'];
		if(copyPrev){
			emails += ', ' + this.email['To']
		}
		this.getReply_To_Field().setValue(emails);
	},
	
	setContactsIn_CC_Field: function(){
		this.getReply_CC_Field().setValue(this.email['Cc']);
	},
	
	clearContactsIn_To_Field: function(){
		var field = this.getReply_To_Field();
		field.reset();
	},
	
	clearContactsIn_CC_Field: function(){
		var field = this.getReply_CC_Field();
		field.reset();
	},
	
	getReply_Subject_Field: function(){
		return this.getComponent("replyMessagePanel").getComponent("replySubject");
	},
	
	getReply_To_Field: function(){
		return this.getComponent('replyMessagePanel').getComponent('replyToField');
	},
	
	getReply_CC_Field: function(){
		return this.getComponent('replyMessagePanel').getComponent('replyCCField');
	},
	
	getMessageEditor: function (){
		return this.down('#messageEditor');
	},
	getPreviewMessageEditor: function (){
		return this.down('#previewMessageEditor');
	},
	getAttachmentsPanel: function(){
		return this.getComponent('attachmentsPanel');
	},
	getAttachmentsFileFormPanel: function(){
		return this.getAttachmentsPanel().getComponent('attachFileFormPanel');
	},
	getIncoming_From_Field: function(){
		return this.getComponent('incomingMessagePanel').getComponent('incomingFromField');
	},
	
	getIncoming_To_Field: function(){
		return this.getComponent('incomingMessagePanel').getComponent('incomingToField');
	},
	
	getIncoming_CC_Field: function(){
		return this.getComponent('incomingMessagePanel').getComponent('incomingCCField');
	},
	
	getIncoming_Subject_Field: function(){
		return this.getComponent('incomingMessagePanel').getComponent('incomingSubjectField');
	},
	
	getIncoming_Sent_Field: function(){
		return this.getComponent('incomingMessagePanel').getComponent('incomingSentField');
	}
	
});

$W().openDirectoryWindow = function (fieldToSet, fieldName){
	var emailInfoTab = Ext.getCmp('contextContentPanel').getTab('EmailInfoTab' + $W().activeContext.groupId, $W().activeContext.groupId);
	var emailInfoPanel = emailInfoTab.items.items[0].child();
	fieldToSet = emailInfoPanel.getComponent('replyMessagePanel').getComponent(fieldToSet);
	Ext.create('Ext.window.Window', {
           title: Ext.String.format($W().localeManager.getLocalizationValue('application.javascript.directory.search.title'), $W().localeManager.getLocalizationValue(fieldName)),
           height: 500,
           minHeight: 500,
           width: 500,
           minWidth: 500,
           modal: true,
           constrain: true,
           layout: 'fit',
           items: Ext.create('Jacada.system.ui.directory.DirectoryPanel',{fieldToSet: fieldToSet})
       }).show();
}
