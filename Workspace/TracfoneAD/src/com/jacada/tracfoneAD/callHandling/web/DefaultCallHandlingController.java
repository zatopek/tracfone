package com.jacada.tracfoneAD.callHandling.web;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.json.JSONObject;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.jacada.jad.feature.web.WorkspaceController;
import com.jacada.jad.push.PushHelper;
import com.jacada.tracfoneAD.callHandling.model.interfaces.CallHandlingManager;


@Controller
@RequestMapping("/call")
public class DefaultCallHandlingController extends WorkspaceController {

	private CallHandlingManager manager;

	public void setCallHandlingManager(CallHandlingManager manager) {
		this.manager = manager;
	}

	@RequestMapping(value = "incoming", method = RequestMethod.GET, produces = "application/json")
	public @ResponseBody
	void getAgentSsoCredentials(HttpServletRequest request) throws Exception {
		Map <String, String[]> params = request.getParameterMap();
		
		JSONObject obj = new JSONObject();
		for (Map.Entry<String, String[]> entry : params.entrySet())
		{
			obj.put(entry.getKey(), entry.getValue()[0]);
		}
		
		PushHelper.publishMessageToAgent("", "IncomingCallParamObj", obj);
		PushHelper.publishMessageToAgent("", "IncomingCallQueryString", request.getQueryString());
	}

}
