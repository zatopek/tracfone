Ext.define('Jacada.core.WorkSpaceTabPanel', {
    extend: 'Ext.tab.Panel',

	accessKeyMap: null,
	maximizedWin: null,
	
	initComponent: function(){
		var config = {
				deferredRender: false,//load even hidden tabs. lazyloading tab will be handled separately.
				autoDestroy: false,
			    enableTabScroll:true,
			    activeTab: getDefaultActiveTab()+'-wrapper', //defined in override.js
			    height: '100%',
				width: '100%',
				listeners:{
					//WS-4718 - memory leak in ExtJs - tool (close icon) is not destroyed and stays in
					//Ext.ComponentManager
					remove: function(self, cmp){
						Jacada.Logger.debug("TabPanel: remove: tab " + (cmp ? cmp.id : "N/A") + " removed. Cleaning tool object.");
						if(cmp.tools){
							//Need a copy to avoid concurrency problems
							var toolsCopy = cmp.tools.clone();
							toolsCopy.each(function(tool){
								Jacada.Logger.debug("TabPanel: remove: tab " + (cmp ? cmp.id : "N/A") + " destroying tool " + tool.id);
								tool.destroy();
							});
						}
					},
					afterrender: function(self){
						var numTabs = self.items.length, i;
					    for (i = 0; i < numTabs; i++) {
					    	var tab = self.items.get(i);
					    	this.createDblClickHandler(tab);
					    }
					    
					    self.setActiveTab(getDefaultActiveTab()+'-wrapper');
					}

				}
		}
		Ext.apply(this, config);
	    Ext.apply(this.initialConfig, config);
	    this.accessKeyMap = new Ext.util.KeyMap(document);
	    this.callParent(arguments);
	},
	createDblClickHandler: function(tab){
		Ext.get(tab.tab.el).on("dblclick", function(){
			//restore maximized tab
			if($W().workspaceUI.maximizedTab){
				tab.tab.setClosable(true);
				tab.child().restore();
				$W().tabPanel.hiddenComponentsForMaximizedTab.each(function(item){
					item.tab.show();
				});
				$W().tabPanel.hiddenComponentsForMaximizedTab = null;
	    	 }else{
	        	 if(!tab.child().allowMaximize()){
	     			return;
	     		}
	        	 tab.tab.setClosable(false);
	    		 //maximize tab
	    		 $W().tabPanel.hiddenComponentsForMaximizedTab = new Array();
	    		 //WorkSpaceTab
	    		 tab.child().maximizeTab();
	    		 //hide other visible tabs
	    		 $W().tabPanel.items.each(function(item){
	    			 //don't hide me :)
	    			 if(item.id != tab.id){
	    				 if(item.tab.isVisible()){
	    					 item.tab.hide();
	    					 $W().tabPanel.hiddenComponentsForMaximizedTab.push(item);
	    				 }
	    			 }
	    		});
	    	 }
		
		});
	}
	
});

