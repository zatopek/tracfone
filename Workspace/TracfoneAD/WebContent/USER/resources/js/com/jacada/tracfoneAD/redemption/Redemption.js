Ext.define('Jacada.user.com.jacada.tracfoneAD.redemption.Redemption', {
    extend: 'Jacada.user.com.jacada.tracfoneAD.baseComponents.BaseView',
    xtype: 'redemption',

    initComponent: function () {
        $W().setTabTitle("RedemptionTab", "");
        var me = this;
        Ext.applyIf(me, {
            name: 'redemption',
            items: me.createComponent(),
        });
        me.callParent(me);
    },

    listeners: {
        afterrender: function () {
            var me = this;
            var redemptionUrl = managers['jasHandler'].getRedemptionUrl();
            me.down('#redemptionJasFrame').getEl().set({
                'src': redemptionUrl
            });
        }
    },

    getRedemptionUrl: function () {
        // TODO generate and return the JAS url 
        adam.getDeviceProfile().then(function (response) {
            debugger;
        });

        debugger;
        return 'http://vivr.io/q61yLsG';
    },

    loadComponent: function (componentName) {
        var me = this;
        var component = null;
        var widgetName = me.getWidgetName(componentName); // component name comes up as ClassName. change it to className
        var container = me.down('#mainPanel');

        Ext.each(container.items.items, function (item) {
            item.hide();
        })
        if (!widgets.hasOwnProperty(widgetName)) { // create component if not exists
            if (componentName === 'InteractionNotes') {
                component = Ext.create('Jacada.user.com.jacada.tracfoneAD.interactionNotes.InteractionNotes');
            }
            else {
                component = Ext.create('Jacada.user.com.jacada.tracfoneAD.redemption.' + componentName);
            }
            container.add(component)
        }
        else {
            component = widgets[widgetName];
            if (container.items.items.indexOf(component) === -1) {
                container.add(component);
            }
        }

        if (component) {
            component.reset && component.reset();
            component.show();
            component.load && component.load();
        }
        else {
            Ext.Msg.alert('ERROR', 'Failed to create component');
        }
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
                        xtype: 'component',
                        itemId: 'redemptionJasFrame',
                        columnWidth: 0.3,
                        autoEl: {
                            tag: 'iframe',
                            src: '',
                            allowfullscreen: true,
                            frameborder: '0',
                            height: 550,
                            width: '100%'
                        }
                    },
                    // {
                    //     xtype: 'panel',
                    //     columnWidth: 0.3,
                    //     border: true,
                    //     title: 'PPOCESS FLOW',
                    //     html: '<iframe style="height: 550px; width: 100%; border:0";" src="http://vivr.io/q61yLsG"></iframe>'
                    // },
                    {
                        xtype: 'panel',
                        columnWidth: 0.7,
                        itemId: 'mainPanel',
                        border: false,
                        items: []
                    }
                ]
            }
        ]
    }
})
