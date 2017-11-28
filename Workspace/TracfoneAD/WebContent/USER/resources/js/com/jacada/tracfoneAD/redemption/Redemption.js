Ext.define('Jacada.user.com.jacada.tracfoneAD.redemption.Redemption', {
    extend: 'Ext.panel.Panel',
    initComponent: function () {
        $W().setTabTitle("RedemptionTab", "");
        var me = this;
        Ext.applyIf(me, {
            items: me.createComponent(),
        });
        me.callParent(arguments);
    },

    listeners: {
        afterrender: function () {
            var defaultComponent = 'PurchasePin';
            this.loadComponent(defaultComponent);
        }
    },

    loadComponent: function (componentName) {
        var component = null;
        if (componentName === 'InteractionNotes') {
            component = Ext.create('Jacada.user.com.jacada.tracfoneAD.interactionNotes.InteractionNotes');
        }
        else {
            component = Ext.create('Jacada.user.com.jacada.tracfoneAD.redemption.' + componentName);
        }
        var container = Ext.getCmp('mainPanel');
        // remove existing element if exist
        if (container.down())
            container.remove(container.down());
        container.add(component)
    },

    createComponent: function () {
        var me = this;
        return [
            { // TODO this first iten should be removed when the post message from interaction is complete to load the component
                xtype: 'panel',
                layout: 'hbox',
                defaults: {
                    xtype: 'button',
                    margin: '10 10 10 0',
                    handler: function () {
                        me.loadComponent(this.name);
                    }
                },
                items: [
                    {
                        text: 'PurchasePin',
                        name: 'PurchasePin'
                    }, {
                        text: 'Add Pin',
                        name: 'AddPin'
                    }, {
                        text: 'Reserve Pin',
                        name: 'ReservePin'
                    }, {
                        text: 'Interaction Notes',
                        name: 'InteractionNotes'
                    }
                ]
            },
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
                        id: 'mainPanel',
                        border: false,
                        items: []
                    }
                ]
            }]
    }
})
