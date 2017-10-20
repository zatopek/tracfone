
// Menu Functions
var currSubMenu = null;

//menu methods
function ehandler(event,theSubMenu){
  if (currSubMenu != null) {
    currSubMenu.style.display="none";
  }
  currSubMenu = theSubMenu;
  currSubMenu.style.display="inline";
}

/*
 * The function enforces the "Help" menu-item to be always the last item on the menu
 */
function makeHelpMenuItemLast() {
    var w = document.getElementsByClassName('menu-bar')[0];  //the div
    var helpValue = localeManager.getLocalizationValue('Help');
    //find the index of the help item
    for( var i = 0 ; i < w.children.length ; i++ )
    {
        if ( w.children[i].innerHTML == helpValue )
        {
            if ( i != w.children.length - 1 )
            {
                w.children[i].swapNode( w.children[ w.children.length - 1 ] );
            }
            return;
        }
    }      
}

// Menu Code
var activeMenu = null;
var zBase = 7777777;

function getElemLeft(elem){
  var x;
  x = elem.offsetLeft;
  if (elem.offsetParent != null && (elem.className != "menu"))
     x += getElemLeft(elem.offsetParent);
  return x;
}

function getElemTop(elem){
  var y;
  y = elem.offsetTop;
  if (elem.offsetParent && (elem.className != "menu"))
    y += getElemTop(elem.offsetParent);
  return y;
}

function getBaseElem(elem,tag,className){
  while (elem != null){
    if (elem.tagName != null && elem.tagName == tag && containsClass(elem,className))
      return elem;
    elem = elem.parentNode;
  }
  return elem;
}

function containsClass(elem,name){
  var i, list;
  classlist = elem.className.split(" ");
  for (i = 0; i < classlist.length; i++){
     if (classlist[i] == name)
       return true;
  }
  return false;
}

function getEventTarget(evt){
  evt = (evt)?evt:((event)?event:null);
  return (evt.srcElement)?evt.srcElement:((evt.currentTarget)?evt.currentTarget:null);
}

function adjustArrows(menuObj){
  taglist = menuObj.getElementsByTagName("A");
  if (taglist.length > 0){
    textwidth = taglist[0].offsetWidth;
    for (i = 0; i < taglist.length; i++){
      itemlist = taglist[i].getElementsByTagName("SPAN");
      te  = null;
      ae = null;
      for (j = 0; j < itemlist.length; j++){
        if (containsClass(itemlist[j], "texttag"))
          te = itemlist[j];
        
        if (containsClass(itemlist[j], "arrow"))
          ae = itemlist[j];
      }
      
      if (te != null && ae != null)
        te.style.paddingRight = (textwidth - (te.offsetWidth + ae.offsetWidth)) + "px";
    }
  }
}
function displayMenu(menuItem, hide){
    if( $(menuItem) != undefined && $(menuItem) != null )
    {
        if(hide)
        {
            $(menuItem).style.visibility='hidden';
        }else {
            $(menuItem).style.visibility='visible';
        }
    }
}
function ShowMenu(evt,menuid,fVert){
  var item = getEventTarget(evt);
  var menuObj = document.getElementById(menuid);
  if( menuObj == null)
    return;
  if (document.all && fVert)
    item = getBaseElem(item,"A","menu-item");
  
  if ( item.m_activeMenu == null ){
    item.m_activeMenu = menuObj;
    if (!item.m_activeMenu.m_fInit){
      adjustArrows(item.m_activeMenu);
      item.m_activeMenu.m_fInit = true;
    }
  }
  if (item.onmouseout == null)
    item.onmouseout = OnMouseOut;
    
  if (item == activeMenu)
    return false;
    
  if (activeMenu != null){
    if (activeMenu.m_activeMenu != null){
      HideSubMenu(activeMenu.m_activeMenu);
      activeMenu.m_activeMenu.style.visibility = "hidden";
    }
  }
  
  if (item.onmouseout == null)
    item.onmouseout = OnMouseOut;
     
  if (item.m_activeMenu != undefined )
    if ( item.m_activeMenu.onmouseout == null)
        item.m_activeMenu.onmouseout = OnMouseOut;
    
  var x, y;
  if (!fVert){
    x = item.offsetLeft;
    y = item.offsetTop + item.offsetHeight + 2;
  }else{
    x = item.offsetLeft + item.offsetWidth;
    y = item.offsetTop;
  }
  
  menuObj.style.left = x + "px";
  menuObj.style.top = y + "px";
  menuObj.style.visibility = "visible";
  menuObj.style.zIndex = zBase++;
  //showing an iframe together with the menu div, so that the clipping mecahnism will be activated
  adjustClippedIframeForClipping(menuObj);
  
  activeMenu = item;
}
/**
 * This method is specifically for clipping. It creates an iframe that wraps the menu div, the reason for this is that the activeX cannot clip divs (WS-1531). 
 * @param {Object} menuObj - the menu div object to be wrapped by a dummy iframe for clipping.
 */
function  adjustClippedIframeForClipping(menuObj){
	var menuId = menuObj.id;
	var clippedIframe = createClippedIframeIfNeeded(menuObj);
	//setting the style of the clippedIframe to be like the menu's style
	clippedIframe.style.width = menuObj.offsetWidth;
	clippedIframe.style.height = menuObj.offsetHeight;
	clippedIframe.style.top = menuObj.style.top;
	clippedIframe.style.left = menuObj.style.left;
	clippedIframe.style.zIndex = menuObj.style.zIndex-1;
	clippedIframe.style.display = "block";
	clippedIframe.style.position = "absolute";
	//re-registering for clipping 
	$W().displayManager.registerIframeInNestedApplication(clippedIframe.id);
}

function createClippedIframeIfNeeded(menuObj){
	var iframeId = _getMenuClippingClippedIframeId(menuObj.id);
	var clippedIframe = $D().getElementById(iframeId);
	if (clippedIframe == null){
		clippedIframe = document.createElement('iframe');
		clippedIframe.id = iframeId;
		clippedIframe.src = 'SYSTEM/resources/html/empty.html';
		menuObj.parentNode.appendChild(clippedIframe);
		clippedIframe.style.display = 'none';
	}
	return clippedIframe;
}

function _getMenuClippingClippedIframeId(menuId){
	return menuId+'_clippedIframe';
	
}

function ShowSubMenu(event,menuid){
  var item = getEventTarget(event);
  if (document.all)
    item = getBaseElem(item,"A","menu-item");
    
  var elem = document.getElementById(menuid);
  var basemenu = getBaseElem(item,"DIV","menu");
  
  if (basemenu.m_activeMenu != null){
    HideSubMenu(basemenu);
  }
  
  basemenu.m_activeMenu = item;
  
  if (item.m_subMenu == null){
    item.m_subMenu = elem;
    if (item.m_subMenu.m_fInit == null){
      adjustArrows(item.m_subMenu);
      item.m_subMenu.m_fInit = true;
    }
  }
  
  if (item.m_subMenu.onmouseout == null)
    item.m_subMenu.onmouseout = OnMouseOut;
    
  var x, y;
  x = getElemLeft(item) + item.offsetWidth;
  y = getElemTop(item);
  var maxX, maxY;
  maxX = Math.max(document.documentElement.scrollLeft, document.body.scrollLeft) + (document.documentElement.clientWidth != 0 ? document.documentElement.clientWidth : document.body.clientWidth);
  maxY = Math.max(document.documentElement.scrollTop, document.body.scrollTop) + (document.documentElement.clientHeight != 0 ? document.documentElement.clientHeight : document.body.clientHeight);
  maxX -= item.m_subMenu.offsetWidth;
  maxY -= item.m_subMenu.offsetHeight;
  
  if (x > maxX)
    x = Math.max(0, x - item.offsetWidth - item.m_subMenu.offsetWidth+ (basemenu.offsetWidth - item.offsetWidth));
    
  y = Math.max(0, Math.min(y, maxY));
  elem.style.left = x + "px";
  elem.style.top = y + "px";
  elem.style.visibility = "visible";
  elem.style.zIndex = zBase++;
  //showing an iframe together with the menu div, so that the clipping mecahnism will be activated
  adjustClippedIframeForClipping(elem);
  
  if (document.all)
    event.cancelBubble = true;
  else
    event.stopPropagation();
}

function HideMenu(item){
  if (item.m_activeMenu != null){
    HideSubMenu(item.m_activeMenu);
    item.m_activeMenu.style.visibility = "hidden";
    item.m_activeMenu.style.zIndex = 0;
    //hiding dummy ifarame
    hideClippedIframeForMenu(item.m_activeMenu);
  }
  
  
}
/**
 * This method is specifically for clipping. It undisplays the created iframe that wraps the menu div.. 
 * @param {Object} menuObj - the menu div object wrapped by a dummy iframe for clipping.
 */
function hideClippedIframeForMenu(menuObj){
	var iframeId = _getMenuClippingClippedIframeId(menuObj.id);
	var clippedIframe = $D().getElementById(iframeId);
	if (clippedIframe != null){
		clippedIframe.style.width="0px";
		clippedIframe.style.height="0px";
		clippedIframe.style.display = 'none';
		//unregistering the the iframe from the clipping mechanism
		$W().displayManager.unRegisterIframeInNestedApplication(clippedIframe.id);
	}
}
function HideSubMenu(objMenu){
  if (objMenu == null || objMenu.m_activeMenu == null)
    return;
    
  if (objMenu.m_activeMenu.m_subMenu != null){
    HideSubMenu(objMenu.m_activeMenu.m_subMenu);
    objMenu.m_activeMenu.m_subMenu.style.visibility = "hidden";
    objMenu.m_activeMenu.m_subMenu.style.zIndex = 0;
     //hiding dummy ifarame
    hideClippedIframeForMenu(objMenu.m_activeMenu.m_subMenu);
    objMenu.m_activeMenu.m_subMenu = null;
   
  }
  
  objMenu.m_activeMenu = null;
}

function SubMenuHandler(event){
  var objMenu;
  objMenu = getEventTarget(event);
  if (document.all)
    objMenu = getBaseElem(getEventTarget(event),"DIV","menu");
    
  if (objMenu.m_activeMenu != null){
    HideSubMenu(objMenu);
  }
}

function OnMouseOver(event,menuId,fVertical){
	openMenu(event,menuId,fVertical);
}

function OnMouseClick(event,menuId,fVertical){
	openMenu(event,menuId,fVertical);
}

function openMenu(event,menuId,fVertical){
	var item = getEventTarget(event);
	if (activeMenu == null){
		ShowMenu(event, menuId,fVertical);
		return;
	}
	  
	if (activeMenu != null && activeMenu != item){
		ShowMenu(event,menuId,fVertical);
	}
}

function OnMouseOut(evt){
  evt = (evt)?evt:(event)?event:null;
  var to;
  
  if (activeMenu == null)
    return;
    
  if (document.all)
    to = evt.toElement;
  else if (evt.relatedTarget != null)
    to = (evt.relatedTarget.tagName ? evt.relatedTarget : evt.relatedTarget.parentNode);
    
  if (getBaseElem(to, "DIV", "menu") == null){
    HideMenu(activeMenu);
    activeMenu = null;
  }
}

