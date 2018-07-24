package com.jacada.tracfoneAD.customerServiceProfile.entities;

import java.io.Serializable;

public class CustomerProfile implements Serializable {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	String customerId;
	String contactName;
	String email;
	String groupId;
	String zip;
	String lid;
	String caseId;
	String flashId;
	String lifeLineStatus;
    String programName;
    
	public String getCustomerId() {
		return customerId;
	}
	public void setCustomerId(String customerId) {
		this.customerId = customerId;
	}
	public String getContactName() {
		return contactName;
	}
	public void setContactName(String contactName) {
		this.contactName = contactName;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public String getGroupId() {
		return groupId;
	}
	public void setGroupId(String groupId) {
		this.groupId = groupId;
	}
	public String getZip() {
		return zip;
	}
	public void setZip(String zip) {
		this.zip = zip;
	}
	public String getLid() {
		return lid;
	}
	public void setLid(String lid) {
		this.lid = lid;
	}
	public String getCaseId() {
		return caseId;
	}
	public void setCaseId(String caseId) {
		this.caseId = caseId;
	}
	public String getFlashId() {
		return flashId;
	}
	public void setFlashId(String flashId) {
		this.flashId = flashId;
	}
	public String getLifeLineStatus() {
		return lifeLineStatus;
	}
	public void setLifeLineStatus(String lifeLineStatus) {
		this.lifeLineStatus = lifeLineStatus;
	}
	public String getProgramName() {
		return programName;
	}
	public void setProgramName(String programName) {
		this.programName = programName;
	}
	
}
