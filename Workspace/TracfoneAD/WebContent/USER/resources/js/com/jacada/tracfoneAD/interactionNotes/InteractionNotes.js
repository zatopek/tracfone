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

    listeners: {
        afterrender: function () {
            var me = this;
            // disable create button if reason or detail has not been selected
            if(me.down('#result').getDisplayValue().toLowerCase().indexOf('choose') == -1 &&
                me.down('#detail').getDisplayValue().toLowerCase().indexOf('choose') == -1)
            {
                me.down('#createInteractionBtn').enable();
            } else {
                me.down('#createInteractionBtn').disable();
            }

            if(me.down('#result').getDisplayValue().toLowerCase().indexOf('choose') == -1) {
                me.down('#result').inputEl.addCls('chooseCls');
            }

            if(me.down('#detail').getDisplayValue().toLowerCase().indexOf('choose') == -1) {
                me.down('#detail').inputEl.addCls('chooseCls');
            }
        }
    },

    load: function () {
        debugger;
        var me = this;

        // populate results combo box
        adam.callWsService('call/getInteractionResults', 'GET', {}).then(function (response) {
            var results = [];
            Ext.each(response, function (field) {
                results.push({
                    val: field.objId,
                    name: field.title
                })
            })
            var interactionResultsStore = Ext.create('Ext.data.Store', {
                fields: ['val', 'name'],
                data: results
            });
            var combo = me.down('#result');

            combo.bindStore(interactionResultsStore);
            var resultRecordIndex = interactionResultsStore.findBy(
                function(record, id){
                    if(record.get('name').toLowerCase().indexOf('completed') >=0){
                        return id;
                    }
                }
            );
            combo.setValue(combo.getStore().getAt(resultRecordIndex));
            //combo.setValue(combo.getStore().getAt(0));
            //me.down('#result').setValue('Call Completed');
        }).catch(function (response) {

        })

        // populate reasons combo box
        adam.callWsService('call/getInteractionReasons', 'GET', {}).then(function (response) {
            var reasonSelected = '';
            var reasons = [];
            Ext.each(response, function (field) {
                reasons.push({
                    val: field.objId,
                    name: field.title
                })
            })
            var interactionReasonsStore = Ext.create('Ext.data.Store', {
                fields: ['val', 'name'],
                data: reasons
            });

            var combo = me.down('#reason');
            combo.bindStore(interactionReasonsStore);
            var reasonRecordIndex = interactionReasonsStore.findBy(
                function(record, id){
                    if (managers['flowType'] === 'redemption'){
                        if(record.get('name').toLowerCase().indexOf('redemption') >=0) {
                            reasonSelected = record.get('val');
                            return id;
                        }
                    } else {
                        if(record.get('name').toLowerCase().indexOf('unable') >=0) {
                            reasonSelected = record.get('val');
                            return id;
                        }
                    }
                }
            );
            combo.setValue(combo.getStore().getAt(reasonRecordIndex));

            // populate details combo box based on reason selected
            adam.callWsService('call/getInteractionDetails/' + reasonSelected, 'GET', {}).then(function (response) {
                var details = [];
                Ext.each(response, function (field) {
                    details.push({
                        val: field.detailObjId,
                        name: field.title
                    })
                })
                var interactionDetailsStore = Ext.create('Ext.data.Store', {
                    fields: ['val', 'name'],
                    data: details
                });
                var combo = me.down('#detail');
                combo.bindStore(interactionDetailsStore);

                if(autoNotes.indexOf(ADD_AIRTIME_TAG)>=0 ||
                    autoNotes.indexOf(PURCHASE_AIRTIME_TAG)>=0 ||
                    autoNotes.indexOf(RESERVED_AIRTIME_TAG)>=0)
                {
                    //me.down('#detail').setValue('Redemption Successful');
                    var recordIndex = combo.getStore().findBy(
                        function(record, id){
                            if(record.get('name').toLowerCase().indexOf('successful') >=0) {
                                return id;
                            }
                        }
                    );
                    combo.setValue(combo.getStore().getAt(recordIndex));
                }
                else {
                    var interactionDetails = managers['interactionDetails'] || '';
                    if (interactionDetails != '') {
                        var detailRecordIndex = combo.getStore().findBy(
                            function (record, id) {
                                if (record.get('name').toLowerCase().indexOf(interactionDetails) >= 0) {
                                    return id;
                                }
                            }
                        );
                        combo.setValue(combo.getStore().getAt(detailRecordIndex));
                    } else {
                        combo.setValue(combo.getStore().getAt(0));
                    }
                }

            }).catch(function (response) {

            })
        }).catch(function (response) {

        })


        var data = {
            brand: managers['pushData'].serviceProfile.brand,
            deviceType: managers['pushData'].deviceProfile.deviceType
        }
        var fields = me.items.items[0].items.items[0].items.items[0].items.items;
        Ext.each(fields, function (item) {
            if (data[item.name])
                item.setValue(data[item.name]);
        })


        var notes = managers['autoNotes'] || '';
        notes = notes.split(", ");
        var autoNotes = [];
        for(var i =0; i < notes.length ; i++){
            if(autoNotes.indexOf(notes[i]) == -1) autoNotes.push(notes[i]);
        }
        autoNotes=autoNotes.join(", ");
        if(autoNotes.indexOf(", ")==0){
            autoNotes = autoNotes.substring(2);
        }
        me.down('#autoNotes').setValue(autoNotes);
        //me.down('#result').setValue('Call Completed');

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
            reason: me.down('#reason').getDisplayValue(),
            //notes: me.down('#agentNotes').getValue(),
            notes: notes.replace(/'/g, "\\'"),
            detail: me.down('#detail').getDisplayValue(),
            result: me.down('#result').getDisplayValue(),
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
                    Ext.Msg.alert('ERROR', 'Sorry, Interaction could not be created. ' +  jsonResponse.message);
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
                            /*
                            store: Ext.create('Ext.data.Store', {
                                fields: ['val', 'name'],
                                data: Object.keys(REASON).map(function (item, index) { return { "val": item, "name": item } })
                            }),
                            */
                            listeners: {
                                change: function (combo, newValue, oldValue) {
                                    /*
                                    if (newValue) {
                                        var detailStore = Ext.create('Ext.data.Store', {
                                            fields: ['val', 'name'],
                                            data: REASON[newValue].map(function (item, index) { return { "val": item, "name": item } })
                                        });
                                        var detailCombo = me.down('#detail');
                                        detailCombo.bindStore(detailStore);
                                    }
                                    */
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
                            listeners: {
                                change: function (combo, newValue, oldValue) {
                                    /*
                                    if (newValue) {
                                        var detailStore = Ext.create('Ext.data.Store', {
                                            fields: ['val', 'name'],
                                            data: REASON[newValue].map(function (item, index) { return { "val": item, "name": item } })
                                        });
                                        var detailCombo = me.down('#detail');
                                        detailCombo.bindStore(detailStore);
                                    }
                                    */
                                    if (combo.getDisplayValue().toLowerCase().indexOf('choose') >= 0) {
                                        combo.inputEl.addCls('chooseCls');
                                    } else {
                                        combo.inputEl.removeCls('chooseCls');
                                    }

                                    if (combo.getDisplayValue().toLowerCase().indexOf('choose') == -1 &&
                                        me.down('#result').getDisplayValue().toLowerCase().indexOf('choose') == -1) {
                                        me.down('#createInteractionBtn').enable();
                                    } else {
                                        me.down('#createInteractionBtn').disable();
                                    }
                                }
                            }
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
                            listeners: {
                                change: function (combo, newValue, oldValue) {
                                    if (combo.getDisplayValue().toLowerCase().indexOf('choose') >= 0) {
                                        combo.inputEl.addCls('chooseCls');
                                    } else {
                                        combo.inputEl.removeCls('chooseCls');
                                    }

                                    if (combo.getDisplayValue().toLowerCase().indexOf('choose') ==-1 &&
                                        me.down('#detail').getDisplayValue().toLowerCase().indexOf('choose') == -1) {
                                        me.down('#createInteractionBtn').enable();
                                    }
                                    else {
                                        me.down('#createInteractionBtn').disable();
                                    }
                                }
                            }
                            /*
                            store: Ext.create('Ext.data.Store', {
                                fields: ['val', 'name'],
                                //data: RESULT.map(function (item, index) { return { "val": item, "name": item } })
                                data: interactionResults
                            })
                            */
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