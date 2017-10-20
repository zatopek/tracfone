package USER.services.businessLogic;

import java.util.HashMap;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import com.jacada.jad.core.JadThreadLocal;
import com.jacada.jad.jimworkflow.entities.PageMapping;
import com.jacada.jad.logging.LogWrapper;
import com.jacada.jad.push.PushHelper;
import com.jacada.jad.services.DefaultBusinessLogicService;

public class BusinessLogicService extends DefaultBusinessLogicService{
	
	private static final String ADD_AGENT_NOTES_PUSH_KEY = "addAgentNotes";
	public static String DISPOSITION_CODE_KEY ="Value";
	public static String DISPOSITION_EDITABLE_KEY ="Editable";
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public void loadPage(String pageId){
		try {
			super.loadPage(pageId);
				//using the jimworkflow manager for mapping and not the DAOImpl directly because we want the logic of jimWorkflow regarding error handling
				PageMapping mapping = jimWorkflowManager.getPage(pageId);
				HttpServletRequest request = JadThreadLocal.getRequest();
		    	HttpSession session = request.getSession();
				PushHelper.pushMessage(session, "loadJSPPage",mapping.getContextPath());
			
		} catch (Exception e) {
			LogWrapper.error("BusinessLogicService failed to perform the JIM side-by-side: ",e);
		}
	}

	public void addAgentNotes(String notes){
		try {
			super.addAgentNotes(notes);
			HttpServletRequest request = JadThreadLocal.getRequest();
	    	HttpSession session = request.getSession();
			PushHelper.pushMessage(session, ADD_AGENT_NOTES_PUSH_KEY, notes);
		} catch (Exception e) {
			LogWrapper.error(BusinessLogicServiceErrors.PUSH_JIM_BSNS_EXCEPTION.getErrorCode(), e);
			LogWrapper.error(e);
		}
		
	}
	
	public void selectDispositionValue (HashMap<String,String> input){
		super.selectDispositionValue(input);
		final String code = input.get(DISPOSITION_CODE_KEY);
		final Boolean editable = Boolean.valueOf(input.get(DISPOSITION_EDITABLE_KEY));
		if(code != null && editable != null){
			getDispositionManager().setSelection(code, editable);
		} else {
			LogWrapper.error(BusinessLogicServiceErrors.JIM_DISPOSITION_ERR.getErrorCode(), code, editable);
		}
	}
}
