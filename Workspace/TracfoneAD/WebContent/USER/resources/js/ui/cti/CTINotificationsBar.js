Ext.define('Jacada.user.ui.cti.CTINotificationsBar', {
	    extend: 'Ext.panel.Panel',
	    
	    itemId: 'notificationsBar',
	    flex: 1,
		border: false,
		layout: {
			type: 'hbox',
			align: 'middle'
		},
		
		initComponent: function(){
			var me = this;
			var answerChatBtn = me.createNotificationButton('answerChatBtn', $W().UserCTIRoles.CTIStartUser, 'incomingChatNotifIcon', $W().localeManager.getLocalizationValue('application.javascript.ctiBar.notification.chat'));
			var answerOpenMediaBtn = me.createNotificationButton('answerOpenMediaBtn', $W().UserCTIRoles.CTIStartUser && $W().ctiSettings.customItemsEnabled, 'workItemNotifBtnIcon', $W().localeManager.getLocalizationValue('application.javascript.ctiBar.notification.workItem')) ;
			var answerEmailBtn = me.createNotificationButton('answerEmailBtn', $W().UserCTIRoles.CTIStartUser, 'incomingEmailNotifIcon', $W().localeManager.getLocalizationValue('application.javascript.ctiBar.notification.email'));
			var answerBtn = me.createNotificationButton('answerBtn', $W().UserCTIRoles.CTIStartUser, 'incomingCallNotifIcon', $W().localeManager.getLocalizationValue('application.javascript.ctiBar.notification.incomingCall')); 
			
			var items = [];
			items.push(answerChatBtn);
			items.push(answerOpenMediaBtn);
			items.push(answerEmailBtn);
			items.push(answerBtn);
			
	        Ext.applyIf(me, {
	        	items: items
	        });
	        me.callParent(arguments);
		},
		createNotificationButton: function(id, allowed, iconCls, tooltip){
			return Ext.create('Jacada.core.NotificationButton', {
    			id: id,
				itemId: id,
    			allowed: allowed,
    			iconCls: iconCls,
    			tooltip: tooltip,
    			margin: '0 0 0 0',
    			xtype:'button',
    			ui: 'default-toolbar',//give it a toolbar button style
    			scale: 'medium',
    			iconAlign: 'top',
    			disabled: true,
    			handler: $W().cti.notificationButtonHandler
    		});
		}
	});    