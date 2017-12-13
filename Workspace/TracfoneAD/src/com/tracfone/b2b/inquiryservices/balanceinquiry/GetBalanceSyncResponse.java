
package com.tracfone.b2b.inquiryservices.balanceinquiry;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlSchemaType;
import javax.xml.bind.annotation.XmlType;
import javax.xml.datatype.XMLGregorianCalendar;
import com.tracfone.commontypes.BaseResponseType;


/**
 * <p>Java class for GetBalanceSyncResponse complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="GetBalanceSyncResponse">
 *   &lt;complexContent>
 *     &lt;extension base="{http://www.tracfone.com/CommonTypes}BaseResponseType">
 *       &lt;sequence>
 *         &lt;element name="balanceTransId" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *         &lt;element name="balanceTransDate" type="{http://www.w3.org/2001/XMLSchema}dateTime" minOccurs="0"/>
 *         &lt;element name="servicePlanType" type="{http://b2b.tracfone.com/InquiryServices/BalanceInquiry}ServicePlanType" minOccurs="0"/>
 *         &lt;element name="balance" type="{http://b2b.tracfone.com/InquiryServices/BalanceInquiry}BalanceType" minOccurs="0"/>
 *         &lt;element name="serviceEndDate" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="nextBillingCycle" type="{http://www.w3.org/2001/XMLSchema}date" minOccurs="0"/>
 *       &lt;/sequence>
 *     &lt;/extension>
 *   &lt;/complexContent>
 * &lt;/complexType>
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "GetBalanceSyncResponse", propOrder = {
    "balanceTransId",
    "balanceTransDate",
    "servicePlanType",
    "balance",
    "serviceEndDate",
    "nextBillingCycle"
})
public class GetBalanceSyncResponse
    extends BaseResponseType
{

    @XmlElement(required = true)
    protected String balanceTransId;
    @XmlSchemaType(name = "dateTime")
    protected XMLGregorianCalendar balanceTransDate;
    protected ServicePlanType servicePlanType;
    protected BalanceType balance;
    protected String serviceEndDate;
    @XmlSchemaType(name = "date")
    protected XMLGregorianCalendar nextBillingCycle;

    /**
     * Gets the value of the balanceTransId property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getBalanceTransId() {
        return balanceTransId;
    }

    /**
     * Sets the value of the balanceTransId property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setBalanceTransId(String value) {
        this.balanceTransId = value;
    }

    /**
     * Gets the value of the balanceTransDate property.
     * 
     * @return
     *     possible object is
     *     {@link XMLGregorianCalendar }
     *     
     */
    public XMLGregorianCalendar getBalanceTransDate() {
        return balanceTransDate;
    }

    /**
     * Sets the value of the balanceTransDate property.
     * 
     * @param value
     *     allowed object is
     *     {@link XMLGregorianCalendar }
     *     
     */
    public void setBalanceTransDate(XMLGregorianCalendar value) {
        this.balanceTransDate = value;
    }

    /**
     * Gets the value of the servicePlanType property.
     * 
     * @return
     *     possible object is
     *     {@link ServicePlanType }
     *     
     */
    public ServicePlanType getServicePlanType() {
        return servicePlanType;
    }

    /**
     * Sets the value of the servicePlanType property.
     * 
     * @param value
     *     allowed object is
     *     {@link ServicePlanType }
     *     
     */
    public void setServicePlanType(ServicePlanType value) {
        this.servicePlanType = value;
    }

    /**
     * Gets the value of the balance property.
     * 
     * @return
     *     possible object is
     *     {@link BalanceType }
     *     
     */
    public BalanceType getBalance() {
        return balance;
    }

    /**
     * Sets the value of the balance property.
     * 
     * @param value
     *     allowed object is
     *     {@link BalanceType }
     *     
     */
    public void setBalance(BalanceType value) {
        this.balance = value;
    }

    /**
     * Gets the value of the serviceEndDate property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getServiceEndDate() {
        return serviceEndDate;
    }

    /**
     * Sets the value of the serviceEndDate property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setServiceEndDate(String value) {
        this.serviceEndDate = value;
    }

    /**
     * Gets the value of the nextBillingCycle property.
     * 
     * @return
     *     possible object is
     *     {@link XMLGregorianCalendar }
     *     
     */
    public XMLGregorianCalendar getNextBillingCycle() {
        return nextBillingCycle;
    }

    /**
     * Sets the value of the nextBillingCycle property.
     * 
     * @param value
     *     allowed object is
     *     {@link XMLGregorianCalendar }
     *     
     */
    public void setNextBillingCycle(XMLGregorianCalendar value) {
        this.nextBillingCycle = value;
    }

}
