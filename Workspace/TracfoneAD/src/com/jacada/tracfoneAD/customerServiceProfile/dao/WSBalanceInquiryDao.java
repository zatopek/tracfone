package com.jacada.tracfoneAD.customerServiceProfile.dao;

import javax.xml.bind.JAXBElement;

import com.jacada.tracfoneAD.customerServiceProfile.dao.interfaces.BalanceInquiryDao;
import com.jacada.tracfoneAD.customerServiceProfile.entities.AccountBalances;

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

	@Override
	public GetBalanceByTransIdResponse getAccountBalances(String brand, String esn) {
		System.out.println("WSBalanceInquiryDao");
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
			JAXBElement<GetBalanceByTransIdRequest> request = objectFactory.createGetBalanceByTransIdRequest(getBalanceByTransIdRequest);	
			SoapActionCallback callback = new SoapActionCallback("http://b2b.tracfone.com/InquiryServices/BalanceInquiry/getBalance");
			@SuppressWarnings("unchecked")
			JAXBElement<GetBalanceByTransIdResponse> response = (JAXBElement<GetBalanceByTransIdResponse>)getWebServiceTemplate().marshalSendAndReceive(request, callback);
			return response.getValue();
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return null;
	}
	
	private GetBalanceResponse getTransactionId(String brand, String esn) throws Exception {

			System.out.println("getTransactionId start");
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
			SoapActionCallback callback = new SoapActionCallback("http://b2b.tracfone.com/InquiryServices/BalanceInquiry/getBalance");
			
			@SuppressWarnings("unchecked")
			JAXBElement<GetBalanceResponse> response = (JAXBElement<GetBalanceResponse>)getWebServiceTemplate().marshalSendAndReceive(request, callback);
			System.out.println("getTransactionId finished");
			String balanceTransId = response.getValue().getBalanceTransId();
			System.out.println("getBalanceTransId=>" + balanceTransId);
			return response.getValue();


	}
	
    
}
