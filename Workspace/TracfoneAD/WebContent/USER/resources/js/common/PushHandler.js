function onCustomerServiceProfile(pushData) {
    //call JIA API getCallInfoFromAIC();

    // TODO remove this dummy Data
    /*
    pushData = {
        deviceProfile: { "deviceType": "iPhone", "simStatus": "active" },
        serviceProfile: { "serviceType": "type of service", "brand": "my Brand" },
        customerProfile: { "customerId": "lksdf9879789", "contactName": "Peter Parer" },
        accountBalances: { "phoneStatus": "Pending", "smsBalance": "1245" }
    }
    */

    widgets['customerServiceProfile'].up().up().show(); // show portlet
    widgets['customerServiceProfile'].load(pushData);

    //    alert(pushData);
    //Populate Customer Service Profile section with data object
}
function onLaunchWorkflow(taskId) {
    //if unable/unable
    if (taskId == '9901') {
        //call JIA API launchAgentSupportSearch('Tracfone', 'Unable Unable');
        //call JIA API launchCoverageMap(carrier, zip);
        //call JIA API launchAgentSupportFlowChart('Unable Unable', carrier, deviceType;
        //launch JAS unable unable main flow with parameters
        //call JIA API launchCarrierBilling
        ShowTabById('CallingIssuesTab');
    }
    //if redemption
    else if (taskId == '9902' || taskId == '9903') {
        //call JIA API launchAgentSupportSearch('Tracfone', 'Redemption');
        //launch JAS redemption flow with parameters
        ShowTabById('RedemptionTab');
    }
}
