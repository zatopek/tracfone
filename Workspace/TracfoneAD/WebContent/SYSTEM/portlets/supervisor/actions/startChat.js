loadstartChat = function() {

Ext.ns("Jacada.task");


/**
 *  Class that responsible for the 'start chat' action
 *  
 */
Jacada.task.StartChatAction = Ext.extend(Object,{
	
	btn: null,
	targetAgent: null,
	utils: new Jacada.task.TaskUtils(),
	
	
	constructor: function() {
	
	},
	createStartChatBtn: function() {
		
		this.btn = new Ext.Button({
			iconCls: 'add24',
			handler: this.startchat,
		 	disabled: true,
			tooltip: this.utils.getLocalizationValue('application.javascript.supervisor.chat.button.tooltip')

		});
		this.btn.vcont = this;
		return this.btn;
	},
	startchat: function(btn, parent){
		
    	var _this = btn.vcont;
    	
    	var conn = new Ext.data.Connection();
        conn.request({
            url: Spvcontroller_JSON_URL,
            method: 'POST',
            params: { method: "startConversation", agentName: _this.targetAgent},
            success: function(responseObject) {
            	
            	//open the chat window
            	var chatWindow = $W().toolbarWindows['ChatWindow'];
            	if (chatWindow) {
            		$W().runToolbarItem('ChatWindow');
            		$W().undoToolbarNotification('ChatWindow');
            	}
            	
             },
             failure: function(r,a,b) {
    	         Ext.Msg.alert('chat instant failed ' + r);
             }
        });
    },
    enable: function() {
    	this.btn.enable();;
    },
    disable: function() {
    	this.btn.disable();
    },
    setSelectedAgent: function(name) {
    	this.targetAgent = name;
    },
    getButton: function() {
    	return this.btn;
    }
	
});

}