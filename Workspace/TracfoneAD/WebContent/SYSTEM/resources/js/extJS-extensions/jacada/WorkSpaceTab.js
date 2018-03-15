Ext.define('Jacada.core.WorkSpaceTab', {
    extend: 'Ext.panel.Panel',
    
    canAuditEvents: true,
    hasContextListener: false,
    observerAllEvents: false,
    
    initComponent: function(){
    	var me = this;
    	 Ext.applyIf(me, {
    		 autoScroll: false,
    		    listeners: {
    		    	activate: function(){
    		    		if(!me.hasContextListener && $W().LayoutByContext){
    		    			Ext.getCmp('contextNavigation').registerContextListener(me);
    		    			me.hasContextListener = true;
    		    		}
    		    		var tab = this;
    		    		if(!this.isVisible()){
    		    			this.show();
    		    		}
    		    		Jacada.Logger.debug("activating Tab " + tab.itemId);
						if(tab.itemId == 'messagesTab'){
							try {
								widgets['customerServiceProfile'].up().up().hide();
							} catch(e){}		
						}
						else {
							try {
								widgets['customerServiceProfile'].up().up().show();
							} catch(e){}
						}    
	
    		            if(!tab.loaded){
    		            	Jacada.Logger.debug("Tab URL: " + tab.actualUrl);
    						//check if we need to load it
    						if(tab.isInline()){
    							tab.loaded = true;
    							//inline widget that has not been instantiated yet
    							try{
    								tab.add(Ext.create(tab.actualUrl, {groupId: tab.groupId}));
    							}catch (e) {
    								Jacada.Logger.error(e);
    								var msg = (e.description?e.description:e.message);
    								Jacada.Logger.error("Failed to create tab with url="+tab.actualUrl+' : ' + msg);
    								tab.add(Ext.create('Ext.panel.Panel', {
    								        html: $W().localeManager.getLocalizationValue('application.javascript.ui.failedToLoadClass')+' '+tab.actualUrl 
    									})
    								);
    							}
    						}else{
								//iframe widget
    							this.configIframeWidget(tab);
    							tab.loaded = true;
    						}
    		            }
    		            if(tab.isInline()){
    		            	var tabContent = tab.items.first();
    		            	tabContent.fireEvent('activate', tabContent);
    		            }
    		            setNestedApplicationVisible(tab, true);
    		            if(this.canAuditEvents){
    		            	this.canAuditEvents = false;
	    					if($W().isSwitchTabAuditEventEnabled != false){
	    						//remove &nbsp; from tab title
	    						  var title = tab.title.replace(/&nbsp;/g," ");
	    						  title = title.replace(/&nbsp/g," ");
	    						  sendAuditEvent("SwitchTab", "interaction", "ToTab", title);
	    					}
    		            }
    		        },
    		        deactivate: function(){
    		        	var tab = this;
    		        	tab.canAuditEvents = true;
    		        	Jacada.Logger.debug("deactivating Tab " + tab.itemId);
    		        	if($W().workspaceUI.maximizedTab){
    		        		me.restore();
    		        	}
    		        	setNestedApplicationVisible(tab, false);
    		        },
    		    	contextDataChanged: function(interactionType, data, dataType){
    		    		Jacada.Logger.debug("WorkSpaceTab.contextDataChanged dataType: " + dataType 
    		    				+ ", interactionType: " + interactionType + ", data: " + data);
    					if(dataType == 'customerInfo'){
    						$W().onContextDataChanged(me, data);
    					}else if(dataType == 'media'){
							if(this.screenPopApp){
								this.configIframeWidget(this);
				        	}
    					}
    				}
    		 
    		    }
    	 });
    	//if web app;
    	if(this.actualUrl){
			if(this.isInline()){
				if(this.loadOnLogin){
					//instantiate the inline widget now
					try{
						this.items = Ext.create(this.actualUrl);
					}catch (e) {
						this.items = Ext.create('Ext.panel.Panel', {
						        html: $W().localeManager.getLocalizationValue('application.javascript.ui.failedToLoadClass')+' '+this.actualUrl 
							});
					}
				}
			} else{
				if(this.isSecuredTab()){
					if(this.loadOnLogin){
						this.url = 'SYSTEM/resources/jsp/secureNesting.jsp?tabUrl='+this.actualUrl;
					}else{
						this.actualUrl = 'SYSTEM/resources/jsp/secureNesting.jsp?tabUrl='+this.actualUrl;
					}
				}
				this.html ='<iframe SECURITY="unrestricted" width="100%" height="100%" id='+this.id+'Id name='+this.id+ ' frameborder=0 scrolling="auto" src='+this.url+'></iframe>';
				Jacada.Logger.debug("Tab html: " + this.html);
			}
	    }else{
	    	//nested app
	    	this.html = Ext.create('Jacada.core.NestedApplicationComponent', this).html;
	    }
		
    	this.callParent(arguments);
    	//support accessKey
        if($W().tabPanel && this.accessKey && this.accessKey.length > 0){
        	$W().tabPanel.accessKeyMap.addBinding({
				key: this.accessKey,
				alt: true,
				handler: function(){$W().ShowTabById(this.itemId);},
				scope: this
			});
		}
     },
     isInline: function(){
    	 var isInline = this.actualUrl && this.actualUrl.indexOf('Jacada.') >= 0;
    	 Jacada.Logger.debug(this.id+' is inline = '+isInline);
    	return isInline;
     },
     isDashboard: function(){
    	 return this.actualUrl && this.actualUrl.startsWith('/dynamicviews/view/#');
     },
     registerDashboard: function(dashboard){
    	 Jacada.Logger.debug("WorkSpaceTab.js registerDashboard tab: " + this.getId() + ", dashboard: " + dashboard.dashboardConfig.name);
    	 this.dashboard = Ext.create('Jacada.core.Dashboard', {dashboard: dashboard});
     },
     //Dashboard can be NULL is it's not a dashboard or dashboard was not registered yet.
     getDashboard: function(){
    	 return this.dashboard;
     },
     allowMaximize: function(){
    	 var me  = this;
    	 if(!me.maximizable){
 			//tab is not maximizable
 			$W().HideCurrentVisibleTab();
 			Ext.MessageBox.show({
 				msg: $W().localeManager.getLocalizationValue('application.javascript.message.alert.selectedTabCannotBeMaximized'),
 		    	buttons: Ext.MessageBox.OK,
 		        fn: $W().ShowCurrentVisibleTab,
 		        icon: Ext.MessageBox.INFO
 		       });
 			return false;
 		}
    	 return true;
     },
     maximizeTab: function(){
    	 var me  = this;
    	 if(!me.allowMaximize()){
 			return;
 		}
    	 
		$W().workspaceUI.maximizedTab = true;
		me.hiddenComponentsForMaximizedTab = new Array();
		var components = this._getComponentsAroundTab();
		components.each(function(compId){
			var comp = Ext.getCmp(compId);
			if(comp){
				if(comp.isVisible()){
					Ext.getCmp(compId).hide();
					//keep hidden components for restore
					me.hiddenComponentsForMaximizedTab.push(compId);
				}
			}
				
		});
		if($W().LayoutByContext){
			var interactionLayoutPanel = Ext.getCmp('contextContentPanel').getLayout().getActiveItem(); 
    		interactionLayoutPanel.maximizeTab();
    		me.up().tools.maximize.hide();
    		me.up().tools.restore.show();
		}else{
			Ext.getCmp('simpleContentPanel').maximizeTab(); 
		}
		$W().workspaceUI.doLayout();
     },
    _getComponentsAroundTab: function(){
    	var components = new Array();
    	components.push('north-panel');
    	components.push('south-panel');
    	components.push('toolbar-panel');
    	if($W().LayoutByContext){
    		components.push(Ext.getCmp('contextNavigation').up().id);
    	}
    	return components;
    },
	restore: function(){
		//simply iterate the components and show them again
		this.hiddenComponentsForMaximizedTab.each(function(compId){
			var comp = Ext.getCmp(compId);
			if(comp){
				Ext.getCmp(compId).show();
				Jacada.Logger.debug('restored '+ compId);
			}
		});
		if($W().LayoutByContext){
			var interactionLayoutPanel = Ext.getCmp('contextContentPanel').getLayout().getActiveItem(); 
    		interactionLayoutPanel.restore();
    		this.up().tools.maximize.show();
    		this.up().tools.restore.hide();
		}else{
			Ext.getCmp('simpleContentPanel').restore(); 
		}
		this.hiddenComponentsForMaximizedTab = null;
		$W().workspaceUI.maximizedTab = false;
	},
	isSecuredTab: function(){
		return Ext.isIE && this.actualUrl.indexOf('https') > -1;
	},
	configIframeWidget: function(tab){
		var frame = document.getElementById(tab.id+'Id');
		if(frame){
			if(this.screenPopApp){
				this.screenPopPreUpdateUrl ? this.handleScreenPop(this.screenPopPreUpdateUrl) : this.handleScreenPop(this.actualUrl);
        	}
        	
			frame.src = tab.actualUrl;
		}
	},
	handleScreenPop: function(url){
	var request =  new Ajax.Request($W().contextPath + '/rest/screenpop/updateUrl',
		{
			requestHeaders: ['Accept', 'application/json', 'Content-type', 'application/json'],
			method: 'POST',
			postBody: Object.toJSON({url: url, uniqueId: this.transferredUniqueId ? this.transferredUniqueId : this.uniqueId, interactionType: this.currentInteractionType}),
			asynchronous : false
		});
		
    	if (request.success()) {
    		var responseText = Ext.decode(request.transport.responseText);
    		if(responseText.updated == true){
	    		this.actualUrl = responseText.url;
	    		Jacada.Logger.debug("Screen pop Tab URL updated: " + this.actualUrl);
	    		this.setLoading(false);
    		}else{
    			Jacada.Logger.warn("Screen pop Tab URL not changed since no there is no update data for url: " + this.actualUrl);
    			if(!this.screenPopPreUpdateUrl){
					this.screenPopPreUpdateUrl = this.actualUrl;    				
    			}
    			this.actualUrl = "about:blank";
    			this.setLoading($W().localeManager.getLocalizationValue('application.javascript.agentHistory.loadingText'));
    		}
		}else{
			Jacada.Logger.error('Screen pop failed to update url for tab with url: ' + this.actualUrl);
			return false;
		}
	}
});