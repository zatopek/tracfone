Ext.define('Jacada.system.ui.tests.PushMsgTest', {
	extend : 'Ext.panel.Panel',

	URL: $W().CONTEXT_PATH + '/testPortlet.json',
	
	initComponent : function() {
		var me = this;
		Ext.applyIf(me, {
			title: 'Push Message',
			height: '100%',
			width: '100%',
			layout: {
				type: 'vbox',
				align: 'stretch'
			},
			tbar: [
			    {
					text : 'Send Push',
					scope: this,
					handler : this.sendPushMessage
			    }
			],
			items: [
			    {
					xtype : 'textfield',
					fieldLabel : 'Key',
					id : 'pushKey',
					itemId : 'pushKey'
			    },
			    {
					xtype : 'textfield',
					fieldLabel : 'Data',
					id : 'pushData',
					itemId : 'pushData'
			    }
			]
		});
		me.callParent(arguments);
	},
	
	sendPushMessage: function(){
		var key = this.getComponent('pushKey').getValue();
		var data = this.getComponent('pushData').getValue();
		var conn = Ext.create('Ext.data.Connection');
		// get all work order addresses from server
		conn.request({
	        url: this.URL,
	        method: 'POST',
	        params: { method: "sendPushMessage", key:key, data:data},
	        failure: function() {
	             alert('Failed');
	        }
	    });
	}
});
