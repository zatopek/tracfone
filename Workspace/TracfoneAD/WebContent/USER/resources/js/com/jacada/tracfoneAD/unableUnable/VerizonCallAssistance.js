Ext.define('Jacada.user.com.jacada.tracfoneAD.unableUnable.VerizonCallAssistance', {
    extend: 'Jacada.user.com.jacada.tracfoneAD.baseComponents.BaseView',
    title: '<span class="callNumber">Call Verizon at 1-888-946-4669</span> <span class="notify"> (DO NOT GIVE THIS NUMBER TO CUSTOMER) </span>',
    xtype: 'verizonCallAssistance',
    layout: 'vbox',
    border: false,
    width: '100%',

    load: function () {
        var me = this;
        me.mask('Please wait..');
        var pushData = managers['pushData'];
        var data = {
            avayaId: '',
            mdn: pushData.deviceProfile.msid,
            min: pushData.deviceProfile.min,
            meid: pushData.deviceProfile.hexSerial,
            sim: pushData.deviceProfile.sim,
            prl: 'TBD', // check the correct match
            address: 'Customer zip - ' + pushData.customerProfile.zip, // we do not have full address
            makeAndModel: pushData.deviceProfile.manufacturer + ' ' + pushData.deviceProfile.deviceType,
            firmware: pushData.deviceProfile.firmware,
            software: pushData.deviceProfile.os,
            signalStrength: '** Obtain information from customer **',
            issue: '** Obtain information from customer **'

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
            name: 'verizonCallAssistance',
            cls: 'verizonCallAssistanceCls',
            items: [
                {
                    xtype: 'panel',
                    layout: 'column',
                    width: '100%',
                    border: false,
                    defaults: {
                        defaults: {
                            xtype: 'displayfield',
                            labelWidth: 150,
                            width: 375
                        }
                    },
                    items: [
                        {
                            xtype: 'panel',
                            columnWidth: 0.5,
                            border: false,
                            autoWidth: true,
                            items: [
                                {
                                    name: 'avayaId',
                                    fieldLabel: 'Avaya ID'
                                }, {
                                    name: 'mdn',
                                    fieldLabel: 'MDN'
                                },{
                                    name: 'min',
                                    fieldLabel: 'MIN'
                                }, {
                                    name: 'meid',
                                    fieldLabel: 'MEID'
                                }, {
                                    name: 'sim',
                                    fieldLabel: 'SIM'
                                }, {
                                    name: 'prl',
                                    fieldLabel: 'PRL'
                                }]
                        },
                        {
                            xtype: 'panel',
                            columnWidth: 0.5,
                            border: false,
                            autoWidth: true,
                            items: [
                                {
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
                        }
                    ]
                }
            ]
        });
        me.callParent(arguments)
    }
});
