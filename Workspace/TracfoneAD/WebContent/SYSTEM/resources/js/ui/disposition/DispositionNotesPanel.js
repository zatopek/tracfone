Ext.define('Jacada.system.ui.disposition.DispositionNotesPanel', {
	extend : 'Ext.panel.Panel',
	itemId : 'dispositionNotesPanel',
	layout : {
		type : 'vbox',
		align : 'stretch'
	},
	bodyStyle : 'background:none',
	bodyCls : 'baseColor',
	padding: 5,
	border : false,
	defaults : {
		border : false
	},
	autoScroll : true,
	interactionId: null,
	workItemId: null,
	mediaType: null,
	uniqueId: null,
	WORK_CODE_TIME_STAMP_FORMAT: 'm-d-Y H:i:s.u',
	NOTES_TIME_STAMP_FORMAT: 'm/d/Y g:i:s A',
	SUCCESSFULLY_SAVED: '',
	SAVING_FAILED: '',
	notesTopic: 'Notes',
	initComponent : function() {
		var me = this;
		me.SUCCESSFULLY_SAVED = me.getLocalizedValue('status.success');
		me.SAVING_FAILED = me.getLocalizedValue('status.failure');
		var items = [];
		items.push(me.createNotesPanel(me));
		items.push(me.createDispostionCombobox(me));
		Ext.applyIf(me, {
			items : items,
			listeners:{
        		contextStarted: function(type, data){
        			
        			if(!data){
        				Jacada.Logger.debug('DispositionNotesPanel: data is undefined');
        				return;
        			}
        			
    				me.interactionId = data.interactionId;
        			me.mediaType = type.toLowerCase();
    				me.workItemId = data.contextId;
    				me.uniqueId = data.uniqueId;
        			if(data.CustomerNotes){
        			//set Notes
	        			me.notesId = data.CustomerNotes.Id ? data.CustomerNotes.Id : '';
	        			me.notesTopic = data.CustomerNotes.Topic ? data.CustomerNotes.Topic : me.notesTopic;
	        			me.down("#notesTextArea").setValue(data.CustomerNotes.Data);
        			}else{
        				Jacada.Logger.debug('DispositionNotesPanel: CustomerNotes is undefined');
        			}
        			me.loadWorkCodeStore(me, data);
        		},
        		contextDataChanged: function(type, data, dataType){
        			Jacada.Logger.debug('DispositionNotesPanel: context changed: ' + data+'  dataType: '+dataType);
        			if(dataType == 'media'){
        				me.loadWorkCodeStore(me, data);
        			}
        			
        		}
			}
		});
		me.callParent(arguments);
		Ext.getCmp('contextNavigation').registerContextListener(me);
	},
	loadWorkCodeStore:function(me, data){
		if(!($W().cti.isEMCCTIProvider())){
			Jacada.Logger.debug("DispositionNotesPanel.loadWorkCodeStore, not EMC provider so will not load work code store");
			return;
		}
		
		//get Work Code List
		var ClientWorkCodeListName = encodeURIComponent(data.ClientWorkCodeListName);
		var store = me.down('#dispositionCodeCombobox').getStore();
		store.getProxy().url = $W().contextPath+ '/rest/resource/' + me.mediaType + '/autotext/'+ ClientWorkCodeListName +'?sessionId=' + $W().wsSessionId;
		store.load();
	},
	createNotesPanel : function(me) {
		return {
			xtype : 'panel',
			layout : 'fit',
			flex: 1,
			items : [ {
				xtype : 'textarea',
				itemId : 'notesTextArea',
				listeners : {
					change : function(textarea, newValue, oldValue, eOpts) {
						var updateButton = me.down('#updateButton');
						textarea.getValue() ? updateButton.enable()
								: updateButton.disable();
						me.hideStatus();
					}
				}
			} ],
			dockedItems: [{
			    xtype: 'toolbar',
			    dock: 'bottom',
			    ui: 'footer',
			    items: [
			        {
				xtype: 'label',
				itemId: 'statusLabel',
    			flex: 1,
				listeners: {
					render: function(label) {
					  label.tip = Ext.create('Ext.tip.ToolTip', {
						target: label.getEl(),
						html: '' 
					  });
					}
				}
			},
			       {
				text : me.getLocalizedValue('button.update'),
				itemId : 'updateButton',
				cls: 'actionButton',
				disabled : true,
				handler : function() {
					//voice work item handling
					var node = Ext.getCmp('contextNavigation').findNode($W().activeContext.groupId);
					if(node && node.media){
						me.interactionId = node.media.interactionId;
					}
					//we should not override me.interactionId as it would affect disposition codes submit
					//so building it according to what it is available
					var url = $W().contextPath + '/rest/emc/CustomerDataService/update/' + me.mediaType + '/';
				    url += (me.interactionId?me.interactionId:(me.workItemId?me.workItemId:me.uniqueId));
				    url += '?sessionId=' + $W().wsSessionId;
				    
					var jsonData ={
						id: me.notesId,
						data: me.down("#notesTextArea").getValue(),
						key: $W().agentCTIName + '|' + Ext.Date.format(new Date(), me.NOTES_TIME_STAMP_FORMAT) + '|' + $W().agentCTIName,
						topic: me.notesTopic
					};
					Ext.Ajax.request({
	 					   url: url,
	 					   method: 'POST',
	 					   headers: {
	 	    			    	'Accept': 'application/json',
	 	    			    	'Content-Type': 'application/json'
	 	    			    },
	 					   jsonData: Ext.JSON.encode(jsonData),
	 					   success: function(response, opts) {
	 						  Jacada.Logger.debug('Notes:' + jsonData.key + ', submit succeeded');
	 						  me.showSuccessStatus('Notes ' + me.SUCCESSFULLY_SAVED);
	 					   },
	 					   failure: function(response, opts) {
	 						   Jacada.Logger.debug('Notes:' + jsonData.key + ', submit failed');
	 						   me.showErrorStatus('Notes ' + me.SAVING_FAILED);
	 					   }
	 					});
				}
			}]
			}]
		}
	},
	createDispostionCombobox : function(me) {

		return {
			xtype : 'combobox',
			itemId: 'dispositionCodeCombobox',
			emptyText: me.getLocalizedValue('combobox.emptyText'),
			padding: '5',
			store : {
				xtype : 'store',
				fields : [ 'topic', 'value' ],
				proxy : {
					type : 'rest',
					headers: {
    			    	'Accept': 'application/json',
    			    	'Content-Type': 'application/json'
    			    },
				}
			},
			queryMode : 'local',
			displayField : 'value',
			valueField : 'value',
			listeners:{
				select: function( combo, records, eOpts ){
					var jsonData = records[0].raw;
					jsonData.agentId = $W().agentCTIName
					
					//voice work item handling
					var node = Ext.getCmp('contextNavigation').findNode($W().activeContext.groupId);
					if(node && node.media){
						me.interactionId = node.media.interactionId;
					}
					
					jsonData.interactionId = me.interactionId?me.interactionId:me.workItemId;
					jsonData.date = Ext.Date.format(new Date(), me.WORK_CODE_TIME_STAMP_FORMAT);
					Ext.Ajax.request({
	 					   url: $W().contextPath + '/rest/disposition/submit',
	 					   method: 'POST',
	 					   jsonData: Ext.JSON.encode(jsonData),
	 					   success: function(response, opts) {
	 						  Jacada.Logger.debug('dispositionCode:' + jsonData.value + ', submit succeeded');
	 						 me.showSuccessStatus('"' + records[0].raw.value + '" ' + me.SUCCESSFULLY_SAVED);
	 						  
	 					   },
	 					   failure: function(response, opts) {
	 						   Jacada.Logger.debug('dispositionCode:' + jsonData.value + ', submit failed');
	 						    me.showErrorStatus('"' + records[0].raw.value + '" ' + me.SAVING_FAILED);
	 					   }
	 					});
				},
				change: function( combobox, newValue, oldValue, eOpts ){
					me.hideStatus();
				},
				expand: function( field, eOpts ){
					me.hideStatus();
				}
			}
		};
	},
	showSuccessStatus: function(value){
		var statusLabel = this.down('#statusLabel');
		var decoratedValue = '<span class="textSuccessColor">' + value + '</span>';
		statusLabel.tip.update(value);
		statusLabel.update(decoratedValue);
	},
	showErrorStatus: function(value){
		var statusLabel = this.down('#statusLabel');
		var decoratedValue = '<span class="textAlertColor">' + value + '</span>';
		statusLabel.tip.update(value);
		statusLabel.update(decoratedValue);
	},
	hideStatus: function(){
		 var statusLabel = this.down('#statusLabel');
		statusLabel.update('');
	},
    getLocalizedValue: function(key){
    	return $W().localeManager.getLocalizationValue('application.javascript.disposition.notes.'+key);
    }

});