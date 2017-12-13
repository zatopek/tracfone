
package com.tracfone.phonecommontypes;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for PhoneCodesType complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="PhoneCodesType">
 *   &lt;complexContent>
 *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
 *       &lt;sequence>
 *         &lt;element name="unlockingCodes" type="{http://www.tracfone.com/PhoneCommonTypes}PhoneUnlockingCodesType" minOccurs="0"/>
 *         &lt;element name="genCodes" type="{http://www.tracfone.com/PhoneCommonTypes}GenCodesType" minOccurs="0"/>
 *         &lt;element name="spcCodes" type="{http://www.tracfone.com/PhoneCommonTypes}SpcCodesType" minOccurs="0"/>
 *       &lt;/sequence>
 *     &lt;/restriction>
 *   &lt;/complexContent>
 * &lt;/complexType>
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "PhoneCodesType", propOrder = {
    "unlockingCodes",
    "genCodes",
    "spcCodes"
})
public class PhoneCodesType {

    protected PhoneUnlockingCodesType unlockingCodes;
    protected GenCodesType genCodes;
    protected SpcCodesType spcCodes;

    /**
     * Gets the value of the unlockingCodes property.
     * 
     * @return
     *     possible object is
     *     {@link PhoneUnlockingCodesType }
     *     
     */
    public PhoneUnlockingCodesType getUnlockingCodes() {
        return unlockingCodes;
    }

    /**
     * Sets the value of the unlockingCodes property.
     * 
     * @param value
     *     allowed object is
     *     {@link PhoneUnlockingCodesType }
     *     
     */
    public void setUnlockingCodes(PhoneUnlockingCodesType value) {
        this.unlockingCodes = value;
    }

    /**
     * Gets the value of the genCodes property.
     * 
     * @return
     *     possible object is
     *     {@link GenCodesType }
     *     
     */
    public GenCodesType getGenCodes() {
        return genCodes;
    }

    /**
     * Sets the value of the genCodes property.
     * 
     * @param value
     *     allowed object is
     *     {@link GenCodesType }
     *     
     */
    public void setGenCodes(GenCodesType value) {
        this.genCodes = value;
    }

    /**
     * Gets the value of the spcCodes property.
     * 
     * @return
     *     possible object is
     *     {@link SpcCodesType }
     *     
     */
    public SpcCodesType getSpcCodes() {
        return spcCodes;
    }

    /**
     * Sets the value of the spcCodes property.
     * 
     * @param value
     *     allowed object is
     *     {@link SpcCodesType }
     *     
     */
    public void setSpcCodes(SpcCodesType value) {
        this.spcCodes = value;
    }

}
