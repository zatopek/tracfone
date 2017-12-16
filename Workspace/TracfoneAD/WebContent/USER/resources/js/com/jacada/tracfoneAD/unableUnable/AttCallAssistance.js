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
        var pushData = managers['pushData'];
        var data = {
            agentName: $W().agentName,
            avayaId: 'NA',
            min: pushData.deviceProfile.min,
            imei: 'NA',
            sim: pushData.deviceProfile.sim,
            makeAndModel: 'NA',
            numberOfSignalBar: 'NA',
            customerName: pushData.customerProfile.contactName,
            address: pushData.customerProfile.zip,
            issue: 'NA',
            message: 'NA',
            steps: 'NA',
            when: 'NA',
            location: 'NA'
        }
        Ext.each(me.query('displayfield'), function (item) {
            item.setValue(data[item.name]);
        });
        me.unmask();
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
            cls: 'attCallAssistanceCls',
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
                    name: 'min',
                    fieldLabel: 'MIN'
                }, {
                    name: 'imei',
                    fieldLabel: 'IMEI'
                }, {
                    name: 'sim',
                    fieldLabel: 'SIM'
                }, {
                    name: 'makeAndModel',
                    fieldLabel: 'Make/Model'
                }, {
                    name: 'numberOfSignalBar',
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
