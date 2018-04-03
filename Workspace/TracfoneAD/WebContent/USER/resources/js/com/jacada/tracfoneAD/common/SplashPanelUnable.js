Ext.define('Jacada.user.com.jacada.tracfoneAD.common.SplashPanelUnable', {
    extend: 'Jacada.user.com.jacada.tracfoneAD.baseComponents.BaseView',
    xtype: 'panel',
    border: true,
    height: 310,
    config:{
      module: 'unableUnable'
    },
    /*
    html:'<div align="center" style="background-color:white;width: 200px;opacity: .3;" ><img src="/USER/resources/images/unable--bw.png">' +
    'Use troubleshooter to help \\A the customer get services working</div>',
    */
    html:'',
    initComponent: function () {
        var me = this;
        Ext.applyIf(me, {
            name: 'splashPanel'
        });
        me.callParent(arguments);    }
});