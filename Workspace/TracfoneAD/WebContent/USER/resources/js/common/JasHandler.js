var JasHandler;
(function () {
    JasHandler = function () {

        var getCarrier = function (carrier) {
            if (carrier.indexOf('at&t') >= 0 || carrier.indexOf('att') >= 0 || carrier.indexOf('cingular') >= 0 || carrier.indexOf('dobson') >= 0)
                return 'ATT';
            else if (carrier.indexOf('tmobile') >= 0 || carrier.indexOf('t-mobile') >= 0)
                return 'TMOBILE';
            else if (carrier.indexOf('verizon') >= 0)
                return 'VERIZON';
            else if (carrier.indexOf('sprint') >= 0)
                return 'SPRINT';
            else
                return carrier;
        }

        var getCookie = function (name) {
            var value = "; " + document.cookie;
            var parts = value.split("; " + name + "=");
            if (parts.length == 2) return parts.pop().split(";").shift();
        }

        var getStringValue = function(field) {
            if(typeof field != 'undefined' && field) {
                return field;
            }
            return '';
        }

        var getDateValue = function(field) {
            if(getStringValue(field)!='')
            {
                try{
                    return new Date(field).toLocaleDateString("en-US", {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    });
                }catch(e){
                    return '';
                }
            }
            return '';
        }

        var getCallFlowParams = function () {
            var callFlowParams = '';
            var pushData = managers['pushData'];
            if (pushData) {
                //device profile
                var min = getStringValue(pushData.deviceProfile.min);
                var deviceType = getStringValue(pushData.deviceProfile.deviceType);
                var sim = getStringValue(pushData.deviceProfile.sim);
                var minStatus = getStringValue(pushData.deviceProfile.minStatus);
                var simStatus = getStringValue(pushData.deviceProfile.simStatus);
                var msid = getStringValue(pushData.deviceProfile.msid);
                var phoneGen = getStringValue(pushData.deviceProfile.phoneGen);

                var hexSerial = getStringValue(pushData.deviceProfile.hexSerial);
                var partNumber = getStringValue(pushData.deviceProfile.partNumber);
                var leasedToFinance = getStringValue(pushData.deviceProfile.leasedToFinance);
                var leaseStatus = getStringValue(pushData.deviceProfile.leaseStatus);
                var sequence = getStringValue(pushData.deviceProfile.sequence);
                var os = getStringValue(pushData.deviceProfile.os);
                var manufacturer = getStringValue(pushData.deviceProfile.manufacturer);
                var firmware = getStringValue(pushData.deviceProfile.firmware);
                var handsetProtection = getStringValue(pushData.deviceProfile.handsetProtection);
                //service profile
                var carrier = getStringValue(pushData.serviceProfile.carrier);
                var currentThrottleStatus = getStringValue(pushData.serviceProfile.currentThrottleStatus);
                var serviceType = getStringValue(pushData.serviceProfile.serviceType);
                var ratePlan = getStringValue(pushData.serviceProfile.ratePlan);
                var servicePlanObjId = getStringValue(pushData.serviceProfile.servicePlanObjId);
                var technology = getStringValue(pushData.serviceProfile.technology);
                var activationDate = getDateValue(pushData.serviceProfile.activationDate);
                var deactDate = getDateValue(pushData.serviceProfile.deactDate);
                var serviceEndDate = getDateValue(pushData.serviceProfile.serviceEndDate);
                var nextChargeDate = getDateValue(pushData.serviceProfile.nextChargeDate);
                var brand = getStringValue(pushData.serviceProfile.brand);
                var dealer = getStringValue(pushData.serviceProfile.dealer);
                var cardsInReserve = getStringValue(pushData.serviceProfile.cardsInReserve);
                var warrantyExchanges = getStringValue(pushData.serviceProfile.warrantyExchanges);
                var basicWarrantyFound = getStringValue(pushData.serviceProfile.basicWarrantyFound);
                var extendedWarranty = getStringValue(pushData.serviceProfile.extendedWarranty);
                var autoRefill = getStringValue(pushData.serviceProfile.autoRefill);
                var nextRefillDate = getDateValue(pushData.serviceProfile.nextRefillDate);
                var pinInReserveFlag = parseInt(cardsInReserve) > 0;

                //customer profile
                var customerId = getStringValue(pushData.customerProfile.customerId);
                var contactName = getStringValue(pushData.customerProfile.contactName);
                var email = getStringValue(pushData.customerProfile.email);
                var groupId = getStringValue(pushData.customerProfile.groupId);
                var lid = getStringValue(pushData.customerProfile.lid);
                var zip = getStringValue(pushData.customerProfile.zip);
                var lifeLineStatus = getStringValue(pushData.customerProfile.lifeLineStatus);
                var programName = getDateValue(pushData.customerProfile.programName);

                //account balance
                var phoneStatus = getStringValue(pushData.accountBalances.phoneStatus);
                var smsBalance = getStringValue(pushData.accountBalances.smsBalance);
                var voiceBalance = getStringValue(pushData.accountBalances.voiceBalance);
                var dataBalance = getStringValue(pushData.accountBalances.dataBalance);

                callFlowParams += 'TF_PinInReserve_Flag=' + pinInReserveFlag +
                    '&TF_PinInReserve=' + cardsInReserve +
                    '&TF_MINStatus=' + minStatus +
                    '&TF_SIMStatus=' + simStatus +
                    //'&TF_PPE_Flag=' + ppeFlag +
                    '&TF_ServiceEndDate=' + serviceEndDate +
                    //'&TF_BYOP_Flag=' + byopFlag +
                    //'&TF_iPhone_Flag=' + iPhoneFlag +
                    //'&TF_LTE_Flag=' + lteFlag +
                    '&TF_SIMStatus=' + simStatus +
                    //'&TF_VoiceBalance_Flag=' + voiceBalanceFlag +
                    //'&TF_ServiceExpiredFlag=' + serviceExpiredFlag +
                    //'&TF_ESN=' + serial  +
                    //'&TF_Brand=' + brand +
                    //'&TF_Carrier=' + carrier +
                    //new
                    '&TF_min=' + min +
                    '&TF_deviceType=' + deviceType +
                    '&TF_sim=' + sim +
                    '&TF_msid=' + msid +
                    '&TF_phoneGen=' + phoneGen +
                    '&TF_hexSerial=' + hexSerial +
                    '&TF_partNumber=' + partNumber +
                    '&TF_leasedToFinance=' + leasedToFinance +
                    '&TF_leaseStatus=' + leaseStatus +
                    '&TF_sequence=' + sequence +
                    '&TF_os=' + os +
                    '&TF_manufacturer=' + manufacturer +
                    '&TF_firmware=' + firmware +
                    'TF_handsetProtection=' + handsetProtection +
                    '&TF_currentThrottleStatus=' + currentThrottleStatus +
                    '&TF_serviceType=' + serviceType +
                    '&TF_ratePlan=' + ratePlan +
                    '&TF_servicePlanObjId=' + servicePlanObjId +
                    '&TF_technology=' + technology +
                    '&TF_activationDate=' + activationDate +
                    '&TF_deactDate=' + deactDate +
                    '&TF_nextChargeDate=' + nextChargeDate +
                    '&TF_dealer=' + dealer +
                    '&TF_warrantyExchanges=' + warrantyExchanges +
                    '&TF_basicWarrantyFound=' + basicWarrantyFound +
                    '&TF_extendedWarranty=' + extendedWarranty +
                    '&TF_autoRefill=' + autoRefill +
                    '&TF_nextRefillDate=' + nextRefillDate +
                    '&TF_customerId=' + customerId +
                    '&TF_contactName=' + contactName +
                    '&TF_email=' + email +
                    '&TF_groupId=' + groupId +
                    '&TF_lid=' + lid +
                    '&TF_zip=' + zip +
                    '&TF_lifeLineStatus=' + lifeLineStatus +
                    '&TF_programName=' + programName +
                    '&TF_phoneStatus=' + phoneStatus +
                    '&TF_smsBalance=' + smsBalance +
                    '&TF_VoiceBalance=' + voiceBalance +
                    '&TF_dataBalance=' + dataBalance;
            }
            return callFlowParams;
        }

        var getReportingParams = function () {
            var reportingParams = '';
            var pushData = managers['pushData'];
            //var citrixUsername = $W().username;
            var citrixUsername = '';
            var username = getCookie('username');
            if (username && username.length > 0) {
                citrixUsername = username;
            }
            var callCenterId = '';
            var agentId = '';
            var callId = '';
            var esn = '';
            var brand = '';
            var carrier = '';
            var taskId = '';
            if (pushData) {
                callId = pushData.callInfo.callId;
                esn = pushData.deviceProfile.esn;
                brand = pushData.serviceProfile.brand;
                try {
                    var carrierData = getStringValue(pushData.serviceProfile.carrier).toLowerCase();
                    carrier = getCarrier(carrierData);
                } catch (e) {
                    carrier = '';
                }

                taskId = pushData.callInfo.taskId;
            }
            if (citrixUsername) {
                if (citrixUsername.length > 6 && parseInt(citrixUsername.charAt(3)) > 0) {
                    callCenterId = citrixUsername.substring(0, 3);
                    agentId = citrixUsername.substring(4);
                } else {
                    agentId = citrixUsername;
                }
            }
            reportingParams += 'TF_CallId=' + callId + '&TF_CallCenterId=' + callCenterId + '&TF_AgentId=' + agentId + '&TF_ESN=' + esn + '&TF_Brand=' + brand + '&TF_Carrier=' + carrier + '&TF_TaskId=' + taskId;
            return reportingParams;
        }


        var getRedemptionParams = function () {
            var redemptionParams = '';
            var pushData = managers['pushData'];
            if (pushData) {
                var pinInReserve = pushData.serviceProfile.cardsInReserve;
                var pinInReserveFlag = parseInt(pinInReserve) > 0;
                redemptionParams += 'TF_PinInReserve_Flag=' + pinInReserveFlag + '&TF_PinInReserve=' + pinInReserve;
            }
            return redemptionParams;
        }

        var getUnableUnableParams = function () {
            // var unable_unable_params = 'TF_Carrier=' + carrier + '&TF_MINStatus=' + minStatus + '&TF_PPE_Flag=' + ppeFlag + '&TF_ServiceEndDate=' + serviceEndDate + '&TF_BYOP_Flag=' + byopFlag + '&TF_iPhone_Flag=' + iPhoneFlag +
            // '&TF_LTE_Flag=' + lteFlag + '&TF_SIMStatus=' + simStatus + '&TF_VoiceBalance_Flag=' + voiceBalanceFlag + '&TF_ServiceExpiredFlag=' + serviceExpiredFlag;
            var unableUnableParams = '';
            var pushData = managers['pushData'];

            //var carrierData = pushData.serviceProfile.carrier.toLowerCase();
            //var carrier = getCarrier(carrierData);
            var minStatus = pushData.deviceProfile.minStatus;
            var simStatus = pushData.deviceProfile.simStatus;
            var lteFlag = getStringValue(pushData.deviceProfile.phoneGen).toLowerCase().indexOf('lte') >= 0;
            var iPhoneFlag = getStringValue(pushData.deviceProfile.os).toLowerCase() === 'ios';
            var voiceBalanceFlag = parseInt(pushData.accountBalances.voiceBalance) > 0;
            var byopFlag = false;
            var ppeFlag = false;

            if (getStringValue(pushData.deviceProfile.deviceType).toLowerCase() === 'feature_phone') {
                ppeFlag = true;
            }
            else if (getStringValue(pushData.deviceProfile.deviceType).toLowerCase() === 'byop') {
                byopFlag = true;
            }

            var serviceEndDate = new Date(pushData.serviceProfile.serviceEndDate).toLocaleDateString("en-US", {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });

            var serviceExpiredFlag = new Date().getTime() > new Date(pushData.serviceProfile.serviceEndDate).getTime();

            //'TF_Carrier=' + carrier +
            unableUnableParams += '&TF_MINStatus=' + minStatus + '&TF_PPE_Flag=' + ppeFlag + '&TF_ServiceEndDate=' + serviceEndDate + '&TF_BYOP_Flag=' + byopFlag + '&TF_iPhone_Flag=' + iPhoneFlag +
                '&TF_LTE_Flag=' + lteFlag + '&TF_SIMStatus=' + simStatus + '&TF_VoiceBalance_Flag=' + voiceBalanceFlag + '&TF_ServiceExpiredFlag=' + serviceExpiredFlag;
            return unableUnableParams;
        }

        var mod_escape = function(value) {
            value = value.replace(/\+/g, '%2B');
            value = value.replace(/\@/g, '%40');
            return value;
        }

        return {
            init: function () {

            },

            getRedemptionUrl: function () {
                return adam.getVariable("jasUrl") + '&TF_Component=redemption&' + encodeURI(getRedemptionParams()) + '&' + encodeURI(getReportingParams());
            },

            getUnableUnableUrl: function () {
                return adam.getVariable("jasUrl") + '&TF_Component=unableUnable&' + encodeURI(getUnableUnableParams()) + '&' + encodeURI(getRedemptionParams()) + '&' + encodeURI(getReportingParams());
            },

            getSalesMenuUrl: function () {
                return adam.getVariable("jasSalesMenuUrl") + '&TF_Component=other&' + mod_escape(encodeURI(getReportingParams())) + '&' + mod_escape(encodeURI(getCallFlowParams()));
            },

            getPortMenuUrl: function () {
                return adam.getVariable("jasPortMenuUrl") + '&TF_Component=other&' + mod_escape(encodeURI(getReportingParams())) + '&' + mod_escape(encodeURI(getCallFlowParams()));
            },

            getPhoneFunctionalityMenuUrl: function () {
                return adam.getVariable("jasPhoneFunctionalityMenuUrl") + '&TF_Component=other&' + mod_escape(encodeURI(getReportingParams())) + '&' + mod_escape(encodeURI(getCallFlowParams()));
            },

            getLifelineMenuUrl: function () {
                return adam.getVariable("jasLifelineMenuUrl") + '&TF_Component=other&' + mod_escape(encodeURI(getReportingParams())) + '&' + mod_escape(encodeURI(getCallFlowParams()));
            },

            getHardwareIssuesMenuUrl: function () {
                return adam.getVariable("jasHardwareIssuesMenuUrl") + '&TF_Component=other&' + mod_escape(encodeURI(getReportingParams())) + '&' + mod_escape(encodeURI(getCallFlowParams()));
            },

            getAddServiceMenuUrl: function () {
                return adam.getVariable("jasAddServiceMenuUrl") + '&TF_Component=other&' + mod_escape(encodeURI(getReportingParams())) + '&' + mod_escape(encodeURI(getCallFlowParams()));
            },

            getAccountMenuUrl: function () {
                return adam.getVariable("jasAccountMenuUrl") + '&TF_Component=other&' + mod_escape(encodeURI(getReportingParams())) + '&' + mod_escape(encodeURI(getCallFlowParams()));
            },
        };
    }
})();