package com.jacada.tracfoneAD.sSO.entities;

import java.util.HashSet;
import java.util.Set;

public class AgentSSO {

    private long ssoId;
	private String agentId;
	private ApplicationSourceSystem system;
	private Set<SSOCredential> sSOCredentials =
	new HashSet<SSOCredential>(0);


	public long getSsoId() {
		return ssoId;
	}
	public void setSsoId(long ssoId) {
		this.ssoId = ssoId;
	}
	public String getAgentId() {
		return agentId;
	}
	public void setAgentId(String agentId) {
		this.agentId = agentId;
	}
	public ApplicationSourceSystem getSystem() {
		return system;
	}
	public void setSystem(ApplicationSourceSystem system) {
		this.system = system;
	}
	public Set<SSOCredential> getsOCredentials() {
		return sSOCredentials;
	}
	public void setSsOCredentials(Set<SSOCredential> sSOCredentials) {
		this.sSOCredentials = sSOCredentials;
	}
	
}
