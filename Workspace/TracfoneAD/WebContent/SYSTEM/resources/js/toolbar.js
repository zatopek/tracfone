
var modalDiv;

var currClientHeight;
var currClientWidth;

//Each shown portlets gets next zIndex.
//The range for zIndex is restricted by getBottomZIndex and getTopZIndex.
//Two functions are created for future overrding.
//When top zIndex is reached, portlets' zIndex is reset to bottom one.
var currentZIndex = getBottomZIndex();

function getBottomZIndex(){
	return 19500;
}

function getTopZIndex(){
	return 19999;
}

function setSizeAndPos(buttonId, dialogWidth, dialogHeight) {
	dialogHeight += 30;
    var ch = document.body.clientHeight;
    var sh = document.body.scrollHeight;
    var cw = document.body.clientWidth;
    var sw = document.body.scrollWidth;
    
    var theTop;
    var theLeft;

    if ( (ch - dialogHeight) < 0 )
    {
        theTop = document.documentElement.scrollTop;
    } else {
        theTop = parseInt((ch - dialogHeight)/2) + document.body.scrollTop;
    }

    if ( (cw - dialogWidth) < 0 )
    {
        theLeft = document.documentElement.scrollLeft;
    } else {
        theLeft = parseInt((cw - dialogWidth)/2) + document.body.scrollLeft;
    }

	setModalDivDimensions();
    var tbFrame = toolbarWindows[buttonId].wrapperFrame;
    tbFrame.style.top = theTop+"px";
    tbFrame.style.left = theLeft+"px";
    tbFrame.style.height = dialogHeight+"px";
    tbFrame.style.width = dialogWidth+"px";
    
    if ($W().toolbarItems[buttonId].enablePortletDragging) {
    	var buttonsSpace = 40;
    	if($W().toolbarItems[buttonId].modal){
    		buttonsSpace = 20;
    	}
   		tbFrame.contentWindow.document.getElementById('dragHandler').style.width = (dialogWidth - buttonsSpace);
   	}
}

function setModalDivDimensions() {
	var ch = document.body.clientHeight;
    var sh = document.body.scrollHeight;
    var cw = document.body.clientWidth;
    var sw = document.body.scrollWidth;
    
    modalDiv.style.height = '100%';
    modalDiv.style.width = '100%';
    modalDiv.style.top = 0;
    modalDiv.style.left = 0;
}

// place toolbar portlet after a window resize event
function placeToolbarPortletsonResize() {
	var newClientHeight = document.body.clientHeight;
	var newClientWidth = document.body.clientWidth;
	
	// go over all opened portlets
	for(var winId in toolbarWindows){
		if(winId != "extend") {
			if(toolbarWindows[winId].isShownBefore){
				// get wrapping iframe
				var winFrame = toolbarWindows[winId].wrapperFrame;
				var currTop = parseFloat(winFrame.style.top);
				var currLeft = parseFloat(winFrame.style.left);
				// set top left relativly to change
				winFrame.style.top = currTop * (newClientHeight / currClientHeight);
				winFrame.style.left = currLeft * (newClientWidth / currClientWidth);
			}
		}
	}
	// save new window dimensions
	currClientHeight = newClientHeight;
	currClientWidth = newClientWidth;
	// change modal div dimensions
	setModalDivDimensions();
}

function runToolbarItem(buttonId) {	
	if(!$W().toolbarItems[buttonId]){
		alert('Toolbar item with ID ' + buttonId + ' not found!');
		return;
	}
	
	if(toolbarWindows[buttonId]){
		//If portlet never been shown before,
		//we need to set it's size and place in the middle. 
		if(!toolbarWindows[buttonId].isShownBefore){
			setSizeAndPos(buttonId, toolbarItems[buttonId].width, toolbarItems[buttonId].height);	
		}
		//The following handles zIndex when click made on toolbar icon.
		//When click made inside portlet, activate flag is triggered (in toolbarWrapper.jsp)
		if(!$W().toolbarItems[buttonId].modal){
			toolbarWindows[buttonId].wrapperFrame.style.zIndex = $W().getNextZIndex();
		}	
		//stop any notification effect if exists
		undoToolbarNotification(buttonId);
		toolbarWindows[buttonId].show();
	}
	else{
		var button  = document.getElementById(buttonId);
		eval($W().toolbarItems[buttonId].javascriptCode);
	}
	
}
/*
function getWrapperFrame(tbId){
	return $D().getElementById(tbId + "-tbFrame");
}
*/
//Function that returns next zIndex.
//If top zIndex is reached, all portlets' zIndex is reser to bottom
function getNextZIndex(){
	currentZIndex++;
	//There is space to go
	if(currentZIndex < getTopZIndex()){
		return currentZIndex;
	}else{
		//Top zIndex is reached.
		//Storing portlets zIndex and references to their wrapper frames 
		//for easier sorting and access.
		zIndexArray = new Array();
		zIndexHash = new Hash();
		items = toolbarItems;
		for(var item in items){
			if(items[item].tag == "portlet"){
				wrapperFrame = toolbarWindows[items[item].id].wrapperFrame;
				zIndexArray.push(wrapperFrame.style.zIndex);
				zIndexHash.set(wrapperFrame.style.zIndex, wrapperFrame);
			}
		}
		//Sorting zIndexes
		zIndexArray.sort(function(a, b){
			return a - b;
		});
		//Setting new zIdnexes according to sorting order.
		var bottomZIndex = getBottomZIndex();
		currentZIndex = bottomZIndex + 1;
		zIndexArray.each(function (frameZIndex){
			currentZIndex++;
			var fr = zIndexHash.get(frameZIndex);
			//if zIndex == bottomZIndex, portlet never been shown before.
			//we must keep it's bottom zIndex value.
			if(fr.style.zIndex != bottomZIndex){
				fr.style.zIndex = currentZIndex;
			}
		});
		//returning next zIndex, which is actually (number of portlets + 1)
		return getNextZIndex();
	}
} 

function toolbarInit(toolbarItems){

	if(!toolbarItems){
		 $W().LogManager.getLogger("TOOLBAR").error("Toolbar cannot be initialized since the given items do not exist");
		 return;
	}
	
	currClientHeight = document.body.clientHeight;
	currClientWidth = document.body.clientWidth;

	modalDiv = $W().document.createElement("div");
	modalDiv.id = "modalDiv";
	modalDiv.style.zIndex = getTopZIndex() + 1;
	modalDiv.style.filter = 'alpha(opacity=35)';
	modalDiv.style.left = 0;
	modalDiv.style.visibility = 'hidden';
	modalDiv.style.width = 0;
	modalDiv.style.position = 'absolute';
	modalDiv.style.top = 0;
	modalDiv.style.height = 0;
	modalDiv.style.opacity = 0.5;
	modalDiv.style.backgroundColor = 'gray';
	$W().document.body.appendChild(modalDiv);

	Ext.onReady(function(){
		for(var key in toolbarItems){
			var item = toolbarItems[key];
			if(item.tag == "portlet"){
				addToolbarItem(item);
			}
		}
	});
	
	addEvent(document.body, 'resize', placeToolbarPortletsonResize, false);
		
	Push.registerEventHandler('toolbarButtonNotification', onToolbarButtonNotification);    
}
function addToolbarItem(item){
	var tbFrameId = item.id + "-tbFrame";
	if ($W().document.getElementById(tbFrameId)){
		//item already exists
		return;
	}
	tbFrame = $W().document.createElement("IFRAME");
	tbFrame.id = tbFrameId;
	tbFrame.name = tbFrameId;
	if(item.modal){
		tbFrame.style.zIndex = getTopZIndex() + 2;
	}
	else{
		tbFrame.style.zIndex = getBottomZIndex();
	}
	tbFrame.style.position = "absolute";
	tbFrame.scrolling = "no";
	tbFrame.style.border = 0;
	//Fixing tabbing through a portal WS-1960
	tbFrame.style.visibility = 'hidden';
	tbFrame.style.display = 'none';
    tbFrame.style.top = 0;
    tbFrame.style.left = 0;
    tbFrame.style.height = 0;
    tbFrame.style.width = 0;
    tbFrame.src = 'SYSTEM/resources/jsp/toolBarWrapper.jsp?tbId=' + item.id;
	$W().document.body.appendChild(tbFrame);
}

function onToolbarButtonNotification(buttonId){
	notifyToolbarButton(buttonId);
}
function notifyToolbarButton(buttonId){
	//error case
	if(!$W().toolbar){
		return;
	}
	if(!toolbarWindows[buttonId] && !$W().toolbarItems[buttonId]){
		 $W().LogManager.getLogger("TOOLBAR").error("Toolbar button Id " +
        	 buttonId + " does not exist.");
		return;
	}
	//when there is a  window and it is open
	if(toolbarWindows[buttonId] && toolbarWindows[buttonId].isWindowOpened){
		toolbarWindows[buttonId].focus();
		performEffect(toolbarWindows[buttonId], 3);
		return;
		
	}
	//other cases: closed window or js item
	//do nothing if already flashing
	if (!$W().toolbarItems[buttonId].isFlashing || $W().toolbarItems[buttonId].isFlashing == false){
		//mark as flashing
		$W().toolbarItems[buttonId].isFlashing = true;
		$W().toolbar.items.getByKey(buttonId).btnEl.frame(getNotificationBgColor(), getNumOfTimesToFlickerIcon(), { duration: 1000 });
	}
}


function getNumOfTimesToFlickerIcon(){
	return 5;
}

/*
 * Performs effect on the main panel for a given number of times
 */
function performEffect(window, numOfTimes){
	while (numOfTimes > 0)
	{
		window.el.fadeIn();
		numOfTimes--;
	}
}
function getNotificationBgColor(){
	return "#3d5c79";
}

/*
 * Undo the flashing of the icon and the effect of marked toolbar icon
 */
function undoToolbarNotification(buttonId){
	//cancel Flashing
	if($W().toolbar){
		$W().toolbarItems[buttonId].isFlashing=false;
		var btn = $W().toolbar.items.getByKey(buttonId);
		if(btn){
			var btnEl = btn.btnEl;
			if(btnEl){
				btnEl.stopAnimation();
			}
		}
	}
}
//this function is required since the toolbar.js is located at the end of the index.jsp therefore overrides the override.js
function addOverrideIncludes(contextPath){
	//override.js
  	var ss = document.createElement("script");
   	ss.setAttribute("type", "text/javascript");
   	ss.setAttribute("src", contextPath+"/USER/resources/js/override.js");
   	document.getElementsByTagName("head")[0].appendChild(ss);
   
}
addOverrideIncludes($W().contextPath);
toolbarInit($W().toolbarItems);

