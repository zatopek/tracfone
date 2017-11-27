package com.jacada.tracfoneAD.sSO.model.interfaces;

import java.util.List;

import com.jacada.jad.feature.model.WorkspaceManager;
import com.jacada.tracfoneAD.sSO.entities.LoginCredential;

public interface SSOManager extends WorkspaceManager {
	public List<LoginCredential> getAgentSsoLogins (String agentId);
	public void addAgentSsoLogins (String agentId, List<LoginCredential> logins);
	public void deleteAgentSsoLogins (String agentId);
}
