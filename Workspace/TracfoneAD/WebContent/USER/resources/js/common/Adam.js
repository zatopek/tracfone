/**
A central application handler.

Developers can register for Application events from here

Other independent components that need to be managed at app level will have a manager registered here

 **/
var Adam = function () {

	managers = {};
	widgets = {};
	waitingWidgetRegister = {};
	managers['comm'] = new BroadBridge("", 2, function () { }, this);
	//This is a singleton. But should also be accessible outside just in case it is required.
	managers['interactcomm'] = wsCommunicator;
	//managers['projectvariables'] = projectVariable;
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
				widgets[component].loadComponent(className, params);
			});

			managers['interactcomm'].register('callJia', this, function (data) {
				this.callService('Tas/SUI/Launch?min=' + managers['pushData'].deviceProfile.min, 'POST').then(function (response) {
					// do nothing
				});
			});
		},
		callService: function (call, method, callObject) {
			return managers['comm'].send(call, method, callObject);
		},
		getVariable: function (name) {
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
		startCall: function () {
			//Maybe each widget should implement this function
			//What should happen at the start of a call??
			//First get the attached data
		},
		endCall: function () {
			//reset all widgets
			// for (var widget in widgets) {
			// 	if (widgets[widget].reset && typeof widgets[widget].reset === 'function')
			// 		widgets[widget].reset();
			// }

			// debugger;

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
		}
	};

}

var adam = {};
//Let' s start the reign when ext reign is fired
Ext.onReady(function () {
	console.info('Adam is in charge now!');
	adam = new Adam();
	adam.load();
	// hide the portlet
	widgets['customerServiceProfile'].up().up().hide()
});
