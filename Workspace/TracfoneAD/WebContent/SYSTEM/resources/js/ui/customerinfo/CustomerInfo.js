Ext.define('Jacada.system.ui.customerinfo.CustomerInfo', {
	extend : 'Ext.form.Panel',

	height : '100%',
	layout : 'column',
	border : false,
	defaults : {
		bodyPadding : 10,
		border : false
	},
	
	//will keep push handler that we will need to unregister
	//on destroy
	handler: null,
	
	initComponent : function() {
		var me = this;
		Ext.applyIf(me, {
        	listeners:{
        		contextDataChanged: function(interactionType, data, dataType){
        			if(dataType == 'customerInfo'){
        				me.loadCustomerInfo(data.contact.attributes, interactionType);
        			}
        		}
        	},
        	items: me.buildFormPanelItems()
        });
		me.callParent(arguments);
		Ext.getCmp('contextNavigation').registerContextListener(me);
	},
	onCustomerInfoUpdate: function(data){
		Jacada.Logger.debug("CustomerInfo - got info from server " + data);
		data = Ext.JSON.decode(data);
		$W().customerInfo = data;
		this.loadCustomerInfo(data.contact, data.interactionType);
	},
	loadCustomerInfo: function(info, interactionType){
		for (var property in info) {
		    if (info.hasOwnProperty(property)) {
		    	var field = this.down("#"+property);
		    	if(field){
		    		field.setValue(info[property]);
		    	}
		    }
		}
	},
	buildFormPanelItems: function(){
		var me = this;
		return [ {
    		columnWidth : .5,
    		padding : '0 0 20 0',
    		layout : {
    			type : 'vbox',
    			align : 'stretch'
    		},
    		bodyPadding : 10,
    		items : [ {
    			xtype : 'fieldset',
    			defaults : {
    				readOnly:true
    			},
    			title : me.getLocalizedValue('details'),
    			layout : {
    				type : 'vbox',
    				align : 'stretch'
    			},
    			items : [ {
    				xtype : 'textfield',
    				fieldLabel : me.getLocalizedValue('FirstName'),
    				itemId: 'FirstName'
    			}, {
    				xtype : 'textfield',
    				fieldLabel : me.getLocalizedValue('MiddleName'),
    				itemId: 'MiddleName'
    			}, {
    				xtype : 'textfield',
    				fieldLabel : me.getLocalizedValue('LastName'),
    				itemId: 'LastName'
    			}, {
    				xtype : 'textfield',
    				fieldLabel : me.getLocalizedValue('WebPage'),
    				itemId: 'WebPage'
    			}, {
    				xtype : 'textfield',
    				fieldLabel : me.getLocalizedValue('EmailAddress'),
    				itemId: 'EmailAddress'
    			} ]

    		}, {
    			xtype : 'fieldset',
    			title : me.getLocalizedValue('PhoneNumbers'),
    			layout : {
    				type : 'vbox',
    				align : 'stretch'
    			},
    			defaults : {
    				readOnly:true
    			},
    			items : [ {
    				xtype : 'textfield',
    				fieldLabel : me.getLocalizedValue('HomePhone'),
    				itemId: 'HomePhone'
    			}, {
    				xtype : 'textfield',
    				fieldLabel : me.getLocalizedValue('MobilePhone'),
    				itemId: 'MobilePhone'
    			}, {
    				xtype : 'textfield',
    				fieldLabel : me.getLocalizedValue('HomeFax'),
    				itemId: 'HomeFax'
    			}]

    		} ]
    	}, {
    		columnWidth : .5,
    		layout : {
    			type : 'vbox',
    			align : 'stretch'
    		},
    		defaults : {
    			readOnly : true
    		},
    		items : [

    		{
    			xtype : 'fieldset',
    			title : me.getLocalizedValue('Address'),
    			layout : {
    				type : 'vbox',
    				align : 'stretch'
    			},
    			defaults : {
    				readOnly:true
    			},
    			items : [ {
    				xtype : 'textfield',
    				fieldLabel : me.getLocalizedValue('HomeStreet'),
    				itemId: 'HomeStreet'
    			}, {
    				xtype : 'textfield',
    				fieldLabel : me.getLocalizedValue('HomeCity'),
    				itemId: 'HomeCity'
    			}, {
    				xtype : 'textfield',
    				fieldLabel : me.getLocalizedValue('HomeState'),
    				itemId: 'HomeState'
    			}, {
    				xtype : 'textfield',
    				fieldLabel : me.getLocalizedValue('HomePostalCode'),
    				itemId: 'HomePostalCode'
    			}, {
    				xtype : 'textfield',
    				fieldLabel : me.getLocalizedValue('HomeCountry'),
    				itemId: 'HomeCountry'
    			} ]

    		}, {
    			xtype : 'fieldset',
    			title : me.getLocalizedValue('Notes'),
    			layout : {
    				type : 'vbox',
    				align : 'stretch'
    			},
    			defaults : {
    				readOnly:true
    			},
    			items : [ {
    				xtype : 'textareafield',
    				height : 77,
    				itemId: 'Notes'
    			} ]
    		}

    		]
    	}

    	];
	},
	getLocalizedValue: function(key){
		return $W().localeManager.getLocalizationValue('application.javascript.customerInfo.'+key);
	}
	
});