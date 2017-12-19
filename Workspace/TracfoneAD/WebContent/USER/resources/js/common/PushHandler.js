function onCustomerServiceProfile(pushData) {
    //call JIA API getCallInfoFromAIC();

    // TODO remove this dummy Data

    pushData = {
        deviceProfile: { "min":"3219990000", "deviceType": "BYOP", "sim": "123", "minStatus": "ACTIVE", "simStatus": "SIM ACTIVE", "phoneGen": "AD-LTE", "os": "and" },
        serviceProfile: { "serviceType": "type of service", "brand": "TracFone", "carrier": "VErizon", "serviceEndDate": "12/15/2017", "cardsInReserve": "2" },
        customerProfile: { "customerId": "lksdf9879789", "contactName": "Peter Parer", "zip":"32828" },
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
    var pushData = managers['pushData'];
    var carrier = pushData.serviceProfile.carrier;

    //regenerate carrier value to match with the service parameter
    switch (carrier.toLowerCase()) {
        case 'tmobile':
            carrier = 'TMobile';
            break;
        case 'verizon':
            carrier = 'Verizon';
            break;
        case 'at&t':
            carrier = encodeURIComponent('AT&T'); // TODO need to check if this is the desired value
            break;
        default:
    }

    if (taskId == '9901') {
        //call JIA API launchAgentSupportSearch('brand', 'Unable Unable');
        adam.callService('AgentAdvisor/Search/' + pushData.serviceProfile.brand + '?searchTerm=Unable%20Unable', 'GET').then(function (response) {
            // do nothing
        }).catch(function (error) {
        });

        //call JIA API launchCoverageMap(carrier, zip);
        adam.callService('CoverageMap/Search/' + carrier + '/' + pushData.customerProfile.zip, 'GET').then(function (response) {
            // do nothing
        }).catch(function (error) {
        });

        //call JIA API launchAgentSupportFlowChart('Unable Unable', carrier, deviceType;
        adam.callService('AgentAdvisor/FlowChart?brand=' + pushData.serviceProfile.brand + '&flowChart=Unable%20Unable&carrier=' + carrier + '&phoneType=' + pushData.deviceProfile.deviceType, 'GET').then(function (response) {
            // do nothing
        }).catch(function (error) {
        });

        //launch JAS unable unable main flow with parameters => handled in JasHandler
        //call JIA API launchCarrierBilling
        adam.callService('Billing/' + carrier, 'GET').then(function (response) {
            // do nothing
        }).catch(function (error) {
        });

        managers['flowType'] = 'unableUnable'; // to keep track of the flow
        ShowTabById('CallingIssuesTab');
    }
    //if redemption
    else if (taskId == '9902' || taskId == '9903') {
        //call JIA API launchAgentSupportSearch('Tracfone', 'Redemption');
        adam.callService('AgentAdvisor/Search/' + pushData.serviceProfile.brand + '?searchTerm=Redemption', 'GET').then(function (response) {
            // do nothing
        }).catch(function (error) {
        });
        //launch JAS redemption flow with parameters ==> handled in JasHandler
        managers['flowType'] = 'redemption'; // to keep track of the flow
        ShowTabById('RedemptionTab');
    }

}

function onAgentEnvUsername(data)
{
    $W().username = data;
}

function onStartTas(data)
{
    $W().tasUrl = data;
}