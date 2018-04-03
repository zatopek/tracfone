Ext.define('Jacada.user.com.jacada.tracfoneAD.common.SplashPanelRedemption', {
    extend: 'Jacada.user.com.jacada.tracfoneAD.baseComponents.BaseView',
    xtype: 'panel',
    height: 310,
    config:{
      module: 'redemption'
    },
    /*
    html:'<div align="center" style="background-color:white;width:200px;opacity:.3;">' +
    '<img src="' +  window.location.origin + $W().contextPath + '/USER/resources/images/add-pin--bw.png' + '" ' +
    'style="background-size: contain;\n' +
    '\tposition: absolute;\n' +
    '\ttop: 40%;\n' +
    '\tleft: 50%;\n' +
    '\twidth: 200px;\n' +
    '\theight: 130px;\n' +
    '\t-webkit-transform: translate3D(-100px, -65px, 0);\n' +
    '\t        transform: translate3D(-100px, -65px, 0);\n' +
    '\topacity: .3;">' +
    'ADD A PIN or PURCHASE A PIN</div>',
    */
    html:'',
    initComponent: function () {
        var me = this;
        Ext.applyIf(me, {
            name: 'splashPanelRedemption'
        });
        me.callParent(arguments);
    }
});