Ext.define('Jacada.system.ui.tests.WorkSpaceAPIPanel', {
	extend : 'Ext.panel.Panel',

	initComponent : function() {
		var me = this;
		Ext.applyIf(me, {
			title: 'WorkSpace API',
			layout: {
				type: 'vbox',
				align: 'stretch'
			},
            defaults:{
            	xtype: 'button',
            	margin:'5 10 2 10'
            },
            items : [
						{
							xtype : 'textfield',
							fieldLabel : 'Tab Id',
							itemId : 'tabId'
						},
						{
							xtype : 'numberfield',
							fieldLabel : 'Tab Index',
							itemId : 'tabIndex'
						},
						{
							xtype: 'textarea',
							 grow: true,
							 itemId: 'tabConfigNest',
						        width: 300,
						        fieldLabel: 'Tab Config (for Add Nested Tab)',
						        value: "{\n"
					        	+ "'isWeb':false,\n"
					        	+ "'title':'New Hosting Tab',\n"
					        	+ "'tabId':'newNostingTabId',\n"
					        	+ "'closable':true,\n"
					        	+ "'maximizable':true,\n"
					        	+ "'exeName':'calc.exe',\n"
					        	+ "'workingDirectory':'c:/windows/system32',\n"
					        	+ "'arguments':'',\n"
					        	+ "'exeNameRegKey':'',\n"
					        	+ "'workingDirectoryRegKey':'',\n"
					        	+ "'argumentsRegKey':'',\n"
					        	+ "'backgroundColor':'800080',\n"
					        	+ "'linkCaption':'',\n"
					        	+ "'detectBusy':false,\n"
					        	+ "'busyMessage':'',\n"
					        	+ "'showLoadMsg':false,\n"
					        	+ "'loadingMsg':'',\n"
					        	+ "'enableScrollbars':false,\n"
					        	+ "'avoidPlaceInsideHost':'',\n"
					        	+ "'recreateApp':false,\n"
					        	+ "'alwaysHideWin':'',\n"
					        	+ "'centerApps':'',\n"
					        	+ "'showWindowInCorrectTab':''\n"
					        	+ "}"
						},
						   {
							   xtype: 'textarea',
						        grow: true,
						        itemId: 'tabConfig',
						        width: 300,
						        fieldLabel: 'Tab Config (for Add Web Tab)',
						        value: "{\n"
						        	+ "'isWeb':true, \n"
						        	+ "'title':'New Tab', \n"
						        	+ "'tabId':'newTabId', \n"
						        	+ "'frameId':'newTabFrameId', \n"
						        	+ "'closable':true, \n"
						        	+ "'maximizable':true, \n"
						        	+ "'url':'Jacada.user.ui.sample.SamplePortlet' \n"
						        	+ "}"
						   }
				],
				tbar: [
						{
							text : 'Find Component',
							handler : function() {
								var childPanel = Ext.getCmp('workSpaceUI').queryById(me.getComponent('tabId').getRawValue());
								alert(childPanel);
							}
						},
						{
							text : 'Show',
							handler : function() {
								$W().ShowTabById(me.getComponent('tabId').getRawValue());
							}
						},
						{
							text : 'Hide',
							handler : function() {
								$W().HideTabById(me.getComponent('tabId').getRawValue());
							}
						},
						{
							text : 'Remove',
							handler : function() {
								$W().RemoveTabById(me.getComponent('tabId').getRawValue());
							}
						},
						{
							text : 'Add Web',
							handler : function() {
								var tabConfig = eval("(" + me.getComponent('tabConfig').getRawValue() + ");");
								$W().AddNewTab(tabConfig, parseInt(me.getComponent('tabIndex').getRawValue()));
							}
						},
						{
						text : 'Add Nested',
							handler : function() {
								var tabConfig = eval("(" + me.getComponent('tabConfigNest').getRawValue() + ");");
								$W().AddNewTab(tabConfig, parseInt(me.getComponent('tabIndex').getRawValue()));
							}
						}
				],
				bbar: [
						{
							text : 'isApplicationRunning',
							handler : function() {
								alert($W().isApplicationRunning(me.getComponent('tabId').getRawValue()));
							}
						},
						{
							text : 'runApplication',
							handler : function() {
								alert("process id=" + $W().runApplication(me.getComponent('tabId').getRawValue(), 'calc.exe', 'c:/windows/system32'));
							}
						},
						{
							text : 'terminateApplication',
							handler : function() {
								alert($W().terminateApplication(me.getComponent('tabId').getRawValue()));
							}
						}
				]
		});
		me.callParent(arguments);
	}

});