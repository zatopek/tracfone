$W().setTabTitle("CallingIssuesTab", "");
var ticketFormPanel = Ext.create('Jacada.user.com.jacada.tracfoneAD.unableUnable.TicketForm');
var interactionNotesPanel = Ext.create('Jacada.user.com.jacada.tracfoneAD.interactionNotes.InteractionNotes');
Ext
    .define(
        'Jacada.user.com.jacada.tracfoneAD.unableUnable.UnableUnable',
        {
            extend: 'Ext.panel.Panel',
            items: [

                {
                    xtype: 'panel',
                    layout: 'column',
                    items: [
                        {
                            xtype: 'panel',
                            columnWidth: 0.3,
                            border: true,
                            title: 'PPOCESS FLOW',

                            html: '<iframe style="height: 520px; width: 100%; border:0";" src="http://vivr.io/BCb9LbN"></iframe>'
                        },
                        {
                            xtype: 'panel',
                            columnWidth: 0.7,
                            border: false,
                            title: ' ',
                            items: [
                                interactionNotesPanel
                            ]
                        }]
                }]
        })
