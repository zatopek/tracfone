
package com.tracfone.phonecommontypes;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlSchemaType;
import javax.xml.bind.annotation.XmlType;
import javax.xml.datatype.XMLGregorianCalendar;


/**
 * <p>Java class for DeviceWithAccountType complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="DeviceWithAccountType">
 *   &lt;complexContent>
 *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
 *       &lt;sequence>
 *         &lt;element name="min" type="{http://www.tracfone.com/PhoneCommonTypes}MINType" minOccurs="0"/>
 *         &lt;element name="esn" type="{http://www.tracfone.com/PhoneCommonTypes}ESNType" minOccurs="0"/>
 *         &lt;element name="nickName" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="handsetStatus" type="{http://www.tracfone.com/PhoneCommonTypes}ESNStatusType"/>
 *         &lt;element name="servicePlanName" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="servicePlanId" type="{http://www.tracfone.com/PhoneCommonTypes}PlanIdType" minOccurs="0"/>
 *         &lt;element name="serviceEndDate" type="{http://www.w3.org/2001/XMLSchema}date" minOccurs="0"/>
 *         &lt;element name="autoRefillStatus" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="reserveCount" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="defaultDevice" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="partClass" type="{http://www.tracfone.com/PhoneCommonTypes}PartClassType"/>
 *         &lt;element name="deviceType" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="phoneTechnology" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="deactivationDate" type="{http://www.w3.org/2001/XMLSchema}date" minOccurs="0"/>
 *         &lt;element name="canReactivate" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *       &lt;/sequence>
 *     &lt;/restriction>
 *   &lt;/complexContent>
 * &lt;/complexType>
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "DeviceWithAccountType", propOrder = {
    "min",
    "esn",
    "nickName",
    "handsetStatus",
    "servicePlanName",
    "servicePlanId",
    "serviceEndDate",
    "autoRefillStatus",
    "reserveCount",
    "defaultDevice",
    "partClass",
    "deviceType",
    "phoneTechnology",
    "deactivationDate",
    "canReactivate"
})
public class DeviceWithAccountType {

    protected String min;
    protected String esn;
    protected String nickName;
    @XmlElement(required = true)
    protected ESNStatusType handsetStatus;
    protected String servicePlanName;
    protected Integer servicePlanId;
    @XmlSchemaType(name = "date")
    protected XMLGregorianCalendar serviceEndDate;
    protected String autoRefillStatus;
    protected String reserveCount;
    protected String defaultDevice;
    @XmlElement(required = true)
    protected String partClass;
    protected String deviceType;
    protected String phoneTechnology;
    @XmlSchemaType(name = "date")
    protected XMLGregorianCalendar deactivationDate;
    protected String canReactivate;

    /**
     * Gets the value of the min property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getMin() {
        return min;
    }

    /**
     * Sets the value of the min property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setMin(String value) {
        this.min = value;
    }

    /**
     * Gets the value of the esn property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getEsn() {
        return esn;
    }

    /**
     * Sets the value of the esn property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setEsn(String value) {
        this.esn = value;
    }

    /**
     * Gets the value of the nickName property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getNickName() {
        return nickName;
    }

    /**
     * Sets the value of the nickName property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setNickName(String value) {
        this.nickName = value;
    }

    /**
     * Gets the value of the handsetStatus property.
     * 
     * @return
     *     possible object is
     *     {@link ESNStatusType }
     *     
     */
    public ESNStatusType getHandsetStatus() {
        return handsetStatus;
    }

    /**
     * Sets the value of the handsetStatus property.
     * 
     * @param value
     *     allowed object is
     *     {@link ESNStatusType }
     *     
     */
    public void setHandsetStatus(ESNStatusType value) {
        this.handsetStatus = value;
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
     * Gets the value of the serviceEndDate property.
     * 
     * @return
     *     possible object is
     *     {@link XMLGregorianCalendar }
     *     
     */
    public XMLGregorianCalendar getServiceEndDate() {
        return serviceEndDate;
    }

    /**
     * Sets the value of the serviceEndDate property.
     * 
     * @param value
     *     allowed object is
     *     {@link XMLGregorianCalendar }
     *     
     */
    public void setServiceEndDate(XMLGregorianCalendar value) {
        this.serviceEndDate = value;
    }

    /**
     * Gets the value of the autoRefillStatus property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getAutoRefillStatus() {
        return autoRefillStatus;
    }

    /**
     * Sets the value of the autoRefillStatus property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setAutoRefillStatus(String value) {
        this.autoRefillStatus = value;
    }

    /**
     * Gets the value of the reserveCount property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getReserveCount() {
        return reserveCount;
    }

    /**
     * Sets the value of the reserveCount property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setReserveCount(String value) {
        this.reserveCount = value;
    }

    /**
     * Gets the value of the defaultDevice property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getDefaultDevice() {
        return defaultDevice;
    }

    /**
     * Sets the value of the defaultDevice property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setDefaultDevice(String value) {
        this.defaultDevice = value;
    }

    /**
     * Gets the value of the partClass property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getPartClass() {
        return partClass;
    }

    /**
     * Sets the value of the partClass property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setPartClass(String value) {
        this.partClass = value;
    }

    /**
     * Gets the value of the deviceType property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getDeviceType() {
        return deviceType;
    }

    /**
     * Sets the value of the deviceType property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setDeviceType(String value) {
        this.deviceType = value;
    }

    /**
     * Gets the value of the phoneTechnology property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getPhoneTechnology() {
        return phoneTechnology;
    }

    /**
     * Sets the value of the phoneTechnology property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setPhoneTechnology(String value) {
        this.phoneTechnology = value;
    }

    /**
     * Gets the value of the deactivationDate property.
     * 
     * @return
     *     possible object is
     *     {@link XMLGregorianCalendar }
     *     
     */
    public XMLGregorianCalendar getDeactivationDate() {
        return deactivationDate;
    }

    /**
     * Sets the value of the deactivationDate property.
     * 
     * @param value
     *     allowed object is
     *     {@link XMLGregorianCalendar }
     *     
     */
    public void setDeactivationDate(XMLGregorianCalendar value) {
        this.deactivationDate = value;
    }

    /**
     * Gets the value of the canReactivate property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getCanReactivate() {
        return canReactivate;
    }

    /**
     * Sets the value of the canReactivate property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setCanReactivate(String value) {
        this.canReactivate = value;
    }

}
