Ext.define('Jacada.user.com.jacada.tracfoneAD.unableUnable.TicketForm', {
    extend: 'Jacada.user.com.jacada.tracfoneAD.baseComponents.BaseView',
    title: 'CREATE TICKET',
    xtype: 'ticketForm',
    border: false,

    initComponent: function () {
        var me = this;
        Ext.applyIf(me, {
            name: 'ticketForm',
            cls: 'ticketFormCls',
            items: [
                {
                    xtype: 'form',
                    border: false,
                    width: 800,
                    layout: {
                        type: 'vbox',
                        margin: '5',
						align: 'stretch'
                    },
                    bodyStyle: 'padding:5px 5px 5px 5px',
                    items: [
                        {
                            xtype: 'displayfield',
                            fieldLabel: 'Ticket Type',
                            name: 'ticketType',
                        },
                        {
                            xtype: 'displayfield',
                            fieldLabel: 'Ticket Title',
                            name: 'ticketTitle',
                        },
                        {
                            xtype: 'displayfield',
                            fieldLabel: 'Priority',
                            name: 'priority',
                        },
                        {
                            xtype: 'displayfield',
                            fieldLabel: 'Status',
                            name: 'status',
                            value: 'Pending'
                        }, {
                            xtype: 'textfield',
                            fieldLabel: 'Issue',
                            name: 'ticketIssue',
                            width: 500,
                            value: '',
                            validator: function (val) {
                                return (val.trim().length > 0) ? true : "Required Field";
                            }
                        },
                        {
                            xtype: 'textarea',
                            fieldLabel: 'Notes',
                            name: 'ticketNotes',
                            width: 500,
                            value: '',
                            validator: function (val) {
                                return (val.trim().length > 0) ? true : "Required Field";
                            }
                        },
                        {
                            xtype: 'button',
                            margin: "20 0 0 10",
                            text: 'Create Ticket',
							itemId: 'createTicketBtn',
                            handler: function () {
                                if (me.down('form').getForm().isValid())
                                    me.createTicket();
                            },
                            scope: me
                        }, {
                            xtype: 'displayfield',
                            itemId: 'createTicketResponse',
                            value: '',
                            cls: 'createTicketResponseCls'
                            
                        }
                    ]
                }
            ]
        });
        me.callParent(arguments);
    },

    createTicket: function () {
        var me = this;
        me.mask('Please wait...');
        var data = me.down('form').getForm().getValues();
        Ext.apply(data, {
            type: me.ticketType, // from jas to component param
            title: me.ticketTitle, // from jas to component param
            issue: me.ticketIssue, // from jas to component param
            notes: me.ticketNotes, // from jas to component param
            priority: 'Medium',
            status: 'Pending'
        });
        adam.callService('Tas/Tickets', 'POST', data).then(function (response) {
			me.down('#createTicketBtn').hide();
            me.down('#createTicketResponse').setValue(' Ticket number:' + response);
            adam.addAutoNotes(CREATE_TICKET_TAG + ' Ticket number:' + response); // TODO get exact text
            me.unmask();
        }).catch(function () {
            Ext.Msg.alert('ERROR', 'Sorry, ticket could not be created. Please try again.');
            me.unmask();
        });
    },

    load: function () {
        var me = this;
        me.mask('Please wait..');
        var response = {
            ticketType: me.ticketType, // from jas to component param
            ticketTitle: me.ticketTitle, // from jas to component param
            ticketIssue: me.ticketIssue, // from jas to component param
            ticketNotes: me.ticketNotes, // from jas to component param
            priority: 'Medium',
            status: 'Pending'
        };

        Ext.each(me.query('displayfield'), function (field) {
            field.setValue(response[field.name]);
        });
        me.unmask();
    },

    reset: function () {
		var me = this;
		me.down('#createTicketBtn').show();
    }
});
