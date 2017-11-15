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
                                name: ''
                            }, {
                                fieldLabel: 'SIM',
                                value: '0123456789012345',
                                name: ''
                            }, {
                                fieldLabel: 'SIM Status',
                                name: ''
                            }, {
                                fieldLabel: 'MIN',
                                name: ''
                            }, {
                                fieldLabel: 'MIN Status',
                                name: ''
                            }, {
                                fieldLabel: 'MSID',
                                name: ''
                            }, {
                                fieldLabel: 'Phone Gen',
                                name: ''
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
                                name: ''
                            }, {
                                fieldLabel: 'Hex Serial #',
                                name: ''
                            }, {
                                fieldLabel: 'Port Number',
                                name: ''
                            }, {
                                fieldLabel: 'Leased to Finance',
                                name: ''
                            }, {
                                fieldLabel: 'Lease Status',
                                name: ''
                            }, {
                                fieldLabel: 'Sequence',
                                name: ''
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
                                name: ''
                            }, {
                                fieldLabel: 'Rate Plan',
                                name: ''
                            }, {
                                fieldLabel: 'Service Plan ObjId',
                                name: ''
                            }, {
                                fieldLabel: 'Technology',
                                name: ''
                            }, {
                                fieldLabel: 'Activation Date',
                                name: ''
                            }, {
                                fieldLabel: 'Deact Date',
                                name: ''
                            }, {
                                fieldLabel: 'Service End Date',
                                name: ''
                            }, {
                                fieldLabel: 'Next Charge Date',
                                name: ''
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
                                name: ''
                            }, {
                                fieldLabel: 'Dealer',
                                name: ''
                            }, {
                                fieldLabel: 'Cards in Reserve',
                                name: ''
                            }, {
                                fieldLabel: 'Warranty Exchanges',
                                name: ''
                            }, {
                                fieldLabel: 'Basic Warranty Found',
                                name: ''
                            }, {
                                fieldLabel: 'Extended Warranty',
                                name: ''
                            }, {
                                fieldLabel: 'Current Throttle State',
                                name: ''
                            }, {
                                fieldLabel: 'Auto Refill',
                                name: ''
                            }, {
                                fieldLabel: 'Next Refill Date',
                                name: ''
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
                name: ''
            }, {
                fieldLabel: 'Customer ID',
                name: ''
            }, {
                fieldLabel: 'Group ID',
                name: ''
            }, {
                fieldLabel: 'Email',
                name: 'email'
            }, {
                fieldLabel: 'Zip',
                name: ''
            }, {
                fieldLabel: 'LID',
                name: ''
            }]

        }, {
            columnWidth: 0.15,
            border: true,
            xtype: 'fieldset',
            title: 'ACCOUNT BALANCES',
            defaultType: 'displayfield',
            items: [{
                fieldLabel: 'Phone Status',
                name: ''
            }, {
                fieldLabel: 'Customer ID',
                name: ''
            }, {
                fieldLabel: 'Voice Balance',
                name: ''
            }, {
                fieldLabel: 'SMS Balance',
                name: ''
            }, {
                fieldLabel: 'Data Balance',
                name: ''
            }]
        }]
})