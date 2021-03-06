
package com.tracfone.b2b.inquiryservices.balanceinquiry;

import javax.jws.WebMethod;
import javax.jws.WebParam;
import javax.jws.WebResult;
import javax.jws.WebService;
import javax.jws.soap.SOAPBinding;


/**
 * This class was generated by the JAX-WS RI.
 * JAX-WS RI 2.2.4-b01
 * Generated source version: 2.0
 * 
 */
@WebService(name = "BalanceInquiryService", targetNamespace = "http://b2b.tracfone.com/InquiryServices/BalanceInquiry")
@SOAPBinding(parameterStyle = SOAPBinding.ParameterStyle.BARE)
public interface BalanceInquiryService {


    /**
     * 
     * @param payload
     * @return
     *     returns com.tracfone.b2b.inquiryservices.balanceinquiry.GetBalanceResponse
     */
    @WebMethod(action = "http://b2b.tracfone.com/InquiryServices/BalanceInquiry/getBalance")
    @WebResult(name = "getBalanceResponse", targetNamespace = "http://b2b.tracfone.com/InquiryServices/BalanceInquiry", partName = "payload")
    public GetBalanceResponse getBalance(
        @WebParam(name = "getBalanceRequest", targetNamespace = "http://b2b.tracfone.com/InquiryServices/BalanceInquiry", partName = "payload")
        GetBalanceRequest payload);

    /**
     * 
     * @param payload
     * @return
     *     returns com.tracfone.b2b.inquiryservices.balanceinquiry.GetBalanceByTransIdResponse
     */
    @WebMethod(action = "http://b2b.tracfone.com/InquiryServices/BalanceInquiry/getBalanceByTransId")
    @WebResult(name = "getBalanceByTransIdResponse", targetNamespace = "http://b2b.tracfone.com/InquiryServices/BalanceInquiry", partName = "payload")
    public GetBalanceByTransIdResponse getBalanceByTransId(
        @WebParam(name = "getBalanceByTransIdRequest", targetNamespace = "http://b2b.tracfone.com/InquiryServices/BalanceInquiry", partName = "payload")
        GetBalanceByTransIdRequest payload);

    /**
     * 
     * @param payload
     * @return
     *     returns com.tracfone.b2b.inquiryservices.balanceinquiry.GetBalanceSyncResponse
     */
    @WebMethod(action = "http://b2b.tracfone.com/InquiryServices/BalanceInquiry/getBalanceSync")
    @WebResult(name = "getBalanceSyncResponse", targetNamespace = "http://b2b.tracfone.com/InquiryServices/BalanceInquiry", partName = "payload")
    public GetBalanceSyncResponse getBalanceSync(
        @WebParam(name = "getBalanceSyncRequest", targetNamespace = "http://b2b.tracfone.com/InquiryServices/BalanceInquiry", partName = "payload")
        GetBalanceSyncRequest payload);

}
