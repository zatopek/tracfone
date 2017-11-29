package com.jacada.tracfoneAD.customerServiceProfile.model.interfaces;

import org.springframework.stereotype.Component;

import com.jacada.jad.feature.model.WorkspaceManager;
import com.jacada.tracfoneAD.customerServiceProfile.entities.CustomerServiceProfile;

public interface CustomerServiceProfileManager extends WorkspaceManager {
	CustomerServiceProfile getCustomerServiceProfile(String esn);
}
