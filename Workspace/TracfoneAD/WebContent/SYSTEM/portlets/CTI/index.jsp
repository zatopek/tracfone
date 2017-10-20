<%@ page language="java" contentType="text/html;charset=UTF-8"%>
<%@ taglib uri="http://beehive.apache.org/netui/tags-databinding-1.0" prefix="netui-data"%>
<%@ taglib uri="http://beehive.apache.org/netui/tags-html-1.0" prefix="netui"%>
<%@ taglib uri="http://beehive.apache.org/netui/tags-template-1.0" prefix="netui-template"%>
<%@ taglib uri="http://www.jacada.com/taglibs/jacada" prefix="jacada"%>
<%@ taglib uri="http://jakarta.apache.org/taglibs/request-1.0" prefix="req"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt"%>
<%@ page import="org.springframework.web.context.WebApplicationContext"%>
<%@ page import="com.jacada.jad.rap.provider.Authorization"%>
<%@ page import="org.springframework.web.context.support.WebApplicationContextUtils"%>
<%@ page import="com.jacada.jad.rap.entities.RAPConstants"%>

<%    
   response.setHeader("Cache-Control","no-cache"); //HTTP 1.1
   response.setHeader("Pragma","no-cache"); //HTTP 1.0
   response.setDateHeader ("Expires", 0); //prevents caching at the proxy server
   WebApplicationContext context = WebApplicationContextUtils.getWebApplicationContext(config.getServletContext());
   Authorization authorization = (Authorization)context.getBean(Authorization.AUTHORIZATION_BEAN);
%>
<%@ include file = "/SYSTEM/resources/jspf/includes/locale.jspf"%>

<netui:html>

    <head>
        
    
    
    
    <netui-data:getData resultId="transferDefaultType" value="${sharedFlow.globalApp.CTIManager.voiceInformation.defaultTransferType}"/>
    <netui-data:getData resultId="ctiProvider" value="${sharedFlow.globalApp.CTIManager.voiceInformation.ctiProvider}"/>
    
    <netui-data:getData resultId="transferAllowedFromConsult" value="${sharedFlow.globalApp.CTIManager.voiceInformation.transferAllowedFromConsult}"/>
    <netui-data:getData resultId="outboundCallsAllowed" value="${sharedFlow.globalApp.CTIManager.ctiBehaviorHandler.outboundAllowed}"/>
    <netui-data:getData resultId="hasNotReadyCodeList" value="${pageFlow.ctiControllerLogic.hasNotReadyCodeList}"/> 
    <netui-data:getData resultId="softReturnEnabled" value="${sharedFlow.globalApp.CTIManager.voiceInformation.softReturnEnabled}"/>
    <netui-data:getData resultId="sendDTMFEnabled" value="${sharedFlow.globalApp.CTIManager.voiceInformation.sendDTMFEnabled}"/> 
	
    <script type="text/javascript" src="<%=request.getContextPath()%>/SYSTEM/resources/js/jad.js"></script>
    <script type="text/javascript" src="<%=request.getContextPath()%>/SYSTEM/resources/js/dialogs.js"></script>
    <script type="text/javascript" src="<%=request.getContextPath()%>/SYSTEM/resources/js/navigation.js"></script>
    <script type="text/javascript" src="<%=request.getContextPath()%>/SYSTEM/resources/js/common.js"></script>
    <script type="text/javascript" src="<%=request.getContextPath()%>/SYSTEM/resources/js/prototype.js"></script>
    <script type="text/javascript" src="<%=request.getContextPath()%>/SYSTEM/resources/js/behavior.js"></script>
    <script type="text/javascript" src="<%=request.getContextPath()%>/USER/resources/js/override.js"></script>
    
    <!-- include the base CTIClient.js, the <provider>CTIClient.js for the current CTI provider, and the specific file for the current switch type -->
    <script type="text/javascript" src="CTIClient.js"></script>        
    <script type="text/javascript" src="<%=request.getContextPath()%>/SYSTEM/resources/js/CTIClientAPI.js"></script>

     <script type="text/javascript" src="CTIClientEvent.js"></script>      
    <script type="text/javascript" src="./providers/<%=((String)pageContext.getAttribute("ctiProvider")).toLowerCase()%>/<%=((String)pageContext.getAttribute("ctiProvider")).toLowerCase()%>CTIClient.js"></script>            


    <script type="text/javascript" src="<%=request.getContextPath()%>/SYSTEM/resources/js/combo.js"></script>
    
    <script type="text/JavaScript">
<!--
UserCTIRoles = Class.create();
UserCTIRoles.CTIBasicUser           =<%=authorization.isUserInRole(request, RAPConstants.Roles.AGENT_ROLE.getRole()) %>;
UserCTIRoles.CTIStartUser           =<%=authorization.isPrivileged(RAPConstants.Privileges.CTIStart.getPrivilege()) %>;
UserCTIRoles.CTIStartOutboundCallUser  =<%=authorization.isPrivileged(RAPConstants.Privileges.CTIStartOutboundCall.getPrivilege()) %>;
UserCTIRoles.CTIEndUser             =<%=authorization.isPrivileged(RAPConstants.Privileges.CTIEnd.getPrivilege()) %>;
UserCTIRoles.CTITransferUser        =<%=authorization.isPrivileged(RAPConstants.Privileges.CTITransfer.getPrivilege()) %>;
UserCTIRoles.CTIDialUser            =<%=authorization.isPrivileged(RAPConstants.Privileges.CTIDial.getPrivilege()) %>;
UserCTIRoles.CTIHoldUser            =<%=authorization.isPrivileged(RAPConstants.Privileges.CTIHold.getPrivilege()) %>;
UserCTIRoles.CTIConsultUser              =<%=authorization.isPrivileged(RAPConstants.Privileges.CTIConsult.getPrivilege()) %>;
UserCTIRoles.CTIBusyReadyUser            =<%=authorization.isPrivileged(RAPConstants.Privileges.CTIBusyReady.getPrivilege()) %>;
UserCTIRoles.CTITransferAllowedFromConsult =<%=pageContext.getAttribute("transferAllowedFromConsult")%>;
UserCTIRoles.CTITransferConnectAllowed     =<%=authorization.isPrivileged(RAPConstants.Privileges.CTITransferConnect.getPrivilege())%>;
UserCTIRoles.CTIEnableSoftReturnButton =<%=pageContext.getAttribute("softReturnEnabled")%>;
UserCTIRoles.CTIEnableSendDTMFButton =<%=pageContext.getAttribute("sendDTMFEnabled")%>;
__use_busy_code_list__ = <%=pageContext.getAttribute("hasNotReadyCodeList")%>;
-->
    </script>
    
    <script type="text/javascript" src="CTIClient.js"></script>
    <script type="text/javascript" src="CTIStates.js"></script>    
    <script type="text/javascript" src="CTITimers.js"></script>        
    
    <script type="text/javascript" src="<%=request.getContextPath()%>/USER/resources/js/override.js"></script>
    
    <link href="<%=request.getContextPath()%>/SYSTEM/resources/css/jadstyle.css" type="text/css" rel="stylesheet">
    
    <netui-data:getData resultId="themePath" value="${sharedFlow.globalApp.presentationManager.personalization.themeDirectory}"/>
    <link href="<%=request.getContextPath()%>/SYSTEM/portlets/CTI/css/cti.css" type="text/css" rel="stylesheet">
    <netui-data:getData resultId="outboundInfo" value="${sharedFlow.globalApp.CTIManager.agentInformation.outboundDialInfo}"/>
    <link href="<%=request.getContextPath()%>/USER/resources/css/override.css" type="text/css" rel="stylesheet">
<script type="text/JavaScript">
<!--
var rules = {
    '.def' : {
        onmouseover: function() { 
            if (this.disabled == true)
                return;
            this.className = 'over'; 
        },
        onmouseout: function() { 
            if (this.disabled == true)
                return;
            this.className = 'def'; 
        },
        onmousedown: function() {
            if (this.disabled == true)
                return; 
            this.className = 'active'; 
        },
        onmouseup: function() { 
            if (this.disabled == true)
                return;
            this.className = 'def'; 
        }
    },
    '.over' : {
        onmouseout: function() { 
            if (this.disabled == true)
                return;
            this.className = 'def'; 
        },
        onmousedown: function() {
            if (this.disabled == true)
                return; 
            this.className = 'active'; 
        }
    },
    '.active' : {
        onmouseup: function() { 
            if (this.disabled == true)
                return;
            this.className = 'def'; 
        }
    }
};
Behavior.register(rules);

function addText(str) {
    if (window.parent.frames.CallLogPortletFrame && window.parent.frames.CallLogPortletFrame.addText)  { 
        window.parent.frames.CallLogPortletFrame.addText(str); 
    } 
}

function clearText() {
    if (window.parent.frames.CallLogPortletFrame && window.parent.frames.CallLogPortletFrame.clearText)  { 
        window.parent.frames.CallLogPortletFrame.clearText(); 
    } 
}

function getCallLogText() {
    if (window.parent.frames.CallLogPortletFrame && window.parent.frames.CallLogPortletFrame.getCallLogText)  { 
        return window.parent.frames.CallLogPortletFrame.getCallLogText(); 
    } 
    return "";
}

function runTwoStateLink(state1, state2)
{
    var link = document.getElementById('middle' + state1 + 'Btn');    
    if (link == null)
        return;
   
    if ((link != null) && (link.className=='button middle') && (link.parentElement.style.display != 'none'))       
        runLink(state1 + 'Btn');        
    else
    {
        link = document.getElementById('middle' + state2 + 'Btn');
            if ((link != null ) &&(link.className=='button middle') && (link.parentElement.style.display != 'none'))       
            runLink(state2 + 'Btn');         
    }
}


function createButton(btnId, title, writeRight) 
{
	//write the div that wraps the button
    document.write('<div class="def" id="' + btnId + '"');
	//write the SPAN which is the actual button content
	document.write('><span class="button middle" id="middle' + btnId + '"><p class="icon" ></p></span>');
    document.write('</div>');


}
-->
</script>

        <title><fmt:message bundle="${applicationMessages}" key="application.portlet.label.ctiMainPortlet"/></title>

    </head>
	<body onkeydown="onKeyDownHandler(event);" LEFTMARGIN="0" topmargin="0">         
<script type="text/javascript">
<!--
document.body.scroll="no";

function oncontextmenu() {
   return false;
}
document.oncontextmenu = oncontextmenu;
-->
</script>   
		<div class='call-info'>
			
			<div class="right-bar-space buttons-area">	
					<div id="upperLine" class="btn-line">
						<jacada:span tabIndex="-1" id="DialBtnBtnAux" name="DialBtnBtnAux" accessKey="D" onactivate="moveFocusForAccessKey(); runLink('DialBtn');"></jacada:span>
		                <jacada:span tabIndex="-1" id="TransferBtnAux" name="TransferBtnAux" accessKey="T" onactivate="moveFocusForAccessKey(); runLink('TransferBtn');"></jacada:span>
	               		<jacada:span tabIndex="-1" id="WarmTransferToggleToSuperBtnAux" name="WarmTransferToggleToSuperBtnAux" accessKey="T" onactivate="moveFocusForAccessKey(); runLink('WarmTransferToggleToSuperBtn');"></jacada:span>
		                <jacada:span tabIndex="-1" id="StartBtnAux" name="StartBtnAux" accessKey="S" onactivate="moveFocusForAccessKey(); runLink('StartBtn'); runLink('startOutboundBtn'); runLink('AnswerBtn'); runLink('AnswerOpenMediaBtn');"></jacada:span>
		                <jacada:span tabIndex="-1" id="EndBtnAux" name="EndBtnAux" accessKey="E" onactivate="moveFocusForAccessKey(); runLink('EndBtn'); runLink('EndOpenMediaBtn');"></jacada:span>
		                
		                <div class="dropDown-button-area">
			               	<script type="text/javascript"> 
			                	createButton('StartBtn');
			                    createButton('AnswerBtn');
			                    createButton('AnswerOpenMediaBtn');
			                    createButton('StartOutboundBtn');
			                    createButton('EndBtn');
			                    createButton('EndOpenMediaBtn');
			                    createButton('GeneralEndBtn', '', 'false');
			           		</script>	 
			           		<a href="javascript:moveFocusForAccessKey();" class="popUpButton" id="EndPopupBtn"></a>
			           	</div>
			           	<div class="dropDown-button-area">
		                <script type="text/javascript"> 
		                       var transferType = '<%=pageContext.getAttribute("transferDefaultType")%>';
		                       if (transferType == 'null') transferType = "";
		                       createButton('TransferBtn', transferType);
		                </script>
		                <jacada:if expr="${sharedFlow.globalApp.CTIManager.voiceInformation.multipleTransferTypes}"> 
		                   <script type="text/javascript"> 
		                       createButton('CompleteTransferBtn', '', 'false');
		                   </script>
		                   <a href="javascript:moveFocusForAccessKey();" class="popUpButton" id="TransferPopupBtn"></a>
		             	</jacada:if>
		             	<jacada:if expr="${sharedFlow.globalApp.CTIManager.voiceInformation.softReturnEnabled}"> 
			                <script type="text/javascript"> 
			                       createButton('WarmTransferToggleToSuperBtn');
			                </script>
	              		</jacada:if>
		             	</div>
		                <script type="text/javascript"> 
		                    createButton('DialBtn');
		                </script>
		                    <jacada:if expr="${sharedFlow.globalApp.CTIManager.voiceInformation.sendDTMFEnabled}">
		                    	<script type="text/javascript">
		                    		createButton('SendDTMFBtn');
		                    	</script>
		                    </jacada:if>
		                
					</div>
					<div id="lowerLine" class="btn-line">
						<jacada:span tabIndex="-1" id="ReadyBtnAux" name="ReadyBtnAux" accessKey="Y" onactivate="moveFocusForAccessKey(); runTwoStateLink('Busy', 'Ready');"></jacada:span>
	                    <jacada:span tabIndex="-1" id="ConsultBtnAux" name="ConsultBtnAux" accessKey="C" onactivate="moveFocusForAccessKey(); runLink('ConsultBtn');"></jacada:span>
	                    <jacada:span tabIndex="-1" id="JoinBtnAux" name="JoinBtnAux" accessKey="J" onactivate="moveFocusForAccessKey(); runLink('JoinBtn');"></jacada:span>
                    <jacada:span tabIndex="-1" id="ConsultToggleToSuperBtnAux" name="ConsultToggleToSuperBtnAux" onactivate="moveFocusForAccessKey(); runLink('ConsultToggleToSuperBtn');"></jacada:span>
	                    <jacada:span tabIndex="-1" id="HoldAndOffHoldBtnAux" name="HoldAndOffHoldBtnAux" accessKey="H" onactivate="moveFocusForAccessKey(); runTwoStateLink('Hold', 'HoldOff');"></jacada:span>
	                    <script type="text/javascript"> 
	                        createButton('HoldBtn');
	                        createButton('HoldOffBtn');
	                    </script>
	                    <div class="dropDown-button-area">
		                    <script type="text/javascript"> 
		                         createButton('ConsultBtn');
		                         createButton('JoinBtn', '', 'false');
		                     </script>
                     <jacada:if expr="${sharedFlow.globalApp.CTIManager.voiceInformation.softReturnEnabled}">
                     	<script type="text/javascript"> 
                     	 	createButton('ConsultToggleToSuperBtn');
                     	</script>
                     </jacada:if>                    
		                     <a href="javascript:moveFocusForAccessKey();" class="popUpButton" id="ConsultPopupBtn"></a>
	                     </div>
	                     <script type="text/javascript"> 
	                            createButton('BusyBtn');
	                            createButton('ReadyBtn');
	                    </script>
					</div>		
			</div>
			
			<div class='corporate-logo'></div>			
			<div class='left-bar-space counter-area'>
				<div class="counter ctiLabel" id="callLabel">
					<div id="CallTimeCaption"><fmt:message bundle="${applicationMessages}" key="application.javascript.ctiCallInfoBar.label.callTime"/></div>
					<div id="HoldTimeCaption"><fmt:message bundle="${applicationMessages}" key="application.ctiCallInfoBar.label.holdTime"/></div>
					<div id="WrapTimeCaption"><fmt:message bundle="${applicationMessages}" key="application.ctiCallInfoBar.label.wrapUpTime"/></div>
				</div>
				<div class="counter ctiCounter" id="callCounter">
					<div>
                        <div class="normal-counter" id="CallTime">00:00:00</div>
                        <div class="normal-counter" id="ItemTime">00:00:00</div>
                    </div>
                    <div class="normal-counter" id="HoldTime">00:00:00</div> 
                    <div class="normal-counter" id="WrapUpTime">00:00:00</div>                   
				</div>
			</div>
			<div class="left-bar-space alc-area">
			
				<div class="counter ctiLabel" id="totalLabel">
					<div id="TotalTimeCaption"><fmt:message bundle="${applicationMessages}" key="application.ctiCallInfoBar.label.totalTime"/></div>
					<div id="AhtLable"><fmt:message bundle="${applicationMessages}" key="application.ctiCallInfoBar.label.aht"/></div>
					<div id="TotalCallCaption"><fmt:message bundle="${applicationMessages}" key="application.javascript.ctiCallInfoBar.label.totalCalls"/></div>	
				</div>
				
				<div class="counter ctiCounter"  id="totalCounter">
	                       <div class="normal-counter" id="TotalTime">00:00:00</div>
	                       <div class="normal-counter" id="TotalItemTime">00:00:00</div>
	               <div id="AHTdiv"><span id=AHT></span></div>
	               <div id="TotalCall">					
                    <span id="TotalCallNumber"></span>
                    <span id="TotalItemNumber"></span>
					</div>
				</div>
				</div>
			<form id="CallerForm" onsubmit='callerIdChanged();return false;'>				           
	     		<div class="left-bar-space call-area">
	     			<div id="CallId" class="rtnCombo">
	     				<span class="ctiLabel" id="rtnLabel">
	     				<fmt:message bundle="${applicationMessages}" key="application.ctiCallInfoBar.label.callId"/>
	     				</span>	                                        
	                      <netui:hidden dataSource="sharedFlow.globalApp.CTIManager.voiceInformation.outboundAccessCode" tagId="accessCode"/>
	                      <span id="RtnCombo">
	                          <jacada:combo id="CallerId" width="80px" dataSource="pageFlow.callerId" lines="5">
	                              <netui-data:repeater dataSource="pageFlow.RTNs">
	                                  <netui-data:repeaterItem>
	                                      <netui-data:getData resultId="RTN" value="${container.item}"/>                                     
	                                      <option value="<%= pageContext.getAttribute("RTN") %>"><%=pageContext.getAttribute("RTN")%></option>
	                                  </netui-data:repeaterItem>
	                              </netui-data:repeater>
	                          </jacada:combo>
	                      </span>
	                      <span id="RtnTxt"></span>
	     			</div>
	     			<div id="StatusLabel">
	     			  <span class="ctiLabel">
	     				<fmt:message bundle="${applicationMessages}" key="application.ctiCallInfoBar.label.status"/>
	     			  </span>
	                  <span id="PhoneStatus"></span>
	                </div>
	     			<div class="cti-disconnect-msg" id="ConstantStatus"></div>
	     		</div>
	     	</form>
	               <div class="left-bar-space status-area">
	               		<div id="ResyncStatus" class="resyncStatus">
		            		<script type="text/javascript"> 
		                       createButton('ResyncBtn');
		                   	</script>	                                           		                   
		    			</div>		    	
	               		<% if (authorization.isPrivileged(RAPConstants.Privileges.BusyReasonCode.getPrivilege())) {%>
			            <div id="auxReasonLabel" > 
		                     	<A id="auxReason" class="busy-reasons" onclick="$W().cti.showOutboundNumbers(this, 'busy');"></a>    
		                     	 
			     		</div>
		     			<%  } %>
		     			<div class="cti-error-status" id="ErrorStatus"></div>			        	            		            	
		           </div>    
		</div>
		
<script type="text/javascript">
<!--
  var outboundCalls = false;
  <jacada:if expr="${sharedFlow.globalApp.CTIManager.voiceInformation.outboundCallMode}">
  outboundCalls = true;
  </jacada:if>
 
	var menuBar = $W().Ext.getCmp('workspace-menu');
	var size = menuBar.items.getCount();
	menuBar.insert(size - 5, {
		id: 'ctiLoginBtn',
		handler: $W().doCTILogin,
		cls: 'logoutBtn',
		text: $W().localeManager.getLocalizationValue('application.javascript.menuBar.label.CTIlogin')
	});

   
   cti = new <%= ((String)pageContext.getAttribute("ctiProvider")).toLowerCase()%>CTIClient();       
  
  
   //initialize the CTIEventClient if required
   <jacada:if expr="${sharedFlow.globalApp.CTIManager.voiceInformation.reportAllEventsToClient}">               
  var ctiEvent = new CTIClientEvent();    
  ctiEvent.init();
  $W().ctiEvent = ctiEvent;
  </jacada:if>
    
    
     <netui-data:repeater dataSource="sharedFlow.globalApp.CTIManager.voiceInformation">                
                <netui-data:repeaterItem>
                    <netui-data:getData resultId="transferType" value="${container.item}"/>                    
                    <netui-data:getData resultId="index" value="${container.index}"/>
                    cti.addTransferType('<%= pageContext.getAttribute("transferType") %>');
                </netui-data:repeaterItem>                    
            </netui-data:repeater>
    
    
  
   
   $W().cti = cti;
   cti.init();
   
   //update outbound mode
   var outboundCallsAllowed = <%=pageContext.getAttribute("outboundCallsAllowed")%>;
   cti.setOutboundAllow(outboundCallsAllowed);    
   
//-->
</script> 
        
    </body>
</netui:html>
