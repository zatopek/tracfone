Ext.define('Jacada.user.com.jacada.tracfoneAD.common.CustomerServiceProfile', {
    extend: 'Ext.panel.Panel',
    //title: 'CUSTOMER SERVICE PROFILE',
    layout: 'column',
    defaults: {
        margin: '5 10 0 5', //top right bottom left (clockwise) margins of each item/column
        height: 280
    },
    items: [
        {
            columnWidth: 0.35,
            border: true,
            xtype: 'fieldset',
            title: 'DEVICE PROFILE',
            items: [{
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
                                id: 'deviceType'
                            }, {
                                fieldLabel: 'SIM',
                                value: '0123456789012345',
                                id: 'sim'
                            }, {
                                fieldLabel: 'SIM Status',
                                id: 'simStatus'
                            }, {
                                fieldLabel: 'MIN',
                                id: 'min'
                            }, {
                                fieldLabel: 'MIN Status',
                                id: 'minStatus'
                            }, {
                                fieldLabel: 'MSID',
                                id: 'msid'
                            }, {
                                fieldLabel: 'Phone Gen',
                                id: 'phoneGen'
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
                                id: 'serial'
                            }, {
                                fieldLabel: 'Hex Serial #',
                                id: 'hexSerial'
                            }, {
                                fieldLabel: 'Port Number',
                                id: 'portNumber'
                            }, {
                                fieldLabel: 'Leased to Finance',
                                id: 'leasedToFinance'
                            }, {
                                fieldLabel: 'Lease Status',
                                id: 'leaseStatus'
                            }, {
                                fieldLabel: 'Sequence',
                                id: 'sequence'
                            }

                        ]
                    }
                ]
            }]

        },
        {
            columnWidth: 0.35,
            border: true,
            xtype: 'fieldset',
            title: 'SERVICE PROFILE',
            items: [{
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
                                id: 'serviceType'
                            }, {
                                fieldLabel: 'Rate Plan',
                                id: 'ratePlan'
                            }, {
                                fieldLabel: 'Service Plan ObjId',
                                id: 'servicePlanObjId'
                            }, {
                                fieldLabel: 'Technology',
                                id: 'technology'
                            }, {
                                fieldLabel: 'Activation Date',
                                id: 'activationDate'
                            }, {
                                fieldLabel: 'Deact Date',
                                id: 'deactDate'
                            }, {
                                fieldLabel: 'Service End Date',
                                id: 'serviceEndDate'
                            }, {
                                fieldLabel: 'Next Charge Date',
                                id: 'nextChargeDate'
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
                                id: 'brand'
                            }, {
                                fieldLabel: 'Dealer',
                                id: 'dealer'
                            }, {
                                fieldLabel: 'Cards in Reserve',
                                id: 'cardsInReserve'
                            }, {
                                fieldLabel: 'Warranty Exchanges',
                                id: 'warrantyExchanges'
                            }, {
                                fieldLabel: 'Basic Warranty Found',
                                id: 'basicWarrantyFound'
                            }, {
                                fieldLabel: 'Extended Warranty',
                                id: 'extendedWarranty'
                            }, {
                                fieldLabel: 'Current Throttle State',
                                id: 'currentThrottleState'
                            }, {
                                fieldLabel: 'Auto Refill',
                                id: 'autoRefill'
                            }, {
                                fieldLabel: 'Next Refill Date',
                                id: 'nextRefillDate'
                            }

                        ]
                    }
                ]
            }]

        }
        , {
            columnWidth: 0.15,
            border: true,
            xtype: 'fieldset',
            title: 'CUSTOMER PROFILE',
            defaultType: 'displayfield',
            items: [{
                fieldLabel: 'Name',
                id: 'name'
            }, {
                fieldLabel: 'Customer ID',
                id: 'customerId'
            }, {
                fieldLabel: 'Group ID',
                id: 'groupId'
            }, {
                fieldLabel: 'Email',
                id: 'email'
            }, {
                fieldLabel: 'Zip',
                id: 'zip'
            }, {
                fieldLabel: 'LID',
                id: 'ltd'
            }]

        }, {
            columnWidth: 0.15,
            border: true,
            xtype: 'fieldset',
            title: 'ACCOUNT BALANCES',
            defaultType: 'displayfield',
            items: [{
                fieldLabel: 'Phone Status',
                id: 'phoneStatus'
            }, {
                fieldLabel: 'Customer ID',
                id: 'customerId'
            }, {
                fieldLabel: 'Voice Balance',
                id: 'voiceBalance'
            }, {
                fieldLabel: 'SMS Balance',
                id: 'smsBalance'
            }, {
                fieldLabel: 'Data Balance',
                id: 'dataBalance'
            }]
        }]
})