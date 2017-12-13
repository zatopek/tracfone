
package com.tracfone.commontypes;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for BaseRequestResponseType complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="BaseRequestResponseType">
 *   &lt;complexContent>
 *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
 *       &lt;sequence>
 *         &lt;element name="requestToken" type="{http://www.tracfone.com/CommonTypes}RequestorIdType"/>
 *       &lt;/sequence>
 *     &lt;/restriction>
 *   &lt;/complexContent>
 * &lt;/complexType>
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "BaseRequestResponseType", propOrder = {
    "requestToken"
})
public class BaseRequestResponseType {

    @XmlElement(required = true)
    protected RequestorIdType requestToken;

    /**
     * Gets the value of the requestToken property.
     * 
     * @return
     *     possible object is
     *     {@link RequestorIdType }
     *     
     */
    public RequestorIdType getRequestToken() {
        return requestToken;
    }

    /**
     * Sets the value of the requestToken property.
     * 
     * @param value
     *     allowed object is
     *     {@link RequestorIdType }
     *     
     */
    public void setRequestToken(RequestorIdType value) {
        this.requestToken = value;
    }

}
