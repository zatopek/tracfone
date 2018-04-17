package com.jacada.tracfoneAD.customerServiceProfile.dao.interfaces;

import java.io.Serializable;
import java.sql.ResultSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import com.jacada.tracfoneAD.customerServiceProfile.entities.CustomerServiceProfile;
import com.jacada.tracfoneAD.customerServiceProfile.entities.Flash;
import com.jacada.tracfoneAD.customerServiceProfile.entities.InteractionDetail;
import com.jacada.tracfoneAD.customerServiceProfile.entities.InteractionReason;
import com.jacada.tracfoneAD.customerServiceProfile.entities.ProductOffering;
import com.jacada.tracfoneAD.customerServiceProfile.entities.TasTicket;

public interface CustomerServiceProfileDao extends Serializable {
	public CustomerServiceProfile getCustomerServiceProfile(String esn);
	public Map<String, String> getDeviceInformationFromPartNumber(String partNumber);
	public String getRecentPurchases(String esn, String brand);
	public List<TasTicket> getTicketHistory(String esn);
	public LinkedHashMap<String, ProductOffering> getProductOfferings(String esn, String brand);
	public List<Flash> getActiveFlashes(String esn);
	public List<InteractionReason> getInteractionReasons();
	public List<InteractionDetail> getInteractionDetails();
	public List<InteractionDetail> getInteractionDetails(String reasonObjId);
	public List<InteractionReason> getResults();
}
