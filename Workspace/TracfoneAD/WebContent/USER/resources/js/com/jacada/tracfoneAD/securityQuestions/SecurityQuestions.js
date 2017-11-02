Ext.define('Jacada.user.com.jacada.tracfoneAD.securityQuestions.SecurityQuestions', {
    extend: 'Ext.panel.Panel',

    bodyStyle: 'padding:5px 5px 5px 5px',
    items: [{
        xtype: 'panel',
        layout: 'column',
        border: false,
        items: [
            {
                columnWidth: 0.5,
                xtype: "displayfield",
                value: "Security PIN",
                name: "textvalue",
                cls: 'portletDisplay'
            }, {
                columnWidth: 0.5,
                xtype: 'component',
                cls: 'portletWeblink',
                autoEl: {
                    tag: 'a',
                    href: '#',
                    html: 'Create PIN'
                }
            }
        ]
    }, {
        xtype: 'panel',
        layout: 'column',
        border: false,
        items: [
            {
                columnWidth: 0.5,
                xtype: "displayfield",
                value: "ESN Serial #",
                name: "textvalue",
                cls: 'portletDisplay'
            }, {
                columnWidth: 0.5,
                xtype: "button",
                //iconCls:
                text: "90909090123",
                handler: function(b,e){
                    b.setIconClass  = 'btn-ok';
                }
            }

        ]
    }, {
        xtype: 'panel',
        layout: 'column',
        border: false,
        items: [
            {
                columnWidth: 0.5,
                xtype: "displayfield",
                value: 'Activation ZIP',
                name: "textvalue",
                cls: 'portletDisplay'
            }, {
                columnWidth: 0.5,
                xtype: "button",
                text: "30346"

            }
        ]
    }, {
        xtype: 'panel',
        layout: 'column',
        border: false,
        items: [
            {
                columnWidth: 0.5,
                xtype: "displayfield",
                value: "Last Redemption",
                name: "textvalue",
                cls: 'portletDisplay'
            }, {
                columnWidth: 0.5,
                xtype: "button",
                text: "10/17/2017"

            }
        ]
    }]


});
