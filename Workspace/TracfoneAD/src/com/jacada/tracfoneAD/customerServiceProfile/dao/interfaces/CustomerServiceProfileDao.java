package com.jacada.tracfoneAD.customerServiceProfile.dao.interfaces;

import java.io.Serializable;

import com.jacada.tracfoneAD.customerServiceProfile.entities.CustomerServiceProfile;

public interface CustomerServiceProfileDao extends Serializable {
	CustomerServiceProfile getCustomerServiceProfile(String esn);
}
