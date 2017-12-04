Ext.define('Jacada.user.com.jacada.tracfoneAD.baseComponents.BaseView', {
    extend: 'Ext.panel.Panel',
    xtype: 'baseView',
    initComponent: function () {
        if (this.name) {
            this.on({
                afterlayout: {
                    fn: function () {
                        if (adam && adam.register) {
                            adam.register(this.name, this);
                        } else {
                            //Failed to register with ADAM
                            if (!$W().WaitingForAdam)
                                $W().WaitingForAdam = [];

                            $W().WaitingForAdam.push({
                                key: this.name,
                                widget: this
                            });
                        }
                    },
                    single: true,
                    scope: this
                }
            });
        }
        this.callParent(arguments);
    },

    getWidgetName: function (className) {
        return className.charAt(0).toLowerCase() + className.slice(1);
    },

    load: function () { },

    startCall: function () { },

    endCall: function () { },

    endDisposition: function () { },

    reset: function () { }
});
