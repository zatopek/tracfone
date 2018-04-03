Ext.define('Jacada.user.com.jacada.tracfoneAD.unableUnable.AttCallAssistance', {
    extend: 'Jacada.user.com.jacada.tracfoneAD.baseComponents.BaseView',
    xtype: 'attCallAssitance',
    title: '<span class="callNumber">Call AT&T at 1-877-252-7716</span> <span class="notify"> (DO NOT GIVE THIS NUMBER TO CUSTOMER)</span>',
    layout: 'vbox',
    border: false,
    width: '100%',

    load: function () {
        var me = this;
        me.mask('Please wait..');
        var pushData = managers['pushData'];
        var data = {
            agentName: $W().agentName,
            avayaId: '',
            min: pushData.deviceProfile.min,
            imei: this.getImei(pushData),
            sim: pushData.deviceProfile.sim,
            makeAndModel: pushData.deviceProfile.manufacturer + ' ' + pushData.deviceProfile.deviceType,
            numberOfSignalBar: '',
            customerName: pushData.customerProfile.contactName,
            address: 'Customer zip - ' + pushData.customerProfile.zip,
            issue: '',
            message:'',
            steps: '',
            when: '',
            location: ''
        }

        Ext.each(me.query('displayfield'), function (item) {
            item.setValue(data[item.name]);
        });
        me.unmask();
    },

    getImei: function(pushData) {
        if(pushData.deviceProfile.deviceType.toLowerCase() === 'byop') {
            var sim = pushData.deviceProfile.sim;
            if(sim.length >= 15){
                return sim.substring(sim.length - 15);
            }
            else {
                return sim;
            }
        }
        else{
            return pushData.deviceProfile.esn;
        }
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
                    layout: 'column',
                    width: '100%',
                    border: false,
                    title: 'Obtain the following (or appropriate) information from the customer',
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
                                }
                            ]
                        },
                        {
                            xtype: 'panel',
                            columnWidth: 0.5,
                            border: false,
                            autoWidth: true,
                            items: [
                                {
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
                        }
                    ]
                }
            ]
        });
        me.callParent(arguments);
    }
});
