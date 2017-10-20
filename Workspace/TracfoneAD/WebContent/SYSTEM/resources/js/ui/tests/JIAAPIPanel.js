Ext.define('Jacada.system.ui.tests.JIAAPIPanel', {
	extend : 'Ext.panel.Panel',

	initComponent : function() {
		var me = this;
		Ext.applyIf(me, {
			title: 'JIA Automation',
			layout:{
				type: 'vbox',
				align:'stretchmax'
			},
            defaults:{
            	xtype: 'button',
            	margin:'5 0 2 10'
            },
			height: '100%',
			width: '100%',
			items: [
				{
					xtype : 'textfield',
					fieldLabel : 'Tab Id',
					itemId : 'tabId'
				},
		        {
					text: 'getNumOfTabs',
				    handler: function() {
				        alert($W().getNumOfTabs());
				    }
		        },
		        {
					text: 'getSelectedTabId',
				    handler: function() {
				        alert($W().getSelectedTabId());
				    }
		        },
		        {
					text: 'setSelectedTabId',
				    handler: function() {
				        $W().setSelectedTabId(me.getComponent('tabId').getRawValue());
				    }
		        },
		        {
					text: 'getTabIds',
				    handler: function() {
				        alert($W().getTabIds());
				    }
		        },
		        {
					text: 'isSelectedTab',
				    handler: function() {
				        alert($W().isSelectedTab(me.getComponent('tabId').getRawValue()));
				    }
		        },
		        {
					text: 'isTabMaximized',
				    handler: function() {
				        alert($W().isTabMaximized(me.getComponent('tabId').getRawValue()));
				    }
		        },
		        {
					text: 'maximizeSelectedTab (auto restore)',
				    handler: function() {
				    	setTimeout(function(){$W().restoreSelectedTab(me.getComponent('tabId').getRawValue())},4000);
				        $W().maximizeSelectedTab(me.getComponent('tabId').getRawValue());
				    }
		        },
		        {
					text: 'getHostingIdOfTab',
				    handler: function() {
				        alert($W().getHostingIdOfTab(me.getComponent('tabId').getRawValue()));
				    }
		        },
		        {
					text: 'getExecutableNameOfHosting',
				    handler: function() {
				        alert($W().getExecutableNameOfHosting($W().getHostingIdOfTab(me.getComponent('tabId').getRawValue())));
				    }
		        },
		        {
					text: 'getWorkingDirOfHosting',
				    handler: function() {
				        alert($W().getWorkingDirOfHosting($W().getHostingIdOfTab(me.getComponent('tabId').getRawValue())));
				    }
		        },
		        {
					text: 'getArgumentsOfHosting',
				    handler: function() {
				        alert($W().getArgumentsOfHosting($W().getHostingIdOfTab(me.getComponent('tabId').getRawValue())));
				    }
		        },
		        {
					text: 'getSessionId',
				    handler: function() {
				        alert($W().getSessionId());
				    }
		        },
		        {
					text: 'logoutUser',
				    handler: function() {
				        $W().logoutUser();
				    }
		        },
		        {
					text: 'terminateApplication',
				    handler: function() {
				        $W().terminateApplication(me.getComponent('tabId').getRawValue());
				    }
		        },
		        {
					text: 'isProcessRunning',
				    handler: function() {
				        alert($W().isProcessRunning(me.getComponent('tabId').getRawValue()));
				    }
		        },{
					text: 'getPageUrl',
				    handler: function() {
				        alert($W().getPageUrl(me.getComponent('tabId').getRawValue()));
				    }
		        }
		        
			]
		});
		me.callParent(arguments);
	}

});