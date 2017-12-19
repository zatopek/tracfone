Ext.define('Jacada.user.com.jacada.tracfoneAD.redemption.PaymentTransaction', {
    extend: 'Jacada.user.com.jacada.tracfoneAD.baseComponents.BaseView',
    xtype: 'paymentTransaction',
    listeners: {
        afterrender: function () {
            this.load();
        }
    },

    load: function () {
        var me = this;
        me.mask('Please wait...');
        var min = managers['pushData'].deviceProfile.min;
        adam.callService('Tas/CreditCards?min=' + min, 'GET', {}).then(function (response) {
            // TODO we are getting [{description: "sometext", units: "sometext", price: "sometext", partNumber: "sometext"}] in response.
            // but we need an array of credit cards. So using dummy data for now
            var selectPaymentStore = Ext.create('Ext.data.Store', {
                fields: ['val', 'name'],
                data: [
                    { val: "1234567890", name: "1234567890" },
                    { val: "1234567890", name: "1234567890" },
                    { val: "1234567890", name: "1234567890" }
                ]
            });
            var combo = me.down('#selectPayment');
            combo.bindStore(selectPaymentStore);
            combo.setValue(combo.getStore().getAt(0));
            me.unmask();

        }).catch(function () {
            //  Ext.Msg.alert('ERROR', 'Sorry, cards could not be found. Please try again.');
            me.unmask();
        })
    },

    reset: function () {
        var me = this;
        me.down('#selectPayment').getStore().loadData([], false);
        me.down('#promoValidateResponse').setValue('');
        me.down('#promoCode').setValue('');
        me.down('#airtimePurchaseResponse').setValue('');
        me.down('#autoFill').setValue(false);

        me.down('#cvv').setValue('');
        me.down('#purchaseBtn').disable();
    },

    validatePromo: function () {
        var me = this;
        var promoCode = me.down('#promoCode').getValue();
        var partNumber = me.up().down('airtimePlan').down('#airtimePlanGrid').getSelectionModel().getSelection()[0].get('partNumber');
        adam.callService('Tas/PromoCodes/' + promoCode + '/ValidatePurchase?cardPartNumber=' + partNumber, 'GET', {}).then(function () {
            // TODO this service is not working
            me.down('#promoValidateResponse').setValue(response);

        }).catch(function () {
            Ext.Msg.alert('ERROR', 'Sorry, the promo code that you provided could not be validated. Please try again.');
        })
    },

    purchase: function () {
        var me = this;
        var promoCode = me.down('#promoCode').getValue();
        var partNumber = me.up().down('airtimePlan').down('#airtimePlanGrid').getSelectionModel().getSelection()[0].get('partNumber');
        var cvv = me.down('#cvv').getValue();
        var creditCardNumber = me.down('#selectPayment').getValue();
        var autoFill = me.down('#autoFill').checked;
        me.mask('Please wait...');
        adam.callService('Tas/Cards/' + partNumber + '?promocode=' + promoCode, 'POST', {
            number: creditCardNumber.substr(creditCardNumber.length - 4),
            cvv: cvv
        }).then(function (response) {
            me.down('#airtimePurchaseResponse').setValue(response);
            var airtimeSelected = me.up().down('airtimePlan').down('#airtimePlanGrid').getSelectionModel().getSelection()[0];
            adam.addAutoNotes('Pin Purchased - ' + airtimeSelected.get('description'));
            me.unmask();
        }).catch(function () {
            Ext.Msg.alert('ERROR', 'Sorry, something went wrong while processing yoru request. Please try again.');
            me.unmask();
        })
    },

    changePurchaseButton: function () {
        var me = this;
        var rowsSelectedInAirtimeGrid = me.up().down('airtimePlan').down('#airtimePlanGrid').getSelectionModel().getSelection().length;
        var cvv = me.down('#cvv').getValue();
        if (cvv.length >= 3 && me.isAirtimePlanSelected()) {
            me.down('#purchaseBtn').enable();
        }
        else {
            me.down('#purchaseBtn').disable();
        }
    },

    isAirtimePlanSelected: function () {
        var me = this;
        var rowsSelectedInAirtimeGrid = me.up().down('airtimePlan').down('#airtimePlanGrid').getSelectionModel().getSelection().length;
        return rowsSelectedInAirtimeGrid > 0
    },

    changePromoCodeButton: function () {
        var me = this;
        if (me.down('#promoCode').getValue().trim().length > 0 && me.isAirtimePlanSelected()) {
            me.down('#validateBtn').enable();
        }
        else {
            me.down('#validateBtn').disable();
        }

    },

    initComponent: function () {
        var me = this;
        Ext.applyIf(me, {
            name: 'paymentTransaction',
            items: [
                {
                    xtype: "panel",
                    layout: "column",
                    border: false,
                    items: [
                        {
                            xtype: "panel",
                            title: 'PAYMENT SELECTION',
                            columnWidth: 0.55,
                            border: false,
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
                                        xtype: "combo",
                                        fieldLabel: "Select Payment",
                                        name: "selectPayment",
                                        itemId: 'selectPayment',
                                        valueField: 'val',
                                        displayField: 'name'
                                    }, {
                                        xtype: "textfield",
                                        fieldLabel: "CVV",
                                        labelAlign: 'right',
                                        name: "cvv",
                                        itemId: 'cvv',
                                        enforceMaxLength: true,
                                        maxLength: 3,
                                        maskRe: /[0-9.]/,
                                        enableKeyEvents: true,
                                        listeners: {
                                            keyup: {
                                                fn: me.changePurchaseButton,
                                                scope: me
                                            }
                                        },
                                    }, {
                                        xtype: 'button',
                                        margin: "0 0 0 10",
                                        text: 'Purchase',
                                        itemId: 'purchaseBtn',
                                        disabled: true,
                                        handler: me.purchase,
                                        scope: me
                                    }
                                ]
                            },
                            {
                                xtype: 'panel',
                                border: false,
                                layout: {
                                    type: 'hbox',
                                    padding: '5',
                                    align: 'stretchmax'
                                },
                                items: [{
                                    xtype: "textfield",
                                    fieldLabel: "Promo Code",
                                    itemId: 'promoCode',
                                    name: "promoCode",
                                    enableKeyEvents: true,
                                    listeners: {
                                        keyup: {
                                            fn: me.changePromoCodeButton,
                                            scope: me
                                        }
                                    }
                                }, {
                                    xtype: 'button',
                                    margin: "0 0 0 10",
                                    text: 'Validate',
                                    itemId: 'validateBtn',
                                    disabled: true,
                                    handler: me.validatePromo,
                                    scope: me
                                }, {
                                    xtype: "checkbox",
                                    boxLabel: "Auto-Refill",
                                    itemId: 'autoFill',
                                    name: "checkbox",
                                    inputValue: ""
                                }]
                            },
                            {
                                xtype: 'displayfield',
                                name: 'promoValidateResponse',
                                itemId: 'promoValidateResponse',
                                margin: '0 0 0 25',
                                style: 'color: green',
                                value: ''
                            }
                            ]
                        },
                        {
                            xtype: "panel",
                            title: "TRANSCATION SUMMARY",
                            columnWidth: 0.45,
                            itemId: 'transactionSummaryPanel',
                            border: false,
                            bodyStyle: 'padding:5px 5px 5px 5px',
                            items: [
                                {
                                    xtype: 'displayfield',
                                    name: 'airtimePurchaseResponse',
                                    itemId: 'airtimePurchaseResponse'
                                }
                            ]
                        }
                    ]
                }
            ],
        });
        me.callParent(arguments);
    }
})