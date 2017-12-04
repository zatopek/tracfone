Ext.define('Jacada.user.com.jacada.tracfoneAD.redemption.PaymentTransaction', {
    extend: 'Jacada.user.com.jacada.tracfoneAD.baseComponents.BaseView',
    xtype: 'paymentTransaction',
    listeners: {
        afterrender: function () {
            this.load();
        }
    },

    load: function () {
        // TODO GET the data from the service for the payment dropdown
        // using dummy data for now
        var me = this;

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
        // TODO send this promo code to the server and get a response text 
        // using dummy response text for now
        var response = 'promo code Valid';
        me.down('#promoValidateResponse').setValue(response);

    },

    purchase: function () {
        var me = this;
        var promoCode = me.down('#promoCode').getValue();
        var portNumber = me.up().down('airtimePlan').down('#airtimePlanGrid').getSelectionModel().getSelection()[0].get('portNumber');
        var cvv = me.down('#cvv').getValue();
        var payment = me.down('#selectPayment').getValue();
        var autoFill = me.down('#autoFill').checked;
        // TODO send this data to the service and get the response;
        var response = 'Artime Purchase successfull';
        me.down('#airtimePurchaseResponse').setValue(response);

    },

    changePurchaseButton: function () {
        var me = this;
        var rowsSelectedInAirtimeGrid = me.up().down('airtimePlan').down('#airtimePlanGrid').getSelectionModel().getSelection().length;
        var cvv = me.down('#cvv').getValue();
        if (cvv.length >= 3 && rowsSelectedInAirtimeGrid > 0) {
            me.down('#purchaseBtn').enable();
        }
        else {
            me.down('#purchaseBtn').disable();
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
                                            fn: function (textbox, event) {
                                                if (textbox.getValue().trim().length > 0) {
                                                    me.down('#validateBtn').enable();
                                                }
                                                else {
                                                    me.down('#validateBtn').disable();
                                                }
                                            },
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