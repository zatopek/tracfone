    <!DOCTYPE html>
<%@ page language="java" contentType="text/html;charset=UTF-8"%>

<%@ taglib uri="http://beehive.apache.org/netui/tags-databinding-1.0" prefix="netui-data"%>
<%@ taglib uri="http://beehive.apache.org/netui/tags-html-1.0" prefix="netui"%>
<%@ taglib uri="http://beehive.apache.org/netui/tags-template-1.0" prefix="netui-template"%>

<%@ taglib uri="http://www.jacada.com/taglibs/jacada" prefix="jacada"%>
<%@ taglib uri="http://jakarta.apache.org/taglibs/log-1.0" prefix="log"%>
<%@ taglib uri="http://jakarta.apache.org/taglibs/request-1.0" prefix="jacada-component"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt"%>

<%@ page import="com.jacada.jad.jimworkflow.interfaces.JIMWorkflowManager"%>
<%@ page import="org.apache.beehive.netui.pageflow.PageFlowUtils" %>
<%@ page import="com.jacada.jad.jimworkflow.interfaces.JIMWorkflowManager.JIMLayouts"%>
<%@ page import="com.jacada.jad.push.PushHelper"%>
<%@ page import="com.jacada.jad.rap.entities.RAPConstants.Privileges"%>
<%@ page import="com.jacada.jad.auditing.AuditingConstants.AuditingPoint"%>

<netui:html>
    <head>
 		<script type="text/javascript" src="<%=request.getContextPath()%>/SYSTEM/resources/js/JadWrapperToExtJs.js"> </script>
         
 		 <script type="text/javascript">
            // global javascipt variables
            var CONTEXT_PATH ="${pageContext.request.contextPath}"; 
	 		var DATE_FORMAT	= 'm-d-Y';
	 		var TIME_FORMAT	= 'H:i';
        </script>
    <%@ 
    include file = "/SYSTEM/resources/jspf/includes/index.jspf" 
    %>


    <script type="text/javascript">
	        setClientGMTOffset();
	    	// Date format for all UI components in WorkSpace:
	        Push.init("<%=session.getId()%>", "<%=request.getContextPath() %>", "<%=global.getJFAPDataBase().getGlobalSetting("DedicatedPushConnectionURL").Value%>", "<%=groupBasedSelector%>", "<%=agentName%>");
	    
	    	
	        //supporting clipping - should be in the beginning of the file to avoid js errors in case the clipping mechanism is accessed on login
			displayManager = new NestedApplicationDisplayManager();
			$W().displayManager = displayManager;
			displayManager.init();  
	
			//supporting RAP API
			
			rapManager = new RAPManager();
			$W().rapManager = rapManager;
			
			LogManager.setLevel(LoggerLevel["<%=level%>"]);
			
			var openWindows=new Array();
    	</script>
    	<script language="JavaScript" type="text/javascript" for="smartPadActiveX" event="OnCopy(iCell, text)">
	        jsPasteString(0, text, iCell)  
	    </script>
	    
	    <netui-data:getData resultId="themeName" value="${sharedFlow.globalApp.presentationManager.personalization.themeName}"/>
		<netui-data:getData resultId="navbarEnabled" value="${sharedFlow.globalApp.scriptManager.navigationBarEnabled}"/>
	</head>
	<jacada:body  workspace="true"  onkeydown="onKeyDownHandler(event);">
		<script  type="text/javascript">
		  	$W().WELCOME_TIMOUT_IN_SECONDS = <%=request.getAttribute("__WELCOME_TIMOUT_IN_SECONDS")%>;
		</script>

         <!--  Initializing the CTIAPI to be used by workspace cti-bar or by project-leval cti-bar -->
 		<script  type="text/javascript">
 
    	//This method is located in the override.js file
    	//and allows the user to add code that should be invoked on application startup.
 		onApplicationInitialized();
 
		$W().ctiAPI = new CTIClientAPI();
		$W().ctiAPI.init("<%=global.getCTIManager().getAgentInformation().getCtiBarUrl()%>");
		$W().mediaAPI = Jacada.system.MediaClientAPI;
 	</script>
 	
 	<%if (featureManager.isEnabled(FeatureName.TickerTape) && authorization.isPrivileged(Privileges.TickerTapeFeature.getPrivilege())){ %>
 <script type="text/javascript" src="${pageContext.request.contextPath}/SYSTEM/portlets/tickerTape/modal/modal.js"></script>
    <script> 
    
    
        function tickerTapeMessageWindow(data, messagePosition, tickerTape)
        {
            var frame = document.getElementById('TickerTapeIframeId');
            var frameParent = frame.offsetParent;
            messagePosition.top +=  frameParent.offsetTop;
            messagePosition.left +=  frameParent.offsetLeft;
            show(data, messagePosition, tickerTape);
        } 

         </script>
       <% } %>  
       
 	
        <script  type="text/javascript">
		
        loadTheme();       
        extPersonalizationInit(document, CONTEXT_PATH);
        function getLocalizationValue(key){
			return $W().localeManager.getLocalizationValue(key);
		}
        var ss = document.createElement("link");
        ss.setAttribute("rel", "stylesheet");
        ss.setAttribute("type", "text/css");
        ss.setAttribute("href", "<%=request.getContextPath()+"/"+pageContext.getAttribute("themePath")+"/style.css" %>");
        document.getElementsByTagName("head")[0].appendChild(ss);

        <!--
        Push.registerEventHandler( 'favorites_updated', onFavoritesUpdatedHandler);    
        Push.registerEventHandler( 'session_exp', onSessionExpHandler);    
        Push.registerEventHandler( 'tools_updated', onToolsUpdatedHandler);  
        Push.registerEventHandler('switchToTab', onSwitchToTab);
        Push.registerEventHandler('isProcessNested', onIsProcessNested);
         
        Push.registerEventHandler('PortletReload', onPortletReload);
        Push.registerEventHandler('addAgentNotes',addAgentNotes);
        //script managing push
        Push.registerEventHandler( 'UpdateCTIClient', onUpdateCTIClient);   
        Push.registerEventHandler( 'INIT_DISPOSITION', onInitDisposition);
        //-->
    </script>
    
    
	 <script  type="text/javascript">
        var isTabDragEnabled = false;
         //set audit configuration at client side
	    $W().isAuditEnabled =    <%=global.getAuditingManager().getConfiguration().isAuditingEnabled()%>;
	    $W().isSwitchTabAuditEventEnabled = <%=global.getAuditingManager().getConfiguration().isAuditingPointEnabled(AuditingPoint.SWITCH_TAB)%>;
        $W().ssoWindow = Ext.create('Jacada.user.com.jacada.tracfoneAD.sSO.SSO');

        Ext.Ajax.request({
            url : $W().contextPath + '/rest/sso/getAgentSsoCredentials/' + $W().agentName,
            method:'GET',
            success:function(response){
                logins = Ext.decode(response.responseText).payload;
                if(logins.length==0){
                    $W().ssoWindow.show();
                }
            },
            failure : function(response) {
                $W().ssoWindow.show();
            }
        });

	</script>
	   	
	   	 
    <div id="SMARTPAD_DIV_ID"></div>
 	<div id="DESKTOP_HELPER_DIV_ID"></div> 
 	<script type="text/javascript" src="<%=request.getContextPath()%>/SYSTEM/resources/js/toolbar.js"></script>
</jacada:body>

</netui:html>