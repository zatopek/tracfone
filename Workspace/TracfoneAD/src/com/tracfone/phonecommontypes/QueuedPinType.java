
package com.tracfone.phonecommontypes;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for QueuedPinType complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="QueuedPinType">
 *   &lt;complexContent>
 *     &lt;extension base="{http://www.tracfone.com/PhoneCommonTypes}PinType">
 *       &lt;sequence>
 *         &lt;element name="description" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="priority" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="voice" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="sms" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="data" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="days" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="partClassName" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="partNumber" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="partDescription" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="customerPrice" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="lastTransactionTime" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="esnPlan" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="cardPlan" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="swapPlan" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="servicePlanId" type="{http://www.tracfone.com/PhoneCommonTypes}PlanIdType" minOccurs="0"/>
 *         &lt;element name="servicePlanName" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="servicePlanDescription" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="servicePlanDescription2" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="servicePlanDescription3" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="servicePlanDescription4" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="reserveID" type="{http://www.tracfone.com/CommonTypes}ObjectIdType" minOccurs="0"/>
 *         &lt;element name="reserveIndex" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="redeemNow" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *       &lt;/sequence>
 *     &lt;/extension>
 *   &lt;/complexContent>
 * &lt;/complexType>
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "QueuedPinType", propOrder = {
    "description",
    "priority",
    "voice",
    "sms",
    "data",
    "days",
    "partClassName",
    "partNumber",
    "partDescription",
    "customerPrice",
    "lastTransactionTime",
    "esnPlan",
    "cardPlan",
    "swapPlan",
    "servicePlanId",
    "servicePlanName",
    "servicePlanDescription",
    "servicePlanDescription2",
    "servicePlanDescription3",
    "servicePlanDescription4",
    "reserveID",
    "reserveIndex",
    "redeemNow"
})
public class QueuedPinType
    extends PinType
{

    protected String description;
    protected String priority;
    protected String voice;
    protected String sms;
    protected String data;
    protected String days;
    protected String partClassName;
    protected String partNumber;
    protected String partDescription;
    protected String customerPrice;
    protected String lastTransactionTime;
    protected String esnPlan;
    protected String cardPlan;
    protected String swapPlan;
    protected Integer servicePlanId;
    protected String servicePlanName;
    protected String servicePlanDescription;
    protected String servicePlanDescription2;
    protected String servicePlanDescription3;
    protected String servicePlanDescription4;
    protected String reserveID;
    protected String reserveIndex;
    protected String redeemNow;

    /**
     * Gets the value of the description property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getDescription() {
        return description;
    }

    /**
     * Sets the value of the description property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setDescription(String value) {
        this.description = value;
    }

    /**
     * Gets the value of the priority property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getPriority() {
        return priority;
    }

    /**
     * Sets the value of the priority property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setPriority(String value) {
        this.priority = value;
    }

    /**
     * Gets the value of the voice property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getVoice() {
        return voice;
    }

    /**
     * Sets the value of the voice property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setVoice(String value) {
        this.voice = value;
    }

    /**
     * Gets the value of the sms property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getSms() {
        return sms;
    }

    /**
     * Sets the value of the sms property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setSms(String value) {
        this.sms = value;
    }

    /**
     * Gets the value of the data property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getData() {
        return data;
    }

    /**
     * Sets the value of the data property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setData(String value) {
        this.data = value;
    }

    /**
     * Gets the value of the days property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getDays() {
        return days;
    }

    /**
     * Sets the value of the days property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setDays(String value) {
        this.days = value;
    }

    /**
     * Gets the value of the partClassName property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getPartClassName() {
        return partClassName;
    }

    /**
     * Sets the value of the partClassName property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setPartClassName(String value) {
        this.partClassName = value;
    }

    /**
     * Gets the value of the partNumber property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getPartNumber() {
        return partNumber;
    }

    /**
     * Sets the value of the partNumber property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setPartNumber(String value) {
        this.partNumber = value;
    }

    /**
     * Gets the value of the partDescription property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getPartDescription() {
        return partDescription;
    }

    /**
     * Sets the value of the partDescription property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setPartDescription(String value) {
        this.partDescription = value;
    }

    /**
     * Gets the value of the customerPrice property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getCustomerPrice() {
        return customerPrice;
    }

    /**
     * Sets the value of the customerPrice property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setCustomerPrice(String value) {
        this.customerPrice = value;
    }

    /**
     * Gets the value of the lastTransactionTime property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getLastTransactionTime() {
        return lastTransactionTime;
    }

    /**
     * Sets the value of the lastTransactionTime property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setLastTransactionTime(String value) {
        this.lastTransactionTime = value;
    }

    /**
     * Gets the value of the esnPlan property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getEsnPlan() {
        return esnPlan;
    }

    /**
     * Sets the value of the esnPlan property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setEsnPlan(String value) {
        this.esnPlan = value;
    }

    /**
     * Gets the value of the cardPlan property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getCardPlan() {
        return cardPlan;
    }

    /**
     * Sets the value of the cardPlan property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setCardPlan(String value) {
        this.cardPlan = value;
    }

    /**
     * Gets the value of the swapPlan property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getSwapPlan() {
        return swapPlan;
    }

    /**
     * Sets the value of the swapPlan property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setSwapPlan(String value) {
        this.swapPlan = value;
    }

    /**
     * Gets the value of the servicePlanId property.
     * 
     * @return
     *     possible object is
     *     {@link Integer }
     *     
     */
    public Integer getServicePlanId() {
        return servicePlanId;
    }

    /**
     * Sets the value of the servicePlanId property.
     * 
     * @param value
     *     allowed object is
     *     {@link Integer }
     *     
     */
    public void setServicePlanId(Integer value) {
        this.servicePlanId = value;
    }

    /**
     * Gets the value of the servicePlanName property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getServicePlanName() {
        return servicePlanName;
    }

    /**
     * Sets the value of the servicePlanName property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setServicePlanName(String value) {
        this.servicePlanName = value;
    }

    /**
     * Gets the value of the servicePlanDescription property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getServicePlanDescription() {
        return servicePlanDescription;
    }

    /**
     * Sets the value of the servicePlanDescription property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setServicePlanDescription(String value) {
        this.servicePlanDescription = value;
    }

    /**
     * Gets the value of the servicePlanDescription2 property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getServicePlanDescription2() {
        return servicePlanDescription2;
    }

    /**
     * Sets the value of the servicePlanDescription2 property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setServicePlanDescription2(String value) {
        this.servicePlanDescription2 = value;
    }

    /**
     * Gets the value of the servicePlanDescription3 property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getServicePlanDescription3() {
        return servicePlanDescription3;
    }

    /**
     * Sets the value of the servicePlanDescription3 property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setServicePlanDescription3(String value) {
        this.servicePlanDescription3 = value;
    }

    /**
     * Gets the value of the servicePlanDescription4 property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getServicePlanDescription4() {
        return servicePlanDescription4;
    }

    /**
     * Sets the value of the servicePlanDescription4 property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setServicePlanDescription4(String value) {
        this.servicePlanDescription4 = value;
    }

    /**
     * Gets the value of the reserveID property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getReserveID() {
        return reserveID;
    }

    /**
     * Sets the value of the reserveID property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setReserveID(String value) {
        this.reserveID = value;
    }

    /**
     * Gets the value of the reserveIndex property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getReserveIndex() {
        return reserveIndex;
    }

    /**
     * Sets the value of the reserveIndex property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setReserveIndex(String value) {
        this.reserveIndex = value;
    }

    /**
     * Gets the value of the redeemNow property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getRedeemNow() {
        return redeemNow;
    }

    /**
     * Sets the value of the redeemNow property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setRedeemNow(String value) {
        this.redeemNow = value;
    }

}
