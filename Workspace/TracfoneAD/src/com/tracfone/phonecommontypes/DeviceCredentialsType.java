
package com.tracfone.phonecommontypes;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlAttribute;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for DeviceCredentialsType complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="DeviceCredentialsType">
 *   &lt;complexContent>
 *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
 *       &lt;sequence>
 *         &lt;element name="deviceId" type="{http://www.tracfone.com/PhoneCommonTypes}DeviceIdType"/>
 *         &lt;element name="securityPin" type="{http://www.tracfone.com/PhoneCommonTypes}SecurityPinType"/>
 *       &lt;/sequence>
 *       &lt;attribute name="loggable" use="required" type="{http://www.w3.org/2001/XMLSchema}boolean" fixed="false" />
 *     &lt;/restriction>
 *   &lt;/complexContent>
 * &lt;/complexType>
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "DeviceCredentialsType", propOrder = {
    "deviceId",
    "securityPin"
})
public class DeviceCredentialsType {

    @XmlElement(required = true)
    protected DeviceIdType deviceId;
    @XmlElement(required = true)
    protected String securityPin;
    @XmlAttribute(name = "loggable", required = true)
    protected boolean loggable;

    /**
     * Gets the value of the deviceId property.
     * 
     * @return
     *     possible object is
     *     {@link DeviceIdType }
     *     
     */
    public DeviceIdType getDeviceId() {
        return deviceId;
    }

    /**
     * Sets the value of the deviceId property.
     * 
     * @param value
     *     allowed object is
     *     {@link DeviceIdType }
     *     
     */
    public void setDeviceId(DeviceIdType value) {
        this.deviceId = value;
    }

    /**
     * Gets the value of the securityPin property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getSecurityPin() {
        return securityPin;
    }

    /**
     * Sets the value of the securityPin property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setSecurityPin(String value) {
        this.securityPin = value;
    }

    /**
     * Gets the value of the loggable property.
     * 
     */
    public boolean isLoggable() {
        return loggable;
    }

    /**
     * Sets the value of the loggable property.
     * 
     */
    public void setLoggable(boolean value) {
        this.loggable = value;
    }

}
