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

	@RequestMapping(value = "incoming", method = RequestMethod.GET, produces = "application/json")
	public @ResponseBody
	void incoming(HttpServletRequest request) throws Exception {
		Map <String, String[]> params = request.getParameterMap();
		
		/*
		JSONObject obj = new JSONObject();
		for (Map.Entry<String, String[]> entry : params.entrySet())
		{
			obj.put(entry.getKey(), entry.getValue()[0]);
		}
		PushHelper.pushMessage(request, "IncomingCallParamObj", obj);
		*/
		String esn = request.getParameter("esn");
		String task_id = request.getParameter("task_id");
		String agentName = request.getParameter("agentName");

		PushHelper.publishMessageToAgent(agentName, "IncomingCallQueryString", request.getQueryString());
		
		//CustomerServiceProfile customerServiceProfile = customerServiceProfileManager.getCustomerServiceProfile(esn);
		//PushHelper.pushMessage(request, "CustomerServiceProfile", customerServiceProfile);
		PushHelper.publishMessageToAgent(agentName, "CustomerServiceProfile", new CustomerServiceProfile());
		PushHelper.publishMessageToAgent(agentName, "LaunchWorkflow", task_id);
		
	}
	
	@RequestMapping(value="incomingCall/{agentId}", method = RequestMethod.POST, produces = "application/json")
	public @ResponseBody void incomingCall(@PathVariable String agentId, HttpServletRequest request) throws Exception{
		
		String esn = "";
		String task_id = "";
		String url = request.getParameter("url");
		StringTokenizer st = new StringTokenizer(url, "&");
		while (st.hasMoreTokens()) {
			String token = st.nextToken();
			if(token.startsWith("esn")){
				esn = token.substring(4);
			}
			else if(token.startsWith("task_id")){
				task_id = token.substring(8);
			}			
		}
		
		CustomerServiceProfile customerServiceProfile =  new CustomerServiceProfile();
		//Comment out for local testing
		//CustomerServiceProfile customerServiceProfile = customerServiceProfileManager.getCustomerServiceProfile(esn);
		String os = customerServiceProfileManager.getOperatingSystem(customerServiceProfile.getDeviceProfile().getPartNumber());
		//Dummy Data
		
		AccountBalances accountBalances = new AccountBalances();
		CustomerProfile customerProfile = new CustomerProfile();
		DeviceProfile deviceProfile =  new DeviceProfile();
		ServiceProfile serviceProfile = new ServiceProfile();
		deviceProfile.setDeviceType("BYOP");
		deviceProfile.setSimStatus("ACTIVE");
		deviceProfile.setMinStatus("ACTIVE");
		deviceProfile.setPhoneGen("4G_LTE");
		deviceProfile.setOs(os);
        serviceProfile.setServiceType("type of service");
        serviceProfile.setBrand("TRACFONE");
        serviceProfile.setCardsInReserve("2");
        serviceProfile.setServiceEndDate("1/1/2018");
        serviceProfile.setCarrier("something ATT");
        customerProfile.setCustomerId("lksdf9879789");
        customerProfile.setContactName("Peter Parer");
        accountBalances.setPhoneStatus("ACTIVE");
        accountBalances.setSmsBalance("1245");
        accountBalances.setVoiceBalance("33");
		customerServiceProfile.setAccountBalances(accountBalances);
		customerServiceProfile.setCustomerProfile(customerProfile);
		customerServiceProfile.setDeviceProfile(deviceProfile);
		customerServiceProfile.setServiceProfile(serviceProfile);
		
		PushHelper.publishMessageToAgent(agentId, "CustomerServiceProfile", customerServiceProfile);
		//PushHelper.publishMessageToAgent(agentId, "CustomerServiceProfile", new CustomerServiceProfile());
		PushHelper.publishMessageToAgent(agentId, "LaunchWorkflow", task_id);
		
	}	
}
