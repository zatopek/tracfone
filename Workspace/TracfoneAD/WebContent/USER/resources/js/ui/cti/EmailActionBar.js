Ext.define('Jacada.user.ui.cti.EmailActionBar', {
	    extend: 'Ext.panel.Panel',
	    
	    itemId: 'emailActionBar',
	    height: '100%',
		border: false,
		layout: {
			type: 'hbox',
			align: 'middle'
		},
		defaults:{
			margin: '0 0 0 0',
			padding: 0,
			xtype:'button',
			ui: 'default-toolbar',//give it a toolbar button style
			scale: 'medium',
			minWidth: '24px',
			iconAlign: 'top',
			cls: 'cti-btn'
		},
		
		items: [
			{			  
				id: 'replyEmailBtn',
				itemId: 'replyEmailBtn',
				iconCls: 'emailReplyBtnIcon',
				text: $W().localeManager.getLocalizationValue('application.javascript.email.reply'),
				handler: function(){
					$W().cti._onMediaButtonClicked('replyEmail', $W().activeContext.email.uniqueId, 'email');
				}
			},
			{			  
				id: 'replyAllEmailBtn',
				itemId: 'replyAllEmailBtn',
				iconCls: 'emailReplyAllBtnIcon',
				text: $W().localeManager.getLocalizationValue('application.javascript.email.replyall'),
				handler: function(){
					$W().cti._onMediaButtonClicked('replyAllEmail', $W().activeContext.email.uniqueId, 'email');
				}
			},
			{			  
				id: 'forwardEmailBtn',
				itemId: 'forwardEmailBtn',
				iconCls: 'emailForwardBtnIcon',
				text: $W().localeManager.getLocalizationValue('application.javascript.email.forward'),
				handler: function(){
					$W().cti._onMediaButtonClicked('forwardEmail', $W().activeContext.email.uniqueId, 'email');
				
				}
			},
			{			  
				id: 'sendEmailBtn',
				itemId: 'sendEmailBtn',
				iconCls: 'emailSendBtnIcon',
				text: $W().localeManager.getLocalizationValue('application.javascript.email.send'),
				handler: function(){
					var emailInfoTab = this.up('#emailActionBar').getEmailInfoPanel();
					if(emailInfoTab){
						emailInfoTab.validateAndSendEmail();
					}
				}
			},
			{			  
				id: 'completeEmailBtn',
				itemId: 'completeEmailBtn',
				iconCls: 'closeIcon',
				text: $W().localeManager.getLocalizationValue('application.javascript.email.complete'),
				handler: function(){
					this.up('#emailActionBar').closeCompleteBtnHandler('completeEmail');
				}
			},
			{			  
				xtype: 'splitbutton',
				id: 'closeCompleteEmailBtn',
				itemId: 'closeCompleteEmailBtn',
				iconCls: 'closeIcon',
				text: $W().localeManager.getLocalizationValue('application.javascript.email.close'),
				handler: function(){
					this.up('#emailActionBar').closeCompleteBtnHandler('closeEditEmail');
				},
				menu: [
				    {
						id: 'closeEditEmailMenuBtn',
						itemId: 'closeEditEmailMenuBtn',
						text: $W().localeManager.getLocalizationValue('application.javascript.email.close'),
						handler: function(){
							this.up('#emailActionBar').closeCompleteBtnHandler('closeEditEmail');
						}
				    },
				    {
						id: 'completeEmailMenuBtn',
						itemId: 'completeEmailMenuBtn',
						text: $W().localeManager.getLocalizationValue('application.javascript.email.complete'),
						handler: function(){
							this.up('#emailActionBar').closeCompleteBtnHandler('completeEmail');
						}
				    }
				],
				listeners:{
					menushow: function(_this, menu, eOpts){
	    				$W().HideCurrentVisibleTab();
	    			},
	    			menuhide: function(_this, menu, eOpts){
	    				$W().ShowCurrentVisibleTab();
	    			}
	    		}
			}
		],
		listeners:{
			refreshActionBar: function(actionBar, eOpts){
			}
		},
		
		initComponent: function(){
			var me = this;
	        me.callParent(arguments);
	        me.registerPushMessages();
		},
		closeCompleteBtnHandler: function(operation){
			$W().HideCurrentVisibleTab();
			Ext.Msg.show({
				msg: $W().localeManager.getLocalizationValue('application.javascript.email.close.confirmation'),
				buttons: Ext.MessageBox.YESNO,
				icon: Ext.Msg.QUESTION,
				modal: true,
				fn: function(buttonId, text, opt){
					if(buttonId == 'yes'){
						$W().cti._onMediaButtonClicked(operation, $W().activeContext.email.uniqueId,
								'email', {completionStatus:$W().mediaCompletionStatus.Successful});
					}
					$W().ShowCurrentVisibleTab();
				}
			});
		},
		registerPushMessages: function(){
			
		},
		getEmailInfoPanel: function(){
			var emailInfoTab = Ext.getCmp('contextContentPanel').getTab('EmailInfoTab' + $W().activeContext.groupId, $W().activeContext.groupId);
			if(emailInfoTab){
				return emailInfoTab.items.items[0].child();
			}else{
				Jacada.Logger.error("could not find EmailInfoTab. activeContext.groupId:" + $W().activeContext.groupId);
			}
		}
		
	});    