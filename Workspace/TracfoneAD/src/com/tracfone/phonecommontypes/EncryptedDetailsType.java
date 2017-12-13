
package com.tracfone.phonecommontypes;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for EncryptedDetailsType complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="EncryptedDetailsType">
 *   &lt;complexContent>
 *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
 *       &lt;sequence>
 *         &lt;element name="encryptedCodes" type="{http://www.tracfone.com/PhoneCommonTypes}EncryptedCodesType" minOccurs="0"/>
 *         &lt;element name="encryptedSessionKey" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *       &lt;/sequence>
 *     &lt;/restriction>
 *   &lt;/complexContent>
 * &lt;/complexType>
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "EncryptedDetailsType", propOrder = {
    "encryptedCodes",
    "encryptedSessionKey"
})
public class EncryptedDetailsType {

    protected EncryptedCodesType encryptedCodes;
    protected String encryptedSessionKey;

    /**
     * Gets the value of the encryptedCodes property.
     * 
     * @return
     *     possible object is
     *     {@link EncryptedCodesType }
     *     
     */
    public EncryptedCodesType getEncryptedCodes() {
        return encryptedCodes;
    }

    /**
     * Sets the value of the encryptedCodes property.
     * 
     * @param value
     *     allowed object is
     *     {@link EncryptedCodesType }
     *     
     */
    public void setEncryptedCodes(EncryptedCodesType value) {
        this.encryptedCodes = value;
    }

    /**
     * Gets the value of the encryptedSessionKey property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getEncryptedSessionKey() {
        return encryptedSessionKey;
    }

    /**
     * Sets the value of the encryptedSessionKey property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setEncryptedSessionKey(String value) {
        this.encryptedSessionKey = value;
    }

}
