Ext.define('Jacada.user.com.jacada.tracfoneAD.redemption.AirtimePlan', {
    extend: 'Ext.panel.Panel',
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
            items: [me.createContentPanel()],
        });
        me.callParent(arguments);
    },

    sendToJia: function (grid, record, item, index, event, eOpts) {
        var me = this;
        // TODO, send the information to JIA
        // ON CallBack, get information from JIA to display in Estimated Cost
        // assuming we get the data as estimatedCostData 
        // Note: the fields names (subTotal, tax etc..) should be matched to populate
        var estimatedCostData = { subTotal: '12.00', tax: '30.00', e911: '20.00', total: '45.00' }
        me.up().up().down('estimatedCost').load(estimatedCostData);
    },

    load: function () {
        var me = this;
        // TODO get the data for drop down
        //  using sampel data for now
        me.mask('loading...');
        var data = [
            { description: '$45 40 Day UML lorem ipsum', price: '$45', portNumber: 'STA464' },
            { description: '$45 40 Day UML lorem ipsum', price: '$45', portNumber: 'STA464' },
            { description: '$45 40 Day UML lorem ipsum', price: '$45', portNumber: 'STA464' },
            { description: '$45 40 Day UML lorem ipsum', price: '$45', portNumber: 'STA464' },
            { description: '$45 40 Day UML lorem ipsum', price: '$45', portNumber: 'STA464' },
            { description: '$45 40 Day UML lorem ipsum', price: '$45', portNumber: 'STA464' },
            { description: '$45 40 Day UML lorem ipsum', price: '$45', portNumber: 'STA464' },
            { description: '$45 40 Day UML lorem ipsum', price: '$45', portNumber: 'STA464' },
            { description: '$45 40 Day UML lorem ipsum', price: '$45', portNumber: 'STA464' },
            { description: '$45 40 Day UML lorem ipsum', price: '$45', portNumber: 'STA464' },
            { description: '$45 40 Day UML lorem ipsum', price: '$45', portNumber: 'STA464' },
            { description: '$45 40 Day UML lorem ipsum', price: '$45', portNumber: 'STA464' },
            { description: '$45 40 Day UML lorem ipsum', price: '$45', portNumber: 'STA464' },
            { description: '$45 40 Day UML lorem ipsum', price: '$45', portNumber: 'STA464' },
            { description: '$45 40 Day UML lorem ipsum', price: '$45', portNumber: 'STA464' }
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
                name: 'portNumber',
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
            id: 'airtimePlanGrid',
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
                text: "Port Number",
                flex: 2,
                dataIndex: 'portNumber'
            }
            ],
            forceFit: true,
            listeners: {
                itemclick: me.sendToJia
            }
        });
        return grid;
    }
});