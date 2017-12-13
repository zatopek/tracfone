
package com.tracfone.phonecommontypes;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for PhoneUnlockingCodesType complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="PhoneUnlockingCodesType">
 *   &lt;complexContent>
 *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
 *       &lt;sequence>
 *         &lt;element name="unlockingCode1" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="unlockingCode2" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="unlockingCode3" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *       &lt;/sequence>
 *     &lt;/restriction>
 *   &lt;/complexContent>
 * &lt;/complexType>
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "PhoneUnlockingCodesType", propOrder = {
    "unlockingCode1",
    "unlockingCode2",
    "unlockingCode3"
})
public class PhoneUnlockingCodesType {

    protected String unlockingCode1;
    protected String unlockingCode2;
    protected String unlockingCode3;

    /**
     * Gets the value of the unlockingCode1 property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getUnlockingCode1() {
        return unlockingCode1;
    }

    /**
     * Sets the value of the unlockingCode1 property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setUnlockingCode1(String value) {
        this.unlockingCode1 = value;
    }

    /**
     * Gets the value of the unlockingCode2 property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getUnlockingCode2() {
        return unlockingCode2;
    }

    /**
     * Sets the value of the unlockingCode2 property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setUnlockingCode2(String value) {
        this.unlockingCode2 = value;
    }

    /**
     * Gets the value of the unlockingCode3 property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getUnlockingCode3() {
        return unlockingCode3;
    }

    /**
     * Sets the value of the unlockingCode3 property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setUnlockingCode3(String value) {
        this.unlockingCode3 = value;
    }

}
