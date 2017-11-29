package com.jacada.tracfoneAD.customerServiceProfile.model;


import com.jacada.jad.feature.model.DefaultWorkspaceManager;
import com.jacada.jad.feature.annotations.FeatureManager;
import com.jacada.tracfoneAD.customerServiceProfile.entities.CustomerServiceProfile;
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
		// TODO Auto-generated method stub
		return new CustomerServiceProfile();
	}

}
