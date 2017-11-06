package com.jacada.tracfoneAD.sSO.entities;

public class SSOCredential {

	private long id;
    private long ssoId;
	private String userId;
	private String password;
	private AgentSSO agentSSO;
	
	public long getId() {
		return id;
	}
	public void setId(long id) {
		this.id = id;
	}	
	public long getSsoId() {
		return ssoId;
	}
	public void setSsoId(long ssoId) {
		this.ssoId = ssoId;
	}
	public String getUserId() {
		return userId;
	}
	public void setUserId(String userId) {
		this.userId = userId;
	}
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	public AgentSSO getAgentSSO() {
		return agentSSO;
	}
	public void setAgentSSO(AgentSSO agentSSO) {
		this.agentSSO = agentSSO;
	}
	
}
