
package com.tracfone.commontypes;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for BaseSecureRequestType complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="BaseSecureRequestType">
 *   &lt;complexContent>
 *     &lt;extension base="{http://www.tracfone.com/CommonTypes}BaseRequestType">
 *       &lt;sequence>
 *         &lt;element name="remoteIpAddress" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *       &lt;/sequence>
 *     &lt;/extension>
 *   &lt;/complexContent>
 * &lt;/complexType>
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "BaseSecureRequestType", propOrder = {
    "remoteIpAddress"
})
public class BaseSecureRequestType
    extends BaseRequestType
{

    @XmlElement(required = true)
    protected String remoteIpAddress;

    /**
     * Gets the value of the remoteIpAddress property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getRemoteIpAddress() {
        return remoteIpAddress;
    }

    /**
     * Sets the value of the remoteIpAddress property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setRemoteIpAddress(String value) {
        this.remoteIpAddress = value;
    }

}
