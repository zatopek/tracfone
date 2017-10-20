loadUserAgentView = function() {
Ext.ns("Jacada.supervisor.user");

 /**
  * This class overrides Jacada.supervisor.AgentView
  * Allow to customize the supervisor view in the projects
  * 
  * Method that can be override:
		
		 * 
		 * return the Page size of the Agents Grid (default = 10)
		 * 
			getPageSize();
  * 
  */
Jacada.supervisor.user.AgentView = Ext.extend(Jacada.supervisor.AgentView,{
	constructor: function() {
		Jacada.supervisor.user.AgentView.superclass.constructor.call(this);
	}
	
});

}