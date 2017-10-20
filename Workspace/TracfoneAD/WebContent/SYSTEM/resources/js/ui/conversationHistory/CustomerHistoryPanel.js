Ext.define('Jacada.system.ui.conversationHistory.CustomerHistoryPanel', {
	extend : 'Jacada.system.ui.conversationHistory.AgentHistoryPanel',
	itemId : 'customerHistoryPanel',
	CLICKABLE_COLUMN_INDEX : 1,
	alreadyLoaded: false,

	initComponent : function() {
		var me = this;
		this.observerAllEvents = false;
		this.callParent(arguments);
		//Important! register listeners after parent.
		this.on('contextDataChanged', function(interactionType, data, dataType){
			if(dataType == 'customerInfo'){
				Jacada.Logger.debug('CustomerHistoryPanel.contextDataChanged got customer ' + data.contactId + '. Searching conversations.');
				me.customerId = data.contactId;
				me.searchConversation(me);
			}
		});
		//context listener is registered in the parent
	},
	getDaysOldDefaultValue: function(){
		return 30;
	},
	getServiceUrl: function(){
		return $W().contextPath + '/rest/conversationHistory/search/customer';
	},
	getModel: function(){
		return 'CustomerConversationModel';
	},
	searchConversation: function(me){
		if(!me.customerId){
			return;
		}
		if(!me.validateInput(me)){return;}
		var agentIdFieldValue = me.down('#searchAgentIdField').getValue();
		var daysOldFieldValue = me.down('#searchDaysOldField').getValue();
		var numberOfRowsValue = me.down('#searchNumberOfRowsField').getValue();
		var store = me.getStore();
		store.getProxy().jsonData = {customerId: me.customerId, daysOld: daysOldFieldValue, numberOfRows: numberOfRowsValue};
		store.load();
	},
	isAgentIdFilterVisible: function(){
		return false;
	},
	createColumns: function(me){
		var agentIdColumn = {text: me.getLocalizedValue('grid.column.agentId'), dataIndex: 'agentId', renderer: me.conversationDataCellRenderer, width: 75};
		var columns = me.callParent(arguments);
		return [agentIdColumn].concat(columns);
	},
	createModel: function(){
		var me = this;
		var fields = this.getModelFields(me);
		var agentIdField = {name: 'agentId', mapping:'attributes.agentId'};
		Ext.define('CustomerConversationModel',{
			extend:'Ext.data.Model',
			fields:  [agentIdField].concat(fields)
		});
	},
	getClickableCellIndex: function() {
	    return this.CLICKABLE_COLUMN_INDEX;
	}
		
});//CustomerHistoryPanel History panel End
