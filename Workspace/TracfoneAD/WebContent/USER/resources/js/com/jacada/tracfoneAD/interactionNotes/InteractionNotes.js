Ext.define('Jacada.user.com.jacada.tracfoneAD.interactionNotes.InteractionNotes', {
    extend: 'Ext.panel.Panel',
    layout: 'column',
    items: [{
        xtype: 'panel',
        columnWidth: 0.4,
        border: false,
        defaults: {
            xtype: 'displayfield',
            labelStyle: 'white-space: nowrap;'
        },
        items: [{
            fieldLabel: 'Brand',
            value: 'Straight Talk Wireless'
        }, {
            fieldLabel: 'Device Type',
            value: 'Smartphone'
        },{
            fieldLabel: 'Reason',
            value: 'Redemption'
        }, {
            fieldLabel: 'Result',
            value: 'Redemption Successful'
        }]
    },  {
        xtype: 'panel',
        border: false,
        columnWidth: 0.6,
        items: [{
            xtype: 'textarea',
            cls: 'interaction_textarea',
            width: '90%',
            value: "Airtime Pin added - $45 30-Dday UNL TALK/DATA, first 10 GB at High Speeds then at 2G"
        }]


    }]

});
