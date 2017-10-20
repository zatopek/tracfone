package USER.services.callHandling;

import java.util.HashMap;

import org.springframework.util.StringUtils;

import USER.services.callHandling.ConstantCallHandlingKeys.CallHandlingKeys;
import USER.services.callHandling.ConstantCallHandlingKeys.CallOperationValues;

import com.jacada.jad.cti.CTIHelper;
import com.jacada.jad.logging.LogWrapper;
import com.jacada.jad.push.PushHelper;
import com.jacada.services.callHandlingService.DefaultCallHandlingService;



public class CallHandlingService extends DefaultCallHandlingService {
	private static final long serialVersionUID = 1L;

	public void handleCallOperation(HashMap<String, String> input) {
		super.handleCallOperation(input);
		String operation = input.get(CallHandlingKeys.OPERATION);
		if (operation == null){
			return;
		}
		try {
			if (operation.equalsIgnoreCase(CallOperationValues.END_CALL_OPERATION)){

				CTIHelper.getHelper(getSessionInformation().getSession()).disconnect();


			}
			else if(operation.equalsIgnoreCase(CallOperationValues.END_WRAPUP_OPERATION)){
				PushHelper.pushMessage(getSessionInformation().getSession(), "endJimScript","no info");     
			}
		} catch (Exception e) {
			LogWrapper.error("CallHandlingService failed to perform the following operation: "+operation,e);
		}
	}
	
	
	public void coldTransfer(String number){
		try {
			super.coldTransfer(number);
			CTIHelper.getHelper(getSessionInformation().getSession()).coldTransfer(number);
		} catch (Exception e) {
			LogWrapper.error(JIMCTIErrors.JIM_CTI_COLD_XFER_EXCEPTION.getErrorCode(), number);
			LogWrapper.error(e);
		}
	}
	
	
	public void dial(String number){
		try {
			super.dial(number);
			CTIHelper.getHelper(getSessionInformation().getSession()).dial(number);
		} catch (Exception e) {
			LogWrapper.error(JIMCTIErrors.JIM_CTI_DIAL_EXCEPTION.getErrorCode(), number);
			LogWrapper.error(e);
		}
	}
	
	
	public void setAgentStatus(HashMap<String,String> input){
		String status = input.get(CallHandlingKeys.STATUS);
		String reason = input.get(CallHandlingKeys.REASON);
		try {
			 super.setAgentStatus(input);
			if(StringUtils.hasLength(status) && StringUtils.hasLength(reason)){
				CTIHelper.getHelper(getSessionInformation().getSession()).setAgentStatusWithReason(status, reason);
			} else if(StringUtils.hasLength(status) && !StringUtils.hasLength(reason)){
				CTIHelper.getHelper(getSessionInformation().getSession()).setAgentStatus(status);
			}
			else{
				LogWrapper.error(JIMCTIErrors.JIM_CTI_SET_STATUS_ERR.getErrorCode(), status, reason);
			}
		} catch (Exception e) {
			LogWrapper.error(JIMCTIErrors.JIM_CTI_SET_STATUS_EXCEPTION.getErrorCode());
			LogWrapper.error(e);
		}
	}
	
	public enum JIMCTIErrors {
		
		JIM_CTI_COLD_XFER_EXCEPTION 				("JIM1003"),
		JIM_CTI_DIAL_EXCEPTION	 					("JIM1004"),
		JIM_CTI_SET_STATUS_EXCEPTION				("JIM1005"),
		JIM_CTI_SET_STATUS_ERR	 					("JIM1006"); 
		
		private final String errorCode;
		
		JIMCTIErrors(String errorCode) {
			this.errorCode = errorCode;
		}
		
		public String getErrorCode() {
			return this.errorCode;
		}
	}
}