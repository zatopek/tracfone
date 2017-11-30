package com.jacada.tracfoneAD.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.jacada.tracfoneAD.util.Request;
import com.jacada.tracfoneAD.util.Response;

@RestController
@RequestMapping(value = "variables", produces = "application/json")
public class ProjectVariables {
	@Value("${jas.welcome.url}")
	private String welcomeURL;
	@Value("${jas.changepremium.url}")
	private String changePremiumURL;

	@RequestMapping(method = RequestMethod.POST)
	public Response<Map<String, String>> all(
			@RequestBody Request<String> request) {
		Map<String, String> variables = new HashMap<String, String>();
		variables.put("welcomeScriptURL", welcomeURL);
		variables.put("changePremiumURL", changePremiumURL);
		return Response.success(request, variables);
	}
}
