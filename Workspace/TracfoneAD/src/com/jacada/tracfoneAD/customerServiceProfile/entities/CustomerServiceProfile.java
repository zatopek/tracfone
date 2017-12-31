package com.jacada.tracfoneAD.customerServiceProfile.entities;

import java.io.Serializable;

public class CustomerServiceProfile implements Serializable{

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	CustomerProfile customerProfile;
	DeviceProfile deviceProfile;
	AccountBalances	accountBalances;
	ServiceProfile serviceProfile;
	CallInfo callInfo;
	
	public CustomerServiceProfile() {
		super();
		this.customerProfile = new CustomerProfile();
		this.deviceProfile = new DeviceProfile();
		this.accountBalances = new AccountBalances();
		this.serviceProfile = new ServiceProfile();
		this.callInfo = new CallInfo();
	}
	
	public CustomerProfile getCustomerProfile() {
		return customerProfile;
	}
	public void setCustomerProfile(CustomerProfile customerProfile) {
		this.customerProfile = customerProfile;
	}
	public DeviceProfile getDeviceProfile() {
		return deviceProfile;
	}
	public void setDeviceProfile(DeviceProfile deviceProfile) {
		this.deviceProfile = deviceProfile;
	}
	public AccountBalances getAccountBalances() {
		return accountBalances;
	}
	public void setAccountBalances(AccountBalances accountBalances) {
		this.accountBalances = accountBalances;
	}
	public ServiceProfile getServiceProfile() {
		return serviceProfile;
	}
	public void setServiceProfile(ServiceProfile serviceProfile) {
		this.serviceProfile = serviceProfile;
	}

	public CallInfo getCallInfo() {
		return callInfo;
	}

	public void setCallInfo(CallInfo callInfo) {
		this.callInfo = callInfo;
	}
	
	

}
