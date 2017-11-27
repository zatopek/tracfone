var JIAHandler = (function () {
	var ebo;
	var eboLoggedIn = false;
	var guiLoggedIn = false;
	var newCustomer = true;
	var eboCustomerOpened = false;
	var makeAPaymentCustomerOpened = false;
	var makeAPaymentFirstTime = true;
	var credentialList;
	var Commands = {
		'GUI_Closed' : {
			'fn' : 'openGUI',
			'ends' : 'loginGUI'
		},
		'GUI_Open' : {
			'fn' : 'loginGUI',
			'ends' : 'openGUI'
		},
		'Invalid User ID.' : {
			'fn' : 'loginGUI',
			'ends' : 'openGUI'
		},
		'Sign-On Complete' : {
			'fn' : 'setGUISignedIn',
			'ends' : 'loginGUI'
		},
		'FindCustomerWindow_Closed' : {
			'fn' : 'openFindCustomerWindow',
			'ends' : 'searchGUI'
		},
		'FindCustomerWindow_Open' : {
			'fn' : 'searchGUI',
			'ends' : 'openFindCustomerWindow'
		},
		'FindCustomer_Done' : {
			'fn' : 'openAccount',
			'ends' : 'searchGUI'
		},
		'CustomerWindow_Open' : {
			'fn' : '',
			'ends' : 'openAccount'
		},
		'CustomerWindow_Closed' : {
			'fn' : 'openAccount',
			'ends' : 'openCollectionsWindow'
		},
		'CustomerWindow_Already_Closed' : {
			'fn' : 'searchGUI',
			'ends' : 'openCollectionsWindow'
		},
		'CollectionsWindow_Open' : {
			'fn' : '',
			'ends' : 'openCollectionsWindow'
		},
		'CollectionsWindow_Closed' : {
			'fn' : '',
			'ends' : 'createAgreement'
		},
		'CreateAgreementOnAccount_Done' : {
			'fn' : 'resetCreateAgreementTransaction',
			'ends' : 'createAgreement'
		},
		'ClearSearchFlag' : {
			'fn' : '',
			'ends' : 'searchGUI'
		}
	};
	var Status = {
		'openGUI' : {
			'running' : false
		},
		'loginGUI' : {
			'running' : false
		},
		'openFindCustomerWindow' : {
			'running' : false
		},
		'searchGUI' : {
			'running' : false
		},
		'openAccount' : {
			'running' : false
		},
		'openCollectionsWindow' : {
			'running' : false
		},
		'createAgreement' : {
			'running' : false
		}
	};

	//If there is a time out on the EBO site will need to be replicated
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
				url : 'http://127.0.0.1:9002/JIA_Tracfone/' + command,
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
		openGUI : function () {
			if (Status['openGUI']['running'])
				return;
			Status['openGUI']['running'] = true;
			this.callJIA('OpenGUILoginWindow', {
				'dummy' : 'blank'
			}, function (response) {
				//Made the Call wait for response
			}, function (e) {
				Status['openGUI']['running'] = false;
			});
		},
		loginGUI : function () {
			if (Status['loginGUI']['running'])
				return;
			Status['loginGUI']['running'] = true;
			this.callJIA('LoginGUI', {
				'username' : MEMO.GUI.credentials.username, //'A10404',
				'password' : MEMO.GUI.credentials.password //'spring14'
			}, function (response) {
				//Made the Call wait for response
			}, function (e) {
				Status['loginGUI']['running'] = false;
			});
		},
		setGUISignedIn : function () {
			guiLoggedIn = true;
		},
		openFindCustomerWindow : function () {
			if (!MEMO || !MEMO.CUST || !MEMO.CUST.info || !MEMO.CUST.info.accountnumber || !guiLoggedIn || !$W().isProcessRunning('GUITab'))
				return;
			if (Status['openFindCustomerWindow']['running'])
				return;
			Status['openFindCustomerWindow']['running'] = true;
			//Do this only if a searchGUI was called and completed with a FindCustomerWindow_Closed
			this.callJIA('OpenFindCustomerWindow', {
				'dummy' : 'blank'
			}, function (response) {
				//Made the Call wait for response
			}, function (e) {
				Status['openFindCustomerWindow']['running'] = false;
			});
		},
		searchGUI : function () {
			if (!MEMO || !MEMO.CUST || !MEMO.CUST.info || !MEMO.CUST.info.accountnumber || !guiLoggedIn)
				return;

			if (Status['searchGUI']['running'])
				return;
			
			if (!newCustomer)
				return;
					
			Status['searchGUI']['running'] = true;
			
			this.callJIA('FindAccount', {
				'account' : MEMO.CUST.info.accountnumber
			}, function (response) {
				//Made the Call wait for response
				
			}, function (e) {
			
				Status['searchGUI']['running'] = false;
			});
		},
		openAccount : function () {
			if (!MEMO || !MEMO.CUST || !MEMO.CUST.info || !MEMO.CUST.info.accountnumber || !guiLoggedIn)
				return;
			if (Status['openAccount']['running'])
				return;
			Status['openAccount']['running'] = true;
			newCustomer = false;
			this.callJIA('OpenAccount', {
				'account' : MEMO.CUST.info.accountnumber
			}, function (response) {
				//Made the Call wait for response
				Status['openAccount']['running'] = false;
			}, function (e) {
				//Made the Call wait for response
				Status['openAccount']['running'] = false;
			});
		},
		openCollectionsWindow : function () {
			if (!MEMO || !MEMO.CUST || !MEMO.CUST.info || !MEMO.CUST.info.accountnumber || !guiLoggedIn || !$W().isProcessRunning('GUITab'))
				return;
			if (Status['openCollectionsWindow']['running'])
				return;
			Status['openCollectionsWindow']['running'] = true;
			//Do this only if a searchGUI was called and completed with a FindCustomerWindow_Closed
			this.callJIA('OpenCollectionWindow', {
				'dummy' : 'blank'
			}, function (response) {
				//Made the Call wait for response
			}, function (e) {
				Status['openCollectionsWindow']['running'] = false;
			});
		},
		createAgreement : function () {
			
			if (!MEMO || !MEMO.CUST || !MEMO.CUST.info || !MEMO.CUST.info.accountnumber || !guiLoggedIn)
				return;

			
			$W().ShowTabById('GUITab');
				
			if ($W().isProcessRunning('GUITab') && !newCustomer) {
				//Need this here to avoid race condition with newCustomer being set to false in showtab
				Commands['CollectionsWindow_Open']['fn'] = 'createAgreement';
				this.callJIA('CreateAgreementOnAccount', {
					'account' : MEMO.CUST.info.accountnumber
				}, function (response) {
					//Made the Call wait for response
				}, function (e) {
					//Made the Call wait for response
					Commands['CollectionsWindow_Open']['fn'] = '';
				});
			} else {
				Commands['CollectionsWindow_Open']['fn'] = 'createAgreement';
			}
		},
		resetCreateAgreementTransaction : function () {
			
			Status['createAgreement']['running'] = false;
			Commands['CollectionsWindow_Open']['fn'] = '';
			this.openCollectionsWindow();
		},
		closeGUI : function () {
			var that = this;
			this.callJIA('CloseCustomerAccount', {
				'dummy' : 'blank'
			}, function (response) {
			});
		},

		updateCustAcc : function (AccNo) {
			if (!MEMO.CUST)
				MEMO.CUST = {};
			MEMO.CUST.info = {
				accountnumber : AccNo
			}
			newCustomer = true;
			eboCustomerOpened = false;
			makeAPaymentCustomerOpened = false;
		},
		registerEBOFrame : function (frame, url) {
			if (ebo) {
				ebo = frame;
				this.openAccountInEBO();
				return;
			}
			ebo = frame;
			MEMO.EBO.url = url;
			ebo.Navigate($W().location.protocol + '//' + $W().location.host + $W().contextPath + '/USER/resources/lockheed/jsp/eboLogin.jsp?url=' + MEMO.EBO.url + '&username=' + MEMO.EBO.credentials.username + '&password=' + MEMO.EBO.credentials.password+ '&secGroup=566');
			
			/*if (eboLoggedIn) {
				var that = this;
				setTimeout(function () {
					that.openAccountInEBO();
					//document.getElementById('EBOTabFrameId').src = $W().location.protocol + '//' + $W().location.host + $W().contextPath + "/USER/resources/lockheed/jsp/webHost.jsp?url=";
				}, 2);
			}*/
		},

		getGuiUsername : function() {
			if(!MEMO || !MEMO.GUI || !MEMO.GUI.credentials || !MEMO.GUI.credentials.username )return '';
			return MEMO.GUI.credentials.username;
		},
		'' : function() {
			if(!MEMO || !MEMO.GUI || !MEMO.GUI.credentials || !MEMO.GUI.credentials.password )return '';
			return MEMO.GUI.credentials.password;
		},
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
		},
		launchTAS : function() {
			var credential = this.getSystemCredentials('TAS');
            this.callJIA('launchTAS', {
                'userid' : credential.username,
                'password' : credential.password
            }, function (response) {

            }, function (e) {

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
        getCallInfoFromAIC : function(){
            this.callJIA('getCallInfoFromAIC', {
                'dummy' : 'blank'
            }, function (response) {

            }, function (e) {

            });
        },
        getServiceProfileAndSecurityAnswersFromTAS : function(){
            this.callJIA('getServiceProfileAndSecurityAnswersFromTAS', {
                'dummy' : 'blank'
            }, function (response) {

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
        launchAgentSupportFlowChart : function(useCase, brand, deviceType){
            this.callJIA('launchCoverageMap', {
                'userCase' : useCase,
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

            this.callJIA('launchCoverageMap', {
                'carrier' : carrier,
                'userId' : credential.username,
                'password' : credential.password
            }, function (response) {

            }, function (e) {

            });
        },
        addNewInteractionToTAS : function(useCase, brand, deviceType){
            this.callJIA('launchCoverageMap', {
                'userCase' : useCase,
                'brand' : brand,
                'deviceType' : deviceType
            }, function (response) {

            }, function (e) {

            });
        },
        addPinNowInTAS : function(useCase, brand, deviceType){
            this.callJIA('launchCoverageMap', {
                'userCase' : useCase,
                'brand' : brand,
                'deviceType' : deviceType
            }, function (response) {

            }, function (e) {

            });
        },
    };
})();
Ext.onReady(function () {
	Ext.Ajax.request({
        url : $W().contextPath + '/rest/sso/getAgentSsoCredentials/' + $W().agentName,
		method : 'GET',
        success:function(response){
            logins = Ext.decode(response.responseText).payload;
            this.credentialList = logins;
            JIAHandler.init();
        },
        failure : function(response) {
            JIAHandler.init();
        }
	});
});
