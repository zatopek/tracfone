package com.jacada.tracfoneAD.sSO.dao.interfaces;

import java.io.Serializable;
import java.util.List;

import com.jacada.tracfoneAD.sSO.entities.ApplicationSourceSystem;
import com.jacada.tracfoneAD.sSO.entities.SSOCredential;

public interface SSODao extends Serializable {
	public List<SSOCredential> getUserCredentials(String agentId);
	public SSOCredential getUserCredentialBySystem(String agentId, ApplicationSourceSystem system);
	public void updateUserCredentials(String agentId, SSOCredential sSOCredential, boolean addOrUpdate);	
}
