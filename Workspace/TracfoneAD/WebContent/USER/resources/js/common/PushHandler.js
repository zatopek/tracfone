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
    //remove null from contact name
    var contactName = pushData.customerProfile.contactName;
    contactName = contactName.replace(/null/g, '');
    pushData.customerProfile.contactName = contactName;

    managers['pushData'] = pushData;
    widgets['customerServiceProfile'].up().up().show(); // show portlet
    widgets['customerServiceProfile'].load(pushData);
    unloadWorkflow();
    onLaunchWorkflow(pushData);
}

function unloadWorkflow() {
    managers['flowType'] = '';
    managers['autoNotes'] = '';
    managers['interactionDetails'] = '';
    //managers['pushData'] = '';
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
        //Ext.MessageBox.alert('ERROR', 'Unsupported call flow. Please use TAS to complete this call.');
        managers['flowType'] = 'other';
    }
    var carrier = pushData.serviceProfile.carrier;
    var serial = pushData.deviceProfile.serial;
    var phoneStatus = pushData.deviceProfile.phoneStatus ;
    var minStatus = pushData.deviceProfile.minStatus;
    var contactName = pushData.customerProfile.contactName;

    if(!serial || serial.trim()=='') {
        //Ext.MessageBox.alert('ERROR', 'ESN not active. Please use TAS to complete this call.');
        managers['flowType'] = 'unsupport';
    }
    // check customer name and carrier before loading work flow
    else if(!contactName || contactName.trim()=='' ){
        //Ext.MessageBox.alert('ERROR', 'ESN not active. Please use TAS to complete this call.');
        managers['flowType'] = 'unsupport';
    }
    else if(!carrier || carrier.trim()=='') {
        //Ext.MessageBox.alert('ERROR', 'Carrier information not found. Please use TAS to complete this call.');
        managers['flowType'] = 'unsupport';
    }
    else if(!phoneStatus || phoneStatus.trim().toLowerCase()!='active') {
        //Ext.MessageBox.alert('ERROR', 'Phone status is not ACTIVE. Please use TAS to complete this call.');
        managers['flowType'] = 'unsupport';
    }
    else if(!minStatus || minStatus.trim().toLowerCase()!='active') {
        //Ext.MessageBox.alert('ERROR', 'MIN status is not ACTIVE. Please use TAS to complete this call.');
        managers['flowType'] = 'unsupport';
    }


    /*** disable auto launch by call type feature ***/
    if(managers['flowType'] != 'other' || managers['flowType'] != 'unsupport') {

        var carrier = translateCarrierForUnableApps(pushData.serviceProfile.carrier);
        //regenerate carrier value to match with the service parameter
        if(carrier === 'OTHER') {
            //Ext.MessageBox.alert('ERROR', 'Carrier ' + carrier + ' unknown. Please use TAS to complete this call.');
            managers['flowType'] = 'other';
        }

        // mapping brand
        var brand = '';
        try {
            brand = translateBrand(pushData.serviceProfile.brand.toLowerCase());
            if(brand != 'TracFone'){
                //Ext.MessageBox.alert('ERROR', 'Only TracFone brand is supported in this release. Please use TAS to complete this call.');
                managers['flowType'] = 'other';
            }
        } catch(e) {
            //Ext.MessageBox.alert('ERROR', 'Only TracFone brand is supported in this release. Please use TAS to complete this call.');
            managers['flowType'] = 'other';
        }
    }

    launchOtherCallFlow();
    //if unable/unable
    if (managers['flowType'] == 'unableUnable') {
        launchUnableCallFlow(brand, carrier);
    }
    //if redemption
    else if (managers['flowType'] == 'redemption') {
        launchRedemptionCallFlow(brand);
    }
}

function launchCallFlow(callFlow) {
    // check if customer profile is launched
    if(widgets['customerServiceProfile'].up().up().isVisible()) {
        if(callFlow==='redemption') {
            taskId = '9902';
        }
        else if(callFlow==='unable') {
            taskId = '9901';
        }
        else {
            Ext.MessageBox.alert('ERROR', 'Unsupported call flow. Please use TAS to complete this call.');
            return;
        }

        if(managers['flowType'] === 'unsupport') {
            Ext.MessageBox.alert('ERROR', 'ESN not supported in Cockpit. Please use TAS to complete this call.');
            return;
        }

        managers['autoNotes'] = '';
        var pushData = managers['pushData'];
        var url = pushData.tasInfo.url;
        var start = url.indexOf('&task_id=');
        var end = url.indexOf('&', start + 9);
        var newUrl = url.substring(0, start) + '&task_id=' + taskId + url.substring(end) + '&skipWSNotification=true';
        adam.callService('Tas/IncomingCall?url=' + encodeURIComponent(newUrl), 'GET').then(function (response) {

        }).catch(function (error) {

        });

        var brand = translateBrand(pushData.serviceProfile.brand.toLowerCase());

        if(callFlow==='redemption') {
            unloadWorkflow();
            launchRedemptionCallFlow(brand);
        }
        else if(callFlow==='unable') {
            unloadWorkflow();
            var carrier = translateCarrierForUnableApps(pushData.serviceProfile.carrier);
            launchUnableCallFlow(brand, carrier);
        }
    }
    else {
        Ext.MessageBox.alert('ERROR', 'Call flow only available after a customer is identified in Cockpit.');
    }
}

function launchOtherCallFlow() {
    /*
    if(document.redemptionJasFrame){

        //document.redemptionJasFrame.location = managers['jasHandler'].getOtherUrl();
        document.redemptionJasFrame.location = managers['jasHandler'].getTestUrl();
        //widgets['redemption'].loadComponent('SplashPanel', '');
        widgets['redemption'].loadComponent('', '');
    }
    */
    //ShowTabById('RedemptionTab');
    if(document.accountsJasFrame) {
        document.accountsJasFrame.location = managers['jasHandler'].getAccountMenuUrl();
    }
    if(document.addServiceJasFrame) {
        document.addServiceJasFrame.location = managers['jasHandler'].getAddServiceMenuUrl();
    }

    if(document.hardwareIssuesJasFrame) {
        document.hardwareIssuesJasFrame.location = managers['jasHandler'].getHardwareIssuesMenuUrl();
    }
    if(document.lifelineJasFrame) {
        document.lifelineJasFrame.location = managers['jasHandler'].getLifelineMenuUrl();
    }
    if(document.phoneFunctionalityJasFrame) {
        document.phoneFunctionalityJasFrame.location = managers['jasHandler'].getPhoneFunctionalityMenuUrl();
    }
    if(document.portJasFrame) {
        document.portJasFrame.location = managers['jasHandler'].getPortMenuUrl();
    }
    if(document.salesJasFrame) {
        document.salesJasFrame.location = managers['jasHandler'].getSalesMenuUrl();
    }

    ShowTabById('AccountTab');
    ShowTabById('AddServiceTab');
    ShowTabById('PortTab');
    ShowTabById('SalesTab');
    ShowTabById('PhoneFunctionalityTab');
    ShowTabById('HardwareIssuesTab');
    ShowTabById('LifelineTab');
}

function launchRedemptionCallFlow(brand) {
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

function launchUnableCallFlow(brand, carrier) {
    var pushData = managers['pushData'];
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
        carrier = 'Att';
    }

    // only launch system if login is available

    if(carrier == 'Verizon'){
        if(adam.isSystemInLogins('Verizon_CIS')) {
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
        if(adam.isSystemInLogins('Verizon_RSSX')) {
            adam.callService('Billing/' + carrier, 'GET').then(function (response) {
            }).catch(function (error) {
            });
        }
    } else if(carrier == 'T-Mobile') {
        if(adam.isSystemInLogins('T_Mobile_WCSM')) {
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

function translateBrand(brand){
    if(brand && brand.toLowerCase() === 'tracfone'){
        return 'TracFone';
    }
    return brand;

    /*
    else if(brand === 'straight_talk'){
        brand = 'StraightTalk';
    }
    */
}

function translateCarrierForUnableApps(carrier) {
    //regenerate carrier value to match with the service parameter
    if(carrier) {
        carrier = carrier.toLowerCase();
        if(carrier.indexOf('tmobile')>=0 || carrier.indexOf('t-mobile')>=0) {
            return 'T-Mobile';
        }
        else if(carrier.indexOf('verizon')>=0) {
            return 'Verizon';
        }
        else if(carrier.indexOf('at&t')>=0 || carrier.indexOf('att')>=0 || carrier.indexOf('cingular')>=0  || carrier.indexOf('dobson')>=0 ) {
            return encodeURIComponent('AT&T');
        }
        else if(carrier.indexOf('sprint')>=0) {
            return 'Sprint';
        } else {
            return 'OTHER';
        }
    }
}