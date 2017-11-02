Ext.define('Jacada.user.com.jacada.tracfoneAD.customerSearch.CustomerSearch', {
    extend: 'Ext.panel.Panel',

    //title: 'SecurityQuestions'
    // {
    //xtype:"form",
    title: "SEARCH CUSTOMER",
    bodyStyle: 'padding:5px 5px 0',
    items: [{
        xtype: "textfield",
        fieldLabel: "ESN Serial Number",
        name: "textvalue"
    }, {
        xtype: "textfield",
        fieldLabel: "SIM",
        name: "textvalue"
    }, {
        xtype: "textfield",
        fieldLabel: "MIN",
        name: "textvalue"
    }, {
        xtype: "textfield",
        fieldLabel: "Contact Number",
        name: "textvalue"
    }, {
        xtype: "textfield",
        fieldLabel: "Last Name",
        name: "textvalue"
    }, {
        xtype: "textfield",
        fieldLabel: "First Name",
        name: "textvalue"
    }]


});
