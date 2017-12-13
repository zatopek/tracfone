
package com.tracfone.b2b.inquiryservices.balanceinquiry;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlType;
import com.tracfone.commontypes.YesNoType;


/**
 * <p>Java class for CallBackType complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="CallBackType">
 *   &lt;complexContent>
 *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
 *       &lt;sequence>
 *         &lt;element name="isCallBackRequired" type="{http://www.tracfone.com/CommonTypes}yesNoType"/>
 *         &lt;element name="callBackURL" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *       &lt;/sequence>
 *     &lt;/restriction>
 *   &lt;/complexContent>
 * &lt;/complexType>
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "CallBackType", propOrder = {
    "isCallBackRequired",
    "callBackURL"
})
public class CallBackType {

    @XmlElement(required = true, defaultValue = "no")
    protected YesNoType isCallBackRequired;
    protected String callBackURL;

    /**
     * Gets the value of the isCallBackRequired property.
     * 
     * @return
     *     possible object is
     *     {@link YesNoType }
     *     
     */
    public YesNoType getIsCallBackRequired() {
        return isCallBackRequired;
    }

    /**
     * Sets the value of the isCallBackRequired property.
     * 
     * @param value
     *     allowed object is
     *     {@link YesNoType }
     *     
     */
    public void setIsCallBackRequired(YesNoType value) {
        this.isCallBackRequired = value;
    }

    /**
     * Gets the value of the callBackURL property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getCallBackURL() {
        return callBackURL;
    }

    /**
     * Sets the value of the callBackURL property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setCallBackURL(String value) {
        this.callBackURL = value;
    }

}
