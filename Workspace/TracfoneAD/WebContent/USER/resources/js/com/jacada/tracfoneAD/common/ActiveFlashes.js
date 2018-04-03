Ext.define('Jacada.user.com.jacada.tracfoneAD.common.ActiveFlashes', {
    extend: 'Ext.window.Window',
    id: 'activeFlashestWindow',
    height: 285,
    width: 850,
    resizable: false,
    header: true,
    border: true,
    shadow: false,
    modal: true,
    title: 'ACTIVE FLASHES',
    closeAction: 'hide',
    layout: 'fit',
    autoScroll: true,
    listeners: {
        afterrender: function () {
            this.load();
        }
    },
    initComponent: function () {
        var me = this;
        Ext.applyIf(me, {
            name: 'recentTickets',
            cls: 'recentTicketsCls',
            items: [me.createContentPanel()],
            buttons: [{
                text: 'Close',
                tabIndex: 13,
                handler: function () {
                   // me.close();
                    managers['windowsManager'].hide('activeFlashesWindow');
                }
            }]
        });
        me.callParent(arguments);
    },

    reset: function () {
        var me = this;
        me.down('#activeFlashesGrid').getStore().loadData([], false);
    },

    load: function () {
        var me = this;
        me.items.items[0].getStore().loadData(managers['activeFlashes']);
    },

    createContentPanel: function () {
        var me = this;
        Ext.define('activeFlashesModel', {
            extend: 'Ext.data.Model',
            fields: [
                {
                    name: 'id',
                    type: 'string'
                }, {
                    name: 'type',
                    type: 'string'
                }, {
                    name: 'startDate',
                    type: 'string'
                }, {
                    name: 'endDate',
                    type: 'string'
                }, {
                    name: 'title',
                    type: 'string'
                }, {
                    name: 'alertText',
                    type: 'string'
                }
            ]
        });

        var myStore = Ext.create('Ext.data.Store', {
            model: 'activeFlashesModel',
            data: []
        });

        // create the grid
        var grid = Ext.create('Ext.grid.Panel', {
            xtype: 'activeFlashesGrid',
            itemId: 'activeFlashesGrid',
            store: myStore,
            columns: [{
                text: "ID",
                flex: 2.0,
                dataIndex: 'id'
            }, {
                text: "Type",
                flex: 1.5,
                dataIndex: 'type'
            }, {
                text: "Start Date",
                flex: 2.0,
                dataIndex: 'startDate'
            }, {
                text: "End Date",
                flex: 2.0,
                dataIndex: 'endDate'
            }, {
                text: "Title",
                flex: 3.5,
                dataIndex: 'title'
            }, {
                text: "Alert Text",
                flex: 7.5,
                dataIndex: 'alertText'
            }
            ],
            listeners: {
                //selectionchange: me.sendToJia
            }
        });
        return grid;
    }
});