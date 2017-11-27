package com.jacada.tracfoneAD.sSO.dao.interfaces;

import java.io.Serializable;
import java.util.List;

import com.jacada.tracfoneAD.sSO.entities.ApplicationSourceSystem;
import com.jacada.tracfoneAD.sSO.entities.LoginCredential;
import com.jacada.tracfoneAD.sSO.entities.SSOCredential;

public interface SSODao extends Serializable {
	public List<LoginCredential> getUserSsoCredentials(String agentId);
	public LoginCredential getUserSsoCredentialBySystem(String agentId, ApplicationSourceSystem system);
	public void addOrUpdateUserSsoCredentials(String agentId, List<LoginCredential> loginCredentials, boolean add);
	public void deleteUserSsoCredentials(String agentId);
}
