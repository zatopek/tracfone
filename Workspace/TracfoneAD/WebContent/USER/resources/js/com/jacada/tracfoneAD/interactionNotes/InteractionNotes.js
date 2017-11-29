Ext.define('Jacada.user.com.jacada.tracfoneAD.interactionNotes.InteractionNotes', {
    extend: 'Ext.panel.Panel',
    title: 'CREATE INTERACTION',
    border: false,
    initComponent: function () {
        var me = this;
        Ext.applyIf(me, {
            items: me.createComponent()
        });
        me.callParent(arguments);
    },
    listeners: {
        afterrender: function () {
            var me = this;
            me.load();
        }
    },

    load: function () {
        var me = this;
        //TODO get the data from the service
        var data = {
            brand: 'TracFone1',
            deviceType: 'Smartphone1',
            reason: 'Redemption1',
            result: 'Redemption Successfull1'
        }
        var fields = me.items.items[0].items.items[0].items.items;
        Ext.each(fields, function (item) {
            item.setValue(data[item.name]);
        })
    },

    createInteraction: function () {
        var me = this;
        me.mask('Please wait...');
        var autoNotes = Ext.getCmp('autoNotes').getValue();
        var agentNotes = Ext.getCmp('agentNotes').getValue();

        // TODO send the values to server and display message from response
        var response = 'Interaction created.'
        Ext.getCmp('createInteractioResponse').setValue(response);
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
                    fieldLabel: 'Reason',
                    name: 'reason'
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
                id: 'autoNotes',
                margin: "10 50 10 0",
                disabled: true,
                value: "Airtime Pin added - $45 30-Dday UNL TALK/DATA, first 10 GB at High Speeds then at 2G"
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
                id: 'agentNotes',
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
            id: 'createInteractioResponse'
        }]
    }
});
