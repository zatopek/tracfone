package com.jacada.tracfoneAD.sSO.entities;

import java.util.HashSet;
import java.util.Set;

public class AgentSSO {

    private long ssoId;
	private String agentId;
	private String system;
	private Set<SSOCredential> ssoCredentials =
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
	public String getSystem() {
		return system;
	}
	public void setSystem(String system) {
		this.system = system;
	}
	public Set<SSOCredential> getSsoCredentials() {
		return ssoCredentials;
	}
	public void setSsoCredentials(Set<SSOCredential> ssoCredentials) {
		this.ssoCredentials = ssoCredentials;
	}

	
}
