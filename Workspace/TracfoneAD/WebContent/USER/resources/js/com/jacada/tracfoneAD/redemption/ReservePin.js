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
        me.mask('loading...');
        var min = managers['pushData'].deviceProfile.min;
        adam.callService('Tas/PINs/Reserved?min=' + min, 'GET', {}).then(function (response) {
            if (response.length > 0)
                me.down('#reservePinGrid').getStore().loadData(response);
            me.unmask();
        }).catch(function () {
            Ext.Msg.alert('ERROR', 'Sorry, reserved pins could not be found. Pelase try again.');
            me.unmask();
        });
    },

    reset: function () {
        var me = this;
        me.down('#reservePinGrid').getStore().loadData([], false);
        me.down('#transactionSummaryResponse').update('');
        me.down('#transactionSummaryContainer').setTitle('');
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
                            title: "",
                            columnWidth: 0.45,
                            itemId: 'transactionSummaryContainer',
                            border: false,
                            bodyStyle: 'padding:5px 5px 5px 5px',
                            items: [{
                                xtype: 'component',
                                cls: 'airtimePurchaseResponseCls',
                                name: 'airtimePurchaseResponse',
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
        adam.callService('Tas/PINs/' + record.partNumber, 'DELETE').then(function (response) {
            me.down('#transactionSummaryContainer').setTitle('TRANSACTION SUMMARY');
            var i = response.indexOf('<div class=\"x1a\"');
            if (i >= 0) {
                response = response.substring(i);
            }
            var el = document.createElement('html');
            el.innerHTML = response;
            var labels = el.getElementsByTagName('label')
            for (i = 0; i < labels.length; i++) {
                if (labels[i].innerHTML.toLowerCase().indexOf('service end date') >= 0) {
                    if (Ext.getCmp('serviceEndDate')) {
                        Ext.getCmp('serviceEndDate').setValue(labels[i].parentNode.parentNode.children[1].innerHTML);
                    }
                }
            }
            me.down('#transactionSummaryResponse').update(response);
            var selectedPin = me.down('#reservePinGrid').getSelectionModel().getSelection()[0];
            adam.addAutoNotes(selectedPin.get('snp') + ' - ' + selectedPin('partNumber') + " "  + RESERVED_AIRTIME_TAG);
            me.down('#transactionSummaryContainer').unmask();
        }).catch(function () {
            Ext.Msg.alert('ERROR', REQ_ERROR_MSG);
            me.down('#transactionSummaryContainer').unmask();
        })
    },

    createRedeemReservePinGrid: function () {
        var me = this;
        Ext.define('reservePinModel', {
            extend: 'Ext.data.Model',
            fields: [{
                name: 'redCode',
                type: 'string'
            }, {
                name: 'snp',
                type: 'string'
            }, {
                name: 'partNumber',
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
                    text: "Red Code",
                    flex: 2,
                    dataIndex: 'redCode'
                }, {
                    text: "SNP",
                    flex: 1,
                    dataIndex: 'snp'
                },
                {
                    text: "Part Number",
                    flex: 1,
                    dataIndex: 'partNumber'
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