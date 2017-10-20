/*
 * This class in charge of rendering the portlets and areas in the layout.
 */
Ext.define('Jacada.core.layout.SimpleLayoutPanel', {
    extend: 'Ext.panel.Panel',

    id: 'simpleContentPanel',
    border: false,
    region: 'center',
    layout: 'border',
    bodyCls: 'baseColor',
    mainLayout: null,
    
    initComponent: function() {
    	var me = this;
        Ext.applyIf(me, {
            items: me.buildContentAreaPanel()
        });
        me.callParent(arguments);
    },
    maximizeTab: function(){
    	var me = this;
    	me.hiddenComponentsForMaximizedTab = new Array();
    	var contentArea = this.getComponent('contentArea');
    	var layoutItems = contentArea.getLayout().getLayoutItems();
    	layoutItems.each(function(comp){
    		if(comp.itemId == "tabPanelHolder"){
    			var layoutItems = comp.getLayout().getLayoutItems();
    	    	layoutItems.each(function(comp){
    	    		if(comp.region != "center"){
    	    			if(comp.isVisible()){
    	    				comp.hide();
    	    				me.hiddenComponentsForMaximizedTab.push(comp.id);
    	    			}
    	    		}
    			});
    		}
    		if(comp.region != "center"){
    			if(comp.isVisible()){
    				comp.hide();
    				me.hiddenComponentsForMaximizedTab.push(comp.id);
    			}
    		}
		});
    },
    restore: function(){
		this.hiddenComponentsForMaximizedTab.each(function(compId){
			var comp = Ext.getCmp(compId);
			if(comp){
				Ext.getCmp(compId).setVisible(true);
				Jacada.Logger.debug('restored '+ compId);
			}
		});
		this.hiddenComponentsForMaximizedTab = null;
	},
  //build the panel that holds the tabs and portlets
	buildContentAreaPanel: function (){
		var contentAreaitems = new Array();
		contentAreaitems.push(this.buildTabPanel());
		contentAreaitems.push(this.buildArea('west', {type:'vbox', align:'stretch'}, this.mainLayout.left.portlets, this.mainLayout.left.width, '100%', this.mainLayout.left.collapsible));
		contentAreaitems.push(this.buildArea('east', {type:'vbox', align:'stretch'}, this.mainLayout.right.portlets, this.mainLayout.right.width, '100%', this.mainLayout.right.collapsible));
		if(!this.mainLayout.attributes.bottomAreaWidthAsTabArea){
			contentAreaitems.push(this.buildArea('south', {type:'hbox', align:'stretch'}, this.mainLayout.bottom.portlets, '100%', this.mainLayout.bottom.height, this.mainLayout.bottom.collapsible));
		}
		if(!this.mainLayout.attributes.topAreaWidthAsTabArea){
			contentAreaitems.push(this.buildArea('north', {type:'hbox', align:'stretch'}, this.mainLayout.top.portlets, '100%', this.mainLayout.top.height, this.mainLayout.top.collapsible));
		}
		return Ext.create('Ext.panel.Panel', {
	        layout: 'border',
	        itemId: 'contentArea',
	        border: false,
	        region: 'center',
	        bodyCls: 'baseColor',
	        items: contentAreaitems 
		});
	},
	buildArea: function (areaRegion, boxLayout, portlets, areaWidth, areaHeight, collapsible){
		portlets = this.filterPortlets(portlets);
		//if the height is not percentage, we need to convert it from string to number
		if(areaWidth == null){
			areaWidth = 0;
		}
		if(areaWidth.indexOf('%') < 0){
			areaWidth = parseInt(areaWidth);
		}
		//if the height is not percentage, we need to convert it from string to number
		if(areaHeight == null){
			areaHeight = 0;
		}
		if(areaHeight.indexOf('%') < 0){
			areaHeight = parseInt(areaHeight);
		}
		var panel =  Ext.create('Ext.panel.Panel', {
			width: areaWidth,
			height: areaHeight,
			region: areaRegion,
			layout: boxLayout,
			header: false, 
			border: false,
			collapsible: collapsible,
			split: true,
			splitterResize: this.mainLayout.attributes.enableAreasSplitters,
			bodyCls: 'baseColor',
			listeners: {
					resize: function(label, width, height, oldWidth, oldHeight, eOpts ){
						this.items.each(function(portlet){
							portlet = portlet.items.getAt(0);
							portlet.fireEvent('resize', portlet);
						});
					}
			}
		});
		if(portlets == null || portlets.length == 0){
			panel.hide();
		}else{
			for (var i=0,len=portlets.length; i<len; i++){
				var portlet = this.buildPortlet(portlets[i], boxLayout);
				//add space between each portlet
				if(boxLayout.type == 'vbox'){
					if(i < len-1){
						portlet.margin = '0 0 4 0';
					}
				}else if(boxLayout.type == 'hbox'){
					if(i < len-1){
						portlet.margin = '0 4 4 0';
					}else{
						portlet.margin = '0 0 4 0'
					}
				}
				panel.add(portlet);
		  	}
		}
		return panel;
	},
	filterPortlets: function(portlets){
		var filteredList = new Array();
		if(portlets != null && portlets.length > 0){
			for (var i=0,len=portlets.length; i<len; i++){
				var privilege = portlets[i].privilege;
				//if not defined a privilege or if is privileged
				if(privilege){
					if($W().rapManager.isPrivileged(privilege)){
						filteredList.push(portlets[i]);
					}
				}else{
					filteredList.push(portlets[i]);
				}
			}
		}
		return filteredList;
	},
	buildPortlet: function (portlet, areaLayout){
		var w = portlet.defaultWidth;
		var h = portlet.defaultHeight;
		var config = new Object();
		config.layout = 'fit',
		config.interactionId = this.id; // the interactionId (equals to layout Id) which the portlet belongs to
		config.title = portlet.title.toUpperCase();
		config.border = true;
		config.header = portlet.title.length > 0;//show title only if not empty
		config.collapsible = portlet.collapsable;
		config.items = new Array();
		config.autoScroll = false;
		//check if we have an inline javascript
		if(portlet.url.indexOf('Jacada.') == 0){
			try{
				config.items[0] = Ext.create(portlet.url, {groupId: config.interactionId});
			}catch (e) {
				Jacada.Logger.error('Failed to create portlet: '+ e.description);
				if(e.stack){
					Jacada.Logger.error(e.stack);
				}
				config.items[0] = Ext.create('Ext.panel.Panel', {
				        html: $W().localeManager.getLocalizationValue('application.javascript.ui.failedToLoadClass')+' '+ portlet.url
					});
			}
		}else{
			config.items[0] = Ext.create('Jacada.core.IFrameComponent', { url: portlet.url, groupId: config.interactionId });
		}
		if(areaLayout.type == 'vbox'){
			//if the height is not percentage, we need to convert it from string to number
			if(h.indexOf('%') > 0){
				h = h.replace("%","");
				config.flex = h/100;
			}else{
				h = parseInt(h);
				config.height = h;
			}
		}else if(areaLayout.type == 'hbox'){
			if(w.indexOf('%') > 0){
				w = w.replace("%","");
				config.flex = w/100;
			}else{
				w = parseInt(w);
				config.width = w;
			}
		}else{
			alert('areaLayout '+areaLayout+' is not supported.');
		}
		config.listeners = {
				resize: function(label, width, height, oldWidth, oldHeight, eOpts ){
					var portlet = this.items.getAt(0);
					portlet.fireEvent('resize', portlet);
				}
		};
		return  Ext.create('Ext.panel.Panel', config);
	},
	//WorkSpace main tabs
	buildTabPanel: function (){
		var panel = Ext.create('Ext.panel.Panel', {
			itemId: 'tabPanelHolder',
	        layout: 'border',
	        border: false,
	        region: 'center'
	        
		});
		
		$W().tabPanel = Ext.create('Jacada.core.WorkSpaceTabPanel', {
					region: 'center', // a center region is ALWAYS required for border layout
	                border: false,
	                plain: true,
	                frame: false
		});
		//add all tabs
		$W().tabItems.each(function(tabConfig){
			/*
			 * wrap each Tab in a panel in order to handle maximize properly.
			 * when maximizing a tab, we remove it from the TanPanel and place it in a window.
			 */
			var tab = Jacada.Utils.createTab(tabConfig);
			$W().tabPanel.add(tab);
		});
		
		panel.add($W().tabPanel);
		
		if(this.mainLayout.attributes.bottomAreaWidthAsTabArea){
			panel.add(this.buildArea('south', {type:'hbox', align:'stretch'}, this.mainLayout.bottom.portlets, '100%', this.mainLayout.bottom.height, this.mainLayout.bottom.collapsible));
		}
		if(this.mainLayout.attributes.topAreaWidthAsTabArea){
			panel.add(this.buildArea('north', {type:'hbox', align:'stretch'}, this.mainLayout.top.portlets, '100%', this.mainLayout.top.height, this.mainLayout.top.collapsible));
		}
		return panel;
	}

});