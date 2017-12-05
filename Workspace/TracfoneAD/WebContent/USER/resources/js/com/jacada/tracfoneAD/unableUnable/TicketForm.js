Ext.define('Jacada.user.com.jacada.tracfoneAD.unableUnable.TicketForm', {
    extend: 'Jacada.user.com.jacada.tracfoneAD.baseComponents.BaseView',
    title: 'CREATE TICKET',
    xtype: 'ticketForm',
    border: false,
    initComponent: function () {
        var me = this;
        Ext.applyIf(me, {
            name: 'ticketForm',
            items: [
                {
                    xtype: 'form',
                    border: false,
                    width: 600,
                    layout: {
                        type: 'vbox',
                        margin: '5'
                    },
                    bodyStyle: 'padding:5px 5px 5px 5px',
                    items: [
                        {
                            xtype: 'displayfield',
                            fieldLabel: 'Ticket Type',
                            name: 'ticketType',
                            value: 'Coverage'
                        },
                        {
                            xtype: 'displayfield',
                            fieldLabel: 'Ticket Title',
                            name: 'ticketTitle',
                            value: 'Customer needs SIM4'
                        },
                        {
                            xtype: 'displayfield',
                            fieldLabel: 'Priority',
                            name: 'priority',
                            value: 'High'
                        },
                        /*
                        new Ext.form.ComboBox({
                            store: Ext.data.Priority,
                            typeAhead: true,
                            forceSelection: true,
                            triggerAction: 'all',
                            emptyText: 'Select a priority...',
                            selectOnFocus: true
                        }),
                
                            new Ext.form.ComboBox({
                                store: Ext.data.TicketTitles,
                                typeAhead: true,
                                forceSelection: true,
                                triggerAction: 'all',
                                emptyText: 'Select a ticket title...',
                                selectOnFocus: true
                            }),
                            */
                        {
                            xtype: 'displayfield',
                            fieldLabel: 'Status',
                            name: 'status',
                            value: 'Pending'
                        }, {
                            xtype: 'textfield',
                            fieldLabel: 'Issue',
                            name: 'issue',
                            width: 500,
                            value: '',
                            validator: function (val) {
                                return (val.trim().length > 0) ? true : "Required Field";
                            }
                        },
                        {
                            xtype: 'textarea',
                            fieldLabel: 'Notes',
                            name: 'notes',
                            width: 500,
                            value: '',
                            validator: function (val) {
                                return (val.trim().length > 0) ? true : "Required Field";
                            }
                        },
                        {
                            xtype: 'button',
                            margin: "0 0 0 10",
                            text: 'Create Ticket',
                            handler: function () {
                                if (me.down('form').getForm().isValid())
                                    me.createTicket();
                            },
                            scope: me
                        }
                    ]
                }
            ]
        });
        me.callParent(arguments);
    },

    createTicket: function () {
        var me = this;
        var data = me.down('form').getForm().getValues();
        // TODO send this data to server
    },
    load: function () {
        // TODO get data from server and load
    },

    reset: function () {

    }
});
