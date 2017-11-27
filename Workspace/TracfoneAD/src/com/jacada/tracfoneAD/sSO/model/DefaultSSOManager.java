package com.jacada.tracfoneAD.sSO.model;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.jacada.jad.feature.model.DefaultWorkspaceManager;
import com.jacada.jad.feature.annotations.FeatureManager;
import com.jacada.tracfoneAD.sSO.entities.ApplicationSourceSystem;
import com.jacada.tracfoneAD.sSO.entities.LoginCredential;
import com.jacada.tracfoneAD.sSO.entities.SSOCredential;
import com.jacada.tracfoneAD.sSO.model.interfaces.SSOManager;

@FeatureManager(name = "SSO")
@Component
public class DefaultSSOManager extends DefaultWorkspaceManager implements SSOManager {

	private static final long serialVersionUID = 1L;
	@Autowired
	private transient com.jacada.tracfoneAD.sSO.dao.interfaces.SSODao SSO;
	public void setSSO(com.jacada.tracfoneAD.sSO.dao.interfaces.SSODao SSO){
	  this.SSO=SSO;
	}

	@Override
	public List<LoginCredential> getAgentSsoLogins(String agentId) {
		return SSO.getUserSsoCredentials(agentId);
		
	}
	@Override
	public void addAgentSsoLogins(String agentId, List<LoginCredential> logins) {
		System.out.println("manager->addAgentSsoCredentials");
		SSO.deleteUserSsoCredentials(agentId);
		SSO.addOrUpdateUserSsoCredentials(agentId, logins, true);
	}
	@Override
	public void deleteAgentSsoLogins(String agentId) {
		SSO.deleteUserSsoCredentials(agentId);
		
	}
}
