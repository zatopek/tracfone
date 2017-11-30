var projectVariable = null;
(function () {
	var ProjectVariable = function () {
		var variables = {};

		return {
			load: function() {
				adam.callService('variables', '').then(function (variablesResponse) {
					variables = variablesResponse;
				});
			},
			get: function(name) {
				if (variables[name])
					return variables[name];
				return 'Not Defined';
			}
		};
	};
	projectVariable = new ProjectVariable();
})()
