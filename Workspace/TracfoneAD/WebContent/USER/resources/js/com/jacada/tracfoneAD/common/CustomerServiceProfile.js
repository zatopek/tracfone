Ext.define('Jacada.user.com.jacada.tracfoneAD.common.CustomerServiceProfile', {
    extend: 'Jacada.user.com.jacada.tracfoneAD.baseComponents.BaseView',
    xtype: 'customerServiceProfile',
	id: 'customerServiceProfile',
    layout: 'column',
    /*
    defaults: {
        margin: '3 10 0 5' //top right bottom left (clockwise) margins of each item/column
        //height: 200
    },
    */
    tools:[{
        type:'search',
        tooltip: 'Search customer',
        handler: function(event, toolEl, panel){
            searchWin.show();
        }
    }],

    load: function (data) {
        var me = this;
        var loader = function (component, componentData) {
            var fields = component.query('displayfield');
            Ext.each(fields, function (field) {
                field.setValue(componentData[field.name]);
            })
        }

        Ext.each(me.items.items, function (item) {
            loader(item, data[item.name])
        })


        Ext.getCmp('recentTicketsBtn').hide();
        Ext.getCmp('activeFlashesBtn').hide();
        if(esn && typeof esn != 'undefined') {
            //get recent tickets
            var esn = managers['pushData'].deviceProfile.esn;
            adam.callWsService('call/getOpenedTickets/' + esn, 'GET', {}).then(function (response) {
                managers['recentTickets'] = response;
                if (response && response.length > 0) {
                    Ext.getCmp('recentTicketsBtn').show();
                } else {
                    Ext.getCmp('recentTicketsBtn').hide();
                }
            }).catch(function () {
            });

            //get active flashes
            adam.callWsService('call/getActiveFlashes/' + esn, 'GET', {}).then(function (response) {
                managers['activeFlashes'] = response;
                if (response && response.length > 0) {
                    Ext.getCmp('activeFlashesBtn').show();
                } else {
                    Ext.getCmp('activeFlashesBtn').hide();
                }
            }).catch(function () {
            });
        }


    },
    loadAccountBalances: function (data) {
        var me = this;
        var loader = function (component, componentData) {
            var fields = component.query('displayfield');
            Ext.each(fields, function (field) {
                field.setValue(componentData[field.name]);
            })
        }

        Ext.each(me.items.items, function (item) {
            if (item.name == 'accountBalances'){
                loader(item, data[item.name])
            }
        })
    },

    reset: function () {
        var me = this;
        Ext.each(me.query('displayfield'), function (field) {
            field.setValue('');
        });
        Ext.getCmp('recentTicketsBtn').hide();
        Ext.getCmp('activeFlashesBtn').hide();
        managers['recentTickets'] = '';
        managers['activeFlashes'] = '';
    },

    checkStatus: function (value) {
        if (value && value.toLowerCase().indexOf('inactive') >= 0) {
            value = '<span style="color:#c65e02">' + value + '</span>';
        }
        return value;
    },
    checkBalance: function (value) {
        if (value && parseInt(value) <= 0) {
            value = '<span style="color:#c65e02">' + value + '</span>';
        }
        return value;
    },
    checkBalanceSmsBalance: function (value) {
        /*
        if (value && parseInt(value) <= 0) {
            value = '<span style="color:#f00">' + value + ' Units</span>';
        }
        */
        if (value && parseInt(value) > 0) {
            value = value + ' Units';
        }
        return value;
    },
    checkBalanceVoiceBalance: function (value) {
        /*
        if (value && parseInt(value) <= 0) {
            value = '<span style="color:#f00">' + value + ' Mins</span>';
        }
        */
        if (value && parseInt(value) > 0) {
            value = value + ' Mins';
        }
        return value;
    },
    checkBalanceDataBalance: function (value) {
        /*
        if (value && parseInt(value) <= 0) {
            value = '<span style="color:#f00">' + value + ' MB</span>';
        }
        */
        if (value && parseInt(value) > 0) {
            value = value + ' MB';
        }
        return value;
    },
    checkExpired: function (value) {
        if (value && (new Date().getTime() > new Date(value).getTime())) {
            value = '<span style="color:#c65e02">' + value + '</span>'
        }
        return value;
    },
    recentTickets: function () {
        managers['windowsManager'].show('recentTicketWindow');
    },
    activeFlashes: function () {
        managers['windowsManager'].show('activeFlashesWindow');
    },
    initComponent: function () {
        var me = this;
        Ext.applyIf(me, {
            name: 'customerServiceProfile',
            cls: 'customerServiceProfileCls',
            items: [
                {
                    columnWidth: 0.28,
                    border: true,
                    xtype: 'fieldset',
                    title: 'DEVICE PROFILE',
                    name: 'deviceProfile', // match with pushData property name {"accountBalances":{},"customerProfile":{},"deviceProfile":{},"serviceProfile":{}}
                    items: [
                        {
                            xtype: 'panel',
                            layout: 'column',
                            border: false,
                            items: [
                                {
                                    columnWidth: 0.5,
                                    defaultType: 'displayfield',
                                    border: false,
                                    items: [
                                        {
                                            fieldLabel: 'Serial #',
                                            name: 'serial',
                                            fieldStyle: 'color: #c65e02'
                                        }, {
                                            fieldLabel: 'SIM',
                                            name: 'sim'
                                        }, {
                                            fieldLabel: 'SIM Status',
                                            name: 'simStatus',
                                            valueToRaw: me.checkStatus
                                        }, {
                                            fieldLabel: 'MIN',
                                            name: 'min'
                                        }, {
                                            fieldLabel: 'MIN Status',
                                            name: 'minStatus',
                                            valueToRaw: me.checkStatus
                                        }, {
                                            fieldLabel: 'MSID',
                                            name: 'msid'
                                        }, {
                                            fieldLabel: 'Phone Gen',
                                            name: 'phoneGen'
                                        }
                                    ]
                                },
                                {
                                    columnWidth: 0.5,
                                    defaultType: 'displayfield',
                                    border: false,
                                    items: [
                                        {
                                            fieldLabel: 'Device Type',
                                            name: 'deviceType'
                                        }, {
                                            fieldLabel: 'Hex Serial #',
                                            name: 'hexSerial'
                                        }, {
                                            fieldLabel: 'Part Number',
                                            name: 'partNumber'
                                        }, {
                                            fieldLabel: 'Leased to Finance',
                                            name: 'leasedToFinance'
                                        }, {
                                            fieldLabel: 'Lease Status',
                                            name: 'leaseStatus'
                                        }, {
                                            fieldLabel: 'Sequence',
                                            name: 'sequence'
                                        }, {
                                            fieldLabel: 'Handset Protection',
                                            name: 'handsetProtection'
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    columnWidth: 0.33,
                    border: true,
                    xtype: 'fieldset',
                    title: 'SERVICE PROFILE',
                    name: 'serviceProfile',
                    items: [
                        {
                            xtype: 'panel',
                            layout: 'column',
                            border: false,
                            items: [
                                {
                                    columnWidth: 0.5,
                                    border: false,
                                    defaultType: 'displayfield',
                                    items: [
                                        {
                                            fieldLabel: 'Service Type',
                                            name: 'serviceType'
                                        }, {
                                            fieldLabel: 'Rate Plan',
                                            name: 'ratePlan'
                                        }, {
                                            fieldLabel: 'Service Plan Objid',
                                            name: 'servicePlanObjId'
                                        }, {
                                            fieldLabel: 'Carrier',
                                            name: 'carrier'
                                        }, , {
                                            fieldLabel: 'Technology',
                                            name: 'technology',
                                            fieldStyle: 'color: #c65e02'
                                        }, {
                                            fieldLabel: 'Activation Date',
                                            name: 'activationDate'
                                        }, {
                                            fieldLabel: 'Deact Date',
                                            name: 'deactDate'
                                        }, {
                                            fieldLabel: 'Service End Date',
                                            name: 'serviceEndDate',
                                            id: 'serviceEndDate',
                                            valueToRaw: me.checkExpired
                                        }, {
                                            fieldLabel: 'Next Charge Date',
                                            name: 'nextChargeDate'
                                        }
                                    ]
                                },
                                {
                                    columnWidth: 0.5,
                                    border: false,
                                    defaultType: 'displayfield',
                                    items: [
                                        {
                                            fieldLabel: 'Brand',
                                            name: 'brand'
                                        }, {
                                            fieldLabel: 'Dealer',
                                            name: 'dealer'
                                        }, {
                                            fieldLabel: 'Cards in Reserve',
                                            name: 'cardsInReserve',
                                            //valueToRaw: me.checkBalance,
                                            fieldStyle: 'color: green'
                                        }, {
                                            fieldLabel: 'Warranty Exchanges',
                                            name: 'warrantyExchanges'
                                        }, {
                                            fieldLabel: 'Basic Warranty Found',
                                            name: 'basicWarrantyFound'
                                        }, {
                                            fieldLabel: 'Extended Warranty',
                                            name: 'extendedWarranty'
                                        }, {
                                            fieldLabel: 'Current Throttle Status',
                                            name: 'currentThrottleStatus'
                                        }, {
                                            fieldLabel: 'Auto Refill',
                                            name: 'autoRefill'
                                        }, {
                                            fieldLabel: 'Next Refill Date',
                                            name: 'nextRefillDate'
                                        }
                                    ]
                                }
                            ]
                        }
                    ]

                }
                , {
                    columnWidth: 0.22,
                    border: true,
                    xtype: 'fieldset',
                    title: 'CUSTOMER PROFILE',
                    name: 'customerProfile',
                    defaultType: 'displayfield',
                    items: [
                        {
                            fieldLabel: 'Customer Id',
                            name: 'customerId'
                        }, {
                            fieldLabel: 'Contact Name',
                            name: 'contactName'
                        }, {
                            fieldLabel: 'Email',
                            name: 'email'
                        }, {
                            fieldLabel: 'Group ID',
                            name: 'groupId'
                        }, {
                            fieldLabel: 'Zip',
                            name: 'zip'
                        }, {
                            fieldLabel: 'LID',
                            name: 'lid'
                        }, {
                            fieldLabel: 'LifeLine Status',
                            name: 'lifeLineStatus'
                        },{
                            fieldLabel: 'Program Name',
                            name: 'programName'
                        },
                        /*{
                            fieldLabel: 'Case ID',
                            name: 'caseId'
                        }, */
                        {
                            xtype: 'button',
                            text: 'Flash',
                            name: 'activeFlashesBtn',
                            itemId: 'activeFlashesBtn',
                            hidden: true,
                            id: 'activeFlashesBtn',
                            handler: me.activeFlashes,
                            scope: me
                        }
                    ]

                }, {
                    columnWidth: 0.17,
                    border: true,
                    xtype: 'fieldset',
                    title: 'ACCOUNT BALANCES',
                    name: 'accountBalances',
                    defaultType: 'displayfield',
                    items: [
                        {
                            fieldLabel: 'Phone Status',
                            name: 'phoneStatus'
                        }, {
                            fieldLabel: 'Voice Balance',
                            name: 'voiceBalance',
                            value: '',
                            valueToRaw: me.checkBalanceVoiceBalance,
                            fieldStyle: 'color: #c65e02'
                        }, {
                            fieldLabel: 'SMS Balance',
                            name: 'smsBalance',
                            value: '',
                            valueToRaw: me.checkBalanceSmsBalance,
                            fieldStyle: 'color: #c65e02'
                        }, {
                            fieldLabel: 'Data Balance',
                            name: 'dataBalance',
                            value: '',
                            valueToRaw: me.checkBalanceDataBalance,
                            fieldStyle: 'color: #c65e02'
                        }, {
                            xtype: 'button',
                            text: 'Recent Tickets',
                            name: 'recentTicketBtn',
                            itemId: 'recentTicketBtn',
                            hidden: true,
                            id: 'recentTicketsBtn',
                            handler: me.recentTickets,
                            scope: me
                        }
                    ]
                }
            ]
        });
        me.callParent(arguments);
    }
})

function searchByEsn()
{
    var searchText = Ext.getCmp('serialNumberField').value;
    if(searchText.trim().length == 0){
        Ext.MessageBox.alert('ERROR', 'Please enter a serial number to start the search. Please try again.');
        return;
    }
    /// TODO put an ajax code to get the search result
    searchWin.close();
    widgets['customerServiceProfile'].up().mask('Please wait...');
    var success = false;
    adam.callWsService('call/customerSearch/' + $W().agentName + '?esn=' + searchText.trim(), 'GET', {}).then(function (response) {
        success = true;
        var url = managers['pushData'].tasInfo.url;
        var taskId = managers['pushData'].callInfo.taskId;
        var callId = managers['pushData'].callInfo.callId;
        //pass call id and task id to new customer
        response.callInfo.taskId = taskId;
        response.callInfo.callId = callId;
        var start = url.indexOf('&esn=');
        var end = url.indexOf('&', start + 5);
        var newUrl = url.substring(0, start) + '&esn=' + searchText + url.substring(end) + '&skipWSNotification=true';
        response.tasInfo.url = newUrl;
        //load customer profile
        onCustomerServiceProfile(response);
        widgets['customerServiceProfile'].up().unmask();
        //load TAS with esn
        adam.callService('Tas/IncomingCall?url=' + encodeURIComponent(newUrl), 'GET').then(function (response) {

        }).catch(function (error) {

        });

    }).catch(function (response) {
        if(!success){
            Ext.MessageBox.alert('ERROR', 'Unable to search customer with serial number ' + searchText.trim() + '. Please try again.');
        }
        widgets['customerServiceProfile'].up().unmask();
    });

    Ext.getCmp('serialNumberField').setValue('');
}

var searchWin =  new Ext.Window ({
    title:'Search Customer',
    width:300,
    padding: '10 10 10 10',
    closeAction:'close',
    modal: true,

    items: [{
        xtype : 'textfield',
        fieldLabel: 'Serial #',
        name: 'serialNumber',
        id: 'serialNumberField',
        enforceMaxLength:true,  //Restrict typing past maxLength: n
        maxLength: 20,           //Set max length validation
        maskRe:/[0-9]/,
        listeners:{
            scope:this,
            specialkey: function(f,e){
                if(e.getKey()==e.ENTER){
                    searchByEsn();
                }
            }
        }
    }],

    buttons: [{
        text: 'Search',
        id: 'SearchEsnBtn',
        handler: function(){
            searchByEsn();
        }
    },{
        text: 'Cancel',
        handler: function(){
            Ext.getCmp('serialNumberField').setValue('');
            searchWin.close();
        }
    }],
    buttonAlign: 'center'
});
