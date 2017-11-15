$W().setTabTitle("RedemptionTab", "");
Ext
    .define(
        'Jacada.user.com.jacada.tracfoneAD.redemption.Redemption',
        {
            extend: 'Ext.panel.Panel',
            //title: 'Customer Service Profile',
            items: [

                {
                    xtype: 'panel',
                    layout: 'column',
                    items: [
                        {
                            xtype: 'panel',
                            columnWidth: 0.3,
                            border: true,
                            title: 'ADD SERVICE PROCESS FLOW',

                            html: '<iframe style="height: 520px; width: 100%; border:0";" src="http://vivr.io/BCb9LbN"></iframe>'
                        },
                        {
                            xtype: 'panel',
                            columnWidth: 0.7,
                            border: true,
                            title: 'PURCHASE PIN',
                            items: [
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
                                }
                            ]
                        }]
                }]
        })
