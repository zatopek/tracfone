Ext.define('Jacada.user.com.jacada.tracfoneAD.interactionNotes.InteractionNotes', {
    extend: 'Jacada.user.com.jacada.tracfoneAD.baseComponents.BaseView',
    xtype: 'interactionNotes',
    title: 'CREATE INTERACTION',
    border: false,
    initComponent: function () {
        var me = this;
        Ext.applyIf(me, {
            name: 'interactionNotes',
            items: me.createComponent()
        });
        me.callParent(arguments);
    },

    load: function () {
        var me = this;
        var data = {
            brand: managers['pushData'].serviceProfile.brand,
            deviceType: managers['pushData'].deviceProfile.deviceType,
            reason: Object.keys(REASON)[0], // select the first element. we might not need this
            result: 'Redemption Successfull1'  // TBD
        }
        var fields = me.items.items[0].items.items[0].items.items;
        Ext.each(fields, function (item) {
            if (data[item.name])
                item.setValue(data[item.name]);
        })

        // TODO from where we get this? 
        var autoNotes = 'Airtime Pin added - $45 30-Dday UNL TALK/DATA, first 10 GB at High Speeds then at 2G'
        me.down('#autoNotes').setValue(autoNotes);
    },

    reset: function () {
        var me = this;
        var fields = me.items.items[0].items.items[0].items.items;
        Ext.each(fields, function (item) {
            item.setValue('');
        });
        me.down('#createInteractioResponse').setValue('');
        me.down('#agentNotes').setValue('');
    },

    createInteraction: function () {
        var me = this;
        me.mask('Please wait...');
        var autoNotes = me.down('#autoNotes').getValue()
        var agentNotes = me.down('#agentNotes').getValue();

        // TODO send the values to server and display message from response
        var response = 'Interaction created.'
        me.down('#createInteractioResponse').setValue(response);
        me.unmask();
    },
    createComponent: function () {
        var me = this;
        return [{
            xtype: 'panel',
            border: false,
            layout: {
                type: 'vbox',
                padding: '5'
            },
            items: [{
                xtype: 'panel',
                border: false,
                defaults: {
                    xtype: 'displayfield',
                    labelStyle: 'white-space: nowrap;'
                },
                items: [{
                    fieldLabel: 'Brand',
                    name: 'brand'
                }, {
                    fieldLabel: 'Device Type',
                    name: 'deviceType'
                }, {
                    xtype: 'combo',
                    fieldLabel: "Reason",
                    name: "reason",
                    itemId: 'reason',
                    valueField: 'val',
                    displayField: 'name',
                    editable: false,
                    forceSelection: true,
                    store: Ext.create('Ext.data.Store', {
                        fields: ['val', 'name'],
                        data: Object.keys(REASON).map(function (item, index) { return { "val": item, "name": item } })
                    }),
                    listeners: {
                        change: function (combo, newValue, oldValue) {
                            if (newValue) {
                                var detailStore = Ext.create('Ext.data.Store', {
                                    fields: ['val', 'name'],
                                    data: REASON[newValue].map(function (item, index) { return { "val": item, "name": item } })
                                });
                                var detailCombo = me.down('#detail');
                                detailCombo.bindStore(detailStore);
                                detailCombo.select(detailCombo.getStore().getAt(0));
                            }
                        }
                    }
                }, {
                    xtype: 'combo',
                    name: 'detail',
                    itemId: 'detail',
                    fieldLabel: 'Detail',
                    editable: false,
                    valueField: 'val',
                    displayField: 'name',
                }, {
                    fieldLabel: 'Result',
                    name: 'result'
                }]
            }]
        }, {
            xtype: 'panel',
            border: false,
            layout: 'fit',
            items: [{
                xtype: 'textarea',
                name: 'autoNotes',
                fieldLabel: 'Auto Notes',
                itemId: 'autoNotes',
                margin: '10 50 10 0',
                disabled: true,
            }]
        }
            , {
            xtype: 'panel',
            border: false,
            layout: 'fit',
            items: [{
                xtype: 'textarea',
                name: 'agentNotes',
                fieldLabel: 'Agent Notes',
                itemId: 'agentNotes',
                margin: "10 50 10 0",
                value: ''
            }]
        },
        {
            xtype: 'button',
            margin: "0 0 0 10",
            text: 'Create Interaction',
            handler: function () {
                me.createInteraction()
            },
            scope: me
        }, {
            xtype: 'displayfield',
            name: 'response',
            itemId: 'createInteractioResponse'
        }]
    }
});