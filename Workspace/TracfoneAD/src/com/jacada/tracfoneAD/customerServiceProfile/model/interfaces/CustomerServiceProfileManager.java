package com.jacada.tracfoneAD.customerServiceProfile.model.interfaces;

import java.util.LinkedHashMap;
import java.util.List;

import com.jacada.jad.feature.model.WorkspaceManager;
import com.jacada.tracfoneAD.customerServiceProfile.entities.AccountBalances;
import com.jacada.tracfoneAD.customerServiceProfile.entities.CustomerServiceProfile;
import com.jacada.tracfoneAD.customerServiceProfile.entities.ProductOffering;
import com.jacada.tracfoneAD.customerServiceProfile.entities.TasTicket;

public interface CustomerServiceProfileManager extends WorkspaceManager {
	CustomerServiceProfile getCustomerServiceProfile(String esn);
	AccountBalances getAccountBalances(String phoeStatus, String brand, String esn);
	String getOperatingSystem(String partNumber);
	String getLatestPurchaseObjId(String esn, String brand);
	List<TasTicket> getOpenedTickets(String esn);
	LinkedHashMap<String, ProductOffering>getProductOfferings(String esn, String brand);
}
