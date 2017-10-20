Ext.define('Jacada.core.WorkSpaceUI', {
    extend: 'Ext.container.Viewport',
	mainLayout: null,
	maximizedTabIndex: -1,
    id: 'workSpaceUI',
    
	init: function(layout){
		this.mainLayout = layout;
		this.suspendEvents(true);
		this.add(this.buildTopPanel());
		this.add(this.buildContentAreaPanel());
		this.add(this.buildBottomPanel());
		if($W().toolbarEnabled){
			$W().toolbar = this.buildToolbar();
			this.add($W().toolbar);
		}
		this.resumeEvents();
	},
	buildContentAreaPanel: function(){
		var panel;
		if($W().LayoutByContext){
			return Ext.create('Jacada.core.layout.ContextLayoutPanel', {mainLayout: this.mainLayout});
		}else{
			return Ext.create('Jacada.core.layout.SimpleLayoutPanel', {mainLayout: this.mainLayout});
		}
	},
	buildBottomPanel: function (){
		var panelHeight = 0;
		var panelItems = new Array();
		if($W().tickerTapePosition == "bottom"){
			item = this.buildTickerTape();
			if(item != null){
				panelItems.push(item);
				panelHeight += item.height;
			}
		}
		return {
        	region: 'south',
        	id: 'south-panel',
        	height: panelHeight,
        	border: false,
        	layout: {type: 'vbox', align: 'stretch'},
        	items: panelItems
        };
	},
	buildTopPanel: function (){
		var topPanelItems = new Array();
		var item = this.buildMenuBar();
		if(item != null){
			topPanelItems.push(item);
		}
		var panel = Ext.create('Ext.panel.Panel',{
			layout: {type:'hbox', align:'stretch'},
			border: false,
			bodyStyle : 'background:none; ',
			height: 115,
			hidden: !$W().isCtiBarEnabled
		});
		item = this.buildLogoSection();
		if(item != null){
			panel.add(item);
		}
		item = this.buildCTIBar();
		if(item != null){
			panel.add(item);
		}
		topPanelItems.push(panel);
		item = this.buildSLABar();
		if(item != null){
			topPanelItems.push(item);
		}
		if($W().tickerTapePosition == "top"){
			item = this.buildTickerTape();
			if(item != null){
				topPanelItems.push(item);
			}
		}
		return {
        	region: 'north',
        	id: 'north-panel',
        	bodyStyle : 'background:none; ',
        	border: false,
        	layout: {type: 'vbox', align: 'stretch'},
        	items: topPanelItems
        };
	},
	/**
	 * Builds menu bar including mapped access keys
	 */
	buildMenuBar: function (){
		return null;
		var menuBar = Ext.create('Jacada.core.WorkSpaceMenuToolbar', {
			region: 'north',
			id: 'workspace-menu',
        	split: false,
        	padding: 0,
        	marging: 0,
        	cls: 'top-bar-menu',
        	border: false,
        	layout: {type: 'hbox'}
		});
		Jacada.Logger.debug("Menu bar created");
		return menuBar;
	},
	buildTickerTape: function (){
		return  Ext.create('Jacada.core.IFrameComponent', { id: 'TickerTapeIframe', name: 'TickerTapeIframe', height: 30, url: "SYSTEM/portlets/tickerTape/index.jsp" });
	},
	buildSLABar: function (){
		if($W().displaySLAbar){
			return  Ext.create('Jacada.core.IFrameComponent', { id: 'SLABarIframe', name: 'SLABarIframe', height: 12, url: "SYSTEM/portlets/SLABar/index.jsp" });
		}
		return null;
	},
	buildCTIBar: function (){
        if($W().isCtiBarEnabled && $W().isCtiBarPrivileged){
               //check if we have an inline javascript
               if($W().ctiAPI.ctiBarUrl.indexOf('Jacada.') == 0){
                     try{
                            return Ext.create($W().ctiAPI.ctiBarUrl);
                     }catch (e) {
                    	 Jacada.Logger.error('Failed to create cti bar: '+ e.description);
                            return Ext.create('Ext.panel.Panel', {
                                    html: $W().localeManager.getLocalizationValue('application.javascript.ui.failedToLoadClass')+' '+ $W().ctiAPI.ctiBarUrl
                                   });
                     }
               }else{
                     return  Ext.create('Jacada.core.IFrameComponent', { id: 'ctibar', name: 'ctibar', height: 55, url: $W().ctiAPI.ctiBarUrl, scrolling: 'no' });
               }
               
        }
        return null;
	},
	buildLogoSection: function(){
		return {
			xtype: 'panel',
			bodyCls: 'corporate-logo',
			width: 160
		}
	    },
	buildToolbar: function (){
		return  Ext.create('Ext.toolbar.Toolbar', {
			region: 'east',
        	id: 'toolbar-panel',
        	width: 40,
        	split: false,
        	border: false,
        	layout: {type: 'vbox', align: 'center'},
        	defaults: {scale: 'medium'},
        	items: this.getToolbarItems()
		});
	},
	getToolbarItems: function (){
		var toolbarItems = $W().toolbarItemsArray;
		var items = new Array();
		for (var i=0,len=toolbarItems.length; i<len; i++){
			var item = toolbarItems[i];
			items[i] = new Object();
			items[i].iconCls = item.styleClass;
			items[i].tooltip = {text: item.tooltip};
			items[i].id = item.id;
			items[i].handler = this.onToolbarButtonClick;
	  	}
		//don't need this anymore
		$W().toolbarItemsArray = null;
		return items;
	},
	onToolbarButtonClick: function (btn){
		$W().runToolbarItem(btn.id);
	}
});