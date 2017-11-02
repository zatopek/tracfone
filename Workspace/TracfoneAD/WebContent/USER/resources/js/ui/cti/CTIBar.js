Ext.define('Jacada.user.ui.cti.CTIBar', {
	    extend: 'Ext.panel.Panel',
	    
	    VOICE_CONTEXT_MENU_ITEM: 'voiceContextMenuItem',
	    WORK_ITEM_CONTEXT_MENU_ITEM: 'workItemContextMenuItem',
	    TASKS_CONTEXT_MENU_ITEM: 'tasksContextMenuItem',
	    
	    TRANSFER_STANDARD: 'Standard',
	    TRANSFER_CONNECT: 'Connect',
	    layout: {type: 'hbox', align: 'stretch'},
	    flex: 1,
	    id: 'ctiBar',
	    border:false,
		defaults:{
			height: '100%',
			margin: '2 2 0 2',
			bodyStyle : 'background:none; ', // Removes the default white background
			border: false
		},
		dockedItems: [Ext.create('Jacada.core.WorkSpaceMenuToolbar', {
			region: 'north',
			id: 'workspace-menu',
        	split: false,
        	padding: 0,
        	marging: 0,
        	cls: 'top-bar-menu',
        	border: false,
        	layout: {type: 'hbox'}
		})],

		agentStatusCls: 'cti-agent-status-label-busy',
		errorField: null,
		callIds: {},
		
	    initComponent: function() {
	        var me = this;
	        //me.registerForMessages();
	        $W().cti = this;
	        var items = [];
	        //items.push(me.getSeparator());
	        //items.push(me.buildCustomSection());
	        //items.push(me.buildSearchButton());
	        //items.push(me.getSeparator());
	        //me.initDialList();
	        //items.push(me.buildDialPanel());
	        //items.push(me.getSeparator());
	        //items.push(me.buildAgentStatusPanel());
	        //items.push({xtype: 'tbfill'});
	        //items.push(me.buildNotificationsBar());
	        //items.push(me.getSeparator());
	        //items.push(me.buildActionsBar());
	        //items.push(me.getSeparator());
	        ///items.push(me.buildContextButton());
	        //items = items.compact();
	        
	        Ext.applyIf(me, {
	        	items: items
	        });
	        me.callParent(arguments);

	        Jacada.Logger.debug("CTIBar. Initializing CTI States");
	        //me.initCtiStates();
	        //var ctiClientInfo = {clientStateName:'not_initialized', bBusy: true};
	        //me.showState(ctiClientInfo);
	        
	        //me.syncUIMessages();
	        
	    },
	    getSeparator: function(){
	    	return {xtype: 'tbseparator', cls: 'cti-tbseparator'};
	    },
	    initCtiStates: function(){
	    	this.states = Ext.create('Jacada.user.ui.cti.CTIStates');
	    },
	    registerForMessages: function(){
	    	$W().Push.registerEventHandler('updateMediaClient', this.processMediaState.bind(this));
	    	$W().Push.registerEventHandler('mediaCallDropped', this.mediaCallDropped.bind(this));
	    	$W().Push.registerEventHandler('customerCallDropped', this.customerCallDropped.bind(this));
	     	$W().Push.registerEventHandler('answerMediaBlocked', this.answerMediaBlocked.bind(this));
	    	//to allow state machine to save timers
	        $W().Push.registerEventHandler('saveTimers', this.saveTimers.bind(this));  
	        $W().Push.registerEventHandler('callDispositionEnded', this.onDispositionScriptEnded.bind(this)); 
	        //clean error field
	        $W().Push.registerEventHandler('cleanCTIError', this.cleanError.bind(this));

	        // Push handlers for the scriptAPI
	        /***********************************************************************/        
	       // push handlers for CTI activation from script code     
	       //most of the handlers already have specific button to bind to, if not a function is used
	        $W().Push.registerEventHandler( 'activate_setAgentStatus', this._onPushSetAgentStatus.bind(this));
	        $W().Push.registerEventHandler( 'activate_consultation',   this._onCTIButtonClicked.bind(this,'consult'));
	        $W().Push.registerEventHandler( 'activate_dial',           this._onCTIButtonClicked.bind(this,'dial'));
	        $W().Push.registerEventHandler( 'activate_answer',         this.notificationButtonHandler.bind(this, 'answerBtn'));
	        $W().Push.registerEventHandler( 'activate_disconnect',     this._onCTIButtonClicked.bind(this,'end'));
	        $W().Push.registerEventHandler( 'activate_hold',           this._onCTIButtonClicked.bind(this,'hold'));
	        $W().Push.registerEventHandler( 'activate_holdOff',        this._onCTIButtonClicked.bind(this,'holdOff'));
	        $W().Push.registerEventHandler( 'activate_acceptCustomItem',         this.notificationButtonHandler.bind(this, 'answerOpenMediaBtn'));
	        $W().Push.registerEventHandler( 'activate_releaseCustomItem',         this._onCTIButtonClicked.bind(this,'endOpenMedia'));
	        $W().Push.registerEventHandler( 'activate_joinConference', this.doConferenceAction.bind(this,'joinCall'));
	        $W().Push.registerEventHandler( 'activate_transferFromConsultation', this.doConferenceAction.bind(this,'transferCallFromConsult'));
	        $W().Push.registerEventHandler( 'activate_returnFromConsultation', this.doConferenceAction.bind(this,'returnCall'));
	        $W().Push.registerEventHandler( 'activate_returnFromWarmTransfer', this.doCompleteTransferAction.bind(this,'returnCall'));
	        $W().Push.registerEventHandler( 'activate_completeWarmTransfer', this.doCompleteTransferAction.bind(this,'completeTransfer'));
	        $W().Push.registerEventHandler( 'activate_logout',          this.doLogout.bind(this));
	        $W().Push.registerEventHandler( 'activate_transfer',       this._doOperationWithDn.bind(this,'transfer'));
	        $W().Push.registerEventHandler( 'activate_coldTransfer',   this._onPushColdTransfer.bind(this));
	        $W().Push.registerEventHandler( 'activate_warmTransfer',   this._onPushWarmTransfer.bind(this));
	        $W().Push.registerEventHandler( 'activate_handshakeTransfer',   this._onPushHandshakeTransfer.bind(this));
	        //for transfer connect
	        $W().Push.registerEventHandler( 'activate_warmTransferConnect',   this._onPushWarmTransferConnect.bind(this));
	        $W().Push.registerEventHandler( 'activate_handshakeTransferConnect',   this._onPushHandshakeTransferConnect.bind(this));
	    
	    },
	    syncUIMessages: function(){
	    	var messages = $W().accumulatedCTIMessages;
	    	$W().accumulatedCTIMessages = null;
	    	var me = this;
	    	messages.each(function(ctiClientInfo){
	    		me.showState(ctiClientInfo);
	    	});
	    },
	    initDialList: function(){
		    if($W().UserCTIRoles.CTIDialList){
		  		if(this.isEMCCTIProvider()){
				  	$W().dialListWindow = Ext.create('Ext.window.Window', {
		     	           title: Ext.String.format($W().localeManager.getLocalizationValue('application.javascript.directory.dialList.title')),
		     	           id: 'ctiDialListWidnow',
		     	           closeAction: 'hide',
		     	           height: 500,
		     	           minHeight: 500,
		     	           width: 500,
		     	           minWidth: 500,
		     	           modal: true,
		     	           constrain: true,
		     	           layout: 'fit',
		     	           DialList_JSON_URL: $W().CONTEXT_PATH + '/dialList.json',
	     	        	   items: Ext.create('Jacada.user.ui.cti.DirectoryDialListPanel'),
	     	        	   listeners:{
				    			show: function(){
				    				$W().HideCurrentVisibleTab();
				    			},
				    			hide: function(){
				    				$W().ShowCurrentVisibleTab();
				    			}
				    		},
		     	           openDialList: function(transferImpl, action){
		     	        	   $W().dialListWindow = this;
		     	        	   this.getComponent('directoryDialListPanel').loadRecentlyDialed(transferImpl, action);
		     	        	   this.show();
		     	           }
		     	       });
		  		}else{
			  	   	$W().dialListWindow = Ext.create('Jacada.user.ui.cti.DialList');
		  	   	}
		    }else{
		    		$W().dialListWindow = null;
		    }
	    },
	    buildCustomSection: function(){
	    	return Ext.create('Jacada.user.ui.cti.SectionPanel', {
	    		sectionName: $W().localeManager.getLocalizationValue('application.javascript.cti.section.info'),
	    		flex: 1,
	    		items: [{
    		    	xtype: 'panel',
    		    	layout: 'hbox',
    		    	minHeight: 55,
    		    	border: false,
    		    	width: '100%',
		    		defaults: {			
		    			bodyStyle: 'background:none' // Removes the default white background
		    		},
		    		flex: 1,
		    		items: [
						{
							itemId: 'customSection',
							xtype: 'panel',
							border: false,
							defaults: {			
								bodyStyle: 'background:none' // Removes the default white background
							},
							margin: '0 5 0 5'
						}
						
					]
	    		}]
	    	});
	    },
	    buildSearchButton: function(){
	    	return {
					xtype: 'button',
					ui: 'default-toolbar',//give it a toolbar button style
					iconAlign: 'top',
					scale: 'medium',
					cls: 'cti-btn',
					disabled: true,
					tooltip: $W().localeManager.getLocalizationValue('application.javascript.directorySearch.button.label'),
					iconCls: 'directorySearchBtnIcon',
					itemId: 'directorySearchBtn',
					id: 'directorySearchBtn',
					listeners: {
						afterRender: function(){
							try{
								$W().directorySearchWindow = Ext.create('Jacada.user.ui.directorySearch.DirectorySearchWindow');
							}catch(ex){
								Jacada.Logger.error(ex);
							}
						}
					},
					handler: function(){
						if($W().directorySearchWindow){
							$W().directorySearchWindow.show();
						}
					}
				};
	    },
	    buildAgentStatusPanel: function(){
	    	var me = this;
	    	//status label         | buttons
	    	//aux busy reason code |
	    	var panel = {
	    		xtype: 'panel',
    			border: false,
	    		defaults: {
	    			// applied to each contained panel
	    			border: false,
	    			margin: '2',
	    			bodyStyle : 'background:none;' // Removes the default white background
	    		},
	    		items: [
		    		me.buildResyncBtn(),
    		        {
    		        	xtype: 'tbtext',
    		        	id: 'ctiConstMsgField',
    		        	itemId: 'ctiConstMsgField',
    		        	cls: 'cti-disconnect-msg',
    		        	text: ''
    		        },
		    	    me.buildReadyBtn(),
		    		me.buildBusyBtn(),
	    			{
	    				id: 'auxReason',
	    				itemId: 'auxReason',
	    				width: 120,
	    				cls: 'cti-busy-reasons',
	    				xtype: 'tbtext'
	    			}
	    		]
	    	};

	    	
	    	return Ext.create('Jacada.user.ui.cti.SectionPanel', {
	    		sectionName: $W().localeManager.getLocalizationValue('application.javascript.cti.section.status'),
	    		items:[
	    			panel
	    		]
	    	});
	    	
	    },
	    buildDialPanel: function(){
	    	var dialer = {
	    		///call text field
	    		width: 200,
	    		border: false,
	    		xtype: 'panel',
	    		enableKeyEvents: true, //Need this for "Enter"
	    		layout: {
					type: 'vbox',
					align:'stretch'
	    		},
	    		defaults: {
	    			// applied to each contained panel
	    			border: false,
	    			bodyStyle : 'background:none;' // Removes the default white background
	    		},
	    		items: [
	    		    {
	    		    	xtype: 'panel',
	    		    	layout: 'hbox',
			    		defaults: {
			    			// applied to each contained panel
			    			border: false,
			    			bodyStyle : 'background:none;' // Removes the default white background
			    		},
			    		items: [
			    		    {
			    		    	xtype: 'panel',
			    		    	flex: 1,
			    		    	layout: {
			    		    		type: 'vbox',
			    		    		align: 'stretch'
			    		    	},
			    		    	id: 'verticalcomboboxHolder',
			    		    	width: 125,
					    		defaults: {
					    			// applied to each contained panel
					    			border: false,
					    			margin: '2',
					    			bodyStyle : 'background:none;' // Removes the default white background
					    		},
			    		    	items: [
			    		    		    this.getDialFieldCombo()
			    			    ]
			    		    },
	    		    	    {
	    		    	    	xtype: 'panel',
	    		    	    	layout: 'hbox',
	    		    	    	margin: '0 0 0 2',
	    			    		defaults: {
	    			    			// applied to each contained panel
	    			    			border: false,
	    			    			margin: '2 2 0 2',
	    			    			bodyStyle : 'background:none;' // Removes the default white background
	    			    		},
	    		    	    	items: [
    		    		            {			  
    		    		            	xtype: 'button',
    		    		            	id: 'dialBtn',
    		    		            	scale: 'medium',
    		    		            	cls: 'dialBtnIcon',
    		    		            	ui: 'default-toolbar',//give it a toolbar button style
    		    		            	tooltip: $W().localeManager.getLocalizationValue('application.javascript.ctiButtonsBar.label.dialWithShort'),
    		    		            	handler: function(){
    		    		            		$W().cti.dialBtnClicked();
    		    		            	}
    		    		            },
    		    	    			{			  
    		    	    				xtype: 'button',
    		    	    				scale: 'medium',
    		    	    				id: 'addressBookBtn',
    		    	    				cls: 'addressBookBtnIcon',
    		    	    				hidden: !$W().cti.isDialListEnabled($W().cti.TRANSFER_STANDARD),
    		    	    				ui: 'default-toolbar',//give it a toolbar button style
    		    	    				tooltip: $W().localeManager.getLocalizationValue('application.javascript.portlet.label.dialList'),
    		    	    				handler: function(){
    		    		            		if(!$W().cti.isManualMode()){
    		    		            			$W().cti.openDialList('dial');
    		    		            		}
    		    	    				}
    		    	    			}
	    		    	    	]
	    		    	    }
			    		]
	    		    },
	    		    {
	    	        	xtype: 'tbtext',
	    	        	id: 'ctiErrorMsgField',
	    	        	itemId: 'ctiErrorMsgField',
	    	        	//width: 300,
	    	        	cls: 'cti-error-status',
	    	        	text: ''
	    		    }
	    		]
    		};
    		
    		return Ext.create('Jacada.user.ui.cti.SectionPanel', {
	    		sectionName: $W().localeManager.getLocalizationValue('application.javascript.cti.section.dialer'),
	    		items: dialer
	    	});
    		
    		
	    },
	    getDialFieldCombo: function(){
	    	var numbersStore = null;
	    	var dialListStore = false;
	    	//numbersStore will be initialized if 
	    	//MANUAL mode: we at least one RTN number
	    	//CTI mode: dial list is enabled and has at least one number
	    	if($W().ctiSettings.ctiProvider.indexOf('MANUAL') != -1){
	    		Jacada.Logger.debug("CTIBar. MANUAL. Creating RTN combobox with " + $W().ctiSettings.rtnNumbers);
	    		if($W().ctiSettings.rtnNumbers && $W().ctiSettings.rtnNumbers.size() > 0){
		    		numbersStore = Ext.create('Ext.data.ArrayStore', {
		    			storeId: 'dialingNumbersStoreRTN',
		    			fields: ['number'],
		    			data: $W().ctiSettings.rtnNumbers,
		    			proxy: {
		    				type: 'memory',
		    				reader: {
		    					type: 'array'
		    				}
		    			}
		    		});
	    		}
	    	}else if($W().UserCTIRoles.CTIDialList){
	    		//CTI mode and dial list enabled
	    		numbersStore = Ext.create('Ext.data.JsonStore', {
	    			storeId: 'dialingNumbersStoreDL',
		    		fields: [
		    		    {name: 'number'},
		    		    {name: 'name'}
		    		],
		    		sorters: [{
		    			property: 'number',
		    			direction: 'ASC'
		    		}],
		    		proxy: {
		    			type: 'ajax',
		    			url: $W().CONTEXT_PATH + '/dialList.json',
		    			reader: {
		    				root: 'results',
		    				totalProperty: 'totalCount'
		    			}
		    		}
		    	});
	    		numbersStore.on('datachange', function(thisStore){
	    			Jacada.Logger.debug("CTIBar. CTI Mode. Got " + thisStore.getCount() + " dialing numbers");
	    		});
	    		dialListStore = true;
	    		numbersStore.load({params:{method:'getDialingNumbers', transferImpl: this.TRANSFER_STANDARD}});
	    	}
	    	var config = {
    			id: 'ctiDialNumberField',
    			itemId: 'ctiDialNumberField',
    			//width: 110,
    			listeners: {
    				specialkey: function(field, eObj){
    					if(eObj.getKey() == eObj.ENTER){
    						if($W().cti.isManualMode()){
    							Jacada.Logger.debug("ENTER pressed. MANUAL. field value: " + field.getValue());
    							//dial the number if not empty
    							var number = field.getValue();
    							if(number && number.trim() != ''){
    								$W().cti._onCTIButtonClicked('start', field.getValue());
    							}
    						}else{
    							Jacada.Logger.debug("ENTER pressed. CTI. field value: " + field.getValue());
    				    		var number = field.getValue();
    				    		//dial if not empty
				    			if(number && number.trim() != ''){
				    				$W().cti.dialPadWindowActionSource = 'dial';
				    				$W().cti.cleanError();
				    				$W().cti.dialFromDialPadWindow(number.trim());
				    			}
    						}
    					}
    				}
    			}
	    	};
	    	//if numbersStore is not created, regular text field will be used
	    	if(numbersStore == null){
		    	config.xtype = 'textfield';
	    	}else{
	    		config.xtype = 'combobox';
	    		config.store = numbersStore;
	    		config.displayField = 'number';
	    		config.valueField = 'number';
	    		config.queryMode = 'local';
	    		//if store from dial list, its different presentation
	    		if(dialListStore){
		    		config.listConfig = {
		    	        getInnerTpl: function() {
		    	            return '{number} - {name}';
		    	        }
		    	    };
	    		}
	    	}
            return config;
	    },
	    updateDialingNumbers: function(){
	    	if(!this.isManualMode()){
	    		var store = Ext.data.StoreManager.lookup('dialingNumbersStoreDL');
	    		Jacada.Logger.debug("CTI bar. Updating dialing numbers " + store);
	    		if(store){
	    			store.load({params:{method:'getDialingNumbers', transferImpl: this.TRANSFER_STANDARD}});
	    		}
	    	}
	    },
	    notificationButtonHandler: function(btnId){
	    	var uniqueId, button = btnId;
	    	if(Object.isString(btnId)){
	    		button = Ext.getCmp(btnId);
	    		if(button == null){
	    			alert("Notification button '" + btnId + "' was not found");
	    			return;
	    		}
	    	}else{
	    		btnId = button.getId();
	    	}
    		Jacada.Logger.debug("notificationButtonHandler - button click - " + btnId);
    		button.stopNotification();
    		if(btnId == 'answerBtn'){
    			$W().cti._onCTIButtonClicked('answer');
    		}else if(btnId == 'answerOpenMediaBtn'){
    			$W().cti._onCTIButtonClicked('answerOpenMedia');
    		}else if(btnId == 'answerEmailBtn'){
    			//show loading...
    	    	var currentTab = $W().getTab();
    	    	$W().HideCurrentVisibleTab();
    	    	currentTab.setLoading($W().localeManager.getLocalizationValue('application.javascript.agentHistory.loadingText'));
    	    	var handler = function(){
    	    		currentTab.setLoading(false);
    	    	};

    	    	uniqueId = button.uniqueId;
    			button.uniqueId = null;
    			$W().cti._onMediaButtonClicked('answerEmail', uniqueId, 'email', null, handler);
    		}else if(btnId == 'answerChatBtn'){
    			uniqueId = button.uniqueId;
    			button.uniqueId = null;
    			$W().cti._onMediaButtonClicked('answerChat', uniqueId, 'chat');
    		}
    		else{
    			alert('Unknown handler for notification button: ' + btnId);
    		}
    		button.disable();
	    },
		buildReadyBtn: function(){
			var operation = 'ready';
			return {
    			xtype: 'button',
    			id: operation + 'Btn',
				itemId: operation + 'Btn',
    			width: 120,
				padding: '5 5 5 5',
    			//text is current state
    			//handler of the menu is where we want to go
    			//meanin we want to make user Ready
    			text: $W().localeManager.getLocalizationValue('application.javascript.ctiAgentInfoBar.label.status.busy'),
    			menu: [
    			    {
    			    	text: $W().cti.getButtonText('readyWithShort'),
    			    	handler: function(){
    			    		$W().cti._onCTIButtonClicked(operation);
    			    	}
    			    }
    			]
    		};
		},
		buildBusyBtn: function(){
			var operation = 'busy';
			var menus = [];
			//text is current state
			//handler of the menu is where we want to go
			//meaning we want to make user Busy
			if($W().UserCTIRoles.BusyReasonCode 
					&& $W().ctiSettings.busyCodesList 
					&& $W().ctiSettings.busyCodesList.size() > 0){
					
					$W().ctiSettings.busyCodesList.each(function(item){
						menus.push({
							text: item.name,
							tooltip: item.description,
							code: item.dn,
							handler: function(busyCode){
								Jacada.Logger.debug("Busy clicked - has busyCode? " + (busyCode?busyCode.code:busyCode));
								var dn = null;
								if(busyCode){
									dn = busyCode.code;
								}
								$W().cti._onCTIButtonClicked(operation, dn);
							}
						});
					});
			}else{
				menus.push({
					text: $W().cti.getButtonText('busyWithShort'),
					handler: function(busyCode){
						$W().cti._onCTIButtonClicked(operation);
					}
				});
			}
			return {
    			xtype: 'button',
    			id: operation + 'Btn',
				itemId: operation + 'Btn',
    			width: 120,
				padding: '5 5 5 5',
    			menu: {
					floating: {shadow: false},
					plain: true,
					items:menus,
					listeners:{
		    			show: function(){
		    				$W().HideCurrentVisibleTab();
		    			},
		    			hide: function(){
		    				$W().ShowCurrentVisibleTab();
		    			}
		    		}
				},
    			//Text is Current agent state
    			text: $W().localeManager.getLocalizationValue('application.javascript.ctiAgentInfoBar.label.status.ready')
    		};
		},
		buildResyncBtn: function(){
	        var resyncBtn = $W().cti.createCTIButton('resync', $W().cti.getButtonText('reconnect'),
	        		true,	function(){
								$W().cti._onCTIButtonClicked('resync');
							}
	        	);
	        resyncBtn.iconAlign = 'left';
	        resyncBtn.scale = 'small';
	        resyncBtn.minWidth = 50;
	        return resyncBtn;
		},
		buildNotificationsBar: function(){
			return Ext.create('Jacada.user.ui.cti.SectionPanel', {
	    		sectionName: $W().localeManager.getLocalizationValue('application.javascript.cti.section.notification'),
	    		items: Ext.create('Jacada.user.ui.cti.CTINotificationsBar')
	    	});
		},
	    buildActionsBar: function(){
	    	var config = {
	    	    layout: 'card',
	    	    width: 310,//set fixed width even for short actions bar so the bar won't move when we switch from email to chat etc.
	    	    id: 'actionsBar',
	    	    border: false,
	    	    defaults:{
					bodyStyle : 'background:none;',
					border: false
				}
		    };
	    	if($W().LayoutByContext){
	    	    config.items = [
		    	        this.buildVoiceActionBar(),
		    	        this.buildOpenMediaActionBar(),
		    	        this.buildTasksActionBar(),
		    	        this.buildEmailActionBar(),
		    	        this.buildChatActionBar()
		    	];
	    	}else{
	    		config.items = [this.buildVoiceActionBar()];
	    	}
	    	var actionBarPanel = Ext.create('Ext.panel.Panel', config);
	    	return Ext.create('Jacada.user.ui.cti.SectionPanel', {
	    		sectionName: $W().localeManager.getLocalizationValue('application.javascript.cti.section.actionbar'),
	    		items: actionBarPanel
	    	});
	    },
	    buildVoiceActionBar: function(){
	    	return Ext.create('Jacada.user.ui.cti.VoiceActionBar');
	    },
	    buildOpenMediaActionBar: function(){
	    	return Ext.create('Jacada.user.ui.cti.OpenMediaActionBar');
	    },
	    buildTasksActionBar: function(){
	    	return Ext.create('Jacada.user.ui.cti.TasksActionBar');
	    },
	    buildEmailActionBar: function(){
	    	return Ext.create('Jacada.user.ui.cti.EmailActionBar');
	    },
	    buildChatActionBar: function(){
	    	return Ext.create('Jacada.user.ui.cti.ChatActionBar');
	    },
	    getCurrentActionBar: function(){
	    	return Ext.getCmp('actionsBar').getLayout().getActiveItem();
	    },
	    switchActionBar: function(interactionType){
	    	var actionBarItemId;
	    	if(interactionType == $W().interactionType.Voice || interactionType ==  $W().interactionType.General){
	    		actionBarItemId = 'voiceActionBar';
	    	}else if(interactionType == $W().interactionType.Tasks){
	    		actionBarItemId = 'tasksActionBar';
	    	}else if(interactionType == $W().interactionType.WorkItem){
	    		actionBarItemId = 'openMediaActionBar';
	    	}else if(interactionType == $W().interactionType.Email){
	    		actionBarItemId = 'emailActionBar';
	    	}else if(interactionType == $W().interactionType.Chat){
	    		actionBarItemId = 'chatActionBar';
	    	}else{
	    		actionBarItemId = 'voiceActionBar';
	    	}
	    	Ext.getCmp('actionsBar').getLayout().setActiveItem(actionBarItemId);
	    	//fire custom event for custom logic
	    	var actionBar = Ext.getCmp('actionsBar').getLayout().getActiveItem();
	    	actionBar.fireEvent('refreshActionBar');
	    },
	    buildContextButton: function(){
	    	if(!$W().LayoutByContext){
	    		return null;
	    	}
	    	$W().cti.activeInteractions = []; //need this to depress when General context is selected
	    	var contextMenus = Ext.create('Ext.menu.Menu', {
	    		id: 'contextBtnMenu',
	    		floating: {shadow: false},
	    		itemId: 'contextBtnMenu',
	    		listeners:{
	    			show: function(){
	    				$W().HideCurrentVisibleTab();
	    			},
	    			hide: function(){
	    				$W().ShowCurrentVisibleTab();
	    			}
	    		}
	    	});
	    	return {
	    		id: 'contextBtn',
	    		itemId: 'contextBtn',
				xtype: 'button',
				ui: 'default-toolbar',
				iconCls: 'conversations',
				scale: 'large',
				iconAlign: 'bottom',
                menu: contextMenus,
                arrowCls: ''//no arrow
			};
	    },
	    addContextGroup: function(interactionType, text, groupId, data){
	    	var contextMenu = Ext.getCmp('contextBtnMenu');
    		if(contextMenu.getComponent(groupId +'-contextMenu')){
    			Jacada.Logger.debug("CTIBar.addContextGroup: groupId=" + groupId +" already exits, will not be added");
    			return;
    		}
	    		
	    	Jacada.Logger.debug("CTIBar.addContextGroup: groupId=" + groupId);
	    	contextMenu.add({
	    		xtype: 'menucheckitem',
	    		id: groupId + '-contextMenu',
	    		itemId: groupId + '-contextMenu',
	    		text: text,
	    		group: 'activeInteractionsToggleGroup',
	    		checkedCls: interactionType.toLowerCase() + 'MenuIconSelected',
	    		uncheckedCls: interactionType.toLowerCase() + 'MenuIcon',
	    		interactionType: interactionType,
	    		interactionData: data,
	    		handler: function(thisBtn){
	    			Jacada.Logger.debug("CTIBar switching interaction to " + thisBtn.getId());
	    			Ext.getCmp('contextNavigation').updateActiveContext(thisBtn.interactionData, thisBtn.interactionType);
	    		}
	    	});
	    	var contextBtn = contextMenu.getComponent(groupId + '-contextMenu');
	    	this.activeInteractions.push(contextBtn);
	    	Ext.getCmp('contextBtn').enable();
	    	Ext.getCmp('contextBtn').setIconCls('conversations-over');
	    },
	    selectActiveContextGroup: function(){
	    	/*
	    	var contextMenu = Ext.getCmp('contextBtnMenu');
	    	var selectedContextItem = contextMenu.getComponent($W().activeContext.groupId + '-contextMenu');
	    	if(selectedContextItem){
	    		Jacada.Logger.debug("CTIBar.selectActiveContextGroup found context button " + selectedContextItem.getId());
	    		selectedContextItem.setChecked(true);
	    		if($W().activeContext.interactionType == $W().interactionType.Email || $W().activeContext.interactionType == $W().interactionType.Chat){
	    			this.applyStateToContextGroup($W().activeContext.groupId, false);
	    		}else if($W().activeContext.interactionType == $W().interactionType.Voice){
	    			this.applyStateToVoiceContextGroup($W().activeContext.groupId);
	    		}
	    		this.switchActionBar($W().activeContext.interactionType);
	    	}else{
	    		Jacada.Logger.debug("CTIBar.selectActiveContextGroup didn't find context button for group " + $W().activeContext.groupId);
	    		if(this.activeInteractions.size() > 0){
		    		this.activeInteractions.each(function(contextBtn){
		    			contextBtn.setChecked(false);
		    		});
	    		}else{
	    			Ext.getCmp('contextBtn').disable();
	    		}
	    		//In Interaction type General, remove voice close context button
    			this.state.closeContextBtn = { visible: false, enabled: false};
    			this.processVoiceState(this.state, this.ctiClientInfo);//show the current cti state from this.ctiClientInfo
	    		this.switchActionBar($W().activeContext.interactionType);
	    	}
	    	//enabling directorySearchBtn unless it's General context
	    	var directorySearchBtn = Ext.getCmp('directorySearchBtn');
	    	if($W().activeContext.interactionType == $W().interactionType.General){
	    		directorySearchBtn.disable();
	    	}
	    	*/
	    },
	    removeContextGroup: function(groupId){
	    	Jacada.Logger.debug("CTIBar.removeContextGroup: groupId=" + groupId);
	    	var contextMenu = Ext.getCmp('contextBtnMenu');
	    	if(contextMenu.getComponent(groupId + '-contextMenu')){
		    	var removedBtn = contextMenu.remove(groupId + '-contextMenu', true); //autoDestroy=true
		    	this.activeInteractions = this.activeInteractions.without(removedBtn);
		    	if(this.activeInteractions.size() == 0){
		    		Ext.getCmp('contextBtn').disable();
		    		Ext.getCmp('contextBtn').setIconCls('conversations');
		    	}
	    	}
	    },
	    doLogout: function(){
	    	$W().ctiAPI.doLogoutAPI();
	    },
	    buttonClickOperation: function(operation){
	    	
	    },
	    dialBtnClicked: function(){
    		var dialField = Ext.getCmp('ctiDialNumberField');
    		var number = null;
    		if(dialField){
    			number = dialField.getValue();
    		}
    		if($W().cti.isManualMode()){
    			if(number && number.trim() != ''){
    				$W().cti._onCTIButtonClicked('start', number.trim());
    			}
    		}else{
    			if(number && number.trim() != ''){
    				this.dialPadWindowActionSource = 'dial';
    				this.cleanError();
    				this.dialFromDialPadWindow(number.trim());
    			}else{
    				this.onShowDialPadWindow('dial');
    			}
    		}
	    },
	    startCallDisposition: function(shouldHangCall) {
	        var arrArgs = $A(arguments);
	        if (arrArgs.length > 0 && shouldHangCall == false) {
	            $W().loadDisposition();   
	        }
	        else {
	        	$W().cti._onCTIButtonClicked('end');
	        }
	    },
	      
	    endDisposition: function(){    
			// remove last error status
			this.cleanError();
			return $W().ctiAPI.endDispositionAPI();
	    },
	    
	    onDispositionScriptStarted: function () {
	    },
	    
	    onDispositionScriptEnded: function () {
			$W().ctiAPI.pushSetTimers();
			this.endDisposition();
	    },

	    showState: function(ctiClientInfo) {

	      },
	      /*
	       * Change voice action bar buttons visibility and enablement according to a state configuration and ctiClientInfo
	       */
	      processVoiceState: function(state, ctiClientInfo){
	      	var element, name;
	        for (name in state) {
	        	element = Ext.getCmp(name);
	            if (element) {
	            	Jacada.Logger.debug('### processVoiceState '+name+"  visible: " + state[name].visible + ", enabled: " + state[name].enabled);
	            	//hold and holdOff are represented by toggle button
	            	//if hold state is visible (true) - button is not pressed (false)
	            	if(element.getId() == 'holdBtn'){
	            		Jacada.Logger.debug("processVoiceState. Handling holdBtn. should be pressed? " + state[name].visible + ", enabled? " + state[name].enabled);
	            		element.toggle(!state[name].visible);
	            		$W().cti._setEnabledDisabled(element,state[name].enabled);
	            		if(state[name].visible){
	            			element.setText($W().cti.getButtonText('holdWithShort'));
	            		}else{
	            			element.setText($W().cti.getButtonText('offholdWithShort'));
	            		}
	            	}else if(state[name] && state[name].visible != null){
	    	        	if(element.getId() == 'answerBtn' 
	    	        			|| element.getId() == 'answerOpenMediaBtn'){
	    	        		Jacada.Logger.debug("Notification button " + element.getId() + " should be enabled? " + state[name].enabled);
	    	        		this.setButtonVisibility(element, state[name].visible);
	    	        		if(state[name].enabled){
	    	        			var msg = this.chekcAniContainLetters(ctiClientInfo['ANI'], ctiClientInfo['DNIS']);
	    	        			element.startNotification({
	    	        				title:$W().localeManager.getLocalizationValue('application.javascript.ctiBar.notification.popup.incomingCall'),
	    	        				msg:msg,
	    	        				iconCls:'voiceNodeIcon',
	    	        				notificationPopup: true
	    	        			});
	    	        		}
	    	        	}else if(element.getId() == 'sendDTMFBtn' || element.getId() == 'dialBtn'){
	    	        		//Handle the DTMF and the dial buttons separately
	    	        		//(Implemented here and not in ctiStates since the DTMF feature can be disabled while dial operation isn't)
	    	        			    	        		//dial button must be disabled when Cisco and ready state
	    	        		if(ctiClientInfo.clientStateName == "ready" 
	    	        			&& $W().ctiSettings.ctiProvider == 'cisco'){
	    	        			$W().cti._setEnabledDisabled(element, false);
	    	        			continue;
	    	        		}
	    	        		this.handleDialDTMFButtons(element, this.state);

	    	        	//Handle other cases
	    	        	}else if(element.getId() == 'resyncBtn'){
	    	        		//Special case, resyncBtn should not be visible but take space.
	    	        		this.setButtonVisibility(element, state[name].visible);
	    	        	//Handle other cases
	    	        	}else if(state[name].visible){
	    	                element.show();
	    	            }else{
	    	                element.hide();
	    	            }
	    	        	//if it's directorySearchBtn and item was retrieved we need to disable the button
	    	        	if(element.getId() == 'directorySearchBtn' && ctiClientInfo 
	    	        		&& ctiClientInfo.incomingInfo && ctiClientInfo.incomingInfo.retrieved){
	    	        		
	    	        		Jacada.Logger.debug("CTIBar.js processVoiceState 'directorySearchBtn' retrieved? true - disabling.");
	    	        		element.disable();
	    	        	}else{
	    	        		$W().cti._setEnabledDisabled(element, state[name].enabled);
	    	        	}
	    	        }   
	            }
	        }
            //If state is ready or notready, it's not a future state
            //stripping border classes
	        if(ctiClientInfo){
	        	if(ctiClientInfo.clientStateName == 'ready' 
	        		|| ctiClientInfo.clientStateName == 'notready'){
	        		Ext.getCmp('readyBtn').removeCls('future-busy-border');
	        		Ext.getCmp('busyBtn').removeCls('future-ready-border');
	        	}
	        }
	        
   	        var status = state.status;
	        if(status != null) {
	        	this.changePhoneStatus(status.text, status.clss);
	        }

	      },
	      findNoCallVoiceContext: function(ctiClientInfo){
	      	var stateName = ctiClientInfo.clientStateName;
	      	Jacada.Logger.debug("CTIBar.js findNoCallVoiceContext stateName: " + stateName + ", active groupId: " + $W().activeContext.groupId);
	      	if(stateName.indexOf('ringing') > -1  && stateName.indexOf('disposition') == -1){
	      		//new incoming call, don't take the currently no call voice context
	      		return null;
	      	}
	      	var activeGroupId = $W().activeContext.groupId;
	      	return (activeGroupId && activeGroupId.indexOf($W().interactionType.Voice) > -1) ? activeGroupId : null;
	      },
	      getNoCallStateName: function(){
	      	return 'noCall_voice_context';
	      },
	      chekcAniContainLetters: function(ani, dnis){
	    	  return ani && !ani.match(/[a-zA-Z]+/) ? ani : dnis;
	     },
	    cleanError: function(){
	    	if(this.errorField){
	    		this.errorField.setText('');
	    		this.errorField.errorMsg = null;
	    		if(this.errorField.tip){
	    			this.errorField.tip.update('');
	    		}
	    	}
	    },
	    _handleErrorMessage: function(ctiClientInfo){
	        // show the error status received from the server, if there is one
	        var errorMsg = ctiClientInfo.errorMessage;
	        var errMsgParam = ctiClientInfo.errorMessageParam;
	        // special case - in case the previsous state was semiManual we clear the error. 
	        // This covers some end-cases when the login API does not clear the error
	        if((errorMsg == null || errorMsg == "") && ctiClientInfo.isInSemiManual){
	        	this.cleanError();
	        }
	        if (errorMsg != null && errorMsg != ""){
	        	if(this.errorField == null){
		    		//Bug WS-5809. first time this method is called it's too early and UI component is not drawn yet
		    		//thus, tooltip is not really attached to the element.
		    		//Thus, we create it with a slite delay.
		    		if(this.errorFieldInit) {
		    			//Previous invocation will create a tooltip,
		    			//this one will set correct text 
		    			setTimeout(function(){$W().cti._handleErrorMessage(ctiClientInfo);}, 1000);
		    			return;
		    		}
		    		var me = this;
		    		me.errorFieldInit = setTimeout(function(){
		    			me.errorField = Ext.getCmp('ctiErrorMsgField');
		    			//Since TextField does not have a built-in tooltip
		    			//we need to add one explicitly
		    			me.errorField.tip = Ext.create('Ext.tip.ToolTip', {
		    				target: me.errorField.getEl(),
		    				trackMouse: true,
		    				html: ''
		    			});
		    			$W().cti._handleErrorMessage(ctiClientInfo);
		    		},1000);
		    		return;
	        	}
	        	
	        	errorMsg = $W().localeManager.getLocalizationValue(errorMsg);
	        	if(errMsgParam != null && errMsgParam != ""){
	        		errorMsg += ' ' + $W().localeManager.getLocalizationValue(errMsgParam);
	        	}
	        	Jacada.Logger.debug("CTIBar.js setting error to " + errorMsg);
	        	this.errorField.setText(errorMsg);
	        	this.errorField.tip.update(errorMsg);
	            this.ctiClientErrorHandler(ctiClientInfo, errorMsg);
	        }else{
	        	//Special case to leave error message for missed call otherwise clear the error field.
	        	var missedCallLocalizedValue = $W().localeManager.getLocalizationValue('application.javascript.ctiCallInfoBar.label.errorMessage.missedCall');
	        	if(this.errorField != null && this.errorField.text.indexOf(missedCallLocalizedValue) == -1){
	        		this.cleanError();
	        	}
	        }
	    	
	    },
	    _handleConstMessage: function(state){
	    	// show the state-related error message, e.g. "Not connected to CTI" for manual modes
	    	if(this.constField == null){
	    		//Bug WS-5809. first time this method is called it's too early and UI component is not drawn yet
	    		//thus, tooltip is not really attached to the element.
	    		//Thus, we create it with a slite delay.
	    		if(this.constFieldInit) {
	    			//Previous invocation will create a tooltip,
	    			//this one will set correct text 
	    			setTimeout(function(){$W().cti._handleConstMessage(state);}, 1000);
	    			return;
	    		}
	    		var me = this;
	    		me.constFieldInit = setTimeout(function(){
	    			me.constField = Ext.getCmp('ctiConstMsgField');
	    			//Since TextField does not have a built-in tooltip
	    			//we need to add one explicitly
	    			me.constField.tip = Ext.create('Ext.tip.ToolTip', {
	    				target: me.constField.getEl(),
	    				trackMouse: true,
	    				html: ''
	    			});
	    			$W().cti._handleConstMessage(state);
	    		},1000);
	    		return;
	    	}
	    	var text = "";
	    	var title = "";
	        var constStatus = state.constantMessage;
	        if(constStatus != null && constStatus.text){
		    	text = constStatus.text;
	            //show title of the constantmessage if exists    
	            if(constStatus.title){
	            	title = constStatus.title;
	            }else{
	            	title = constStatus.text;
	            }
	            if(this.constField.constClass){
	            	this.constField.removeCls(this.constField.constClass);
	            }
	            if(constStatus.clss){
	            	this.constField.addCls(constStatus.clss);
	            	this.constField.constClass = constStatus.clss;
	            }else{
	            	this.constField.constClass = null;
	            }
	        }
	        this.constField.setText(text);
	        this.constField.tip.update(title);
	    },
	    /********************************************************************************
	     * Error handler function should be filled up by the user.
	     This function is automatically called upon recieving an error message or calling a disabled button
	     *********************************************************************************/
	    ctiClientErrorHandler: function(ctiClientInfo, data) { 
	    	$W().ctiAPI._debug("Activating cti error handler: " + data);
	    },

	    changePhoneStatus: function(txt, txtClass) {
	    	Jacada.Logger.debug("changePhoneStatus: " + txt);
	    	var ctiStatus = Ext.getCmp('ctiStatus');
	    	if(!ctiStatus){
	    		return;
	    	}
	        if(txt != null) {
	        	ctiStatus.setText(txt);
	        }
	        
	        if(txtClass != null) {
	        	if(ctiStatus.customClass){
	        		ctiStatus.removeCls(ctiStatus.customClass);
	        	}
	        	ctiStatus.addCls(txtClass);
	        	ctiStatus.customClass = txtClass;
	        }
	     },
	     
		//This method handles the dial and DTMF buttons visibility 
		//In case the DTMF button is visible the dial button becomes hidden
		//With this implementation the buttons in the CTIStates can appear in any order
		handleDialDTMFButtons: function(element, state){  
			if(element.getId() == 'dialBtn'){
				//Send DTMF is enabled and visible
				if(Ext.getCmp('sendDTMFBtn') != null && state['sendDTMFBtn'].visible){
					this.setButtonVisibility(element, false);
				//Send DTMF is disabled or not visible and dial button is visible	  
				}else if(state['dialBtn'].visible){
					this.setButtonVisibility(element, true);
				}else{
					this.setButtonVisibility(element, false);
				}
			}else if(element.getId() == 'sendDTMFBtn'){
			//Send DTMF is enabled and visible
				if(state['sendDTMFBtn'].visible){
					element.show();
					var dialBtn = Ext.getCmp('dialBtn');
					if(dialBtn != null){
						this.setButtonVisibility(dialBtn, false);
					}
				}else{
					element.hide();
				}
			}
		},
	    isManualMode: function(){	
	    	if(this.stateName.indexOf('manual') != -1) {
	    		return true;
	    	}
    		return false;
	    },
		doCompleteTransferAction: function(action) { 
			if(this._buttonDisabled('completeTransfer')){
				return;
			}
			if(action == 'completeTransfer'){
				this._onCTIButtonClicked('completeTransfer');
			}else if(action == 'returnCall'){
				// not using _onCTIButtonClicked function because there is no such button and _onCTIButtonClicked checks if button exists
				this._doOperationWithDn('returnCall', '');
			}else if(action == 'toggleToCustomer'){
				// not using _onCTIButtonClicked function because there is no such button and _onCTIButtonClicked checks if button exists
				this._doOperationWithDn('toggleToCustomer');
			}else{
				alert('doCompleteTransferAction. Unexpected action: ' + action);
			}
		},
		doConferenceAction: function(action) {
			if (this._buttonDisabled('join')){
				return;
			}
			if(action == 'joinCall'){
				this._onCTIButtonClicked('join');
			}else if(action == 'returnCall'){
				this._doOperationWithDn('returnCall', '');
			}else if(action == 'transferCallFromConsult'){
				// not using _onCTIButtonClicked function because there is no such button and _onCTIButtonClicked checks if button exists
				this._doOperationWithDn('transferFromConsult', '');
			}else if(action == 'toggleToCustomer'){
				// not using _onCTIButtonClicked function because there is no such button and _onCTIButtonClicked checks if button exists
				this._doOperationWithDn('toggleToCustomer');
			}else{
				alert('doConferenceAction. Unexpected action: ' + action);
			}
		},
	    //This method is responsible for displaying the relevant reason code information when relevant
	    _handleReasonCodeInfo: function(ctiClientInfo){
	    	//Return if not allowed, return
	    	if(!$W().UserCTIRoles.BusyReasonCode){
	    		return;
	    	}
	    	var auxReasonField = Ext.getCmp('auxReason');
	    	if (!auxReasonField){
	    		return;
	    	}
	    	var displayText = '';
	    	if(ctiClientInfo.bBusy && ctiClientInfo.reasonCode &&  ctiClientInfo.reasonCode.length > 0) {
	  	    	//display code
	  	    	displayText = ctiClientInfo.reasonCode;
	  	    	//check if name exists, and if so - display it
	  	    	if(ctiClientInfo.reasonCodeInfo &&  ctiClientInfo.reasonCodeInfo.length > 0 && ctiClientInfo.reasonCode != "0") {
	  	    		displayText = /*displayText+	" - " +*/ctiClientInfo.reasonCodeInfo;	    		
	  	    	}
	    	}   
	    	auxReasonField.setText(displayText);	    	
	    },
	    _setEnabledDisabled: function(element, isEnabled) {
	    	
	    	if($W().activeContext && element.getId() == 'closeContextBtn'){
	    		if($W().interactionType.General == $W().activeContext.interactionType && !(this.stateName.indexOf('disposition') > -1)){
	    			Jacada.Logger.debug("CTIBar.js 'disposition' _setEnabledDisabled interactionType: " 
	    					+ $W().activeContext.interactionType + ", hiding closeContextBtn");
	    			var closeButton = Ext.getCmp('closeContextBtn');
	    			closeButton.disable();
	    			closeButton.hide();
	    			return;
	    		}
	    	}
	    	
	    	if(element.getId() == 'answerEmailBtn' || element.getId() == 'answerChatBtn'){
	    		if(!isEnabled){
	    			//we do'nt want to disable these buttons here
	    			return;
	    		}
	    	}
	        if(element.canBeEnabled == null){
	            element.canBeEnabled = true;
	        }
	    	if(isEnabled && element.canBeEnabled){
	    		element.enable();
	    		if(element.getId() == 'dialBtn'){
	    			Ext.getCmp('addressBookBtn').enable();
	    		}
	    	}else{
	    		element.disable();
	    		if(element.getId() == 'dialBtn'){
	    			Ext.getCmp('addressBookBtn').disable();
	    		}
	    	}
	    },
	     
	    // dn can be null if not needed
	    _onCTIButtonClicked: function(operation, dn, location) {
			if (this._buttonDisabled(operation)){
				return;
			}
			//for multi channel
			var channel = this._getButtonChannel(operation);
			// remove last error status, but only in case this is not manual mode
			if (!this.isManualMode()) {
				this.cleanError();
			}
  
			return $W().ctiAPI.clickButton(operation,dn,location, channel);
	    },
		_getButtonChannel: function(operation){
			var button = operation + "Btn";
			if (this.state[button] != null && this.state[button].channel != null){
				return this.state[button].channel;
			}
			return null;
		},
		_buttonDisabled: function(operation) {
			//Special case: hold and holdOff - it's toggle button
			var buttonId = operation + 'Btn';
			if(operation == 'holdOff'){
				buttonId = 'holdBtn';
			}
			var button = Ext.getCmp(buttonId);
			if (!button){
			    alert('error in _buttonDisabled; button not found: ' + buttonId);
			    return true;
			}
			if(typeof button.allowed == 'undefined'){
				button.allowed = true;
			}
			Jacada.Logger.debug("_buttonDisabled operation: " + operation + ", disabled? " + button.disabled + ", allowed? " + button.allowed);
			if (button.disabled || !button.allowed){
			    var msg = 'The operation '+operation +' cannot be executed because the '+operation+' button is currently disabled.';
			    $W().ctiAPI._error(msg);
			    //activating the user's handler
			    this.ctiClientErrorHandler(this.ctiClientInfo, msg);
			    return true;                
			}
			
			return false;
		},
		
	    //Consider of removing, might not be needed
	    setTimerColorBySLA:function(){
	    	
	    },
	    //Should be used when button must be hidden but take place
	    //So other item won't move
	    setButtonVisibility: function(button, isVisible){
	    	button.setVisible(isVisible);
	    	/*if(isVisible){
	    		//button.removeCls('hiddenButton');
	    		Jacada.Logger.debug("Button " + button.getId() + " class removed");
	    	}else{
	    		//button.addCls('hiddenButton');
	    		Jacada.Logger.debug("Button " + button.getId() + " hidden class added");
	    	}*/
	    },
		createCTIButton: function(operation, text, allowed, handler){
			Jacada.Logger.debug("CTIBar - creating button -  operation: " + operation + ", text: " + text 
					+ ", allowed: " + allowed + ", handler exists? " + (handler != null));
			var config = {
					xtype: 'button',
					ui: 'default-toolbar',//give it a toolbar button style
					iconAlign: 'top',
					scale: 'medium',
					cls: 'cti-btn',
					text: text,
					id: operation + 'Btn',
					itemId: operation + 'Btn',
					iconCls: operation + 'BtnIcon'
			};
			if(allowed){
				config.allowed = allowed;
			}
			if(handler){
				config.handler = handler;
			}
			return config;
		},
		createCTIButtonWithMenu: function(operation, tooltip, allowed, menuOpts, handler){
			var config = this.createCTIButton(operation, tooltip, allowed, handler);
			Jacada.Logger.debug("createCTIButtonWithMenu. menus: " + menuOpts);
			if(menuOpts && menuOpts.size() > 0){
				config.handler = null;
				var menus = [];
				menuOpts.each(function(item){
					menus.push({
						text: item.name,
						tooltip: item.description,
						id: item.dn,
						handler: handler
					});
				});
				config.menu = menus;
			}
			return config;
		},
		getButtonText: function(textKey, fullKey) {
	    	//if the given key is the full path use it
	    	if (fullKey != null && fullKey == true) {
	    		return $W().localeManager.getLocalizationValue(textKey);
	    	}
	    	//otherwise use the default prefix for cti buttons
	    	var completeTextKey = 'application.javascript.ctiButtonsBar.label.'+textKey;
	        return $W().localeManager.getLocalizationValue(completeTextKey);  
	    },
		onShowDialPadWindow: function(action) {
			this.dialPadWindowActionSource = action;
			//remove last error status
			this.cleanError();
			$W().openDialPadPortletWindow();
		},
		dialFromDialPadWindow: function(number) {
			if(this.dialPadWindowActionSource == 'sendDTMF'){
				return $W().ctiAPI.sendDTMFAPI(number);
			}
			var operation = '';
			//in case of transfer operation check the te transfer button
			if ((this.dialPadWindowActionSource.toLowerCase()).indexOf('transfer')!=-1) {
				operation = 'transfer';
			} else if((this.dialPadWindowActionSource.toLowerCase()).indexOf('consult')!=-1) {
				operation = 'consult';
			} else if((this.dialPadWindowActionSource.toLowerCase()).indexOf('dial')!=-1) {
				operation = 'dial';
			}
			//check button when there is an operation 
			if (operation != null && operation != '' ) {
				//check relevant button
				var button = Ext.getCmp(operation + 'Btn');
				Jacada.Logger.debug("dialFromDialPadWindow. operation: " + operation 
						+ ", dialPadWindowActionSource: " + this.dialPadWindowActionSource
						+ ", button: " + button);
				if (!button || button.isDisabled() || button.allowed == false)  {
					var alertMsg = $W().localeManager.getLocalizationValue('application.javascript.ctiButtonsBar.alert.cannotDialBecauseRelevantButtonDisabledBegin');
					//when possible take the already localized text
					if (button) {
						if(button.getText()){
							alertMsg += button.getText() + ' ';	
						}else{
							alertMsg += button.tooltip + ' ';	
						}
					}else{
						alertMsg += operation + ' ';
					}
					alertMsg += $W().localeManager.getLocalizationValue('application.javascript.ctiButtonsBar.alert.cannotDialBecauseRelevantButtonDisabledEnd');
					var msg = 'The operation '+operation +' cannot be executed because the '+operation+' button is currently disabled.';
					$W().ctiAPI._error(msg);
					alert(alertMsg);
					//activating the user's handler
					this.ctiClientErrorHandler(this.ctiClientInfo, msg);
					return;       
				}
			}
			return this._doOperationWithDn(this.dialPadWindowActionSource, number);
		},
		//Returns false if both lists are empty or if the feature is not enabled by the DialList privilege  
		isDialListEnabled: function(transferImpl){
			if(!$W().UserCTIRoles.CTIDialList){
				return false;
			}else if(this.isEMCCTIProvider()){
				return true;
			}
			var url = $W().dialListWindow.DialList_JSON_URL;
			var pars = 'method=isShowDialList&transferImpl=' + transferImpl;
			var request = new Ajax.Request(url, { method: 'get', parameters: pars, asynchronous : false });
			if (request.success()) {
				var data = request.transport.responseText;
				if(data == "false"){
					return false;
				}else if(data == "true"){
					return true;
				}
			}
		},
		openDialList: function(action){
			var transferImpl = this.TRANSFER_STANDARD;
			if(action.indexOf(this.TRANSFER_STANDARD) != -1){
				action = action.replace(this.TRANSFER_STANDARD,'');
			}else if(action.indexOf(this.TRANSFER_CONNECT) != -1){
				transferImpl = this.TRANSFER_CONNECT;
			}
			if(this.isDialListEnabled(transferImpl)){
				Jacada.Logger.debug("Dial List is enabled for " + transferImpl);
				$W().dialListWindow.openDialList(transferImpl, action);
			}else{
				Jacada.Logger.debug("Dial List is disaled for " + transferImpl + ", opening dial pad.");
				this.onShowDialPadWindow(action);
			}
		},		
		isEMCCTIProvider: function(){
			return (ctiSettings.ctiProvider.toLowerCase() == 'emc'); 
		},
		isGENESYSCTIProvider: function(){
			return (ctiSettings.ctiProvider.toLowerCase() == 'genesys'); 
		},
		//Runs operations that do not have real button
	    _doOperationWithDn: function(operation, dn, location) {
	        var channel = this._getButtonChannel(operation);
	        var result = $W().ctiAPI.clickButton(operation, dn, location, channel);
			this.updateDialingNumbers();
			return result;
	    },
		_onReady: function() {
			//clear aux code
			Ext.getCmp('auxReason').setText('');
			$W().cti._setCallTimersEnable();
		}, 
		_onNotReady: function() {
			
		},  
		_removeAddContent: function() {
			
		},
		_onPushSetAgentStatus: function(param) {
			//checking if we got a reason
			//separate status and reason because when there is a reason the sent string will look like this: myStatus|myReasonCode
			var seperator ='|';
			var seperatorPos = param.indexOf(seperator);
			var reason = null;
			if  (seperatorPos != -1) {
				var reasonLength = param.length - (seperatorPos+1);
				reason = param.substr(seperatorPos+1, reasonLength);
				param = param.substr(0,seperatorPos);
			}
	        var busyBtn = Ext.getCmp('busyBtn');

			if(param == 'ready') {
				$W().cti._onCTIButtonClicked('ready');
			}else if(param == 'notready') {
				//only on busyClicked  we currently use the reason
				if($W().UserCTIRoles.BusyReasonCode && reason != null && reason != ''){
					//we have reason code
					//Let's verify that it exists
					var busyCode = $W().ctiSettings.busyCodesList.detect(function(code){
						return code.dn == reason;
					});
					if(busyCode){
						this._onCTIButtonClicked('busy', reason);
					}else{
						//Not found - Logging error and trying with default
						$W().LogManager.getLogger("CTIBar.js").error("_onPushSetAgentStatus: Busy Reason Code " + reason + " is not found. Trying default.");
						this._onCTIButtonClicked('busy');
					}
				}else{
					//we don't have reason code or not in use
					this._onCTIButtonClicked('busy');
				}
			}
		},
		_onPushWarmTransfer: function(param) {
			//allow warm transfer from scriptAPI only if the "transfer" button is enabled
			if (this._buttonDisabled('transfer')){
			    return;
			}
			this._doOperationWithDn('warmTransferStandard', param);
		},
		_onPushColdTransfer: function(param) {
			//allow cold transfer from scriptAPI only if the "transfer" button is enabled
			if (this._buttonDisabled('transfer')){
			    return;
			}
			this._doOperationWithDn('coldTransferStandard', param);
		},
		_onPushHandshakeTransfer: function(param) {
			//allow handshake transfer from scriptAPI only if the "transfer" button is enabled
			if (this._buttonDisabled('transfer')){
			    return;
			}
			this._doOperationWithDn('handshakeTransferStandard', param);
		},
		_onPushWarmTransferConnect: function(param) {
			//allow warm transfer from scriptAPI only if the "transfer" button is enabled
			if (this._buttonDisabled('transfer')){
			    return;
			}
			this._doOperationWithDn('warmTransferConnect', param);
		},
		_onPushHandshakeTransferConnect: function(param) {
			//allow handshake transfer from scriptAPI only if the "transfer" button is enabled
			if (this._buttonDisabled('transfer')){
			    return;
			}
			this._doOperationWithDn('handshakeTransferConnect', param);
		},
		isCurrentConsultTransferVoiceState: function(){
        	Jacada.Logger.debug("CTIBar.js isCurrentConsultTransferVoiceState clientStateName:" 
        			+ this.ctiClientInfo.clientStateName);
			return (this.ctiClientInfo.clientStateName == 'inconsultation'
					|| this.ctiClientInfo.clientStateName == 'inconsultation_toggle'
					|| this.ctiClientInfo.clientStateName == 'consult_in_progress'
					|| this.ctiClientInfo.clientStateName == 'inconference'
					|| this.ctiClientInfo.clientStateName == 'conference_in_progress'
					|| this.ctiClientInfo.clientStateName == 'in_warm_transfer_consultation'
					|| this.ctiClientInfo.clientStateName == 'in_warm_transfer_consultation_toggle'
        			|| this.ctiClientInfo.clientStateName == 'warm_transfer_in_progress');
		},
		/*********************/
		/* Methods to control UI related to media items: email, chat, etc.
		 */
	    _onMediaButtonClicked: function(operation, uniqueId, channel, data, handler) {
			// remove last error status, but only in case this is not manual mode
			if (!this.isManualMode()) {
				this.cleanError();
			}
			
			return $W().mediaAPI.clickButton(operation, uniqueId, channel, data, handler);
	    },
		processMediaState: function(mediaState){
			
			if(!$W().LayoutByContext){
				Jacada.Logger.error("CTIBAR.js Got media event to process when LayoutByContext is false.");
				return;
			}
			mediaState = Ext.decode(mediaState);
			Jacada.Logger.info("CTIBar.js processing media state: " + mediaState.clientStateName 
					+ ", contextType: " + mediaState.contextType + ", interactionId: " + mediaState.interactionId 
					+ ", errorMsg: " + mediaState.errorMessage);
					
	        var newState = this.states[mediaState.clientStateName];    

	        if (!newState){
	            Jacada.Logger.debug('unexpected state: ' + mediaState.clientStateName);
	            return;
	        }

   	        //Making copy so we could store incoming info on this state 
	        newState = Object.clone(newState);
	        newState.incomingInfo = mediaState;

   			/*
   			 * handling of UI voice states is done in ctiBar.js, showState method,
   			 * So only run state functions, but don't change the UI action bar buttons state etc'. 
   			 */
			if(mediaState.contextType == $W().interactionType.Voice.toLowerCase()){
				var voiceGroupId = Ext.getCmp('contextNavigation').buildVoiceGroupId(mediaState.callId);
	    	    this.applyStateFunctions(newState, voiceGroupId);
	    	    return;
			}

	        var groupId = Ext.getCmp('contextNavigation').buildGroupId(mediaState.interactionId, mediaState.contextType);
	        //if state came for the currect active context, let's apply it
	        //or if applyToAll in the state is set to true, we must run this state
	        //probably, it's incoming media (aka ringing)
	        Jacada.Logger.debug("CTIBar.js buildGroupId="+groupId+", activeGroupId="+$W().activeContext.groupId+", newState.applyToAll?"+newState.applyToAll);
	        if($W().activeContext.groupId == groupId || newState.applyToAll){
	        	this.applyStateToContextGroup(groupId, true, newState);
	        }else{
	        	var mediaGroup = Ext.getCmp('contextNavigation').findNode(groupId);
	        	if(mediaGroup){
	        		mediaGroup.newState = newState;
	        	}
	        	this.applyStateFunctions(newState, groupId);
	        }
		},
		applyStateToVoiceContextGroup: function(groupId){
			var voiceNode = Ext.getCmp('contextNavigation').findNode(groupId);
			if(voiceNode && voiceNode.uiState){
				if(!voiceNode.callExists){
					voiceNode.uiState = this.copyStateSettingsToNoCallStateSettings(this.state, voiceNode.uiState);
				}
				
				this.processVoiceState(voiceNode.uiState, voiceNode.ctiClientInfo);
			}else{
				this.processVoiceState(this.state, this.ctiClientInfo);
			}
			
		},
		copyStateSettingsToNoCallStateSettings: function(fromState, toState){
			toState.status = fromState.status;
			/*
			 * busy and ready button should be kept as is, since they are not coupled to a state, can be changed any time
			 */
			delete toState.busyBtn; 
			delete toState.readyBtn;
			toState.dialBtn = fromState.dialBtn;
			toState.ctiDialNumberField = fromState.ctiDialNumberField;
			return toState;
		},
		applyStateToContextGroup: function(groupId, runFunctions, uiState){
			var mediaGroup = Ext.getCmp('contextNavigation').findNode(groupId);
			//if new uiState was given, let's store it in context group
			//otherwise, let's take is from context group
			if(uiState){
				if(mediaGroup){
					mediaGroup.uiState = uiState;
				}
			}else{
				if(mediaGroup){
					uiState = mediaGroup.uiState; 
				}
				if(!uiState){
					Jacada.Logger.debug("CTIBar.js applyStateToContextGroup no state was found for group " + groupId);
					return;
				}
			}
			Jacada.Logger.debug("CTIBar.js applyStateToContextGroup groupId:"+groupId
					+", state:"+uiState.incomingInfo.clientStateName+", runFunctions?"+runFunctions);
			if(runFunctions){
				this.applyStateFunctions(uiState, groupId);
			}

	        //apply buttons states
	        var element, name;
			$W().incomingInfo = uiState.incomingInfo;
	        for (name in uiState) {
	            element = Ext.getCmp(name);
	            if (element != null) {
	            	Jacada.Logger.debug('### applyStateToContextGroup '+name+"  visible: " + uiState[name].visible 
	            			+ ", enabled: " + uiState[name].enabled);
	            	if(uiState[name].visible != null){
	    	        	if(element.getId() == 'answerEmailBtn' || element.getId() == 'answerChatBtn'){
	    	        		Jacada.Logger.debug("Notification button " + element.getId() + " should be enabled? " + uiState[name].enabled);
	    	        		this.setButtonVisibility(element, uiState[name].visible);
	    	        		if(uiState[name].enabled){
	    	        			element.uniqueId = uiState.incomingInfo.uniqueId;
	    	        			if(element.getId() == 'answerEmailBtn'){
	    	        				element.startNotification({
	    	        					title: uiState.incomingInfo.From,
	    	        					msg: uiState.incomingInfo.Subject,
	    	        					iconCls: 'emailNodeIcon',
	    	        					notificationPopup: uiState.incomingInfo.notificationPopup
	    	        				});
	    	        			}else if(element.getId() == 'answerChatBtn'){
	    	        				element.startNotification({
	    	        					title: $W().localeManager.getLocalizationValue('application.javascript.ctiBar.notification.popup.incomingChat'),
	    	        					msg: Base64.decode(uiState.incomingInfo.CustomerName),
	    	        					iconCls: 'chatNodeIcon',
	    	        					notificationPopup: uiState.incomingInfo.notificationPopup
	    	        				});
	    	        			}
	    	        		}else{
	    	        			//make sure we stop the relevant notification
	    	        			if(element.uniqueId == uiState.incomingInfo.uniqueId){
	    	        				//element.stopNotification();
	    	        				element.disable();
	    	        			}
	    	        		}
	    	        	//Handle other cases
	    	        	}else if(uiState[name].visible){
	    	                element.show();
	    	            }else{
	    	                element.hide();
	    	            }
	    	        	//if it's directorySearchBtn and item was retrieved we need to disable the button
	    	        	if(element.getId() == 'directorySearchBtn' && uiState 
	    	        			&& uiState.incomingInfo && uiState.incomingInfo.retrieved){
	    	        		Jacada.Logger.debug("CTIBar.js applyStateToContextGroup 'directorySearchBtn' retrieved? true - disabling.");
	    	        		element.disable();
	    	        	}else{
	    	        		$W().cti._setEnabledDisabled(element, uiState[name].enabled);  
	    	        	}
	    	        }   
	            }
	        }
		},
		applyStateFunctions: function(uiState, groupId){
	        // run custom functions that appear in the 'functionsToRun' property, e.g. functionsToRun: { function1: "_removeAddContent"}
	        var functionsToRun = uiState.functionsToRun;    
	        if(functionsToRun != null) {
	            var i; for (i=1; functionsToRun["function" + i] != null ; i++){
	                var funcName = functionsToRun["function" + i];
	                Jacada.Logger.debug("running function " + funcName +", this[funcName]"+this[funcName]);
	                if (this[funcName] != null){                
	                    this[funcName](uiState, groupId);
	                }
	                else{
	                    alert('CTIBar.js: functionsToRun - function not found: ' + funcName);
	                }
	            }
	        }        
		},
		getGroupIdByCallId: function(callId){
			return this.callIds[callId];
		},
		storeCallId: function(callId, groupId){
			this.callIds[callId] = groupId;
		},
		clearCallId: function(callId){
			delete this.callIds[callId];
		},
		answerMediaBlocked: function(data){
			data = Ext.decode(data);
			var msg = $W().localeManager.getLocalizationValue('application.javascript.media.answerBlocked.message');
			msg = Ext.String.capitalize(Ext.String.format(msg, data.contextType));
			var title = $W().localeManager.getLocalizationValue('application.javascript.media.answerBlocked.title');
			title = Ext.String.format(title, data.contextType);
			$W().HideCurrentVisibleTab();
			Ext.Msg.show({
				title: title,
				msg: msg,
				buttons: Ext.Msg.OK,
				icon: Ext.Msg.ALERT,
				fn: function(){
					$W().ShowCurrentVisibleTab();
				}
			});
		},
		mediaCallDropped: function(callId){
			var groupId = this.callIds[callId];
			if(groupId){
				var group = Ext.getCmp('contextNavigation').findNode(groupId);
				if(group){
					if(group.data.secondaryItemId && group.callId != callId){
						/*
						 * At this point, this is consultaion call and one of the call has dropped,
						 * But there is still a call going on so don't set callExists to false
						 */
						return;
					}
					
					group.callExists = false;
					Jacada.Logger.debug("CTIBar mediaCallDropped call " + callId 
							+ " dropped for " + groupId);
				}
			}else{
				Jacada.Logger.debug("CTIBar mediaCallDropped call " + callId 
						+ " was not found");
			}
		},
		customerCallDropped: function(callId){
			if(!$W().LayoutByContext){
				return;
			}
			var contextNavigation = Ext.getCmp('contextNavigation');
			var groupId = contextNavigation.buildVoiceGroupId(callId);
			var node = contextNavigation.findNode(groupId);
			if(node && !node.isInternalCall){
				if(this.ctiClientInfo.clientStateName == 'transferred_incall_conferenced'){
					Jacada.Logger.debug("Ctibar.customerCallDropped(), will not set dropped call related to conference with call id: " + callId);
					return;
				}
				Jacada.Logger.debug("Ctibar.customerCallDropped(), call dropped with call id: " + callId + ", updating node with groupId: " + groupId);
				node.callExists = false;
				node.customerDropped = true;
				
			}else{
				Jacada.Logger.warn("Ctibar.customerCallDropped(), no node found with group id: " + groupId);
			}
		},
		startEmailContext: function(uiState, groupId){
			Jacada.Logger.debug("CTIBar.js startEmailContext interactionId:" 
					+ uiState.incomingInfo.interactionId + ", uniqueId:"+uiState.incomingInfo.uniqueId);
			var emailGroup = Ext.getCmp('contextNavigation').createEmailContextGroup(uiState.incomingInfo);
			emailGroup.uiState = uiState;
			if(uiState.incomingInfo.retrieved){
				emailGroup.callExists = false;
			}else{
				this.storeCallId(uiState.incomingInfo.callId, groupId);
				emailGroup.callId = uiState.incomingInfo.callId;
				emailGroup.callExists = true;
			}
		},
		finishEmailContext: function(uiState, groupId){
			Jacada.Logger.debug("CTIBar.js finishEmailContext interactionId:" 
					+ uiState.incomingInfo.interactionId + ", uniqueId:"+uiState.incomingInfo.uniqueId);
			var group = Ext.getCmp('contextNavigation').removeEmailContextGroupNode(uiState.incomingInfo.interactionId);
			if(group && group.callId){
				this.clearCallId(group.callId);
			}
		},
		replyEmail: function(uiState, groupId){
			Jacada.Logger.debug("CTIBar.js replyEmail interactionId:" 
					+ uiState.incomingInfo.interactionId + ", uniqueId:"+uiState.incomingInfo.uniqueId);
			var emailInfoPanel = this.getEmailInfoPanel(groupId);
			if(emailInfoPanel){
				emailInfoPanel.reply(uiState.incomingInfo);
			}
		},
		replyAllEmail: function(uiState, groupId){
			Jacada.Logger.debug("CTIBar.js replyAllEmail interactionId:" 
					+ uiState.incomingInfo.interactionId + ", uniqueId:"+uiState.incomingInfo.uniqueId);
			var emailInfoPanel = this.getEmailInfoPanel(groupId);
			if(emailInfoPanel){
				emailInfoPanel.replyAll(uiState.incomingInfo);
			}
		},
		forwardEmail: function(uiState, groupId){
			Jacada.Logger.debug("CTIBar.js forwardEmail interactionId:" 
					+ uiState.incomingInfo.interactionId + ", uniqueId:"+uiState.incomingInfo.uniqueId);
			var emailInfoPanel = this.getEmailInfoPanel(groupId);
			if(emailInfoPanel){
				emailInfoPanel.forward(uiState.incomingInfo);
			}
		},
		applySendEmailMask: function(uiState, groupId){
			Jacada.Logger.debug("CTIBar.js applySendEmailMask interactionId:" 
					+ uiState.incomingInfo.interactionId + ", uniqueId:"+uiState.incomingInfo.uniqueId);
			var emailInfoPanel = this.getEmailInfoPanel(groupId);
			if(emailInfoPanel){
				emailInfoPanel.applySendEmailMask(uiState.incomingInfo);
			}
		},
		restoreOriginalEmailContext: function(uiState, groupId){
			Jacada.Logger.debug("CTIBar.js restoreOriginalEmailContext interactionId:" 
					+ uiState.incomingInfo.interactionId + ", uniqueId:"+uiState.incomingInfo.uniqueId);
			var emailInfoPanel = this.getEmailInfoPanel(groupId);
			if(emailInfoPanel){
				emailInfoPanel.restoreOriginalEmailContext(uiState.incomingInfo);
			}
		},
		getEmailInfoPanel: function(groupId){
			var emailInfoTab = Ext.getCmp('contextContentPanel').getTab('EmailInfoTab' + groupId, groupId);
			if(emailInfoTab){
				return emailInfoTab.items.items[0].child();
			}
			Jacada.Logger.error("could not find EmailInfoTab. groupId:" + groupId);
		},
		getChatInfoPanel: function(groupId){
			var chatInfoTab = Ext.getCmp('contextContentPanel').getTab('ChatInfoTab' + groupId, groupId);
			if(chatInfoTab){
				return chatInfoTab.items.items[0].child();
			}
			Jacada.Logger.error("could not find ChatInfoTab. groupId:" + groupId);
		},
		startChatContext: function(uiState, groupId){
			Jacada.Logger.debug("CTIBar.js startChatContext interactionId:" 
					+ uiState.incomingInfo.interactionId + ", uniqueId:"+uiState.incomingInfo.uniqueId);
			uiState.incomingInfo.customerName = Base64.decode(uiState.incomingInfo.customerName);
			var chatGroup = Ext.getCmp('contextNavigation').createChatContextGroup(uiState.incomingInfo);
			chatGroup.uiState = uiState;
			if(uiState.incomingInfo.retrieved){
				chatGroup.callExists = false;
			}else{
				this.storeCallId(uiState.incomingInfo.callId, groupId);
				chatGroup.callId = uiState.incomingInfo.callId;
				chatGroup.callExists = true;
			}
		},
		disableChatWindow: function(uiState, groupId){
			Jacada.Logger.debug("CTIBar.js disableChatWindow interactionId:" 
					+ uiState.incomingInfo.interactionId + ", uniqueId:"+uiState.incomingInfo.uniqueId);
			var chatInfoTab = this.getChatInfoPanel(groupId);
			//mark this item as closed
			var contextMenu = Ext.getCmp('contextBtnMenu');
			var item = contextMenu.getComponent(groupId +'-contextMenu');
			if(item){
    			item.chatClosed = true;
    		}
			if(chatInfoTab){
				chatInfoTab.disableChatWindow(uiState.incomingInfo.closingReason);
				chatInfoTab.up('#tabPanelHolder').down('#chatAutoTextPanel').disable();
			}
			
		},
		hasLiveChatSessions: function(){
			var contextMenu = Ext.getCmp('contextBtnMenu');
			var result = false;
			if(contextMenu && contextMenu.items && contextMenu.items.length>0){
				contextMenu.items.each(function(item){
					if(item.interactionType == $W().interactionType.Chat){
						if(!item.chatClosed){
							//found live chat session
							result = true;
							//break the loop
							return false;
						}
					}
				});
			}
			return result;	
		},
		finishChatContext: function(uiState, groupId){
			Jacada.Logger.debug("CTIBar.js finishChatContext interactionId:" 
					+ uiState.incomingInfo.interactionId + ", uniqueId:"+uiState.incomingInfo.uniqueId);
			var group = Ext.getCmp('contextNavigation').removeChatContextGroupNode(uiState.incomingInfo.interactionId);
			if(group && group.callId){
				this.clearCallId(group.callId);
			}
		},
		startBusinessVoiceContext: function(ctiClientInfo){
			
        	if($W().LayoutByContext){
        		var contextNavigation = Ext.getCmp('contextNavigation');
				var numberInfo = this.chekcAniContainLetters(ctiClientInfo.ANI, ctiClientInfo.DNIS);
        		
	    		var data = {
	    			numberInfo: numberInfo,
	    			callId: $W().cti.isManualMode()?numberInfo:ctiClientInfo.callId,
	    			uniqueId: $W().cti.isManualMode()?numberInfo:ctiClientInfo.uniqueId,
	    			transferredUniqueId: $W().cti.isManualMode()?null:ctiClientInfo.transferredUniqueId
	    		};
        		var voiceGroup = contextNavigation.createVoiceContextGroup(data);
        		if(!voiceGroup){
        			Jacada.Logger.warn("CTIBar.startBusinessVoiceContext(), voice Group not created for call id: " + ctiClientInfo.callId);  
        			return;	
        		}
        		
    			voiceGroup.callId = ctiClientInfo.callId;
    			voiceGroup.callExists = true;
    			var groupId = contextNavigation.buildVoiceGroupId(ctiClientInfo.callId);
    			this.storeCallId(ctiClientInfo.callId, groupId);
    			if(voiceGroup && !voiceGroup.media){
        			//retrieve VoiceMediaItem
        			var retrievedata = {
        				uniqueId: ctiClientInfo.uniqueId,
        				caller:'startBusinessVoiceContext',
        				transferredUniqueId: ctiClientInfo.transferredUniqueId
        				};
					if(this.isEMCCTIProvider()){
	        			this.retrieveVoiceMediaItem(retrievedata);
					}
    			}
        	}else{
        		$W().activeContext = {
					interactionId: ctiClientInfo.callId,
					interactionType: $W().interactionType.Voice,
					groupId: $W().interactionType.General
				};
        	}
		},
		retrieveVoiceMediaItem: function(data){
            // Call to bring VoiceMediaItem
			var params = {
				uniqueId: data.transferredUniqueId ? data.transferredUniqueId : data.uniqueId,
				Caller: data.caller,
				interactionId: data.transferredUniqueId
			};
			
			$W().mediaAPI.clickButton('retrieveMediaItem', params.uniqueId, $W().interactionType.Voice.toLowerCase(), params, function(){});
		},		
		acceptedVoiceMediaItem: function(data){
			//Voice context is managed by callId
			var contextNavigation = Ext.getCmp('contextNavigation');
    		if (!data || !data.incomingInfo || !data.incomingInfo.retrieved) {
    			Jacada.Logger.error("CTIBar.acceptedVoiceMediaItem(), data is empty or was not retrieved");
    			return;
            }

			var groupId = contextNavigation.buildVoiceGroupId(data.incomingInfo.callId);
			//if customer history registered to listen context changes, it registers with interactionId instead
			//of callId, which is used to manage voice opntext
			//we need to move these listeners to use call Id
			contextNavigation.reregisterContextListeners(contextNavigation.buildVoiceGroupId(data.incomingInfo.interactionId), groupId);
			var voiceNode = contextNavigation.findNode(groupId);
			if (voiceNode) {
				Jacada.Logger.debug("CTIBar.acceptedVoiceMediaItem(), Set media data for Node with groupId: " + groupId);
				voiceNode.media = data.incomingInfo;
				contextNavigation.fireContextDataChangedEvent(voiceNode.media.contextType, voiceNode.media, $W().activeContext.groupId, 'media');
				return;
			}else{
				Jacada.Logger.debug("CTIBar.acceptedVoiceMediaItem(), voice work item retrieved from history without a call");
				data = data.incomingInfo;
			}
            
			var numberInfo = this.chekcAniContainLetters(data.ani, data.dnis);
			data.numberInfo = numberInfo;
			var voiceGroup = contextNavigation.createVoiceContextGroup(data);
			if(!voiceGroup){
				Jacada.Logger.warn("CTIBar.startBusinessVoiceContext(), voice Group not created for call id: " + data.callId);  
				return;	
			}
			
			//voice media item from history without a call
			voiceGroup.callExists = false;
			voiceGroup.media = data;
			voiceGroup.ctiClientInfo = data;
			voiceGroup.fromHistory = true;
			voiceGroup.uiState = this.copyStateSettingsToNoCallStateSettings(this.state, Object.clone(this.states[this.getNoCallStateName()]));
			this.processVoiceState(voiceGroup.uiState, data);
		},
		startInternalVoiceContext: function(ctiClientInfo){
			
        	if($W().LayoutByContext){
        		var contextNavigation = Ext.getCmp('contextNavigation');
        		voiceNode = contextNavigation.createInternalVoiceContext(ctiClientInfo);
        		if(voiceNode){
        			if(!this.getGroupIdByCallId(ctiClientInfo.callId)){
        				voiceNode.callExists = true;
		        		this.storeCallId(ctiClientInfo.callId, voiceNode.data.itemId);
        			}
        		}
        	}
		},
		voiceCallActive: function(ctiClientInfo){
			//This call became active, updating activeCall reference
			var contextNavigation = Ext.getCmp('contextNavigation');
        	var groupId = contextNavigation.buildGroupId(ctiClientInfo.callId, $W().interactionType.Voice);
	        var voiceNode = contextNavigation.findNode(groupId);
	        if(voiceNode && voiceNode.callExists){
	        	Jacada.Logger.debug("CTIBar.voiceCallActive,  Setting activeCallUniqueId to: " + voiceNode.callId);
	        	contextNavigation.activeCallUniqueId = voiceNode.callId;
	        }else{
	        	Jacada.Logger.debug("CTIBar.voiceCallActive, could not find voice Node for callId: " + ctiClientInfo.callId);
	        	this.startBusinessVoiceContext(ctiClientInfo);
	        }
		},
		/*********************/
		 /********/
		 /*     Methods to control the displayed timers - Item or Call*/
		 /********/
		 _setCallTimersEnable:function(){
//		    //BUG 57518 this.saveItemTimers();
//		    this._setItemTimersDisable();
//		    this._updateAHT();
//		    //show call timer, total call time, totals calls and AHT for calls
//		    $("CallTime").style.visibility = "visible";
//		    $("CallTime").style.display = 'inline';
//		    $("TotalTime").style.visibility = "visible";
//		    $("TotalTime").style.display = 'inline';
//		    $("TotalCallNumber").style.visibility = "visible";
//		    $("TotalCallNumber").style.display = 'inline';
//		    $("CallTimeCaption").innerHTML = $W().localeManager.getLocalizationValue("application.javascript.ctiCallInfoBar.label.callTime");
//		    $("TotalCallCaption").innerHTML = $W().localeManager.getLocalizationValue("application.javascript.ctiCallInfoBar.label.totalCalls");//"Total Items:&nbsp;&nbsp;&nbsp;";
		 },
		 
		 _setCallTimersDisable:function(){
//		    //hide call timer, total call time, totals calls and AHT for calls
//		    $("CallTime").style.visibility = "hidden";
//		    $("CallTime").style.display = 'none';
//		    $("TotalTime").style.visibility = "hidden";
//		    $("TotalTime").style.display = 'none';
//		    $("TotalCallNumber").style.visibility = "hidden";
//		    $("TotalCallNumber").style.display = 'none';
		 },
		 
		 _setItemTimersEnable:function(){
//		    this._setCallTimersDisable();
//		    this._updateItemAHT();
//		    //show item timer, total item time, totals items and AHT for items
//		    $("ItemTime").style.visibility = "visible";
//		    $("ItemTime").style.display = 'inline';
//		    $("TotalItemTime").style.visibility = "visible";
//		    $("TotalItemTime").style.display = 'inline';
//		    $("TotalItemNumber").style.visibility = "visible";
//		    $("TotalItemNumber").style.display = 'inline';
//		    $("CallTimeCaption").innerHTML = $W().localeManager.getLocalizationValue("application.javascript.ctiCallInfoBar.label.itemTime");
//		    $("TotalCallCaption").innerHTML = $W().localeManager.getLocalizationValue("application.javascript.ctiCallInfoBar.label.totalItems");//"Total Items:&nbsp;&nbsp;&nbsp;";
		 },
		 
		 _setItemTimersDisable:function(){
//		    //hide item timer, total item time, totals items and AHT for items
//		    $("ItemTime").style.visibility = "hidden";
//		    $("ItemTime").style.display = 'none';
//		    $("TotalItemTime").style.visibility = "hidden";
//		    $("TotalItemTime").style.display = 'none';
//		    $("TotalItemNumber").style.visibility = "hidden";
//		    $("TotalItemNumber").style.display = 'none';
		 },
		 saveTimers: function() {      
//		     var date = new Date();
//		     
//		 
//		      var elapsedTime = this.callTimer.getTotalTime() +
//		                       this.holdTimer.getTotalTime() +
//		                       this.wrapupTimer.getTotalTime() +
//		                       this.preparationTimer.getTotalTime(); 
//		     
//		     this.totalCallTime += elapsedTime;
//			 
//		     this._updateAHT();
//
//		     var parm = '&callTimer=' + this.callTimer.getElapsedTime(date);
//		     parm    += '&holdTimer=' + this.holdTimer.getElapsedTime(date);
//		     parm    += '&wrapupTimer=' + this.wrapupTimer.getElapsedTime(date);
//		     parm    += '&preparationTimer=' + this.preparationTimer.getElapsedTime(date); 
//		     parm    += '&totalCalls=' + this.ctiClientInfo.numberOfCalls;
//		     parm    += '&totalCallTime=' + Math.round(this.totalCallTime / 1000);
//		     parm    += '&last=';
//
//		     this.ctiAPI.setTimers(parm); 
//		     this.callTimer.updateColor();
//		     this.holdTimer.updateColor();
//		     this.wrapupTimer.updateColor();
//		     this.totalTimer.updateColor();
		  },
		  
		  saveItemTimers: function() {  
		     
//		     var date = new Date();
//		     
//		     //this._summarizeItemTimersAfterCall(date);
//
//		     //var elapsedSecs = this.itemTimer.getElapsedTime(date) ; 
//		     var elapsedSecs = this.itemTimer.getTotalTime();
//		     this.totalItemTime += elapsedSecs;
//		     this._updateItemAHT();
//
//		     /*no need to send to server since it is not saved on the server side
//		      * var parm = 'itemTimer=' + this.itemTimer.getElapsedTime(date); 
//		     parm    += '&totalItems=' + this.ctiClientInfo.numberOfCustomItems;
//		     parm    += '&totalItemTime=' + this.totalItemTime;
//		     parm    += '&last=';
//		     
//		     this._makeAction('setItemTimers', parm, false)*/; 
		  },

		///////////////////////////////////////////////////////////////////////////////////////
		  
		  
		  
		  _stopTimers: function(date) {
//		     this.totalTimer.stop(date);
//		     this.callTimer.stop(date);
//		     this.holdTimer.stop(date);
//		     this.wrapupTimer.stop(date);
//		     this.preparationTimer.stop(date);
//		     
//		     this.onTimerEvent();
		  },

		  _resetTimers: function(date) {
//		     this.totalTimer.reset(date);
//		     this.callTimer.reset(date);
//		     this.holdTimer.reset(date);
//		     this.wrapupTimer.reset(date);
//		     this.preparationTimer.reset(date);
//
//		     this.onTimerEvent();
		  }
		 
});    