Ext.onReady(function(){
	
	//Calculator tab
	calculator = new Ext.Panel({
		title: getLocalizationValue('application.javascript.multiTab.calcTab.title'),
		id: 'calculator'
	});
	//Notepad tab
	notepad = new Ext.Panel({
		title: getLocalizationValue('application.javascript.multiTab.notpadTab.title'),
		id: 'notepad'
	});
	//Container to hold the TabPanel: 2 tabs Calculator and Applications
	var viewport = new Ext.Viewport({
		layout:'border',
		items: {
			region: 'center',
			margins:'0 0 0 0',
			xtype: 'tabpanel',
			id: 'mainTab',
			activeTab:0,
			tabPosition:'top',
			listeners:{
				beforetabchange: function(self, newTab, currentTab){
					if(currentTab){
						hideNestedApplication(currentTab);
					}
				},
				tabchange: function(self, tab){
					showNestedApplication(tab);
				}
			},
			items:[calculator,notepad]
		}
	});

	$W().viewport = viewport;
	//marking this frame as special to be identified when minimize/maximize tab
	var frame = $W().document.getElementById("MultiTabFrame");
	frame.setAttribute("isMultiNested","true");

});

function getLocalizationValue(key){
	return $W().localeManager.getLocalizationValue(key);
}
