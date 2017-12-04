Ext.define('Jacada.user.com.jacada.tracfoneAD.redemption.PurchasePin', {
    extend: 'Jacada.user.com.jacada.tracfoneAD.baseComponents.BaseView',
    xtype: 'purchasePin',
    requires: [
        'Jacada.user.com.jacada.tracfoneAD.redemption.AirtimePlan',
        'Jacada.user.com.jacada.tracfoneAD.redemption.EstimatedCost',
        'Jacada.user.com.jacada.tracfoneAD.redemption.PaymentTransaction'
    ],
    initComponent: function () {
        var me = this;
        Ext.applyIf(me, {
            name: 'purchasePin',
            items: me.createComponent(),
        });
        me.callParent(arguments);
    },
    load: function () {
        var me = this;
        me.down('airtimePlan').load();
        me.down('paymentTransaction').load();

    },
    reset: function () {
        var me = this;
        me.down('airtimePlan').reset();
        me.down('estimatedCost').reset();
        me.down('paymentTransaction').reset();
    },

    createComponent: function () {
        return [
            {
                xtype: 'panel',
                border: false,
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
                                    }
                                ]
                            },
                            {
                                xtype: 'paymentTransaction'
                            }
                        ]
                    }
                ]
            }
        ]
    }
})