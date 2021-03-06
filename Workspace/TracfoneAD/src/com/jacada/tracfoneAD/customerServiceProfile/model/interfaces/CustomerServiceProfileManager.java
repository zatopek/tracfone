package com.jacada.tracfoneAD.customerServiceProfile.model.interfaces;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import com.jacada.jad.feature.model.WorkspaceManager;
import com.jacada.tracfoneAD.customerServiceProfile.entities.AccountBalances;
import com.jacada.tracfoneAD.customerServiceProfile.entities.CustomerServiceProfile;
import com.jacada.tracfoneAD.customerServiceProfile.entities.Flash;
import com.jacada.tracfoneAD.customerServiceProfile.entities.InteractionDetail;
import com.jacada.tracfoneAD.customerServiceProfile.entities.InteractionReason;
import com.jacada.tracfoneAD.customerServiceProfile.entities.ProductOffering;
import com.jacada.tracfoneAD.customerServiceProfile.entities.TasTicket;

public interface CustomerServiceProfileManager extends WorkspaceManager {
	CustomerServiceProfile getCustomerServiceProfile(String esn);
	AccountBalances getAccountBalances(String brand, String esn);
	Map<String, String> getDeviceOsInformation(String partNumber);
	String getLatestPurchaseObjId(String esn, String brand);
	List<TasTicket> getOpenedTickets(String esn);
	List<Flash> getActiveFlashes(String esn);
	LinkedHashMap<String, ProductOffering>getProductOfferings(String esn, String brand);
	public List<InteractionReason> getInteractionReasons();
	public List<InteractionDetail> getInteractionDetails(String reasonObjId);
	public List<InteractionReason> getResults();	
}
