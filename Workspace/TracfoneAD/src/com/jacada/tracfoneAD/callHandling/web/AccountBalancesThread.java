package com.jacada.tracfoneAD.callHandling.web;

import com.jacada.jad.push.PushHelper;
import com.jacada.tracfoneAD.customerServiceProfile.entities.AccountBalances;
import com.jacada.tracfoneAD.customerServiceProfile.entities.CustomerServiceProfile;
import com.jacada.tracfoneAD.customerServiceProfile.model.interfaces.CustomerServiceProfileManager;

public class AccountBalancesThread extends Thread {

	CustomerServiceProfileManager customerServiceProfileManager;	
	String agentId;
	String esn;
	String brand;
	String phoneStatus;
	
	public AccountBalancesThread(CustomerServiceProfileManager customerServiceProfileManager, 
			String agentId, String esn, String brand,
			String phoneStatus) {
		super();
		this.customerServiceProfileManager = customerServiceProfileManager;
		this.agentId = agentId;
		this.esn = esn;
		this.brand = brand;
		this.phoneStatus = phoneStatus;
	}



	public void run() {		
		AccountBalances accountBalances= customerServiceProfileManager.getAccountBalances(
				brand, esn);
		accountBalances.setPhoneStatus(phoneStatus);
		CustomerServiceProfile customerServiceProfileAcct = new CustomerServiceProfile();
		customerServiceProfileAcct.setCallInfo(null);
		customerServiceProfileAcct.setCustomerProfile(null);
		customerServiceProfileAcct.setDeviceProfile(null);
		customerServiceProfileAcct.setServiceProfile(null);
		customerServiceProfileAcct.setAccountBalances(accountBalances);
		try {
			PushHelper.publishMessageToAgent(agentId, "AccountBalances", customerServiceProfileAcct);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}		
	}
	
}
