package com.jacada.tracfoneAD.customerServiceProfile.dao;

import javax.xml.bind.JAXBElement;

import com.jacada.tracfoneAD.callHandling.web.DefaultCallHandlingController;
import com.jacada.tracfoneAD.customerServiceProfile.dao.interfaces.BalanceInquiryDao;
import com.jacada.tracfoneAD.customerServiceProfile.entities.AccountBalances;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.ws.client.core.support.WebServiceGatewaySupport;
import org.springframework.ws.soap.client.core.SoapActionCallback;

import com.tracfone.b2b.inquiryservices.balanceinquiry.DataUnitsType;
import com.tracfone.b2b.inquiryservices.balanceinquiry.GetBalanceByTransIdRequest;
import com.tracfone.b2b.inquiryservices.balanceinquiry.GetBalanceByTransIdResponse;
import com.tracfone.b2b.inquiryservices.balanceinquiry.GetBalanceRequest;
import com.tracfone.b2b.inquiryservices.balanceinquiry.GetBalanceResponse;
import com.tracfone.b2b.inquiryservices.balanceinquiry.InquiryType;
import com.tracfone.b2b.inquiryservices.balanceinquiry.ObjectFactory;
import com.tracfone.commontypes.LanguageType;
import com.tracfone.commontypes.TracfoneBrandType;
import com.tracfone.phonecommontypes.DeviceIdType;

public class WSBalanceInquiryDao extends WebServiceGatewaySupport implements BalanceInquiryDao {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	private static final Logger LOGGER = LoggerFactory.getLogger(WSBalanceInquiryDao.class);

	@Override
	public GetBalanceByTransIdResponse getAccountBalances(String brand, String esn) {

		try {
			GetBalanceResponse getBalanceResponse = this.getTransactionId(brand, esn);

			ObjectFactory objectFactory = new ObjectFactory();
			GetBalanceByTransIdRequest getBalanceByTransIdRequest = new GetBalanceByTransIdRequest();
			getBalanceByTransIdRequest.setLanguage(LanguageType.ENG);
			getBalanceByTransIdRequest.setBrandName(TracfoneBrandType.valueOf(brand.toUpperCase()));
			getBalanceByTransIdRequest.setSourceSystem("TAS");
			getBalanceByTransIdRequest.setDataUnitsType(DataUnitsType.MB);
			getBalanceByTransIdRequest.setBalanceTransId(getBalanceResponse.getBalanceTransId());
			getBalanceByTransIdRequest.setBalanceTransDateTime(getBalanceResponse.getBalanceTransDateTime());
			JAXBElement<GetBalanceByTransIdRequest> request = objectFactory
					.createGetBalanceByTransIdRequest(getBalanceByTransIdRequest);
			SoapActionCallback callback = new SoapActionCallback(
					"http://b2b.tracfone.com/InquiryServices/BalanceInquiry/getBalance");
			@SuppressWarnings("unchecked")
			JAXBElement<GetBalanceByTransIdResponse> response = (JAXBElement<GetBalanceByTransIdResponse>) getWebServiceTemplate()
					.marshalSendAndReceive(request, callback);
			return response.getValue();
		} catch (Exception e) {
			LOGGER.error("Exception trying to getAccountBalances", e);
		}
		return null;
	}

	private GetBalanceResponse getTransactionId(String brand, String esn) throws Exception {

		ObjectFactory objectFactory = new ObjectFactory();

		GetBalanceRequest getBalanceRequest = new GetBalanceRequest();
		getBalanceRequest.setLanguage(LanguageType.ENG);
		getBalanceRequest.setBrandName(TracfoneBrandType.valueOf(brand.toUpperCase()));
		getBalanceRequest.setSourceSystem("TAS");
		getBalanceRequest.setInquiryType(InquiryType.USAGE);
		DeviceIdType deviceIdType = new DeviceIdType();
		deviceIdType.setEsn(esn);
		getBalanceRequest.setDeviceIdentifier(deviceIdType);

		JAXBElement<GetBalanceRequest> request = objectFactory.createGetBalanceRequest(getBalanceRequest);
		SoapActionCallback callback = new SoapActionCallback(
				"http://b2b.tracfone.com/InquiryServices/BalanceInquiry/getBalance");

		@SuppressWarnings("unchecked")
		JAXBElement<GetBalanceResponse> response = (JAXBElement<GetBalanceResponse>) getWebServiceTemplate()
				.marshalSendAndReceive(request, callback);

		String balanceTransId = response.getValue().getBalanceTransId();

		LOGGER.debug("getBalanceTransId=>" + balanceTransId);
		return response.getValue();

	}

}
