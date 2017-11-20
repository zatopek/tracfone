$W().setTabTitle("RedemptionTab", "");
var purchasePinPanel = Ext.create('Jacada.user.com.jacada.tracfoneAD.redemption.PurchasePin');
var addPinPanel = Ext.create('Jacada.user.com.jacada.tracfoneAD.redemption.AddPin');
var reservePinPanel = Ext.create('Jacada.user.com.jacada.tracfoneAD.redemption.ReservePin');
var interactionNotesPanel = Ext.create('Jacada.user.com.jacada.tracfoneAD.interactionNotes.InteractionNotes');


Ext
    .define(
        'Jacada.user.com.jacada.tracfoneAD.redemption.Redemption',
        {
            extend: 'Ext.panel.Panel',
            //title: 'Customer Service Profile',
            items: [
                {
                    xtype: 'panel',
                    layout: 'column',
                    border: false,
                    items: [
                        {
                            xtype: 'panel',
                            columnWidth: 0.3,
                            border: true,
                            title: 'PPOCESS FLOW',

                            html: '<iframe style="height: 550px; width: 100%; border:0";" src="http://vivr.io/BCb9LbN"></iframe>'
                        },
                        {
                            xtype: 'panel',
                            columnWidth: 0.7,
                            border: false,
                            items: [
                                interactionNotesPanel
                            ]
                        }
                    ]
                }]

        })
