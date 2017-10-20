Ext.define("Jacada.core.Dashboard", {
	extend: 'Ext.Base',
	
	dashboard: null,
	dashboardName: null,
	widgetsMap: null,
	
	constructor: function(config){
		this.callParent(config);
		this.initConfig(config);
		return this;
	},
	
	initConfig: function(config){
		var me = this;
		this.callParent(arguments);
		this.dashboard = config.dashboard;
		this.dashboardName = this.dashboard.dashboardConfig.name;
		Jacada.Logger.debug("Dashboard.js initConfig parsing dashboard: " + this.dashboardName);
		this.widgetsMap = new Ext.util.HashMap();
		Ext.each(this.dashboard.getWidgetInstances(), this.parseWidgetInstances, this);
		Jacada.Logger.debug("Dashboard.js initConfig widgets: " + Ext.JSON.encode(this.widgetsMap.getKeys()));
	},

	parseWidgetInstances: function(widget){
		Jacada.Logger.debug("Dashboard.js parseWidgetInstances adding widget name: " 
				+ widget.config.name + ", vtype: " + widget.vtype + ", title: " + widget.config.title);
		this.widgetsMap.add(widget.config.name, widget);
		if(widget.vtype == null || widget.vtype == 'group'){
			Ext.each(widget.widgets, this.parseWidgetInstances, this);
		}
	},
	getWidgetsMappings: function(){
		var mappings = [];
		if(!this.widgetsMap){
			return mappings;
		}
		
		this.widgetsMap.each(function(name, widget){
			mappings.push({
				name: name,
				title: widget.config.title,
				type: widget.vtype
			});
		});
		
		return mappings;
	},
	//Sets widget visibility
	setWidgetVisible: function(widgetName, visible){
		var widget = this.widgetsMap.get(widgetName);
		Jacada.Logger.debug("Dashboard.js setWidgetVisible widget: " + widgetName 
				+ " (" + (widget?widget.config.title:widget) + "), visible? " + visible);
		if(widget){
			if(visible){
				widget.show();
			}else{
				widget.hide();
			}
		}
	},
	//Return ExtJS object that represents required field
	getFormInputField: function(widgetName, fieldName){
		var widget = this.widgetsMap.get(widgetName);
		Jacada.Logger.debug("Dashboard.js getFormInputField widget: " + widgetName 
				+ " (" + (widget?widget.config.title:widget) + "), fieldName: " + fieldName);
		var inputField = null;
		if(widget && widget.vtype == 'inputform'){
			var fields = widget.getFieldWidgets();
			Ext.each(fields, function(field){
				if(field.getName() == fieldName){
					inputField = field.getWidget().getWrapperComponent().items.first();
					return false; //break the loop
				}
			});
		}
		return inputField;
	},
	//Sets tab in group widget as active
	setActiveTab: function(widgetName, index){
		var widget = this.widgetsMap.get(widgetName);
		Jacada.Logger.debug("Dashboard.js setActiveTab widget: " + widgetName 
				+ " (" + (widget?widget.config.title:widget) + "), index: " + index);
		if(widget && widget.vtype == 'group'){
			var panel = widget.getViewPanel().items.first();
			if(panel.xtype == 'tabpanel'){
				if(typeof index == 'string'){
					index = Number(index);
				}
				widget.getViewPanel().changeTab(index);
				return;
			}
		}
		Jacada.Logger.error("Dashboard.js setActiveTab widget: " + widgetName 
				+ " (" + (widget?widget.config.title:widget) + ") is not a group widget or not a group tab widget.");
	},
	//Return ExtJS button that represents required button
	getFormButton: function(widgetName, buttonName){
		var widget = this.widgetsMap.get(widgetName);
		Jacada.Logger.debug("Dashboard.js getFormButton widget: " + widgetName 
				+ " (" + (widget?widget.config.title:widget) + "), buttonName: " + buttonName);
		var result = null;
		if(widget && widget.vtype == 'inputform'){
			if(widget.getViewPanel().getComponent(0)){
				var buttonLabel;
				Ext.each(widget.config.fbuttons, function(button){
					if(button.buttonName == buttonName){
						buttonLabel = button.buttonLabel;
						return false; //break the loop
					}
				});
				if(!buttonLabel){
					Jacada.Logger.error('Dashboard.js getFormButton could not find config for button');
					return null;
				}
				Ext.each(widget.getViewPanel().getComponent(0).buttons, function(button){
					if(button.text == buttonLabel){
						result = button;
						return false; //break the loop
					}
				});
			}else{
				Jacada.Logger.warn('Dashboard getFormButton buttons of the widget are not ready yet');
			}
		}else{
			Jacada.Logger.error('Dashboard getFormButton widget ' + widgetName + ' does not exist or not an input form.');
		}
		return result;
	},
	//Update HTML content in HTML/RICHTEXT widgets
	updateHTMLContent: function(widgetName, html){
		var widget = this.widgetsMap.get(widgetName);
		Jacada.Logger.debug("Dashboard.js updateHTMLContent widget: " + widgetName);
		if(widget && widget.vtype == 'html'){
			try{
				widget.panel.body.update(html, true);
			}catch(e){
				Jacada.Logger.error('Dashboard updateHTMLContent widget ' + widgetName + ' failed to update content.');
			}
		}else{
			Jacada.Logger.error('Dashboard updateHTMLContent widget ' + widgetName + ' does not exist or not an html widget.');
		}
	}
});