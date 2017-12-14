function onCustomerServiceProfile(pushData) {
    //call JIA API getCallInfoFromAIC();

    // TODO remove this dummy Data


    pushData = {
        deviceProfile: { "deviceType": "BYOP", "sim": "123", "minStatus": "ACTIVE", "simStatus": "SIM ACTIVE", "phoneGen": "AD-LTE", "os": "and" },
        serviceProfile: { "serviceType": "type of service", "brand": "my Brand", "carrier": "AT&T", "serviceEndDate": "12/15/2017", "cardsInReserve":"2" },
        customerProfile: { "customerId": "lksdf9879789", "contactName": "Peter Parer" },
        accountBalances: { "phoneStatus": "Pending", "smsBalance": "124", "voiceBalance": "0" }
    }
    // save it in managers for now. Need a way to put it in datastore depending on unique Id
    managers['pushData'] = pushData;
    // pushData.customerProfile.account = {};
    // Object.assign(pushData.customerProfile.account, pushData.accountBalances);

    // adam.savePushData(pushData);

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

function onAgentEnvUsername(data)
{
    $W().username = data;
}