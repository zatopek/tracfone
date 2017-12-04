var DataStore = null;
(function () {
	DataStore = function (config) {
		var uniqueId = config.uniqueId;
		var resources = config.resources;
		var data = {};

		var _internal = {
			processResult: function (result, name) {
				//No unique ID cannot process this result
				if (!result[uniqueId])
					return;
				if (!data[result[uniqueId]])
					data[result[uniqueId]] = {};
				for (var field in result) {
					if (typeof result[field] != 'function') {
						if (result[field] && result[field] != '') {

							if (data[result[uniqueId]][field]) {
								//Replacing this field data
								console.log('DATASTORE - ' + name + ' - Replacing - ' + field + ' containing - ' + data[result[uniqueId]][field] + ' with ' + result[field]);
							}
							data[result[uniqueId]][field] = result[field];
						}
					}
				}
			},
			load: function (name, requestData) {
				return new Promise(function (resolve, reject) {
					var currentRequestConfig = resources[name];

					if (!currentRequestConfig)
						reject({
							msg: 'Config not found'
						});

					for (var field in currentRequestConfig.fields) {
						//This is workspace make sure you check the field is not a function
						//All the required fields should be in data
						if (typeof currentRequestConfig.fields[field] != 'function' && currentRequestConfig.fields[field] && !requestData[field])
							reject({
								msg: 'Required input ' + field + 'not provided'
							});
					}
					if (!currentRequestConfig.url) {
						//This is a  manual object
						resolve({});
					} else {
						//Now we can call the back end
						adam.callService(currentRequestConfig.url, currentRequestConfig.method, requestData).then(function (response) {
							resolve(response);
						}).catch (function (e) {
							console.error(e);
							reject(e);
						});
					}
				});
			}
		};

		return {
			digest : function(response){
				if (typeof response == 'object' && typeof response.length == 'number') {
					//This is an array
					for (var i in response) {
						var result = response[i];
						//save this result
						_internal.processResult(result, name);
					}
					return;
				} else if (typeof response == 'object') {
					//Single response
					//Can this ever happen for search?
					//Save this result
					if(this.currentRequestConfig.saveId){
						response[this.uniqueId] = id;
					}
					_internal.processResult(response);
					return;
				} else {
					//Non object response not supported
					return {
						msg: 'Unsupported type'
					};
				}
			},
			get: function (id, name, customData, force) {
				return new Promise(function (resolve, reject) {
					if (data[id] && !name && !force) {
						resolve(data[id]);
						return;
					}
					if (data[id] && data[id][name] && !force) {
						//This function has been called before for this id so return the local copy of data
						resolve(data[id]);
						return;
					} else if (data[id]) {
						//Create data required
						var currentRequestConfig = resources[name];
						var requestData = {};
						if (!customData) {
							for (var field in currentRequestConfig.fields) {
								//Get this field from saved data
								requestData[field] = data[id][field];
							}
						} else {
							requestData = customData;
						}

						_internal.load(name, requestData).bind({
							currentRequestConfig: currentRequestConfig,
							uniqueId: uniqueId
						}).then(function (response) {
							//Check the response
							if (typeof response == 'object' && typeof response.length == 'number') {
								//This is an array
								for (var i in response) {
									var result = response[i];
									//save this result
									_internal.processResult(result, name);
								}
								data[id][name] = true;
								resolve(data[id]);
								return;
							} else if (typeof response == 'object') {
								//Single response
								//Can this ever happen for search?
								//Save this result
								if(this.currentRequestConfig.saveId){
									response[this.uniqueId] = id;
								}
								_internal.processResult(response);
								data[id][name] = true;
								resolve(data[id]);
								return;
							} else {
								//Non object response not supported
								reject({
									msg: 'Returned response of unsupported type'
								});
							}
						}).catch (reject);
					} else {
						reject({
							msg: 'Call out of order. No saved information available'
						});
					}
				});
			},
			search: function (type, requestData) {
				return new Promise(function (resolve, reject) {
					_internal.load(type, requestData).then(function (response) {
						//Check the response
						if (typeof response == 'object' && typeof response.length == 'number') {
							//This is an array
							for (var i in response) {
								var result = response[i];
								//save this result
								_internal.processResult(result);
							}
							resolve(response);
							return;
						} else if (typeof response == 'object') {
							//Single response
							//Can this ever happen for search?
							//Save this result
							_internal.processResult(response);
							resolve(response);
							return;
						} else {
							//Non object response not supported
							reject({
								msg: 'Returned response of unsupported type'
							});
							return;
						}
					}).catch (function (e) {
						reject(e);
					});
				});
			},
			update: function(id, name, customData){
				return new Promise(function (resolve, reject) {
					if(!name || !resources[name] || !customData) {
						reject({
							msg: 'Unidentified configuration or invalid input.'
						});
						return;
					}
					if (data[id]) {
						//Create data required
						var currentRequestConfig = resources[name];
						var requestData = {};
						for (var field in currentRequestConfig.fields) {
							//Get this field from saved data
							requestData[field] = data[id][field];
						}
						//Can custom data be an array?											
						for (var customField in customData){
							//Get this field from saved data
							requestData[customField] = customData[customField];
						}

						_internal.load(name, requestData).bind({
							currentRequestConfig: currentRequestConfig,
							uniqueId: uniqueId
						}).then(function (response) {
							//Check the response
							if (typeof response == 'object' && typeof response.length == 'number') {
								//This is an array
								for (var i in response) {
									var result = response[i];
									//save this result
									_internal.processResult(result);
								}
								data[id][name] = true;
								resolve(response);
								return;
							} else if (typeof response == 'object') {
								//Single response
								//Save this result
								if(this.currentRequestConfig.saveId){
									response[this.uniqueId] = id;
								}
								_internal.processResult(response);
								data[id][name] = true;
								resolve(response);
								return;
							} else {
								//Non object response not supported
								reject({
									msg: 'Returned response of unsupported type'
								});
							}
						}).catch (reject);
					} else {
						reject({
							msg: 'Call out of order. No saved information available'
						});
						return;
					}
				});
			},
			set: function (id, name, value) {
				return new Promise(function (resolve, reject) {
					if (data[id]) {
						
						if (typeof data[id][name] == 'object' && typeof data[id][name].length == 'number') {
							if (typeof value == 'object' && typeof value.length == 'number') {
								for(var i in value) {
									if(typeof i == 'number')
										data[id][name].push(value);
								}
							} else {
								data[id][name].push(value);
							}
						} else {
							data[id][name] = value;
						}
						
						resolve(data[id]);
					} else {
						reject({
							msg: 'Call out of order. No saved information available'
						});
					}
				});
			},
			reset: function () {
				data = {};
			}
		};
	};
})()
