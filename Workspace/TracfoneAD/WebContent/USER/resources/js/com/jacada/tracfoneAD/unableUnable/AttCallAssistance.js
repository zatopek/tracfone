Ext.define('Jacada.user.com.jacada.tracfoneAD.unableUnable.AttCallAssistance', {
    extend: 'Jacada.user.com.jacada.tracfoneAD.baseComponents.BaseView',
    xtype: 'attCallAssitance',
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

    load: function () {

    },

    reset: function () {

    },

    initComponent: function () {
        var me = this;
        Ext.applyIf(me, {
            name: 'attCallAssistance',
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
                    name: 'agentName',
                    fieldLabel: 'Agent\'s Name'
                }, {
                    name: 'avayaId',
                    fieldLabel: 'Avaya ID'
                }, {
                    name: 'att_min',
                    fieldLabel: 'MIN'
                }, {
                    name: 'imei',
                    fieldLabel: 'IMEI'
                }, {
                    name: 'att_sim',
                    fieldLabel: 'SIM'
                }, {
                    name: 'makeAndModel',
                    fieldLabel: 'Make/Model'
                }, {
                    name: 'numSignalBar',
                    fieldLabel: 'Number of Signal Bars'
                }, {
                    name: 'customerName',
                    fieldLabel: 'Customer Name'
                }, {
                    name: 'address',
                    fieldLabel: 'Address'
                }, {
                    name: 'issue',
                    fieldLabel: 'Exact Issue Customer is Experiencing'
                }, {
                    name: 'message',
                    fieldLabel: 'Exact Network Message the Customer hears'
                }, {
                    name: 'steps',
                    fieldLabel: 'All Troubleshooting Steps Done prior to Calling AT&T'
                }, {
                    name: 'when',
                    fieldLabel: 'When the Issue Began'
                }, {
                    name: 'location',
                    fieldLabel: 'Has Customer Tried in Other Locations?'
                }
            ]
        });
        me.callParent(arguments);
    }
});
