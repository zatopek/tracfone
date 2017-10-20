package com.jacada.tracfoneAD.securityQuestions.model;

import com.jacada.jad.feature.model.DefaultWorkspaceManager;
import com.jacada.jad.feature.annotations.FeatureManager;
import com.jacada.tracfoneAD.securityQuestions.model.interfaces.SecurityQuestionsManager;

@FeatureManager(name = "SecurityQuestions")
public class DefaultSecurityQuestionsManager extends DefaultWorkspaceManager implements SecurityQuestionsManager {

	private static final long serialVersionUID = 1L;
	
	// injected beans
	private transient com.jacada.tracfoneAD.securityQuestions.dao.interfaces.SecurityQuestionsDao securityQuestionDAO;
	
	
	// Setters
	public void setSecurityQuestionDAO(com.jacada.tracfoneAD.securityQuestions.dao.interfaces.SecurityQuestionsDao securityQuestionDAO) {
		this.securityQuestionDAO = securityQuestionDAO;
	}

}
