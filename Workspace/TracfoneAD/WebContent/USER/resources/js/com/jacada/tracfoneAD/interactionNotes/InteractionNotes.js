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
                value: 'TracFone'
            }, {
                fieldLabel: 'Device Type',
                value: 'Smartphone'
            }, {
                fieldLabel: 'Reason',
                value: 'Redemption'
            }, {
                fieldLabel: 'Result',
                value: 'Redemption Successful'
            }]
        }]
    }, {
        xtype: 'panel',
        border: false,
        layout: 'fit',
        items: [{
            xtype: 'textarea',
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
