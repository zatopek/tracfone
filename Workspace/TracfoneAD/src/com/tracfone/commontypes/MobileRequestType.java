
package com.tracfone.commontypes;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for MobileRequestType complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="MobileRequestType">
 *   &lt;complexContent>
 *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
 *       &lt;sequence>
 *         &lt;element name="clientAppName" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="clientAppVersion" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="deviceModel" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="OSVersion" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="consumerVersion" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *       &lt;/sequence>
 *     &lt;/restriction>
 *   &lt;/complexContent>
 * &lt;/complexType>
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "MobileRequestType", propOrder = {
    "clientAppName",
    "clientAppVersion",
    "deviceModel",
    "osVersion",
    "consumerVersion"
})
public class MobileRequestType {

    protected String clientAppName;
    protected String clientAppVersion;
    protected String deviceModel;
    @XmlElement(name = "OSVersion")
    protected String osVersion;
    protected String consumerVersion;

    /**
     * Gets the value of the clientAppName property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getClientAppName() {
        return clientAppName;
    }

    /**
     * Sets the value of the clientAppName property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setClientAppName(String value) {
        this.clientAppName = value;
    }

    /**
     * Gets the value of the clientAppVersion property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getClientAppVersion() {
        return clientAppVersion;
    }

    /**
     * Sets the value of the clientAppVersion property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setClientAppVersion(String value) {
        this.clientAppVersion = value;
    }

    /**
     * Gets the value of the deviceModel property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getDeviceModel() {
        return deviceModel;
    }

    /**
     * Sets the value of the deviceModel property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setDeviceModel(String value) {
        this.deviceModel = value;
    }

    /**
     * Gets the value of the osVersion property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getOSVersion() {
        return osVersion;
    }

    /**
     * Sets the value of the osVersion property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setOSVersion(String value) {
        this.osVersion = value;
    }

    /**
     * Gets the value of the consumerVersion property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getConsumerVersion() {
        return consumerVersion;
    }

    /**
     * Sets the value of the consumerVersion property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setConsumerVersion(String value) {
        this.consumerVersion = value;
    }

}
