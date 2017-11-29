Ext.define('Jacada.user.com.jacada.tracfoneAD.redemption.PaymentTransaction', {
    extend: 'Ext.panel.Panel',
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
        var combo = Ext.getCmp('selectPayment');
        combo.bindStore(selectPaymentStore);
        combo.setValue(combo.getStore().getAt(0));
    },

    validatePromo: function () {
        var me = this;
        var promoCode = me.down('#promoCode').getValue();
        // TODO send this promo code to the server and get a response text 
        // using dummy response text for now
        var response = 'promo code Valid';
        Ext.getCmp('promoValidateResponse').setValue(response);

    },

    purchase: function () {
        var me = this;
        var promoCode = me.down('#promoCode').getValue();
        var portNumber = Ext.getCmp('airtimePlanGrid').getSelectionModel().getSelection()[0].get('portNumber');
        var cvv = Ext.getCmp('cvv').getValue();
        var payment = Ext.getCmp('selectPayment').getValue();
        var autoFill = Ext.getCmp('autoFill').checked;
        // TODO send this data to the service and get the response;
        var response = 'Artime Purchase successfull';
        Ext.getCmp('airtimePurchaseResponse').setValue(response);

    },

    changePurchaseButton: function (gri) {
        var rowsSelectedInAirtimeGrid = Ext.getCmp('airtimePlanGrid').getSelectionModel().getSelection().length;
        var cvv = Ext.getCmp('cvv').getValue();
        if (cvv.length >= 3 && rowsSelectedInAirtimeGrid > 0) {
            Ext.getCmp('purchaseBtn').enable();
        }
        else {
            Ext.getCmp('purchaseBtn').disable();
        }
    },

    initComponent: function () {
        var me = this;
        Ext.applyIf(me, {
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
                                        id: 'selectPayment',
                                        valueField: 'val',
                                        displayField: 'name'
                                    }, {
                                        xtype: "textfield",
                                        fieldLabel: "CVV",
                                        labelAlign: 'right',
                                        name: "cvv",
                                        id: 'cvv',
                                        enforceMaxLength: true,
                                        maxLength: 3,
                                        maskRe: /[0-9.]/,
                                        enableKeyEvents: true,
                                        listeners: {
                                            keyup: me.changePurchaseButton
                                        },
                                        scope: me
                                    }, {
                                        xtype: 'button',
                                        margin: "0 0 0 10",
                                        text: 'Purchase',
                                        id: 'purchaseBtn',
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
                                    id: 'promoCode',
                                    name: "promoCode"
                                }, {
                                    xtype: 'button',
                                    margin: "0 0 0 10",
                                    text: 'Validate',
                                    handler: me.validatePromo,
                                    scope: me
                                }, {
                                    xtype: "checkbox",
                                    boxLabel: "Auto-Refill",
                                    id: 'autoFill',
                                    name: "checkbox",
                                    inputValue: ""
                                }]
                            },
                            {
                                xtype: 'displayfield',
                                name: 'promoValidateResponse',
                                id: 'promoValidateResponse',
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
                                    id: 'airtimePurchaseResponse'
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
