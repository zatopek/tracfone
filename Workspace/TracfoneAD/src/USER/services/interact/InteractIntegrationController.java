package USER.services.interact;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import SYSTEM.integration.interact.service.InteractIntegration;

import com.jacada.jad.push.PushHelper;
import com.jacada.logging.LogWrapper;

@Controller
@RequestMapping("/interactIntegration")
public class InteractIntegrationController extends InteractIntegration{
	
	
	
	@RequestMapping(value = "/showTab", method = RequestMethod.GET)
	public void  showTab(@RequestParam("tabId") String tabId, HttpServletRequest request, HttpServletResponse response){
		LogWrapper.debug("Interact calling showTab with id: " + tabId);
		HttpSession session = request.getSession(false);
		if(session == null){
			LogWrapper.error("Interact must call with sessionId, did you forget to add jsessionId to the integration point url?");
		}
		LogWrapper.debug("Interact calling showTab for session id: " + session.getId());
		try {
			//do not forget to register push key InteractShowTab
			PushHelper.pushMessage(session, "InteractShowTab",tabId);
		} catch (Exception e) {
			LogWrapper.error("Interact controller failed to perform showTab: ",e);
		}
	}

	

}
