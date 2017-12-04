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

    loadComponent: function (componentName) {
        var me = this;
        var component = null;
        var widgetName = me.getWidgetName(componentName); // component name comes up as ClassName. change it to className
        var container = Ext.getCmp('mainPanel');

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
            component.reset && component.reset();
            component.show();
            component.load && component.load();

        }
    },

    componentExists: function (container, componentName) {
        var exists = false;
        Ext.each(container.items.items, function (component) {
            if (component.xtype.toLowerCase() === componentName.toLowerCase()) {
                if (component.reset && typeof component.reset === 'function') {
                    component.reset();
                }
                component.show();
                if (component.load && typeof component.load === 'function') {
                    component.load();
                }
                exists = true;
                return false;
            }
        });
        return exists;
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
                        html: '<iframe style="height: 550px; width: 100%; border:0";" src="http://vivr.io/q61yLsG"></iframe>'
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
