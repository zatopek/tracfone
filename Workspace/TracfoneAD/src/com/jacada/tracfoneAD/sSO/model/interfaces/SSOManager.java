package com.jacada.tracfoneAD.sSO.model.interfaces;

import com.jacada.jad.feature.model.WorkspaceManager;
import com.jacada.tracfoneAD.sSO.entities.ApplicationSourceSystem;

public interface SSOManager extends WorkspaceManager {
	public void addAgentSSOCredential (String userid, String password, ApplicationSourceSystem system);
}
