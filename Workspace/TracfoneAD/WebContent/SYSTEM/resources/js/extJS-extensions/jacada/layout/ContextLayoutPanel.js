 /*
 * This class is the main panel when working in context mode. it holds the navigation panel and the content panel. 
 */
Ext.define('Jacada.core.layout.ContextLayoutPanel', {
    extend: 'Ext.panel.Panel',

    id: 'contextLayoutPanel',
    region: 'center',
    border: false,
    layout: 'border',
    bodyCls: 'baseColor',
    
    initComponent: function() {
        var me = this;
        Ext.applyIf(me, {
            items:[
                   //side navigation bar
                   {
                	   layout: 'fit',
                	   split: true,
                	   collapsible: true,
                	   region: 'west',
                	   title: $W().localeManager.getLocalizationValue('application.javascript.navigationPanel.title'),
                	   items:Ext.create('Jacada.core.layout.ContextNavigationPanel')
                   },
                   // card layout panel to switch content
                   Ext.create('Jacada.core.layout.ContextContentPanel', {mainLayout: me.mainLayout})
            ]
        });
        me.callParent(arguments);
        //add all General tabs
        $W().tabItems.each(function(tabConfig){
    		var interactionType = tabConfig.interactionType;
    		//put under 'Home' group everything without a type
    		if (!interactionType || interactionType.length == 0 || interactionType.indexOf($W().interactionType.General)>=0){
    			Ext.getCmp('contextContentPanel').addTab(tabConfig, $W().interactionType.General);
    		}
		});
      //load default tab
        Ext.getCmp('contextContentPanel').loadItem(getDefaultActiveTab());
    }

});