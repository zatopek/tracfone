
function ShowTabById(tabId) {
	if($W().LayoutByContext){
		Ext.getCmp('contextNavigation').showTab(tabId);
		return;
	}
	 //WorkSpaceTab
	var tab = getTab(tabId);
	if(tab){
		var maximizedTab = $W().workspaceUI.maximizedTab;
		if(maximizedTab){
			//if current tab is maximized, we need to restore current maximized tab and maximize the new tab
			tab.restore();
		}
		tab.up().tab.show();
		$W().tabPanel.setActiveTab(tab.up());
		//maximize the tab
		if(maximizedTab){
			//WorkSpaceTab
			tab.maximizeTab();
		}
		afterShowTabById(tabId);
	}else{
		if(!maximizedTab){
			Jacada.Logger.debug("ShowTabById: Tab " + tabId + " does not exists.");
		}
	}
}

function HideTabById(tabId){
	if($W().LayoutByContext){
		alert('not supported when working in context mode');
		return;
	}
	var tab = getTab(tabId);
	if(tab){
		//hide the requested tab
		tab.up().tab.hide();
		//if we are hiding the active tab, set the default tab as active
		if(getDefaultActiveTab() == tabId){
			//if we are hiding the default tab, set the first tab as active
			$W().tabPanel.setActiveTab(0);
		}else{
			$W().tabPanel.setActiveTab(getDefaultActiveTab()+'-wrapper');
		}
	}
}

function RemoveTabById(tabId){
	if($W().LayoutByContext){
		Ext.getCmp('contextNavigation').removeTab(tabId);
		return;
	}
	var tab = getTab(tabId);
	if(tab){
		$W().tabPanel.remove(tab.up(), true);//true to destroy the tab
	}
}

function AddNewTab(tabConfig, index){
	var exists = false;
	if($W().LayoutByContext){
		if(Ext.getCmp('contextNavigation').findNode(tabConfig.tabId)){
			exists = true;
		}
	}else if(getTab(tabConfig.tabId)){
		exists = true;
	}
	if(exists){
		Jacada.Logger.debug("AddNewTab: Tab " + tabConfig.tabId + " already exists.");
		$W().ShowTabById(tabConfig.tabId);
		return;
	}
	var config ={
			itemId: tabConfig.tabId,
			title: tabConfig.title,
			closable: tabConfig.closable,
			maximizable: tabConfig.maximizable,
			hideMode: 'offsets',
			autoScroll: true,
			autoDestroy: false
	}; 
	if($W().LayoutByContext){
		config.closable = false;
		interactionType = $W().activeContext.interactionType
	}
	if(tabConfig.isWeb){
		config.actualUrl = tabConfig.url;
		config.id = tabConfig.frameId;
	}else{
		config.id = tabConfig.tabId;
		config.itemId = tabConfig.tabId;
		config.exeName = getNullSafe(tabConfig.exeName);
		config.workingDirectory = getNullSafe(tabConfig.workingDirectory);
		config.arguments = getNullSafe(tabConfig.arguments);
		config.exeNameRegKey = getNullSafe(tabConfig.exeNameRegKey);
		config.workingDirectoryRegKey = getNullSafe(tabConfig.workingDirectoryRegKey);
		config.argumentsRegKey = getNullSafe(tabConfig.argumentsRegKey);
		config.detectBusy = getNullSafe(tabConfig.detectBusy);
		config.busyMessage = getNullSafe(tabConfig.busyMessage);
		config.showLoadMsg = getNullSafe(tabConfig.showLoadMsg);
		config.enableScrollbars = getNullSafe(tabConfig.enableScrollbars);
		config.avoidPlaceInsideHost = getNullSafe(tabConfig.avoidPlaceInsideHost);
		config.recreateApp = getNullSafe(tabConfig.recreateApp);
		config.alwaysHideWin = getNullSafe(tabConfig.alwaysHideWin);
		config.centerApps = getNullSafe(tabConfig.centerApps);
		config.excludeProcess = getNullSafe(tabConfig.excludeProcess);
		config.showWindowInCorrectTab = getNullSafe(tabConfig.showWindowInCorrectTab);
		config.loadOnLogin = false;
		config.containerId = config.itemId;
		
		config.backgroundColor = tabConfig.backgroundColor;
		if(!config.backgroundColor){
			//let's provide a default
			config.backgroundColor = "000000";
		}

		config.loadingMsg = tabConfig.loadingMsg;
		if(!config.loadingMsg){
			//let's provide a default
			config.loadingMsg = $W().localeManager.getLocalizationValue("application.javascript.nesting.label.loadingMessage");
		}
		
		config.linkCaption = tabConfig.linkCaption;
		if(!config.linkCaption){
			//let's provide a default
			config.linkCaption = $W().localeManager.getLocalizationValue("application.javascript.nesting.label.linkText");
		}
	}
	var tab = Jacada.Utils.createTab(config);
	if($W().LayoutByContext){
		var groupId = $W().activeContext.groupId;
		var groupNode = Ext.getCmp('contextNavigation').findNode(groupId);
		groupNode.appendChild({itemId: config.itemId, id: config.itemId, text: config.title, leaf: true, interactionType: config.interactionType });
		Ext.getCmp('contextContentPanel').addTab(config, $W().activeContext.interactionType, groupId);
	}else{
		if(!index || index == 0){
			//add as last tab
			$W().tabPanel.add(tab);
		}else{
			$W().tabPanel.insert(index, tab);
		}
		$W().tabPanel.createDblClickHandler(tab);
	}
	$W().ShowTabById(tabConfig.tabId);
}

function setNestedApplicationVisible(tab, visible){
	if (tab) {
		Jacada.Logger.debug("setNestedApplicationVisible: visible=" + visible+", tab.itemId="+tab.itemId);
		if(!visible &&  $W().displayManager == null){
			//nothing to hide
			return;
		}
		Jacada.Logger.debug("searching for element "+"nested-div-"+tab.itemId);
		var nestedDiv = document.getElementById("nested-div-"+tab.itemId);
		//nestedDiv exists only in tab with nested application
		if(nestedDiv && nestedDiv.childNodes.length > 0){
			if(visible){
				if(Ext.WindowManager.getActive() == null || Ext.WindowManager.getActive( ).hidden){
					nestedDiv.style.display = "inline";
				}
			}else{
				nestedDiv.style.display = "none";
			}
			var nestedObject = document.getElementById("nested-object-"+tab.itemId);
			Jacada.Logger.debug("searching for element "+"nested-object-"+tab.itemId);
			if(nestedObject && nestedObject.tagName == "OBJECT"){
				Jacada.Logger.debug("nestedObject found ");
				if ("true" == nestedObject.getAttribute("isActiveXObject")) {
					try{
						if(visible){
							if(Ext.WindowManager.getActive() == null || Ext.WindowManager.getActive( ).hidden){
								nestedObject.ShowApplications();
								$W().displayManager.setCurrentActiveNestedApplication(nestedObject.id,nestedObject);
							}
						}else{
							nestedObject.HideApplications();
							$W().displayManager.clearCurrentActiveNestedApplication(nestedObject.id);
						}
					}catch (e){
						$W().LogManager.getLogger("jad.js").debug('activex function call failed - ' + e );
					}          
				}
			}
		}
	    //handle nested extJS multitab
	    if (tab.id == "MultiTabFrame") {
	    	if(visible)	{
	    		showExtJSActiveTab();
	    	}else{
	    		hideExtJSActiveTab();
	    	}
	    }
	}
}

function setTabTitle(tabId, title, localizedTitle) {
	var tab = getTab(tabId);
	if(tab){
		if (localizedTitle) {
    		title = $W().localeManager.getLocalizationValue(title);
    	}
		//the title is on the tab's wrapper
		tab.up().setTitle(title);
	}
}

function hideTabTitle(tabId) {
    setTabTitleDisplay(tabId, false);
}

function showTabTitle(tabId) {
    setTabTitleDisplay(tabId, true);
}

function setTabTitleDisplay(tabId, display) {
	var tab = getTab(tabId);
	if(tab){
		tab.setVisible(display)
	}
}


//Hide the tab currently displayed
function HideCurrentVisibleTab(){
	try{
		setNestedApplicationVisible(getTab(), false);
	}catch(e){
		//just continue
	}
}

//Show the tab currently displayed
function ShowCurrentVisibleTab(){
	try{
		setNestedApplicationVisible(getTab(), true);
	}catch(e){
		//just continue
	}
}

function getTab(tabId){
	var tab;
	if($W().LayoutByContext){
		var interactionLayoutPanel = Ext.getCmp('contextContentPanel').getLayout().getActiveItem();
		//get the active tab
		tab = interactionLayoutPanel.getActiveTab();
		if(tab){
			tab = tab.items.items[0];
		}
	}else if(tabId){
		tab = $W().tabPanel.items.getByKey(tabId+'-wrapper');
		if(tab){
			tab = tab.child();
		}
	}else{
		tab = $W().tabPanel.getActiveTab();
		tab = tab.child();
	}
	//WorkSpaceTab
	return tab;
}

function onIsProcessNested(processID)
{

    var processFound = isProcessNested(processID);
    
    var updaterUrl = "SYSTEM/external/NestedProcessesUpdater.jsp";
    var pars = "isProcessNestedResult=" + processFound;
    pars += "&processID=" + processID;
    new Ajax.Request(updaterUrl, { method: 'get', parameters: pars } );
}

function ShowAlertMessageWhenHostedAppAreRunning(msgString)
{

	    alert($W().localeManager.getLocalizationValue('application.javascript.message.alert.imposibleMessageWhenHostingBegin')+' ' + msgString + ' '+$W().localeManager.getLocalizationValue('application.javascript.message.alert.imposibleMessageWhenHostingMiddle')+' '+
		msgString + ', '+$W().localeManager.getLocalizationValue('application.javascript.message.alert.imposibleMessageWhenHostingEnd'));
}

function isProcessNested(processID)
{
	var processFound = false;

    var objects = $D().getElementsByTagName("OBJECT");
    for(i = 0; i < objects.length; i++){
        if(objects[i].isActiveXObject == "true"){
            try{
                if(objects[i].IsProcessRunning()){
                    processFound = objects[i].IsProcessNested(processID);
                    if(processFound){
                        break;
                    }
                }
            }catch (e){
                $W().LogManager.getLogger("tabs.js").debug('activex function IsProcessNested failed - '+ e );
            }
        }
    }

    return processFound;
}
