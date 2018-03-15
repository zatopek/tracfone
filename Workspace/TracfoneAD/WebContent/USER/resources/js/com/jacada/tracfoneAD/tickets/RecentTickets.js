Ext.define('Jacada.user.com.jacada.tracfoneAD.tickets.RecentTickets', {
    //extend: 'Jacada.user.com.jacada.tracfoneAD.baseComponents.BaseView',
    //xtype: 'airtimePlan',
    extend: 'Ext.window.Window',
    id: 'recentTicketWindow',
    height: 285,
    width: 850,
    resizable: false,
    header: true,
    border: true,
    shadow: false,
    modal: true,
    title: 'Recent Tickets',
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
                    managers['windowsManager'].hide('recentTicketWindow');
                }
            }]
        });
        me.callParent(arguments);
    },

    reset: function () {
        var me = this;
        me.down('#recentTicketsGrid').getStore().loadData([], false);
    },

    load: function () {
        var me = this;
        me.items.items[0].getStore().loadData(managers['recentTickets']);
    },

    createContentPanel: function () {
        var me = this;
        Ext.define('recentTicketsModel', {
            extend: 'Ext.data.Model',
            fields: [
                {
                    name: 'id',
                    type: 'string'
                }, {
                    name: 'status',
                    type: 'string'
                }, {
                    name: 'title',
                    type: 'string'
                }, {
                    name: 'issue',
                    type: 'string'
                }, {
                    name: 'creationTime',
                    type: 'string'
                }
            ]
        });

        var myStore = Ext.create('Ext.data.Store', {
            model: 'recentTicketsModel',
            data: []
        });

        // create the grid
        var grid = Ext.create('Ext.grid.Panel', {
            xtype: 'recentTicketsGrid',
            itemId: 'recentTicketsGrid',
            store: myStore,
            columns: [{
                text: "ID",
                flex: 1.0,
                dataIndex: 'id'
            }, {
                text: "Status",
                flex: 1.0,
                dataIndex: 'status'
            }, {
                text: "Title",
                flex: 1.5,
                dataIndex: 'title'
            }, {
                text: "Issue",
                flex: 3.0,
                dataIndex: 'issue'
            }, {
                text: "Creation Time",
                flex: 1.5,
                dataIndex: 'creationTime'
            }
            ],
            listeners: {
                //selectionchange: me.sendToJia
            }
        });
        return grid;
    }
});