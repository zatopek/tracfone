package com.jacada.tracfoneAD.customerServiceProfile.model;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import com.jacada.jad.feature.model.DefaultWorkspaceManager;
import com.jacada.jad.feature.annotations.FeatureManager;
import com.jacada.tracfoneAD.customerServiceProfile.entities.AccountBalances;
import com.jacada.tracfoneAD.customerServiceProfile.entities.CustomerServiceProfile;
import com.jacada.tracfoneAD.customerServiceProfile.entities.Flash;
import com.jacada.tracfoneAD.customerServiceProfile.entities.ProductOffering;
import com.jacada.tracfoneAD.customerServiceProfile.entities.TasTicket;
import com.jacada.tracfoneAD.customerServiceProfile.model.interfaces.CustomerServiceProfileManager;
import com.tracfone.b2b.inquiryservices.balanceinquiry.GetBalanceByTransIdResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@FeatureManager(name = "CustomerServiceProfile")
@Component
public class DefaultCustomerServiceProfileManager extends DefaultWorkspaceManager
		implements CustomerServiceProfileManager {

	private static final long serialVersionUID = 1L;
	@Autowired
	private transient com.jacada.tracfoneAD.customerServiceProfile.dao.interfaces.CustomerServiceProfileDao customerServiceProfileDao;
	@Autowired
	private transient com.jacada.tracfoneAD.customerServiceProfile.dao.interfaces.BalanceInquiryDao balanceInquirySoapConnector;
	// sleep to get balance very 2 seconds
	private static int SLEEP_TIME = 2000;
	// 30 seconds max time to allow account balance service
	private static int MAX_TIME_LAPSE = 30000;


	@Override
	public CustomerServiceProfile getCustomerServiceProfile(String esn) {
		System.out.println("getCustomerServiceProfile=>" + esn);
		return customerServiceProfileDao.getCustomerServiceProfile(esn);
	}

	@Override
	public Map<String, String> getDeviceOsInformation(String partNumber) {
		return customerServiceProfileDao.getDeviceInformationFromPartNumber(partNumber);
	}

	@Override
	public AccountBalances getAccountBalances(String brand, String esn) {
		
		AccountBalances accountBalances = new AccountBalances();
		accountBalances.setDataBalance(AccountBalances.DATA_NOT_AVAILABLE);
		accountBalances.setSmsBalance(AccountBalances.DATA_NOT_AVAILABLE);
		accountBalances.setVoiceBalance(AccountBalances.DATA_NOT_AVAILABLE);
		
		try{
			if(brand != null && esn != null)
			{		
				boolean hasBalance = false;
				GetBalanceByTransIdResponse response = null;
				long startTime = System.currentTimeMillis();
				long lapsedTime = 0;
				while ((lapsedTime < MAX_TIME_LAPSE) && !hasBalance) {
					System.out.println("getAccountBalances=>lapsedTime=" + lapsedTime);
					response = balanceInquirySoapConnector.getAccountBalances(brand, esn);
					if (response != null && response.getBalance() != null && response.getBalance().getTotalBenefits() != null) {
						hasBalance = true;
						accountBalances.setSmsBalance(response.getBalance().getTotalBenefits().getText());
						accountBalances.setVoiceBalance(response.getBalance().getTotalBenefits().getVoice());
						accountBalances.setDataBalance(response.getBalance().getTotalBenefits().getData().getTotalDataUsage());
					} else {
						Thread.sleep(SLEEP_TIME);
					} 
					lapsedTime = System.currentTimeMillis() - startTime;
				}
			}			
		}
		catch(Exception e){
			accountBalances.setDataBalance(AccountBalances.DATA_NOT_AVAILABLE);
			accountBalances.setSmsBalance(AccountBalances.DATA_NOT_AVAILABLE);
			accountBalances.setVoiceBalance(AccountBalances.DATA_NOT_AVAILABLE);			
		}
		return accountBalances;
	}

	@Override
	public String getLatestPurchaseObjId(String esn, String brand) {
		return customerServiceProfileDao.getRecentPurchases(esn, brand);
	}

	@Override
	public List<TasTicket> getOpenedTickets(String esn) {
		return customerServiceProfileDao.getTicketHistory(esn);
	}

	@Override
	public List<Flash> getActiveFlashes(String esn) {
		return customerServiceProfileDao.getActiveFlashes(esn);		
	}

	@Override
	public LinkedHashMap<String, ProductOffering> getProductOfferings(String esn, String brand) {
		return customerServiceProfileDao.getProductOfferings(esn, brand);
	}
}
