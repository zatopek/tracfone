package com.jacada.tracfoneAD.customerServiceProfile.entities;

import java.io.Serializable;

public class DeviceProfile implements Serializable{
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	String deviceType;
	String sim;
	String simStatus;
	String min;
	String minStatus;
	String msid;
	String phoneGen;
	String serial;
	String hexSerial;
	String partNumber;
	String leasedToFinance;
	String leaseStatus;
	String sequence;
	String os;
	String phoneStatus;
	String esn;
	
	public String getDeviceType() {
		return deviceType;
	}
	public void setDeviceType(String deviceType) {
		this.deviceType = deviceType;
	}
	public String getSim() {
		return sim;
	}
	public void setSim(String sim) {
		this.sim = sim;
	}
	public String getSimStatus() {
		return simStatus;
	}
	public void setSimStatus(String simStatus) {
		this.simStatus = simStatus;
	}
	public String getMin() {
		return min;
	}
	public void setMin(String min) {
		this.min = min;
	}
	public String getMinStatus() {
		return minStatus;
	}
	public void setMinStatus(String minStatus) {
		this.minStatus = minStatus;
	}
	public String getMsid() {
		return msid;
	}
	public void setMsid(String msid) {
		this.msid = msid;
	}
	public String getPhoneGen() {
		return phoneGen;
	}
	public void setPhoneGen(String phoneGen) {
		this.phoneGen = phoneGen;
	}
	public String getSerial() {
		return serial;
	}
	public void setSerial(String serial) {
		this.serial = serial;
	}
	public String getHexSerial() {
		return hexSerial;
	}
	public void setHexSerial(String hexSerial) {
		this.hexSerial = hexSerial;
	}
	public String getPartNumber() {
		return partNumber;
	}
	public void setPartNumber(String partNumber) {
		this.partNumber = partNumber;
	}
	public String getLeasedToFinance() {
		return leasedToFinance;
	}
	public void setLeasedToFinance(String leasedToFinance) {
		this.leasedToFinance = leasedToFinance;
	}
	public String getLeaseStatus() {
		return leaseStatus;
	}
	public void setLeaseStatus(String leaseStatus) {
		this.leaseStatus = leaseStatus;
	}
	public String getSequence() {
		return sequence;
	}
	public void setSequence(String sequence) {
		this.sequence = sequence;
	}
	public String getOs() {
		return os;
	}
	public void setOs(String os) {
		this.os = os;
	}
	public String getPhoneStatus() {
		return phoneStatus;
	}
	public void setPhoneStatus(String phoneStatus) {
		this.phoneStatus = phoneStatus;
	}
	public String getEsn() {
		return esn;
	}
	public void setEsn(String esn) {
		this.esn = esn;
	}
	
}

