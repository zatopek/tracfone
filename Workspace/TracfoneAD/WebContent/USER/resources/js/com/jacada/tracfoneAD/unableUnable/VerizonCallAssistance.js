Ext.define('Jacada.user.com.jacada.tracfoneAD.unableUnable.VerizonCallAssistance', {
    extend: 'Jacada.user.com.jacada.tracfoneAD.baseComponents.BaseView',
    title: 'Contact Verizon',
    xtype: 'verizonCallAssistance',
    layout: 'vbox',
    border: false,
    width: '100%',
    defaults: {
        margin: '5 10 0 5', //top right bottom left (clockwise) margins of each item/column
        xtype: 'displayfield',
        labelStyle: 'white-space: nowrap;',
        labelWidth: 400
    },

    load: function () {

    },

    reset: function () {

    },

    initComponent: function () {
        var me = this;
        Ext.applyIf(me, {
            name: 'verizonCallAssistance',
            items: [
                {
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
                    name: 'avayaId',
                    fieldLabel: 'Avaya ID'
                }, {
                    name: 'verizon_min',
                    fieldLabel: 'MIN'
                }, {
                    name: 'meid',
                    fieldLabel: 'MEID'
                }, {
                    name: 'verizon_sim',
                    fieldLabel: 'SIM'
                }, {
                    name: 'prl',
                    fieldLabel: 'PRL'
                }, {
                    name: 'address',
                    fieldLabel: 'Address'
                }, {
                    name: 'makeAndModel',
                    fieldLabel: 'Make/Model'
                }, {
                    name: 'firmware',
                    fieldLabel: 'Firmware'
                }, {
                    name: 'software',
                    fieldLabel: 'Software'
                }, {
                    name: 'signalStrength',
                    fieldLabel: 'Signal Strength'
                }, {
                    name: 'issue',
                    fieldLabel: 'Brief Description of Issue'
                }
            ]
        });
        me.callParent(arguments)
    }
});
