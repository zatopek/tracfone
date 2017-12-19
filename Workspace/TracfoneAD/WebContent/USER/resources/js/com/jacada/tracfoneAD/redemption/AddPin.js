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
        // me.down('#promoCode').setValue('');
        me.down('#transactionSummary').setValue('');
        me.down('#addAirtimeResponse').setValue('');
        me.down('#promoValidateResponse').setValue('');
        me.disableButtons();
    },

    initComponent: function () {
        var me = this;
        Ext.applyIf(me, {
            name: 'addPin',
            items: me.createComponent(),
        });
        me.callParent(arguments);
    },

    airTimePinAction: function (textbox, event) {
        var me = this;
        var pin = textbox.getValue();
        if (pin.length === 13) {
            me.mask('Please wait...');
            adam.callService('Tas/PINs/' + pin + '/Description', 'GET', {}).then(function (response) {
                me.down('#addAirtimeResponse').setValue(response);
                me.enableButtons();
                //  me.changePromoCodeButton();
                me.unmask();
            }).catch(function () {
                Ext.Msg.alert('ERROR', 'Sorry, the airtime pin that you enntered could not be found.');
                me.disableButtons();
                me.down('#addAirtimeResponse').setValue('');
                //me.changePromoCodeButton();
                me.unmask();
            });
        }
        else {
            me.disableButtons();
            me.down('#addAirtimeResponse').setValue('');
        }
        //  me.changePromoCodeButton();
    },

    enableButtons: function () {
        var me = this;
        //me.down('#addToReserveBtn').enable();
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
        var airtimePin = me.down('#airtimePin').getValue();

        adam.callService('Tas/PromoCodes/' + promoCode + '/ValidateAdd?pinNumber=' + airtimePin).then(function (response) {
            // this service is not working
            me.down('#promoValidateResponse').setValue(response);
        }).catch(function () {
            Ext.Msg.alert('ERROR', 'Technical dificulties in validating promo code.');
        });
    },

    doTransaction: function (type) {
        var me = this;
        me.mask('Please wait..');
        var airtimePin = me.down('#airtimePin').getValue();
        var promoCode = me.down('#promoCode').getValue(); // TODO need to pass this as well to resource
        var method = 'POST';
        var resource = 'Tas/PINs/' + airtimePin + "?promoCode=" + promoCode;

        if (type === 'addToReserve') {
            method = 'PATCH';
        }

        adam.callService(resource, method, {}).then(function (response) {
            me.down('#transactionSummary').setValue(response);
            adam.addAutoNotes('Airtime Pin Added - ' + me.down('#addAirtimeResponse').getValue());
            me.unmask();
        }).catch(function () {
            Ext.Msg.alert('ERROR', 'Sorry, adding pin failed. Please try again.');
            me.unmask();
        })
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
                                    itemId: 'addToReserveBtnaddToReserveBtn',
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

                        // {
                        //     xtype: 'panel',
                        //     border: false,
                        //     layout: {
                        //         type: 'hbox',
                        //         padding: '5',
                        //         align: 'stretchmax'

                        //     },
                        //     items: [
                        //         {
                        //             xtype: "textfield",
                        //             fieldLabel: "Promo Code",
                        //             itemId: 'promoCode',
                        //             name: "textvalue",
                        //             enableKeyEvents: true,
                        //             listeners: {
                        //                 keyup: {
                        //                     fn: me.changePromoCodeButton,
                        //                     scope: me
                        //                 }
                        //             }
                        //         }
                        //         , {
                        //             xtype: 'button',
                        //             margin: "0 0 0 10",
                        //             text: 'Validate',
                        //             itemId: 'validateBtn',
                        //             disabled: true,
                        //             handler: me.validatePromo,
                        //             scope: me
                        //         }
                        //     ]
                        // },
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