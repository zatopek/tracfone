/**
 A central application handler.

 Developers can register for Application events from here

 Other independent components that need to be managed at app level will have a manager registered here

 **/
var Adam = function () {
    var viewSsoPasswordTime = new Date().getTime();
    managers = {};
    widgets = {};
    waitingWidgetRegister = {};
    managers['projectvariables'] = projectVariable;
    //var jiaUrl = 'https://localhost:9003/TracFone/';
    var jiaUrl = getCookie('jiaUrl') + 'TracFone/';
    var workspaceUrl = window.location.origin + $W().contextPath + '/rest/';
    managers['comm'] = new BroadBridge(jiaUrl, "", 0, function () { }, this);
    managers['workspace'] = new BroadBridge(workspaceUrl, "", 0, function () { }, this);
    //This is a singleton. But should also be accessible outside just in case it is required.
    managers['interactcomm'] = wsCommunicator;
    managers['ctiHelper'] = ctiHelper;
    managers['windowsManager'] = new WindowsManager();
    managers['jasHandler'] = new JasHandler();
    managers['plansDataStore'] = redemptionStore = new DataStore({
        uniqueId: 'planId',
        resources: {
            airtimePlans: {
                method: 'GET',
                url: '../USER/resources/js/dummydata/airtimePlanGrid.json',
                fields: {}
            }
        }
    });

    managers['deviceProfile'] = new DataStore({
        uniqueId: 'customerId',
        resources: {
        }
    });
    managers['autoNotes'] = '';

    managers['interactionDetails'] = '';

    managers['logins'] = '';

    managers['ssoSystems'] = '';

    return {
        load: function () {
            for (var manager in managers) {
                if (managers[manager] && managers[manager].load)
                    managers[manager].load();
            }
            //Also see if there are any widgets that were created before Adam was
            if (typeof WaitingForAdam != 'undefined') {
                for (var widget in WaitingForAdam) {
                    if (WaitingForAdam[widget].key && WaitingForAdam[widget].widget)
                        adam.register(WaitingForAdam[widget].key, WaitingForAdam[widget].widget);
                }
                delete WaitingForAdam;
            }

            // get naviation from the jas postmessage
            managers["interactcomm"].register("navigation", this, function (data) {
                var className = data.classname; // class name to load
                var component = data.component; // widget key (name)
                // we will only get this in ticket form
                var params = null;
                if (data.tickettitle) {
                    params = {
                        ticketTitle: data.tickettitle,
                        ticketType: data.tickettype
                    };
                }
                if (data.surveyquestion) {
                    managers['surveyQuestion'] = data.surveyquestion;
                }
                if(data.autonotes) {
                    managers['autoNotes'] += data.autonotes;
                }

                widgets[component].loadComponent(className, params);
            });

            managers['interactcomm'].register('callJia', this, function (data) {
                this.callService('Tas/SUI/Launch?min=' + managers['pushData'].deviceProfile.min, 'POST').then(function (response) {
                    // do nothing
                }).catch(function (response) {
                    try{
                        var jsonResponse = JSON.parse(response.response.responseText);
                        if (jsonResponse && jsonResponse.message) {
                            if((jsonResponse.message.toLowerCase().indexOf('object') >= 0) ||
                                (jsonResponse.message.toLowerCase().indexOf('control') >= 0)){
                                Ext.Msg.alert('ERROR', REQ_ERROR_MSG);
                            } else {
                                Ext.Msg.alert('ERROR', 'Sorry, Failed to launch SUI. ' + jsonResponse.message);
                            }
                        }
                        else {
                            Ext.Msg.alert('ERROR', REQ_ERROR_MSG);
                        }
                    }
                    catch(e){
                        Ext.Msg.alert('ERROR', REQ_ERROR_MSG);
                    }
                });
            });

            managers['interactcomm'].register('setVars', this, function (data) {
                if(data.interactiondetails) {
                    managers['interactionDetails'] = data.interactiondetails;
                }
            });

            managers['interactcomm'].register('passwordWallet', this, function (data) {
                if(data.app) {
                    this.launchApp(data.app);
                }
            });
        },
        launchApp: function(name) {
            switch(name) {
                case 'TAS':
                    if(this.isSystemInLogins(this.getSsoSystem(name))) {
                        this.callService('Tas/IncomingCall?url=' + encodeURIComponent($W().tasUrl), 'GET').then(function (response) {
                        }).catch(function (error) {
                        });
                    }
                    break;
                case 'Verizon RSSX':
                    if(this.isSystemInLogins(this.getSsoSystem(name))) {
                        this.callService('Billing/Verizon', 'GET').then(function (response) {
                        }).catch(function (error) {
                        });
                    }
                    break;
                case 'T-Mobile WCSM':
                    if(this.isSystemInLogins(this.getSsoSystem(name))) {
                        this.callService('Billing/T-Mobile', 'GET').then(function (response) {
                        }).catch(function (error) {
                        });
                    }
                    break;
                case 'Verizon CIS':
                    if(this.isSystemInLogins(this.getSsoSystem(name))) {
                        var zip = '00000';
                        try{
                            zip = managers['pushData'].customerProfile.zip;
                        }catch(e){};
                        this.callService('CoverageMap/Search/Verizon' +  '/' + zip, 'GET').then(function (response) {
                        }).catch(function(e){
                        });
                    }
                    break;
                default:
            }
        },
        getCookie: function(name) {
            var value = "; " + document.cookie;
            var parts = value.split("; " + name + "=");
            if (parts.length == 2) return parts.pop().split(";").shift();
        },
        callService: function (call, method, callObject) {
            return managers['comm'].send(this.getCookie('username') + '/' + call, method, callObject);
        },
        callWsService: function (call, method, callObject) {
            return managers['workspace'].send(call, method, callObject);
        },
        getVariable: function (name) {
            //reload variables if not defined
            if(managers['projectvariables'].get(name) == 'Not Defined')
            {
                managers['projectvariables'].load();
            }
            return managers['projectvariables'].get(name);
        },
        getAttachedData: function () {
            return managers['ctiHelper'].getAttachedData();
        },
        register: function (key, widget) {
            //Check if this key is not null and a string and widget is not null and an object (should of type JacadaBaseComponent

            return new Promise(function (resolve, reject) {
                if (!key || !widget || typeof key != 'string' || typeof widget != 'object')
                    reject(new Error('Invalid input'));
                //Should this be rejected??? Can there be a case for this to be valid?
                if (widgets[key]) {
                    reject(new Error('Key already registered'));
                    return;
                }

                if (!widget.load || typeof widget.load != 'function') {
                    reject(new Error('You widget does not implement a load function '));
                    return;
                }

                if (!widget.reset || typeof widget.reset != 'function') {
                    reject(new Error('You widget does not implement a reset function '));
                    return;
                }

                widgets[key] = widget;
                //What if there are items waiting for this widget to execute

                if (waitingWidgetRegister[key]) {
                    //Ok this object should be sent back to this widget?? ... this object should already have a method load
                    widgets[key].load(waitingWidgetRegister[key]);
                    delete waitingWidgetRegister[key];
                }
                resolve('Registered');
            });

        },
        searchAirtimePlans: function (criteria) {
            return managers['plansDataStore'].search('airtimePlans', criteria || {});
        },
        getAirtimePlan: function (planId) {
            return managers['plansDataStore'].get(planId);
        },
        addAutoNotes: function (notes) {
            if(managers['autoNotes'] && managers['autoNotes'].length > 0) {
                managers['autoNotes'] = managers['autoNotes'] + '. ' + notes;
            }
            else {
                managers['autoNotes'] = notes;
            }

        },
        getAgentSsoCredentials: function () {
            Ext.Ajax.request({
                url: $W().contextPath + '/rest/sso/getAgentSsoCredentials/' + $W().agentName,
                method: 'GET',
                success: function (response) {
                    logins = Ext.decode(response.responseText).result;
                    managers['logins'] = logins;
                    if (logins.length === 0) {managers['windowsManager'].show('ssoWindow');
                    }
                    else {

                        var resource = 'Credentials';
                        var extraparam = {
                            app: 'workspace',
                            username: $W().agentName,
                            password: '',
                            //custom: window.location.origin + $W().contextPath + '/rest/call/incomingCall'
                            custom: $W().wsSessionId
                        }
                        logins.push(extraparam);
                        var param = JSON.stringify(logins).replace(/\\/g, "").replace(/\"\[/, "[").replace(/\]\"/, "]").replace(/system/g , "app");
                        adam.callService(resource, 'POST', param).then(function (response) {
                            if(!$W().startTas){
                                //call JIA API incomingCall
                                adam.callService('Tas/IncomingCall?url=' + encodeURIComponent($W().tasUrl), 'GET').then(function (response) {
                                    $W().startTas = true;
                                }).catch(function (error) {
                                });
                            }
                        }).catch(function (error) {
                        });
                    }
                },
                failure: function (response) {
                    //$W().ssoWindow.show();
                    debugger;
                }
            });
        },
        startCall: function () {
            //Maybe each widget should implement this function
            //What should happen at the start of a call??
            //First get the attached data
        },
        endCall: function () {
            managers['interactcomm'].sendData({
                type: 'object',
                eventName: 'endCall',
                name: 'endCall',
                value: ''
            });
        },
        endDisposition: function () {
            //The reset should take care of clearing everything.
            var that = this;
            return new Promise(function (resolve, reject) {
                that.resetState().then(resolve);
            });

        },
        resetState: function () {
            return new Promise(function (resolve, reject) {
                for (var key in widgets) {
                    //call reset on each of these guys
                    if (widgets[key].reset) {
                        try {
                            widgets[key].reset();
                        } catch (e) {
                            console.err('Failed to reset - ' + key);
                        }
                    }
                }

                for (var key in managers) {
                    //call reset on each of these guys
                    if (managers[key].reset) {
                        try {
                            managers[key].reset();
                        } catch (e) {
                            console.err('Failed to reset - ' + key);
                        }
                    }
                }
                resolve();
            });
        },
        mask: function () {
            //Mask the tabpanel
            tabPanel.mask("Loading...");
        },
        unmask: function () {
            //UnMask the tabpanel
            tabPanel.unmask();
        },
        /**
         A utility function to log errors
         */
        logError: function () { },
        registerForEvent: function () { },
        currentState: function () {
            //ready
            //incall
            //inDisposition
        },
        callData: {},
        savePushData: function (data) {
            debugger;
            //save call data
            //save call data
            // call data IDs for different component
            this.callData.customerId = data.customerProfile.customerId;
            managers['deviceProfile'].digest(data.deviceProfile);

        },
        getDeviceProfile: function (customerId) {
            return managers['deviceProfile'].get(customerId || this.callData.customerId);
        },

        getSsoSystem: function(system) {
            var ssoSystemVar = system.replace(/[^A-Z0-9]+/ig, "_");
            return ssoSystemVar;
        },

        isSystemInLogins: function (system) {
            for (var i in managers['logins']) {
                if (managers['logins'][i].system == system) {
                    return true;
                }
            }
            return false;
        }

    };

}

var adam = {};
//Let' s start the reign when ext reign is fired
Ext.onReady(function () {
    console.info('Adam is in charge now!');
    adam = new Adam();
    adam.load();
    adam.getAgentSsoCredentials();

    // hide the portlet
    if(widgets['customerServiceProfile']){
        widgets['customerServiceProfile'].up().up().hide();
    }

    //change ajax timeout to 120 seconds
    Ext.Ajax.timeout = 120000;
});
