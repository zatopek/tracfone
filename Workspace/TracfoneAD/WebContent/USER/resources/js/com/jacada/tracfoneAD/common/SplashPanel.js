Ext.define('Jacada.user.com.jacada.tracfoneAD.common.SplashPanel', {
    extend: 'Jacada.user.com.jacada.tracfoneAD.baseComponents.BaseView',
    xtype: 'panel',
    border: true,
    config:{
      module: 'redemption'
    },
    initComponent: function () {
        var me = this;
        Ext.applyIf(me, {
            name: 'splashPanel',
            cls: ['splashPanelCls', me.getModule()]
        });
        me.callParent(arguments);
    }
});
