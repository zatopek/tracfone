Ext.define('Jacada.user.com.jacada.tracfoneAD.sSO.SSO', {
    extend: 'Ext.window.Window',
    id: 'ssoWindow',
    height: 285,
    width: 450,
    resizable: false,
    header: true,
    border: true,
    shadow: false,
    modal: true,
    title: 'MANAGE SYSTEM CREDENTIALS',
    closeAction: 'hide',
    layout: 'fit',
    autoScroll: true,
    sendCredentialstoJIA: function (logins) {
        var resource = 'Credentials';
        var extraparam = {
            app: 'workspace',
            username: $W().agentName,
            password: '',
            custom: window.location.origin + $W().contextPath + '/rest/call/incomingCall'
        }
        logins.push(extraparam);
        var param = JSON.stringify(logins).replace(/\\/g, "").replace(/\"\[/, "[").replace(/\]\"/, "]").replace(/system/g , "app");
        adam.callService(resource, 'POST', param).then(function (response) {
            if(!$W().startTas){
                //call JIA API incomingCall
                adam.callService('Tas/IncomingCall?url=' + encodeURIComponent($W().tasUrl), 'GET').then(function (response) {
                    $W().startTas = true;
                }).catch(function (error) {
                });
            }
        }).catch(function (error) {
        });
    },
    initComponent: function () {
        var me = this;
        Ext.applyIf(me, {
            items: ssoForm,
            cls: 'ssoFormCls',
            buttons: [{
                text: 'Reset',
                tabIndex: 11,
                handler: function () {
                    ssoForm.getForm().reset();
                }
            }, {
                text: 'Submit',
                tabIndex: 12,
                //disabled: true
                handler: function () {
                    me.logins = [];
                    var systems = ['TAS', 'VerizonCIS', 'SprintCTMS', 'TMobileWCSM', 'VerizonRSSX'];
                    systems.forEach(function (system) {
                        var username = Ext.getCmp(system + '_Id').getValue();
                        var password = Ext.getCmp(system + '_Pass').getValue();
                        if (trim(username) != '' && trim(password) != '') {
                            var login = {
                                system: system,
                                username: username,
                                password: password
                            };
                            me.logins.push(login);
                        }
                    });

                    Ext.Ajax.request({
                        url: $W().contextPath + '/rest/sso/addAgentSsoCredentials/' + $W().agentName,
                        method: 'POST',
                        contentType: 'application/json',
                        params: { logins: JSON.stringify(me.logins) },
                        scope: this,
                        success: function (response) {
                            // Received response from the server
                            me.sendCredentialstoJIA(me.logins);
                            success = Ext.decode(response.responseText).status;
                            status = Ext.decode(response.responseText).status;
                            msg = Ext.decode(response.responseText).message;
                            if (success) {
                                Ext.Msg.show({
                                    title: 'Update Success'
                                    , msg: 'Credentials Updated.'
                                    , buttons: Ext.Msg.OK
                                    , fn: function (buttonId) {
                                        me.close();
                                    }
                                })
                            } else {
                                Ext.MessageBox.alert('Update Failed',
                                    msg);
                            }
                        },
                        failure: function (response) {
                            Ext.MessageBox.alert(response.responseText);
                        }
                    });
                }
            }, {
                text: 'Close',
                tabIndex: 13,
                handler: function () {
                    //me.close();
                    managers['windowsManager'].hide('ssoWindow');
                }
            }],
            listeners: {
                render: function () {
                    Ext.Ajax.request({
                        url: $W().contextPath + '/rest/sso/getAgentSsoCredentials/' + $W().agentName,
                        method: 'GET',
                        success: function (response) {
                            logins = Ext.decode(response.responseText).result;
                            logins.forEach(function (login) {
                                Ext.getCmp(login.system + '_Id').setValue(login.username);
                                Ext.getCmp(login.system + '_Pass').setValue(login.password);
                            })
                        },
                        failure: function (response) {
                            Ext.MessageBox.alert(response.responseText);
                        }
                    });
                }
            }
        });
        me.callParent(arguments);
    }

});

var ssoForm = new Ext.FormPanel({
    layout: 'column',
    border: false,
    defaults: {
        bodyStyle: "padding:2px;",
        style: "margin-left:1px;"
    },
    items: [{
        columnWidth: 0.3,
        xtype: 'panel',
        border: false,
        items: [{
            xtype: "displayfield",
            value: "APPLICATION"
        }, {
            xtype: "displayfield",
            value: "TAS"
        }, {
            xtype: "displayfield",
            value: "Verizon CIS"
        }, {
            xtype: "displayfield",
            value: "Sprint CTMS"
        }, {
            xtype: "displayfield",
            value: "T-Mobile WCSM"
        }, {
            xtype: "displayfield",
            value: "Verizon RSSX"
        }]
    },

    {
        columnWidth: 0.35,
        xtype: 'panel',
        border: false,

        items: [{
            xtype: "displayfield",
            value: "User ID"
        }, {

            xtype: "textfield",
            fieldLabel: "",
            name: "TAS_Id",
            id: "TAS_Id",
            cls: 'sso_form',
            tabIndex: 1

        }, {

            xtype: "textfield",
            fieldLabel: "",
            name: "VerizonCIS_Id",
            id: "VerizonCIS_Id",
            cls: 'sso_form',
            tabIndex: 3

        }, {

            xtype: "textfield",
            fieldLabel: "",
            name: "SprintCTMS_Id",
            id: "SprintCTMS_Id",
            cls: 'sso_form',
            tabIndex: 5

        }, {

            xtype: "textfield",
            fieldLabel: "",
            name: "TMobileWCSM_Id",
            id: "TMobileWCSM_Id",
            cls: 'sso_form',
            tabIndex: 7

        }, {

            xtype: "textfield",
            fieldLabel: "",
            name: "VerizonRSSX_Id",
            id: "VerizonRSSX_Id",
            cls: 'sso_form',
            tabIndex: 9

        }]

    }, {
        columnWidth: 0.35,
        xtype: 'panel',
        border: false,
        items: [{
            xtype: "displayfield",
            value: "Password"
        }, {

            xtype: "textfield",
            fieldLabel: "",
            name: "TAS_Pass",
            id: "TAS_Pass",
            inputType: 'password',
            cls: 'sso_form',
            tabIndex: 2

        }, {

            xtype: "textfield",
            fieldLabel: "",
            name: "VerizonCIS_Pass",
            id: "VerizonCIS_Pass",
            inputType: 'password',
            cls: 'sso_form',
            tabIndex: 4

        }, {

            xtype: "textfield",
            fieldLabel: "",
            name: "SprintCTMS_Pass",
            id: "SprintCTMS_Pass",
            inputType: 'password',
            cls: 'sso_form',
            tabIndex: 6

        }, {

            xtype: "textfield",
            fieldLabel: "",
            name: "TMobileWCSM_Pass",
            id: "TMobileWCSM_Pass",
            inputType: 'password',
            cls: 'sso_form',
            tabIndex: 8

        }, {

            xtype: "textfield",
            fieldLabel: "",
            name: "VerizonRSSX_Pass",
            id: "VerizonRSSX_Pass",
            inputType: 'password',
            cls: 'sso_form',
            tabIndex: 10

        }]
    }]

});