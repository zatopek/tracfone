var JIAHandler = (function () {
	var credentialList;

	return {
		receiveData : function (data) {
		
			if (typeof Commands[data] !== 'undefined' && Commands[data]['ends'] !== '') {
				Status[Commands[data]['ends']]['running'] = false;
			}

			var that = this;
			try {
				if (console && console.log)
					console.log('Received JIA:' + data);
			} catch (e) {}
			if (typeof Commands[data] !== 'undefined' && typeof this[Commands[data]['fn']] === 'function') {
				setTimeout(function () {
					that[Commands[data]['fn']].call(that);
				});
				return;
			}
			return;
		},
		callJIA : function (command, data, success, failure) {
			var that = this;
			Ext.Ajax.request({
				url : 'http://127.0.0.1:9002/Tracfone/' + command,
				headers : {
					'Content-Type' : 'application/json'
				},
				jsonData : data,
				success : function (response) {
					
					var obj = Ext.decode(response.responseText);
					if (typeof success == 'function')
						success.apply(that, [obj]);
				},
				failure : function (e) {
					
					if (typeof failure == 'function')
						failure.apply(that, [e]);
					alert('Failed communication with JIA. Please make sure JIA is running!');
				}
			});
		},
		init : function () {

		},
		teardown : function () {
			this.callJIA('UnRegister', {
				'url' : $W().location.href
			}, function (response) {
				//Registered with JIA
			});
		},
		/**
		 */

		getSystemCredentials : function(system){
            this.credentialList.forEach(function(credential)
            {
            	if(system==credential.system)
				{
					return credential;
				}
                //Ext.getCmp(login.system + '_Id').setValue(login.username);
                //Ext.getCmp(login.system + '_Pass').setValue(login.password);
            })
			return null;
		},
		launchTAS : function() {
			var credential = this.getSystemCredentials('TAS');
            this.callJIA('launchTAS', {
                'userid' : credential.username,
                'password' : credential.password,
                'agentId' : $W().agentName
            }, function (response) {

            }, function (e) {
				//login failed?
            });
		},
        incomingCall : function(url){
            var credential = this.getSystemCredentials('TAS');
            this.callJIA('launchTAS', {
                'url' : url
            }, function (response) {

            }, function (e) {

            });
        },
        getCallInfoFromAIC : function(min){
            this.callJIA('getCallInfoFromAIC', {
                'min' : min
            }, function (response) {
				//TO-DO
				//parse response and update Toolbar
            }, function (e) {

            });
        },
        getServiceProfileAndSecurityAnswersFromTAS : function(min){
            this.callJIA('getServiceProfileAndSecurityAnswersFromTAS', {
                'min' : min
            }, function (response) {
                //TO-DO
                //parse response and update Toolbar
            }, function (e) {

            });
        },
        launchAgentSupportSearch : function(brand, searchTerm){
            this.callJIA('getServiceProfileAndSecurityAnswersFromTAS', {
                'brand' : brand,
				'searchTerm' : searchTerm
            }, function (response) {

            }, function (e) {

            });
        },
        launchCoverageMap : function(carrier, zip){
            this.callJIA('launchCoverageMap', {
                'carrier' : carrier,
                'zip' : zip
            }, function (response) {

            }, function (e) {

            });
        },
        launchAgentSupportFlowChart : function(callType, brand, deviceType){
            this.callJIA('launchAgentSupportFlowChart', {
                'callType' : callType,
                'brand' : brand,
				'deviceType' : deviceType
            }, function (response) {

            }, function (e) {

            });
        },
        launchCarrierBilling : function(carrier){
        	var system;
        	if(carrier=='ATT')
        		system = ''
            else if(carrier=='TMOBILE')
                system = 'TMobileWCSM'
            else if (carrier=='VERIZON')
                system = 'VerizonRSSX'

            var credential = this.getSystemCredentials(system);

        	// no credential found for system not doing anything
        	if(credential == null) {
        		return;
			}

            this.callJIA('launchCarrierBilling', {
                'carrier' : carrier,
                'userId' : credential.username,
                'password' : credential.password
            }, function (response) {

            }, function (e) {
                //login failed?
            });
        },
        addNewInteractionToTAS : function(reason, result, notes){
            this.callJIA('addNewInteractionToTAS', {
                'reason' : reason,
				'result' : result,
				'notes' : notes
            }, function (response) {
                //TO-DO
                //parse response -> message box
            }, function (e) {

            });
        },
        addPinNowInTAS : function(pin){
            this.callJIA('addPinNowInTAS', {
                'pin' : pin
            }, function (response) {
                //TO-DO
                //parse response -> transaction summary
            }, function (e) {
                //TO-DO
                //parse response -> transaction summary
            });
        },
        redeemPinInTAS : function(pin){
            this.callJIA('redeemPinInTAS', {
                'pin' : pin
            }, function (response) {
                //TO-DO
                //parse response -> transaction summary
            }, function (e) {
                //TO-DO
                //parse response -> transaction summary
            });
        },
        getReservePinFromTAS : function(min){
            this.callJIA('getReservePinFromTAS', {
                'min' : min
            }, function (response) {
                //TO-DO
                //parse response -> reserve pin list
            }, function (e) {
                //TO-DO
                //parse response -> msg box
            });
        },
        redeemCardFromReserveInTAS : function(cardPartNumber){
            this.callJIA('redeemCardFromReserveInTAS', {
                'cardPartNumber' : cardPartNumber
            }, function (response) {
                //TO-DO
                //parse response -> transaction summary
            }, function (e) {
                //TO-DO
                //parse response -> msg box
            });
        },
        getPinDesceiptionFromTAS : function(pin){
            this.callJIA('getPinDesceiptionFromTAS', {
                'pin' : pin
            }, function (response) {
                //TO-DO
                //parse response -> pin description
            }, function (e) {
                //TO-DO
                //parse response -> msg box
            });
        },
        getExistingCCFromTAS : function(min){
            this.callJIA('getExistingCCFromTAS', {
                'min' : min
            }, function (response) {
                //TO-DO
                //parse response -> purchase drop down
            }, function (e) {
                //TO-DO
                //parse response -> msg box
            });
        },
        getAvailablePinCardForPurchaseFromTAS : function(min){
            this.callJIA('getAvailablePinCardForPurchaseFromTAS', {
                'min' : min
            }, function (response) {
                //TO-DO
                //parse response -> pin card grid
            }, function (e) {
                //TO-DO
                //parse response -> msg box
            });
        },
        getEstimatedCostFromTAS : function(cardPartNumber){
            this.callJIA('getEstimatedCostFromTAS', {
                'cardPartNumber' : cardPartNumber
            }, function (response) {
                //TO-DO
                //parse response -> extimated cost
            }, function (e) {
                //TO-DO
                //parse response -> msg box
            });
        },
        purchasePinCardFromTAS : function(cardPartNumber, cc){
            this.callJIA('purchasePinCardFromTAS', {
                'cardPartNumber' : cardPartNumber,
                'cc' : cc
            }, function (response) {
                //TO-DO
                //parse response -> transaction summary
            }, function (e) {
                //TO-DO
                //parse response -> transaction summary
            });
        },
        validatePromoCodeInTAS : function(promoCode){
            this.callJIA('validatePromoCodeInTAS', {
                'promoCode' : promoCode
            }, function (response) {
                //TO-DO
                //parse response -> promo code
            }, function (e) {
                //TO-DO
                //parse response -> msg box
            });
        },
        submitNewTicketToTAS : function(ticketType, ticketTitle, priority, status, issue, notes){
            this.callJIA('submitNewTicketToTAS', {
                'ticketType' : ticketType,
				'ticketTitle' : ticketTitle,
				'priority' : priority,
				'status' : status,
				'issue' : issue,
				'notes' : notes
            }, function (response) {
                //TO-DO
                //parse response -> msg box -> reset desktop
            }, function (e) {
                //TO-DO
                //parse response -> msg box
            });
        },
        launchSUIToUAD : function(min){
            this.callJIA('launchSUIToUAD', {
                'min' : min
            }, function (response) {

            }, function (e) {

            });
        }
    };
})();
Ext.onReady(function () {
	Ext.Ajax.request({
        url : $W().contextPath + '/rest/sso/getAgentSsoCredentials/' + $W().agentName,
		method : 'GET',
        success:function(response){
            logins = Ext.decode(response.responseText).result;
            this.credentialList = logins;
            JIAHandler.init();
        },
        failure : function(response) {
            JIAHandler.init();
        }
	});
});
