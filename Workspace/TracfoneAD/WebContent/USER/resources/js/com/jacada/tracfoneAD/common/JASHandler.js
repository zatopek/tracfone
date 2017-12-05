var JASHandler = (function () {
    var d = new Date("11/01/2017");
    var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    var today = new Date();

    var carrier = '';
    var minStatus = '';
    var ppeFlag = '';
    var serviceEndDate = d.toLocaleDateString("en-US", options);
    // device type = "BYOP"
    var byopFlag = '';
    // os = "IOS"
    var iPhoneFlag = '';
    // phoneGen contains "LTE"
    var lteFlag = '';
    var simStatus = '';
    // voiceBalance > 0
    var voiceBalanceFlag = '';
    var serviceExpiredFlag = (d < today);
    var pinInReserve = 0;
    var pinInReserveFlag = (pinInReserve > 0);

    if(device == 'PPE') {
        byopFlag = false;
        ppeFlag = true;
    }
    else if (device == 'BYOP'){
        byopFlag = true;
        ppeFlag = false;
    }
    else {
        byopFlag = false;
        ppeFlag = false;
    }

    var redemption_url = 'https://gointeract.io/interact/index?interaction=237e6c87c415-d4b64eb5b32cb044-22b8&accountId=azurademo&appkey=6c87bc97-fc7a-4dfe-80b3-d8c43521cb9c';
    var unable_unable_url = 'https://gointeract.io/interact/index?interaction=2471ae2941ee-0cf98cced8706fb9-c170&accountId=azurademo&appkey=6c87bc97-fc7a-4dfe-80b3-d8c43521cb9c';
    var unable_unable_params = 'TF_Carrier=' + carrier + '&TF_MINStatus=' + minStatus + '&TF_PPE_Flag=' + ppeFlag + '&TF_ServiceEndDate=' + serviceEndDate + '&TF_BYOP_Flag=' + byopFlag + '&TF_iPhone_Flag=' + iPhoneFlag +
        '&TF_LTE_Flag=' + lteFlag + '&TF_SIMStatus=' + simStatus + '&TF_VoiceBalance_Flag=' + voiceBalanceFlag + '&TF_ServiceExpiredFlag=' + serviceExpiredFlag;

    var redemption_params = 'TF_PinInReserve_Flag=' + pinInReserveFlag +'&TF_PinInReserve=' + pinInReserve;

    return {
        init : function () {

        },

        getRedemptionUrl: function(){
            return redemption_url + '?' + redemption_params;
        },

        getUnableUnableUrl: function(){
            return unable_unable_url + '?' + unable_unable_params + '&' + redemption_params;
        },
    };
})();