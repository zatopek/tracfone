Ext.define('Jacada.user.com.jacada.tracfoneAD.redemption.PaymentTransaction', {
    extend: 'Jacada.user.com.jacada.tracfoneAD.baseComponents.BaseView',
    xtype: 'paymentTransaction',
    listeners: {
        afterrender: function () {
            //this.load();
        }
    },

    load: function () {
        var me = this;
        me.mask('Please wait...');
        var min = managers['pushData'].deviceProfile.min;
        adam.callService('Tas/CreditCards?min=' + min, 'GET', {}).then(function (response) {
            var cardData = [];
            Ext.each(response, function (field) {
                cardData.push({
                    val: field.number.slice(-4), // get the last four digits
                    name: field.description
                })
            })
            var selectPaymentStore = Ext.create('Ext.data.Store', {
                fields: ['val', 'name'],
                data: cardData
            });
            var combo = me.down('#selectPayment');
            combo.bindStore(selectPaymentStore);
            combo.setValue(combo.getStore().getAt(0));
            //if no credit card on file
            if(cardData.length == 0) {
                Ext.Msg.alert('ERROR', 'Sorry, no credit card can be found on file. Please use TAS to complete this call.');
            }
            me.unmask();

        }).catch(function (response) {
            Ext.Msg.alert('ERROR', 'Error retrieving credit card on file. Please use TAS to complete this call.');
            me.unmask();
        })
    },

    reset: function () {
        var me = this;
        me.down('#selectPayment').getStore().loadData([], false);
        me.down('#promoValidateResponse').setValue('');
        me.down('#promoCode').setValue('');
        me.down('#airtimePurchaseResponse').update('');
        //me.down('#autoFill').setValue(false);
        me.down('#transactionSummaryPanel').setTitle('');
        me.down('#cvv').setValue('');
        me.down('#purchaseBtn').disable();
        me.down('#sendEmailBtn').hide();
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

    sendEmail: function () {
        var me = this;
        me.mask('Please wait...');
        adam.callService('Tas/Interactions/SendEmail', 'POST', {}).then(function (response) {
            try{
                var jsonResponse = JSON.parse(response.response.responseText);
                if (jsonResponse && jsonResponse.message) {
                    Ext.Msg.alert('SUCCESS', jsonResponse.message);
                }
                else {
                    Ext.Msg.alert('SUCCESS', 'Email sent to ' + managers['pushData'].customerProfile.email);
                }
                me.unmask();
            }
            catch(e){
                Ext.Msg.alert('SUCCESS', 'Email sent to ' + managers['pushData'].customerProfile.email);
                me.unmask();
            }
        }).catch(function () {
            Ext.Msg.alert('ERROR', 'Sorry, unable to send email.');
            me.unmask();
        })
    },
    purchase: function () {
        var me = this;
        var promoCode = me.down('#promoCode').getValue();
        var partNumber = me.up().down('airtimePlan').down('#airtimePlanGrid').getSelectionModel().getSelection()[0].get('partNumber');
        var cvv = me.down('#cvv').getValue();
        var creditCardNumber = me.down('#selectPayment').getValue();
        //var autoFill = me.down('#autoFill').checked;
        me.mask('Please wait...');
        me.down('#airtimePurchaseResponse').update('');
        adam.callService('Tas/Cards/' + partNumber + '?promocode=' + promoCode, 'POST', {
            number: creditCardNumber,
            cvv: cvv
        }).then(function (response) {
            me.down('#transactionSummaryPanel').setTitle('TRANSACTION SUMMARY');
            if ((managers['pushData'].customerProfile.email) &&
                (managers['pushData'].customerProfile.email.length > 0)) {
                me.down('#sendEmailBtn').show();
                me.down('#purchaseBtn').disable();
                //me.down('#validateBtn').disable();
                //Ext.getCmp('move-prev').setDisabled(true);
                Ext.getCmp('move-prev').hide();
                Ext.getCmp('move-next').hide();
            }
            var i = response.indexOf('<div class=\"x1a\"');
            if (i >= 0) {
                response = response.substring(i);
            }
            var el = document.createElement('html');
            el.innerHTML = response;
            var labels = el.getElementsByTagName('label');
            for (i = 0; i < labels.length; i++) {
                if (labels[i].innerHTML.toLowerCase().indexOf('service end date') >= 0) {
                    if (Ext.getCmp('serviceEndDate')) {
                        Ext.getCmp('serviceEndDate').setValue(labels[i].parentNode.parentNode.children[1].innerHTML);
                    }
                }
            }
            me.down('#airtimePurchaseResponse').update(response);
            var airtimeSelected = me.up().down('airtimePlan').down('#airtimePlanGrid').getSelectionModel().getSelection()[0];
            adam.addAutoNotes(airtimeSelected.get('description') + " " + PURCHASE_AIRTIME_TAG);
            me.unmask();
            /*
            var esn = managers['pushData'].deviceProfile.esn;
            adam.callWsService('call/auditPurchasePin/' + esn, 'GET', {}).then(function (response) {

            }).catch(function () {

            });
            */
        }).catch(function (response) {
            try{
                var jsonResponse = JSON.parse(response.response.responseText);
                if (jsonResponse && jsonResponse.message) {
                    if((jsonResponse.message.toLowerCase().indexOf('object') >= 0) ||
                        (jsonResponse.message.toLowerCase().indexOf('control') >= 0)){
                        Ext.Msg.alert('ERROR', REQ_ERROR_MSG);
                    } else {
                        Ext.Msg.alert('ERROR', 'Sorry, purchase pin failed. ' + jsonResponse.message);
                    }
                }
                else {
                    Ext.Msg.alert('ERROR', REQ_ERROR_MSG);
                }
            }
            catch(e){
                Ext.Msg.alert('ERROR', REQ_ERROR_MSG);
            }
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

    changePromoCodeButton: function () {
        var me = this;
        if (me.down('#promoCode').getValue().trim().length > 0 && me.isAirtimePlanSelected()) {
            me.down('#validateBtn').enable();
        }
        else {
            me.down('#validateBtn').disable();
        }

    },

    isAirtimePlanSelected: function () {
        var me = this;
        var rowsSelectedInAirtimeGrid = me.up().down('airtimePlan').down('#airtimePlanGrid').getSelectionModel().getSelection().length;
        return rowsSelectedInAirtimeGrid > 0
    },

    addNewPayment: function () {
        Ext.Msg.alert('ERROR', 'Add payment function is not supported. Please use TAS to complete this call.');
    },

    initComponent: function () {
        var me = this;
        Ext.applyIf(me, {
            name: 'paymentTransaction',
            items: [
                {
                    xtype: "panel",
                    layout: "column",
                    height: 290,
                    border: false,
                    itemCls: 'payment-section',
                    items: [
                        {
                            xtype: "panel",
                            title: 'PAYMENT SELECTION',
                            columnWidth: 0.4,
                            border: false,
                            items: [{
                                xtype: 'panel',
                                border: false,
                                layout: {
                                    type: 'vbox',
                                    padding: '5 5 0 5',
                                    align: 'stretch'
                                },
                                items: [
                                    {
                                        xtype: "combo",
                                        fieldLabel: "Select Payment",
                                        labelAlign: 'left',
                                        name: "selectPayment",
                                        itemId: 'selectPayment',
                                        valueField: 'val',
                                        displayField: 'name',
                                        layout: 'fit',
                                        labelWidth: 100
                                    }, {
                                        xtype: "panel",
                                        border: false,
                                        layout: {
                                            type: 'hbox',
                                            padding: '0 0 0 0',
                                            align: 'stretch'
                                        },
                                        items: [
                                            {
                                                xtype: "textfield",
                                                fieldLabel: "CVV",
                                                labelAlign: 'left',
                                                padding: '2 0 0 0',
                                                name: "cvv",
                                                itemId: 'cvv',
                                                enforceMaxLength: true,
                                                maxLength: 3,
                                                maskRe: /[0-9.]/,
                                                enableKeyEvents: true,
                                                layout: 'fit',
                                                labelWidth: 100,
                                                width: 150,
                                                listeners: {
                                                    keyup: {
                                                        fn: me.changePurchaseButton,
                                                        scope: me
                                                    }
                                                },
                                            }, {
                                                xtype: 'button',
                                                margin: "0 0 0 10",
                                                text: 'Add New Payment',
                                                itemId: 'newPaymentBtn',
                                                handler: me.addNewPayment,
                                                scope: me
                                            }
                                        ]
                                    }
                                ]
                            },
                                {
                                    xtype: 'panel',
                                    border: false,
                                    layout: {
                                        type: 'hbox',
                                        padding: '2 5 0 5',
                                        align: 'stretch'
                                    },
                                    items: [{
                                        xtype: "textfield",
                                        fieldLabel: "Promo Code",
                                        labelAlign: 'left',
                                        itemId: 'promoCode',
                                        name: "promoCode",
                                        enableKeyEvents: true,
                                        labelWidth: 100,
                                        width:230,
                                        listeners: {
                                            keyup: {
                                                //fn: me.changePromoCodeButton,
                                                scope: me
                                            }
                                        }
                                    }
                                        /*, {
                                            xtype: 'button',
                                            margin: "0 0 0 10",
                                            text: 'Validate',
                                            itemId: 'validateBtn',
                                            disabled: true,
                                            handler: me.validatePromo,
                                            scope: me
                                        }*/
                                        /*, {
                                            xtype: "checkbox",
                                            boxLabel: "Auto-Refill",
                                            itemId: 'autoFill',
                                            name: "checkbox",
                                            inputValue: ""
                                        }*/
                                    ]
                                },
                                {
                                    xtype: 'displayfield',
                                    name: 'promoValidateResponse',
                                    itemId: 'promoValidateResponse',
                                    margin: '0 0 0 25',
                                    style: 'color: green',
                                    value: ''
                                },
                                {
                                    xtype: 'button',
                                    margin: "10 0 0 0",
                                    text: 'Purchase',
                                    itemId: 'purchaseBtn',
                                    disabled: true,
                                    handler: me.purchase,
                                    cls: 'purchase-btn',
                                    scope: me
                                }
                            ]
                        },
                        {
                            xtype: "panel",
                            title: "",
                            columnWidth: 0.6,
                            itemId: 'transactionSummaryPanel',
                            border: false,
                            height: '100%',
                            bodyStyle: 'padding:5px 5px 5px 5px',
                            items: [
                                {
                                    xtype: 'button',
                                    margin: "0 0 0 0",
                                    text: 'Send Email',
                                    itemId: 'sendEmailBtn',
                                    hidden: true,
                                    handler: me.sendEmail,
                                    scope: me
                                }
                                , {
                                    xtype: "panel",
                                    title: "",
                                    border: false,
                                    height: '100%',
                                    autoScroll: true,
                                    layout: 'fit',
                                    items: [{
                                        xtype: 'component',
                                        cls: 'airtimePurchaseResponseCls',
                                        name: 'airtimePurchaseResponse',
                                        itemId: 'airtimePurchaseResponse',
                                        html: ''
                                    }]
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