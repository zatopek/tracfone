Ext.define('Jacada.user.com.jacada.tracfoneAD.baseComponents.BaseView', {
    extend: 'Ext.Component',
    xtype: 'baseView',
    listeners: {
        afterlayout: {
            fn: function () {
                if (adam && adam.register) {
                    adam.register(this.xtype, this);
                } else {
                    //Failed to register with ADAM
                    if (!$W().WaitingForAdam)
                        $W().WaitingForAdam = [];

                    $W().WaitingForAdam.push({
                        key: this.xtype,
                        widget: this
                    });
                }
            },
            single: true
        }
    },

    initComponent: function (initConfig) {
        var config = initConfig || {};
        if (config.name) {
            this.on({
                afterlayout: {
                    fn: function () {
                        if (adam && adam.register) {
                            adam.register(config.name, this);
                        } else {
                            //Failed to register with ADAM
                            if (!$W().WaitingForAdam)
                                $W().WaitingForAdam = [];

                            $W().WaitingForAdam.push({
                                key: config.name,
                                widget: this
                            });
                        }
                    },
                    single: true
                }
            });
        }
        this.callParent(initConfig);
    },

    load: function () { },

    startCall: function () { },

    endCall: function () { },

    endDisposition: function () { },

    reset: function () { }
});
