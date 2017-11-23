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
    title: 'Manage System Credentials',
    //layout : 'fit',

    initComponent: function () {
        var me = this;
        Ext.applyIf(me, {
            items: ssoForm,
            buttons: [{
                text: 'Reset',
                handler: function () {
                    ssoForm.getForm().reset();
                }
            }, {
                text: 'Submit',
                disabled: true
            }, {
                text: 'Close',
                handler: function () {
                    me.hide();
                }
            }]

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
                cls: 'sso_form'

            }, {

                xtype: "textfield",
                fieldLabel: "",
                name: "VerizonCIS_Id",
                cls: 'sso_form'

            }, {

                xtype: "textfield",
                fieldLabel: "",
                name: "SprintCTMS_Id",
                cls: 'sso_form'

            }, {

                xtype: "textfield",
                fieldLabel: "",
                name: "TMobileWCSM_Id",
                cls: 'sso_form'

            }, {

                xtype: "textfield",
                fieldLabel: "",
                name: "VerizonRSSX_Id",
                cls: 'sso_form'

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
                inputType: 'password',
                cls: 'sso_form'

            }, {

                xtype: "textfield",
                fieldLabel: "",
                name: "VerizonCIS_Pass",
                inputType: 'password',
                cls: 'sso_form'

            }, {

                xtype: "textfield",
                fieldLabel: "",
                name: "SprintCTMS_Pass",
                inputType: 'password',
                cls: 'sso_form'

            }, {

                xtype: "textfield",
                fieldLabel: "",
                name: "TMobileWCSM_Pass",
                inputType: 'password',
                cls: 'sso_form'

            }, {

                xtype: "textfield",
                fieldLabel: "",
                name: "VerizonRSSX_Pass",
                inputType: 'password',
                cls: 'sso_form'

            }]
        }]

});
