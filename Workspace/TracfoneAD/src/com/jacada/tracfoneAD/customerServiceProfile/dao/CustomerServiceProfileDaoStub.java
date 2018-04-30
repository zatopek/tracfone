package com.jacada.tracfoneAD.customerServiceProfile.dao;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import com.jacada.tracfoneAD.customerServiceProfile.dao.interfaces.CustomerServiceProfileDao;
import com.jacada.tracfoneAD.customerServiceProfile.entities.CustomerServiceProfile;
import com.jacada.tracfoneAD.customerServiceProfile.entities.Flash;
import com.jacada.tracfoneAD.customerServiceProfile.entities.InteractionDetail;
import com.jacada.tracfoneAD.customerServiceProfile.entities.InteractionReason;
import com.jacada.tracfoneAD.customerServiceProfile.entities.ProductOffering;
import com.jacada.tracfoneAD.customerServiceProfile.entities.TasTicket;

public class CustomerServiceProfileDaoStub implements CustomerServiceProfileDao {

	private static final long serialVersionUID = 1L;

	@Override
	public CustomerServiceProfile getCustomerServiceProfile(String esn) {
		// TODO Auto-generated method stub
		return null;
	}
	
	@Override
	public String getRecentPurchases(String esn, String brand) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public List<TasTicket> getTicketHistory(String esn) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public List<InteractionReason> getInteractionReasons() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public List<InteractionDetail> getInteractionDetails() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public List<InteractionDetail> getInteractionDetails(String reasonObjId) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public List<InteractionReason> getResults() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public Map<String, String> getDeviceInformationFromPartNumber(
			String partNumber) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public LinkedHashMap<String, ProductOffering> getProductOfferings(
			String esn, String brand) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public List<Flash> getActiveFlashes(String esn) {
		// TODO Auto-generated method stub
		return null;
	}
}
