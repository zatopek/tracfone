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
	@Value("${tas.url}")
	private String tasUrl;
	@Value("${jas.url}")
	private String jasUrl;

	@RequestMapping(value="get", method = RequestMethod.GET, produces = "application/json")
	public String getVariables() {
		Map<String, String> variables = new HashMap<String, String>();
		variables.put("jasUrl", jasUrl);
		variables.put("tasUrl", tasUrl);
		return new Gson().toJson(variables);
	}	
}
