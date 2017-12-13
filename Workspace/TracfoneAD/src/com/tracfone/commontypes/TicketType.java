
package com.tracfone.commontypes;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for TicketType complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="TicketType">
 *   &lt;complexContent>
 *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
 *       &lt;sequence>
 *         &lt;element name="caseId" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="caseType" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="caseTitle" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="caseStatus" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="caseEsn" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="caseMin" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="caseIssue" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="casePartType" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="caseObjid" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="caseCondition" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="caseTracking" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="caseDeliverDate" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="caseNotes" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="caseOldNotes" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="caseResolution" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="caseCreateDate" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="customerObjid" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="customerFirstName" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="customerLastName" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="customerPrimaryAddress1" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="customerPrimaryAddress2" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="customerPrimaryCity" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="customerPrimaryState" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="customerPrimaryZipCode" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="customerHomePhone" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="contactEmail" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="customerSsn" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="customerShippingFirstName" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="customerShippingLastName" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="customerShippingHomePhone" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="customerShippingAddress1" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="customerShippingAddress2" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="customerShippingCity" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="customerSippingState" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="customerShippingZipCode" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="customerShippingCountry" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="latestTracking" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="pointOfContact" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="enrollNextChargeDate" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="currentCarrierName" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="currentCarrierOtherName" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="enrollRecurrentPlan" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="assignedCarrierID" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="phoneStatus" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="zipCode" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="recurrent" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="email" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="lastName" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="activationZipCode" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="currentEsn" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="pin" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="currentMin" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="simID" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="unitsReplaceCaseID" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="name" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="account" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="lineStatus" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="address1" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="address2" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="enrollAutoRefill" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="assignedCarrierName" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="servicePlanID" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="currentCarrierID" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="homePhone" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="enrollPaymentSourceID" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="attribute_city" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="attribute_state" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="attribute_carrier_name" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="attribute_cust_email" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *       &lt;/sequence>
 *     &lt;/restriction>
 *   &lt;/complexContent>
 * &lt;/complexType>
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "TicketType", propOrder = {
    "caseId",
    "caseType",
    "caseTitle",
    "caseStatus",
    "caseEsn",
    "caseMin",
    "caseIssue",
    "casePartType",
    "caseObjid",
    "caseCondition",
    "caseTracking",
    "caseDeliverDate",
    "caseNotes",
    "caseOldNotes",
    "caseResolution",
    "caseCreateDate",
    "customerObjid",
    "customerFirstName",
    "customerLastName",
    "customerPrimaryAddress1",
    "customerPrimaryAddress2",
    "customerPrimaryCity",
    "customerPrimaryState",
    "customerPrimaryZipCode",
    "customerHomePhone",
    "contactEmail",
    "customerSsn",
    "customerShippingFirstName",
    "customerShippingLastName",
    "customerShippingHomePhone",
    "customerShippingAddress1",
    "customerShippingAddress2",
    "customerShippingCity",
    "customerSippingState",
    "customerShippingZipCode",
    "customerShippingCountry",
    "latestTracking",
    "pointOfContact",
    "enrollNextChargeDate",
    "currentCarrierName",
    "currentCarrierOtherName",
    "enrollRecurrentPlan",
    "assignedCarrierID",
    "phoneStatus",
    "zipCode",
    "recurrent",
    "email",
    "lastName",
    "activationZipCode",
    "currentEsn",
    "pin",
    "currentMin",
    "simID",
    "unitsReplaceCaseID",
    "name",
    "account",
    "lineStatus",
    "address1",
    "address2",
    "enrollAutoRefill",
    "assignedCarrierName",
    "servicePlanID",
    "currentCarrierID",
    "homePhone",
    "enrollPaymentSourceID",
    "attributeCity",
    "attributeState",
    "attributeCarrierName",
    "attributeCustEmail"
})
public class TicketType {

    protected String caseId;
    protected String caseType;
    protected String caseTitle;
    protected String caseStatus;
    protected String caseEsn;
    protected String caseMin;
    protected String caseIssue;
    protected String casePartType;
    protected String caseObjid;
    protected String caseCondition;
    protected String caseTracking;
    protected String caseDeliverDate;
    protected String caseNotes;
    protected String caseOldNotes;
    protected String caseResolution;
    protected String caseCreateDate;
    protected String customerObjid;
    protected String customerFirstName;
    protected String customerLastName;
    protected String customerPrimaryAddress1;
    protected String customerPrimaryAddress2;
    protected String customerPrimaryCity;
    protected String customerPrimaryState;
    protected String customerPrimaryZipCode;
    protected String customerHomePhone;
    protected String contactEmail;
    protected String customerSsn;
    protected String customerShippingFirstName;
    protected String customerShippingLastName;
    protected String customerShippingHomePhone;
    protected String customerShippingAddress1;
    protected String customerShippingAddress2;
    protected String customerShippingCity;
    protected String customerSippingState;
    protected String customerShippingZipCode;
    protected String customerShippingCountry;
    protected String latestTracking;
    protected String pointOfContact;
    protected String enrollNextChargeDate;
    protected String currentCarrierName;
    protected String currentCarrierOtherName;
    protected String enrollRecurrentPlan;
    protected String assignedCarrierID;
    protected String phoneStatus;
    protected String zipCode;
    protected String recurrent;
    protected String email;
    protected String lastName;
    protected String activationZipCode;
    protected String currentEsn;
    protected String pin;
    protected String currentMin;
    protected String simID;
    protected String unitsReplaceCaseID;
    protected String name;
    protected String account;
    protected String lineStatus;
    protected String address1;
    protected String address2;
    protected String enrollAutoRefill;
    protected String assignedCarrierName;
    protected String servicePlanID;
    protected String currentCarrierID;
    protected String homePhone;
    protected String enrollPaymentSourceID;
    @XmlElement(name = "attribute_city")
    protected String attributeCity;
    @XmlElement(name = "attribute_state")
    protected String attributeState;
    @XmlElement(name = "attribute_carrier_name")
    protected String attributeCarrierName;
    @XmlElement(name = "attribute_cust_email")
    protected String attributeCustEmail;

    /**
     * Gets the value of the caseId property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getCaseId() {
        return caseId;
    }

    /**
     * Sets the value of the caseId property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setCaseId(String value) {
        this.caseId = value;
    }

    /**
     * Gets the value of the caseType property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getCaseType() {
        return caseType;
    }

    /**
     * Sets the value of the caseType property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setCaseType(String value) {
        this.caseType = value;
    }

    /**
     * Gets the value of the caseTitle property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getCaseTitle() {
        return caseTitle;
    }

    /**
     * Sets the value of the caseTitle property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setCaseTitle(String value) {
        this.caseTitle = value;
    }

    /**
     * Gets the value of the caseStatus property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getCaseStatus() {
        return caseStatus;
    }

    /**
     * Sets the value of the caseStatus property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setCaseStatus(String value) {
        this.caseStatus = value;
    }

    /**
     * Gets the value of the caseEsn property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getCaseEsn() {
        return caseEsn;
    }

    /**
     * Sets the value of the caseEsn property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setCaseEsn(String value) {
        this.caseEsn = value;
    }

    /**
     * Gets the value of the caseMin property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getCaseMin() {
        return caseMin;
    }

    /**
     * Sets the value of the caseMin property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setCaseMin(String value) {
        this.caseMin = value;
    }

    /**
     * Gets the value of the caseIssue property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getCaseIssue() {
        return caseIssue;
    }

    /**
     * Sets the value of the caseIssue property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setCaseIssue(String value) {
        this.caseIssue = value;
    }

    /**
     * Gets the value of the casePartType property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getCasePartType() {
        return casePartType;
    }

    /**
     * Sets the value of the casePartType property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setCasePartType(String value) {
        this.casePartType = value;
    }

    /**
     * Gets the value of the caseObjid property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getCaseObjid() {
        return caseObjid;
    }

    /**
     * Sets the value of the caseObjid property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setCaseObjid(String value) {
        this.caseObjid = value;
    }

    /**
     * Gets the value of the caseCondition property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getCaseCondition() {
        return caseCondition;
    }

    /**
     * Sets the value of the caseCondition property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setCaseCondition(String value) {
        this.caseCondition = value;
    }

    /**
     * Gets the value of the caseTracking property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getCaseTracking() {
        return caseTracking;
    }

    /**
     * Sets the value of the caseTracking property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setCaseTracking(String value) {
        this.caseTracking = value;
    }

    /**
     * Gets the value of the caseDeliverDate property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getCaseDeliverDate() {
        return caseDeliverDate;
    }

    /**
     * Sets the value of the caseDeliverDate property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setCaseDeliverDate(String value) {
        this.caseDeliverDate = value;
    }

    /**
     * Gets the value of the caseNotes property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getCaseNotes() {
        return caseNotes;
    }

    /**
     * Sets the value of the caseNotes property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setCaseNotes(String value) {
        this.caseNotes = value;
    }

    /**
     * Gets the value of the caseOldNotes property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getCaseOldNotes() {
        return caseOldNotes;
    }

    /**
     * Sets the value of the caseOldNotes property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setCaseOldNotes(String value) {
        this.caseOldNotes = value;
    }

    /**
     * Gets the value of the caseResolution property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getCaseResolution() {
        return caseResolution;
    }

    /**
     * Sets the value of the caseResolution property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setCaseResolution(String value) {
        this.caseResolution = value;
    }

    /**
     * Gets the value of the caseCreateDate property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getCaseCreateDate() {
        return caseCreateDate;
    }

    /**
     * Sets the value of the caseCreateDate property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setCaseCreateDate(String value) {
        this.caseCreateDate = value;
    }

    /**
     * Gets the value of the customerObjid property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getCustomerObjid() {
        return customerObjid;
    }

    /**
     * Sets the value of the customerObjid property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setCustomerObjid(String value) {
        this.customerObjid = value;
    }

    /**
     * Gets the value of the customerFirstName property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getCustomerFirstName() {
        return customerFirstName;
    }

    /**
     * Sets the value of the customerFirstName property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setCustomerFirstName(String value) {
        this.customerFirstName = value;
    }

    /**
     * Gets the value of the customerLastName property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getCustomerLastName() {
        return customerLastName;
    }

    /**
     * Sets the value of the customerLastName property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setCustomerLastName(String value) {
        this.customerLastName = value;
    }

    /**
     * Gets the value of the customerPrimaryAddress1 property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getCustomerPrimaryAddress1() {
        return customerPrimaryAddress1;
    }

    /**
     * Sets the value of the customerPrimaryAddress1 property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setCustomerPrimaryAddress1(String value) {
        this.customerPrimaryAddress1 = value;
    }

    /**
     * Gets the value of the customerPrimaryAddress2 property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getCustomerPrimaryAddress2() {
        return customerPrimaryAddress2;
    }

    /**
     * Sets the value of the customerPrimaryAddress2 property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setCustomerPrimaryAddress2(String value) {
        this.customerPrimaryAddress2 = value;
    }

    /**
     * Gets the value of the customerPrimaryCity property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getCustomerPrimaryCity() {
        return customerPrimaryCity;
    }

    /**
     * Sets the value of the customerPrimaryCity property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setCustomerPrimaryCity(String value) {
        this.customerPrimaryCity = value;
    }

    /**
     * Gets the value of the customerPrimaryState property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getCustomerPrimaryState() {
        return customerPrimaryState;
    }

    /**
     * Sets the value of the customerPrimaryState property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setCustomerPrimaryState(String value) {
        this.customerPrimaryState = value;
    }

    /**
     * Gets the value of the customerPrimaryZipCode property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getCustomerPrimaryZipCode() {
        return customerPrimaryZipCode;
    }

    /**
     * Sets the value of the customerPrimaryZipCode property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setCustomerPrimaryZipCode(String value) {
        this.customerPrimaryZipCode = value;
    }

    /**
     * Gets the value of the customerHomePhone property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getCustomerHomePhone() {
        return customerHomePhone;
    }

    /**
     * Sets the value of the customerHomePhone property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setCustomerHomePhone(String value) {
        this.customerHomePhone = value;
    }

    /**
     * Gets the value of the contactEmail property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getContactEmail() {
        return contactEmail;
    }

    /**
     * Sets the value of the contactEmail property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setContactEmail(String value) {
        this.contactEmail = value;
    }

    /**
     * Gets the value of the customerSsn property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getCustomerSsn() {
        return customerSsn;
    }

    /**
     * Sets the value of the customerSsn property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setCustomerSsn(String value) {
        this.customerSsn = value;
    }

    /**
     * Gets the value of the customerShippingFirstName property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getCustomerShippingFirstName() {
        return customerShippingFirstName;
    }

    /**
     * Sets the value of the customerShippingFirstName property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setCustomerShippingFirstName(String value) {
        this.customerShippingFirstName = value;
    }

    /**
     * Gets the value of the customerShippingLastName property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getCustomerShippingLastName() {
        return customerShippingLastName;
    }

    /**
     * Sets the value of the customerShippingLastName property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setCustomerShippingLastName(String value) {
        this.customerShippingLastName = value;
    }

    /**
     * Gets the value of the customerShippingHomePhone property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getCustomerShippingHomePhone() {
        return customerShippingHomePhone;
    }

    /**
     * Sets the value of the customerShippingHomePhone property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setCustomerShippingHomePhone(String value) {
        this.customerShippingHomePhone = value;
    }

    /**
     * Gets the value of the customerShippingAddress1 property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getCustomerShippingAddress1() {
        return customerShippingAddress1;
    }

    /**
     * Sets the value of the customerShippingAddress1 property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setCustomerShippingAddress1(String value) {
        this.customerShippingAddress1 = value;
    }

    /**
     * Gets the value of the customerShippingAddress2 property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getCustomerShippingAddress2() {
        return customerShippingAddress2;
    }

    /**
     * Sets the value of the customerShippingAddress2 property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setCustomerShippingAddress2(String value) {
        this.customerShippingAddress2 = value;
    }

    /**
     * Gets the value of the customerShippingCity property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getCustomerShippingCity() {
        return customerShippingCity;
    }

    /**
     * Sets the value of the customerShippingCity property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setCustomerShippingCity(String value) {
        this.customerShippingCity = value;
    }

    /**
     * Gets the value of the customerSippingState property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getCustomerSippingState() {
        return customerSippingState;
    }

    /**
     * Sets the value of the customerSippingState property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setCustomerSippingState(String value) {
        this.customerSippingState = value;
    }

    /**
     * Gets the value of the customerShippingZipCode property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getCustomerShippingZipCode() {
        return customerShippingZipCode;
    }

    /**
     * Sets the value of the customerShippingZipCode property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setCustomerShippingZipCode(String value) {
        this.customerShippingZipCode = value;
    }

    /**
     * Gets the value of the customerShippingCountry property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getCustomerShippingCountry() {
        return customerShippingCountry;
    }

    /**
     * Sets the value of the customerShippingCountry property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setCustomerShippingCountry(String value) {
        this.customerShippingCountry = value;
    }

    /**
     * Gets the value of the latestTracking property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getLatestTracking() {
        return latestTracking;
    }

    /**
     * Sets the value of the latestTracking property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setLatestTracking(String value) {
        this.latestTracking = value;
    }

    /**
     * Gets the value of the pointOfContact property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getPointOfContact() {
        return pointOfContact;
    }

    /**
     * Sets the value of the pointOfContact property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setPointOfContact(String value) {
        this.pointOfContact = value;
    }

    /**
     * Gets the value of the enrollNextChargeDate property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getEnrollNextChargeDate() {
        return enrollNextChargeDate;
    }

    /**
     * Sets the value of the enrollNextChargeDate property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setEnrollNextChargeDate(String value) {
        this.enrollNextChargeDate = value;
    }

    /**
     * Gets the value of the currentCarrierName property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getCurrentCarrierName() {
        return currentCarrierName;
    }

    /**
     * Sets the value of the currentCarrierName property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setCurrentCarrierName(String value) {
        this.currentCarrierName = value;
    }

    /**
     * Gets the value of the currentCarrierOtherName property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getCurrentCarrierOtherName() {
        return currentCarrierOtherName;
    }

    /**
     * Sets the value of the currentCarrierOtherName property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setCurrentCarrierOtherName(String value) {
        this.currentCarrierOtherName = value;
    }

    /**
     * Gets the value of the enrollRecurrentPlan property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getEnrollRecurrentPlan() {
        return enrollRecurrentPlan;
    }

    /**
     * Sets the value of the enrollRecurrentPlan property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setEnrollRecurrentPlan(String value) {
        this.enrollRecurrentPlan = value;
    }

    /**
     * Gets the value of the assignedCarrierID property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getAssignedCarrierID() {
        return assignedCarrierID;
    }

    /**
     * Sets the value of the assignedCarrierID property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setAssignedCarrierID(String value) {
        this.assignedCarrierID = value;
    }

    /**
     * Gets the value of the phoneStatus property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getPhoneStatus() {
        return phoneStatus;
    }

    /**
     * Sets the value of the phoneStatus property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setPhoneStatus(String value) {
        this.phoneStatus = value;
    }

    /**
     * Gets the value of the zipCode property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getZipCode() {
        return zipCode;
    }

    /**
     * Sets the value of the zipCode property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setZipCode(String value) {
        this.zipCode = value;
    }

    /**
     * Gets the value of the recurrent property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getRecurrent() {
        return recurrent;
    }

    /**
     * Sets the value of the recurrent property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setRecurrent(String value) {
        this.recurrent = value;
    }

    /**
     * Gets the value of the email property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getEmail() {
        return email;
    }

    /**
     * Sets the value of the email property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setEmail(String value) {
        this.email = value;
    }

    /**
     * Gets the value of the lastName property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getLastName() {
        return lastName;
    }

    /**
     * Sets the value of the lastName property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setLastName(String value) {
        this.lastName = value;
    }

    /**
     * Gets the value of the activationZipCode property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getActivationZipCode() {
        return activationZipCode;
    }

    /**
     * Sets the value of the activationZipCode property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setActivationZipCode(String value) {
        this.activationZipCode = value;
    }

    /**
     * Gets the value of the currentEsn property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getCurrentEsn() {
        return currentEsn;
    }

    /**
     * Sets the value of the currentEsn property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setCurrentEsn(String value) {
        this.currentEsn = value;
    }

    /**
     * Gets the value of the pin property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getPin() {
        return pin;
    }

    /**
     * Sets the value of the pin property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setPin(String value) {
        this.pin = value;
    }

    /**
     * Gets the value of the currentMin property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getCurrentMin() {
        return currentMin;
    }

    /**
     * Sets the value of the currentMin property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setCurrentMin(String value) {
        this.currentMin = value;
    }

    /**
     * Gets the value of the simID property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getSimID() {
        return simID;
    }

    /**
     * Sets the value of the simID property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setSimID(String value) {
        this.simID = value;
    }

    /**
     * Gets the value of the unitsReplaceCaseID property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getUnitsReplaceCaseID() {
        return unitsReplaceCaseID;
    }

    /**
     * Sets the value of the unitsReplaceCaseID property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setUnitsReplaceCaseID(String value) {
        this.unitsReplaceCaseID = value;
    }

    /**
     * Gets the value of the name property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getName() {
        return name;
    }

    /**
     * Sets the value of the name property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setName(String value) {
        this.name = value;
    }

    /**
     * Gets the value of the account property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getAccount() {
        return account;
    }

    /**
     * Sets the value of the account property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setAccount(String value) {
        this.account = value;
    }

    /**
     * Gets the value of the lineStatus property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getLineStatus() {
        return lineStatus;
    }

    /**
     * Sets the value of the lineStatus property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setLineStatus(String value) {
        this.lineStatus = value;
    }

    /**
     * Gets the value of the address1 property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getAddress1() {
        return address1;
    }

    /**
     * Sets the value of the address1 property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setAddress1(String value) {
        this.address1 = value;
    }

    /**
     * Gets the value of the address2 property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getAddress2() {
        return address2;
    }

    /**
     * Sets the value of the address2 property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setAddress2(String value) {
        this.address2 = value;
    }

    /**
     * Gets the value of the enrollAutoRefill property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getEnrollAutoRefill() {
        return enrollAutoRefill;
    }

    /**
     * Sets the value of the enrollAutoRefill property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setEnrollAutoRefill(String value) {
        this.enrollAutoRefill = value;
    }

    /**
     * Gets the value of the assignedCarrierName property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getAssignedCarrierName() {
        return assignedCarrierName;
    }

    /**
     * Sets the value of the assignedCarrierName property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setAssignedCarrierName(String value) {
        this.assignedCarrierName = value;
    }

    /**
     * Gets the value of the servicePlanID property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getServicePlanID() {
        return servicePlanID;
    }

    /**
     * Sets the value of the servicePlanID property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setServicePlanID(String value) {
        this.servicePlanID = value;
    }

    /**
     * Gets the value of the currentCarrierID property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getCurrentCarrierID() {
        return currentCarrierID;
    }

    /**
     * Sets the value of the currentCarrierID property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setCurrentCarrierID(String value) {
        this.currentCarrierID = value;
    }

    /**
     * Gets the value of the homePhone property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getHomePhone() {
        return homePhone;
    }

    /**
     * Sets the value of the homePhone property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setHomePhone(String value) {
        this.homePhone = value;
    }

    /**
     * Gets the value of the enrollPaymentSourceID property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getEnrollPaymentSourceID() {
        return enrollPaymentSourceID;
    }

    /**
     * Sets the value of the enrollPaymentSourceID property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setEnrollPaymentSourceID(String value) {
        this.enrollPaymentSourceID = value;
    }

    /**
     * Gets the value of the attributeCity property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getAttributeCity() {
        return attributeCity;
    }

    /**
     * Sets the value of the attributeCity property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setAttributeCity(String value) {
        this.attributeCity = value;
    }

    /**
     * Gets the value of the attributeState property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getAttributeState() {
        return attributeState;
    }

    /**
     * Sets the value of the attributeState property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setAttributeState(String value) {
        this.attributeState = value;
    }

    /**
     * Gets the value of the attributeCarrierName property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getAttributeCarrierName() {
        return attributeCarrierName;
    }

    /**
     * Sets the value of the attributeCarrierName property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setAttributeCarrierName(String value) {
        this.attributeCarrierName = value;
    }

    /**
     * Gets the value of the attributeCustEmail property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getAttributeCustEmail() {
        return attributeCustEmail;
    }

    /**
     * Sets the value of the attributeCustEmail property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setAttributeCustEmail(String value) {
        this.attributeCustEmail = value;
    }

}
