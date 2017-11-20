package com.jacada.tracfoneAD.sSO.model;

import com.jacada.jad.feature.model.DefaultWorkspaceManager;
import com.jacada.jad.feature.annotations.FeatureManager;
import com.jacada.tracfoneAD.sSO.entities.ApplicationSourceSystem;
import com.jacada.tracfoneAD.sSO.entities.SSOCredential;
import com.jacada.tracfoneAD.sSO.model.interfaces.SSOManager;

@FeatureManager(name = "SSO")
public class DefaultSSOManager extends DefaultWorkspaceManager implements SSOManager {

	private static final long serialVersionUID = 1L;
	private transient com.jacada.tracfoneAD.sSO.dao.interfaces.SSODao SSO;
	public void setSSO(com.jacada.tracfoneAD.sSO.dao.interfaces.SSODao SSO){
	  this.SSO=SSO;
	}
	@Override
	public void addAgentSSOCredential(String userid, String password,
			ApplicationSourceSystem system) {
		SSOCredential sSOCredential = new SSOCredential();
		//sSOCredential.set
		SSO.updateUserCredentials("", sSOCredential, true);
		
	}
}
