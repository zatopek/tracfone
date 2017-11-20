Ext
    .define(
        'Jacada.user.com.jacada.tracfoneAD.redemption.ReservePin',
        {
            extend: 'Ext.panel.Panel',
            items: [
                {
                    xtype: 'panel',
                    layout: 'column',
                    border: false,
                    items: [

                        {
                            xtype: "panel",
                            title: "REDEEM RESERVE PIN",
                            columnWidth: 0.55,
                            border: false,
                            height: 250,
                            items: {}
                        },
                        {
                            xtype: "panel",
                            title: "TRANSCATION SUMMARY",
                            columnWidth: 0.45,
                            border: false,
                            bodyStyle: 'padding:5px 5px 5px 5px',
                            items: [{
                                xtype: 'displayfield',
                                value: '<p>Airtime purchase successful.'

                            }]
                        }]
                }]

        })