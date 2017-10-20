<html>
<head>
<style type="text/css">
	html, body {
		background-color: transparent;
	}
</style>
    <link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/SYSTEM/resources/js/extJS/resources/css/ext-all.css" />
	<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/USER/resources/css/override.css">
	
	<%@ include file = "/USER/resources/jspf/includes/toolbarCSSIncludes.jspf"%>
	
	<script type="text/javascript" src="${pageContext.request.contextPath}/SYSTEM/resources/js/prototype.js"></script>
    <script type="text/javascript" src="${pageContext.request.contextPath}/SYSTEM/resources/js/extJS/adapter/prototype/ext-prototype-adapter.js"></script>
    <script type="text/javascript" src="${pageContext.request.contextPath}/SYSTEM/resources/js/extJS/adapter/ext/ext-base.js"></script>
	<script type="text/javascript" src="${pageContext.request.contextPath}/SYSTEM/resources/js/extJS/ext-all.js"></script> 
    <script type="text/javascript" src="${pageContext.request.contextPath}/SYSTEM/resources/js/extJS-extensions/ext-DateTime.js"></script>
    <script type="text/javascript" src="${pageContext.request.contextPath}/SYSTEM/resources/js/jad.js"></script>
    <script type="text/javascript" src="${pageContext.request.contextPath}/SYSTEM/resources/js/JadWrapperToExtJs.js"> </script>
    <script type="text/javascript" src="${pageContext.request.contextPath}/SYSTEM/resources/js/Extjs-jad-utils.js"> </script>
    <script type="text/javascript" src="${pageContext.request.contextPath}/SYSTEM/resources/js/extJS-extensions/jacada/overrideToExtJS.js"> </script>
    <script type="text/javascript" src="${pageContext.request.contextPath}/SYSTEM/resources/js/dragiframe.js"></script>
    <script type="text/javascript" src="${pageContext.request.contextPath}/SYSTEM/resources/js/common.js"></script>
    <title>ToolBarWrapper</title>
    <script>
	    extPersonalizationInit(document, '${pageContext.request.contextPath}');
	    var tbId = "<%=request.getParameter("tbId")%>";
    	var item = $W().toolbarItems[tbId];
		Ext.onReady(function(){
					var win = new Ext.Window({
						id			: tbId + '-tbWindow',
						layout      : 'fit',
						width       : item.width,
						height      : item.height,
						// Shadow was removed because of a bug in IE8 -
						// when dragging a window across the screen it leaves marks
						// that disappear only on the next repaint.
						shadow		: false,
						modal		: false,
						plain		: true,
						closeAction	: 'hide', //always hiding. It will be reloaded on beforeshow if requred.
						collapsible	: !$W().toolbarItems[tbId].modal,
						resizable	: false,
						draggable	: false,
						autoScroll	: $W().toolbarItems[tbId].enablePortletScrolling,
						title		: $W().localeManager.getLocalizationValue(item.portletTitle),
						x 		: 0,
						y 		: 0,
						renderTo	: Ext.getBody()
					});
					
					win.reloadContentOnNextOpen = item.reloadContentOnNextOpen;
					win.loadOnLogin = item.loadOnLogin;
					if(tbId == 'ChatWindow'){
						win.reloadContentOnNextOpen = false;
					}
					win.styleClass = item.styleClass;
					var updater = win.getUpdater();
					updater.loadScripts = true;
					updater.setDefaultUrl("<%=request.getContextPath()%>/" + item.portletURL);
					if(win.reloadContentOnNextOpen){
						updater.disableCaching = true;
					}
					if(win.loadOnLogin){
						updater.update("<%=request.getContextPath()%>/" + item.portletURL);
						win.first = false;
					}
					
					win.wrapperFrame = $D().getElementById(tbId + "-tbFrame");
					win.isPortletActive = false; //indicates whether portlet is on top
					win.isShownBefore = false;
					win.on('hide', function(portlet){
						tbWrapper = portlet.wrapperFrame;
						tbWrapper.style.visibility = 'hidden';
						tbWrapper.style.display = 'none';
						
						var portletId = portlet.getId();
						if($W().toolbarItems[tbId].modal){
							$W().displayManager.showCurrentActiveX();
							var div = $D().getElementById("modalDiv");
							div.style.visibility = 'hidden';
						}
						else {
							$W().displayManager.unRegisterIframeInNestedApplication(tbId + "-tbFrame");
						}
						portlet.isWindowOpened = false;
						
						// if a onPortletHide is defined, call it -
						if(typeof onPortletHide == 'function') {
							onPortletHide();
						}
					});
					
					win.on('beforeshow', function(portlet){
						var portletId = portlet.getId();
						
						// if a onPortletBeforeShow is defined, call it -
						// Note:
						// ========
						// The first time onPortletBeforeShow is not defined and thi is a bug
						// currently it is used only by AgentConsultation and its enough
						//but if we want infrastructure, we need to handle carefully.
						//
						if(typeof onPortletBeforeShow == 'function') {
							if (!onPortletBeforeShow()){
								return false;
							}
						}
						
						//The portlet will be loaded if must be reloaded on open
						//or if has not been loaded at login
						if(portlet.reloadContentOnNextOpen || !portlet.loadOnLogin){
							//Calling to onPortletRemoval before refreshing the portlet
							if(typeof onPortletRemoval == 'function') {
								onPortletRemoval();
							}
							portlet.loadOnLogin = true;
						}
						//for first before show will do refersh - ONLY ONCE!
						if(portlet.first == undefined){
							portlet.getUpdater().refresh();
							portlet.first = false;
						}			
						
						portlet.isWindowOpened = true;

						tbWrapper = portlet.wrapperFrame;
						tbWrapper.style.display = 'inline';
						tbWrapper.style.visibility = "visible";
						
						portlet.isShownBefore = true;

						if ($W().toolbarItems[tbId].modal) {
							var modalDiv = $D().getElementById("modalDiv");
							modalDiv.style.display = 'inline';
							modalDiv.style.visibility = "visible";
							$W().displayManager.hideCurrentActiveX();
						}
						else{
							$W().displayManager.registerIframeInNestedApplication(tbId + "-tbFrame");
						}
						
						// if a onPortletShow is defined, call it -
/* 						if(typeof onPortletShow == 'function') {
							onPortletShow(portlet.reloadContentOnNextOpen);
						}
 */						
						return true;
					});
					
					win.on('show', function(portlet){
						// if a onPortletShow is defined, call it -
						if(typeof onPortletShow == 'function') {
							onPortletShow(portlet.reloadContentOnNextOpen);
						}
//						portlet.doLayout();
						portlet.getEl().repaint();
					});
					
					win.on('collapse', function(portlet){
						if($W().toolbarItems[tbId].modal){
							var div = $D().getElementById("modalDiv");
							div.style.visibility = 'hidden';
						}
						
						tbWrapper = portlet.wrapperFrame;
						tbWrapper.origHeight = tbWrapper.style.height;
						tbWrapper.style.height = '25px';
						
						// if a onPortletCollapse is defined, call it -
						if(typeof onPortletCollapse == 'function') {
							onPortletCollapse();
						}
					});
					
					win.on('expand', function(portlet){
						if($W().toolbarItems[tbId].modal){
							var div = $D().getElementById("modalDiv");
							div.style.visibility = 'visible';
						}
						
						tbWrapper = portlet.wrapperFrame;
						tbWrapper.style.height = parseInt(tbWrapper.origHeight)+'px';
						tbWrapper.style.visibility = 'visible';
						tbWrapper.style.display = 'inline';
						tbWrapper.style.frameborder = 0;
						
						// if a onPortletExpand is defined, call it -
						if(typeof onPortletExpand == 'function') {
							onPortletExpand();
						}
					});
					
					//To manage zIndex order when click is made inside window,
					//activate event is used.
					//When portlet is activated (user clicks in it) all other portlets are deactivated
					//and current portlet zIndex is rised. 
					win.on("activate", function(portlet){
						toolbarWindows = $W().toolbarWindows;
						for(var winId in toolbarWindows){
							if(winId != "extend" && toolbarWindows[winId] != portlet){
								toolbarWindows[winId].setActive(false);
							}
						}
						if(!$W().toolbarItems[tbId].modal){
							portlet.wrapperFrame.style.zIndex = $W().getNextZIndex();
						}							
						portlet.isPortletActive = true;
					});
					
					win.on("deactivate", function(portlet){
						portlet.isPortletActive = false;
					});
					
					$W().toolbarWindows[tbId] = win;
		});
	    
	    function onLoad() {
	    	if ($W().toolbarItems[tbId].enablePortletDragging) {
	    		addHandle(document.getElementById('dragHandler'), window);
	    	}
	    }
	    //This function catches mousedown event inside an ExtJS window and
	    //sets the window to be an active one. Thus activate event is fired.
	    function setActivePortlet(){
	    	portlet = $W().toolbarWindows[tbId]; 
	    	if(!portlet.isPortletActive){
	    		portlet.setActive(true);
	    	}
	    }
    </script>
</head>
<body onLoad="onLoad()" onmousedown="setActivePortlet();" onkeydown="onKeyDownHandler(event);">
<div id="dragHandler" style="height: 29px; width: 90%; z-index: 99999; position: absolute; top: 0px; left: 0px;"></div>
</body>
</html>
