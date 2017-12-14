package com.jacada.tracfoneAD.util;

import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.web.authentication.preauth.AbstractPreAuthenticatedProcessingFilter;

import com.jacada.jad.push.PushHelper;

public class LoginInterceptor extends
		AbstractPreAuthenticatedProcessingFilter {

	private static Logger LOG = LoggerFactory
			.getLogger(LoginInterceptor.class);

	@Override
	protected Object getPreAuthenticatedPrincipal(
			HttpServletRequest paramHttpServletRequest) {

		if (paramHttpServletRequest.getParameter("username") != null) {

			String username = paramHttpServletRequest
					.getParameter("username");
			System.out.println("username==>" + username);
			
			paramHttpServletRequest.getSession().setAttribute("username", username);
			
			String agentName = paramHttpServletRequest
					.getParameter("j_username");
			paramHttpServletRequest.getSession().setAttribute("agentName", agentName);
			/*
			try {
				PushHelper.pushMessageToAgent(paramHttpServletRequest.getSession(), "AgentEnvUsername", username);
			} catch (Exception e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			*/
		}
		return null;
	}

	@Override
	protected Object getPreAuthenticatedCredentials(
			HttpServletRequest paramHttpServletRequest) {
		// TODO Auto-generated method stub
		return null;
	}
}
