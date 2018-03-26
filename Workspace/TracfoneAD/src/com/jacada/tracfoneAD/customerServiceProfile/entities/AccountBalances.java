package com.jacada.tracfoneAD.customerServiceProfile.entities;

import java.io.Serializable;

public class AccountBalances implements Serializable{
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	String phoneStatus;
	String voiceBalance;
	String smsBalance;
	String dataBalance;
		
	public AccountBalances() {
		this.voiceBalance = "Please check TAS";
		this.smsBalance = "Please check TAS";
		this.dataBalance = "Please check TAS";
	}
	public String getPhoneStatus() {
		return phoneStatus;
	}
	public void setPhoneStatus(String phoneStatus) {
		this.phoneStatus = phoneStatus;
	}
	public String getVoiceBalance() {
		return voiceBalance;
	}
	public void setVoiceBalance(String voiceBalance) {
		this.voiceBalance = voiceBalance;
	}
	public String getSmsBalance() {
		return smsBalance;
	}
	public void setSmsBalance(String smsBalance) {
		this.smsBalance = smsBalance;
	}
	public String getDataBalance() {
		return dataBalance;
	}
	public void setDataBalance(String dataBalance) {
		this.dataBalance = dataBalance;
	}
	
	
}
