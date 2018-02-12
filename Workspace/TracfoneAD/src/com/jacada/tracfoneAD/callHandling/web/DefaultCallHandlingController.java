package com.jacada.tracfoneAD.callHandling.web;

import java.util.List;
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
import com.jacada.tracfoneAD.customerServiceProfile.entities.TasTicket;
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
	@RequestMapping(value = "getLatestPurchaseObjId/{esn}/{brand}", method = RequestMethod.GET, produces = "application/json")
	public @ResponseBody
	String getLatestPurchaseObjId(@PathVariable String esn, @PathVariable String brand, HttpServletRequest request) throws Exception {
		String purchase = customerServiceProfileManager.getLatestPurchaseObjId(esn, brand);
		return purchase;
	}
	
	@RequestMapping(value = "getOpenedTickets/{esn}", method = RequestMethod.GET, produces = "application/json")
	public @ResponseBody
	JSONPayload getOpenedTickets(@PathVariable String esn, HttpServletRequest request) throws Exception {
		List<TasTicket> openedTickets = customerServiceProfileManager.getOpenedTickets(esn);
		JSONPayload payload = new JSONPayload();
		payload.setPayload(openedTickets);
		return payload;
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
		CustomerServiceProfile customerServiceProfile = new CustomerServiceProfile();
		customerServiceProfile.getCallInfo().setTaskId(task_id);
		PushHelper.publishMessageToAgent(agentId, "CustomerServiceProfile", customerServiceProfile);
		/*AccountBalances accountBalances= customerServiceProfileManager.getAccountBalances(
				customerServiceProfile.getDeviceProfile().getPhoneStatus(),
				customerServiceProfile.getServiceProfile().getBrand(), esn);*/
		AccountBalances accountBalances = new AccountBalances();
		PushHelper.publishMessageToAgent(agentId, "AccountBalances", accountBalances);
		//PushHelper.publishMessageToAgent(agentId, "CustomerServiceProfile", new CustomerServiceProfile());
		//PushHelper.publishMessageToAgent(agentId, "LaunchWorkflow", task_id);
		
	}
	
	@RequestMapping(value="incomingCall/{agentId}", method = RequestMethod.POST, produces = "application/json")
	public @ResponseBody void incomingCall(@PathVariable String agentId, HttpServletRequest request) throws Exception{
		
		String esn = this.getRequestParameterValue(request.getParameter("url"), "esn");
		String task_id = this.getRequestParameterValue(request.getParameter("url"), "task_id");
		
		//CustomerServiceProfile customerServiceProfile =  new CustomerServiceProfile();
		//Comment out for local testing
		CustomerServiceProfile customerServiceProfile = customerServiceProfileManager.getCustomerServiceProfile(esn);		
		customerServiceProfile.getCallInfo().setTaskId(task_id);
		PushHelper.publishMessageToAgent(agentId, "CustomerServiceProfile", customerServiceProfile);
		AccountBalances accountBalances= customerServiceProfileManager.getAccountBalances(
				customerServiceProfile.getDeviceProfile().getPhoneStatus(),
				customerServiceProfile.getServiceProfile().getBrand(), esn);
		PushHelper.publishMessageToAgent(agentId, "AccountBalances", accountBalances);
		//PushHelper.publishMessageToAgent(agentId, "CustomerServiceProfile", new CustomerServiceProfile());
		//PushHelper.publishMessageToAgent(agentId, "LaunchWorkflow", task_id);
		
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
