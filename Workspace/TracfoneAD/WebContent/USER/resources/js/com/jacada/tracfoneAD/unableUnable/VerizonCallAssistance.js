Ext.define('Jacada.user.com.jacada.tracfoneAD.unableUnable.VerizonCallAssistance', {
    extend: 'Ext.panel.Panel',
    title: 'Contact Verizon',
    layout: 'vbox',
    border: false,
    width: '100%',
    defaults: {
        margin: '5 10 0 5', //top right bottom left (clockwise) margins of each item/column
        xtype: 'displayfield',
        labelStyle: 'white-space: nowrap;',
        labelWidth: 400
    },
    items:
        [{
            xtype: 'panel',
            height: 50,
            border: false,
            items: [
                {
                    xtype: 'displayfield',
                    labelWidth: 0,
                    value: '<h2>Call Verizon at 1-888-946-4669 (DO NOT GIVE THIS NUMBER TO CUSTOMER) </h2>'
                }
            ]
        }, {
            id: 'avayaId',
            fieldLabel: 'Avaya ID',
            value: 'lab_jacada'
        }, {
            id: 'verizon_min',
            fieldLabel: 'MIN',
            value: '13219466700'
        }, {
            id: 'meid',
            fieldLabel: 'MEID',
            value: '94687693948384344'
        }, {
            id: 'verizon_sim',
            fieldLabel: 'SIM',
            value: '4309509438598325'
        }, {
            id: 'prl',
            fieldLabel: 'PRL',
            value: ''
        }, {
            id: 'address',
            fieldLabel: 'Address',
            value: '123 Main Street, Atlanta, GA30328'
        }, {
            id: 'makeAndModel',
            fieldLabel: 'Make/Model',
            value: 'Apple iPhone'
        }, {
            id: 'firmware',
            fieldLabel: 'Firmware',
            value: ''
        }, {
            id: 'software',
            fieldLabel: 'Software',
            value: ''
        }, {
            id: 'signalStrength',
            fieldLabel: 'Signal Strength',
            value: '2'
        }, {
            id: 'issue',
            fieldLabel: 'Brief Description of Issue',
            value: ''
        }
        ]

});
