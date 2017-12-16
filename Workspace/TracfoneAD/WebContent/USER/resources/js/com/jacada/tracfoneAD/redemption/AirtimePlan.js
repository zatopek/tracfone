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
        var estimatedCostComponent = me.up().up().down('estimatedCost');
        estimatedCostComponent.mask('Please wait...');
        var partNumber = selections[0].getData().partNumber;
        adam.callService('Tas/Cards/' + partNumber + '/Cost/Estimated').then(function (response) {
            estimatedCostComponent.load(response);
            me.up().up().up().down('paymentTransaction').changePurchaseButton();
            me.up().up().up().down('paymentTransaction').changePromoCodeButton();
            estimatedCostComponent.unmask();
        }).catch(function () {
            Ext.Msg.alert('ERROR', 'Sorry, estimated cost could not be calculated. Please try again.');
            estimatedCostComponent.unmask();
        })

    },

    load: function () {
        var me = this;
        me.mask('loading...');
        var min = managers['pushData'].deviceProfile.min;
        adam.callService('Tas/PINs/Available?min=' + min, 'GET', {}).then(function (response) {
            if (response.length > 0)
                me.items.items[0].getStore().loadData(response);
            me.unmask();
        }).catch(function () {
            Ext.Msg.alert('ERROR', 'Sorry, available pins could not be found. Please try again.');
            me.unmask();
        });
    },

    createContentPanel: function () {
        var me = this;
        Ext.define('airtimePlanModel', {
            extend: 'Ext.data.Model',
            fields: [
                {
                    name: 'description',
                    type: 'string'
                }, {
                    name: 'units',
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
                text: "Units",
                flex: 1,
                dataIndex: 'units'
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