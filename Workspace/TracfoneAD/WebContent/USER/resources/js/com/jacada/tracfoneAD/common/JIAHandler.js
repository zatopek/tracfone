var LMJIAHandler = (function () {
	var ebo;
	var eboLoggedIn = false;
	var guiLoggedIn = false;
	var newCustomer = true;
	var eboCustomerOpened = false;
	var makeAPaymentCustomerOpened = false;
	var makeAPaymentFirstTime = true;
	var MEMO = {};
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
			Ext.Ajax.request({
				url : contextPath + '/portlets/utils/loginStatus',
				success : function (response) {
					var obj = Ext.decode(response.responseText);
					if (obj && obj.status)
						eboLoggedIn = obj.status.ebo;
				},
				failure : function (e) {
					alert('failure returning login status');
				}
			});

			AppHandler.callFn('registerEvent', ['afterShowTab', function (tabPanel, newCard, oldCard, eOpts) {
						if (newCard.title == 'Collections') {
							if ($W().isProcessRunning('GUITab') && newCustomer) {
								/*LMUATA#133 fix*/
								//this.closeGUI();
							}
						}
						if (newCard.title == 'Billing') {
							if (!eboCustomerOpened && ebo) {
								document.getElementById('EBOTabFrameId').src = $W().location.protocol + '//' + $W().location.host + $W().contextPath + "/USER/resources/lockheed/jsp/webHost.jsp?url=";
							}
						}
						if (newCard.title == 'Service / OMS') {
						//	$W().openPCall();
						}
						if (newCard.title == 'Cust System') {
							if($W().accountFromHomelaunched == false){	
								$W().accountFromHomelaunched = true;
								AppHandler.clickCancelButton = true;
								launchCAS("CASH");
							}
						}
						if (newCard.title == 'Make a Payment') {
							//check for first time
							if(makeAPaymentFirstTime)
							{
								makeAPaymentFirstTime = false;
								makeAPaymentCustomerOpened = true;
								return;
							}
						
							//Check if this is a new customer
							if (!makeAPaymentCustomerOpened) {
								var src = document.getElementById('makePaymentFrameId').src;
								if(src == 'about:blank') return;
								document.getElementById('makePaymentFrameId').src = '';
								document.getElementById('makePaymentFrameId').src = src;
								makeAPaymentCustomerOpened = true;
							}
						}
					}, this]);
			this.callJIA('Register', {
				'url' : $W().location.href
			}, function (response) {
				//Registered with JIA and opened GUI
				//set OMS credentials after registering workspace
				this.saveOmsCredentials();
			});

			AppHandler.callFn('registerEvent', ['unload', function () {
						this.teardown();
					}, this]);
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
		openAccountInEBO : function () {
			if (!MEMO || !MEMO.CUST || !MEMO.CUST.info || !MEMO.CUST.info.accountnumber || eboCustomerOpened)
				return;
			ebo.Navigate(MEMO.EBO.url + '/EBO_init.jsp?FUN=BROWSE_MASTER&TYPE_ACCOUNT=CAS&ID_ACCT_ENTERED=0' + MEMO.CUST.info.accountnumber);
			eboCustomerOpened = true;
		},
		setProperties : function (GUIu, GUIp, EBOu, EBOp, EBOs, OMSu, OMSp) {
			if (!MEMO.GUI)
				MEMO.GUI = {};
			MEMO.GUI.credentials = {
				username : GUIu,
				password : GUIp
			};
			if (!MEMO.EBO)
				MEMO.EBO = {};
			MEMO.EBO.credentials = {
				username : EBOu,
				password : EBOp,
				securityGroup : EBOs
			};
			if(!MEMO.OMS)
				MEMO.OMS = {};
			MEMO.OMS.credentials = {
					username : OMSu,
					password : OMSp
			};
		},
		saveOmsCredentials : function () {
			if(!MEMO || !MEMO.OMS || !MEMO.OMS.credentials || !MEMO.OMS.credentials.username || !MEMO.OMS.credentials.password)return;
			
			this.callJIA('SetOmsCredentials', {
				'username' : MEMO.OMS.credentials.username,
				'password' : MEMO.OMS.credentials.password
			}, function (response) {
			});
		},
		getGuiUsername : function() {
			if(!MEMO || !MEMO.GUI || !MEMO.GUI.credentials || !MEMO.GUI.credentials.username )return '';
			return MEMO.GUI.credentials.username;
		},
		getGuiPassword : function() {
			if(!MEMO || !MEMO.GUI || !MEMO.GUI.credentials || !MEMO.GUI.credentials.password )return '';
			return MEMO.GUI.credentials.password;
		}		
	};
})();
Ext.onReady(function () {
	var u = "/AgentDesktop/portlets/utils/getUserCredentialsInfo";
	Ext.Ajax.request({
		url : u,
		headers : {
			'Content-Type' : 'application/json'
		},
		method : 'POST',
		success : function (response) {
			var decoded = Ext.decode(response.responseText);
			LMJIAHandler.setProperties(decoded.GuiID, decoded.GuiPassword, decoded.EboID, decoded.EboPassword, decoded.SecGrp, decoded.OmsID, decoded.OmsPassword);
			LMJIAHandler.init();
		},
		failure : function (response) {
				LMJIAHandler.init();
			var user = Ext.decode(response.responseText);
		}
	});
});
