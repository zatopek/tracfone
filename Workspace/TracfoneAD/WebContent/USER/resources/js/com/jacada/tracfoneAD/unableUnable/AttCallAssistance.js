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
        var me = this;
        me.mask('please wait..');
        adam.callService('../USER/resources/js/dummydata/attCallAssistance.json', 'GET', {}).then(function (response) {
            Ext.each(me.query('displayfield'), function (item) {
                item.setValue(response[item.name]);
            });
            me.unmask();
        }).error(function () {
            Ext.Msg.alert('ERROR', 'Error getting AT&T call assistance data');
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
            name: 'attCallAssistance',
            items: [
                {
                    xtype: 'panel',
                    height: 50,
                    border: false,
                    margin: '0 0 0 10',
                    items: [
                        {
                            xtype: 'component',
                            html: '<h2>Call AT&T at 1-877-252-7716 (DO NOT GIVE THIS NUMBER TO CUSTOMER) </h2>'
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
                    name: 'attMin',
                    fieldLabel: 'MIN'
                }, {
                    name: 'imei',
                    fieldLabel: 'IMEI'
                }, {
                    name: 'attSim',
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
