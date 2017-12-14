Ext.define('Jacada.user.com.jacada.tracfoneAD.redemption.EstimatedCost', {
    extend: 'Jacada.user.com.jacada.tracfoneAD.baseComponents.BaseView',
    xtype: 'estimatedCost',
    defaults: {
        xtype: 'displayfield',
        labelStyle: 'white-space: nowrap;',
        // uncomment line below when we get numbers from the service
        // renderer: Ext.util.Format.usMoney 
    },
    initComponent: function () {
        $W().setTabTitle("RedemptionTab", "");
        var me = this;
        Ext.applyIf(me, {
            name: 'estimatedCost',
            cls: 'estimatedCostCls',
            items: [{

                fieldLabel: 'Subtotal',
                name: 'totalChargeToday',
            }, {

                fieldLabel: 'Tax',
                name: 'totalAllTax',
            }, {

                fieldLabel: 'E911',
                name: 'e911Tax',
            }, {

                fieldLabel: 'Total',
                name: 'totalAmount',
            }]
        });
        me.callParent(me);
    },

    load: function (data) {
        var me = this;
        me.mask();
        Ext.each(this.items.items, function (item) {
            item.setValue(data[item.name]);
        })
        me.unmask();
    },
    reset: function () {
        Ext.each(this.items.items, function (item) {
            item.setValue('');
        })
    }
})
