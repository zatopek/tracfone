Ext.define('Jacada.user.com.jacada.tracfoneAD.redemption.PurchasePin', {
    extend: 'Jacada.user.com.jacada.tracfoneAD.baseComponents.BaseView',
    xtype: 'purchasePin',
    requires: [
        'Jacada.user.com.jacada.tracfoneAD.redemption.AirtimePlan',
        'Jacada.user.com.jacada.tracfoneAD.redemption.EstimatedCost',
        'Jacada.user.com.jacada.tracfoneAD.redemption.PaymentTransaction'
    ],
    initComponent: function () {
        debugger
        var me = this;
        Ext.applyIf(me, {
            name: 'purchasePin',
            items: me.createComponent(),
        });
        me.callParent(arguments);
    },
    load: function () {
        var me = this;
        me.down('airtimePlan').load();
        me.down('paymentTransaction').load();
    },
    reset: function () {
        var me = this;
        me.down('airtimePlan').reset();
        me.down('estimatedCost').reset();
        me.down('paymentTransaction').reset();
        Ext.getCmp('cardPanel').getLayout().setActiveItem(0);
        Ext.getCmp('move-prev').setDisabled(true);
        Ext.getCmp('move-next').setDisabled(true);
    },
    navigate : function(panel, direction){
        // This routine could contain business logic required to manage the navigation steps.
        // It would call setActiveItem as needed, manage navigation button state, handle any
        // branching logic that might be required, handle alternate actions like cancellation
        // or finalization, etc.  A complete wizard implementation could get pretty
        // sophisticated depending on the complexity required, and should probably be
        // done as a subclass of CardLayout in a real-world implementation.
        var layout = panel.getLayout();
        layout[direction]();
        Ext.getCmp('move-prev').setDisabled(!layout.getPrev());
        Ext.getCmp('move-next').setDisabled(!layout.getNext());
    },
    createComponent: function () {
		var me = this;
        return [
            {
                xtype: 'panel',
                border: false,
                height: 290,
				layout: 'fit',
                items: [
                    {
                        xtype: 'panel',
                        columnWidth: 0.6,
                        layout: 'card',
                        border: false,
                        id: 'cardPanel',
						bbar: [
								{
									id: 'move-prev',
									text: 'Back',
									handler: function(btn) {
										me.navigate(btn.up("panel"), "prev");
									},
									disabled: true
								},
								'->', // greedy spacer so that the buttons are aligned to each side
								{
									id: 'move-next',
									text: 'Next',
									disabled: true,
									handler: function(btn) {
										me.navigate(btn.up("panel"), "next");
									}
								}
							],						
                        items: [
                            {
                                xtype: "panel",
								id: 'card-0',
                                layout: "column",
                                border: false,
                                items: [
                                    {
                                        xtype: "airtimePlan",
                                        title: "SELECT AIRTIME PLAN",
                                        columnWidth: 0.75,
                                        border: false,
                                        height: 210,
                                    },
                                    {
                                        xtype: "estimatedCost",
                                        title: "PURCHASE SUMMARY",
                                        columnWidth: 0.25,
                                        border: false,
                                    }
                                ]
                            },
                            {
                                id: 'card-1',
								xtype: 'paymentTransaction'
                            }
                        ]
                    }
                ]
            }
        ]
    }
})