Ext
    .define(
        'Jacada.user.com.jacada.tracfoneAD.redemption.AddPin',
        {
            extend: 'Ext.panel.Panel',
            items: [
                {
                    xtype: 'panel',
                    layout: 'column',
                    border: false,
                    items: [
                        {
                            xtype: 'panel',
                            columnWidth: 0.55,
                            border: false,
                            bodyStyle: 'padding:5px 5px 5px 5px',
                            title: "ADD AIRTIME PIN",
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
                                        xtype: "textfield",
                                        fieldLabel: "Airtime Pin",
                                        name: "airtimePin"
                                    },
                                    {
                                        xtype: 'button',
                                        margin: "0 0 0 10",
                                        text: 'Add Now'
                                    },
                                    {
                                        xtype: 'button',
                                        margin: "0 0 0 10",
                                        text: 'Add to Reserve'
                                    }
                                ]
                            },
                                {
                                    xtype: 'panel',
                                    border: false,
                                    bodyStyle: 'padding:5px 5px 5px 5px',
                                    items: [{
                                        xtype: "displayfield",
                                        value: "<p><b>$45 30-Dday UNL TALK/DATA, first 10 GB at High Speeds then at 2G</b></p>",
                                        name: "pinDescription"
                                    }]
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
                                            name: "promoCode"
                                        }
                                        , {
                                            xtype: 'button',
                                            margin: "0 0 0 10",
                                            text: 'Validate'
                                        }
                                    ]
                                }]
                        },
                        {
                            xtype: 'panel',
                            columnWidth: 0.45,
                            height: 450,
                            title: 'TRANSACTION SUMMARY',
                            border: false,
                            bodyStyle: 'padding:5px 5px 5px 5px',
                            items: [{
                                xtype: 'displayfield',
                                name: "transactionSummary",
                                value: '<p>Thank you for adding benefits to your phone! '
                                + '<p>You will need to turn your phone OFF and back on to reset and restore your benefits.'
                                + '<p>Please remember to add benefits to your phone before <Service End Date>. As a reminder, we will send you a text message or email before this date.'
                                + '<p>Service plan added: <b>$45 Unlimited Talk, Text & Data Plan</b>',

                            }]
                        }
                    ]
                }]
        })
