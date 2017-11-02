Ext.define('Jacada.user.com.jacada.tracfoneAD.agentAssist.AgentAssist', {
    extend: 'Ext.panel.Panel',
    items: [{
        xtype: 'panel',
        height: 150, width: 230,
        layout: { type: 'vbox', pack: 'center' },
        border: false,
        //bodyStyle: 'margin: 20 20 20 20',
        /*defaults: {
           flex:1
        },*/
        items: [
            {
                xtype: "button",
                text: "Call Back Now",
                cls: "agentAssitBtn"
            }, 
               {
                xtype: "button",
                text: "Call Back in 10 Mins",
                cls: "agentAssitBtn"
            }, {
                xtype: "button",
                text: "Schedule Call Back",
                cls: "agentAssitBtn"
            }
        ]
    }]
});
