package com.jacada.tracfoneAD.customerServiceProfile.dao.interfaces;

import java.io.Serializable;
import java.sql.ResultSet;

import com.jacada.tracfoneAD.customerServiceProfile.entities.CustomerServiceProfile;

public interface CustomerServiceProfileDao extends Serializable {
	public ResultSet getCustomerServiceProfile(String esn);
	public ResultSet getDeviceInformationFromPartNumber(String partNumber);
	public ResultSet getRecentPurchases(String esn, String brand);
	public ResultSet getTicketHistory(String esn);
	public ResultSet getProductOfferings(String esn, String brand);
}
