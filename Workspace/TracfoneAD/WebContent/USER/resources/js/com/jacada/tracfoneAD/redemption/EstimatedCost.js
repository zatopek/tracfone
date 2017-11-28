Ext.define('Jacada.user.com.jacada.tracfoneAD.redemption.EstimatedCost', {
    extend: 'Ext.panel.Panel',
    xtype: 'estimatedCost',
    defaults: {
        xtype: 'displayfield',
        labelStyle: 'white-space: nowrap;',
        renderer: Ext.util.Format.usMoney
    },
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
    }],

    load: function (data) {
        var me = this;
        me.mask();
        Ext.each(this.items.items, function (item) {
            item.setValue(data[item.name]);
        })
        me.unmask();
    }
})
