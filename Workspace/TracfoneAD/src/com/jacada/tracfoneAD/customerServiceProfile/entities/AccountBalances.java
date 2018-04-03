package com.jacada.tracfoneAD.customerServiceProfile.entities;

import java.io.Serializable;

public class AccountBalances implements Serializable{
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	public static final String DATA_NOT_AVAILABLE =  "Please check TAS";
	String voiceBalance;
	String smsBalance;
	String dataBalance;
	String phoneStatus;
		
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
	public String getPhoneStatus() {
		return phoneStatus;
	}
	public void setPhoneStatus(String phoneStatus) {
		this.phoneStatus = phoneStatus;
	}
	
	
}
