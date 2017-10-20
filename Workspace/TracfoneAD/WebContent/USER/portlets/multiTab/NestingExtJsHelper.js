
function hideExtJSActiveTab(){
	if (!$W().viewport){
	// the viewport was not defined yet
		return;
	}
	var activeTab = $W().viewport.items.get(0).getActiveTab();
	var activeTabId = activeTab.id;
	hideNestedApplication(activeTab);
}

function showExtJSActiveTab(){
	if (!$W().viewport){
		// the viewport was not denied yet
		return;
	}
	var activeTab = $W().viewport.items.get(0).getActiveTab();
	var activeTabId = activeTab.id;
	showNestedApplication(activeTab);
}

function showNestedApplication(tab){
	//the updater is ready only if the tab is ready
	if (tab.body){
		if (!tab.loaded) {
			if (tab.id == 'calculator') {pageUrl = 'calculator.html';}
			else if (tab.id == 'notepad') {pageUrl = 'notepad.html';}
			
			if (pageUrl){
				if ($W().currentLoadedPage && $W().currentLoadedPage==pageUrl){
					//the page is already loaded
					return;
				}
				$W().currentLoadedPage = pageUrl;
				var updater = tab.getUpdater();
				updater.loadScripts = true;
				updater.update(pageUrl);
				tab.loaded = true;
			}
		} else {
			if (tab.id == 'calculator') {objId = 'calculatorObj';}
			else if (tab.id == 'notepad') {objId = 'notepadObj';}
			
			var frame = $W().document.getElementById("MultiTabFrameId");
			var app = frame.contentWindow.document.getElementById(objId);
			if (app != null) {
				app.ShowApplications();
				var wrapperDiv = frame.contentWindow.document.getElementById(objId + "WrapperDiv");
				if(wrapperDiv){
					wrapperDiv.style.display = "inline";
				}
				if(app.id) {
			   		$W().displayManager.setCurrentActiveNestedApplication(app.id,app);
			   	}
			}
		}
	}
}

function hideNestedApplication(tab){
	//the updater is ready only if the tab is ready
	if(tab.body){
		if (tab.id == 'calculator') {objId = 'calculatorObj';}
		else if (tab.id == 'notepad') {objId = 'notepadObj';}
		
		var frame = $W().document.getElementById("MultiTabFrameId");
		var app = frame.contentWindow.document.getElementById(objId);
		if (app != null) {
			app.HideApplications();
			var wrapperDiv = frame.contentWindow.document.getElementById(objId + "WrapperDiv");
			if(wrapperDiv){
				wrapperDiv.style.display = "none";
			}
		   	if(app.id) {
	        	$W().displayManager.clearCurrentActiveNestedApplication(app.id);
	        }
	 	}
	}
}