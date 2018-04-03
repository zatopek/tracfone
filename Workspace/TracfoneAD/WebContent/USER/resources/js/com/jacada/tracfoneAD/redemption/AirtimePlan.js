Ext.define('Jacada.user.com.jacada.tracfoneAD.redemption.AirtimePlan', {
    extend: 'Jacada.user.com.jacada.tracfoneAD.baseComponents.BaseView',
    xtype: 'airtimePlan',
    layout: 'fit',
    autoScroll: true,
    listeners: {
        afterrender: function () {
            //this.load();
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
        debugger;
        var me = this;
        var estimatedCostComponent = me.up().up().down('estimatedCost');
        estimatedCostComponent.mask('Please wait...');
        me.mask('Please wait...');
        var partNumber = selections[0].getData().partNumber;
        adam.callService('Tas/Cards/' + partNumber + '/Cost/Estimated').then(function (response) {
            estimatedCostComponent.load(response);
            me.up().up().up().down('paymentTransaction').changePurchaseButton();
            Ext.getCmp('move-next').setDisabled(false);
            //me.up().up().up().down('paymentTransaction').changePromoCodeButton();
            estimatedCostComponent.unmask();
            me.unmask();
        }).catch(function (response) {
            try{
                var jsonResponse = JSON.parse(response.response.responseText);
                if(jsonResponse && jsonResponse.message) {
                    if(jsonResponse.message.toLowerCase().indexOf('object') >= 0) {
                        Ext.Msg.alert('ERROR', 'Sorry, something went wrong. Please try again.');
                    } else {
                        Ext.Msg.alert('ERROR', 'Sorry, estimated cost could not be calculated. ' + jsonResponse.message + ' Please try again.');
                    }
                }
                else {
                    Ext.Msg.alert('ERROR', 'Sorry, estimated cost could not be calculated. Please try again.');
                }
            }
            catch(e){
                Ext.Msg.alert('ERROR', 'Sorry, estimated cost could not be calculated. Please try again.');
            }
            estimatedCostComponent.unmask();
            me.unmask();
        })

    },

    load: function () {
        var me = this;
        me.mask('loading...');
        var esn = managers['pushData'].deviceProfile.esn;
        var brand = managers['pushData'].serviceProfile.brand;
        /*
        adam.callService('Tas/PINs/Available?min=' + min, 'GET', {}).then(function (response) {
            if (response.length > 0)
                me.items.items[0].getStore().loadData(response);
            me.unmask();
        }).catch(function () {
            Ext.Msg.alert('ERROR', 'Sorry, available pins could not be found. Please try again.');
            me.unmask();
        });
        */
        adam.callWsService('call/getProductOfferings/' + esn +'/' + brand, 'GET', {}).then(function (response) {
            if (response.length > 0)
            {
                me.items.items[0].getStore().loadData(response);
            }
            me.unmask();
        }).catch(function (response) {
            try{
                var jsonResponse = JSON.parse(response.response.responseText);
                if(jsonResponse && jsonResponse.message && jsonResponse.message!=''){
                    Ext.Msg.alert('ERROR', 'Sorry, ' + jsonResponse.message);
                }
                else{
                    Ext.Msg.alert('ERROR', 'Sorry, available pins could not be found. Please try again.');
                }
            }
            catch(e){
                Ext.Msg.alert('ERROR', 'Sorry, available pins could not be found. Please try again.');
            }
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
                }, {
                    name: 'recentPurchase',
                    type: 'boolean'
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
            cls: 'airtimePlanCls',
            columns: [{
                text: "Description",
                flex: 4,
                dataIndex: 'description'
            }, {
                text: "Units",
                flex: .5,
                dataIndex: 'units'
            }, {
                text: "Price",
                flex: .65,
                dataIndex: 'price'
            }, {
                text: "Part Number",
                flex: 1.2,
                dataIndex: 'partNumber'
            }, {
                text: "Recent Purchase",
                flex: 0,
                dataIndex: 'recentPurchase',
                hidden: true
            }
            ],
            listeners: {
                selectionchange: me.sendToJia,
                render : function(grid){
                    grid.store.on('load', function(store, records, options){
                        grid.getSelectionModel().selectFirstRow();
                    });
                }
            },
            viewConfig: {
                getRowClass: function(record) {
                    if(record && record.get('recentPurchase')) return 'highlightRowCls';
                }
            }
        });
        return grid;
    }
});