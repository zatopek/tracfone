var projectVariable = null;
(function () {
	var ProjectVariable = function () {
		var variables = {};

		return {
			load: function() {
				/*
				adam.callService('variables', 'POST', '').then(function (variablesResponse) {

					alert(variablesResponse.size());
					variables = variablesResponse;
				});
				*/

                Ext.Ajax.request({
                    url: $W().contextPath + '/rest/variables/get',
                    method: 'GET',
                    contentType: 'application/json',
                    scope: this,
                    success: function (response) {
                        variables = JSON.parse(response.responseText);
                    },
                    failure: function (response) {
					}
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
