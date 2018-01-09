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
        me.down('#airtimePurchaseResponse').update('');
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
        me.down('#airtimePurchaseResponse').update('');
        adam.callService('Tas/Cards/' + partNumber + '?promocode=' + promoCode, 'POST', {
            number: creditCardNumber,
            cvv: cvv
        }).then(function (response) {
        	var i = response.indexOf('<div class=\"x1a\"');
        	if(i>=0){
        		response = response.substring(i);
        	}
            me.down('#airtimePurchaseResponse').update(response);
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
                    height: 290,
                    border: false,
					itemCls: 'payment-section',
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
                                    type: 'vbox',
                                    padding: '5',
                                    align: 'stretch'
                                },
                                items: [
                                    {
                                        xtype: "combo",
                                        fieldLabel: "Select Payment",
                                        name: "selectPayment",
                                        itemId: 'selectPayment',
                                        valueField: 'val',
                                        displayField: 'name',
										layout: 'fit'
                                    }, {
                                        xtype: "textfield",
                                        fieldLabel: "CVV",
                                        labelAlign: 'left',
                                        name: "cvv",
                                        itemId: 'cvv',
                                        enforceMaxLength: true,
                                        maxLength: 3,
                                        maskRe: /[0-9.]/,
                                        enableKeyEvents: true,
										layout: 'fit',
                                        listeners: {
                                            keyup: {
                                                fn: me.changePurchaseButton,
                                                scope: me
                                            }
                                        },
                                    }, {
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
                                xtype: 'panel',
                                border: false,
                                layout: {
                                    type: 'hbox',
                                    padding: '5',
									margin: '10 0 0 0',
                                    align: 'stretch'
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
                            height: '100%',
                            bodyStyle: 'padding:5px 5px 5px 5px',
                            items: [
                                {
                                    xtype: 'component',
                                    cls: 'airtimePurchaseResponseCls',
                                    name: 'airtimePurchaseResponse',
                                    itemId: 'airtimePurchaseResponse',
                                    //html: '<div>Thank you for adding benefits to your device!<br>Please remember to refill your service before your Service End Date. As a reminder, we will send you a text message or email before this date.<br><br><br>REP: International calling is only available for TracFone, not SafeLink.<br><br>To make an international call:<br><ul>    <li>Call 1-800-706-3839 &gt; Follow instructions &gt; Enter your international number.</li></ul><blockquote><p>OR</p></blockquote><ul>    <li>Go to Google Play &gt; Download the FREE Tracfone International app.<br>    </li></ul></div></div><div class=\\"xqe x19\\" id=\\"r2:0:r1:0:r3:1:pfl7\\" style=\\"width: 650px;\\"><table style=\\"width: auto;\\" border=\\"0\\" cellspacing=\\"0\\" cellpadding=\\"0\\" summary=\\"\\"><tbody><tr><td class=\\"x4w\\" colspan=\\"1\\"><table width=\\"100%\\" border=\\"0\\" cellspacing=\\"0\\" cellpadding=\\"0\\" summary=\\"\\"><tbody><tr><td></td><td></td></tr><tr class=\\"xql\\" id=\\"r2:0:r1:0:r3:1:plam22\\"><td class=\\"x15 x4z\\"><label class=\\"af_panelLabelAndMessage_label-text\\">Service Plan Added</label></td><td class=\\"xso xqs\\" valign=\\"top\\" style=\\"padding-left: 9px;\\">Paygo</td></tr><tr><td></td><td class=\\"x51\\"><img width=\\"10\\" height=\\"10\\" id=\\"r2:0:r1:0:r3:1:s13\\" alt=\\"\\" src=\\"/AdfCrmConsole/adf/images/t.gif\\"></td></tr><tr><td></td><td class=\\"x51\\"><img width=\\"10\\" height=\\"10\\" id=\\"r2:0:r1:0:r3:1:s12\\" alt=\\"\\" src=\\"/AdfCrmConsole/adf/images/t.gif\\"></td></tr></tbody></table></td></tr></tbody></table></div><div class=\\"xqe x19\\" id=\\"r2:0:r1:0:r3:1:pfl2\\"><table style=\\"width: auto;\\" border=\\"0\\" cellspacing=\\"0\\" cellpadding=\\"0\\" summary=\\"\\"><tbody><tr><td width=\\"33%\\" class=\\"x4w\\" colspan=\\"1\\"><table width=\\"100%\\" border=\\"0\\" cellspacing=\\"0\\" cellpadding=\\"0\\" summary=\\"\\"><tbody><tr><td></td><td></td></tr><tr class=\\"xql\\" id=\\"r2:0:r1:0:r3:1:plam3\\"><td class=\\"x15 x4z\\"><label class=\\"af_panelLabelAndMessage_label-text\\">MIN</label></td><td class=\\"xso xqs\\" valign=\\"top\\" style=\\"padding-left: 9px;\\">3058321279</td></tr><tr class=\\"xql\\" id=\\"r2:0:r1:0:r3:1:plam6\\"><td class=\\"x15 x4z\\"><label class=\\"af_panelLabelAndMessage_label-text\\">Rate Plan</label></td><td class=\\"xso xqs\\" valign=\\"top\\" style=\\"padding-left: 9px;\\">TF_HD_BULK_BR_PP_1I</td></tr><tr class=\\"xql\\" id=\\"r2:0:r1:0:r3:1:plam2\\"><td class=\\"x15 x4z\\"><label class=\\"af_panelLabelAndMessage_label-text\\">MIN Status</label></td><td class=\\"xso xqs\\" valign=\\"top\\" style=\\"padding-left: 9px;\\"><span style=\\"white-space: nowrap;\\">ACTIVE</span></td></tr></tbody></table></td><td width=\\"33%\\" class=\\"x4w\\" colspan=\\"1\\"><table width=\\"100%\\" border=\\"0\\" cellspacing=\\"0\\" cellpadding=\\"0\\" summary=\\"\\"><tbody><tr><td></td><td></td></tr><tr class=\\"xql\\" id=\\"r2:0:r1:0:r3:1:plam9\\"><td class=\\"x15 x4z\\"><label class=\\"af_panelLabelAndMessage_label-text\\">Auto Refill</label></td><td class=\\"xso xqs\\" valign=\\"top\\" style=\\"padding-left: 9px;\\">NO</td></tr><tr class=\\"xql\\" id=\\"r2:0:r1:0:r3:1:plam7\\"><td class=\\"x15 x4z\\"><label class=\\"af_panelLabelAndMessage_label-text\\">Activation Date</label></td><td class=\\"xso xqs\\" valign=\\"top\\" style=\\"padding-left: 9px;\\">12/12/2017</td></tr><tr class=\\"xql\\" id=\\"r2:0:r1:0:r3:1:plam8\\"><td class=\\"x15 x4z\\"><label class=\\"af_panelLabelAndMessage_label-text\\">Service End Date</label></td><td class=\\"xso xqs\\" valign=\\"top\\" style=\\"padding-left: 9px;\\">5/11/2019</td></tr></tbody></table></td><td class=\\"x4w\\" colspan=\\"1\\"><table width=\\"100%\\" border=\\"0\\" cellspacing=\\"0\\" cellpadding=\\"0\\" summary=\\"\\"><tbody><tr><td></td><td></td></tr><tr class=\\"xql\\" id=\\"r2:0:r1:0:r3:1:plam24\\"><td class=\\"x15 x4z\\"><label class=\\"af_panelLabelAndMessage_label-text\\">Email</label></td><td class=\\"xso xqs\\" valign=\\"top\\" style=\\"padding-left: 9px;\\">tracfonesamartpay11@yopmail.com</td></tr></tbody></table></td></tr></tbody></table></div><div class=\\"xqe x19\\" id=\\"r2:0:r1:0:r3:1:pfl4\\" style=\\"margin: 1%;\\"><table style=\\"width: auto;\\" border=\\"0\\" cellspacing=\\"0\\" cellpadding=\\"0\\" summary=\\"\\"><tbody><tr></tr></tbody></table></div></div></div><div class=\\"xsh p_AFCore p_AFDefault\\"></div><div>Thank you for adding benefits to your device!<br>Please remember to refill your service before your Service End Date. As a reminder, we will send you a text message or email before this date.<br><br><br>REP: International calling is only available for TracFone, not SafeLink.<br><br>To make an international call:<br><ul>    <li>Call 1-800-706-3839 &gt; Follow instructions &gt; Enter your international number.</li></ul><blockquote><p>OR</p></blockquote><ul>    <li>Go to Google Play &gt; Download the FREE Tracfone International app.<br>    </li></ul></div></div><div class=\\"xqe x19\\" id=\\"r2:0:r1:0:r3:1:pfl7\\" style=\\"width: 650px;\\"><table style=\\"width: auto;\\" border=\\"0\\" cellspacing=\\"0\\" cellpadding=\\"0\\" summary=\\"\\"><tbody><tr><td class=\\"x4w\\" colspan=\\"1\\"><table width=\\"100%\\" border=\\"0\\" cellspacing=\\"0\\" cellpadding=\\"0\\" summary=\\"\\"><tbody><tr><td></td><td></td></tr><tr class=\\"xql\\" id=\\"r2:0:r1:0:r3:1:plam22\\"><td class=\\"x15 x4z\\"><label class=\\"af_panelLabelAndMessage_label-text\\">Service Plan Added</label></td><td class=\\"xso xqs\\" valign=\\"top\\" style=\\"padding-left: 9px;\\">Paygo</td></tr><tr><td></td><td class=\\"x51\\"><img width=\\"10\\" height=\\"10\\" id=\\"r2:0:r1:0:r3:1:s13\\" alt=\\"\\" src=\\"/AdfCrmConsole/adf/images/t.gif\\"></td></tr><tr><td></td><td class=\\"x51\\"><img width=\\"10\\" height=\\"10\\" id=\\"r2:0:r1:0:r3:1:s12\\" alt=\\"\\" src=\\"/AdfCrmConsole/adf/images/t.gif\\"></td></tr></tbody></table></td></tr></tbody></table></div><div class=\\"xqe x19\\" id=\\"r2:0:r1:0:r3:1:pfl2\\"><table style=\\"width: auto;\\" border=\\"0\\" cellspacing=\\"0\\" cellpadding=\\"0\\" summary=\\"\\"><tbody><tr><td width=\\"33%\\" class=\\"x4w\\" colspan=\\"1\\"><table width=\\"100%\\" border=\\"0\\" cellspacing=\\"0\\" cellpadding=\\"0\\" summary=\\"\\"><tbody><tr><td></td><td></td></tr><tr class=\\"xql\\" id=\\"r2:0:r1:0:r3:1:plam3\\"><td class=\\"x15 x4z\\"><label class=\\"af_panelLabelAndMessage_label-text\\">MIN</label></td><td class=\\"xso xqs\\" valign=\\"top\\" style=\\"padding-left: 9px;\\">3058321279</td></tr><tr class=\\"xql\\" id=\\"r2:0:r1:0:r3:1:plam6\\"><td class=\\"x15 x4z\\"><label class=\\"af_panelLabelAndMessage_label-text\\">Rate Plan</label></td><td class=\\"xso xqs\\" valign=\\"top\\" style=\\"padding-left: 9px;\\">TF_HD_BULK_BR_PP_1I</td></tr><tr class=\\"xql\\" id=\\"r2:0:r1:0:r3:1:plam2\\"><td class=\\"x15 x4z\\"><label class=\\"af_panelLabelAndMessage_label-text\\">MIN Status</label></td><td class=\\"xso xqs\\" valign=\\"top\\" style=\\"padding-left: 9px;\\"><span style=\\"white-space: nowrap;\\">ACTIVE</span></td></tr></tbody></table></td><td width=\\"33%\\" class=\\"x4w\\" colspan=\\"1\\"><table width=\\"100%\\" border=\\"0\\" cellspacing=\\"0\\" cellpadding=\\"0\\" summary=\\"\\"><tbody><tr><td></td><td></td></tr><tr class=\\"xql\\" id=\\"r2:0:r1:0:r3:1:plam9\\"><td class=\\"x15 x4z\\"><label class=\\"af_panelLabelAndMessage_label-text\\">Auto Refill</label></td><td class=\\"xso xqs\\" valign=\\"top\\" style=\\"padding-left: 9px;\\">NO</td></tr><tr class=\\"xql\\" id=\\"r2:0:r1:0:r3:1:plam7\\"><td class=\\"x15 x4z\\"><label class=\\"af_panelLabelAndMessage_label-text\\">Activation Date</label></td><td class=\\"xso xqs\\" valign=\\"top\\" style=\\"padding-left: 9px;\\">12/12/2017</td></tr><tr class=\\"xql\\" id=\\"r2:0:r1:0:r3:1:plam8\\"><td class=\\"x15 x4z\\"><label class=\\"af_panelLabelAndMessage_label-text\\">Service End Date</label></td><td class=\\"xso xqs\\" valign=\\"top\\" style=\\"padding-left: 9px;\\">5/11/2019</td></tr></tbody></table></td><td class=\\"x4w\\" colspan=\\"1\\"><table width=\\"100%\\" border=\\"0\\" cellspacing=\\"0\\" cellpadding=\\"0\\" summary=\\"\\"><tbody><tr><td></td><td></td></tr><tr class=\\"xql\\" id=\\"r2:0:r1:0:r3:1:plam24\\"><td class=\\"x15 x4z\\"><label class=\\"af_panelLabelAndMessage_label-text\\">Email</label></td><td class=\\"xso xqs\\" valign=\\"top\\" style=\\"padding-left: 9px;\\">tracfonesamartpay11@yopmail.com</td></tr></tbody></table></td></tr></tbody></table></div><div class=\\"xqe x19\\" id=\\"r2:0:r1:0:r3:1:pfl4\\" style=\\"margin: 1%;\\"><table style=\\"width: auto;\\" border=\\"0\\" cellspacing=\\"0\\" cellpadding=\\"0\\" summary=\\"\\"><tbody><tr></tr></tbody></table></div></div></div><div class=\\"xsh p_AFCore p_AFDefault\\"></div><div>Thank you for adding benefits to your device!<br>Please remember to refill your service before your Service End Date. As a reminder, we will send you a text message or email before this date.<br><br><br>REP: International calling is only available for TracFone, not SafeLink.<br><br>To make an international call:<br><ul>    <li>Call 1-800-706-3839 &gt; Follow instructions &gt; Enter your international number.</li></ul><blockquote><p>OR</p></blockquote><ul>    <li>Go to Google Play &gt; Download the FREE Tracfone International app.<br>    </li></ul></div></div><div class=\"xqe x19\" id=\"r2:0:r1:0:r3:1:pfl7\" style=\"width: 650px;\"><table style=\"width: auto;\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\" summary=\"\"><tbody><tr><td class=\"x4w\" colspan=\"1\"><table width=\"100%\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\" summary=\"\"><tbody><tr><td></td><td></td></tr><tr class=\"xql\" id=\"r2:0:r1:0:r3:1:plam22\"><td class=\"x15 x4z\"><label class=\"af_panelLabelAndMessage_label-text\">Service Plan Added</label></td><td class=\"xso xqs\" valign=\"top\" style=\"padding-left: 9px;\">Paygo</td></tr><tr><td></td><td class=\"x51\"><img width=\"10\" height=\"10\" id=\"r2:0:r1:0:r3:1:s13\" alt=\"\" src=\"/AdfCrmConsole/adf/images/t.gif\"></td></tr><tr><td></td><td class=\"x51\"><img width=\"10\" height=\"10\" id=\"r2:0:r1:0:r3:1:s12\" alt=\"\" src=\"/AdfCrmConsole/adf/images/t.gif\"></td></tr></tbody></table></td></tr></tbody></table></div><div class=\"xqe x19\" id=\"r2:0:r1:0:r3:1:pfl2\"><table style=\"width: auto;\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\" summary=\"\"><tbody><tr><td width=\"33%\" class=\"x4w\" colspan=\"1\"><table width=\"100%\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\" summary=\"\"><tbody><tr><td></td><td></td></tr><tr class=\"xql\" id=\"r2:0:r1:0:r3:1:plam3\"><td class=\"x15 x4z\"><label class=\"af_panelLabelAndMessage_label-text\">MIN</label></td><td class=\"xso xqs\" valign=\"top\" style=\"padding-left: 9px;\">3058321279</td></tr><tr class=\"xql\" id=\"r2:0:r1:0:r3:1:plam6\"><td class=\"x15 x4z\"><label class=\"af_panelLabelAndMessage_label-text\">Rate Plan</label></td><td class=\"xso xqs\" valign=\"top\" style=\"padding-left: 9px;\">TF_HD_BULK_BR_PP_1I</td></tr><tr class=\"xql\" id=\"r2:0:r1:0:r3:1:plam2\"><td class=\"x15 x4z\"><label class=\"af_panelLabelAndMessage_label-text\">MIN Status</label></td><td class=\"xso xqs\" valign=\"top\" style=\"padding-left: 9px;\"><span style=\"white-space: nowrap;\">ACTIVE</span></td></tr></tbody></table></td><td width=\"33%\" class=\"x4w\" colspan=\"1\"><table width=\"100%\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\" summary=\"\"><tbody><tr><td></td><td></td></tr><tr class=\"xql\" id=\"r2:0:r1:0:r3:1:plam9\"><td class=\"x15 x4z\"><label class=\"af_panelLabelAndMessage_label-text\">Auto Refill</label></td><td class=\"xso xqs\" valign=\"top\" style=\"padding-left: 9px;\">NO</td></tr><tr class=\"xql\" id=\"r2:0:r1:0:r3:1:plam7\"><td class=\"x15 x4z\"><label class=\"af_panelLabelAndMessage_label-text\">Activation Date</label></td><td class=\"xso xqs\" valign=\"top\" style=\"padding-left: 9px;\">12/12/2017</td></tr><tr class=\"xql\" id=\"r2:0:r1:0:r3:1:plam8\"><td class=\"x15 x4z\"><label class=\"af_panelLabelAndMessage_label-text\">Service End Date</label></td><td class=\"xso xqs\" valign=\"top\" style=\"padding-left: 9px;\">5/11/2019</td></tr></tbody></table></td><td class=\"x4w\" colspan=\"1\"><table width=\"100%\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\" summary=\"\"><tbody><tr><td></td><td></td></tr><tr class=\"xql\" id=\"r2:0:r1:0:r3:1:plam24\"><td class=\"x15 x4z\"><label class=\"af_panelLabelAndMessage_label-text\">Email</label></td><td class=\"xso xqs\" valign=\"top\" style=\"padding-left: 9px;\">tracfonesamartpay11@yopmail.com</td></tr></tbody></table></td></tr></tbody></table></div><div class=\"xqe x19\" id=\"r2:0:r1:0:r3:1:pfl4\" style=\"margin: 1%;\"><table style=\"width: auto;\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\" summary=\"\"><tbody><tr></tr></tbody></table></div></div></div><div class=\"xsh p_AFCore p_AFDefault\"></div>'
                                    html: ''
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