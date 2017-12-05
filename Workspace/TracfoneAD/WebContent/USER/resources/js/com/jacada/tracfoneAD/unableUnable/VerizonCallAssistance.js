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
        var me = this;
        me.mask('please wait..');
        adam.callService('../USER/resources/js/dummydata/verizonCallAssistance.json', 'GET', {}).then(function (response) {
            Ext.each(me.query('displayfield'), function (item) {
                item.setValue(response[item.name]);
            });
            me.unmask();
        }).error(function () {
            Ext.Msg.alert('ERROR', 'Error getting Verizon call assistance data');
            me.unmask();
        });
    },

    reset: function () {
        var me = this;
        Ext.each(me.query('displayfield'), function (item) {
            item.setValue('');
        });
    },

    initComponent: function () {
        var me = this;
        Ext.applyIf(me, {
            name: 'verizonCallAssistance',
            items: [
                {
                    xtype: 'panel',
                    height: 50,
                    margin: '0 0 0 10',
                    border: false,
                    items: [
                        {
                            xtype: 'component',
                            html: '<h2>Call Verizon at 1-888-946-4669 (DO NOT GIVE THIS NUMBER TO CUSTOMER) </h2>'
                        }
                    ]
                }, {
                    name: 'avayaId',
                    fieldLabel: 'Avaya ID'
                }, {
                    name: 'verizonMin',
                    fieldLabel: 'MIN'
                }, {
                    name: 'meid',
                    fieldLabel: 'MEID'
                }, {
                    name: 'verizonSim',
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
