Ext.define('Jacada.user.com.jacada.tracfoneAD.unableUnable.AttCallAssistance', {
    extend: 'Ext.panel.Panel',
    title: 'Contact AT&T',
    layout: 'vbox',
    border: false,
    width: '100%',
    defaults: {
        margin: '5 10 0 5', //top right bottom left (clockwise) margins of each item/column
        xtype: 'displayfield',
        labelStyle: 'white-space: nowrap;',
        labelWidth: 400
    },
    items: [
        {
            xtype: 'panel',
            height: 50,
            border: false,
            items: [
                {
                    xtype: 'displayfield',
                    labelWidth: 0,
                    value: '<h2>Call AT&T at 1-877-252-7716 (DO NOT GIVE THIS NUMBER TO CUSTOMER) </h2>'
                }
            ]
        },
        {
            id: 'agentName',
            fieldLabel: 'Agent\'s Name',
            value: 'Becky Shum'
        }, {
            id: 'avayaId',
            fieldLabel: 'Avaya ID',
            value: 'lab_jacada'
        }, {
            id: 'att_min',
            fieldLabel: 'MIN',
            value: '13219466700'
        }, {
            id: 'imei',
            fieldLabel: 'IMEI',
            value: '94687693948384344'
        }, {
            id: 'att_sim',
            fieldLabel: 'SIM',
            value: '4309509438598325'
        }, {
            id: 'makeAndModel',
            fieldLabel: 'Make/Model',
            value: 'Apple iPhone'
        }, {
            id: 'numSignalBar',
            fieldLabel: 'Number of Signal Bars',
            value: '2'
        }, {
            id: 'customerName',
            fieldLabel: 'Customer Name',
            value: 'John Smith'
        }, {
            id: 'address',
            fieldLabel: 'Address',
            value: '123 Main Street, Atlanta, GA30328'
        }, {
            id: 'issue',
            fieldLabel: 'Exact Issue Customer is Experiencing',
            value: ''
        }, {
            id: 'message',
            fieldLabel: 'Exact Network Message the Customer hears',
            value: ''
        }, {
            id: 'steps',
            fieldLabel: 'All Troubleshooting Steps Done prior to Calling AT&T',
            value: ''
        }, {
            id: 'when',
            fieldLabel: 'When the Issue Began',
            value: ''
        }, {
            id: 'location',
            fieldLabel: 'Has Customer Tried in Other Locations?',
            value: ''
        }
    ]

});
