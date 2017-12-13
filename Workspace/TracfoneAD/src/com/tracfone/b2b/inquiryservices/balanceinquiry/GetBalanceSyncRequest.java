
package com.tracfone.b2b.inquiryservices.balanceinquiry;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlAttribute;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlType;
import com.tracfone.commontypes.BaseRequestType;
import com.tracfone.phonecommontypes.DeviceIdType;


/**
 * 
 *           GetBalanceRequest extends BaseRequestType. BaseRequestType has Source, brand, language, clientId and 
 *           clientTransactionId
 *         
 * 
 * <p>Java class for GetBalanceSyncRequest complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="GetBalanceSyncRequest">
 *   &lt;complexContent>
 *     &lt;extension base="{http://www.tracfone.com/CommonTypes}BaseRequestType">
 *       &lt;sequence>
 *         &lt;element name="deviceIdentifier" type="{http://www.tracfone.com/PhoneCommonTypes}DeviceIdType"/>
 *         &lt;element name="inquiryType" type="{http://b2b.tracfone.com/InquiryServices/BalanceInquiry}InquiryType" minOccurs="0"/>
 *         &lt;element name="toleranceLevel" type="{http://b2b.tracfone.com/InquiryServices/BalanceInquiry}ToleranceLevelType"/>
 *         &lt;element name="dataUnitsType" type="{http://b2b.tracfone.com/InquiryServices/BalanceInquiry}DataUnitsType"/>
 *         &lt;element name="notifications" type="{http://b2b.tracfone.com/InquiryServices/BalanceInquiry}notificationsType" minOccurs="0"/>
 *       &lt;/sequence>
 *       &lt;attribute name="version" use="required" type="{http://www.w3.org/2001/XMLSchema}string" />
 *     &lt;/extension>
 *   &lt;/complexContent>
 * &lt;/complexType>
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "GetBalanceSyncRequest", propOrder = {
    "deviceIdentifier",
    "inquiryType",
    "toleranceLevel",
    "dataUnitsType",
    "notifications"
})
public class GetBalanceSyncRequest
    extends BaseRequestType
{

    @XmlElement(required = true)
    protected DeviceIdType deviceIdentifier;
    protected InquiryType inquiryType;
    @XmlElement(required = true)
    protected ToleranceLevelType toleranceLevel;
    @XmlElement(required = true)
    protected DataUnitsType dataUnitsType;
    protected NotificationsType notifications;
    @XmlAttribute(name = "version", required = true)
    protected String version;

    /**
     * Gets the value of the deviceIdentifier property.
     * 
     * @return
     *     possible object is
     *     {@link DeviceIdType }
     *     
     */
    public DeviceIdType getDeviceIdentifier() {
        return deviceIdentifier;
    }

    /**
     * Sets the value of the deviceIdentifier property.
     * 
     * @param value
     *     allowed object is
     *     {@link DeviceIdType }
     *     
     */
    public void setDeviceIdentifier(DeviceIdType value) {
        this.deviceIdentifier = value;
    }

    /**
     * Gets the value of the inquiryType property.
     * 
     * @return
     *     possible object is
     *     {@link InquiryType }
     *     
     */
    public InquiryType getInquiryType() {
        return inquiryType;
    }

    /**
     * Sets the value of the inquiryType property.
     * 
     * @param value
     *     allowed object is
     *     {@link InquiryType }
     *     
     */
    public void setInquiryType(InquiryType value) {
        this.inquiryType = value;
    }

    /**
     * Gets the value of the toleranceLevel property.
     * 
     * @return
     *     possible object is
     *     {@link ToleranceLevelType }
     *     
     */
    public ToleranceLevelType getToleranceLevel() {
        return toleranceLevel;
    }

    /**
     * Sets the value of the toleranceLevel property.
     * 
     * @param value
     *     allowed object is
     *     {@link ToleranceLevelType }
     *     
     */
    public void setToleranceLevel(ToleranceLevelType value) {
        this.toleranceLevel = value;
    }

    /**
     * Gets the value of the dataUnitsType property.
     * 
     * @return
     *     possible object is
     *     {@link DataUnitsType }
     *     
     */
    public DataUnitsType getDataUnitsType() {
        return dataUnitsType;
    }

    /**
     * Sets the value of the dataUnitsType property.
     * 
     * @param value
     *     allowed object is
     *     {@link DataUnitsType }
     *     
     */
    public void setDataUnitsType(DataUnitsType value) {
        this.dataUnitsType = value;
    }

    /**
     * Gets the value of the notifications property.
     * 
     * @return
     *     possible object is
     *     {@link NotificationsType }
     *     
     */
    public NotificationsType getNotifications() {
        return notifications;
    }

    /**
     * Sets the value of the notifications property.
     * 
     * @param value
     *     allowed object is
     *     {@link NotificationsType }
     *     
     */
    public void setNotifications(NotificationsType value) {
        this.notifications = value;
    }

    /**
     * Gets the value of the version property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getVersion() {
        return version;
    }

    /**
     * Sets the value of the version property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setVersion(String value) {
        this.version = value;
    }

}
