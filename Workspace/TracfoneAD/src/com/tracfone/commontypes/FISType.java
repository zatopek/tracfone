
package com.tracfone.commontypes;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for FISType complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="FISType">
 *   &lt;complexContent>
 *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
 *       &lt;sequence>
 *         &lt;element name="ProxyNumber" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="PersonId" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="DANumber" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *       &lt;/sequence>
 *     &lt;/restriction>
 *   &lt;/complexContent>
 * &lt;/complexType>
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "FISType", propOrder = {
    "proxyNumber",
    "personId",
    "daNumber"
})
public class FISType {

    @XmlElement(name = "ProxyNumber")
    protected String proxyNumber;
    @XmlElement(name = "PersonId")
    protected String personId;
    @XmlElement(name = "DANumber")
    protected String daNumber;

    /**
     * Gets the value of the proxyNumber property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getProxyNumber() {
        return proxyNumber;
    }

    /**
     * Sets the value of the proxyNumber property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setProxyNumber(String value) {
        this.proxyNumber = value;
    }

    /**
     * Gets the value of the personId property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getPersonId() {
        return personId;
    }

    /**
     * Sets the value of the personId property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setPersonId(String value) {
        this.personId = value;
    }

    /**
     * Gets the value of the daNumber property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getDANumber() {
        return daNumber;
    }

    /**
     * Sets the value of the daNumber property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setDANumber(String value) {
        this.daNumber = value;
    }

}
