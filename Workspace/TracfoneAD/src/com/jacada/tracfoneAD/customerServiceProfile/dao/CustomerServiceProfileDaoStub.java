package com.jacada.tracfoneAD.customerServiceProfile.dao;

import java.sql.ResultSet;

import com.jacada.tracfoneAD.customerServiceProfile.dao.interfaces.CustomerServiceProfileDao;
import com.jacada.tracfoneAD.customerServiceProfile.entities.CustomerServiceProfile;

public class CustomerServiceProfileDaoStub implements CustomerServiceProfileDao {

	private static final long serialVersionUID = 1L;

	@Override
	public ResultSet getCustomerServiceProfile(String esn) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public ResultSet getOperatingSystem(String partNumber) {
		// TODO Auto-generated method stub
		return null;
	}
}
