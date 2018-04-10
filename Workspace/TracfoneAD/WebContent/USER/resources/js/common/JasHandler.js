
var JasHandler;
(function () {
    JasHandler = function () {
        // TODO get it from project variables (adam.getVariable(redemptionurl))
        //var redemptionUrl = 'https://gointeract.io/interact/index?interaction=237e6c87c415-d4b64eb5b32cb044-22b8&accountId=azurademo&appkey=6c87bc97-fc7a-4dfe-80b3-d8c43521cb9c';
        //var unableUnableUrl = 'https://gointeract.io/interact/index?interaction=2471ae2941ee-0cf98cced8706fb9-c170&accountId=azurademo&appkey=6c87bc97-fc7a-4dfe-80b3-d8c43521cb9c';
        // var d = new Date("11/01/2017");
        // var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        // var today = new Date();

        // var carrier = '';
        // var minStatus = '';
        // var ppeFlag = '';
        // var serviceEndDate = d.toLocaleDateString("en-US", options);
        // // device type = "BYOP"
        // var byopFlag = '';
        // // os = "IOS"
        // var iPhoneFlag = '';
        // // phoneGen contains "LTE"
        // var lteFlag = '';
        // var simStatus = '';
        // // voiceBalance > 0
        // var voiceBalanceFlag = '';
        // var serviceExpiredFlag = (d < today);

        // if (device == 'PPE') {
        //     byopFlag = false;
        //     ppeFlag = true;
        // }
        // else if (device == 'BYOP') {
        //     byopFlag = true;
        //     ppeFlag = false;
        // }
        // else {
        //     byopFlag = false;
        //     ppeFlag = false;
        // }

        var getReportingParams = function () {
            var reportingParams = '';
            var pushData = managers['pushData'];
            var citrixUsername = $W().username;
            var callCenterId = '';
            var agentId = '';
            var callId = '';
            if (pushData) {
                callId = pushData.callInfo.callId;
            }
            if(citrixUsername) {
                if (citrixUsername.length > 6 && parseInt(citrixUsername.charAt(3)) > 0) {
                    callCenterId = citrixUsername.substring(0, 3);
                    agentId = citrixUsername.substring(4);
                } else {
                    agentId = citrixUsername;
                }
            }
            reportingParams += 'TF_CallId=' + callId + '&TF_CallCenterId=' + callCenterId + '&TF_AgentId=' +agentId;
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

            var carrierData = pushData.serviceProfile.carrier.toLowerCase();
            var carrier = 'Not available'
            if (carrierData.indexOf('at&t') > -1 || carrierData.indexOf('cingular') > -1 || carrierData.indexOf('dobson') > -1)
                carrier = 'ATT';
            else if (carrierData.indexOf('tmobile') > -1 || carrierData.indexOf('t-mobile') > -1)
                carrier = 'TMOBILE';
            else if (carrierData.indexOf('verizon') > -1)
                carrier = 'VERIZON';
            else if (carrierData.indexOf('sprint') > -1)
                carrier = 'SPRINT';

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

            unableUnableParams += 'TF_Carrier=' + carrier + '&TF_MINStatus=' + minStatus + '&TF_PPE_Flag=' + ppeFlag + '&TF_ServiceEndDate=' + serviceEndDate + '&TF_BYOP_Flag=' + byopFlag + '&TF_iPhone_Flag=' + iPhoneFlag +
                '&TF_LTE_Flag=' + lteFlag + '&TF_SIMStatus=' + simStatus + '&TF_VoiceBalance_Flag=' + voiceBalanceFlag + '&TF_ServiceExpiredFlag=' + serviceExpiredFlag;
            return unableUnableParams;
        }


        return {
            init: function () {

            },

            getRedemptionUrl: function () {
                return adam.getVariable("redemptionUrl") + '&' + encodeURI(getRedemptionParams()) + '&' + encodeURI(getReportingParams());
            },

            getUnableUnableUrl: function () {
                return adam.getVariable("unableUnableUrl") + '&' + encodeURI(getUnableUnableParams()) + '&' + encodeURI(getRedemptionParams()) + '&' + encodeURI(getReportingParams());
            },
        };
    }
})();

