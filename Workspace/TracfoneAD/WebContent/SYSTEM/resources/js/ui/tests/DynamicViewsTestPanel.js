Ext.define('Jacada.system.ui.tests.DynamicViewsTestPanel', {
	extend : 'Ext.form.Panel',
	
	initComponent : function() {
		var me = this;
		Ext.applyIf(me, {
			title: 'DV',
			layout: {
				type: 'vbox',
				align: 'stretch'
			},
//			layout: 'fit',
			tbar: [
			    {
					text : 'setActiveTab',
					scope: this,
					handler : this.setActiveTab
			    },
			    {
			    	text: 'getFormInputField',
					scope: this,
					handler : this.getFormInputField
			    },
			    {
			    	text: 'setWidgetVisible',
					scope: this,
					handler : this.setWidgetVisible
			    },
			    {
			    	text: 'getFormButton',
					scope: this,
					handler : this.getFormButton
			    },
			    {
			    	text: 'Run Script',
					scope: this,
					handler : this.runScript
			    }
			],
			items: [
			    me.buildInputFields(),
			    me.buildLegendPanel(me)
			]
		});
		me.callParent(arguments);
	},
	buildInputFields: function(){
		return {
			xtype: 'panel',
			layout: {
				type: 'vbox',
				align: 'stretch'
			},
			autoScroll: true,
			items: [
				{
					xtype : 'textfield',
					fieldLabel : 'Widget Name',
					name: 'widgetName',
					itemId : 'widgetName'
				},
				{
					xtype: 'fieldset',
					title: 'setActiveTab',
					items: [{
						xtype : 'numberfield',
						fieldLabel : 'Widget Index',
						name: 'widgetIndex',
						itemId : 'widgetIndex',
						width: '100%',
						minValue: 0
				    }]
				},
				{
					xtype: 'fieldset',
					title: 'getFormInputField',
					items: [{
						xtype : 'textfield',
						fieldLabel : 'Field Name',
						name: 'fieldName',
						itemId : 'fieldName',
						width: '100%'
					},{
						xtype : 'textfield',
						fieldLabel : 'New Value',
						name: 'newValue',
						itemId : 'newValue',
						width: '100%'
					}]
				},
				{
					xtype: 'fieldset',
					title: 'setWidgetVisible',
					items: [{
				    	xtype: 'checkbox',
				    	fieldLabel: 'Visible?',
						name: 'widgetVisible',
				    	itemId: 'widgetVisible',
						width: '100%',
				    	inputValue: true,
				    	uncheckedValue: false
				    }]
				},
				{
					xtype: 'fieldset',
					title: 'getFormButton',
					items: [{
						xtype : 'textfield',
						fieldLabel : 'Button Name',
						name: 'buttonName',
						itemId : 'buttonName',
						width: '100%'
					},{
				    	xtype: 'checkbox',
				    	fieldLabel: 'Enabled?',
						name: 'buttonEnable',
				    	itemId: 'buttonEnable',
						width: '100%',
				    	inputValue: true,
				    	uncheckedValue: false
					}]
				},
				{
					xtype: 'fieldset',
					title: 'Run Script',
					items: [{
						xtype: 'textareafield',
						name: 'runScript',
						itemId: 'runScript',
						value: "var isSupervisor = $W().rapManager.isUserSupervisor();\n$W().getTab().getDashboard().setWidgetVisible('w1', isSupervisor)",
						width: '100%',
						height: 100
				    }]
				}
			]
		}
	},
	buildLegendPanel: function(me){
		var panel = Ext.create('Ext.panel.Panel', {
			title: 'Legend',
			border: true,
			autoScroll: true,
			layout: 'anchor',
			height: 200,
			listeners: {
				contextTabChanged: function(contextType, data, groupId){
					var activeTab = $W().getTab();
					if(activeTab.isDashboard()){
						Jacada.Logger.debug('DynamicViewsTestPanel contextTabChanged refreshing legend');
						var dashboard = activeTab.getDashboard();
						if(!dashboard){
							setTimeout(function(){me.updateLegendPanel(me)}, 500);
						}else{
							me.updateLegendPanel(me);
						}
					}else{
						Jacada.Logger.debug('DynamicViewsTestPanel contextTabChanged Active tab is not a dashboard');
					}
				}
			}
		});
		panel.observerAllEvents = true;
		if($W().LayoutByContext){
			Ext.getCmp('contextNavigation').registerContextListener(panel);
		}
		this.legendPanel = panel;
		return panel;
	},
	updateLegendPanel: function(me){
		var activeTab = $W().getTab();
		var dashboard = activeTab.getDashboard();
		if(!dashboard){
			setTimeout(function(){me.updateLegendPanel(me)}, 500);
			return;
		}
		Jacada.Logger.debug('DynamicViewsTestPanel updateLegendPanel');
		me.legendPanel.removeAll(true);
		var fields = [];
		dashboard.getWidgetsMappings().each(function(widgetInfo){
			fields.push({
				xtype: 'displayfield',
				value: '<b>name</b>: ' + widgetInfo.name + ', <b>title</b>: ' 
						+ widgetInfo.title + ', <b>type</b>: ' + widgetInfo.type
			});
		});
		me.legendPanel.add(fields);
	},
	setActiveTab: function(){
		var values = this.getValues();
		Jacada.Logger.debug('DynamicViewsTestPanel setActiveTab values: ' + Ext.JSON.encode(values));
		var activeTab = $W().getTab();
		var dashboard = activeTab.getDashboard();
		if(dashboard){
			dashboard.setActiveTab(values.widgetName, values.widgetIndex);
		}else{
			alert('Dashboard is not registered');
		}
	},
	getFormInputField: function(){
		var values = this.getValues();
		Jacada.Logger.debug('DynamicViewsTestPanel getFormInputField values: ' + Ext.JSON.encode(values));
		var activeTab = $W().getTab();
		var dashboard = activeTab.getDashboard();
		if(dashboard){
			var field = dashboard.getFormInputField(values.widgetName, values.fieldName);
			if(field){
				field.setValue(values.newValue);
			}else{
				Jacada.Logger.error('DynamicViewsTestPanel.getFormInputField got field ' + field);
			}
		}else{
			alert('Dashboard is not registered');
		}
	},
	setWidgetVisible: function(){
		var values = this.getValues();
		Jacada.Logger.debug('DynamicViewsTestPanel setWidgetVisible values: ' + Ext.JSON.encode(values));
		var activeTab = $W().getTab();
		var dashboard = activeTab.getDashboard();
		if(dashboard){
			dashboard.setWidgetVisible(values.widgetName, values.widgetVisible);
		}else{
			alert('Dashboard is not registered');
		}
	},
	getFormButton: function(){
		var values = this.getValues();
		Jacada.Logger.debug('DynamicViewsTestPanel getFormButton values: ' + Ext.JSON.encode(values));
		var activeTab = $W().getTab();
		var dashboard = activeTab.getDashboard();
		if(dashboard){
			var button = dashboard.getFormButton(values.widgetName, values.buttonName);
			if(button){
				if(values.buttonEnable){
					button.enable();
				}else{
					button.disable();
				}
			}else{
				Jacada.Logger.error('DynamicViewsTestPanel.getFormButton got button ' + button);
			}
		}else{
			alert('Dashboard is not registered');
		}
	},
	runScript: function(){
		var values = this.getValues();
		Jacada.Logger.debug('DynamicViewsTestPanel runScript\n' + values.runScript);
		Jacada.Logger.debug('DynamicViewsTestPanel runScript result: ' + eval(values.runScript));
	}
});
