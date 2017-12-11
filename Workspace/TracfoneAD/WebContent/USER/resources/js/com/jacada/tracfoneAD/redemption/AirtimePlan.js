Ext.define('Jacada.user.com.jacada.tracfoneAD.redemption.AirtimePlan', {
    extend: 'Jacada.user.com.jacada.tracfoneAD.baseComponents.BaseView',
    xtype: 'airtimePlan',
    lyout: 'fit',
    autoScroll: true,
    listeners: {
        afterrender: function () {
            this.load();
        }
    },
    initComponent: function () {
        var me = this;
        Ext.applyIf(me, {
            name: 'airtimePlan',
            items: [me.createContentPanel()],
        });
        me.callParent(arguments);
    },

    reset: function () {
        var me = this;
        me.down('#airtimePlanGrid').getStore().loadData([], false);
    },

    sendToJia: function (view, selections, options) {
        var me = this;
        // TODO, send the information to JIA  - selections[0].getData()
        // ON CallBack, get information from JIA to display in Estimated Cost
        // assuming we get the data as estimatedCostData 
        // Note: the fields names (subTotal, tax etc..) should be matched to populate
        var estimatedCostData = { subTotal: '12.00', tax: '30.00', e911: '20.00', total: '45.00' }
        me.up().up().down('estimatedCost').load(estimatedCostData);
        me.up().up().up().down('paymentTransaction').changePurchaseButton();
        me.up().up().up().down('paymentTransaction').changePromoCodeButton();
    },

    load: function () {
        var me = this;
        // TODO get the data for drop down
        //  using sampel data for now
        me.mask('loading...');
        var data = [
            { description: '$45 40 Day UML lorem ipsum', price: '$45', partNumber: 'STA464' },
            { description: '$45 40 Day UML lorem ipsum', price: '$45', partNumber: 'STA464' },
            { description: '$45 40 Day UML lorem ipsum', price: '$45', partNumber: 'STA464' },
            { description: '$45 40 Day UML lorem ipsum', price: '$45', partNumber: 'STA464' },
            { description: '$45 40 Day UML lorem ipsum', price: '$45', partNumber: 'STA464' },
            { description: '$45 40 Day UML lorem ipsum', price: '$45', partNumber: 'STA464' },
            { description: '$45 40 Day UML lorem ipsum', price: '$45', partNumber: 'STA464' },
            { description: '$45 40 Day UML lorem ipsum', price: '$45', partNumber: 'STA464' },
            { description: '$45 40 Day UML lorem ipsum', price: '$45', partNumber: 'STA464' },
            { description: '$45 40 Day UML lorem ipsum', price: '$45', partNumber: 'STA464' },
            { description: '$45 40 Day UML lorem ipsum', price: '$45', partNumber: 'STA464' },
            { description: '$45 40 Day UML lorem ipsum', price: '$45', partNumber: 'STA464' },
            { description: '$45 40 Day UML lorem ipsum', price: '$45', partNumber: 'STA464' },
            { description: '$45 40 Day UML lorem ipsum', price: '$45', partNumber: 'STA464' },
            { description: '$45 40 Day UML lorem ipsum', price: '$45', partNumber: 'STA464' }
        ];
        me.items.items[0].getStore().loadData(data);
        me.unmask();
    },

    createContentPanel: function () {
        var me = this;
        Ext.define('airtimePlanModel', {
            extend: 'Ext.data.Model',
            fields: [{
                name: 'description',
                type: 'string'
            }, {
                name: 'price',
                type: 'string'
            }, {
                name: 'partNumber',
                type: 'string'
            }
            ]
        });

        var myStore = Ext.create('Ext.data.Store', {
            model: 'airtimePlanModel',
            data: []
        });

        // create the grid
        var grid = Ext.create('Ext.grid.Panel', {
            xtype: 'airtimePlanGrid',
            itemId: 'airtimePlanGrid',
            store: myStore,
            columns: [{
                text: "Description",
                flex: 3,
                dataIndex: 'description'
            }, {
                text: "Price",
                flex: 1,
                dataIndex: 'price'
            }, {
                text: "Part Number",
                flex: 2,
                dataIndex: 'partNumber'
            }
            ],
            forceFit: true,
            listeners: {
                selectionchange: me.sendToJia
            }
        });
        return grid;
    }
});