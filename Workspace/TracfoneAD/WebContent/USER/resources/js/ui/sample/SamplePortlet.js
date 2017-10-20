
//JMC URL: Jacada.user.ui.sample.SamplePortlet
Ext.define('Jacada.user.ui.sample.SamplePortlet', {
	extend : 'Ext.panel.Panel',

	
	defaults: {//applies to all children
		border: false,
		padding: 10
	},
	
	initComponent : function() {
		var me = this;
		Ext.applyIf(me, {
			layout: 'vbox',
			items: [me.createHeaderPanel(), me.createFooterPanel()]
		});
		me.callParent(arguments);
	},

	createHeaderPanel: function(){
		return {
			html: $W().localeManager.getLocalizationValue('application.javascript.portlet.samplePortlet.content.header')
		};
	},
	
	createFooterPanel: function(){
		return {
			html: $W().localeManager.getLocalizationValue('application.javascript.portlet.samplePortlet.content.footer')
		};
	}

});