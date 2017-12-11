Ext.define('Jacada.user.com.jacada.tracfoneAD.redemption.ReservePin', {
    extend: 'Jacada.user.com.jacada.tracfoneAD.baseComponents.BaseView',
    xtype: 'reservePin',
    listeners: {
        afterrender: function () {
            this.load();
        }
    },
    load: function () {
        var me = this;
        // TODO get the data for drop down
        me.mask('loading...');
        var min = managers['pushData'].deviceProfile.min;
        adam.callService('PINs/Reserved?min=' + min, 'GET', {}).then(function (response) {
            if (response.length > 0)
                me.down('#reservePinGrid').getStore().loadData(response);
            me.unmask();
        }).error(function () {
            Ext.Msg.alert('ERROR', 'Error getting reserve pin data');
            me.unmask();
        });
    },

    reset: function () {
        var me = this;
        me.down('#reservePinGrid').getStore().loadData([], false);
        me.down('#transactionSummaryResponse').setValue('');
    },

    initComponent: function () {
        var me = this;
        Ext.applyIf(me, {
            name: 'reservePin',
            items: [
                {
                    xtype: 'panel',
                    layout: 'column',
                    border: false,
                    items: [

                        {
                            xtype: "panel",
                            title: "REDEEM RESERVE PIN",
                            columnWidth: 0.55,
                            border: false,
                            layout: 'fit',
                            autoScroll: true,
                            height: 250,
                            items: me.createRedeemReservePinGrid()
                        },
                        {
                            xtype: "panel",
                            title: "TRANSCATION SUMMARY",
                            columnWidth: 0.45,
                            itemId: 'transactionSummaryContainer',
                            border: false,
                            bodyStyle: 'padding:5px 5px 5px 5px',
                            items: [{
                                xtype: 'displayfield',
                                itemId: 'transactionSummaryResponse'

                            }]
                        }]
                }],
        });
        me.callParent(arguments);
    },

    sendToJia: function (grid, record, item, index, event, eOpts) {
        var me = this;
        me.down('#transactionSummaryContainer').mask('Please wait..');
        adam.callService('PINs/' + record.partNumber, 'DELETE').then(function (response) {
            me.down('#transactionSummaryResponse').setValue(response);
            me.down('#transactionSummaryContainer').unmask();
        }).error(function () {
            Ext.Msg.alert('ERROR', 'Error getting transaction');
            me.down('#transactionSummaryContainer').unmask();
        })
    },

    createRedeemReservePinGrid: function () {
        var me = this;
        Ext.define('reservePinModel', {
            extend: 'Ext.data.Model',
            fields: [{
                name: 'partNumber',
                type: 'string'
            }, {
                name: 'description',
                type: 'string'
            }, {
                name: 'accessDays',
                type: 'string'
            }, {
                name: 'statusDescription',
                type: 'string'
            }
            ]
        });

        var myStore = Ext.create('Ext.data.Store', {
            model: 'reservePinModel',
            data: []
        });

        // create the grid
        var grid = Ext.create('Ext.grid.Panel', {
            xtype: 'reservePinGrid',
            itemId: 'reservePinGrid',
            store: myStore,
            columns: [
                {
                    text: "Part Number",
                    flex: 1,
                    dataIndex: 'partNumber'
                }, {
                    text: "Description",
                    flex: 2,
                    dataIndex: 'description'
                }, {
                    text: "Access Days",
                    flex: 1,
                    dataIndex: 'accessDays'
                },
                {
                    text: "Status Description",
                    flex: 1,
                    dataIndex: 'statusDescription'
                }
            ],
            forceFit: true,
            listeners: {
                itemdblclick: {
                    fn: me.sendToJia,
                    scope: me
                }
            }
        });
        return grid;
    }
})