Ext.define('Jacada.user.com.jacada.tracfoneAD.unableUnable.TicketForm', {
    extend: 'Ext.panel.Panel',
    title: 'CREATE TICKET',
    border: false,
    items: [{
        xtype: 'panel',
        border: false,
        width: 600,
        layout: {
            type: 'vbox',
            margin: '5'
        },
        bodyStyle: 'padding:5px 5px 5px 5px',
        items: [{
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
                value: ''
            },
            {
                xtype: 'textarea',
                fieldLabel: 'Notes',
                name: 'notes',
                width: 500,
                value: ''
            },
            {
                xtype: 'button',
                margin: "0 0 0 10",
                text: 'Create Ticket'
            }]
    }]

});
