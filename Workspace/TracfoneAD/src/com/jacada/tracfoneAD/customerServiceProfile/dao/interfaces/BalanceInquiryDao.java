package com.jacada.tracfoneAD.customerServiceProfile.dao.interfaces;

import java.io.Serializable;

import com.jacada.tracfoneAD.customerServiceProfile.entities.AccountBalances;
import com.tracfone.b2b.inquiryservices.balanceinquiry.GetBalanceByTransIdResponse;

public interface BalanceInquiryDao extends Serializable {
	public GetBalanceByTransIdResponse getAccountBalances(String brand, String esn);
}
