Ext.define('Jacada.user.ui.cti.VoiceActionBar', {
    extend: 'Ext.panel.Panel',
    
    itemId: 'voiceActionBar',
    height: '100%',
	border: false,
	layout: {
		type: 'hbox',
		align: 'middle'
	},
	defaults:{
		margin: '0 0 0 0',
		padding: 0
	},
	
	initComponent: function(){
		var me = this;
		var items = [];
		
		items.push(me.getStartBtn());
		items.push(me.getEndBtn());
		if(!$W().LayoutByContext){
			items.push(me.getEndOpenMediaBtn());
			items.push(me.getEndPopupBtn());
		}
		items.push(me.getHoldBtn());
		items.push(me.getTransferBtn());
		items.push(me.getWarmTransferToggleToSuperBtn());
		items.push(me.getCompleteTransferButton());
		items.push(me.getConsultBtn());
		items.push(me.getConsultToggleToSuperBtn());
		items.push(me.getJoinBtn());
		items.push(me.getSendDTMFBtn());
		items.push(me.getCloseContextBtn());
		//Ready and Busy button are created at main level
		
        items = items.compact();
        Ext.applyIf(me, {
        	items: items
        });
        me.callParent(arguments);
	},
	
	getStartBtn: function(){
		return $W().cti.createCTIButton('start', $W().cti.getButtonText('startWithShort'),
				$W().UserCTIRoles.CTIBasicUser,
				function(){
					var dn = Ext.getCmp('ctiDialNumberField').getValue();
					if(dn && dn.trim().length > 0){
						$W().cti._onCTIButtonClicked('start', dn);
					}else{
						$W().HideCurrentVisibleTab();
						Ext.Msg.show({
							title: $W().localeManager.getLocalizationValue('application.javascript.ctiButtonsBar.alert.selectNumber.title'),
							msg: $W().localeManager.getLocalizationValue('application.javascript.ctiButtonsBar.alert.selectNumber.message'),
							buttons: Ext.MessageBox.OK,
							icon: Ext.Msg.ALERT,
							modal: true,
							fn: function(buttonId, text, opt){
								$W().ShowCurrentVisibleTab();
							}
						});
					}
				}
		);
	},
	getEndBtn: function(){
		return $W().cti.createCTIButton('end', $W().cti.getButtonText('endCallWithShort'),
				$W().UserCTIRoles.CTIBasicUser,
				function(){
					$W().cti._onCTIButtonClicked('end');
				}
		);
	},
	//Used only when LayoutByContext is false
	getEndOpenMediaBtn: function(){
		return $W().cti.createCTIButton('endOpenMedia', $W().cti.getButtonText('endItemWithShort'),
				$W().UserCTIRoles.CTIEndUser,
				function(){
					$W().cti._onCTIButtonClicked('endOpenMedia');
				}
		);
	},
	//Used only when LayoutByContext is false	
	getEndPopupBtn: function(){
		var endPopupBtn = $W().cti.createCTIButton('endPopup', $W().cti.getButtonText('endCallWithShort'),
				$W().UserCTIRoles.CTIBasicUser,
				function(){
					$W().cti._onCTIButtonClicked('end');
				}
		);
		endPopupBtn.xtype = 'splitbutton';
		endPopupBtn.menu = [
		    {
				id: 'endEndMenuBtn',
				itemId: 'endEndMenuBtn',
				iconCls: 'endEndMenuBtnIcon',
				text: $W().cti.getButtonText('endCallWithShort'),
				handler: function(transferType){
					$W().cti._onCTIButtonClicked('end');
				}
		    },
		    {
				id: 'endOpenMediaMenuBtn',
				itemId: 'endOpenMediaMenuBtn',
				iconCls: 'endOpenMediaMenuBtnIcon',
				text: $W().cti.getButtonText('endItemWithShort'),
				handler: function(transferType){
					$W().cti._onCTIButtonClicked('endOpenMedia');
				}
		    }
		];
		return endPopupBtn;
	},
	getHoldBtn: function(){
		var holdBtnConfig = $W().cti.createCTIButton('hold', $W().cti.getButtonText('holdWithShort'),
				$W().UserCTIRoles.CTIHoldUser, function(thisBtn){
			Jacada.Logger.debug("Hold button clicked: pressed? " + thisBtn.pressed);
			if(thisBtn.pressed){
				$W().cti._onCTIButtonClicked('hold');
			}else{
				$W().cti._onCTIButtonClicked('holdOff');
			}
			//After a few times of moving between hold and holdOff, button receives focus
			//and it looks similar to pressed state.
			//Thus, moving focus to the viewport (top parent).
			var topParent = thisBtn.findParentByType('viewport');
			if(topParent){
				topParent.focus();
			}
		});
		holdBtnConfig.enableToggle = true;
		return holdBtnConfig;
	},
	getTransferBtn: function(){
		var transferBtnConfig = $W().cti.createCTIButton('transfer', $W().cti.getButtonText('transfer'),
				$W().UserCTIRoles.CTITransferUser, 
				function(this_){
					Jacada.Logger.debug("Launching default transfer " + this_.transferDefaultType);
				    $W().cti.cleanError();
				    $W().cti.openDialList('transferStandard');
				}
		);
		transferBtnConfig.transferDefaultType = $W().ctiSettings.transferDefaultType;
		
		//If we have both types of transfers, each of them have to have separate sub menu
		var standardTranfers = null;
		var connectTranfers = null;
		if($W().ctiSettings.transferTypesList){
			Jacada.Logger.debug("Got transfer type list. size: " + $W().ctiSettings.transferTypesList.size());
			standardTranfers = new Array();
			connectTranfers = new Array();
			if($W().ctiSettings.transferTypesList.size() > 1){
				$W().ctiSettings.transferTypesList.each(function(transferType){
					Jacada.Logger.debug("Adding transfer type: " + transferType);
					standardTranfers.push({
						id: transferType + 'TransferStandard',
						itemId: transferType + 'TransferStandard',
						iconCls: transferType + 'TransferBtnIcon',
						text: $W().cti.getButtonText(transferType),
						handler: function(transferType){
							Jacada.Logger.debug("Launching transfer " + transferType.id);
							$W().cti.openDialList(transferType.id);
						}
					});
					//No cold transfer in TransferConnect
					if(transferType != 'cold'){
						connectTranfers.push({
							id: transferType + 'TransferConnect',
							itemId: transferType + 'TransferConnect',
							iconCls: transferType + 'TransferBtnIcon',
							text: $W().cti.getButtonText(transferType),
							handler: function(transferType){
								Jacada.Logger.debug("Launching transfer " + transferType.id);
								$W().cti.openDialList(transferType.id);
							}
						});
					}
				});
			}
		}
		var transferMenu;
		//If Transfer Connect allowed, clearing handler and building another menu
	    if($W().UserCTIRoles.CTITransferConnectAllowed) {
	    	transferBtnConfig.handler = null;
	    	transferMenu = Ext.create('Ext.menu.Menu', {
	    		items: [{
		    		id: 'transferStandardBtn',
		    		itemId: 'transferStandardBtn',
		    		iconCls: 'transferStandardBtnIcon',
		    		text: $W().cti.getButtonText('transferStandard'),
		    		menu: standardTranfers
		    	},
		    	{
		    		id: 'transferConnectBtn',
		    		itemId: 'transferConnectBtn',
		    		iconCls: 'transferConnectBtnIcon',
		    		text: $W().cti.getButtonText('transferConnect'),
		    		menu: connectTranfers
		    	}]
	    	});
	    }else{
	    	//No transfer connect, standard transfer will represent sub menu
			transferBtnConfig.xtype = 'splitbutton'; //separate events for btn click and opening menu
			transferMenu = Ext.create('Ext.menu.Menu', {
				items: standardTranfers
			});
	    }
	    transferMenu.on('show', function(){
			$W().HideCurrentVisibleTab();
		});
	    transferMenu.on('hide', function(){
			$W().ShowCurrentVisibleTab();
		});
	    transferBtnConfig.menu = transferMenu;

		return transferBtnConfig;
	},
	getWarmTransferToggleToSuperBtn: function(){
		return $W().cti.createCTIButton('warmTransferToggleToSuper', $W().cti.getButtonText('toggleToSuper'),
				$W().UserCTIRoles.CTIConsultUser,
				function(){
				    $W().cti._doOperationWithDn('toggleToSuper');
				}
		);
	},
	getCompleteTransferButton: function(){
		var completeTransferBtnConfig = $W().cti.createCTIButton('completeTransfer', $W().cti.getButtonText('completeTransfer'),
				$W().UserCTIRoles.CTITransferUser, 
				function(){
			$W().cti.doCompleteTransferAction('completeTransfer');
				}
		);
		completeTransferBtnConfig.xtype = 'splitbutton';
		
		var menuItems = new Array();
		menuItems.push({
			id: 'transferCompleteBtn',
			itemId: 'transferCompleteBtn',
			text: $W().cti.getButtonText('completeTransfer'),
			iconCls: 'completeBtnIcon',
			handler: function(){
				$W().cti.doCompleteTransferAction('completeTransfer');
			}
		});
		menuItems.push({
			id: 'transferReturnBtn',
			itemId: 'transferReturnBtn',
			text: $W().cti.getButtonText('return'),
			iconCls: 'returnBtnIcon',
			handler: function(){
				$W().cti.doCompleteTransferAction('returnCall');
			}
		});
		
		if($W().ctiSettings.softReturnEnabled){
			//Need to add another button
			menuItems.push({
				id: 'warmTransferToggleToCustomerBtn',
				itemId: 'warmTransferToggleToCustomerBtn',
				iconCls: 'softReturnBtnIcon',
				text: $W().cti.getButtonText('toggleToCustomer'),
				handler: function(){
					$W().cti.doCompleteTransferAction('toggleToCustomer');
				}
			});
		}
		var completeTransferMenu = Ext.create('Ext.menu.Menu', {
			items: menuItems
		});
		completeTransferMenu.on('show', function(){
			$W().HideCurrentVisibleTab();
		});
		completeTransferMenu.on('hide', function(){
			$W().ShowCurrentVisibleTab();
		});
		completeTransferBtnConfig.menu = completeTransferMenu;
		
		return completeTransferBtnConfig;
	},
	getConsultBtn: function(){
		return $W().cti.createCTIButton('consult', $W().cti.getButtonText('confWithShort'),
				$W().UserCTIRoles.CTIConsultUser,
				function(){
				    $W().cti.cleanError();
				    $W().cti.openDialList('consult');
				}
		);
	},
	getConsultToggleToSuperBtn: function(){
		return $W().cti.createCTIButton('consultToggleToSuper', $W().cti.getButtonText('toggleToSuper'),
				$W().UserCTIRoles.CTIConsultUser,
				function(){
				    $W().cti._doOperationWithDn('toggleToSuper');
				}
		);
	},
	getJoinBtn: function(){
		var joinBtnConfig = $W().cti.createCTIButton('join', $W().cti.getButtonText('joinWithShort'),
				$W().UserCTIRoles.CTIConsultUser,
				function(){
					$W().cti.doConferenceAction('joinCall');
				}
		);
		joinBtnConfig.xtype = 'splitbutton';
		
		var menuItems = new Array();
		menuItems.push({
			id: 'consultJoinBtn',
			itemId: 'consultJoinBtn',
			iconCls: 'consultJoinBtnIcon',
			text: $W().cti.getButtonText('join'),
			handler: function(){
				$W().cti.doConferenceAction('joinCall');
			}
		});
		menuItems.push({
			id: 'consultReturnBtn',
			itemId: 'consultReturnBtn',
			iconCls: 'returnBtnIcon',
			text: $W().cti.getButtonText('return'),
			handler: function(){
				$W().cti.doConferenceAction('returnCall');
			}
		});
		
		if($W().ctiSettings.softReturnEnabled){
			//Need to add another button
			menuItems.push({
				id: 'consultToggleToCustomerBtn',
				itemId: 'consultToggleToCustomerBtn',
				iconCls: 'softReturnBtnIcon',
				text: $W().cti.getButtonText('toggleToCustomer'),
				handler: function(){
					$W().cti.doConferenceAction('toggleToCustomer');
				}
			});
		}
		
		if($W().ctiSettings.transferAllowedFromConsult){
			//Need to add another button
			menuItems.push({
				id: 'consultTransferBtn',
				itemId: 'consultTransferBtn',
				iconCls: 'consultTransferBtnIcon',
				text: $W().cti.getButtonText('transfer'),
				handler: function(){
					$W().cti.doConferenceAction('transferCallFromConsult');
				}
			});
		}
		var joinMenu = Ext.create('Ext.menu.Menu', {
			items: menuItems
		});
	    joinMenu.on('show', function(){
			$W().HideCurrentVisibleTab();
		});
	    joinMenu.on('hide', function(){
			$W().ShowCurrentVisibleTab();
		});

		joinBtnConfig.menu = joinMenu;
		return joinBtnConfig;
	},
	getSendDTMFBtn: function(){
		if($W().ctiSettings.sendDTMFEnabled){
			return $W().cti.createCTIButton('sendDTMF', $W().cti.getButtonText('sendDTMFWithShort'),
					$W().UserCTIRoles.CTIBusyReadyUser,
					function(){
						$W().cti.onShowDialPadWindow('sendDTMF');
					}
			);
		}
		
		return null;
	},
	getCloseContextBtn: function(){
		return $W().cti.createCTIButton('closeContext', $W().cti.getButtonText('closeContext'),
				$W().UserCTIRoles.CTIBasicUser,
				function(){
					if(!$W().LayoutByContext){
						if($W().cti.stateName.indexOf('disposition') > -1){//disposition state
							$W().cti.endDisposition();
						}
						return;
					}
					
					if($W().activeContext.groupId.indexOf($W().interactionType.General) > -1){
						if(!($W().cti.stateName.indexOf('disposition') > -1)){
							Jacada.Logger.error("Trying to close context with interaction type different then voice.");
							return;
						}else{
							$W().cti.endDisposition();
							return;
						}
					}
					
					var contextNavigation = Ext.getCmp('contextNavigation');
	    	    	var voiceNode = contextNavigation.findNode($W().activeContext.groupId);
	    	    	if(!voiceNode){
	    	    		Jacada.Logger.debug("Voice Node not found for groupId: " + $W().activeContext.groupId + ", could be internal call");
	    	    	}else{
		    	    	var removeVoiceValues = {
		    	    		groupId: voiceNode.data.itemId, //this is actually the groupId
		    	    		callId: voiceNode.callId
		    	    	};
						
						contextNavigation.removeVoiceContextGroupNode(removeVoiceValues);
	    	    	}

	    	    	
					if($W().cti.stateName.indexOf('disposition') > -1 && (!voiceNode || !voiceNode.fromHistory)){//disposition state
						$W().cti.endDisposition();
					}else{//show latest state after closing a non call context
						var state = null;
						if($W().cti.ctiClientInfo.clientStateName == 'current'){
							state = $W().cti.states[$W().cti.prevStateNameNotCurrent];
						}else{
							state = $W().cti.states[$W().cti.ctiClientInfo.clientStateName];
						}
						
						$W().cti.processVoiceState(state, $W().cti.ctiClientInfo)							
					}
					
			    	if($W().cti.isEMCCTIProvider()){
			    		if(!voiceNode || !voiceNode.media){
			    			Jacada.Logger.error("No Node or media data found for voiceNode with groupId: " + $W().activeContext.groupId);
			    		}else{
			    	    	$W().cti._onMediaButtonClicked("completeVoice", voiceNode.media.interactionId,
                            								'voice', {completionStatus:$W().mediaCompletionStatus.Successful});
			    		}
			    	}
					
					
				}
		);
	}
});