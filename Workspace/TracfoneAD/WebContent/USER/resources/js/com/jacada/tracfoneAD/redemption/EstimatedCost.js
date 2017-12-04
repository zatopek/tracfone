Ext.define('Jacada.user.com.jacada.tracfoneAD.redemption.EstimatedCost', {
    extend: 'Jacada.user.com.jacada.tracfoneAD.baseComponents.BaseView',
    xtype: 'estimatedCost',
    defaults: {
        xtype: 'displayfield',
        labelStyle: 'white-space: nowrap;',
        renderer: Ext.util.Format.usMoney
    },
    initComponent: function () {
        $W().setTabTitle("RedemptionTab", "");
        var me = this;
        Ext.applyIf(me, {
            name: 'estimatedCost',
            items: [{

                fieldLabel: 'Subtotal',
                name: 'subTotal',
            }, {

                fieldLabel: 'Tax',
                name: 'tax',
            }, {

                fieldLabel: 'E911',
                name: 'e911',
            }, {

                fieldLabel: 'Total',
                name: 'total',
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
