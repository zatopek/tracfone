var CTIHelper = null;
(function () {
	var CTIHelper = function () {
		var attachedData = {};

		return {
			load: function () {
				//Register for CTI Events
				
				//Start call
				Push.registerEventHandler('START_MANUAL_CALL', this.startCall.bind(this)); 
				Push.registerEventHandler('START_BUSINESS_CALL', this.startCall.bind(this));
				//TODO: End Call
				Push.registerEventHandler('START_DISPOSITION', this.endCall.bind(this));
				//Disposition end.
				Push.registerEventHandler('unload_script', this.endDisposition.bind(this));
			},
			startCall: function() {
				adam.startCall();
			},
			endCall: function() {
				adam.endCall();
			},
			endDisposition: function() {
				adam.endDisposition();
			},
			getAttachedData: function () {
				return new Promise(function (resolve, reject) {
					if(attachedData.fetched){
						resolve(attachedData);
						return;
					} 
					adam.callService('cti/attachedData', 'current').then(function (response) {
						attachedData = response;
						attachedData.fetched = true;
						resolve(attachedData);
					}).catch (function (e) {
						console.error(e);
						reject(e);
					});
				});
			},
			reset: function() {
				attachedData = {};
			}
		};
	};
	ctiHelper = new CTIHelper();
})()
