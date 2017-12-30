/*
 * This class is in charge for the main navigation bar in WorkSpace
 */
Ext.define('Jacada.core.layout.ContextNavigationPanel', {
    extend: 'Ext.tree.Panel',

    id: 'contextNavigation',
    cls: 'contextNavigation',
    bodyCls: 'contextNavigation',
    border: false,
    useArrows: true,
    rootVisible: false,
    bodyStyle : 'border-top-color: white;',
    width: 185,
    activeVoiceNodeId: null,
    activeWorkItemNodeId: null,
    activeCall: null,
    customSectionPropertiesCache: null,//caches the custom data for a selected object (task, voice etc.)
    contextObservers: null, //hold handlers to be invoked upon context started/ended
    pendingCustomerSearchResults: null,  //sometimes server sends results before context is ready
    
    listeners:{
    	select: function(container, record, index, eOpts){
    		
    		Jacada.Logger.debug("contextNavigation select itemId: " + record.data.itemId 
    				+ ", leaf? " + record.data.leaf + ", interactionType: " + record.data.interactionType);
    		if(record.data.leaf){
    			if(record.parentNode.inAnimation){
    				Ext.getCmp('contextNavigation').clearNodeAnimation(record.parentNode);
    			}
    			Ext.getCmp('contextNavigation').updateActiveContext(record.parentNode.raw, record.data.interactionType);
    			Ext.getCmp('contextContentPanel').loadItem(record.data.itemId, $W().activeContext.groupId);
    			Ext.getCmp('contextNavigation').fireContextTabChangedEvent(record.data.interactionType, record.raw, $W().activeContext.groupId);
    		}else{
    			if(record.inAnimation){
    				Ext.getCmp('contextNavigation').clearNodeAnimation(record);
    			}
    			Ext.getCmp('contextNavigation').updateActiveContext(record.raw, record.data.interactionType);
    		}
    	}
    },
    clearNodeAnimation: function(node){
    	clearInterval(node.inAnimation);
    	node.isNotificationIconShown = false;
		node.inAnimation = false;
		node.set('iconCls', node.originalIconCls);
    },
    initComponent: function() {
        var me = this;
        me.activeCall = {
        	uniqueId: null,
        	interactionType: $W().interactionType.General
        };
        me.contextObservers = {
        		allGroups: {}
        };
        me.pendingCustomerSearchResults = {}; //sometimes server sends results before context is ready
        Ext.applyIf(me, {
            store: me.createStore()
        });
        $W().activeContext = {};
        me.customSectionPropertiesCache = {};
        me.updateActiveContext(null, $W().interactionType.General);
        me.registerForMessages();
        me.callParent(arguments);
    },
    registerForMessages: function(){
    	//Voice push messages
    	Push.registerEventHandler('END_INTERNAL_CALL', this.removeInternalVoiceContext.bind(this)); 
    	//Push.registerEventHandler('UNLOAD_SCRIPT', this.removeVoiceContextGroupNode.bind(this));
    	//WorkItem push messages
    	Push.registerEventHandler('START_CUSTOM_ITEM', this.createWorkItemContextGroupNode.bind(this));
    	Push.registerEventHandler('CUSTOM_ITEM_DONE', this.removeWorkItemContextGroupNode.bind(this));
    	Push.registerEventHandler('newChatMessage', this.notifyOnNewChatMessage.bind(this));
    	Push.registerEventHandler('selectMediaContext', this.selectContextGroup.bind(this));
    	Push.registerEventHandler('customerInfoUpdate', this.notifyCustomerInfoUpdate.bind(this));
    },
    selectContextGroup: function(args){
    	args = Ext.decode(args);
    	var groupId = this.buildGroupId(args.interactionId, args.contextType);
    	var node = this.findNode(groupId);
    	if(node){
    		//node already exists
    		this.getView().select(node.firstChild);
    	}else{
    		Jacada.Logger.warn("Did not find context group for interactionId:" 
    				+ args.interactionId + ", contextType:" + args.contextType);
    	}
    	
    },
    createStore: function(){
    	var nodes = new Array();
    	$W().tabItems.each(function(tabConfig){
    		var interactionType = tabConfig.interactionType;
    		//put under 'Home' group everything without a type
    		if (!interactionType || interactionType.length == 0 || interactionType.indexOf($W().interactionType.General)>=0){
    			if(!tabConfig.hidden){
    				nodes.push({itemId: tabConfig.itemId, text: tabConfig.title, leaf: true, interactionType: $W().interactionType.General});
    			}
    		}
		});
    	var title =  $W().localeManager.getLocalizationValue('application.javascript.ui.interactionType.general');
    	var homeNode = this.createContextGroupNode($W().interactionType.General, title, nodes, $W().interactionType.General);
    	
    	Ext.define('InteractionTreeNode.Model', {
    	    extend: 'Ext.data.TreeModel',
    	    defaultProxyType: 'memory',
    	    proxy: 'memory',
    	  //all basic fields will be added automatically
    	    fields: ['itemId', 'text', 'interactionType']
    	});
    	
    	var proxy = Ext.create('Ext.data.TreeStore', {
    		model: 'InteractionTreeNode.Model',
    		proxy: 'memory',
            root: {
                expanded: true,
                children: homeNode
            }
        });
    	return proxy;

    },
    removeTab: function(tabId){
    	var me = this;
    	//try to search for the tab in the active context
    	var contextTabId = me.getActiveTabIdByContext(tabId);
    	Jacada.Logger.debug("contextNavigation removeTab ActiveTabIdByContext: " + contextTabId);
    	var node = this.getRootNode().findChild('itemId', contextTabId, true);
    	if(!node){
    		//search according to the actual given tabId
    		node = this.getRootNode().findChild('itemId', tabId, true);
    	}
    	if(node){
    		node.remove(true);
    		//select the default tab specified in override.js
    		this.getView().select(this.findNode(getDefaultActiveTab()));
    	}
    },
    showTab: function(tabId){
    	var me = this;
    	//try to search for the tab in the active context
    	var contextTabId = me.getActiveTabIdByContext(tabId);
    	Jacada.Logger.debug("contextNavigation showTab ActiveTabIdByContext: " + contextTabId);
    	var node = this.getRootNode().findChild('itemId', contextTabId, true);
    	if(!node){
    		//search according to the actual given tabId
    		node = this.getRootNode().findChild('itemId', tabId, true);
    	}
    	//check if we need to add this tab on the fly
    	if(!node){
    		//search for the tab config
    		$W().tabItems.each(function(tabConfig){
	    		if(tabConfig.itemId == tabId){
	    			var groupId = $W().activeContext.groupId;
	    			var groupNode = null;
	    			var interactionType = $W().activeContext.interactionType;
	    			//check if the tab belongs to the active group, if not, try the General group
	    			if(tabConfig.interactionType.indexOf(interactionType) > -1){
	    				groupNode = me.findNode(groupId);//find the group id of the active group
	    				//build the tab
	    				var tabExists = Ext.getCmp('contextContentPanel').isTabExists(tabConfig.itemId+groupId, groupId);
	    				Jacada.Logger.debug("contextNavigation showTab check if tab exists  " + tabConfig.itemId+groupId+"   "+interactionType);
	    				Jacada.Logger.debug("contextNavigation showTab tabExists?  " + tabExists);
	    				if(groupNode && !tabExists){
	    					Jacada.Logger.debug("contextNavigation showTab creating tab");
	    					var clonedCfg = Ext.Object.merge({}, tabConfig );
	    					//override some properties (such as new id)
	    					clonedCfg = Ext.Object.merge(clonedCfg, {id:tabConfig.id+groupId, itemId: tabConfig.itemId+groupId, loaded:false, closable: false});
	    					Ext.getCmp('contextContentPanel').addTab(clonedCfg, interactionType, groupId);
	    				}
	    			}else if(tabConfig.interactionType.indexOf($W().interactionType.General) > -1){
	    				groupNode = me.findNode($W().interactionType.General);
	    				contextTabId = tabId;
	    				interactionType = $W().interactionType.General;
	    			}
	    			if(groupNode){
	    				node = groupNode.appendChild({itemId: contextTabId,id: contextTabId, text: tabConfig.title, leaf: true, interactionType:interactionType});
	    			}
	    			return false; //break the loop
	    		}
			});
    	}
    	if(node){
    		this.getView().select(node);
    	}
    },
	getActiveTabIdByContext: function(tabId){
		if($W().activeContext.interactionType == $W().interactionType.General){
			return tabId;
		}
		return tabId + $W().activeContext.groupId;
	},
    createContextGroupNode: function(itemId, title, children, interactionType){
    	var iconCls = interactionType.toLowerCase() + 'NodeIcon';
    	return { itemId: itemId, text: title, expanded: true, children:children, 
    		interactionType: interactionType, iconCls: iconCls};
    },
    findNode: function(itemId){
    	
    	var node = this.getRootNode().findChild('itemId', itemId, true);
    	if(!node){
   			node = this.getRootNode().findChild('secondaryItemId', itemId, true);
    	}

    	if(!node){
	    	Jacada.Logger.debug('Could not find tree node with itemId: '+itemId);
    	}
    	return node;
    },
    buildGroupId: function(interactionId, interactionType){
    	interactionType = interactionType.toLowerCase();
    	interactionId = interactionId.toLowerCase();
    	
    	if(interactionType == $W().interactionType.Tasks.toLowerCase()){
    		return this.buildTaskGroupId(interactionId);
    	}
    	if(interactionType == $W().interactionType.Voice.toLowerCase()){
    		return this.buildVoiceGroupId(interactionId);
    	}
    	if(interactionType == $W().interactionType.Email.toLowerCase()){
    		return this.buildEmailGroupId(interactionId);
    	}
    	if(interactionType == $W().interactionType.WorkItem.toLowerCase()){
    		return this.buildWorkItemGroupId(interactionId);
    	}
    	if(interactionType == $W().interactionType.Chat.toLowerCase()){
    		return this.buildChatGroupId(interactionId);
    	}
    	return null;
    },
    removeContextGroupNode: function(itemId){
    	var node = this.findNode(itemId); 
		if(node){
			Jacada.Logger.debug('removeContext '+itemId);
			Ext.getCmp('contextContentPanel').removeContext(itemId);
			//remove the group from the navigation tree
			node.remove();
			$W().cti.removeContextGroup(itemId);
			return node;
		}
		return false;
    },
    removeVoiceContextGroupNode: function(args){
    	//more then 1 voice node can exits, since some context are still open without live call
    	var node;
    	//find voice node with id 
    	if(args.groupId && args.groupId != null){
    		node = this.removeContextGroupNode(args.groupId);
    		this.customSectionPropertiesCache[args.groupId] = null;
    		$W().cti.clearCallId(args.callId);
    		this.activeVoiceNodeId = null;
    	}
    	//select the default tab specified in override.js
    	this.getView().select(this.findNode(getDefaultActiveTab()));
    	return node;
    },
    removeInternalVoiceContext:function(args){
    	
    	//more then 1 voice node can exist, since some context are still open without live call
    	args = Ext.decode(args);
    	var node;
    	var groupId = null;
   		groupId = this.buildVoiceGroupId(args.callId);
    	
    	if(groupId){
    		node = this.findNode(groupId);
    		if(node){
    			/*
    			 * the call id for busniess call can become internal call in conference,
    			 * don't remove the business context, let close button alow that. 
    			 */
    			if(!node.isInternalCall && $W().cti.prevStateNameNotCurrent.indexOf('internal_incall') == -1){
    				Jacada.Logger.debug('ContextNavigation.removeInternalVoiceContext: Will not remove not internal call node for groupId: ' + groupId);
    				return;
    			}
    			
	    		/*
	    		 * return and don't remove the node for customer disconnected in the following states:
	    		 * inconference  - from agent perspective, don't remove context,to let agent keep dispostion. close button allow closing the context.
	    		 * transferred_inhold - during soft return, customer drops call id changes to the consultation call, keep the context to let close button close the context.
	    		 */    			
    			if(node.customerDropped){
    				Jacada.Logger.debug('ContextNavigation.removeInternalVoiceContext: Customer Dropped, Will not remove node with business context for groupId: ' + groupId);
    				return;
	    		}
	    		
    		}
    		
    		/*
    		 * for EMC only:
    		 * transferred_incall_conferenced - from super perspective, leave the node to take media from internal call when business call starts in case agent hangs up.
    		 */
    		if($W().cti.isEMCCTIProvider()){
	    		if ($W().cti.ctiClientInfo.clientStateName == 'transferred_incall_conferenced'){
	    			return;
	    		}
    		}
    		
    		node = this.removeContextGroupNode(groupId);
    		//if at some point we will have a node for internal call, it will have callId stored on it
    		//if we do not have, clear default value
    		if(node){
    			$W().cti.clearCallId(node.callId);
    		}
    		
    		this.customSectionPropertiesCache[node.callId] = null;
    		this.activeVoiceNodeId = null;
	    	this.getView().select(this.findNode(getDefaultActiveTab()));
    	}
    	return node;
    },
    removeWorkItemContextGroupNode: function(args){
    	/*
    	 * There is no longer only 1 item at work since voice context are still left open,
    	 * Each voice context has it's own node.
    	 */
    	if(this.activeWorkItemNodeId){
    		this.removeContextGroupNode(this.activeWorkItemNodeId);
    		this.customSectionPropertiesCache[this.activeWorkItemNodeId] = null;
    		this.activeWorkItemNodeId = null;
    		//select the default tab specified in override.js
    		this.getView().select(this.findNode(getDefaultActiveTab()));
    	}
    },
    removeTaskContextGroupNode: function(taskId){
    	var groupId;
    	var prefix = '-'+$W().interactionType.Tasks+'-';
    	if(taskId){
    		groupId = prefix + taskId;
    	}else{
    		groupId = this.getActiveGroupId();
    	}
    	if(groupId){
    		if(!taskId){
    			taskId = groupId.substring(prefix.length - 1, groupId.length);
    		}
    		Jacada.Logger.debug("closing node Task (" + taskId + ") group: " + groupId);
    		var removed = this.removeContextGroupNode(groupId);
    		if(removed){
	    		this.customSectionPropertiesCache[taskId] = null;
	    		//select the tasksTab, if it is already selected, force selection again for the actionbar to change
	    		var tasksTabNode = this.findNode('tasksTab');
	    		if(this.getView().isSelected(tasksTabNode)){
	    			this.getView().deselect(tasksTabNode);
	    		}
	    		this.getView().select(tasksTabNode);
    		}
    	}
    },
    removeEmailContextGroupNode: function(emailId){
    	var groupId;
    	var prefix = '-'+$W().interactionType.Email+'-';
    	if(emailId){
    		groupId = prefix + emailId;
    	}else{
    		groupId = this.getActiveGroupId();
    	}
    	if(groupId){
    		if(!emailId){
    			emailId = groupId.substring(prefix.length - 1, groupId.length);
    		}
    		Jacada.Logger.debug("closing node Email (" + emailId + ") group: " + groupId);
    		var removed = this.removeContextGroupNode(groupId);
    		if(removed){
	    		this.customSectionPropertiesCache[emailId] = null;
	    		var defaultTabNode = this.findNode(getDefaultActiveTab());
	    		if(this.getView().isSelected(defaultTabNode)){
	    			this.getView().deselect(defaultTabNode);
	    		}
	    		this.getView().select(defaultTabNode);
    		}
    	}
    },
    removeChatContextGroupNode: function(chatId){
    	var groupId;
    	var prefix = '-'+$W().interactionType.Chat+'-';
    	if(chatId){
    		groupId = prefix + chatId;
    	}else{
    		groupId = this.getActiveGroupId();
    	}
    	if(groupId){
    		if(!chatId){
    			chatId = groupId.substring(prefix.length - 1, groupId.length);
    		}
    		Jacada.Logger.debug("closing node Chat (" + chatId + ") group: " + groupId);
    		var removed = this.removeContextGroupNode(groupId);
    		if(removed){
	    		this.customSectionPropertiesCache[chatId] = null;
	    		var defaultTabNode = this.findNode(getDefaultActiveTab());
	    		if(this.getView().isSelected(defaultTabNode)){
	    			this.getView().deselect(defaultTabNode);
	    		}
	    		this.getView().select(defaultTabNode);
    		}
    	}
    },
    createVoiceContextGroupNode: function(args){
    	args = Ext.decode(args);
    	return this.createVoiceContextGroup(args.DNIS, args.DNIS);
    },
    createVoiceContextGroup: function(data){
    	var idSuffix = this.buildVoiceGroupId(data.callId);
    	Jacada.Logger.debug('inside createVoiceContextGroup idSuffix: ' + idSuffix);
    	var node = this.findNode(idSuffix);
    	if(node){
    		if(node.isInternalCall){
    			Jacada.Logger.debug('createVoiceContextGroup found internal call node');
    			var media = node.media;
				for (var prop in media) {
				    if (media.hasOwnProperty(prop)) {
				        data[prop] = media[prop];
				    }
				}
				
    			this.activeVoiceNodeId = idSuffix;
    			//If internal node changes to business, we need keep custom section properties
    			//we could get an update before this.
    			var customProps = this.customSectionPropertiesCache[data.callId];
    			this.removeInternalVoiceContext(Ext.JSON.encode(data));
    			//if customer properties were updated, customer id was transfered before we switched to business call
    			//so we need to keep these properties.
    			if(customProps.updated){
    				this.customSectionPropertiesCache[data.callId] = customProps;
    			}
    		}else{
				Jacada.Logger.debug('createVoiceContextGroup Voice node already exists with group id: ' + idSuffix);
				this.getView().select(node.firstChild);
				return node;
    		}
    	}
    	var nodes = this.getTabsForContext($W().interactionType.Voice, idSuffix, data);
    	this.activeVoiceNodeId = idSuffix;
    	//if it's retrieved item, we won't have active call
    	Jacada.Logger.debug('createVoiceContextGroup data.retrieved? '+data.retrieved);
    	if(!data.retrieved){
    		this.activeCall = {
	        	uniqueId: data.callId,
	        	groupId: idSuffix,
	        	interactionType: $W().interactionType.Voice
    	    };
    	}
    	//rawVoiceInfo here is actually the raw data on the node that will be appended to the navigation tree
    	var rawVoiceInfo = this.createContextGroupNode(this.activeVoiceNodeId, data.numberInfo, nodes, $W().interactionType.Voice);
    	rawVoiceInfo.callId = data.callId;
    	rawVoiceInfo.qtip = data.numberInfo;
    	rawVoiceInfo.numberInfo = data.numberInfo;
    	$W().cti.addContextGroup($W().interactionType.Voice, data.numberInfo, this.activeVoiceNodeId, rawVoiceInfo);
    	//The following returned voiceNode is on the navigation tree holding the appended voiceNode as raw data
    	voiceNode = this.getRootNode().appendChild(rawVoiceInfo);
    	voiceNode.retrieved = data.retrieved;
    	voiceNode.media = media;
    	this.getView().select(voiceNode.firstChild);
    	//ExtJS do not fire 'activate' event first time in card layout
    	$W().getTab().fireEvent('activate', $W().getTab());
    	this.fireContextStartEvent($W().interactionType.Voice, data, idSuffix);
    	return voiceNode;
    },
    createInternalVoiceContext: function(args){
    	
   		var idSuffix = this.buildVoiceGroupId(args.callId);
    	var node = this.findNode(idSuffix);
    	if(node){
    		if(node.isInternalCall){
				Jacada.Logger.debug('returning internal voice node that already exists with group id: ' + idSuffix);
				return node;
    		}else if($W().cti.isGENESYSCTIProvider()){
				Jacada.Logger.debug('returning voice node that already exists with group id: ' + idSuffix);
				return node;
    		}
    	}
		Jacada.Logger.debug('ContextNavigation.createInternalVoiceContext creating node for ' + idSuffix);
        var ANI = $W().cti.chekcAniContainLetters(args.ANI, args.DNIS);
    	this.activeVoiceNodeId = idSuffix;
		this.activeCall = {
	        	uniqueId: args.callId,
	        	groupId: idSuffix,
	        	interactionType: $W().interactionType.Voice
    	    };
    	//rawVoiceInfo here is actually the raw data on the node that will be appended to the navigation tree
    	var rawVoiceInfo = this.createContextGroupNode(this.activeVoiceNodeId, ANI, null, $W().interactionType.Voice);
    	rawVoiceInfo.callId = args.callId;
    	rawVoiceInfo.isInternalCall = true;
    	rawVoiceInfo.qtip = ANI;
    	//The following returned voiceNode is on the navigation tree holding the appended voiceNode as raw data
    	voiceNode = this.getRootNode().appendChild(rawVoiceInfo);
    	voiceNode.isInternalCall = true;
    	voiceNode.uniqueId = args.uniqueId;
    	voiceNode.callId = args.callId;
    	voiceNode.itemId = rawVoiceInfo.itemId;
    	$W().cti.addContextGroup($W().interactionType.Voice, ANI, this.activeVoiceNodeId, voiceNode);
    	this.getView().select(voiceNode);
    	this.updateActiveContext(rawVoiceInfo, $W().interactionType.Voice);
    	return voiceNode;
    },
    buildVoiceGroupId: function(voiceId){
    	return '-'+$W().interactionType.Voice+'-'+voiceId;
    },
    createWorkItemContextGroupNode: function(workItem){
    	Jacada.Logger.debug("New Work Item json: " + workItem);
    	workItem = Ext.decode(workItem);
    	this.createWorkItemContextGroup(workItem.title, workItem.interactionId, workItem);
    },
    createWorkItemContextGroup: function(title, id, workItem){
    	var idSuffix = this.buildWorkItemGroupId(workItem.interactionId);
    	var nodes = this.getTabsForContext($W().interactionType.WorkItem, idSuffix);
    	this.activeWorkItemNodeId = idSuffix;
    	var workItemNode = this.createContextGroupNode(this.activeWorkItemNodeId, title, nodes, $W().interactionType.WorkItem);
    	workItemNode.workItem = workItem;
    	$W().cti.addContextGroup($W().interactionType.WorkItem, title, this.activeWorkItemNodeId, workItemNode);
    	workItemNode = this.getRootNode().appendChild(workItemNode);
    	if(workItemNode.firstChild == null){
    		this.getView().select(workItemNode);
    	}else{
    		this.getView().select(workItemNode.firstChild);
    	}
    	//ExtJS do not fire 'activate' event first time in card layout
    	$W().getTab().fireEvent('activate', $W().getTab());
    },
    buildWorkItemGroupId: function(workItemId){
    	return '-'+$W().interactionType.WorkItem+'-'+workItemId;
    },
    createTaskContextGroup: function(task){
    	var idSuffix = this.buildTaskGroupId(task.id);
    	var node = this.findNode(idSuffix);
    	if(node){
    		//node already exists
    		this.getView().select(node.firstChild);
    		return;
    	}
    	//create TaskInfo tab
    	var tabInfoId = 'TaskInfoTab'+idSuffix;
    	var taskInfoTabConfig = this.getTaskInfoConfig(tabInfoId, task);
    	Ext.getCmp('contextContentPanel').addTab(taskInfoTabConfig, $W().interactionType.Tasks, idSuffix);
    	var nodes = this.getTabsForContext($W().interactionType.Tasks, idSuffix);
    	nodes = [taskInfoTabConfig].concat(nodes);
    	var title =  $W().localeManager.getLocalizationValue('application.javascript.tasks.task')+'-'+task.id;
    	var taskNode = this.createContextGroupNode(idSuffix, title, nodes, $W().interactionType.Tasks);
    	taskNode.task = task;
    	$W().cti.addContextGroup($W().interactionType.Tasks, title, idSuffix, taskNode);
    	taskNode = this.getRootNode().appendChild(taskNode);
    	this.getView().select(taskNode.firstChild);
    	//ExtJS do not fire 'activate' event first time in card layout
    	$W().getTab().fireEvent('activate', $W().getTab());
    	//load the task details
    	var taskInfoPanel = $W().getTab(tabInfoId).child();
    	taskInfoPanel.loadTask(task);
    },
    buildTaskGroupId: function(taskId){
    	return '-'+$W().interactionType.Tasks+'-'+taskId;
    },
    createEmailContextGroup: function(email){
    	var idSuffix = this.buildEmailGroupId(email.interactionId);
    	var node = this.findNode(idSuffix);
    	if(node){
    		//node already exists
    		this.getView().select(node.firstChild);
    		return;
    	}
    	//if it's retrieved item, we won't have active call
    	//if current active call is a voice, no change 
    	if(!email.retrieved && this.activeCall.interactionType != $W().interactionType.Voice){
    		this.activeCall = {
	        	uniqueId: email.uniqueId,
	        	groupId: idSuffix,
	        	interactionType: $W().interactionType.Email
       	    };
    	}
    	//create email tab
    	var tabInfoId = 'EmailInfoTab'+idSuffix;
    	var emailInfoTabConfig = this.getEmailInfoConfig(tabInfoId, email);
    	Ext.getCmp('contextContentPanel').addTab(emailInfoTabConfig, $W().interactionType.Email, idSuffix);
    	var nodes = this.getTabsForContext($W().interactionType.Email, idSuffix, email);
    	nodes = [emailInfoTabConfig].concat(nodes);
    	var title =  Ext.String.htmlEncode(email.Subject);//.substring(0,30);//$W().localeManager.getLocalizationValue('application.javascript.email.group.title')+'-'+email.interactionId;
    	var emailNode = this.createContextGroupNode(idSuffix, title, nodes, $W().interactionType.Email);
    	emailNode.qtip = title;//tooltip
    	emailNode.email = email;
    	$W().cti.addContextGroup($W().interactionType.Email, title, idSuffix, emailNode);
    	emailNode = this.getRootNode().appendChild(emailNode);
    	emailNode.retrieved = email.retrieved;
    	this.getView().select(emailNode.firstChild);
    	//ExtJS do not fire 'activate' event first time in card layout
    	$W().getTab().fireEvent('activate', $W().getTab());
    	//load email details
    	var emailInfoPanel = $W().getTab(tabInfoId).child();
    	emailInfoPanel.loadEmail(email);
    	this.fireContextStartEvent($W().interactionType.Email, email, idSuffix);
    	return emailNode;
    },
    buildEmailGroupId: function(emailInteractionId){
    	return '-'+$W().interactionType.Email+'-'+emailInteractionId;
    },
    createChatContextGroup: function(chat){
    	var idSuffix = this.buildChatGroupId(chat.interactionId);
    	var node = this.findNode(idSuffix);
    	if(node){
    		//node already exists
    		this.getView().select(node.firstChild);
    		return;
    	}
    	//if it's retrieved item, we won't have active call
    	//if current active call is a voice, no change 
    	if(!chat.retrieved && this.activeCall.interactionType != $W().interactionType.Voice){
    		this.activeCall = {
	        	uniqueId: chat.uniqueId,
	        	groupId: idSuffix,
	        	interactionType: $W().interactionType.Chat
       	    };
    	}
    	//create chat tab
    	var tabInfoId = 'ChatInfoTab'+idSuffix;
    	var chatInfoTabConfig = this.getChatInfoConfig(tabInfoId, chat);
    	Ext.getCmp('contextContentPanel').addTab(chatInfoTabConfig, $W().interactionType.Chat, idSuffix);
    	var nodes = this.getTabsForContext($W().interactionType.Chat, idSuffix, chat);
    	nodes = [chatInfoTabConfig].concat(nodes);
    	var title =  chat.customerName;
    	var chatNode = this.createContextGroupNode(idSuffix, title, nodes, $W().interactionType.Chat);
    	chatNode.qtip = title;//tooltip
    	chatNode.chat = chat;
    	$W().cti.addContextGroup($W().interactionType.Chat, title, idSuffix, chatNode);
    	chatNode = this.getRootNode().appendChild(chatNode);
    	chatNode.retrieved = chat.retrieved;
    	this.getView().select(chatNode.firstChild);
    	//ExtJS do not fire 'activate' event first time in card layout
    	$W().getTab().fireEvent('activate', $W().getTab());
    	//load initial chat messages
    	var chatPanel = $W().getTab(tabInfoId).child();
    	chatPanel.processMessages(chat);
    	this.fireContextStartEvent($W().interactionType.Chat, chat, idSuffix);
    	return chatNode;
    },
    buildChatGroupId: function(chatInteractionId){
    	return '-'+$W().interactionType.Chat+'-'+chatInteractionId;
    },
    updateActiveContext: function(data, interactionType){
    	var mainW = $W();
    	var newUniqueId = 'n/a';
    	var oldActiveGroupId = mainW.activeContext.groupId;
    	var oldActiveInteractionType = mainW.activeContext.interactionType;
    	if(interactionType == mainW.interactionType.Tasks){
    		mainW.activeContext = {
    			interactionType: mainW.interactionType.Tasks,
    			groupId: data.itemId,
    			task: data.task,
    			interactionId: data.itemId
    		};
    		newUniqueId = data.itemId;
    	}else if(interactionType == mainW.interactionType.Voice){
    		mainW.activeContext = {
    			interactionType: mainW.interactionType.Voice,
    			groupId: data.itemId,
    			callId: data.callId,
    			interactionId: data.callId
    		};
    		newUniqueId = data.callId;
    	}else if(interactionType == mainW.interactionType.WorkItem){
    		mainW.activeContext = {
    			interactionType: mainW.interactionType.WorkItem,
    			groupId: this.activeWorkItemNodeId,
    			interactionId: this.activeWorkItemNodeId
    		};
    		newUniqueId = this.activeWorkItemNodeId;
    	}else if(interactionType == mainW.interactionType.Email){
    		mainW.activeContext = {
    			interactionType: mainW.interactionType.Email,
    			groupId: data.itemId,
    			email: data.email,
    			interactionId: data.email.interactionId
    		};
    		newUniqueId = data.email.uniqueId;
    	}else if(interactionType == mainW.interactionType.Chat){
    		mainW.activeContext = {
    			interactionType: mainW.interactionType.Chat,
    			groupId: data.itemId,
    			chat: data.chat,
    			interactionId: data.chat.interactionId
    		};
    		newUniqueId = data.chat.uniqueId;
    	}else{
    		mainW.activeContext = {
    			interactionType: mainW.interactionType.General,
    			groupId: mainW.interactionType.General,
    			interactionId: mainW.interactionType.General
    		};
    		newUniqueId = mainW.interactionType.General;
    	}
    	Jacada.Logger.debug("updateActiveContext interactionType: " + interactionType 
    			+ ", $W().activeContext.groupId: " + mainW.activeContext.groupId
    			+ ", newUniqueId: " + newUniqueId);
    	if(mainW.activeContext.groupId == oldActiveGroupId){
        	Jacada.Logger.debug("updateActiveContext Tab switch in the same group " + mainW.activeContext.groupId);
        	return;
    	}
    	//Group has changed, we have to update custom section and cti
		if(mainW.cti){
			mainW.cti.selectActiveContextGroup();
		}
    	if(data){
    		this.updateCustomSection(data, interactionType);
    	}
    	
    	//following goes only for EMC provider
    	if(!mainW.cti || !mainW.cti.isEMCCTIProvider()){
    		return;
    	}
    	//If we came back to previous active call 
    	//or current voice state is "In Consultation" or "In Warm Transfer",
    	//active call stays the same, no change.
    	var isConsult = mainW.cti.isCurrentConsultTransferVoiceState();
    	if(this.activeCall.uniqueId == newUniqueId || isConsult){
    		//No need to pop up, just update action bar
        	Jacada.Logger.debug("updateActiveContext Call of the new group stays active." 
        			+ " Same uniqueId? " + (this.activeCall.uniqueId == newUniqueId)
        			+ ", isCurrentConsultTransferVoiceState: " + isConsult);
        	return;
    	}
    	//This is a potentially going to be a new active call
    	//Valid interaction types: Voice, Email, Chat
    	if((interactionType == mainW.interactionType.Voice)
    			|| interactionType == mainW.interactionType.Email 
    			|| interactionType == mainW.interactionType.Chat){
    		//If old context type is Voice and call exists,
    		//no change
    		if(this.activeCall.interactionType == mainW.interactionType.Voice){
    			var oldGroup = this.findNode(this.activeCall.groupId);
    			if(oldGroup && oldGroup.callExists){
    				Jacada.Logger.debug("updateActiveContext There is a voice call exists. No change.");
    				return;
    			}
    		}
    		//if call does not exist for a new context, no change
    		var newGroup = this.findNode(mainW.activeContext.groupId);
    		if(newGroup && !newGroup.callExists){
            	Jacada.Logger.debug("updateActiveContext Call does not exists for this item " + newUniqueId);
            	return;
    		}
    		this.activeCall = {
	        	uniqueId: newUniqueId,
	        	groupId: mainW.activeContext.groupId,
	        	interactionType: interactionType
    	    };

    		//if we switch to non voice context, off hold the call automatically
			if(interactionType != mainW.interactionType.Voice){
				mainW.mediaAPI.contextSwitch(this.activeCall.uniqueId, true);
			}
    	}
    },
    updateCustomSection: function(data, interactionType, properties){
    	var html = '';
    	//properties can be injected by portlets or tabs
    	if(!properties){
    		properties = this.getCustomSectionProperties(data, interactionType);
    	}
    	if(properties.size() > 0){
    		html = '<table border="0" cellspacing="0">';
    		var name, value;
    		properties.each(function(property){
    			name = property.name;
    			value = property.value? property.value:'';
    			html += '<tr>';
    			html += '<td class="custom-section-property-key">'+Ext.String.htmlEncode(name)+':</td>';
    			html += '<td title="'+Ext.String.htmlEncode(value)
    			+'" class="custom-section-property-value">'+Ext.String.htmlEncode(value)+'</td>';
    			html += '</tr>';
    		});
    		html += '</table>';
    	}
    	Ext.getCmp('ctiBar').down('#customSection').update(html);
    },
    getCustomSectionProperties: function(data, interactionType){
    	if(interactionType == $W().interactionType.Tasks){
    		return this.getTaskCustomProperties(data);
    	}else if(interactionType == $W().interactionType.Voice){
    		return this.getVoiceCustomProperties(data);
    	}else if(interactionType == $W().interactionType.Email){
    		return this.getEmailCustomProperties(data);
    	}else if(interactionType == $W().interactionType.WorkItem){
    		return this.getWorkItemCustomProperties(data);
    	}else if(interactionType == $W().interactionType.Chat){
    		return this.getChatCustomProperties(data);
    	}
    	
    	//No properties if incorrect interaction type
    	return new Array();
    },
    updateVoiceCustomProperties: function(properties){
    	if(this.activeVoiceNodeId){
    		this.customSectionPropertiesCache[this.activeVoiceNodeId] = properties;
    	}
    },
    getVoiceCustomProperties: function(data){
    	//check in cache first
    	if(this.customSectionPropertiesCache[data.callId]){
    		return this.customSectionPropertiesCache[data.callId];
    	}
    	var array = [];
    	array.push({name: 'Number', value: data.isInternalCall?data.text:data.numberInfo});
    	this.customSectionPropertiesCache[data.callId] = array;
   		return array;
    },
    getTaskCustomProperties: function(data){
    	var array = [];
		var task = data.task;
		//check in cache first
		if(this.customSectionPropertiesCache[task.id]){
			return this.customSectionPropertiesCache[task.id];
		}
		array.push({name: 'Task Id', value: task.id});
		array.push({name: 'Name', value: task.name});
		array.push({name: 'Created', value: Ext.Date.format(new Date(task.createdMillis), DATE_FORMAT + " " + TIME_FORMAT)});
		this.customSectionPropertiesCache[task.id] = array;
		return array;
    },
    getChatCustomProperties: function(data){
    	var array = new Array();
		var chat = data.chat;
		//check in cache first
		if(this.customSectionPropertiesCache[chat.interactionId]){
			return this.customSectionPropertiesCache[chat.interactionId];
		}
		array.push({name: 'Customer Name', value: chat.customerName});
		array.push({name: 'Established', value: Ext.Date.format(new Date(), DATE_FORMAT + " " + TIME_FORMAT)});
		this.customSectionPropertiesCache[chat.interactionId] = array;
		return array;
    },
    getEmailCustomProperties: function(data){
    	var array = new Array();
		var email = data.email;
		//check in cache first
		if(this.customSectionPropertiesCache[email.interactionId]){
			return this.customSectionPropertiesCache[email.interactionId];
		}
		array.push({name: 'From', value: email.From});
		//array.push({name: 'Subject', value: email.Subject.replace(/\"/g, '\'')});
		array.push({name: 'Subject', value: email.Subject});
		this.customSectionPropertiesCache[email.interactionId] = array;
		return array;
    },
    getWorkItemCustomProperties: function(data){
    	var array = new Array();
    	var workItem = data.workItem;
    	if(workItem.title){
    		array.push({name: 'Title', value: workItem.title});
    	}else{
    		array.push({name: 'Sample data', value: "Some info"});
    	}
		return array;
    },
    getActiveGroupId: function(){
    	var selections = this.getSelectionModel().getSelection();
    	if(selections.length > 0){
	    	var node = selections[0];
	    	if(node.isLeaf()){
    			node = node.parentNode;
    		}
    		Jacada.Logger.debug("Returning active group id: " + node.data.itemId);
    		return node.data.itemId;
	    }
    	Jacada.Logger.debug("no active group");
    	return null;
    },
    getTaskInfoConfig: function(tabInfoId, task){
    	return {
    		itemId: tabInfoId,
    		id: tabInfoId,
    		loaded: false,
    		closable: false,
    		actualUrl: 'Jacada.system.ui.tasks.TaskInfoPanel',
    		text: $W().localeManager.getLocalizationValue('application.javascript.ui.taskInfo'), //for the navigation node
    		title: task.name+' ('+task.id+')',//for the tab
    		leaf: true,
    		maximizable: true,
    		interactionType: $W().interactionType.Tasks 
    	};
    },
    getEmailInfoConfig: function(tabInfoId, email){
    	return {
    		itemId: tabInfoId,
    		email: email,
    		id: tabInfoId,
    		loaded: false,
    		closable: false,
    		actualUrl: 'Jacada.system.ui.email.EmailInfoPanel',
    		text: $W().localeManager.getLocalizationValue('application.javascript.ui.emailInfo'), //for the navigation node
    		title: Ext.String.htmlEncode(email.Subject),//for the tab
    		leaf: true,
    		maximizable: true,
    		interactionType: $W().interactionType.Email
    	};
    },
    getChatInfoConfig: function(tabInfoId, chat){
    	return {
    		itemId: tabInfoId,
    		chat: chat,
    		id: tabInfoId,
    		loaded: false,
    		closable: false,
    		actualUrl: 'Jacada.system.ui.chat.ChatPanel',
    		text: $W().localeManager.getLocalizationValue('application.javascript.ui.chat.tab'), //for the navigation node
    		title: $W().localeManager.getLocalizationValue('application.javascript.ui.chat.tab'),//for the tab
    		leaf: true,
    		maximizable: true,
    		interactionType: $W().interactionType.Chat
    	};
    },
    getTabsForContext: function(contextType, idSuffix, data){
    	var contextTabs = new Array();
    	$W().tabItems.each(function(tabConfig){
			var interactionType = tabConfig.interactionType;
			if (interactionType && interactionType.indexOf(contextType)>=0){
				var uniqueId = null;
				var transferredUniqueId = null;
				if(data){
					uniqueId = data.uniqueId ? data.uniqueId: null;
					transferredUniqueId = data.transferredUniqueId ? data.transferredUniqueId : null;
				}
				//clone the config to get a new instance
				//duplicate the tabConfig
				var clonedCfg = Ext.Object.merge({}, tabConfig );
				//override some properties (such as new id)
				clonedCfg = Ext.Object.merge(clonedCfg, {id:tabConfig.id+idSuffix, itemId: tabConfig.itemId+idSuffix, loaded:false, closable: false, uniqueId: uniqueId, transferredUniqueId: transferredUniqueId});
				//add a node to the navigation bar
				if(!tabConfig.hidden){
					contextTabs.push({itemId: clonedCfg.itemId, text: clonedCfg.title, leaf: true, interactionType:contextType, uniqueId: uniqueId, transferredUniqueId: transferredUniqueId});
				}
				//add voice tab
				Ext.getCmp('contextContentPanel').addTab(clonedCfg, contextType, idSuffix);
			}
    	});
    	return contextTabs;
    },
    fireContextStartEvent: function(contextType, data, groupId){
    	this._fireContextEvent('contextStarted', contextType, data, groupId);
    },
    fireContextDataChangedEvent: function(contextType, data, groupId, dataType){
    	this._fireContextEvent('contextDataChanged', contextType, data, groupId, dataType);
    },
    fireContextTabChangedEvent: function(contextType, data, groupId){
    	this._fireContextEvent('contextTabChanged', contextType, data, groupId);
    },
    _fireContextEvent: function(eventName, contextType, data, groupId, dataType){
    	groupId = groupId.toLowerCase();
    	Jacada.Logger.debug("ContextNavigationPanel._fireContextEvent eventName: " + eventName 
    			+ ", groupId:" + groupId + ", data: " + data + ", dataType: " + dataType);
    	//fire the event to all groups listeners
    	var observers = this.contextObservers.allGroups;
    	if(observers){
        	Jacada.Logger.debug("ContextNavigationPanel._fireContextEvent firing to all group listeners"); 
    		this._fireContextEventToGroup(observers, eventName, contextType, data, dataType);
    	}
    	//fire the event to requested group
    	observers = this.contextObservers[groupId];
    	if(observers){
        	Jacada.Logger.debug("ContextNavigationPanel._fireContextEvent firing to requested group listeners"); 
    		this._fireContextEventToGroup(observers, eventName, contextType, data, dataType);
    	}
    },
    _fireContextEventToGroup: function(observers, eventName, contextType, data, dataType){
    	var observerId;
    	for (observerId in observers) {
	    	Jacada.Logger.debug("ContextNavigationPanel._fireContextEventToGroup observerId:" + observerId + ", data: " + data);
	    	observers[observerId].fireEvent(eventName, contextType, data, dataType);
 		}
    },
    //Registers the object to listen context event of required group
    registerContextListener: function(object, groupId){
    	if(object.observerAllEvents){
        	Jacada.Logger.debug("ContextNavigationPanel.registerContextListener object.id:" + object.id + " observerAllEvents?true"); 
    		this.contextObservers.allGroups[object.id] = object;
        	object.on("destroy", function(object){
            	Jacada.Logger.debug("ContextNavigationPanel.registerContextListener removing observer object.id:" 
            			+ object.id + " from observerAllEvents");
        		delete this.contextObservers.allGroups[object.id];
        	}, this);
        	return;
    	}
    	//We need to add observer for a specific group
    	if(!groupId){
    		groupId = object.groupId;
    	}
    	groupId = groupId.toLowerCase();
    	if(!this.contextObservers[groupId]){
    		this.contextObservers[groupId] = {};
    	}
    	this.contextObservers[groupId][object.id] = object;
    	//check if there is a pending data for this context
    	var result = this.pendingCustomerSearchResults[groupId];
    	Jacada.Logger.debug("ContextNavigationPanel.registerContextListener object.id:" + object.id + ", groupId:" 
    			+ groupId + ", results: " + result);
    	if(result){
    		this.contextObservers[groupId][object.id].fireEvent('contextDataChanged', result.interactionType, result, 'customerInfo');
    	}
    	//We might end with number of "destroy" listeners on the same object, which might be not in real use 
    	//They will be executed once the context is destoryed.
    	object.on("destroy", function(object){
        	Jacada.Logger.debug("ContextNavigationPanel.registerContextListener removing observer object.id:" 
        			+ object.id + " from group: " + groupId);
        	if(this.contextObservers[groupId] && this.contextObservers[groupId][object.id]){
        		delete this.contextObservers[groupId][object.id];
        	}
    	}, this);
    },
    //removes the listener for specific group
    unregisterContextListener: function(object, groupId){
    	if(object.observerAllEvents){
        	Jacada.Logger.debug("ContextNavigationPanel.unregisterContextListener object.id:" + object.id + " observerAllEvents?true");
        	if(this.contextObservers.allGroups[object.id]){
        		delete this.contextObservers.allGroups[object.id];
        	}
        	return;
    	}
    	if(!groupId){
    		groupId = object.groupId;
    	}
    	groupId = groupId.toLowerCase();
    	if(this.contextObservers[groupId] && this.contextObservers[groupId][object.id]){
    		delete this.contextObservers[groupId][object.id];
    	}
    },
    //Moves all observers from one group to another
    reregisterContextListeners: function(oldGroupId, newGroupId){
    	oldGroupId = oldGroupId.toLowerCase();
    	Jacada.Logger.debug("ContextNavigationPanel.reregisterContextListeners oldGroupId: " + oldGroupId + " newGroupId: " + newGroupId);
    	if(this.contextObservers[oldGroupId]){
        	var objectId;
        	for(objectId in this.contextObservers[oldGroupId]){
        		this.registerContextListener(this.contextObservers[oldGroupId][objectId], newGroupId);
        		delete this.contextObservers[oldGroupId][objectId];
        	}
        	delete this.contextObservers[oldGroupId];
    	}
    },
    removePendingSearchResults: function(groupId){
    	Jacada.Logger.debug("ContextNavigationPanel.removePendingSearchResults groupId:" + groupId);
    	delete this.pendingCustomerSearchResults[groupId.toLowerCase()];
    },
    notifyOnNewChatMessage: function(data){
    	//blink the node in case it is not in focus
    	data = Ext.decode(data);
    	var idSuffix = this.buildChatGroupId(data.interactionId);
    	if($W().activeContext.groupId != idSuffix){
    		var node = this.findNode(idSuffix);
    		if(node.inAnimation){
    			return;
    		}
    		node.originalIconCls = node.data.iconCls;
    		node.inAnimation = setInterval(function(){
        		if(node.isNotificationIconShown){
        			node.isNotificationIconShown = false;
        			node.set('iconCls', node.originalIconCls);
        		}else{
        			node.isNotificationIconShown = true;
        			node.set('iconCls', node.originalIconCls+'Blink');
        		}
        		},1000);
    	}
    },
    notifyCustomerInfoUpdate: function(data){
    	data = Ext.decode(data);
    	var id = data.interactionId;
    	if(data.interactionType.toLowerCase() == $W().interactionType.Voice.toLowerCase()){
    		id = data.callId;
    	}
    	var groupId = this.buildGroupId(id, data.interactionType);//server sends without the prefix
    	Jacada.Logger.debug("ContextNavigationPanel.notifyCustomerInfoUpdate groupId:" + groupId + ", callId: " + data.callId
    			+ ", interactionId: " + data.interactionId + ", interactionType: " + data.interactionType);
    	this.pendingCustomerSearchResults[groupId.toLowerCase()] = data;
    	this.fireContextDataChangedEvent(data.interactionType, data, groupId, 'customerInfo');
    	var properties = this.getContactPropertiesToPresent(data.contact);
    	properties.updated = true;
		this.customSectionPropertiesCache[id] = properties;
		this.updateCustomSection(null, null, properties);
    },
    
    getContactPropertiesToPresent: function(contact){
		var properties = [];
		properties.push({
			name: $W().localeManager.getLocalizationValue('application.javascript.customerInfo.ctibar.name'), 
			value: contact.attributes.FirstName+' '+contact.attributes.LastName
		});
		properties.push({
			name: $W().localeManager.getLocalizationValue('application.javascript.customerInfo.ctibar.email'),
			value: contact.attributes.EmailAddress
		});
		properties.push({
			name: $W().localeManager.getLocalizationValue('application.javascript.customerInfo.ctibar.phone'),
			value: contact.attributes.HomePhone
		});
		return properties;
    }

});