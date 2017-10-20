//JMC URL: Jacada.system.ui.tests.TestPanel
Ext.define('Jacada.system.ui.tests.TestPanel', {
	extend : 'Ext.panel.Panel',

	initComponent : function() {
		var me = this;
		Ext.applyIf(me, {
			layout: 'fit',
			items: [
					Ext.create('Ext.tab.Panel', {
						defaults:{
							padding: 10
						},
					    items: [
					        Ext.create('Jacada.system.ui.tests.DynamicViewsTestPanel'),
					    	Ext.create('Jacada.system.ui.tests.WorkSpaceAPIPanel'),
						    Ext.create('Jacada.system.ui.tests.JIAServicesPanel'),
						    Ext.create('Jacada.system.ui.tests.JIAAPIPanel'),
						    Ext.create('Jacada.system.ui.tests.PushMsgTest')
					   ]
					})
				]
		});
		me.callParent(arguments);
	}

});