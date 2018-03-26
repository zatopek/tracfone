package com.jacada.tracfoneAD.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.google.gson.Gson;
import com.jacada.tracfoneAD.util.Request;
import com.jacada.tracfoneAD.util.Response;

@RestController
@RequestMapping(value = "variables", produces = "application/json")
public class ProjectVariables {
	@Value("${jas.redemption.url}")
	private String redemptionUrl;
	@Value("${jas.unableUnable.url}")
	private String unableUnableUrl;
	@Value("${tas.url}")
	private String tasUrl;

	
	@RequestMapping(method = RequestMethod.POST)
	public Response<Map<String, String>> all(
			@RequestBody Request<String> request) {
		Map<String, String> variables = new HashMap<String, String>();
		variables.put("redemptionUrl", redemptionUrl);
		variables.put("unableUnableUrl", unableUnableUrl);
		return Response.success(request, variables);
	}
	
	@RequestMapping(value="get", method = RequestMethod.GET, produces = "application/json")
	public String getVariables() {
		Map<String, String> variables = new HashMap<String, String>();
		variables.put("redemptionUrl", redemptionUrl);
		variables.put("unableUnableUrl", unableUnableUrl);
		variables.put("tasUrl", tasUrl);
		return new Gson().toJson(variables);
	}	
}
