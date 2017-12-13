
package com.tracfone.b2b.inquiryservices.balanceinquiry;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for BucketsType complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="BucketsType">
 *   &lt;complexContent>
 *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
 *       &lt;sequence>
 *         &lt;element name="voice" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="text" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="data" type="{http://b2b.tracfone.com/InquiryServices/BalanceInquiry}DataUsageType" minOccurs="0"/>
 *         &lt;element name="roamingVoice" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *       &lt;/sequence>
 *     &lt;/restriction>
 *   &lt;/complexContent>
 * &lt;/complexType>
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "BucketsType", propOrder = {
    "voice",
    "text",
    "data",
    "roamingVoice"
})
public class BucketsType {

    protected String voice;
    protected String text;
    protected DataUsageType data;
    protected String roamingVoice;

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
     * Gets the value of the text property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getText() {
        return text;
    }

    /**
     * Sets the value of the text property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setText(String value) {
        this.text = value;
    }

    /**
     * Gets the value of the data property.
     * 
     * @return
     *     possible object is
     *     {@link DataUsageType }
     *     
     */
    public DataUsageType getData() {
        return data;
    }

    /**
     * Sets the value of the data property.
     * 
     * @param value
     *     allowed object is
     *     {@link DataUsageType }
     *     
     */
    public void setData(DataUsageType value) {
        this.data = value;
    }

    /**
     * Gets the value of the roamingVoice property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getRoamingVoice() {
        return roamingVoice;
    }

    /**
     * Sets the value of the roamingVoice property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setRoamingVoice(String value) {
        this.roamingVoice = value;
    }

}
