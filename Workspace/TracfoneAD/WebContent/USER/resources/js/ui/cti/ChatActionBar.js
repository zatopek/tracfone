Ext.define('Jacada.user.ui.cti.ChatActionBar', {
	    extend: 'Ext.panel.Panel',
	    
	    itemId: 'chatActionBar',
	    height: '100%',
		border: false,
		layout: {
			type: 'hbox',
			align: 'middle'
		},
		defaults:{
			margin: '0 5 0 0',
			xtype:'button',
			ui: 'default-toolbar',//give it a toolbar button style
			scale: 'medium',
			minWidth: '24px',
			iconAlign: 'top',
			cls: 'cti-btn'
		},
		
		items: [
			{			  
				xtype: 'splitbutton',
				id: 'closeChatBtn',
				itemId: 'closeChatBtn',
				iconCls: 'closeIcon',
				text: $W().localeManager.getLocalizationValue('application.javascript.chat.complete.button'),
				handler: function(){
					this.up('#chatActionBar').closeBtnHandler($W().mediaCompletionStatus.Successful);
				},
				menu: {
					xtype: 'menu',
					items: [
					    {
							id: 'closeSuccessfulChatMenuBtn',
							itemId: 'closeSuccessfulChatMenuBtn',
							text: $W().localeManager.getLocalizationValue('application.javascript.chat.complete.successful'),
							handler: function(){
								this.up('#chatActionBar').closeBtnHandler($W().mediaCompletionStatus.Successful);
							}
					    },
					    {
							id: 'closeFailedChatMenuBtn',
							itemId: 'closeFailedChatMenuBtn',
							text: $W().localeManager.getLocalizationValue('application.javascript.chat.complete.failed'),
							handler: function(){
								this.up('#chatActionBar').closeBtnHandler($W().mediaCompletionStatus.Failed);
							}
					    }
					],
					listeners:{
						'mouseleave': function( menu, e, eOpts){
					          menu.hide();
					    }
					}
				},
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
		},
		closeBtnHandler: function(completionStatus){
			var groupId = Ext.getCmp('contextNavigation').buildChatGroupId($W().activeContext.chat.interactionId);
			var chatPanel = $W().cti.getChatInfoPanel(groupId);
			if(!chatPanel){
				$W().LogManager.getLogger("ChatActionBar.js").error("Could not find chat panel of " + $W().activeContext.chat.interactionId);
				return;
			}
			var msg;
			if(chatPanel.isChatClosed()){
				msg = $W().localeManager.getLocalizationValue('application.javascript.chat.complete.confirmation');
			}else{
				msg = $W().localeManager.getLocalizationValue('application.javascript.chat.complete.active.confirmation');
			}
			var reason = $W().localeManager.getLocalizationValue('application.javascript.chat.complete.' + completionStatus);
			msg = Ext.String.format(msg, completionStatus);
			$W().HideCurrentVisibleTab();
			Ext.Msg.show({
				msg: msg,
				buttons: Ext.MessageBox.YESNO,
				icon: Ext.Msg.QUESTION,
				modal: true,
				fn: function(buttonId, text, opt){
					if(buttonId == 'yes'){
						$W().cti._onMediaButtonClicked('closeChat', 
								$W().activeContext.chat.uniqueId, 'chat', {completionStatus:completionStatus});
					}
					$W().ShowCurrentVisibleTab();
				}
			});
		}
	});    