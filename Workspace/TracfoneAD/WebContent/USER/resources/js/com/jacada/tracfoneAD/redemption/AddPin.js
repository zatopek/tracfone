Ext.define('Jacada.user.com.jacada.tracfoneAD.redemption.AddPin', {
    extend: 'Jacada.user.com.jacada.tracfoneAD.baseComponents.BaseView',
    xtype: 'addPin',
    listeners: {
        afterrender: function () {
            // this.load();
        }
    },
    reset: function () {
        var me = this;
        me.down('#airtimePin').setValue('');
        me.down('#promoCode').setValue('');
        me.down('#transactionSummary').setValue('');
        me.down('#addAirtimeResponse').setValue('');
        me.down('#promoValidateResponse').setValue('');
        me.disableButtons();
    },

    initComponent: function () {
        var me = this;
        Ext.applyIf(me, {
            name: 'addPin',
            cls: 'airtimePinCls',
            items: me.createComponent(),
        });
        me.callParent(arguments);
    },

    airTimePinAction: function (textbox, event) {
        var me = this;
        if (textbox.getValue().length === 13) {
            // Send the textbox value to a service and get response and enable buttons
            var response = '$45 30-Dday UNL TALK/DATA, first 10 GB at High Speeds then at 2G';
            me.down('#addAirtimeResponse').setValue(response);
            me.enableButtons();
        }
        else {
            me.disableButtons();
            me.down('#addAirtimeResponse').setValue('');
        }
        me.changePromoCodeButton();
    },

    enableButtons: function () {
        var me = this;
        me.down('#addToReserveBtn').enable();
        me.down('#addNowBtn').enable();
    },

    disableButtons: function () {
        var me = this;
        me.down('#addToReserveBtn').disable();
        me.down('#addNowBtn').disable();

    },

    validatePromo: function () {
        var me = this;
        var promoCode = me.down('#promoCode').getValue();
        // TODO send this promo code to the server and get a response text 
        // using dummy response text for now
        var response = 'promo code Valid';
        me.down('#promoValidateResponse').setValue(response);

    },

    doTransaction: function (type) {
        var me = this;
        me.mask('Please wait..');
        var airtimePin = me.down('#airtimePin').getValue();
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
        me.down('#transactionSummary').setValue(response);
        me.unmask();
    },

    changePromoCodeButton: function () {
        var me = this;
        if (me.down('#promoCode').getValue().trim().length > 0 && !me.down('#addNowBtn').disabled) {
            me.down('#validateBtn').enable();
        }
        else {
            me.down('#validateBtn').disable();
        }
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
                                    itemId: 'airtimePin',
                                    enforceMaxLength: true,
                                    maskRe: /[0-9.]/,
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
                                    itemId: 'addNowBtn',
                                    handler: function () {
                                        me.doTransaction('addNow');
                                    }
                                },
                                {
                                    xtype: 'button',
                                    margin: "0 0 0 10",
                                    text: 'Add to Reserve',
                                    disabled: true,
                                    itemId: 'addToReserveBtn',
                                    handler: function () {
                                        me.doTransaction('addToReserve');
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
                                itemId: "addAirtimeResponse"
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
                                    itemId: 'promoCode',
                                    name: "textvalue",
                                    enableKeyEvents: true,
                                    listeners: {
                                        keyup: {
                                            fn: me.changePromoCodeButton,
                                            scope: me
                                        }
                                    }
                                }
                                , {
                                    xtype: 'button',
                                    margin: "0 0 0 10",
                                    text: 'Validate',
                                    itemId: 'validateBtn',
                                    disabled: true,
                                    handler: me.validatePromo,
                                    scope: me
                                }
                            ]
                        },
                        {
                            xtype: 'displayfield',
                            name: 'promoValidateResponse',
                            itemId: 'promoValidateResponse',
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
                            itemId: 'transactionSummary',
                            value: ''
                        }]
                    }
                ]
            }
        ]
    }
})