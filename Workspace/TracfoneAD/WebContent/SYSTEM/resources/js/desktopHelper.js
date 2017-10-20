var desktopHelperActiveX = null;
var DESKTOP_HELPER_DIV_ID = "DESKTOP_HELPER_DIV_ID";

/** 
 * @class desktopHelper.js - This file contains methods for extracting client desktop information.
 */
/**
 * Returns array of client's desktop Fully Quilified Domain Names.
 * @return array of client's desktop Fully Quilified Domain Names.
 */
function getClientFQDNs(){
	var activeX = getDesktopHelperActiveX();
	var dnsStr = activeX.GetClientFQDNs();
	return dnsStr.split(";");
}

/**
 * Returns hostname of client desktop.
 * @return hostname of client desktop.
 */
function getClientHostname(){
	var activeX = getDesktopHelperActiveX();
	return activeX.GetClientHostname();
}

/**
 * Returns array of client's desktop IP's.
 * @return array of client's desktop IP's.
 */
function getClientIPAddresses(){
	try{
		var activeX = getDesktopHelperActiveX();
		var addrStr = activeX.GetClientIPAddresses();
		return addrStr.split(";");
	}catch(e){
		return null;
	}
	
}

//private method
function runApplicationWithoutNesting(exeName, workingDir, agrs){
	var activeX = getDesktopHelperActiveX();
	try{
		activeX.RunApplicationWithoutNesting(exeName, workingDir, agrs);
	}catch(e){
		$W().LogManager.getLogger("desktopHelper").error("Failed to start application " + exeName + ", " + workingDir + ", " + args + ". Exception: " + e);
	}
}

//private method
function getDesktopHelperActiveX(){
	if(desktopHelperActiveX == null){
		var dhDiv = $(DESKTOP_HELPER_DIV_ID);
		if(dhDiv){
			if(dhDiv.innerHTML == null || dhDiv.innerHTML == ""){
				dhDiv.innerHTML = '<OBJECT id="desktopHelperActiveX" CLASSID="CLSID:8356B5EC-F565-4220-BA38-0626A92A3252" CODEBASE="ApplicationHolder.CAB#version=1,0,0,1" width="1px" height="1px"></OBJECT>';
			}
		}
		desktopHelperActiveX = $('desktopHelperActiveX');
	}
	return desktopHelperActiveX;
}
