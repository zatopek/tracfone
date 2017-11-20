Ext
    .define(
        'Jacada.user.com.jacada.tracfoneAD.redemption.PurchasePin',
        {
            extend: 'Ext.panel.Panel',
            items: [
                {
                    xtype: 'panel',
                    border: false,
                    //title: 'PURCHASE PIN',
                    items: [
                        {
                            xtype: 'panel',
                            columnWidth: 0.6,
                            border: false,
                            items: [
                                {
                                    xtype: "panel",
                                    layout: "column",
                                    border: false,
                                    items: [
                                        {
                                            xtype: "panel",
                                            title: "SELECT AIRTIME PLAN",
                                            columnWidth: 0.55,
                                            border: false,
                                            height: 250,
                                            items:{}
                                        },
                                        {
                                            xtype: "panel",
                                            title: "BILLING SUMMARY",
                                            columnWidth: 0.45,
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
                                 },
                                {
                                    xtype: "panel",
                                    layout: "column",
                                    border: false,
                                    items: [
                                        {
                                            xtype: "panel",
                                            title: 'PAYMENT SELECTION',
                                            columnWidth: 0.55,
                                            border: false,
                                            items: [{
                                                xtype: 'panel',
                                                border: false,
                                                layout: {
                                                    type: 'hbox',
                                                    padding: '5',
                                                    align: 'stretchmax'
                                                },
                                                items: [
                                                    {
                                                        xtype: "combo",
                                                        fieldLabel: "Select Payment",
                                                        name: "combovalue",
                                                        hiddenName: "combovalue",
                                                        value: "xxxx-xxxx-xxxx-1234"
                                                    }, {
                                                        xtype: "textfield",
                                                        fieldLabel: "CVV",
                                                        labelAlign: 'right',
                                                        name: ""
                                                    }, {
                                                        xtype: 'button',
                                                        margin: "0 0 0 10",
                                                        text: 'Purchase'
                                                    }
                                                ]
                                            },

                                                {
                                                    xtype: 'panel',
                                                    border: false,
                                                    layout: {
                                                        type: 'hbox',
                                                        padding: '5',
                                                        align: 'stretchmax'
                                                    },
                                                    items: [
                                                        {
                                                            xtype: "textfield",
                                                            fieldLabel: "Promo Code",
                                                            name: "textvalue"
                                                        }
                                                        , {
                                                            xtype: 'button',
                                                            margin: "0 0 0 10",
                                                            text: 'Validate'
                                                        }
                                                        , {
                                                            xtype: "checkbox",
                                                            boxLabel: "Auto-Refill",
                                                            name: "checkbox",
                                                            inputValue: ""
                                                        }]
                                                }]
                                        },
                                        {
                                            xtype: "panel",
                                            title: "TRANSCATION SUMMARY",
                                            columnWidth: 0.45,
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