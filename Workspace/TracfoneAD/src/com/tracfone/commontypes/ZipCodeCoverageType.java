
package com.tracfone.commontypes;

import java.util.ArrayList;
import java.util.List;
import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for ZipCodeCoverageType complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="ZipCodeCoverageType">
 *   &lt;complexContent>
 *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
 *       &lt;sequence>
 *         &lt;element name="zipcode" type="{http://www.tracfone.com/CommonTypes}ZipCodeType"/>
 *         &lt;element name="technologyCovered" type="{http://www.tracfone.com/CommonTypes}TechnologyType" maxOccurs="unbounded" minOccurs="0"/>
 *       &lt;/sequence>
 *     &lt;/restriction>
 *   &lt;/complexContent>
 * &lt;/complexType>
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "ZipCodeCoverageType", propOrder = {
    "zipcode",
    "technologyCovered"
})
public class ZipCodeCoverageType {

    @XmlElement(required = true)
    protected String zipcode;
    protected List<TechnologyType> technologyCovered;

    /**
     * Gets the value of the zipcode property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getZipcode() {
        return zipcode;
    }

    /**
     * Sets the value of the zipcode property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setZipcode(String value) {
        this.zipcode = value;
    }

    /**
     * Gets the value of the technologyCovered property.
     * 
     * <p>
     * This accessor method returns a reference to the live list,
     * not a snapshot. Therefore any modification you make to the
     * returned list will be present inside the JAXB object.
     * This is why there is not a <CODE>set</CODE> method for the technologyCovered property.
     * 
     * <p>
     * For example, to add a new item, do as follows:
     * <pre>
     *    getTechnologyCovered().add(newItem);
     * </pre>
     * 
     * 
     * <p>
     * Objects of the following type(s) are allowed in the list
     * {@link TechnologyType }
     * 
     * 
     */
    public List<TechnologyType> getTechnologyCovered() {
        if (technologyCovered == null) {
            technologyCovered = new ArrayList<TechnologyType>();
        }
        return this.technologyCovered;
    }

}
