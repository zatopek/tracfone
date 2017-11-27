package com.jacada.tracfoneAD.sSO.web;

import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import USER.portlets.customerInfo.CustomerInfoManager;
import USER.portlets.customerInfo.entity.CustomerInfo;
import USER.portlets.customerInfo.entity.CustomerInfoData;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.jacada.jad.logging.LogWrapper;
import com.jacada.tracfoneAD.sSO.entities.ApplicationSourceSystem;
import com.jacada.tracfoneAD.sSO.entities.LoginCredential;
import com.jacada.tracfoneAD.sSO.model.DefaultSSOManager;
import com.jacada.tracfoneAD.sSO.model.interfaces.SSOManager;
import com.jacada.tracfoneAD.utils.GsonUtils;
import com.jacada.tracfoneAD.utils.JSONPayload;

import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;


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
