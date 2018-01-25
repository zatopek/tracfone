function onCustomerServiceProfile(pushData) {    //call JIA API getCallInfoFromAIC();

    // TODO remove this dummy Data

    pushData = {
        deviceProfile: { "min":"3219990000", "deviceType": "feature_phone", "sim": "123", "minStatus": "ACTIVE", "simStatus": "SIM ACTIVE", "phoneGen": "AD-LTE", "os": "and" },
        serviceProfile: { "serviceType": "Paygo", "brand": "TracFone", "carrier": "AT&T", "serviceEndDate": "12/15/2018", "cardsInReserve": "2" },
        customerProfile: { "customerId": "lksdf9879789", "contactName": "Peter Parer", "zip":"32828" },
        accountBalances: { "phoneStatus": "Active", "smsBalance": "124", "voiceBalance": "100" },
        callInfo: { "airtimePin": "NA", "xferCondition": "NA", "taskId":"9902" }
    }

	/*
    adam.callService('Avaya/Properties', 'GET').then(function (response) {
        for (i=0; i<response.length; i++){
            var key = response[i].Key;
            if(key==="Customer Type"){
                pushData.customerProfile.customerType = response[i].Value;
                continue;
            }
            if(key==="Airtime PIN"){
                if(response[i].Value != "NA"){
                    pushData.callInfo.airtimePin = response[i].Value;
                }
                else {
                    pushData.callInfo.airtimePin = "";
                }
                continue;
            }
            if(key==="XFER Condition"){
                pushData.callInfo.xferCondition = response[i].Value;
                continue;
            }
            if(key==="Case ID"){
                pushData.customerProfile.caseId = response[i].Value;
                continue;
            }
            if(key==="Flash ID"){
                pushData.customerProfile.flashId = response[i].Value;
                continue;
            }
        }
        setupCustomerServiceProfile(pushData);
    }).catch(function (error) {
        pushData.customerProfile.customerType = '';
        pushData.callInfo.airtimePin = '';
        pushData.callInfo.xferCondition = '';
        pushData.customerProfile.caseId = '';
        pushData.customerProfile.flashId = '';
        setupCustomerServiceProfile(pushData);
    });
    */
	setupCustomerServiceProfile(pushData);
}

function setupCustomerServiceProfile(pushData){
    // save it in managers for now. Need a way to put it in datastore depending on unique Id
    managers['pushData'] = pushData;
    // pushData.customerProfile.account = {};
    // Object.assign(pushData.customerProfile.account, pushData.accountBalances);

    // adam.savePushData(pushData);
    widgets['customerServiceProfile'].up().up().show(); // show portlet
    widgets['customerServiceProfile'].load(pushData);

    onLaunchWorkflow(pushData.callInfo.taskId);
}

function onLaunchWorkflow(taskId) {
    managers['autoNotes'] = '';

    //if unable/unable
    var pushData = managers['pushData'];
    var carrier = pushData.serviceProfile.carrier.toLowerCase();

    //regenerate carrier value to match with the service parameter
    if(carrier.indexOf('tmobile')>=0 || carrier.indexOf('t-mobile')>=0) {
        carrier = 'T-Mobile';
    }
    else if(carrier.indexOf('verizon')>=0) {
        carrier = 'Verizon';
    }
    else if(carrier.indexOf('at&t')>=0  || carrier.indexOf('cingular')>=0  || carrier.indexOf('dobson')>=0 ) {
        carrier = encodeURIComponent('AT&T');
    }
    else if(carrier.indexOf('sprint')>=0) {
        carrier = 'Sprint';
    }

    // mapping brand
    var brand = pushData.serviceProfile.brand.toLowerCase();
    if(brand === 'tracfone'){
        brand = 'TracFone';
    }
    else if(brand === 'straight_talk'){
        brand = 'StraightTalk';
    }

    if (taskId == '9901') {
       
        var phoneType = pushData.deviceProfile.deviceType.toLowerCase();
        if (phoneType === 'feature_phone') {
            phoneType = 'PPE';
        }
        else if (phoneType === 'byop') {
            phoneType = 'BYOP';
        }
        else {
            if(carrier==='Verizon'){
                phoneType = 'Non-PPE';
            }
            else {
                phoneType = 'Non%20PPE';
            }
        }

		 //call JIA API launchAgentSupportSearch('brand', 'Unable Unable');
        adam.callService('AgentAdvisor/Search/' + brand + '?searchTerm=Unable%20Unable', 'GET').then(function (response) {
			// do nothing
		}).catch(function(e){
			
		});
		 //call JIA API launchCoverageMap(carrier, zip);
		adam.callService('CoverageMap/Search/' + carrier + '/' + pushData.customerProfile.zip, 'GET').then(function (response) {
			
		}).catch(function(e){
			
		});
		//call JIA API launchAgentSupportFlowChart('Unable Unable', carrier, deviceType;
		adam.callService('AgentAdvisor/FlowChart?brand=' + brand + '&flowChart=Unable%2FUnable%20Troubleshooting&carrier=' + carrier + '&phoneType=' + phoneType, 'GET').then(function (response) {
			
		}).catch(function(e){
			
		});
		//call JIA API launchCarrierBilling
		adam.callService('Billing/' + carrier, 'GET').then(function (response) {
			// do nothing
			log.info("***** calling billing " + carrier);
        }).catch(function (error) {
			
        });
        //launch JAS unable unable main flow with parameters => handled in JasHandler

        managers['flowType'] = 'unableUnable'; // to keep track of the flow
        if(document.unableUnableJasFrame){
            document.unableUnableJasFrame.location = managers['jasHandler'].getUnableUnableUrl();
            widgets['unableUnable'].loadComponent('', '');
        }
        ShowTabById('CallingIssuesTab');
    }
    //if redemption
    else if (taskId == '9902' || taskId == '9903') {
        //call JIA API launchAgentSupportSearch('Tracfone', 'Redemption');
        adam.callService('AgentAdvisor/Search/' + brand + '?searchTerm=Redemption', 'GET').then(function (response) {
            // do nothing
        }).catch(function (error) {
        });
        //launch JAS redemption flow with parameters ==> handled in JasHandler
        managers['flowType'] = 'redemption'; // to keep track of the flow
        if(document.redemptionJasFrame){
            document.redemptionJasFrame.location = managers['jasHandler'].getRedemptionUrl();
            widgets['redemption'].loadComponent('', '');
        }
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