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
        //  using sampel data for now
        me.mask('loading...');
        var data = [
            { description: '45 40 Day UML lorem ipsum', accessDays: '45', portNumber: 'STA464', statusDescription: 'Active' },
            { description: '45 40 Day UML lorem ipsum', accessDays: '45', portNumber: 'STA464', statusDescription: 'Active' },
            { description: '45 40 Day UML lorem ipsum', accessDays: '45', portNumber: 'STA464', statusDescription: 'Active' },
            { description: '45 40 Day UML lorem ipsum', accessDays: '45', portNumber: 'STA464', statusDescription: 'Active' },
            { description: '45 40 Day UML lorem ipsum', accessDays: '45', portNumber: 'STA464', statusDescription: 'Active' },
            { description: '45 40 Day UML lorem ipsum', accessDays: '45', portNumber: 'STA464', statusDescription: 'Active' },
            { description: '45 40 Day UML lorem ipsum', accessDays: '45', portNumber: 'STA464', statusDescription: 'Active' },
            { description: '45 40 Day UML lorem ipsum', accessDays: '45', portNumber: 'STA464', statusDescription: 'Active' },
            { description: '45 40 Day UML lorem ipsum', accessDays: '45', portNumber: 'STA464', statusDescription: 'Active' },
            { description: '45 40 Day UML lorem ipsum', accessDays: '45', portNumber: 'STA464', statusDescription: 'Active' },
            { description: '45 40 Day UML lorem ipsum', accessDays: '45', portNumber: 'STA464', statusDescription: 'Active' },
            { description: '45 40 Day UML lorem ipsum', accessDays: '45', portNumber: 'STA464', statusDescription: 'Active' },
            { description: '45 40 Day UML lorem ipsum', accessDays: '45', portNumber: 'STA464', statusDescription: 'Active' },
            { description: '45 40 Day UML lorem ipsum', accessDays: '45', portNumber: 'STA464', statusDescription: 'Active' },
            { description: '45 40 Day UML lorem ipsum', accessDays: '45', portNumber: 'STA464', statusDescription: 'Active' }
        ];
        me.down('#reservePinGrid').getStore().loadData(data);
        me.unmask();
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
        //TODO send record to sever and get the response
        var response = 'Redeem reserve pin successfull';
        me.down('#transactionSummaryResponse').setValue(response);
    },

    createRedeemReservePinGrid: function () {
        var me = this;
        Ext.define('reservePinModel', {
            extend: 'Ext.data.Model',
            fields: [{
                name: 'portNumber',
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
                    text: "Port Number",
                    flex: 1,
                    dataIndex: 'portNumber'
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