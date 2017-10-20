afrous.widget.repository.register({
  title : 'Jacada Widgets',
  name  : 'jacadaWidgets',
  items : [{
	    title : 'Logger',
	    description : 'Writes messages to the log file',
	    wtype : 'url',
	    definition : {
	      url : '/JacadaWorkspaceCommon/dynamic-views-plugin/SYSTEM/dynamicviews/JacadaCustomWidgets/logger.jsp',
	      params : [{
	        name : 'message',
	        type : 'string',
	        required : true,
	        label : 'Log Message'
	      }, {
	        name : 'level',
	        type : 'string',
	        label : 'Log Level',
	        required : true,
	        options : [ 'fatal', 'error', 'warn', 'info', 'debug' ]
	      }],
	      paramsAsMessage : true
	    },
	    header : false,
	    allowBackgroundWork :true
  }, {
    title : 'Push',
    description : 'Registers to push events',
    wtype : 'url',
    definition : {
      url : '/JacadaWorkspaceCommon/dynamic-views-plugin/SYSTEM/dynamicviews/JacadaCustomWidgets/push.jsp',
      params : [{
        name : 'keyword',
        type : 'string',
        required : true,
        label : 'Push keyword'
      }, {
          name : 'debug',
          type : 'boolean',
          label : 'Print Debug Messages',
          options : ['true', 'false']
      }],
      paramsAsMessage : true,
      firesEvent : true
    },
    header : false,
    allowBackgroundWork :true
  },{
	title : 'Auditor',
	description : "Audit agents' events",
	wtype : 'url',
	definition : {
		url : '/JacadaWorkspaceCommon/dynamic-views-plugin/SYSTEM/dynamicviews/JacadaCustomWidgets/auditWidget.jsp',
		params : [ {
			name : 'actionName',
			type : 'string',
			label : 'Action Name',
			required : true
		}, {
			name : 'actionScope',
			type : 'string',
			label : 'Scope',
			options : [ 'Interaction', 'Session' ],
			required : true
		}, {
			name : 'paramName',
			type : 'string',
			label : 'Parameter Name'
		}, {
			name : 'paramValue',
			type : 'string',
			label : 'Parameter Value'
		} ],
		paramsAsMessage : true
	},
    header : false,
    allowBackgroundWork :true
  }, {
	    title : 'Update Properties',
	    description : 'Enables to update properties upon cti state changes',
	    wtype : 'url',
	    definition : {
	      url : '/JacadaWorkspaceCommon/dynamic-views-plugin/SYSTEM/dynamicviews/JacadaCustomWidgets/updateProperties.jsp',
	      paramsAsMessage : true,
	      firesEvent : true
	    },
	    header : false,
	    allowBackgroundWork :true
	  }]

});