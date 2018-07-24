// var ticketFormPanel = Ext.create('Jacada.user.com.jacada.tracfoneAD.unableUnable.TicketForm');
// var ticketFormPanel = Ext.create('Jacada.user.com.jacada.tracfoneAD.unableUnable.TicketForm');
// var interactionNotesPanel = Ext.create('Jacada.user.com.jacada.tracfoneAD.interactionNotes.InteractionNotes');
// var attCallAssistancePanel = Ext.create('Jacada.user.com.jacada.tracfoneAD.unableUnable.AttCallAssistance');
// var verizonCallAssistancePanel = Ext.create('Jacada.user.com.jacada.tracfoneAD.unableUnable.VerizonCallAssistance');

Ext.define('Jacada.user.com.jacada.tracfoneAD.lifeline.Lifeline', {
    extend: 'Jacada.user.com.jacada.tracfoneAD.baseComponents.BaseView',
    xtype: 'troubleShooting',
    initComponent: function () {
        $W().setTabTitle("Lifeline", "");
        var me = this;
        Ext.applyIf(me, {
            name: 'lifeline',
            cls: 'unableUnableCls',
            items: [
                /*
                { // TODO this first item should be removed when the post message from interaction is complete to load the components on the right main panel
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
                            text: 'Ticket Form',
                            name: 'TicketForm'
                        }, {
                            text: 'Att Call Assistance',
                            name: 'AttCallAssistance'
                        }, {
                            text: 'Verizon Call Assistance',
                            name: 'VerizonCallAssistance'
                        }, {
                            text: 'Interaction Notes',
                            name: 'InteractionNotes'
                        }
                    ]
                },
                */
                {
                    xtype: 'panel',
                    layout: 'column',
                    items: [
                        {
                            xtype: 'component',
                            itemId: 'lifelineJasFrame',
                            columnWidth: 0.4,
                            autoEl: {
                                tag: 'iframe',
                                name: 'lifelineJasFrame',
                                src: '',
                                allowfullscreen: true,
                                frameborder: '0',
                                height: 310,
                                width: '100%'
                            }
                        },
                        // {
                        //     xtype: 'panel',
                        //     columnWidth: 0.3,
                        //     border: true,
                        //     title: 'PPOCESS FLOW',
                        //     html: '<iframe style="height: 520px; width: 100%; border:0";" src="https://gointeract.io/interact/index?interaction=2471ae2941ee-0cf98cced8706fb9-c170&accountId=azurademo&appkey=6c87bc97-fc7a-4dfe-80b3-d8c43521cb9c&TF_BYOP_Flag=true&TF_Carrier=ATT&TF_iPhone_Flag=true&TF_LTE_Flag=false&TF_MINStatus=ACTIVE&TF_PPE_Flag=FALSE&TF_ServiceEndDate=20%20Nov%202017&TF_SIMStatus=CN&TF_VoiceBalance=100&TF_VoiceBalance_Flag=false&TF_ServiceExpiredFlag=False"></iframe>'
                        // },
                        {
                            xtype: 'panel',
                            columnWidth: 0.6,
                            itemId: 'mainPanel',
							cls: ['unable', 'mainPanel'],
							height: 310,
                            border: false,
                            title: ' ',
                            items: []
                        }
                    ]
                }
            ],
        });
        me.callParent(me);
    },

    listeners: {
        afterrender: function () {
            var me = this;
            me.down('#lifelineJasFrame').getEl().set({
                'src': managers['jasHandler'].getLifelineMenuUrl()
            });
        }
    },

    loadComponent: function (componentName, params) {
        debugger;
        var me = this;
        var component = null;
        var widgetName = me.getWidgetName(componentName); // component name comes up as ClassName. change it to className
        var container = me.down('#mainPanel');

        Ext.each(container.items.items, function (item) {
            item.hide();
        })

        if(componentName===''){
            return;
        }

        if (!widgets.hasOwnProperty(widgetName)) { // create component if not exists
            if (componentName === 'InteractionNotes') {
                component = Ext.create('Jacada.user.com.jacada.tracfoneAD.interactionNotes.InteractionNotes');
            }
            else if (componentName === 'SplashPanel') {
                component = Ext.create('Jacada.user.com.jacada.tracfoneAD.common.SplashPanelUnable');
            }
            else {
                component = Ext.create('Jacada.user.com.jacada.tracfoneAD.unableUnable.' + componentName);
            }
            container.add(component);
        }
        else {
            component = widgets[widgetName];
            if (container.items.items.indexOf(component) === -1) {
                container.add(component);
            }
        } // apend params if exists to component
        if (params && !Ext.Object.isEmpty(params)) {
            Ext.applyIf(component, params);
        }
        if (component) {
            component.reset && component.reset();
            component.show();
            component.load && component.load();
        }
        else {
            Ext.Msg.alert('ERROR', 'Failed to create component');
        }
    }
})
