package com.jacada.tracfoneAD.callHandling.web;

import java.util.Map;
import java.util.StringTokenizer;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.ServletRequestDataBinder;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.jacada.jad.feature.web.WorkspaceController;
import com.jacada.jad.push.PushHelper;
import com.jacada.tracfoneAD.callHandling.model.interfaces.CallHandlingManager;
import com.jacada.tracfoneAD.customerServiceProfile.entities.AccountBalances;
import com.jacada.tracfoneAD.customerServiceProfile.entities.CustomerProfile;
import com.jacada.tracfoneAD.customerServiceProfile.entities.CustomerServiceProfile;
import com.jacada.tracfoneAD.customerServiceProfile.entities.DeviceProfile;
import com.jacada.tracfoneAD.customerServiceProfile.entities.ServiceProfile;
import com.jacada.tracfoneAD.customerServiceProfile.model.interfaces.CustomerServiceProfileManager;
import com.jacada.tracfoneAD.util.JSONPayload;


@Controller
@RequestMapping("/call")
public class DefaultCallHandlingController extends WorkspaceController {

	@Autowired
	private CustomerServiceProfileManager customerServiceProfileManager;
	
	private CallHandlingManager manager;

	public void setCallHandlingManager(CallHandlingManager manager) {
		this.manager = manager;
	}

	@RequestMapping(value = "incomingCall/{agentId}", method = RequestMethod.GET, produces = "application/json")
	public @ResponseBody
	void incoming(@PathVariable String agentId, HttpServletRequest request) throws Exception {
		/*
		Map <String, String[]> params = request.getParameterMap();
		JSONObject obj = new JSONObject();
		for (Map.Entry<String, String[]> entry : params.entrySet())
		{
			obj.put(entry.getKey(), entry.getValue()[0]);
		}
		PushHelper.pushMessage(request, "IncomingCallParamObj", obj);
		*/
		
		String esn = this.getRequestParameterValue(request.getParameter("url"), "esn");
		String task_id = this.getRequestParameterValue(request.getParameter("url"), "task_id");

		System.out.println(esn + " " + task_id);
		//PushHelper.publishMessageToAgent(agentId, "IncomingCallQueryString", request.getQueryString());
		
		//CustomerServiceProfile customerServiceProfile = customerServiceProfileManager.getCustomerServiceProfile(esn);
		//PushHelper.publishMessageToAgent(agentId, "CustomerServiceProfile", customerServiceProfile);
		PushHelper.publishMessageToAgent(agentId, "CustomerServiceProfile", new CustomerServiceProfile());
		PushHelper.publishMessageToAgent(agentId, "LaunchWorkflow", task_id);
		
	}
	
	@RequestMapping(value="incomingCall/{agentId}", method = RequestMethod.POST, produces = "application/json")
	public @ResponseBody void incomingCall(@PathVariable String agentId, HttpServletRequest request) throws Exception{
		
		String esn = this.getRequestParameterValue(request.getParameter("url"), "esn");
		String task_id = this.getRequestParameterValue(request.getParameter("url"), "task_id");
		
		//CustomerServiceProfile customerServiceProfile =  new CustomerServiceProfile();
		//Comment out for local testing
		CustomerServiceProfile customerServiceProfile = customerServiceProfileManager.getCustomerServiceProfile(esn);		
		PushHelper.publishMessageToAgent(agentId, "CustomerServiceProfile", customerServiceProfile);
		//PushHelper.publishMessageToAgent(agentId, "CustomerServiceProfile", new CustomerServiceProfile());
		PushHelper.publishMessageToAgent(agentId, "LaunchWorkflow", task_id);
		
	}	
	
	private String getRequestParameterValue(String requestString, String parameter)
	{
		StringTokenizer st = new StringTokenizer(requestString, "&");
		while (st.hasMoreTokens()) {
			String token = st.nextToken();
			if(token.startsWith(parameter)){
				return token.substring(parameter.length()+1);
			}		
		};
		return "";
	}
}
