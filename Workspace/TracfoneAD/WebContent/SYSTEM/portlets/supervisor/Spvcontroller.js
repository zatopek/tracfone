
var	tabs = null;	

var currHeight = -1;
var currWidth = -1;

/**
 * This method will be called when the portlet is loaded.
 * Should be used to define extJs UI components.
 */
Ext.onReady(function(){
	

	for (i = 0 ; i < supervisor_tabs.length; i++) {
		var localizationKey = supervisor_tabs[i].title;
		var panel = new Ext.Panel({
			title: $W().localeManager.getLocalizationValue(localizationKey),
			autoLoad: {
				url: context + supervisor_tabs[i]['autoLoad']['url']
			},
	        defaults: {
				hideMode: "offsets"
			},
			layout: 'card'
		});
		supervisor_tabs[i] = panel;
	}
	
	
	
	// if we have only one tab , make it plain.
	if (supervisor_tabs.length > 1) {
		tabs = new Ext.TabPanel({
			renderTo: 'crtl',
			resizeTabs: true,
	        autoScroll: false,
	        activeTab: 0,
	        items:supervisor_tabs
		});
	} else {
		tabs = new Ext.Panel({
	        renderTo: 'crtl',
	        layout: 'fit',
	        autoScroll: false,
	        autoLoad: supervisor_tabs[0].autoLoad,
	        border: false
		});
	}
	document.body.onresize = new Function("resizeTabPanel()");
	resizeTabPanel();
});

var observers = [];
$W().registerSupervisorResize = function(obj) {
	observers.push(obj);
}


function delegateResize(w, h) {
	for (i = 0 ; i < observers.length; i++) {
		if (observers[i] != null) {
			observers[i].delegateResize(w,h);
		}
	}
}

function resizeTabPanel(){
	w = this.frameElement.offsetWidth;
	h = this.frameElement.offsetHeight;
	
	if(typeof console != 'undefined'){
		console.log('this.frameElement.offsetWidth  ' + w);
		console.log('tabs.getWidth  ' + tabs.getWidth());
	}
	tabs.setWidth(w);
	tabs.setHeight(h);
	tabs.doLayout();
	tabs.getEl().repaint();
	delegateResize(w,h);
}
