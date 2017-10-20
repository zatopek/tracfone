package USER.services.session;

public class ConstantSessionVariablesKeys {
	/*
	variables:
		-	sessionId
		-	context path
		-	ctiProfileName
		-	More values will be added on PS level...

		As well as call variables:
		-	agentName
		-	agentExtension
		-	agentId
		-	agentPlace
		-	agentPassword
		-	ani
		-	dnis
		-	customerDn
		-	supervisorDn
		-	More values will be added on PS level...
*/
	public static class AgentDataKeys {
		public static String AGENT_NAME ="agentName";
		public static String AGENT_EXTENSION ="agentExtension";
		public static String AGENT_ID ="agentId";
		public static String AGENT_PLACE="agentPlace";	
	}
	
	public static class CallDataKeys {

		public static String ANI="ani";
		public static String DNIS="dnis";
		public static String CUSTOMER_DN="customerDn";
		public static String SUPERVISOR_DN="supervisorDn";
	
	}
	public static class SessionKeys {
		public static String SESSION_ID ="sessionId";
		public static String CONTEXT_PATH ="contextPath";
		public static String CTI_PROFILE_NAME ="ctiProfileName";
	
	}

}
