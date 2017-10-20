Ext.define('Jacada.Utils', {
	singleton: true,

	createTab: function(tabConfig) {
		//hide the header from the panel, it will be displayed on the tab
		tabConfig.header = false;
		tabConfig.layout = 'fit';
		tabConfig.border = false;
		
		var tools = [];
    	if(tabConfig.maximizable && $W().LayoutByContext){
    		tools[0] = {
    		        	type: 'maximize',
    		        	tooltip: 'Maximize',
    		        	handler: function(event, toolEl, panelHeader) {
    		        		Ext.getCmp(tabConfig.id).maximizeTab();
    		        	}
    				};
    		tools[1] = {
		        	type: 'restore',
		        	tooltip: 'Restore',
		        	hidden: true,
		        	handler: function(event, toolEl, panelHeader) {
		        		Ext.getCmp(tabConfig.id).restore();
		        	}
				};
    	}
		var tabWrapper = Ext.create('Ext.panel.Panel', {
			layout: 'fit',
			tools: tools,
			id: tabConfig.itemId+'-wrapper',
			title: tabConfig.title.replace(/&nbsp;/g, ' ').toUpperCase(),
			hidden: tabConfig.hidden,
			border: true,
			bodyCls: 'baseColor',
			hideMode: 'offsets',
			closable: tabConfig.closable,
			items: Ext.create('Jacada.core.WorkSpaceTab',tabConfig),
			listeners: {
		    	activate: function(){
		    		Jacada.Logger.debug("activate tabWrapper: " + this.id);
		    		var tab;
		    		if($W().LayoutByContext){
		    			tab = this.getComponent(tabConfig.itemId);
		    		}else{
		    			tab = this.child();
		    		}
		    		tab.fireEvent('activate', tab);
		    	},
		    	deactivate: function(){
		    		Jacada.Logger.debug("deactivate tabWrapper: " + this.id);
		    		var tab;
		    		if($W().LayoutByContext){
		    			tab = this.getComponent(tabConfig.itemId);
		    		}else{
		    			tab = this.child();
		    		}
		    		tab.fireEvent('deactivate', tab);
		    	},
		    	render: function(_this, eOpts){
		    		if($W().LayoutByContext){
		    			Ext.create('Ext.tip.ToolTip', {
		    	            target: _this.header.id,
		    	            html: _this.title
		    	        });
		    			
		    			this.getHeader().on({
		    				dblclick: {
		    					fn: function() {
		    						if(tabConfig.maximizable){
		    							if(!$W().workspaceUI.maximizedTab){
		    								Jacada.Logger.debug("about to maximize " + tabConfig.id);
		    								Ext.getCmp(tabConfig.id).maximizeTab();
		    							}else{
		    								Jacada.Logger.debug("about to restore " + tabConfig.id);
		    								Ext.getCmp(tabConfig.id).restore();
		    							}
		    						}
		    					}
		    				}
		    			});
		    		}
		    	},
		    	beforeclose: this.onBeforeClose
			}
		});
		
		return tabWrapper;
	},
	format: function(format){
	    var args = Array.prototype.slice.call(arguments, 1);
	    return format.replace(/{(\d+)}/g, function(match, number) { 
	      return typeof args[number] != 'undefined'
	        ? args[number] 
	        : match
	      ;
	    });
	},
	onBeforeClose: function(_this, opts){
		//the actual tab is the first (and only) child
		$W().HideTabById(_this.down().itemId);
		return false;
	},
	isInTab: function(panel){
		return panel.up().$className == "Jacada.core.WorkSpaceTab";
	},
	loadLayout: function(interactionType){
		var request;
		if(interactionType){
			request = new Ajax.Request('SYSTEM/portlets/layoutManager/loadLayout.jsp?interactionType='+interactionType, {method: 'get', asynchronous : false});
		}else{
			request = new Ajax.Request('SYSTEM/portlets/layoutManager/loadLayout.jsp', {method: 'get', asynchronous : false});
		}
    	if (request.success()) {
    		Jacada.Logger.debug("got layout from server.");
    		// convert the string to an XML object
  			return eval("(" + request.transport.responseText + ")");
    	}
    	else {
    		alert('failed to load layout');
    	}
	},
	getPrettyLabel: function(label){
		//Capitalize first letter
		label = label.substr(0,1).toUpperCase() + label.substr(1);
		//insert space before each upper case letter
		label = label.replace(/([a-z])([A-Z])/g, '$1 $2');
		return label;
	},
	parseEmailAddress: function(emailAddress){
		//extract email address in case email is in the following format "Dekel Yaacov <dyaacov@jacada.com>"
		if(emailAddress.indexOf('<')>-1 && emailAddress.indexOf('>')>-1){
			emailAddress = emailAddress.substring(emailAddress.indexOf('<')+1, emailAddress.indexOf('>'));
		}
		return emailAddress;
	},
	//process images and links inside email
	processEmailBody: function(dom){
		//links
		var tagsLink = dom.getElementsByTagName("a");
		for (var i = 0; i < tagsLink.length; i++) { 
			tagsLink[i].target = '_blank';
		}
	}
});

Ext.define('Jacada.Logger', {
	singleton: true,

	log: function(message, level) {
		if(typeof console != 'undefined'){
			if(level == 'info'){
				console.info(message);
			}else if(level == 'warn'){
				console.warn(message);
			}else if(level == 'debug'){
				console.log(message);
			}else if(level == 'error'){
				console.error(message);
			}else{
				//default
				console.log(message);
			}
		}
	},
	info: function(message) {
		Jacada.Logger.log(message, 'info');
	},
	warn: function(message) {
		Jacada.Logger.log(message, 'warn');
	},
	debug: function(message) {
		Jacada.Logger.log(message, 'debug');
	},
	error: function(message) {
		Jacada.Logger.log(message, 'error');
	}
	
});