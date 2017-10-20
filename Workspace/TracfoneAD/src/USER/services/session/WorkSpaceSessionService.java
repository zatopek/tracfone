package USER.services.session;



import java.util.HashMap;

import USER.services.session.ConstantSessionVariablesKeys.AgentDataKeys;
import USER.services.session.ConstantSessionVariablesKeys.CallDataKeys;
import USER.services.session.ConstantSessionVariablesKeys.SessionKeys;

import com.jacada.jad.logging.LogWrapper;
import com.jacada.jad.push.PushHelper;
import com.jacada.services.sessionService.DefaultWorkSpaceSessionService;



public class WorkSpaceSessionService extends DefaultWorkSpaceSessionService{
	/**
	 * 
	 */
	private static final String PORTLET_RELOAD_KEY = "PortletReload";

	private static final long serialVersionUID = 1L;

	@Override
	public HashMap<String, String> getSessionData() {

		HashMap<String, String> hash =  super.getSessionData();
		
		if (getSessionInformation() != null){
			hash.put(SessionKeys.SESSION_ID, getSessionInformation().getSessionId());
			hash.put(SessionKeys.CONTEXT_PATH, getSessionInformation().getContextPath());
		}
		if (getVoiceInformation() != null){
			hash.put(SessionKeys.CTI_PROFILE_NAME, getVoiceInformation().getCtiProfileName());
		}
		
		//retrieving agent info
		if (getAgentInformation() != null){
			hash.put(AgentDataKeys.AGENT_NAME, getAgentInformation().getCtiAgentName());
			hash.put(AgentDataKeys.AGENT_EXTENSION, getAgentInformation().getExtension());
			hash.put(AgentDataKeys.AGENT_ID, getAgentInformation().getAgentId());
			hash.put(AgentDataKeys.AGENT_PLACE, getAgentInformation().getPlace());
		}



		//retrieving partyManager info
		if (getVoiceOperationProxy() != null && getVoiceOperationProxy().getPartyManagerInfo() != null){
			hash.put(CallDataKeys.ANI,getVoiceOperationProxy().getPartyManagerInfo().getANI());
			hash.put(CallDataKeys.DNIS,getVoiceOperationProxy().getPartyManagerInfo().getDNIS());

			if (getVoiceOperationProxy().getPartyManagerInfo().getCustomerInfo() != null) {
				hash.put(CallDataKeys.CUSTOMER_DN,getVoiceOperationProxy().getPartyManagerInfo().getCustomerInfo().getDN());
			}
			if (getVoiceOperationProxy().getPartyManagerInfo().getSupervisorInfo() != null) {
				hash.put(CallDataKeys.SUPERVISOR_DN,getVoiceOperationProxy().getPartyManagerInfo().getSupervisorInfo().getDN());
			}
		}
		return hash;
	}
	
	public void refreshPortlet(String portletId){
		try {
			PushHelper.pushMessage(getSessionInformation().getSession(), PORTLET_RELOAD_KEY, portletId);
		} catch (Exception e) {
			LogWrapper.error(WorkSpaceSessionErrors.PUSH_JIM_WS_SESSION_EXCEPTION.getErrorCode(), e);
			LogWrapper.error(e);
		}
	}
	
	/**
     * empty method for jim API to be implemented at project level.
     * @param given, map of input parameters.
     */
	public void performCustomOperations(HashMap<String,String> given){
		
	}
}