package com.jacada.tracfoneAD.sSO.web;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.google.gson.Gson;
import com.jacada.tracfoneAD.sSO.entities.LoginCredential;
import com.jacada.tracfoneAD.sSO.model.interfaces.SSOManager;
import com.jacada.tracfoneAD.util.JSONPayload;


@Controller
@RequestMapping("/sso")
@Lazy
public class SsoController {
	
	@Autowired
	private transient SSOManager manager;
		
	@RequestMapping(value="getAgentSsoCredentials/{agentId}", method = RequestMethod.GET, produces = "application/json")
	public @ResponseBody JSONPayload getAgentSsoCredentials(@PathVariable String agentId) throws Exception{
		
		List<LoginCredential> loginArray = manager.getAgentSsoLogins(agentId);
		JSONPayload payload = new JSONPayload();
		payload.setPayload(loginArray);
		payload.setStatus("200");
		payload.setMessage("OK");
		return payload;
	}
	
	@RequestMapping(value="addAgentSsoCredentials/{agentId}", method = RequestMethod.POST, produces = "application/json")
	public @ResponseBody JSONPayload addAgentSsoCredentials(@PathVariable String agentId, HttpServletRequest request) throws Exception{
		
		Gson gson = new Gson();
		String loginsStr = request.getParameter("logins").replace("\\\"","\"").replace("\"[", "[").replace("]\"", "]");
		LoginCredential[] logins = gson.fromJson(loginsStr, LoginCredential[].class);
		List<LoginCredential> loginsList = new ArrayList<LoginCredential>(Arrays.asList(logins));
		manager.addAgentSsoLogins(agentId, loginsList);
		JSONPayload payload = new JSONPayload();
		payload.setPayload("");
		payload.setStatus("200");
		payload.setMessage("OK");
		return payload;
	}	
	

	
}
