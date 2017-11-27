Ext.define('Jacada.user.com.jacada.tracfoneAD.interactionNotes.InteractionNotes', {
    extend: 'Ext.panel.Panel',
    title: 'CREATE INTERACTION',
    border: false,
    items: [{
        xtype: 'panel',
        border: false,
        layout: {
            type: 'vbox',
            padding: '5'
        },
        items: [{
            xtype: 'panel',
            border: false,
            defaults: {
                xtype: 'displayfield',
                labelStyle: 'white-space: nowrap;'
            },
            items: [{
                fieldLabel: 'Brand',
                name: 'brand',
                value: 'TracFone'
            }, {
                fieldLabel: 'Device Type',
                name: 'deviceType',
                value: 'Smartphone'
            }, {
                fieldLabel: 'Reason',
                name: 'reason',
                value: 'Redemption'
            }, {
                fieldLabel: 'Result',
                name: 'result',
                value: 'Redemption Successful'
            }]
        }]
    }, {
        xtype: 'panel',
        border: false,
        layout: 'fit',
        items: [{
            xtype: 'textarea',
            name: 'autoNotes',
            fieldLabel: 'Auto Notes',
            margin: "10 50 10 0",
            disabled: true,
            value: "Airtime Pin added - $45 30-Dday UNL TALK/DATA, first 10 GB at High Speeds then at 2G"
        }]
    }
        , {
            xtype: 'panel',
            border: false,
            layout: 'fit',
            items: [{
                xtype: 'textarea',
                name: 'agentNotes',
                fieldLabel: 'Agent Notes',
                margin: "10 50 10 0",
                value: ''
            }]
        },
        {
            xtype: 'button',
            margin: "0 0 0 10",
            text: 'Create Interaction'
        }]

});
