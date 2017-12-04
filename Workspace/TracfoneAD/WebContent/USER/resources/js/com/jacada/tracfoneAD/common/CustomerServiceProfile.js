Ext.define('Jacada.user.com.jacada.tracfoneAD.common.CustomerServiceProfile', {
    extend: 'Jacada.user.com.jacada.tracfoneAD.baseComponents.BaseView',
    xtype: 'customerServiceProfile',
    layout: 'column',
    defaults: {
        margin: '5 10 0 5', //top right bottom left (clockwise) margins of each item/column
        height: 280
    },

    load: function (data) {
        var me = this;
        var loader = function (component, componentData) {
            var fields = component.query('displayfield');
            Ext.each(fields, function (field) {
                field.setValue(componentData[field.name]);
            })
        }

        Ext.each(me.items.items, function (item) {
            loader(item, data[item.name])
        })
    },

    reset: function () {
        var me = this;
        Ext.each(me.query('displayfield'), function (field) {
            field.setValue('');
        });
    },

    initComponent: function () {
        var me = this;
        Ext.applyIf(me, {
            name: 'customerServiceProfile',
            items: [
                {
                    columnWidth: 0.35,
                    border: true,
                    xtype: 'fieldset',
                    title: 'DEVICE PROFILE',
                    name: 'deviceProfile', // match with pushData property name {"accountBalances":{},"customerProfile":{},"deviceProfile":{},"serviceProfile":{}}
                    items: [
                        {
                            xtype: 'panel',
                            layout: 'column',
                            border: false,
                            items: [
                                {
                                    columnWidth: 0.5,
                                    defaultType: 'displayfield',
                                    border: false,
                                    items: [
                                        {
                                            fieldLabel: 'Device Type',
                                            name: 'deviceType'
                                        }, {
                                            fieldLabel: 'SIM',
                                            name: 'sim'
                                        }, {
                                            fieldLabel: 'SIM Status',
                                            name: 'simStatus'
                                        }, {
                                            fieldLabel: 'MIN',
                                            name: 'min'
                                        }, {
                                            fieldLabel: 'MIN Status',
                                            name: 'minStatus'
                                        }, {
                                            fieldLabel: 'MSID',
                                            name: 'msid'
                                        }, {
                                            fieldLabel: 'Phone Gen',
                                            name: 'phoneGen'
                                        }
                                    ]
                                },
                                {
                                    columnWidth: 0.5,
                                    defaultType: 'displayfield',
                                    border: false,
                                    items: [
                                        {
                                            fieldLabel: 'Serial #',
                                            name: 'serial'
                                        }, {
                                            fieldLabel: 'Hex Serial #',
                                            name: 'hexSerial'
                                        }, {
                                            fieldLabel: 'Part Number',
                                            name: 'partNumber'
                                        }, {
                                            fieldLabel: 'Leased to Finance',
                                            name: 'leasedToFinance'
                                        }, {
                                            fieldLabel: 'Lease Status',
                                            name: 'leaseStatus'
                                        }, {
                                            fieldLabel: 'Sequence',
                                            name: 'sequence'
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    columnWidth: 0.35,
                    border: true,
                    xtype: 'fieldset',
                    title: 'SERVICE PROFILE',
                    name: 'serviceProfile',
                    items: [
                        {
                            xtype: 'panel',
                            layout: 'column',
                            border: false,
                            items: [
                                {
                                    columnWidth: 0.5,
                                    border: false,
                                    defaultType: 'displayfield',
                                    items: [
                                        {
                                            fieldLabel: 'Service Type',
                                            name: 'serviceType'
                                        }, {
                                            fieldLabel: 'Rate Plan',
                                            name: 'ratePlan'
                                        }, {
                                            fieldLabel: 'Service Plan ObjId',
                                            name: 'servicePlanObjId'
                                        }, {
                                            fieldLabel: 'Carrier',
                                            name: 'carrier'
                                        }, , {
                                            fieldLabel: 'Technology',
                                            name: 'technology'
                                        }, {
                                            fieldLabel: 'Activation Date',
                                            name: 'activationDate'
                                        }, {
                                            fieldLabel: 'Deact Date',
                                            name: 'deactDate'
                                        }, {
                                            fieldLabel: 'Service End Date',
                                            name: 'serviceEndDate'
                                        }, {
                                            fieldLabel: 'Next Charge Date',
                                            name: 'nextChargeDate'
                                        }
                                    ]
                                },
                                {
                                    columnWidth: 0.5,
                                    border: false,
                                    defaultType: 'displayfield',
                                    items: [
                                        {
                                            fieldLabel: 'Brand',
                                            name: 'brand'
                                        }, {
                                            fieldLabel: 'Dealer',
                                            name: 'dealer'
                                        }, {
                                            fieldLabel: 'Cards in Reserve',
                                            name: 'cardsInReserve'
                                        }, {
                                            fieldLabel: 'Warranty Exchanges',
                                            name: 'warrantyExchanges'
                                        }, {
                                            fieldLabel: 'Basic Warranty Found',
                                            name: 'basicWarrantyFound'
                                        }, {
                                            fieldLabel: 'Extended Warranty',
                                            name: 'extendedWarranty'
                                        }, {
                                            fieldLabel: 'Current Throttle Status',
                                            name: 'currentThrottleStatus'
                                        }, {
                                            fieldLabel: 'Auto Refill',
                                            name: 'autoRefill'
                                        }, {
                                            fieldLabel: 'Next Refill Date',
                                            name: 'nextRefillDate'
                                        }
                                    ]
                                }
                            ]
                        }
                    ]

                }
                , {
                    columnWidth: 0.15,
                    border: true,
                    xtype: 'fieldset',
                    title: 'CUSTOMER PROFILE',
                    name: 'customerProfile',
                    defaultType: 'displayfield',
                    items: [
                        {
                            fieldLabel: 'Customer Id',
                            name: 'customerId'
                        }, {
                            fieldLabel: 'Contact Name',
                            name: 'contactName'
                        }, {
                            fieldLabel: 'Email',
                            name: 'email'
                        }, {
                            fieldLabel: 'Group ID',
                            name: 'groupId'
                        }, {
                            fieldLabel: 'Zip',
                            name: 'zip'
                        }, {
                            fieldLabel: 'LID',
                            name: 'ltd'
                        }
                    ]

                }, {
                    columnWidth: 0.15,
                    border: true,
                    xtype: 'fieldset',
                    title: 'ACCOUNT BALANCES',
                    name: 'accountBalances',
                    defaultType: 'displayfield',
                    items: [
                        {
                            fieldLabel: 'Phone Status',
                            name: 'phoneStatus'
                        }, {
                            fieldLabel: 'Voice Balance',
                            name: 'voiceBalance'
                        }, {
                            fieldLabel: 'SMS Balance',
                            name: 'smsBalance'
                        }, {
                            fieldLabel: 'Data Balance',
                            name: 'dataBalance'
                        }
                    ]
                }
            ]
        });
        me.callParent(arguments);
    }
})