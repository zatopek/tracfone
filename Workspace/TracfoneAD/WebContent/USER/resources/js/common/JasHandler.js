var JasHandler;
(function () {
    JasHandler = function () {

        var getCarrier = function(carrier){
            if (carrier.indexOf('at&t') >=0 || carrier.indexOf('att')>=0 || carrier.indexOf('cingular') >=0 || carrier.indexOf('dobson') >=0)
                return 'ATT';
            else if (carrier.indexOf('tmobile') >=0 || carrier.indexOf('t-mobile') >=0)
                return 'TMOBILE';
            else if (carrier.indexOf('verizon') >=0)
                return 'VERIZON';
            else if (carrier.indexOf('sprint') >=0)
                return 'SPRINT';
            else
                return carrier;
        }

        var getCookie = function(name) {
            var value = "; " + document.cookie;
            var parts = value.split("; " + name + "=");
            if (parts.length == 2) return parts.pop().split(";").shift();
        }

        var getReportingParams = function () {
            debugger;
            var reportingParams = '';
            var pushData = managers['pushData'];
            //var citrixUsername = $W().username;
            var citrixUsername = '';
            var username = getCookie('username');
            if(username && username.length>0) {
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
                var carrierData = pushData.serviceProfile.carrier.toLowerCase();
                carrier = getCarrier(carrierData);
                taskId = pushData.callInfo.taskId;
            }
            if(citrixUsername) {
                if (citrixUsername.length > 6 && parseInt(citrixUsername.charAt(3)) > 0) {
                    callCenterId = citrixUsername.substring(0, 3);
                    agentId = citrixUsername.substring(4);
                } else {
                    agentId = citrixUsername;
                }
            }
            reportingParams += 'TF_CallId=' + callId + '&TF_CallCenterId=' + callCenterId + '&TF_AgentId=' + agentId + '&TF_ESN=' + esn  + '&TF_Brand=' + brand + '&TF_Carrier=' + carrier + '&TF_TaskId=' + taskId ;
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
            var lteFlag = pushData.deviceProfile.phoneGen.toLowerCase().indexOf('lte') >= 0;
            var iPhoneFlag = (pushData.deviceProfile.os.toLowerCase() === 'ios');
            var voiceBalanceFlag = parseInt(pushData.accountBalances.voiceBalance) > 0;
            var byopFlag = false;
            var ppeFlag = false;

            if (pushData.deviceProfile.deviceType.toLowerCase() === 'feature_phone') {
                ppeFlag = true;
            }
            else if (pushData.deviceProfile.deviceType.toLowerCase() === 'byop') {
                byopFlag = true;
            }

            var serviceEndDate = new Date(pushData.serviceProfile.serviceEndDate).toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

            var serviceExpiredFlag = new Date().getTime() > new Date(pushData.serviceProfile.serviceEndDate).getTime();

            //'TF_Carrier=' + carrier +
            unableUnableParams += '&TF_MINStatus=' + minStatus + '&TF_PPE_Flag=' + ppeFlag + '&TF_ServiceEndDate=' + serviceEndDate + '&TF_BYOP_Flag=' + byopFlag + '&TF_iPhone_Flag=' + iPhoneFlag +
                '&TF_LTE_Flag=' + lteFlag + '&TF_SIMStatus=' + simStatus + '&TF_VoiceBalance_Flag=' + voiceBalanceFlag + '&TF_ServiceExpiredFlag=' + serviceExpiredFlag;
            return unableUnableParams;
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

            getOtherUrl: function () {
                return adam.getVariable("jasUrl") + '&TF_Component=other&' + encodeURI(getReportingParams());
            },
        };
    }
})();

