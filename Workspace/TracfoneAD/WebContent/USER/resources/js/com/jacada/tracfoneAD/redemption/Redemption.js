$W().setTabTitle("RedemptionTab", "CUSTOMER SERVICE PROFILE");
var customerServiceProfilePanel = Ext.create('Jacada.user.com.jacada.tracfoneAD.common.CustomerServiceProfile');
//var airtimePlanGrid = Ext.create('Jacada.user.com.jacada.tracfoneAD.redemption.AirtimePlanGrid');

Ext
    .define(
        'Jacada.user.com.jacada.tracfoneAD.redemption.Redemption',
        {
            extend: 'Ext.panel.Panel',
            //title: 'Customer Service Profile',
            items: [
                customerServiceProfilePanel,

                {
                    xtype: 'panel',
                    layout: 'column',
                    items: [
                        {
                            xtype: 'panel',
                            columnWidth: 0.4,
                            border: false,
                            items: [
                                {

                                    xtype: 'panel',
                                    border: false,
                                    title: 'ADD AIRTIME PIN',

                                    defaults: {
                                        bodyStyle: 'padding:5px 5px 5px 5px',
                                        labelStyle: 'white-space: nowrap;'
                                    },

                                    items: [{
                                        xtype: 'panel',
                                        layout: 'column',
                                        border: false,
                                        items: [
                                            {
                                                columnWidth: 0.6,
                                                xtype: "displayfield",
                                                value: "***********0608",
                                                name: "textvalue"
                                            },
                                            {
                                                columnWidth: 0.4,
                                                xtype: "button",
                                                text: "Add Now"
                                            }

                                        ]
                                    }]
                                },
                                {

                                    xtype: 'panel',
                                    //title: 'ADD AIRTIME PIN',
                                    border: false,

                                    defaults: {
                                        bodyStyle: 'padding:5px 5px 5px 5px',
                                        labelStyle: 'white-space: nowrap;'
                                    },

                                    items: [{
                                        xtype: 'panel',
                                        layout: 'column',
                                        border: false,
                                        bodyStyle: 'padding:5px 5px 5px 5px, margins: 10px',
                                        items: [
                                            {
                                                columnWidth: 0.4,
                                                xtype: "textfield",
                                                fieldLabel: "Airtime Pin",
                                                name: "textvalue"
                                            },
                                            {
                                                columnWidth: 0.6,
                                                xtype: 'panel',
                                                border: false,
                                                layout: 'hbox',
                                                items: [
                                                    {
                                                        xtype: "textfield",
                                                        fieldLabel: "Promo Code",
                                                        name: "textvalue"
                                                    }, {
                                                        xtype: 'button',
                                                        text: 'Validate'
                                                    }
                                                ]
                                            }
                                        ]
                                    }]
                                },
                                {

                                    xtype: 'panel',
                                    border: false,
                                    bodyStyle: 'padding:5px 5px 5px 5px',
                                    items: [{
                                        xtype: "displayfield",
                                        value: "<p><b>$45 30-Dday UNL TALK/DATA, first 10 GB at High Speeds then at 2G</b></p>",
                                        name: "textvalue"
                                    }

                                    ]
                                },
                                {
                                    xtype: 'panel',
                                    border: false,
                                    bodyStyle: 'padding:5px 5px 5px 5px',
                                    layout: 'column',
                                    items: [

                                        , {
                                            columnWidth: 0.6,
                                            xtype: "displayfield",
                                            value: ""
                                        },
                                        {
                                            columnWidth: 0.4,
                                            xtype: "button",
                                            text: 'Submit'
                                        }

                                    ]
                                },
                                /*
                                {
                                    xtype: 'panel',
                                    title: 'BILLING SUMMARY',
                                    defaults: {
                                        xtype: 'displayfield',
                                        labelStyle: 'white-space: nowrap;'
                                    },
                                    items: [{

                                        fieldLabel: 'Subtotal',
                                        name: 'textvalue'
                                    }, {

                                        fieldLabel: 'Tax',
                                        name: 'textvalue'
                                    }, {

                                        fieldLabel: 'E911',
                                        name: 'textvalue'
                                    }, {

                                        fieldLabel: 'Total',
                                        name: 'textvalue'
                                    }]
                                },
                                 */
                                {
                                    xtype: 'panel',
                                    height: 450,
                                    title: 'TRANSACTION SUMMARY',
                                    boarder: false,
                                    bodyStyle: 'padding:5px 5px 5px 5px',
                                    items: [{
                                        xtype: 'displayfield',
                                        value: '<p>Thank you for adding benefits to your phone! '
                                        + '<p>You will need to turn your phone OFF and back on to reset and restore your benefits.'
                                        + '<p>Please remember to add benefits to your phone before <Service End Date>. As a reminder, we will send you a text message or email before this date.'
                                        + '<p>Service plan added: <b>$45 Unlimited Talk, Text & Data Plan</b>',

                                    }]
                                }]
                        },
                        {
                            xtype: 'panel',
                            columnWidth: 0.6,
                            border: false,
                            items: [
                                /*
                                {

                                    xtype: 'panel',
                                    title: 'AIRTIME PURCHASE',
                                    border: false,
                                    layout: 'column',
                                    items: [


                                        {
                                            columnWidth: 0.2,
                                            xtype: "displayfield",
                                            fieldLabel: "Recent Purchase"
                                        },
                                        {
                                            columnWidth: 0.2,
                                            xtype: "displayfield",
                                            fieldLabel: "xxxx-xxxx-1234"
                                        },
                                        {
                                            columnWidth: 0.2,
                                            xtype: "textfield",
                                            fieldLabel: "Promo Code"
                                        },
                                        {
                                            columnWidth: 0.2,
                                            xtype: "textfield",
                                            fieldLabel: "CVV"
                                        }, {
                                            columnWidth: 0.2,
                                            xtype: "button",
                                            text: 'Purchase'
                                        }]
                                },
*/
                                {
                                    xtype: "panel",
                                    layout: "column",
                                    items: [
                                        {
                                            xtype: "panel",
                                            title: "SELECT AIRTIME PLAN",
                                            columnWidth: 0.6,
                                            border: false,
                                            height: 250
                                            /*,
                                            items: [
                                                airtimePlanGrid
                                            ]
                                            */
                                        },
                                        {
                                            xtype: "panel",
                                            title: "BILLING SUMMARY",
                                            columnWidth: 0.4,
                                            border: false,
                                            defaults: {
                                                xtype: 'displayfield',
                                                labelStyle: 'white-space: nowrap;'
                                            },
                                            items: [{

                                                fieldLabel: 'Subtotal',
                                                name: 'textvalue',
                                                value: '$00.00'
                                            }, {

                                                fieldLabel: 'Tax',
                                                name: 'textvalue',
                                                value: '$00.00'
                                            }, {

                                                fieldLabel: 'E911',
                                                name: 'textvalue',
                                                value: '$00.00'
                                            }, {

                                                fieldLabel: 'Total',
                                                name: 'textvalue',
                                                value: '$00.00'
                                            }]
                                        }]
                                }

                                , {
                                    xtype: 'panel',
                                    title: 'PAYMENT SELECTION',

                                    items: [{
                                        xtype: 'panel',
                                        border: false,
                                        layout: 'hbox',
                                        items: [
                                            {
                                                xtype: "combo",
                                                fieldLabel: "",
                                                name: "combovalue",
                                                hiddenName: "combovalue",
                                                value: "xxxx-xxxx-xxxx-1234"
                                            }, {
                                                xtype: "textfield",
                                                fieldLabel: "CVV",
                                                name: "textvalue"
                                            }, {
                                                xtype: 'button',
                                                text: 'Purchase'
                                            }, {
                                                xtype: 'button',
                                                text: 'Add New Payment'

                                            }
                                        ]
                                    }, {
                                        xtype: 'panel',
                                        border: false,
                                        layout: 'hbox',
                                        items: [
                                            {
                                                xtype: "textfield",
                                                fieldLabel: "Promo Code",
                                                name: "textvalue"
                                            }, {
                                                xtype: 'button',
                                                text: 'Validate'
                                            }
                                        ]
                                    }, {
                                        xtype: "checkbox",
                                        boxLabel: "Auto-Refill",
                                        name: "checkbox",
                                        inputValue: ""
                                    }]

                                }, {
                                    xtype: 'panel',
                                    title: 'ORDER SUMMARY',
                                    border: false,
                                    bodyStyle: 'padding:5px 5px 5px 5px',
                                    items: [{
                                        xtype: 'displayfield',
                                        value: '<p>Airtime purchase successful.'

                                    }]
                                }]
                        }]
                }
            ]

        })
