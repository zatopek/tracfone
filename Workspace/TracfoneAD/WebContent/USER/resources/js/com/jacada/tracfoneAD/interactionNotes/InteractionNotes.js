Ext.define('Jacada.user.com.jacada.tracfoneAD.interactionNotes.InteractionNotes', {
    extend: 'Jacada.user.com.jacada.tracfoneAD.baseComponents.BaseView',
    xtype: 'interactionNotes',
    title: 'CREATE INTERACTION',
    border: false,
    initComponent: function () {
        var me = this;
        Ext.applyIf(me, {
            name: 'interactionNotes',
            cls: 'interactionNotePanelCls',
            items: me.createComponent()
        });
        me.callParent(arguments);
    },

    load: function () {
        var me = this;
        var reason = 'Unable /Unable'
        if (managers['flowType'] === 'redemption')
            reason = 'Redemption';

        var data = {
            brand: managers['pushData'].serviceProfile.brand,
            deviceType: managers['pushData'].deviceProfile.deviceType,
            reason: reason, // select the first element. we might not need this
        }
        var fields = me.items.items[0].items.items[0].items.items[0].items.items;
        Ext.each(fields, function (item) {
            if (data[item.name])
                item.setValue(data[item.name]);
        })

        // TODO from where we get this? 
        //var autoNotes = 'Airtime Pin added - $45 30-Dday UNL TALK/DATA, first 10 GB at High Speeds then at 2G';
        var notes = managers['autoNotes'] || '';
        notes = notes.split(", ");
        var autoNotes = [];
        for(var i =0; i < notes.length ; i++){
            if(autoNotes.indexOf(notes[i]) == -1) autoNotes.push(notes[i]);
        }
        autoNotes=autoNotes.join(", ");

        me.down('#autoNotes').setValue(autoNotes);
        me.down('#result').setValue('Call Completed');

        if(autoNotes.indexOf(ADD_AIRTIME_TAG)>=0 ||
            autoNotes.indexOf(PURCHASE_AIRTIME_TAG)>=0 ||
            autoNotes.indexOf(RESERVED_AIRTIME_TAG)>=0)
        {
            me.down('#detail').setValue('Redemption Successful');
        }
        else {
            var interactionDetails = managers['interactionDetails'] || '';
            me.down('#detail').setValue(interactionDetails);
        }
        me.down('#result').setValue('Call Completed');
    },

    reset: function () {
        var me = this;
        var fields = me.items.items[0].items.items[0].items.items[0].items.items;
        Ext.each(fields, function (item) {
            item.setValue('');
        });
        me.down('#createInteractioResponse').setValue('');
        me.down('#agentNotes').setValue('');
        me.down('#createInteractionBtn').show();
    },

    createInteraction: function () {
        var me = this;
        me.mask('Please wait...');
        var notes = '';
        var autoNotes = me.down('#autoNotes').getValue();
        var agentNotes = me.down('#agentNotes').getValue();
        if (autoNotes && autoNotes.length>0){
            notes = autoNotes + '\n\n' + agentNotes;
        }
        else {
            notes = agentNotes;
        }
        var requestObject = {
            reason: me.down('#reason').getValue(),
            //notes: me.down('#agentNotes').getValue(),
            notes: notes,
            detail: me.down('#detail').getValue(),
            result: me.down('#result').getValue(),
            surveyQuestion: managers['surveyQuestion'] || ''
        }

        adam.callService('Tas/Interactions', 'POST', requestObject).then(function (response) {
            // hardcoded the success response as there is no response from TAS
            response = 'Interaction created successfully.';
            me.down('#createInteractioResponse').setValue(response);
            // end call
            adam.endCall();
            me.down('#createInteractionBtn').hide();
            me.unmask();
        }).catch(function (response) {
            try{
                var jsonResponse = JSON.parse(response.response.responseText);
                if((jsonResponse.message.toLowerCase().indexOf('object') >= 0)||
                    (jsonResponse.message.toLowerCase().indexOf('control') >= 0)){
                    Ext.Msg.alert('ERROR', REQ_ERROR_MSG);
                }
                else {
                    Ext.Msg.alert('ERROR', 'Sorry, Interaction could not be created. Please try again.');
                }
            }
            catch(e){
                Ext.Msg.alert('ERROR', 'Sorry, Interaction could not be created. Please try again.');
            }
            me.unmask();
        });
    },
    createComponent: function () {
        var me = this;
        return [{
            xtype: 'panel',
            border: false,
            cls: 'create-interaction',
            items: [
                {
                    xtype: 'panel',
                    border: false,

                    layout: {
                        type: 'vbox',
                        padding: '5'
                    },
                    items: [{
                        xtype: 'form',
                        itemId: 'interactionInfoForm',
                        border: false,

                        defaults: {
                            xtype: 'displayfield',
                            labelStyle: 'white-space: nowrap;'
                        },
                        items: [{
                            fieldLabel: 'Brand',
                            name: 'brand'
                        }, {
                            fieldLabel: 'Device Type',
                            name: 'deviceType'
                        }, {
                            xtype: 'combo', // Consider making this displayfield and load detail combo using the flowtype parameter if there is no need for a change event for this in future
                            fieldLabel: "Reason",
                            width: 350,
                            name: "reason",
                            itemId: 'reason',
                            valueField: 'val',
                            displayField: 'name',
                            disabled: true,
                            editable: false,
                            forceSelection: true,
                            store: Ext.create('Ext.data.Store', {
                                fields: ['val', 'name'],
                                data: Object.keys(REASON).map(function (item, index) { return { "val": item, "name": item } })
                            }),
                            listeners: {
                                change: function (combo, newValue, oldValue) {
                                    if (newValue) {
                                        var detailStore = Ext.create('Ext.data.Store', {
                                            fields: ['val', 'name'],
                                            data: REASON[newValue].map(function (item, index) { return { "val": item, "name": item } })
                                        });
                                        var detailCombo = me.down('#detail');
                                        detailCombo.bindStore(detailStore);
                                    }
                                }
                            }
                        }, {
                            xtype: 'combo',
                            name: 'detail',
                            itemId: 'detail',
                            fieldLabel: 'Detail',
                            width: 350,
                            emptyText: 'Choose an Issue',
                            editable: false,
                            valueField: 'val',
                            displayField: 'name',
                        }, {
                            xtype: 'combo',
                            fieldLabel: 'Result',
                            name: 'result',
                            itemId: 'result',
                            width: 350,
                            emptyText: 'Choose a Result',
                            editable: false,
                            queryMode: 'local',
                            valueField: 'val',
                            displayField: 'name',
                            store: Ext.create('Ext.data.Store', {
                                fields: ['val', 'name'],
                                data: RESULT.map(function (item, index) { return { "val": item, "name": item } })
                            })
                        }]
                    }]
                }, {
                    xtype: 'panel',
                    border: false,
                    layout: 'fit',
                    items: [{
                        xtype: 'textarea',
                        name: 'autoNotes',
                        fieldLabel: 'Auto Notes',
                        itemId: 'autoNotes',
                        margin: '10 50 10 0',
                        disabled: true,
                    }]
                }
                , {
                    xtype: 'panel',
                    border: false,
                    layout: 'fit',
                    height: 60,
                    items: [{
                        xtype: 'textarea',
                        name: 'agentNotes',
                        fieldLabel: 'Agent Notes',
                        itemId: 'agentNotes',
                        margin: "10 50 10 0",
                        value: '',
                        height: 40
                    }]
                },
                {
                    xtype: 'button',
                    itemId: 'createInteractionBtn',
                    margin: "0 0 0 10",
                    text: 'Create Interaction',
                    handler: function () {
                        me.createInteraction()
                    },
                    scope: me
                }, {
                    xtype: 'displayfield',
                    name: 'response',
                    itemId: 'createInteractioResponse'
                }
            ]
        }]
    }
});