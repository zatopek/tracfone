Ext.define('Jacada.system.ui.messaging.MessageBoard', {
    extend: 'Ext.grid.Panel',

    id: 'messageBoard',
    border: false,
    
    store: new Ext.data.Store({
        storeId: 'messagesStore',
        proxy: {
            type: 'ajax',
            url: 'messaging.json',
            reader: {
                type: 'json',
                root: 'messages',
                idProperty: 'id'
            }
        },
        fields: [
                 {name:'id'}, 
                 {name:'subject', type:'string'}, 
                 {name:'content', type:'string'}, 
                 {name:'creationDate', type:'string'},
                 {name:'activationDate', type:'string'},
                 {name:'expiryDate', type:'string'},
                 {name:'repeating', type:'boolean'},
                 {name:'repeatingPeriodType', type:'string'},            
                 {name:'recipientType', type:'string'},
     		     {name:'groups', type:'string'},
                 {name:'readOnce', type:'boolean'},
                 {name:'showOnWelcomeScreen', type:'boolean'},
                 {name:'showOnMessageBoard', type:'boolean'},
                 {name:'showOnTickerTape', type:'boolean'},
                 {name:'flashOnTickerTape', type:'boolean'},
                 {name:'pauseOnTickerTape', type:'boolean'},
                 {name:'priorityLevel', type:'int'},
                 {name:'color', type:'string'},
                 {name:'mustRead', type:'boolean'}
                 ]
    }),
    autoHeight: true,
    plugins: [{
        ptype: 'rowexpander',
        rowBodyTpl : new Ext.XTemplate('<p>{content}</p>')
    }],
    getRowTemplate: function(){
    	return '<p>{content}</p>';
    },
    createColumns: function(me){
    	return [
        { header: $W().localeManager.getLocalizationValue('application.javascript.messageBoard.column.message'), flex: 1, sortable: false, dataIndex: 'subject' },
        { header: $W().localeManager.getLocalizationValue('application.javascript.messageBoard.column.sentOn'),width:150, dataIndex: 'creationDate' }
    	]
    },
    initComponent: function() {
        var me = this;
        Ext.applyIf(me, {
        	columns:me.createColumns(me),
        	viewConfig:{
                listeners:{
                    expandbody: function(rowNode, record, expandRow, eOpts){
                    	record.data.mustRead = false;
                    	me.getView().refresh();
                    	if(record.data.readOnce){
                    		me.ajaxMarkMessageAsRead(record.data.id);
                        }
                    }
                }
            },
            listeners:{
       		 beforedestroy: function( panel, eOpts){
       			 me.unregisterForMssages();
       		 }
       	 }
        });
        me.callParent(arguments);
        this.registerForMessages();
        this.doRefresh();
    },
    registerForMessages: function(){
    	$W().Push.registerEventHandler( 'UPDATE_NOTIFICATION', this.doRefresh.bind(this));
	},
	unregisterForMssages: function() {
		$W().Push.unregisterEventHandler('UPDATE_NOTIFICATION', this.doRefresh.bind(this));
	},
    doRefresh: function(){
    	var me = this;
    	this.store.load({
            params: {
            	method: "loadUserMessages",
            	destination: me.getDestination(),
            	userGMTOffset: $W().agentGMToffset
            },
            scope: this
        });
    },
    getDestination: function(){
    	return "board";
    },
 // call server method markMessageAsRead via ajax and insert current message to delivered_messages datatable
    ajaxMarkMessageAsRead: function (messageId){
        var conn = new Ext.data.Connection();
        conn.request({
            url: 'messaging.json',
            method: 'POST',
            params: {method: 'markMessageAsRead', readMessageId: messageId, userGMTOffset:$W().agentGMToffset},
            success: function(responseObject) {
            },
             failure: function() {
                 Ext.Msg.alert('Status', 'Unable mark message as read. Please try again later.');
             }
        });

    }
});