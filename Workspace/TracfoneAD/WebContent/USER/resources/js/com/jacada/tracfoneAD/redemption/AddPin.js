Ext.define('Jacada.user.com.jacada.tracfoneAD.redemption.AddPin', {
    extend: 'Ext.panel.Panel',
    listeners: {
        afterrender: function () {
            // this.load();
        }
    },

    initComponent: function () {
        var me = this;
        Ext.applyIf(me, {
            items: me.createComponent(),
        });
        me.callParent(arguments);
    },

    airTimePinAction: function (textbox, event) {
        var me = this;
        if (textbox.getValue().length === 13) {
            // Send the textbox value to a service and get response and enable buttons
            var response = '$45 30-Dday UNL TALK/DATA, first 10 GB at High Speeds then at 2G';
            Ext.getCmp('addAirtimeResponse').setValue(response);
            me.enableButtons();
        }
        else {
            me.disableButtons();
            Ext.getCmp('addAirtimeResponse').setValue('');
        }
    },

    enableButtons: function () {
        Ext.getCmp('addToReserveBtn').enable();
        Ext.getCmp('addNowBtn').enable();
    },

    disableButtons: function () {
        Ext.getCmp('addToReserveBtn').disable();
        Ext.getCmp('addNowBtn').disable();

    },

    validatePromo: function () {
        var me = this;
        var promoCode = me.down('#promoCode').getValue();
        // TODO send this promo code to the server and get a response text 
        // using dummy response text for now
        var response = 'promo code Valid';
        Ext.getCmp('promoValidateResponse').setValue(response);

    },

    doTranction: function (type) {
        var me = this;
        me.mask('Please wait..');
        var airtimePin = Ext.getCmp('airtimePin').getValue();
        if (type === 'addNow') {
            // TODO call service with airtime Pin value and get response
        }
        else {
            // TODO call service with airtime Pin value and get response
        }
        //
        response = '<p>Thank you for adding benefits to your phone! '
            + '<p>You will need to turn your phone OFF and back on to reset and restore your benefits.'
            + '<p>Please remember to add benefits to your phone before <Service End Date>. As a reminder, we will send you a text message or email before this date.'
            + '<p>Service plan added: <b>$45 Unlimited Talk, Text & Data Plan</b>';
        Ext.getCmp('transactionSummary').setValue(response);
        me.unmask();
    },

    createComponent: function () {
        var me = this;
        return [
            {
                xtype: 'panel',
                layout: 'column',
                border: false,
                items: [
                    {
                        xtype: 'panel',
                        columnWidth: 0.55,
                        border: false,
                        bodyStyle: 'padding:5 5 5 5',
                        title: "ADD AIRTIME PIN",
                        items: [{
                            xtype: 'panel',
                            border: false,
                            layout: {
                                type: 'hbox',
                                padding: '5',
                                align: 'stretchmax'
                            },
                            items: [
                                {
                                    xtype: "textfield",
                                    fieldLabel: "Airtime Pin",
                                    name: "airtimePin",
                                    id: 'airtimePin',
                                    enforceMaxLength: true,
                                    maxLength: 13,
                                    enableKeyEvents: true,
                                    listeners: {
                                        keyup: function (textbox, event) {
                                            me.airTimePinAction(textbox, event)
                                        }
                                    },
                                    scope: this
                                },
                                {
                                    xtype: 'button',
                                    margin: "0 0 0 10",
                                    disabled: true,
                                    text: 'Add Now',
                                    id: 'addNowBtn',
                                    handler: function () {
                                        me.doTranction('addNow');
                                    }
                                },
                                {
                                    xtype: 'button',
                                    margin: "0 0 0 10",
                                    text: 'Add to Reserve',
                                    disabled: true,
                                    id: 'addToReserveBtn',
                                    handler: function () {
                                        me.doTranction('addToReserve');
                                    }
                                }
                            ]
                        },
                        {
                            xtype: 'panel',
                            border: false,
                            margin: '5 5 5 10',
                            items: [{
                                xtype: "displayfield",
                                id: "addAirtimeResponse"
                            }]
                        },

                        {
                            xtype: 'panel',
                            border: false,
                            layout: {
                                type: 'hbox',
                                padding: '5',
                                align: 'stretchmax'

                            },
                            items: [
                                {
                                    xtype: "textfield",
                                    fieldLabel: "Promo Code",
                                    id: 'promoCode',
                                    name: "textvalue"
                                }
                                , {
                                    xtype: 'button',
                                    margin: "0 0 0 10",
                                    text: 'Validate',
                                    handler: me.validatePromo,
                                    scope: me
                                }
                            ]
                        },
                        {
                            xtype: 'displayfield',
                            name: 'promoValidateResponse',
                            id: 'promoValidateResponse',
                            margin: '0 0 0 25',
                            style: 'color: green',
                            value: ''
                        }]
                    },
                    {
                        xtype: 'panel',
                        columnWidth: 0.45,
                        height: 450,
                        title: 'TRANSACTION SUMMARY',
                        border: false,
                        bodyStyle: 'padding:5px 5px 5px 5px',
                        items: [{
                            xtype: 'displayfield',
                            id: 'transactionSummary',
                            value: ''
                        }]
                    }
                ]
            }
        ]
    }

})
