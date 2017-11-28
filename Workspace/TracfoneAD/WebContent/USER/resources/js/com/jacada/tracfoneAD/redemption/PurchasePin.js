Ext.define('Jacada.user.com.jacada.tracfoneAD.redemption.PurchasePin',
    {
        extend: 'Ext.panel.Panel',
        requires: [
            'Jacada.user.com.jacada.tracfoneAD.redemption.AirtimePlan',
            'Jacada.user.com.jacada.tracfoneAD.redemption.EstimatedCost',
            'Jacada.user.com.jacada.tracfoneAD.redemption.PaymentTransaction'
        ],
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
                                        xtype: "airtimePlan",
                                        title: "SELECT AIRTIME PLAN",
                                        columnWidth: 0.55,
                                        border: false,
                                        height: 250,
                                    },
                                    {
                                        xtype: "estimatedCost",
                                        title: "ESTIMATED COST",
                                        columnWidth: 0.45,
                                        border: false,
                                    }]
                            },
                            {
                                xtype: 'paymentTransaction'
                            }
                        ]
                    }]
            }]

    })