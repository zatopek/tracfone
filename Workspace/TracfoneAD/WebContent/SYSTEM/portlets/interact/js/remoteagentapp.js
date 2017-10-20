/**
 * Created with JetBrains WebStorm.
 * User: arie
 * Date: 09/07/13
 * Time: 18:58
 * To change this template use File | Settings | File Templates.
 */

function AgentApp(parent, options) {

    var src = options.connection.server + '/agent-app/index-debug.html';
    src=src+"?theme=" + options.layout.theme;
    src=src+"&showSearch=" + options.layout.showSearch;
    src=src+"&appkey=" + options.authentication.applicationKey;
    src=src+"&accountId="+options.connection.accountId;
    src=src+"&access-token=" + options.connection.accessToken;
    src=src+"&agentId=" + options.authentication.agentId;
    src=src+"&showTabs=false";
    src=src+"&showInformationArea=" + options.layout.showInformationArea;
    src=src+"&showAddNote=" + options.layout.showAddNote;
    src=src+"&showAccordion=" + options.layout.showAccordion;
    if (options.autostart.interactionId){
        src=src+"&interaction=" + options.autostart.interactionId;
    }
    src=src+"&showChat=true";
    src=src+"&embedded=true";

    if (options.connection.queryString) {
        src=src + "&" + options.connection.queryString;
    }

    this.iframe = $('<iframe>')
        .attr('type','text/html')
        .attr('width',"100%")
        .attr('height',"100%")
        .attr('src',src)
        .attr('marginheight','0')
        .attr('marginwidth','0')
        .attr('frameborder','0')
        .css('border','none');

    parent.append(this.iframe);

};

AgentApp.prototype.startInteraction = function(id,name) {
    pm({
        target: this.iframe[0].contentWindow,
        data : {id:id, name:name},
        type : "start"
    });
};

AgentApp.prototype.registerEvent = function (event, handler) {
    pm.bind(event, handler);
};

/**
 * Clicks the next button
 * @param instanceId        - instance Id of the interaction
 */
AgentApp.prototype.next = function(instanceId) {
    pm({
        target: this.iframe[0].contentWindow,
        data : instanceId,
        type : "next"
    });
};

/**
 * Clicks on the back button
 * @param instanceId       - instance Id of the interaction
 */
AgentApp.prototype.back = function(instanceId) {
    pm({
        target: this.iframe[0].contentWindow,
        data : instanceId,
        type : "back"
    });
};

AgentApp.prototype.checkAvailability = function(queue) {
    pm({
        target: this.iframe[0].contentWindow,
        data : queue,
        type : "checkChatAvailability"
    });
};

AgentApp.prototype.requestChat = function(queue) {
    pm({
        target: this.iframe[0].contentWindow,
        data : queue,
        type : "requestChat"
    });
};

AgentApp.prototype.getChatMessages = function() {
    pm({
        target: this.iframe[0].contentWindow,
        type : "getChatMessages"
    });
};

AgentApp.prototype.sendChatMessage = function(text) {
    pm({
        target: this.iframe[0].contentWindow,
        data:text,
        type : "sendChatMessage"
    });
};
