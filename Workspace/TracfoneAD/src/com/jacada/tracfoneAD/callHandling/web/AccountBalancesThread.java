package com.jacada.tracfoneAD.callHandling.web;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.jacada.jad.push.PushHelper;
import com.jacada.tracfoneAD.customerServiceProfile.entities.AccountBalances;
import com.jacada.tracfoneAD.customerServiceProfile.entities.CustomerServiceProfile;
import com.jacada.tracfoneAD.customerServiceProfile.model.interfaces.CustomerServiceProfileManager;

public class AccountBalancesThread extends Thread {

	private static final Logger LOGGER = LoggerFactory.getLogger(AccountBalancesThread.class);
	private CustomerServiceProfileManager customerServiceProfileManager;
	private String agentId;
	private String esn;
	private String brand;
	private String phoneStatus;

	public AccountBalancesThread(CustomerServiceProfileManager customerServiceProfileManager, String agentId,
			String esn, String brand, String phoneStatus) {
		super();
		this.customerServiceProfileManager = customerServiceProfileManager;
		this.agentId = agentId;
		this.esn = esn;
		this.brand = brand;
		this.phoneStatus = phoneStatus;
	}

	public void run() {
		try {
			CustomerServiceProfile customerServiceProfileAcct = new CustomerServiceProfile();

			AccountBalances accountBalances = customerServiceProfileManager.getAccountBalances(brand, esn);
			accountBalances.setPhoneStatus(phoneStatus);
			customerServiceProfileAcct.setCallInfo(null);
			customerServiceProfileAcct.setCustomerProfile(null);
			customerServiceProfileAcct.setDeviceProfile(null);
			customerServiceProfileAcct.setServiceProfile(null);
			customerServiceProfileAcct.setAccountBalances(accountBalances);

			PushHelper.publishMessageToAgent(agentId, "AccountBalances", customerServiceProfileAcct);
		} catch (Exception e) {
			LOGGER.error("Exception trying to get Customer Service Profile", e);
		}
	}
}
