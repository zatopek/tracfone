package com.jacada.tracfoneAD.customerServiceProfile.model;


import java.sql.ResultSet;
import java.sql.SQLException;

import com.jacada.jad.feature.model.DefaultWorkspaceManager;
import com.jacada.jad.feature.annotations.FeatureManager;
import com.jacada.tracfoneAD.customerServiceProfile.entities.AccountBalances;
import com.jacada.tracfoneAD.customerServiceProfile.entities.CustomerProfile;
import com.jacada.tracfoneAD.customerServiceProfile.entities.CustomerServiceProfile;
import com.jacada.tracfoneAD.customerServiceProfile.entities.DeviceProfile;
import com.jacada.tracfoneAD.customerServiceProfile.entities.ServiceProfile;
import com.jacada.tracfoneAD.customerServiceProfile.model.interfaces.CustomerServiceProfileManager;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@FeatureManager(name = "CustomerServiceProfile")
@Component
public class DefaultCustomerServiceProfileManager extends DefaultWorkspaceManager implements CustomerServiceProfileManager {

	private static final long serialVersionUID = 1L;
	@Autowired
	private transient com.jacada.tracfoneAD.customerServiceProfile.dao.interfaces.CustomerServiceProfileDao customerServiceProfile;
	public void setCustomerServiceProfile(com.jacada.tracfoneAD.customerServiceProfile.dao.interfaces.CustomerServiceProfileDao customerServiceProfile) {
		this.customerServiceProfile = customerServiceProfile;
	}


	@Override
	public CustomerServiceProfile getCustomerServiceProfile(String esn) {
		ResultSet rs = customerServiceProfile.getCustomerServiceProfile(esn);
		CustomerServiceProfile customerServiceProfile = new CustomerServiceProfile();
		try {
			if(rs.next()) {
	
				CustomerProfile customerProfile = new CustomerProfile();			
				DeviceProfile deviceProfile = new DeviceProfile();
				ServiceProfile serviceProfile = new ServiceProfile();
				AccountBalances accountBalances = new AccountBalances();
				
				try {
					deviceProfile.setDeviceType(rs.getString("device_type"));
					deviceProfile.setSim(rs.getString("sim"));
					deviceProfile.setSimStatus(rs.getString("sim_status"));
					deviceProfile.setMin(rs.getString("x_min"));
					deviceProfile.setMinStatus(rs.getString("min_status"));
					deviceProfile.setMsid(rs.getString("x_msid"));
					deviceProfile.setPhoneGen(rs.getString("phone_gen"));
					deviceProfile.setSerial(rs.getString("part_serial_no"));
					deviceProfile.setPartNumber(rs.getString("part_number"));
					deviceProfile.setLeasedToFinance(rs.getString("lease_status_flag"));
					deviceProfile.setLeaseStatus(rs.getString("lease_status_name"));
					deviceProfile.setSequence(rs.getString("sequence"));
					deviceProfile.setHexSerial(rs.getString("x_hex_serial_no"));
					
					serviceProfile.setServiceType(rs.getString("service_type"));
					serviceProfile.setRatePlan(rs.getString("rate_plan"));
					serviceProfile.setServicePlanObjId(rs.getString("service_plan_objid"));
					serviceProfile.setCarrier(rs.getString("carrier"));
					serviceProfile.setTechnology(rs.getString("technology") + "(" + rs.getString("technology_alt") + ")");
					serviceProfile.setActivationDate(rs.getString("install_date"));
					serviceProfile.setDeactDate(rs.getString("service_end_dt"));
					serviceProfile.setServiceEndDate(rs.getString("x_expire_dt"));
					serviceProfile.setNextChargeDate(rs.getString("next_charge_date"));
					serviceProfile.setBrand(rs.getString("brand"));
					serviceProfile.setDealer(rs.getString("dealer_name"));
					serviceProfile.setCardsInReserve(rs.getString("cards_in_queue"));
					serviceProfile.setWarrantyExchanges(rs.getString("warranty_exchanges"));
					serviceProfile.setBasicWarrantyFound(rs.getString("basic_warranty"));
					serviceProfile.setExtendedWarranty(rs.getString("extended_warranty"));
					serviceProfile.setCurrentThrottleStatus(rs.getString("x_policy_description"));
					serviceProfile.setAutoRefill((rs.getString("adf_next_refill_date")==null||rs.getString("adf_next_refill_date")=="")?"TRUE":"FALSE");
					
					customerProfile.setCustomerId(rs.getString("customer_id"));
					customerProfile.setContactName(rs.getString("first_name") + " " + rs.getString("last_name"));
					customerProfile.setEmail(rs.getString("e_mail"));
					customerProfile.setGroupId(rs.getString("groupid"));
					customerProfile.setZip(rs.getString("x_zipcode"));
					customerProfile.setLid(rs.getString("lid"));
					
					accountBalances.setPhoneStatus(rs.getString("phone_status"));
					
					customerServiceProfile.setDeviceProfile(deviceProfile);
					customerServiceProfile.setServiceProfile(serviceProfile);
					customerServiceProfile.setCustomerProfile(customerProfile);
					customerServiceProfile.setAccountBalances(accountBalances);
					
				} catch (SQLException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
			}
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return new CustomerServiceProfile();
	}


	@Override
	public String getOperatingSystem(String partNumber) {
		// TODO Auto-generated method stub
		return null;
	}

}
