/*
 * This class renders the layout according to the interaction type.
 */
Ext.define('Jacada.core.layout.InteractionLayoutPanel', {
    extend: 'Jacada.core.layout.SimpleLayoutPanel',

    interactionType: null,
    border: false,
    bodyCls: 'baseColor',
    //when moving between context, we must force activate/deactivate events
	//since they are not getting fired
    shouldFireActivateTab: false,
    
    listeners: {
    	activate: function(panel, eOpts){
    		Jacada.Logger.debug("activate layout: " + this.id);
    		panel.shouldFireActivateTab = true;
    	},
    	deactivate: function(panel, eOpts){
    		Jacada.Logger.debug("deactivate layout: " + this.id);
    		if($W().getTab()){
    			$W().getTab().fireEvent('deactivate', $W().getTab());
    		}
    	},
    	destroy: function(panel, eOpts){
    		//At this moment all portlets should be already registered 
    		//for getting custom info update, so it's safe to remove 
    		//cached info
    		//ID of the panel is a groupId
    		Ext.getCmp('contextNavigation').removePendingSearchResults(panel.getId());
    	}
	},
    buildTabPanel: function (){
    	var me = this;
    	var tabHolder =  Ext.create('Ext.panel.Panel', {
    		id: me.id+'ContentHolder',
	        layout: 'card',
	        activeItem: 0,
	        border: false,
	        region: 'center',
	        items: {itemId: 'dummy', html: 'dummy'}//must add dummy component since we removing tabs from card layout when interaction ends
		});
    	
    	var panel = Ext.create('Ext.panel.Panel', {
    		itemId: 'tabPanelHolder',
	        layout: 'border',
	        border: false,
	        region: 'center'
		});
    	
    	panel.add(tabHolder);
		
		if(this.mainLayout.attributes.bottomAreaWidthAsTabArea){
			panel.add(this.buildArea('south', {type:'hbox', align:'stretch'}, this.mainLayout.bottom.portlets, '100%', this.mainLayout.bottom.height, this.mainLayout.bottom.collapsible));
		}
		if(this.mainLayout.attributes.topAreaWidthAsTabArea){
			panel.add(this.buildArea('north', {type:'hbox', align:'stretch'}, this.mainLayout.top.portlets, '100%', this.mainLayout.top.height, this.mainLayout.top.collapsible));
		}
		return panel;
    },
    addTab: function(tabConfig){
    	if(tabConfig.interactionType){
    		var tab = Jacada.Utils.createTab(tabConfig);
    		tab.groupId = tabConfig.groupId;
			this.getContentHolder().add(tab);
		}
    },
    removeTab: function(tabId){
    	//remove and destroy the tab
    	var tab = this.getContentHolder().remove(tabId, false);
    	if(tab){
    		Jacada.Logger.debug(tabId+' was removed from ' + this.id);
    		tab.fireEvent('deactivate', tab);
    		tab.destroy();
    	}else{
    		Jacada.Logger.error(tabId+' was not found in ' + this.id + "!");
    	}
    },
    isTabExists: function(tabId){
    	return this.getTab(tabId) != undefined;
    },
    getTab: function(tabId){
    	return this.getContentHolder().getComponent(tabId+'-wrapper');
    },
    getContentHolder: function(){
    	return Ext.getCmp(this.id+'ContentHolder');
    },
    getActiveTab: function(){
    	return this.getContentHolder().getLayout().getActiveItem();
    },
    loadItem: function(itemId) {
    	Jacada.Logger.debug("InteractionLayoutPanel loadItem: " + itemId + ", this.id=" + this.id);
    	try{
    		Jacada.Logger.debug("calling setActiveItem to: " + itemId+'-wrapper');
    		this.getContentHolder().getLayout().setActiveItem(itemId+'-wrapper');
    		if(this.shouldFireActivateTab){
    			this.shouldFireActivateTab = false;
    			$W().getTab().fireEvent('activate', $W().getTab());
    		}
        }catch (e) {
        	Jacada.Logger.error("cannot load item: " + e.message);
        	if(itemId == getDefaultActiveTab()){
        		//in this case do nothing
        		return;
        	}
			// in case item cannot be found in the card panel
        	alert('cannot load item with itemId '+itemId);
		}
    }

});