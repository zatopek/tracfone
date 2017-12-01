package com.jacada.tracfoneAD.customerServiceProfile.dao.interfaces;

import java.io.Serializable;
import java.sql.ResultSet;

import com.jacada.tracfoneAD.customerServiceProfile.entities.CustomerServiceProfile;

public interface CustomerServiceProfileDao extends Serializable {
	ResultSet getCustomerServiceProfile(String esn);
	ResultSet getOperatingSystem(String partNumber);
}
