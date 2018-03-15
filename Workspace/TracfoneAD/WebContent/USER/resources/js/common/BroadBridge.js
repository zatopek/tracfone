/**
BroadBridge will connect to a web socket each instance will make a new connection with the backend. Make sure you manage your instances properly.
Unfortunately Websphere does not support sockets so we will drop down to a traditional ajax implementation here
 **/
var BroadBridge = function (url, service, retryCount, cb, scope) {

	var active = {};
	var queue = [];
	var executing = 0;
	var maxConcurrent = 8; //TODO: Make this configurable
	var checkQueue = function () {
		if (queue.length > 0) {
			var request = queue.pop();
			transmit(request['guuid'], request['call'], request['method'], request['callObject']);
		}
	};

	var save = function (guuid, callInstance) {
		//Save this
		console.info('SAVING: ' + guuid + JSON.stringify(callInstance));
		active[guuid] = callInstance;
	};
	var err = function (guuid, error) {
		//Uh Oh failed!
		if (!active || !active[guuid]) {
			//This must be at load..
			return;
		}

        //See if retry allowed!!
		if (!active[guuid].retryCount)
			active[guuid].retryCount = 0;

		if (active[guuid].retryCount < retryCount) {
			//OK retry allowed
			active[guuid].retryCount += 1;
			console.info('RETRYING: ' + guuid);
			transmit(guuid, active[guuid].call, active[guuid].method, {
				id: guuid,
				object: active[guuid].callObject
			});
		} else {
			console.error('FAILED: ' + guuid);
			active[guuid].reject(error);
			delete active[guuid];
		}
	};
	var recv = function (guuid, response) {

		var jsonResponse = JSON.parse(response.responseText);
		console.info('RECEIVED');
		if (!active) {
			//What happened here!! how did we receive without send and save
			active = {};
		}

		//Check if the response is a success
		//if (jsonResponse.status != 0) {
		if (!jsonResponse.success) {
			err(guuid, { response: response });
		} else {
			//Ok now respond back!
			console.info('SUCCESS: ' + guuid);
			active[guuid].resolve(jsonResponse.result);
			delete active[guuid];
		}
	};
	var transmit = function (guuid, call, method, callObject) {
		//make that AJAX call. Use the singleton instead of a new connection here
		executing += 1;
		try {

			Ext.Ajax.request({
				url: url + call + (call.indexOf('?') >= 0 ? '&' : '?') + 'dc=' + new Date().getTime(),
				method: method || 'GET',
				jsonData: callObject.object, //callObject is already conformed
				scope: this,
				success: function (response) {
					executing -= 1;
					recv(guuid, response);
				},
				failure: function (response) {
					executing -= 1;
					err(guuid, response);
				}
			});
		}
		catch (e) {
			executing -= 1;
			err(guuid, e);
		}
	};

	return {
		send: function (call, method, callObject, nosave, guuid) {
			var that = this;
			console.info('Sending...');
			if (!guuid)
				guuid = call + Date.now();

			//Add guuid into callObject

			return new Promise(function (resolve, reject) {
				if (!nosave)
					save(guuid, {
						resolve: resolve,
						reject: reject,
						call: call,
						callObject: callObject
					});

				if (executing < maxConcurrent) {
					transmit(guuid, call, method, {
						id: guuid,
						object: callObject
					});

				} else {
					//Add to the queue...
					queue.push({
						guuid: guuid,
						call: call,
						method: method,
						callObject: callObject
					});
				}

			});
		}
	};

}
