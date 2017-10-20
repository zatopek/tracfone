Ext.define('Jacada.core.WorkSpaceMenuToolbar', {
    extend: 'Ext.toolbar.Toolbar',
    
    accessKeyMap: null,
    border: false,
    
	initComponent: function(){
		var menuBar = this;
		this.loadItems();
		this.accessKeyMap = new Ext.util.KeyMap(document, {
			key: $W().localeManager.getLocalizationValue('application.javascript.menuBar.accessKey.logout'),
			alt: true,
			handler: function(){moveFocusForAccessKey(); runLink('jadLogoutBtn');}
		});
    	var menuItems = menuBar.getLeftMenuItems();
    	menuItems = menuItems.concat(menuBar.getRightMenuItems());
    	menuItems = menuItems.compact();
    	
		var config = {
			    scale: 'big',
				width: '100%',
				items: menuItems
		}

		Ext.apply(this, Ext.apply(this.initialConfig, config));
	    this.callParent(arguments);
	},
	/**
	 * Is separator required between menu items on the left side
	 */
	loadItems: function(){
        var request = new Ajax.Request('SYSTEM/portlets/menuManager/loadMenus.jsp', {method: 'get', asynchronous : false});
    	if (request.success()) {
  			$W().menuItems = eval("(" + request.transport.responseText + ")");
    	}
    	else {
    		alert('Failed to load menus');
    	}
    	
    	return $W().menuItems;
	},
	
	isAddSeparatorsBetweenMenuItems: function(){
		return false;
	},
	/**
	 * Returns menu items of the left side of the menu bar
	 */
	getLeftMenuItems: function(){
		var menuItems = $W().menuItems;
		var items = new Array();
		items.push({ xtype: 'tbspacer', width: 20 });
		//using loop for better performance
		var itemsIndex = 1;
		for (var i=0,len=menuItems.length; i<len; i++){
			var btnConfig = {
					text: menuItems[i].localizedName
			};
			if(menuItems[i].fHasMenu){
				btnConfig.menu = this.getSubMenuItems(menuItems[i]); 
			}
			var btn = new Ext.button.Button(btnConfig);
			if(menuItems[i].sValue){
				btn.sValue = menuItems[i].sValue;
				btn.setHandler(function(){eval(this.sValue);});
			}
			if(menuItems[i].sAccessKey){
				this.accessKeyMap.addBinding({
					key: $W().localeManager.getLocalizationValue(menuItems[i].sAccessKey),
					alt: true,
					handler: function(){moveFocusForAccessKey(); eval(this.sValue);},
					scope: btn
				});
			}
			items[itemsIndex] = btn;
			itemsIndex++;
			if(this.isAddSeparatorsBetweenMenuItems()){
				items[itemsIndex] = '-';
				itemsIndex++;
			}
		}
		//no need for stored menus
		$W().menuItems = null;
		return items;
	},
	getSubMenuItems: function(parentItem){
		var childItems = parentItem.childItems;
		var subMenuItems = new Array();
		//using loop for better performance
		for (var i=0,len=childItems.length; i<len; i++){
			if(childItems[i].fSeparator){
				subMenuItems[i] = '-';
			}else{
				var subMenuConfig = {
						text: childItems[i].localizedName
				};
				if(childItems[i].fHasMenu){
					subMenuConfig.menu = this.getSubMenuItems(childItems[i]); 
				}
				var subMenuItem = new Ext.menu.Item(subMenuConfig);
				if(childItems[i].sValue){
					subMenuItem.sValue = childItems[i].sValue;
					subMenuItem.handler = function(){eval(this.sValue)};
				}
				if(childItems[i].sAccessKey){
					this.accessKeyMap.addBinding({
						key: $W().localeManager.getLocalizationValue(childItems[i].sAccessKey),
						alt: true,
						handler: function(){moveFocusForAccessKey(); eval(this.sValue);},
						scope: subMenuItem
					});
				}
				subMenuItems[i] = subMenuItem;
			}
		}
		return {
			floating: {shadow: false},
			plain: true,
			items:subMenuItems
		};
	},
	/**
	 * Returns items of the right side of the menu bar
	 */
	getRightMenuItems: function(){
			
		var items = [
		        '->',
				{
   				xtype: 'tbtext',
   				text: $W().localeManager.getLocalizationValue('application.javascript.ctiCallInfoBar.label.status')
				},
				{
   				width: 200,
				id: "ctiStatus",
				itemId: "ctiStatus",
   				xtype: 'tbtext'
				},
				{
				id: 'ctiLoginBtn',
				handler: doCTILogin,
				cls: 'logoutBtn',
				text: $W().localeManager.getLocalizationValue('application.javascript.menuBar.label.CTIlogin')
				},
				this.getAgentNameConfig(),
				this.getAgentIdConfig(),
				{
					id: 'jadLogoutBtn',
					handler: showLogoutDialog,
					cls: 'logoutBtn',
					text: $W().localeManager.getLocalizationValue('application.javascript.menuBar.label.logout')
				}
				
		];
		return items;
	},
	/**
	 * Returns config object of agent Id
	 */
	getAgentIdConfig: function(){
		return {
			xtype: 'tbtext',
			id: 'menuAgentId',
			text: $W().agentName,
			listeners: {
				click: {
					element: 'el',
					fn: function(){$W().workspaceInfo.open();}
				}
			}
		}
	},
	/**
	 * Returns config object of agent name
	 */
	getAgentNameConfig: function(){
		return {
			xtype: 'tbtext',
			id: 'menuAgentName',
			text: $W().agentName
		}
	}
});