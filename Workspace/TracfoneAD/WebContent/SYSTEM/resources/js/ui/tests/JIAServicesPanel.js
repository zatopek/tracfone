Ext.define('Jacada.system.ui.tests.JIAServicesPanel', {
	extend : 'Ext.panel.Panel',

	initComponent : function() {
		var me = this;
		Ext.applyIf(me, {
			title: 'JIA Services',
			layout: {
			    type: 'vbox',
			    align: 'stretch'
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
					fieldLabel : 'Service URL',
					itemId : 'serviceURL'
				},/*{
					xtype : 'textfield',
					fieldLabel : 'URL Params',
					itemId : 'urlParams'
				},*/
				
				{
					xtype : 'textarea',
					fieldLabel : 'Body',
					itemId : 'bodyContent'
				},{
					text: 'Get',
				    handler: function() {
				    	var requestParams = new Object();
				    	requestParams.url = me.getComponent('serviceURL').getRawValue();
				    	requestParams.onsuccess = function(response){
				    		me.getComponent('serviceResults').setValue(response);
				    	};
				    	
				    	requestParams.onerror = function(response){
				    		if (response != undefined) {
				    			if (response.target != undefined) {
				    				me.getComponent('serviceResults').setValue('error ' + response.target.responseText);
				    			} else {
				    				me.getComponent('serviceResults').setValue('error ');
				    			}
				    		}
				    	};
				    	
				    	requestParams.ontimeout = function(response){
				    		me.getComponent('serviceResults').setValue('timeout ' + response.target.responseText);
				    	};

				    	JIAClient.get(''/*me.getComponent('urlParams').getRawValue()*/, requestParams);
				    }
		        },{
					text: 'Post',
				    handler: function() {
				    	var requestParams = new Object();
				    	requestParams.url = me.getComponent('serviceURL').getRawValue();
				    	requestParams.onsuccess = function(response){
				    		me.getComponent('serviceResults').setValue(response);
				    	};

				    	requestParams.onerror = function(response){
				    		me.getComponent('serviceResults').setValue('error ' + response.target.responseText);
				    	};
				    	
				    	requestParams.ontimeout = function(response){
				    		me.getComponent('serviceResults').setValue('timeout ' + response.target.responseText);
				    	};
				    	
				    	JIAClient.post(me.getComponent('bodyContent').getRawValue(), requestParams);
				    }
		        },{
		        	text: 'Clear Response',
		        	handler: function(){
		        		me.getComponent('serviceResults').reset();
		        	}
		        },
		        {
					xtype : 'textarea',
					fieldLabel : 'Response',
					itemId : 'serviceResults'
				}
		        
		        
			]
		});
		me.callParent(arguments);
	}

});