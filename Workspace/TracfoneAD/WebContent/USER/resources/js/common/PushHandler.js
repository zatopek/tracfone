function onIncomingCallQueryString(queryString){
    var TAS_url = "http://sit1tas.tracfone.com/AdfCrmConsole/faces/adf.task-flow?" + queryString;
    //call JIA API incomingCall(TAS_url);
    //call JIA API getCallInfoFromAIC()
}
function onCustomerServiceProfile(pushData){
    //Populate Customer Service Profile section with data object
}
function onLaunchWorkflow(taskId){
    //if unable/unable
    if(taskId=='9901'){
        //call JIA API launchAgentSupportSearch('Tracfone', 'Unable Unable');
        //call JIA API launchCoverageMap(carrier, zip);
        //call JIA API launchAgentSupportFlowChart('Unable Unable', carrier, deviceType;
        //launch JAS unable unable main flow with parameters
        //call JIA API launchCarrierBilling
    }
    //if redemption
    else if(taskId=='9902' || taskId=='9903'){
        //call JIA API launchAgentSupportSearch('Tracfone', 'Redemption');
        //launch JAS redemption flow with parameters
    }
}
