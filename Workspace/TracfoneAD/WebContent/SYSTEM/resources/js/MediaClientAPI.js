Ext.define('Jacada.system.MediaClientAPI', {
	singleton: true,
	
	MEDIA_CONTROLLER_URL: 'media.json',
	FILE_MANAGEMENT_URL: $W().CONTEXT_PATH + '/rest/file',
	
	/*This object holds the name of the methods that are supported by mediaJsonController.
	 * buttonClicked
	 * sendEmail
	*/
	supportedControllerActions: {
		buttonClicked: 'buttonClicked',
		loadMessageBody: 'loadMessageBody',
		contextSwitch: 'contextSwitch'
	},
	supportedButtonOperations: {
		answerEmail: 'answerEmail',
		replyEmail: 'replyEmail',
		replyAllEmail: 'replyAllEmail',
		forwardEmail: 'forwardEmail',
		sendEmail: 'sendEmail',
		closeEditEmail: 'closeEditEmail',
		completeEmail: 'completeEmail',
		retrieveMediaItem: 'retrieveMediaItem',
		answerChat: 'answerChat',
		sendChatMessage: 'sendChatMessage',
		closeChat: 'closeChat',
		completeVoice: 'completeVoice'
	},
	setControllerUrl: function(serverUrl){
		this.MEDIA_CONTROLLER_URL = serverUrl;
	},
	clickButton: function(operation, uniqueId, channel, data, responseHandler){
		if(!this.supportedButtonOperations[operation]){
			alert('Operation ' + operation + ' is not supported.');
			$W().LogManager.getLogger("MediaClientAPI").warn(this.getLogHeader() + 
					"The given operation: "+operation+" is not supported in system level. Supporting the operation should be done in project-level.");
			return;
		}
		var params = {
			'operation': operation,
//			'data': data?Ext.JSON.encode(data):'',
			'uniqueId': uniqueId,
			'channel': channel
		};
		data = data?data:{};
		this.sendUserAction('buttonClicked', params, data, responseHandler);
	},
	loadMessageBody: function(uniqueId, handler){
		var params = {'uniqueId': uniqueId};
		this.sendUserAction('loadMessageBody', params, {}, handler);
	},
	contextSwitch: function(uniqueId, unhold){
		var params = {
			'uniqueId': uniqueId,
			'unhold': unhold
		};
		this.sendUserAction('contextSwitch', params, {});
	},
	sendUserAction: function(action, params, data, responseHandler){
		Jacada.Logger.debug("MediaclientAPI.sendUserAction action:" + action 
				+ ", uniqueId:" + params.uniqueId + ", data:" + data);
		if(!this.supportedControllerActions[action]){
			alert('Action ' + action + ' is not supported.');
			$W().LogManager.getLogger("MediaClientAPI").warn(this.getLogHeader() + 
					"The given action: "+action+" is not supported in system level. Supporting the action should be done in project-level.");
			return;
		}
		if(typeof responseHandler != 'function'){
			responseHandler = function(responseObject, opts) {
            	//Nothing do to here. Server will send updated status if any.
            };
		}
		params.method = action;
        var conn = Ext.create('Ext.data.Connection');
        conn.request({
            url: this.MEDIA_CONTROLLER_URL,
            method: 'POST',
            params: params,
            jsonData: data,
            timeout: 120000,
            success: responseHandler,
            failure: function() {
            	responseHandler(false);
	           	var msg = $W().localeManager.getLocalizationValue('application.javascript.media.send.error.message');
	           	msg = Ext.String.format(msg, action, params.operation);
	            Ext.Msg.alert($W().localeManager.getLocalizationValue('application.javascript.media.send.error.title'), msg);
            }
        });
	},
	getFileManagementPrefix: function(){
		return this.FILE_MANAGEMENT_URL;
	},
	downloadAttachment: function(interactionId, fileId, filename){
		var url = this.getAttachmentUrl(interactionId, fileId, filename);
		$W().LogManager.getLogger("MediaClientAPI").debug(this.getLogHeader() + 
				"Downloading attachment: " + url);
		window.open(url);
	},
	getAttachmentUrl: function(interactionId, fileId, filename){
		return this.getFileManagementPrefix() + '/' + interactionId + '/' + fileId + '/' + filename;
	},
	getLogHeader: function(){
		return 'MediaClientAPI.js ';
	}
	
});