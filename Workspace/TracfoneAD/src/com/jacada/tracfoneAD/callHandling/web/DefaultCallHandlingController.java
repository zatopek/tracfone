package com.jacada.tracfoneAD.callHandling.web;

import java.util.Map;

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
import com.jacada.tracfoneAD.customerServiceProfile.entities.CustomerServiceProfile;
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
		
		String esn = request.getParameter("esn");
		String task_id = request.getParameter("task_id");
		
		//CustomerServiceProfile customerServiceProfile = customerServiceProfileManager.getCustomerServiceProfile(esn);
		//PushHelper.publishMessageToAgent(request, "CustomerServiceProfile", customerServiceProfile);
		PushHelper.publishMessageToAgent(agentId, "CustomerServiceProfile", new CustomerServiceProfile());
		PushHelper.publishMessageToAgent(agentId, "LaunchWorkflow", task_id);
		
	}	
}
