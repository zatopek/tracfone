Ext.define('Jacada.system.ui.core.LogoutDialog', {
    extend: 'Ext.window.Window',
    
    id: 'logoutDialog',
    height: 485,
	width: 760,
	resizable: false,
	header: false,
	border: false,
	shadow: false,
    modal: true,
    layout: 'fit',
    cls: "workspaceDialog",
    
    initComponent: function() {
	    var me = this;
	    Ext.applyIf(me, {
	    	items: { 
        height: '100%',
			    border: false,

			    // Fields will be arranged vertically, stretched to full width
			    layout: {
			    	type: 'vbox',
			    	align: 'stretch'
			    },
			    defaults: {
			        border: false
			    },
			    items: [{
			    	xtype: 'panel',
			    	bodyCls : 'logo-panel',
			    	height: 149
			    },{
			    	xtype: 'panel',
			    	bodyCls : 'form-panel',
			    	flex: 1,
			    	layout: {
				    	type: 'vbox',
				    	align: 'center'
				    },
			    	items:[
			    	       {
			    	    	   xtype: 'panel',
			    	    	   html: Jacada.Utils.format($W().localeManager.getLocalizationValue('application.javascript.logout.label.goodbye'), $W().agentName),
			    	    	   bodyCls : 'form-panel-main-title',
			    	    	   border: false,
			    	    	   width: 500,
			    	    	   margin: '0 0 48 0'
			    	       },
			    	       {
			    	    	   xtype: 'panel',
			    	    	   html: $W().localeManager.getLocalizationValue('application.javascript.logout.label.reasonForLeaving'),
			    	    	   bodyCls : 'form-panel-sub-title',
			    	    	   border: false
			    	       },
			    	       {
			    	       		xtype: 'panel',
			    	       		layout: 'vbox',
			    	       		bodyStyle : 'background:none; ',
			    	       		padding: '26 0 0 0',
			    	       		border: false,
			    	       		items:[
				    	       		{
				    	       			xtype: 'combo',
				    	       			padding: '0 0 18 0',
				    	       			itemId: 'reason',
				    	       			cls: 'login-form-field-user',
				    	       			store: me.createReasonStore(),
									    queryMode: 'local',
									    displayField: 'name',
									    valueField: 'code',
									    editable: false,
									    value: "9999"
				    	       		},{
				    	       			layout: 'column',
				    	       			bodyStyle : 'background:none; ',
				    	       			border: false,
				    	       			items: [
				    	       				{
						    	       			xtype: 'button',
						    	       			height: 44,
											    text: $W().localeManager.getLocalizationValue('application.javascript.logout.button.logout'),
											    cls: 'btn-ok-big',
											    margin: '0 10 0 0',
											    handler: function() {
											    	$W().logout(false, me.down('#reason').getValue(), true);
											    }
				    	       				},{
						    	       			xtype: 'button',
						    	       			height: 44,
											    text: $W().localeManager.getLocalizationValue('application.javascript.logout.button.cancel'),
											    cls: 'btn-cancel-big',
											    handler: function() {
											    	$W().ShowCurrentVisibleTab();
											    	$W().getTab().show();
											    	me.close();
											    }
										    }
				    	       			]
				    	       		}
			    	       		]
							    
							}
					
			    	  ]
			    	}
			    ] 
    }
	    });
	    me.callParent(arguments);
	},
	
	createReasonStore: function(){
		return Ext.create('Ext.data.Store', {
		    fields: ['code', 'name'],
		    data : [
		        {"code":"9995", "name":$W().localeManager.getLocalizationValue('application.javascript.logout.combo.restroom')},
		        {"code":"9997", "name":$W().localeManager.getLocalizationValue('application.javascript.logout.combo.lunch')},
		        {"code":"9998", "name":$W().localeManager.getLocalizationValue('application.javascript.logout.combo.break')},
		        {"code":"9999", "name":$W().localeManager.getLocalizationValue('application.javascript.logout.combo.endOfShift')}
		    ]
			});
			
	}

});