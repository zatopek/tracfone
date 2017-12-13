
package com.tracfone.phonecommontypes;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for EncryptedCodesType complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="EncryptedCodesType">
 *   &lt;complexContent>
 *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
 *       &lt;sequence>
 *         &lt;element name="encryptedCode1" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="encryptedCode2" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="encryptedCode3" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *       &lt;/sequence>
 *     &lt;/restriction>
 *   &lt;/complexContent>
 * &lt;/complexType>
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "EncryptedCodesType", propOrder = {
    "encryptedCode1",
    "encryptedCode2",
    "encryptedCode3"
})
public class EncryptedCodesType {

    protected String encryptedCode1;
    protected String encryptedCode2;
    protected String encryptedCode3;

    /**
     * Gets the value of the encryptedCode1 property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getEncryptedCode1() {
        return encryptedCode1;
    }

    /**
     * Sets the value of the encryptedCode1 property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setEncryptedCode1(String value) {
        this.encryptedCode1 = value;
    }

    /**
     * Gets the value of the encryptedCode2 property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getEncryptedCode2() {
        return encryptedCode2;
    }

    /**
     * Sets the value of the encryptedCode2 property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setEncryptedCode2(String value) {
        this.encryptedCode2 = value;
    }

    /**
     * Gets the value of the encryptedCode3 property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getEncryptedCode3() {
        return encryptedCode3;
    }

    /**
     * Sets the value of the encryptedCode3 property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setEncryptedCode3(String value) {
        this.encryptedCode3 = value;
    }

}
