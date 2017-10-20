package com.jacada.tracfoneAD.securityQuestions.web;

import com.jacada.tracfoneAD.securityQuestions.model.interfaces.SecurityQuestionsManager;
import java.util.Collection;
import javax.servlet.http.HttpServletRequest;
import org.springframework.web.bind.ServletRequestDataBinder;
import org.springframework.web.servlet.ModelAndView;
import com.jacada.jad.feature.web.WorkspaceJsonController;

public class JsonSecurityQuestionsController extends WorkspaceJsonController {

	private SecurityQuestionsManager manager;

	public void setSecurityQuestionsManager(SecurityQuestionsManager manager) {
		this.manager = manager;
	}
	
	@Override
	protected ModelAndView generateModelAndView(Collection<?> data) throws Exception {
		return super.generateModelAndView(data);
	}

	@Override
	protected void initBinder(HttpServletRequest request, ServletRequestDataBinder binder) throws Exception {
		super.initBinder(request, binder);
	}	
}
