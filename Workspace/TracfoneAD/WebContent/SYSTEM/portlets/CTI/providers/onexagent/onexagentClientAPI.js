/**
*  @class OneXAgentClientAPI
*  This class defines an interface between Avaya OneX and UI
**/

var OneXAgentClientAPI = Class.create();

OneXAgentClientAPI.prototype = {
    initialize: function()
    {
        this.oneX = OneXAgent;        
    },
    init : function (port) {
    	this.oneX.init(port, "workspace");
        this.oneX.setCallback(this);
    },
    registerclient : function () {
        return this.oneX.registerclient();
    },

    unregisterclient : function () {
        return this.oneX.unregisterclient();
    },

    onQueueEmpty : function (objectId, notificationId, timeStamp) {
    	onQueueEmpty(objectId, notificationId, timeStamp);
    },

    onWorkItemAdded : function (NotificationId, ObjectId, TimeStamp, Topic) {
        $W().LogManager.getLogger("client.onex").debug('onWorkItemAdded (' + ObjectId + ') not implemented API' );
    },

    onWorkItemRemoved : function (NotificationId, ObjectId, TimeStamp, Topic) {
        $W().LogManager.getLogger("client.onex").debug('onWorkItemRemoved (' + ObjectId + ') not implemented API' );
    },
    onVoiceInteractionCreated : function (NotificationId, ObjectId, TimeStamp, WorkItemId, RemoteUser, Topic, RemoteAddress, PromptedDigits, UUI ) {
        onVoiceInteractionCreated(NotificationId, ObjectId, TimeStamp, WorkItemId, RemoteUser, Topic, RemoteAddress,
                                                                                        PromptedDigits, UUI );
    },

    onVoiceInteractionMissed : function(NotificationId, ObjectId, TimeStamp, WorkItemId, RemoteUser, Topic) {
        onVoiceInteractionMissed(NotificationId, ObjectId, TimeStamp, WorkItemId, RemoteUser, Topic);
    },

    onVoiceInteractionTerminated : function(NotificationId, ObjectId, TimeStamp, WorkItemId, RemoteUser, Topic, RemoteAddress, PromptedDigits, UUI) {
        onVoiceInteractionTerminated(NotificationId, ObjectId, TimeStamp, WorkItemId, RemoteUser, Topic, RemoteAddress, PromptedDigits, UUI);
    },

    onIMInteractionCreated : function(NotificationId, ObjectId, TimeStamp, WorkItemId, Topic) {
        $W().LogManager.getLogger("client.onex").debug('onIMInteractionCreated (' + ObjectId + ') not implemented API' );
    },

    onIMInteractionTerminated : function(NotificationId, ObjectId, TimeStamp, WorkItemId, Topic) {
        $W().LogManager.getLogger("client.onex").debug('onIMInteractionCreated (' + ObjectId + ') not implemented API' );
    },
    onApplicationErrorHandler : function (response) {
        applicationErrorHandler(response);
    },
    onCommunicationErrorHandler : function (response) {
        communicationErrorHandler(response);
    },
    accept : function (interactionid) {
        return this.oneX.accept(interactionid);
    },

    release : function (interactionid) {
        return this.oneX.release(interactionid);
    },

    hold : function (interactionid) {
        return this.oneX.hold(interactionid);
    },

    unhold : function (interactionid) {
        return this.oneX.unhold(interactionid);
    },

    mute : function () {
        return this.oneX.mute();
    },

    unmute : function () {
        return this.oneX.unmute();
    },

    makecall : function (number) {
        return this.oneX.makecall(number);
    }


}

var OneXAgentAPI = new OneXAgentClientAPI();
