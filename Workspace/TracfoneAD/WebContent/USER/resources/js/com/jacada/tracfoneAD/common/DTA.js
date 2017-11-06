var jiaReady = "false";

function registerDTAs(){
//alert("REGISTERING!!!!");
$W().Push.registerEventHandler("SetEBOCredentials", SetEBOCredentials);
//$W().Push.registerEventHandler("SetAWSCredentials", SetAWSCredentials);
$W().Push.registerEventHandler("GuiSignOn", GuiSignOn);
$W().Push.registerEventHandler("TransportationSignOn", signOnToTransporation);
$W().Push.registerEventHandler("SetExecLoginEBO", SetExecLoginEBO);
//$W().Push.registerEventHandler("SetExecLoginAWS", SetExecLoginAWS);
$W().Push.registerEventHandler("SetExecLoginGUI", SetExecLoginGUI);
$W().Push.registerEventHandler("SetExecLoginTransportation", SetExecLoginTransportation);
//$W().Push.registerEventHandler("getEBOEmail", onEBOEmail);
//$W().Push.registerEventHandler("getCurrentBill", getCurrentBill);
$W().Push.registerEventHandler("LaunchAuxillaryEBO", LaunchAuxillaryEBO);
$W().Push.registerEventHandler("SetEboURL", SetEboURL);
$W().Push.registerEventHandler("SetGuiSignOnExePath", SetGuiSignOnExePath);
$W().Push.registerEventHandler("SetGuiExePath", SetGuiExePath);
$W().Push.registerEventHandler("SetGuiWorkingDirectory", SetGuiWorkingDirectory);
$W().Push.registerEventHandler("SetGuiSignOnWorkingDirectory", SetGuiSignOnWorkingDirectory);
//$W{}.Push.registerEventHandler("SetGUIAccountNumber", SetGUIAccountNumber);
//$W{}.Push.registerEventHandler("SetEBOAccountNumber", SetEBOAccountNumber);
$W().Push.registerEventHandler("SetExecCreateAgreement", SetExecCreateAgreement);
$W().Push.registerEventHandler("TransportationLogout", TransportationLogout);

}

function SetExecCreateAgreement(jsonResult){
	if(jiaReady == "true"){
		var o = Ext.decode(jsonResult);
		var s = Ext.encode(o.root);
		$W().WFDistributedServicesHandler.callAsyncOperation("NG_DTA", "SetExecCreateAgreement", s, handle);
	}
}

function SetGUIAccountNumber(acctNum){
	if(jiaReady == "true"){
		var s = '{"CASAccountNumber":"'+acctNum+'"}';
		$W().WFDistributedServicesHandler.callAsyncOperation("NG_DTA", "SetGUIAccountNumber", s, handle);
	}
}

function setTransportationAccountNumber(accountNumber){
	if(jiaReady == "true"){
		var s = '{"CRISAccountNumber":"'+accountNumber+'"}';
		$W().WFDistributedServicesHandler.callAsyncOperation("NG_DTA", "SetTransportationAccountNumber", s, handle);
	}
}

function SetEBOAccountNumber(acctNum){
	if(jiaReady == "true"){
		var s = '{"CASAccountNumber":"'+acctNum+'"}';
		$W().WFDistributedServicesHandler.callAsyncOperation("NG_DTA", "SetEBOAccountNumber", s, handle);
	}
}

function SetEBOCredentials(jsonResult) {
 if(jiaReady == "true"){
	var o = Ext.decode(jsonResult);
	var s = Ext.encode(o.root);
	$W().WFDistributedServicesHandler.callAsyncOperation("NG_DTA", "SetEBOCredentials", s, handle);
	}
}


function GuiSignOn(jsonResult) {
  if(jiaReady == "true"){
	var o = Ext.decode(jsonResult); 
	var s = Ext.encode(o.root);	
	var TransactionResult = $W().WFDistributedServicesHandler.callAsyncOperation("NG_DTA", "GuiSignOn", s, handle);
  }
}

function signOnToTransporation(jsonResult) {
  if(jiaReady == "true"){
	var o = Ext.decode(jsonResult); 
	var s = Ext.encode(o.root);	
	var TransactionResult = $W().WFDistributedServicesHandler.callAsyncOperation("NG_DTA", "TransportationSignOn", s, handle);
  }
}

function SetExecLoginEBO(jsonResult) {
	var o = Ext.decode(jsonResult); 
	var s = Ext.encode(o.root);
	$W().WFDistributedServicesHandler.callAsyncOperation("NG_DTA", "SetExecLoginEBO", s, handle);	
}


function SetExecLoginTransportation(jsonResult) {
	var o = Ext.decode(jsonResult); 
	var s = Ext.encode(o.root);
	$W().WFDistributedServicesHandler.callAsyncOperation("NG_DTA", "SetExecLoginTransportation", s, handle);
}

function SetExecLoginGUI(jsonResult) {
	var o = Ext.decode(jsonResult); 
	var s = Ext.encode(o.root);
	$W().WFDistributedServicesHandler.callAsyncOperation("NG_DTA", "SetExecLoginGUI", s, handle);
}

function getCreateAgreement(acctNum) {
  if(jiaReady == "true"){
  	//alert('in side the create agreemnt');
	var s = '{"casAcctNmbr":"'+acctNum+'"}';
	$W().WFDistributedServicesHandler.callAsyncOperation("NG_DTA", "CreateAgreement", s, handle);
  }
}

function AgentDesktopLogout() {
	$W().WFDistributedServicesHandler.callAsyncOperation("NG_DTA", "AgentDesktopLogout", "", handle);
}

function getEBOContext(acctNum){
  if(jiaReady == "true"){
	var s = '{"CASAccountNumber":"'+acctNum+'"}';
	$W().WFDistributedServicesHandler.callAsyncOperation("NG_DTA", "LaunchEBOWithContext", s, handle);	
  }
}

function getGUIContext(acctNum){
 if(jiaReady == "true"){
	var s = '{"casAcctNmbr":"'+acctNum+'"}';
	$W().WFDistributedServicesHandler.callAsyncOperation("NG_DTA", "LaunchGUIWithContext", s, handle);
  }
}

function launchTransportationWithContext(acctNum){
 if(jiaReady == "true"){
	var s = '{"CRISAccountNumber":"'+acctNum+'"}';
	$W().WFDistributedServicesHandler.callAsyncOperation("NG_DTA", "LaunchTransportationWithContext", s, handle);
  }
}

function LaunchAuxillaryEBO(){
	$W().WFDistributedServicesHandler.callAsyncOperation("NG_DTA", "LaunchAuxillaryEBO", "" ,handle);
}

function SetEboURL(data){
  if(jiaReady == "true"){
	var s = '{"inValue":"'+data+'"}';
	$W().WFDistributedServicesHandler.callAsyncOperation("NG_DTA", "SetEboURL", s ,handle);
  }
}

function SetGuiSignOnExePath(data){
	var s = '{"inValue":"'+data+'"}';
	$W().WFDistributedServicesHandler.callAsyncOperation("NG_DTA", "SetGuiSignOnExePath", s ,handle);
}

function SetGuiExePath(data){
	var s = '{"inValue":"'+data+'"}';
	$W().WFDistributedServicesHandler.callAsyncOperation("NG_DTA", "SetGuiExePath", s ,handle);
}

function SetGuiWorkingDirectory(data){
	var s = '{"inValue":"'+data+'"}';
	$W().WFDistributedServicesHandler.callAsyncOperation("NG_DTA", "SetGuiWorkingDirectory", s ,handle);
}

function SetGuiSignOnWorkingDirectory(data){
	var s = '{"inValue":"'+data+'"}';
	$W().WFDistributedServicesHandler.callAsyncOperation("NG_DTA", "SetGuiSignOnWorkingDirectory", s ,handle);
}

function TransportationLogout(){
	$W().WFDistributedServicesHandler.callAsyncOperation("NG_DTA", "TransportationLogout", "" ,handle);
}

//Begin StartCTI 
function setCtiConsolePath(input,setCTIPathResult){
		try{
			$W().WFDistributedServicesHandler.callAsyncOperation("NG_DTA", "setCtiConsolePath ", input, setCTIPathResult);
		}catch(e){
			alert('There is problem with winfuse services.\n Try again later. If problem still persists, contact System Administrator.');
		}
}

function startCTI(inputString,startCTIResult) {
	try{
		$W().WFDistributedServicesHandler.callAsyncOperation("NG_DTA", "startCTIobj", inputString, startCTIResult);
		//alert('after the start CTI');
	} catch(e){
		alert('There is problem with winfuse services.\n Try again later. If problem still persists, contact System Administrator:');
	}
}

function closeCti(){
		try{
			$W().WFDistributedServicesHandler.callAsyncOperation("NG_DTA", "closeCti", "", "");
		}catch(e){
			alert('There is problem with winfuse services.\n Try again later. If problem still persists, contact System Administrator.');
		}
}
//End StartMetrotechCTI

//Initial winfuse call onLoad
function signOnDTA(){
	//var u = "https://localhost:9445/AgentDesktop/portlets/utils/executeDDTALogins";
		var IEBridge;
		
		try {
			IEBridge = new ActiveXObject("Jacada.DesktopBridge.1");
		} catch (e) {
	    	// No WinDesk installed or ActiveX not allowed
	    	//$W().LogManager.getLogger("IntegrationJS").debug("Cannot connect to WinFuse - No WinDesk installed or ActiveX usage not allowed");
	    	return;
		}
    	sessionRef = IEBridge.GetWinFuseDesktopSessionReference();
		if (sessionRef == "") {
  		} else {
  		 	jiaReady = "true";
  			var u = "/AgentDesktop/portlets/utils/executeDDTALogins";
        	Ext.Ajax.request({ 
	                  url : u,
	                  method: 'GET',
	                  success : function(request,parameters){   
	                  	$W().transportContextLaunch = false;
			          },
	                  failure : function(request,parameters){  
		                        // alert('(IV) Communication Error to Server, Please Retry');
					  }
	          });		
   				// alert('end signOnDTA');
  		}
}

//Handlers

function handle(){
//alert("DTA COMPLETED!!!");
}

function unregisterDTAs() {
//alert("UN-REGISTERING!!!!");
	var IEBridge;
	var sessionRef = "";
	try {
			IEBridge = new ActiveXObject("Jacada.DesktopBridge.1");
		} catch (e) {
    	
    	// No WinDesk installed or ActiveX not allowed
    	//$W().LogManager.getLogger("IntegrationJS").debug("Cannot connect to WinFuse - No WinDesk installed or ActiveX usage not allowed");
    	return;
	}
    sessionRef = IEBridge.GetWinFuseDesktopSessionReference();
	if (sessionRef != "")
	{
		AgentDesktopLogout();
	}

	$W().Push.unregisterEventHandler("SetEBOCredentials", SetEBOCredentials);
	//$W().Push.unregisterEventHandler("SetAWSCredentials", SetAWSCredentials);
	$W().Push.unregisterEventHandler("GuiSignOn", GuiSignOn);
	$W().Push.unregisterEventHandler("TransportationSignOn", signOnToTransporation);
	$W().Push.unregisterEventHandler("SetExecLoginTransportation", SetExecLoginTransportation);
	$W().Push.unregisterEventHandler("SetExecLoginEBO", SetExecLoginEBO);
	//$W().Push.unregisterEventHandler("SetExecLoginAWS", SetExecLoginAWS);
	$W().Push.unregisterEventHandler("SetExecLoginGUI", SetExecLoginGUI);
	//$W().Push.unregisterEventHandler("getEBOEmail", onEBOEmail);
	//$W().Push.unregisterEventHandler("getCurrentBill", getCurrentBill);
	$W().Push.unregisterEventHandler("LaunchAuxillaryEBO", LaunchAuxillaryEBO);
	$W().Push.unregisterEventHandler("SetEboURL", SetEboURL);
	$W().Push.unregisterEventHandler("SetGuiSignOnExePath", SetGuiSignOnExePath);
	$W().Push.unregisterEventHandler("SetGuiExePath", SetGuiExePath);
	$W().Push.unregisterEventHandler("SetGuiWorkingDirectory", SetGuiWorkingDirectory);
	$W().Push.unregisterEventHandler("SetGuiSignOnWorkingDirectory", SetGuiSignOnWorkingDirectory);
	//$W{}.Push.unregisterEventHandler("SetGUIAccountNumber", SetGUIAccountNumber);
	//$W{}.Push.unregisterEventHandler("SetEBOAccountNumber", SetEBOAccountNumber);
	$W().Push.unregisterEventHandler("SetExecCreateAgreement", SetExecCreateAgreement);
	$W().Push.unregisterEventHandler("TransportationLogout", TransportationLogout);
}