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
            //custom: window.location.origin + $W().contextPath + '/rest/call/incomingCall'
            custom: $W().wsSessionId
        };
        logins.push(extraparam);
        var param = JSON.stringify(logins).replace(/\\/g, "").replace(/\"\[/, "[").replace(/\]\"/, "]").replace(/system/g, "app");
        adam.callService(resource, 'POST', param).then(function (response) {
            if (!$W().startTas) {
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
                    //var systems = ['TAS', 'VerizonCIS', 'SprintCTMS', 'TMobileWCSM', 'VerizonRSSX'];
                    var systems = managers['ssoSystems'];
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
                        params: {logins: JSON.stringify(me.logins)},
                        scope: this,
                        success: function (response) {
                            // Received response from the server
                            me.sendCredentialstoJIA(me.logins);
                            success = Ext.decode(response.responseText).status;
                            status = Ext.decode(response.responseText).status;
                            msg = Ext.decode(response.responseText).message;
                            if (success) {
                                debugger;
                                managers['logins'] = me.logins;
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

        var pwApps = adam.getVariable('pwApps');
        pwApps.forEach(function(currentValue, index, arr){
            var ssoSystem = adam.getSsoSystem(currentValue);
            addSystem(ssoSystem, currentValue);
            ssoSystems.push(ssoSystem);
        })
        managers['ssoSystems'] = ssoSystems;
        me.callParent(arguments);
    },
    reset: function () {

    },

    load: function () {
        debugger;
        try {
            var ssoForm = Ext.getCmp('ssoForm');
            if (ssoForm) {
                Ext.each(ssoForm.items.items, function (item) {
                    if (item.id.indexOf('button') == 0) {
                        item.setTooltip('Show password');
                        item.setIconCls('fa fa-eye');
                        item.prev().getEl().query('input', false)[0].type = 'password';
                    }
                })
            }
        }
        catch (e) {
        }
    }
});
var ssoSystems = [];

var viewSsoPasswordTime = new Date().getTime();

var viewSsoPassword = function (button) {
    if (button.iconCls === 'fa fa-eye') {
        if(button.prev().getEl().query('input', false)[0].value.trim()!='') {
            var now = new Date().getTime();
            if (now - viewSsoPasswordTime > 60000) {
                var msgbox = Ext.Msg.prompt(
                    "View Password",
                    "Please enter your Cockpit login password",
                    function (btn, inputValue) {
                        if (btn == "ok") {
                            if (inputValue.trim().length > 0) {
                                Ext.Ajax.request({
                                    url: $W().contextPath + '/rest/sso/verifyPassword',
                                    method: 'POST',
                                    contentType: 'application/json',
                                    params: {password: inputValue},
                                    scope: this,
                                    success: function (response) {
                                        var success = Ext.decode(response.responseText).success;
                                        if(success) {
                                            viewSsoPasswordTime = new Date().getTime();
                                            button.setTooltip('Hide password');
                                            button.setIconCls('fa fa-eye-slash');
                                            button.prev().getEl().query('input', false)[0].type = 'text';
                                        } else {
                                            Ext.MessageBox.alert('ERROR', 'Invalid Password.');
                                        }
                                    },
                                    failure: function (response) {
                                        Ext.MessageBox.alert('ERROR', 'Invalid Password.');
                                    }
                                });
                            }
                            else {
                                Ext.MessageBox.alert('ERROR', 'Invalid Password.');
                            }
                        }
                    }
                );
                msgbox.textField.inputEl.dom.type = 'password';

            } else {
                var isShowPassword = button.iconCls === 'fa fa-eye';
                button.setTooltip(isShowPassword ? 'Hide password' : 'Show password');
                button.setIconCls(isShowPassword ? 'fa fa-eye-slash' : 'fa fa-eye');
                button.prev().getEl().query('input', false)[0].type = isShowPassword ? 'text' : 'password';
            }
        }

    } else {
        button.setTooltip('Show password');
        button.setIconCls('fa fa-eye');
        button.prev().getEl().query('input', false)[0].type = 'password';
    }
};

var addSystem = function (system, systemDisp){
    ssoForm.add([
        {
            xtype: "displayfield",
            value: systemDisp
        }, {

            xtype: "textfield",
            fieldLabel: "",
            name: system + "_Id",
            id: system + "_Id",
            cls: 'sso_form',
            //tabIndex: 1

        }, {
            xtype: "textfield",
            fieldLabel: "",
            name: system + "_Pass",
            id: system + "_Pass",
            inputType: 'password',
            cls: 'sso_form',
            //tabIndex: 2

        }, {
            xtype: 'button',
            iconCls: 'fa fa-eye',
            tooltip: 'Show password',
            handler: function (button) {
                viewSsoPassword(button);
            }
        }
    ]);
}


var ssoForm = new Ext.FormPanel({
    id: 'ssoForm',
    autoScroll: true,
    layout: {
        type: 'table',
        columns: 4,
        tableAttrs: {
            style: {
                //width: '100%' // To make the cell width 100%
                padding: '1px'
            }
        }
    },
    defaults: {
        bodyStyle: "padding:2px;",
        style: "margin-left:2px;"
    },
    items: [{
        xtype: "displayfield",
        value: "APPLICATION",
        width: "120px"
    }, {
        xtype: "displayfield",
        value: "User ID",
        width: "120px"

    }, {
        xtype: "displayfield",
        value: "Password",
        width: "120px"
    }, {
        //html: "",
        width: "25px"
    }
    ]
});

