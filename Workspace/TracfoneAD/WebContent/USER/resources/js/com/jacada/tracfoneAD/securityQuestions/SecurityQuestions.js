Ext.define('Jacada.user.com.jacada.tracfoneAD.securityQuestions.SecurityQuestions', {
    extend: 'Ext.panel.Panel',

    //title: 'SecurityQuestions'
    // {
    //xtype:"form",
    title: "",
    bodyStyle: 'padding:5px 5px 0',
    items: [{
        xtype: "textfield",
        fieldLabel: "Security PIN",
        name: "textvalue"
    }, {
        xtype: "textfield",
        fieldLabel: "ESN Serial #",
        name: "textvalue"
    }, {
        xtype: "textfield",
        fieldLabel: "Activation ZIP",
        name: "textvalue"
    }, {
        xtype: "textfield",
        fieldLabel: "Last Redemption",
        name: "textvalue"
    }]
    ,

    buttons: [{
        text: 'Reset'
    }, {
        text: 'Validate'
    }]
    //}

});
