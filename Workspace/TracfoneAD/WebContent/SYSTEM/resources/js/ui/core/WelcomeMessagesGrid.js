Ext.define('Jacada.system.ui.core.WelcomeMessagesGrid', {
    extend: 'Jacada.system.ui.messaging.MessageBoard',
    
    id: 'welcomeMessageBoard',
    hideHeaders: true,
    rowLines: false,
    hidden: true,
    hideMode: 'visibility',
    
    getDestination: function(){
    	return "splash";
    },
    
    hasManadatoryMessages: function(){
    	var result = false;
    	this.store.data.each(function(item) {
        	if(item.data.mustRead){
        		result = true;
        		return false;//break the loop
        	}
    	});
    	return result;
    },
    
    subjectCellRenderer: function(value, metaData, record, row, col, store, gridView) {
    	var me = this;
    	if(record.data.mustRead){
    		return '<div class="cti-mandatory-message">'+value+'</div>';
    	}
    	return value;
    },
    
    createColumns: function(me){
    	return [
        { header: $W().localeManager.getLocalizationValue('application.javascript.messageBoard.column.message'), flex: 1, sortable: false, dataIndex: 'subject', renderer: me.subjectCellRenderer }
        ]
    },
    
    initComponent: function () {
    	var me = this;
    	Ext.applyIf(me,{
    	});
    	me.callParent(arguments);
    	me.store.on("load", this.onStoreLoad, this);
    },
    onStoreLoad: function (store, records, successful, eOpts) {
    	if(records.length > 0){
    		this.setVisible(true);
    	}else{
    		//show "no messages" message
    		this.up().update($W().localeManager.getLocalizationValue('application.javascript.welcome.label.noMessages'));
    	}
    }
});