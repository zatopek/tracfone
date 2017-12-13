package com.jacada.tracfoneAD.customerServiceProfile.dao.interfaces;

import java.io.Serializable;
import java.sql.ResultSet;

import com.jacada.tracfoneAD.customerServiceProfile.entities.CustomerServiceProfile;

public interface CustomerServiceProfileDao extends Serializable {
	public ResultSet getCustomerServiceProfile(String esn);
	public ResultSet getOperatingSystem(String partNumber);
}
