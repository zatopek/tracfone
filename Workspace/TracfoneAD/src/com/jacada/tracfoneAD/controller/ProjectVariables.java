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
	@Value("${jas.account.menu.url}")
	private String jasAccountMenuUrl;
		@Value("${jas.addService.menu.url}")
		private String jasAddServiceMenuUrl;
		@Value("${jas.port.menu.url}")
		private String jasPortMenuUrl;
		@Value("${jas.sales.menu.url}")
		private String jasSalesMenuUrl;
		@Value("${jas.phoneFunctionality.menu.url}")
		private String jasPhoneFunctionalityMenuUrl;
		@Value("${jas.hardwareIssues.menu.url}")
		private String jasHardwareIssuesMenuUrl;
		@Value("${jas.lifeline.menu.url}")
		private String jasLifelineMenuUrl;
	@Value("${PW.apps}")
	private String[] pwApps; 

	@RequestMapping(value="get", method = RequestMethod.GET, produces = "application/json")
	public String getVariables() {
		Map<String, Object> variables = new HashMap<String, Object>();
		variables.put("tasUrl", tasUrl);
		variables.put("jasUrl", jasUrl);
		variables.put("jasAccountMenuUrl", jasAccountMenuUrl);
		variables.put("jasAddServiceMenuUrl", jasAddServiceMenuUrl);
		variables.put("jasPortMenuUrl", jasPortMenuUrl);
		variables.put("jasSalesMenuUrl", jasSalesMenuUrl);
		variables.put("jasPhoneFunctionalityMenuUrl", jasPhoneFunctionalityMenuUrl);
		variables.put("jasHardwareIssuesMenuUrl", jasHardwareIssuesMenuUrl);
		variables.put("jasLifelineMenuUrl", jasLifelineMenuUrl);
		variables.put("pwApps", pwApps);
		return new Gson().toJson(variables);
	}	
}
