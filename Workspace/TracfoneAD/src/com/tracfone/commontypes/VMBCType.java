
package com.tracfone.commontypes;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for VMBCType complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="VMBCType">
 *   &lt;complexContent>
 *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
 *       &lt;sequence>
 *         &lt;element name="RafNumber" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *       &lt;/sequence>
 *     &lt;/restriction>
 *   &lt;/complexContent>
 * &lt;/complexType>
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "VMBCType", propOrder = {
    "rafNumber"
})
public class VMBCType {

    @XmlElement(name = "RafNumber")
    protected String rafNumber;

    /**
     * Gets the value of the rafNumber property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getRafNumber() {
        return rafNumber;
    }

    /**
     * Sets the value of the rafNumber property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setRafNumber(String value) {
        this.rafNumber = value;
    }

}
