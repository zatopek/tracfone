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
        me.down('#airtimePin1').setValue('');
        me.down('#airtimePin2').setValue('');
        me.down('#airtimePin3').setValue('');
        me.down('#airtimePin4').setValue('');
        me.down('#airtimePin5').setValue('');
        me.down('#promoCode').setValue('');
        me.down('#transactionSummary').update('');
        me.down('#addAirtimeResponse').setValue('');
        me.down('#promoValidateResponse').setValue('');
        me.down('#transactionSummaryPanel').setTitle('');
        //me.disableButtons();
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
        if (pin.length === 15) {
            me.enableButtons();
        }
        /* disable getting description function due to change in TAS
        if (pin.length === 15) {
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
        */

        //  me.changePromoCodeButton();
    },

    checkAirTimePinAction: function (textbox, event) {
        var me = this;
        var airtimePin1 = me.down('#airtimePin1').getValue();
        var airtimePin2 = me.down('#airtimePin2').getValue();
        var airtimePin3 = me.down('#airtimePin3').getValue();
        var airtimePin4 = me.down('#airtimePin4').getValue();
        var airtimePin5 = me.down('#airtimePin5').getValue();

        if (airtimePin1.length < 15 &&
            airtimePin2.length < 15 &&
            airtimePin3.length < 15 &&
            airtimePin4.length < 15 &&
            airtimePin5.length < 15) {
            me.disableButtons();
        }
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

    /*
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
    */
    doTransaction: function (type) {
        var me = this;
        me.mask('Please wait..');
        me.down('#transactionSummary').update('');
        var airtimePin1 = me.down('#airtimePin1').getValue();
        var airtimePin2 = me.down('#airtimePin2').getValue();
        var airtimePin3 = me.down('#airtimePin3').getValue();
        var airtimePin4 = me.down('#airtimePin4').getValue();
        var airtimePin5 = me.down('#airtimePin5').getValue();
        var promoCode = me.down('#promoCode').getValue(); // TODO need to pass this as well to resource
        var method = 'PATCH';
        var pins = [];
        if (airtimePin1.trim() != '') pins.push(airtimePin1);
        if (airtimePin2.trim() != '') pins.push(airtimePin2);
        if (airtimePin3.trim() != '') pins.push(airtimePin3);
        if (airtimePin4.trim() != '') pins.push(airtimePin4);
        if (airtimePin5.trim() != '') pins.push(airtimePin5);

        var params = {
            pins: pins,
            promoCode : promoCode.trim()
        };

        var resource = 'Tas/PINs';

        /*
        if (type === 'addToReserve') {

            method = 'PATCH';
        }
        */

        adam.callService(resource, method, JSON.stringify(params)).then(function (response) {
            me.down('#airtimePin1').setValue('');
            me.down('#airtimePin2').setValue('');
            me.down('#airtimePin3').setValue('');
            me.down('#airtimePin4').setValue('');
            me.down('#airtimePin5').setValue('');
            me.down('#promoCode').setValue('');
			      me.disableButtons();
            me.down('#transactionSummaryPanel').setTitle('TRANSACTION SUMMARY');
            var i = response.indexOf('<div class=\"x1a\"');
            if (i >= 0) {
                response = response.substring(i);
            }
            var el = document.createElement('html');
            el.innerHTML = response;
            var labels = el.getElementsByTagName('label');
            var ratePlan = "Airtime Plan ";
            for (i = 0; i < labels.length; i++) {
                if (labels[i].innerHTML.toLowerCase().indexOf('service end date') >= 0) {
                    if (Ext.getCmp('serviceEndDate')) {
                        Ext.getCmp('serviceEndDate').setValue(labels[i].parentNode.parentNode.children[1].innerHTML);
                    }
                }
                else if (labels[i].innerHTML.toLowerCase().indexOf('rate plan') >= 0) {
                    ratePlan = labels[i].parentNode.parentNode.children[1].innerHTML;
                    ratePlan =+ " ";
                }
            }

            me.down('#transactionSummary').update(response);
            adam.addAutoNotes(ratePlan + ADD_AIRTIME_TAG);
            me.unmask();
            var esn = managers['pushData'].deviceProfile.esn;
            adam.callWsService('call/auditAddPin/' + esn, 'GET', {}).then(function (response) {

            }).catch(function () {

            });
        }).catch(function (response) {
            try {
                var jsonResponse = JSON.parse(response.response.responseText);
                if (jsonResponse && jsonResponse.message) {
                    Ext.Msg.alert('ERROR', 'Sorry, adding pin failed. ' + jsonResponse.message + ' Please try again.');
                }
                else {
                    Ext.Msg.alert('ERROR', 'Sorry, adding pin failed. Please try again.');
                }
            }
            catch(e) {
                Ext.Msg.alert('ERROR', 'Sorry, adding pin failed. Please try again.');
            }
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
                autoScroll: true,
                border: false,
                items: [
                    {
                        xtype: 'panel',
                        columnWidth: 0.4,
                        border: false,
                        bodyStyle: 'padding:5 5 5 5',
                        title: "ADD AIRTIME PIN",
                        items: [{
                            xtype: 'panel',
                            border: false,
                            layout: {
                                type: 'vbox',
                                padding: '2',
                                align: 'stretchmax'
                            },
                            items: [{
                                xtype: 'panel',
                                border: false,
                                columnWidth: 0.8,
                                items:[
                                    {
                                        xtype: "textfield",
                                        fieldLabel: "Airtime Pin",
                                        name: "airtimePin1",
                                        itemId: 'airtimePin1',
                                        enforceMaxLength: true,
                                        maskRe: /[0-9.]/,
                                        maxLength: 15,
                                        height: 20,
                                        enableKeyEvents: true,
                                        listeners: {
                                            keyup: function (textbox, event) {
                                                me.airTimePinAction(textbox, event)
                                            },
                                            keydown: function (textbox, event){
                                                me.checkAirTimePinAction(textbox, event)
                                            },
                                            mouseup: function (textbox, event) {
                                                me.airTimePinAction(textbox, event)
                                            },
                                            mousedown: function (textbox, event){
                                                me.checkAirTimePinAction(textbox, event)
                                            }
                                        },
                                        scope: this
                                    },
                                    {
                                        xtype: "textfield",
                                        fieldLabel: "Airtime Pin",
                                        name: "airtimePin2",
                                        itemId: 'airtimePin2',
                                        enforceMaxLength: true,
                                        maskRe: /[0-9.]/,
                                        maxLength: 15,
                                        height: 20,
                                        enableKeyEvents: true,
                                        listeners: {
                                            keyup: function (textbox, event) {
                                                me.airTimePinAction(textbox, event)
                                            },
                                            keydown: function (textbox, event){
                                                me.checkAirTimePinAction(textbox, event)
                                            },
                                            mouseup: function (textbox, event) {
                                                me.airTimePinAction(textbox, event)
                                            },
                                            mousedown: function (textbox, event){
                                                me.checkAirTimePinAction(textbox, event)
                                            }
                                        },
                                        scope: this
                                    },
                                    {
                                        xtype: "textfield",
                                        fieldLabel: "Airtime Pin",
                                        name: "airtimePin3",
                                        itemId: 'airtimePin3',
                                        enforceMaxLength: true,
                                        maskRe: /[0-9.]/,
                                        maxLength: 15,
                                        height: 20,
                                        enableKeyEvents: true,
                                        listeners: {
                                            keyup: function (textbox, event) {
                                                me.airTimePinAction(textbox, event)
                                            },
                                            keydown: function (textbox, event){
                                                me.checkAirTimePinAction(textbox, event)
                                            },
                                            mouseup: function (textbox, event) {
                                                me.airTimePinAction(textbox, event)
                                            },
                                            mousedown: function (textbox, event){
                                                me.checkAirTimePinAction(textbox, event)
                                            }
                                        },
                                        scope: this
                                    },
                                    {
                                        xtype: "textfield",
                                        fieldLabel: "Airtime Pin",
                                        name: "airtimePin4",
                                        itemId: 'airtimePin4',
                                        enforceMaxLength: true,
                                        maskRe: /[0-9.]/,
                                        maxLength: 15,
                                        height: 20,
                                        enableKeyEvents: true,
                                        listeners: {
                                            keyup: function (textbox, event) {
                                                me.airTimePinAction(textbox, event)
                                            },
                                            keydown: function (textbox, event){
                                                me.checkAirTimePinAction(textbox, event)
                                            },
                                            mouseup: function (textbox, event) {
                                                me.airTimePinAction(textbox, event)
                                            },
                                            mousedown: function (textbox, event){
                                                me.checkAirTimePinAction(textbox, event)
                                            }
                                        },
                                        scope: this
                                    },
                                    {
                                        xtype: "textfield",
                                        fieldLabel: "Airtime Pin",
                                        name: "airtimePin5",
                                        itemId: 'airtimePin5',
                                        enforceMaxLength: true,
                                        maskRe: /[0-9.]/,
                                        maxLength: 15,
                                        height: 20,
                                        enableKeyEvents: true,
                                        listeners: {
                                            keyup: function (textbox, event) {
                                                me.airTimePinAction(textbox, event)
                                            },
                                            keydown: function (textbox, event){
                                                me.checkAirTimePinAction(textbox, event)
                                            },
                                            mouseup: function (textbox, event) {
                                                me.airTimePinAction(textbox, event)
                                            },
                                            mousedown: function (textbox, event){
                                                me.checkAirTimePinAction(textbox, event)
                                            }
                                        },
                                        scope: this
                                    }
                                ]},
                                {
                                    xtype: 'panel',
                                    border: false,
                                    columnWidth: 0.2,
                                    items:[
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
                                }
                            ]
                        },
                            {
                                xtype: 'panel',
                                border: false,
                                //margin: '5 5 5 10',
                                items: [{
                                    xtype: "displayfield",
                                    itemId: "addAirtimeResponse",
                                    value: ""
                                }]
                            },

                            {
                                xtype: 'panel',
                                border: false,
                                layout: {
                                    type: 'hbox',
                                    //padding: '5',
                                    align: 'stretchmax'

                                },
                                items: [
                                    {
                                        xtype: "textfield",
                                        fieldLabel: "Promo Code",
                                        itemId: 'promoCode',
                                        name: "textvalue"
                                        /*enableKeyEvents: true,
                                        listeners: {
                                            keyup: {
                                                fn: me.changePromoCodeButton,
                                                scope: me
                                            }
                                        }
										*/
                                    }
                                    /*
                                    , {
                                        xtype: 'button',
                                        margin: "0 0 0 10",
                                        text: 'Validate',
                                        itemId: 'validateBtn',
                                        disabled: true,
                                        handler: me.validatePromo,
                                        scope: me
                                    }
                                    */
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
                        columnWidth: 0.6,
                        height: 290,
                        title: '',
                        itemId: 'transactionSummaryPanel',
                        border: false,
						            autoScroll: true,
						            layout: 'fit',
                        //bodyStyle: 'padding:5px 0px 5px 5px',
                        items: [{
                            xtype: 'component',
							              cls: 'airtimePinResponseCls',
                            itemId: 'transactionSummary',
                            html: ''
                        }]
                    }
                ]
            }
        ]
    }
})