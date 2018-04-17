function onCustomerServiceProfile(pushData) {
    //call JIA API getCallInfoFromAIC();

    // TODO remove this dummy Data
	/*
    pushData = {
        deviceProfile: { "min":"3219990000", "deviceType": "BYOP", "sim": "123", "minStatus": "ACTIVE", "simStatus": "SIM ACTIVE", "phoneGen": "AD-LTE", "os": "and" },
        serviceProfile: { "serviceType": "type of service", "brand": "TracFone", "carrier": "VErizon", "serviceEndDate": "12/15/2017", "cardsInReserve": "2" },
        customerProfile: { "customerId": "lksdf9879789", "contactName": "Peter Parer", "zip":"32828" },
        accountBalances: { "phoneStatus": "Pending", "smsBalance": "124", "voiceBalance": "0" }
    }
    */
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
    var win = Ext.WindowManager.getActive();
    if(win) {
        win.close();
    }
	setupCustomerServiceProfile(pushData);
}

function setupCustomerServiceProfile(pushData){

    managers['pushData'] = pushData;
    widgets['customerServiceProfile'].up().up().show(); // show portlet
    widgets['customerServiceProfile'].load(pushData);
	unloadWorkflow();
    onLaunchWorkflow(pushData);
}

function unloadWorkflow() {
	managers['flowType'] = '';
	RemoveTabById('CallingIssuesTab');
	RemoveTabById('RedemptionTab');
}

function onLaunchWorkflow(pushData) {

    var taskId = pushData.callInfo.taskId;
    if(taskId == '9901'){
        managers['flowType'] = 'unableUnable';
    } else if(taskId == '9902' || taskId == '9903' || taskId == '109' /* <-- based on Natalio's email from 3/13*/) {
        managers['flowType'] = 'redemption';
    } else {
        Ext.MessageBox.alert('ERROR', 'Unsupported call flow. Please use TAS to complete this call.');
        managers['flowType'] = 'other';
    }

    var contactName = pushData.customerProfile.contactName;
    var carrier = pushData.serviceProfile.carrier;
    var serial = pushData.deviceProfile.serial;
    var phoneStatus = pushData.deviceProfile.phoneStatus ;
    var minStatus = pushData.deviceProfile.minStatus;

    if(contactName && contactName.indexOf("null")>=0){
        contactName = '';
        pushData.customerProfile.contactName = '';
    }

    if(!serial || serial.trim()=='') {
        Ext.MessageBox.alert('ERROR', 'ESN not active. Please use TAS to complete this call.');
        managers['flowType'] = 'other';
    }
    // check customer name and carrier before loading work flow
    else if(!contactName || contactName.trim()=='' ){
        Ext.MessageBox.alert('ERROR', 'ESN not active. Please use TAS to complete this call.');
        managers['flowType'] = 'other';
    }
    else if(!carrier || carrier.trim()=='') {
        Ext.MessageBox.alert('ERROR', 'Carrier information not found. Please use TAS to complete this call.');
        managers['flowType'] = 'other';
    }
    else if(!phoneStatus || phoneStatus.trim().toLowerCase()!='active') {
        Ext.MessageBox.alert('ERROR', 'Phone status is not ACTIVE. Please use TAS to complete this call.');
        managers['flowType'] = 'other';
    }
    else if(!minStatus || minStatus.trim().toLowerCase()!='active') {
        Ext.MessageBox.alert('ERROR', 'MIN status is not ACTIVE. Please use TAS to complete this call.');
        managers['flowType'] = 'other';
    }

    managers['autoNotes'] = '';

    var carrier = pushData.serviceProfile.carrier.toLowerCase();
    var carrierAtt = 'Att';

    //regenerate carrier value to match with the service parameter
    if(carrier.indexOf('tmobile')>=0 || carrier.indexOf('t-mobile')>=0) {
        carrier = 'T-Mobile';
    }
    else if(carrier.indexOf('verizon')>=0) {
        carrier = 'Verizon';
    }
    else if(carrier.indexOf('at&t')>=0 || carrier.indexOf('att')>=0 || carrier.indexOf('cingular')>=0  || carrier.indexOf('dobson')>=0 ) {
        carrier = encodeURIComponent('AT&T');
    }
    else if(carrier.indexOf('sprint')>=0) {
        carrier = 'Sprint';
    } else {
        Ext.MessageBox.alert('ERROR', 'Carrier ' + carrier + ' unknown. Please use TAS to complete this call.');
        managers['flowType'] = 'other';
    }

    // mapping brand
    var brand = pushData.serviceProfile.brand.toLowerCase();
    if(brand) {
        if(brand === 'tracfone'){
            brand = 'TracFone';
        }
    }
    else {
        Ext.MessageBox.alert('ERROR', 'Only TracFone brand is supported in this release. Please use TAS to complete this call.');
        managers['flowType'] = 'other';
    }
    /*
    else if(brand === 'straight_talk'){
        brand = 'StraightTalk';
    }
    */


    //if unable/unable
    if (managers['flowType'] == 'unableUnable') {
       
        var phoneType = pushData.deviceProfile.deviceType.toLowerCase();
        if(phoneType){
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
        }

		 //call JIA API launchAgentSupportSearch('brand', 'Unable Unable');
        adam.callService('AgentAdvisor/Search/' + brand + '?searchTerm=Unable%20Unable', 'GET').then(function (response) {
			// do nothing
		}).catch(function(e){
			
		});
		//call JIA API launchAgentSupportFlowChart('Unable Unable', carrier, deviceType;
		adam.callService('AgentAdvisor/FlowChart?brand=' + brand + '&flowChart=Unable%2FUnable%20Troubleshooting&carrier=' + carrier + '&phoneType=' + phoneType, 'GET').then(function (response) {
			
		}).catch(function(e){
			
		});
        //call JIA API launchCoverageMap(carrier, zip);
        if(carrier.toLowerCase().startsWith("at"))
        {
            carrier = carrierAtt;
        }

        // only launch system if login is available

        if(carrier == 'Verizon'){
            if(adam.isSystemInLogins('VerizonCIS')) {
                adam.callService('CoverageMap/Search/' + carrier + '/' + pushData.customerProfile.zip, 'GET').then(function (response) {
                }).catch(function(e){
                });
            }
        } else {
            adam.callService('CoverageMap/Search/' + carrier + '/' + pushData.customerProfile.zip, 'GET').then(function (response) {
            }).catch(function(e){
            });
        }

		//call JIA API launchCarrierBilling
        if(carrier == 'Verizon') {
            if(adam.isSystemInLogins('VerizonRSSX')) {
                adam.callService('Billing/' + carrier, 'GET').then(function (response) {
                }).catch(function (error) {
                });
            }
        } else if(carrier == 'Verizon') {
            if(adam.isSystemInLogins('TMobileWCSM')) {
                adam.callService('Billing/' + carrier, 'GET').then(function (response) {
                }).catch(function (error) {
                });
            }
        } else {
            adam.callService('Billing/' + carrier, 'GET').then(function (response) {
            }).catch(function (error) {
            });
        }

        //launch JAS unable unable main flow with parameters => handled in JasHandler

        if(document.unableUnableJasFrame){
            document.unableUnableJasFrame.location = managers['jasHandler'].getUnableUnableUrl();
            //widgets['unableUnable'].loadComponent('SplashPanel', '');
            widgets['unableUnable'].loadComponent('', '');
        }
        ShowTabById('CallingIssuesTab');
    }
    //if redemption
    else if (managers['flowType'] == 'redemption') {
        //call JIA API launchAgentSupportSearch('Tracfone', 'Redemption');
        adam.callService('AgentAdvisor/Search/' + brand + '?searchTerm=Redemption', 'GET').then(function (response) {
            // do nothing
        }).catch(function (error) {
        });
        //launch JAS redemption flow with parameters ==> handled in JasHandler

        if(document.redemptionJasFrame){
            document.redemptionJasFrame.location = managers['jasHandler'].getRedemptionUrl();
            //widgets['redemption'].loadComponent('SplashPanel', '');
            widgets['redemption'].loadComponent('', '');
        }
        ShowTabById('RedemptionTab');
    }
    else{
        if(document.redemptionJasFrame){
            document.redemptionJasFrame.location = managers['jasHandler'].getOtherUrl();
            //widgets['redemption'].loadComponent('SplashPanel', '');
            widgets['redemption'].loadComponent('', '');
        }
        ShowTabById('RedemptionTab');
    }
}

function onAgentEnvUsername(data)
{
    if(data)
        $W().username = data;
    else
        $W().username = '';
}

function onStartTas(data)
{
    $W().startTas = false;
    $W().tasUrl = data;
}

function onAccountBalances(data)
{
    // adam.savePushData(pushData);
    managers['pushData'].accountBalances = data.accountBalances;
    widgets['customerServiceProfile'].up().up().show(); // show portlet
    widgets['customerServiceProfile'].loadAccountBalances(data);
}