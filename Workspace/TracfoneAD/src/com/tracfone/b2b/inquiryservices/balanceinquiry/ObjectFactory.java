
package com.tracfone.b2b.inquiryservices.balanceinquiry;

import javax.xml.bind.JAXBElement;
import javax.xml.bind.annotation.XmlElementDecl;
import javax.xml.bind.annotation.XmlRegistry;
import javax.xml.namespace.QName;


/**
 * This object contains factory methods for each 
 * Java content interface and Java element interface 
 * generated in the com.tracfone.b2b.inquiryservices.balanceinquiry package. 
 * <p>An ObjectFactory allows you to programatically 
 * construct new instances of the Java representation 
 * for XML content. The Java representation of XML 
 * content can consist of schema derived interfaces 
 * and classes representing the binding of schema 
 * type definitions, element declarations and model 
 * groups.  Factory methods for each of these are 
 * provided in this class.
 * 
 */
@XmlRegistry
public class ObjectFactory {

    private final static QName _GetBalanceSyncRequest_QNAME = new QName("http://b2b.tracfone.com/InquiryServices/BalanceInquiry", "getBalanceSyncRequest");
    private final static QName _GetBalanceSyncResponse_QNAME = new QName("http://b2b.tracfone.com/InquiryServices/BalanceInquiry", "getBalanceSyncResponse");
    private final static QName _GetBalanceRequest_QNAME = new QName("http://b2b.tracfone.com/InquiryServices/BalanceInquiry", "getBalanceRequest");
    private final static QName _GetBalanceByTransIdRequest_QNAME = new QName("http://b2b.tracfone.com/InquiryServices/BalanceInquiry", "getBalanceByTransIdRequest");
    private final static QName _GetBalanceByTransIdResponse_QNAME = new QName("http://b2b.tracfone.com/InquiryServices/BalanceInquiry", "getBalanceByTransIdResponse");
    private final static QName _GetBalanceResponse_QNAME = new QName("http://b2b.tracfone.com/InquiryServices/BalanceInquiry", "getBalanceResponse");

    /**
     * Create a new ObjectFactory that can be used to create new instances of schema derived classes for package: com.tracfone.b2b.inquiryservices.balanceinquiry
     * 
     */
    public ObjectFactory() {
    }

    /**
     * Create an instance of {@link GetBalanceByTransIdResponse }
     * 
     */
    public GetBalanceByTransIdResponse createGetBalanceByTransIdResponse() {
        return new GetBalanceByTransIdResponse();
    }

    /**
     * Create an instance of {@link GetBalanceByTransIdRequest }
     * 
     */
    public GetBalanceByTransIdRequest createGetBalanceByTransIdRequest() {
        return new GetBalanceByTransIdRequest();
    }

    /**
     * Create an instance of {@link GetBalanceRequest }
     * 
     */
    public GetBalanceRequest createGetBalanceRequest() {
        return new GetBalanceRequest();
    }

    /**
     * Create an instance of {@link GetBalanceResponse }
     * 
     */
    public GetBalanceResponse createGetBalanceResponse() {
        return new GetBalanceResponse();
    }

    /**
     * Create an instance of {@link GetBalanceSyncRequest }
     * 
     */
    public GetBalanceSyncRequest createGetBalanceSyncRequest() {
        return new GetBalanceSyncRequest();
    }

    /**
     * Create an instance of {@link GetBalanceSyncResponse }
     * 
     */
    public GetBalanceSyncResponse createGetBalanceSyncResponse() {
        return new GetBalanceSyncResponse();
    }

    /**
     * Create an instance of {@link NotificationsType }
     * 
     */
    public NotificationsType createNotificationsType() {
        return new NotificationsType();
    }

    /**
     * Create an instance of {@link BenefitType }
     * 
     */
    public BenefitType createBenefitType() {
        return new BenefitType();
    }

    /**
     * Create an instance of {@link BucketsType }
     * 
     */
    public BucketsType createBucketsType() {
        return new BucketsType();
    }

    /**
     * Create an instance of {@link BenefitsType }
     * 
     */
    public BenefitsType createBenefitsType() {
        return new BenefitsType();
    }

    /**
     * Create an instance of {@link BalanceType }
     * 
     */
    public BalanceType createBalanceType() {
        return new BalanceType();
    }

    /**
     * Create an instance of {@link DataUsageType }
     * 
     */
    public DataUsageType createDataUsageType() {
        return new DataUsageType();
    }

    /**
     * Create an instance of {@link CallBackType }
     * 
     */
    public CallBackType createCallBackType() {
        return new CallBackType();
    }

    /**
     * Create an instance of {@link JAXBElement }{@code <}{@link GetBalanceSyncRequest }{@code >}}
     * 
     */
    @XmlElementDecl(namespace = "http://b2b.tracfone.com/InquiryServices/BalanceInquiry", name = "getBalanceSyncRequest")
    public JAXBElement<GetBalanceSyncRequest> createGetBalanceSyncRequest(GetBalanceSyncRequest value) {
        return new JAXBElement<GetBalanceSyncRequest>(_GetBalanceSyncRequest_QNAME, GetBalanceSyncRequest.class, null, value);
    }

    /**
     * Create an instance of {@link JAXBElement }{@code <}{@link GetBalanceSyncResponse }{@code >}}
     * 
     */
    @XmlElementDecl(namespace = "http://b2b.tracfone.com/InquiryServices/BalanceInquiry", name = "getBalanceSyncResponse")
    public JAXBElement<GetBalanceSyncResponse> createGetBalanceSyncResponse(GetBalanceSyncResponse value) {
        return new JAXBElement<GetBalanceSyncResponse>(_GetBalanceSyncResponse_QNAME, GetBalanceSyncResponse.class, null, value);
    }

    /**
     * Create an instance of {@link JAXBElement }{@code <}{@link GetBalanceRequest }{@code >}}
     * 
     */
    @XmlElementDecl(namespace = "http://b2b.tracfone.com/InquiryServices/BalanceInquiry", name = "getBalanceRequest")
    public JAXBElement<GetBalanceRequest> createGetBalanceRequest(GetBalanceRequest value) {
        return new JAXBElement<GetBalanceRequest>(_GetBalanceRequest_QNAME, GetBalanceRequest.class, null, value);
    }

    /**
     * Create an instance of {@link JAXBElement }{@code <}{@link GetBalanceByTransIdRequest }{@code >}}
     * 
     */
    @XmlElementDecl(namespace = "http://b2b.tracfone.com/InquiryServices/BalanceInquiry", name = "getBalanceByTransIdRequest")
    public JAXBElement<GetBalanceByTransIdRequest> createGetBalanceByTransIdRequest(GetBalanceByTransIdRequest value) {
        return new JAXBElement<GetBalanceByTransIdRequest>(_GetBalanceByTransIdRequest_QNAME, GetBalanceByTransIdRequest.class, null, value);
    }

    /**
     * Create an instance of {@link JAXBElement }{@code <}{@link GetBalanceByTransIdResponse }{@code >}}
     * 
     */
    @XmlElementDecl(namespace = "http://b2b.tracfone.com/InquiryServices/BalanceInquiry", name = "getBalanceByTransIdResponse")
    public JAXBElement<GetBalanceByTransIdResponse> createGetBalanceByTransIdResponse(GetBalanceByTransIdResponse value) {
        return new JAXBElement<GetBalanceByTransIdResponse>(_GetBalanceByTransIdResponse_QNAME, GetBalanceByTransIdResponse.class, null, value);
    }

    /**
     * Create an instance of {@link JAXBElement }{@code <}{@link GetBalanceResponse }{@code >}}
     * 
     */
    @XmlElementDecl(namespace = "http://b2b.tracfone.com/InquiryServices/BalanceInquiry", name = "getBalanceResponse")
    public JAXBElement<GetBalanceResponse> createGetBalanceResponse(GetBalanceResponse value) {
        return new JAXBElement<GetBalanceResponse>(_GetBalanceResponse_QNAME, GetBalanceResponse.class, null, value);
    }

}
