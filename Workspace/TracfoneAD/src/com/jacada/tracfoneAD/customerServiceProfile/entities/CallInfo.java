package com.jacada.tracfoneAD.customerServiceProfile.entities;

import java.io.Serializable;

public class CallInfo implements Serializable{
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	String airtimePin;
	String xferCondition;
	String taskId;
	String callId;
	
	public String getCallId() {
		return callId;
	}
	public void setCallId(String callId) {
		this.callId = callId;
	}
	public String getAirtimePin() {
		return airtimePin;
	}
	public void setAirtimePin(String airtimePin) {
		this.airtimePin = airtimePin;
	}
	public String getXferCondition() {
		return xferCondition;
	}
	public void setXferCondition(String xferCondition) {
		this.xferCondition = xferCondition;
	}
	public String getTaskId() {
		return taskId;
	}
	public void setTaskId(String taskId) {
		this.taskId = taskId;
	}

	
	
}
