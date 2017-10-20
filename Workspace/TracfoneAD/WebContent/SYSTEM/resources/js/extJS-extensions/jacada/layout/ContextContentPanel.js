/*
 * This class uses a card layout to switch layouts according to the interaction type. 
 */
Ext.define('Jacada.core.layout.ContextContentPanel', {
    extend: 'Ext.panel.Panel',

    id: 'contextContentPanel',
    border: false,
    region: 'center',
    layout: 'card',
    
    initComponent: function() {
        var me = this;
        me.callParent(arguments);
        //the only item we add on load is the General tab layout
        me.add(Ext.create('Jacada.core.layout.InteractionLayoutPanel',{mainLayout: me.mainLayout, id: $W().interactionType.General}));
    },
    addTab: function(tabConfig, interactionType, contextGroupId){
    	if(!contextGroupId){
    		contextGroupId = $W().interactionType.General;
		}
		if(!Ext.getCmp(contextGroupId)){
			//load layout by interaction type
			var layout = Jacada.Utils.loadLayout(interactionType);
			if(!layout){
				//failed to load layout use General layout instead
				layout = this.mainLayout;
			}
			
			this.add(Ext.create('Jacada.core.layout.InteractionLayoutPanel',{mainLayout: layout, id: contextGroupId}));
		}
		tabConfig.currentInteractionType = interactionType;
		tabConfig.groupId = contextGroupId;
		this.getComponent(contextGroupId).addTab(tabConfig);
    },
    removeContext: function(contextGroupId){
        var comp = Ext.getCmp(contextGroupId);
        if ( comp != undefined) {
        	this.getLayout().setActiveItem($W().interactionType.General);
    	    comp.destroy();
    	}
    },
    getTab: function(tabId, contextGroupId){
    	var tab = null;
    	this.getLayout().getLayoutItems().each(function(layout){
			if(layout.id == contextGroupId){
				tab = layout.getTab(tabId);
				return false;//break the loop
			}
		});
    	
    	return tab;
    },
    isTabExists: function(tabId, contextGroupId){
    	return Ext.getCmp(contextGroupId).isTabExists(tabId);
    },
    loadItem: function(itemId, contextGroupId) {
    	Jacada.Logger.debug("contextContentPanel loadItem: " + itemId+' '+contextGroupId);
		//set the active layout
		this.getLayout().setActiveItem(contextGroupId);
		//set the active tab in InteractionLayoutPanel.js
		this.getLayout().getActiveItem().loadItem(itemId);
    }

});