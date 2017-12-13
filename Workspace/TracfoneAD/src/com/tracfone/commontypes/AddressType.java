
package com.tracfone.commontypes;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for AddressType complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="AddressType">
 *   &lt;complexContent>
 *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
 *       &lt;sequence>
 *         &lt;element name="streetAddress" type="{http://www.tracfone.com/CommonTypes}StreetAddressType"/>
 *         &lt;element name="city" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *         &lt;choice>
 *           &lt;element name="state" type="{http://www.tracfone.com/CommonTypes}StateType"/>
 *           &lt;element name="nonUSState" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *         &lt;/choice>
 *         &lt;element name="zipcode" type="{http://www.tracfone.com/CommonTypes}ZipCodeType"/>
 *         &lt;element name="countryName" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *       &lt;/sequence>
 *     &lt;/restriction>
 *   &lt;/complexContent>
 * &lt;/complexType>
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "AddressType", propOrder = {
    "streetAddress",
    "city",
    "state",
    "nonUSState",
    "zipcode",
    "countryName"
})
public class AddressType {

    @XmlElement(required = true)
    protected StreetAddressType streetAddress;
    @XmlElement(required = true)
    protected String city;
    protected StateType state;
    protected String nonUSState;
    @XmlElement(required = true)
    protected String zipcode;
    protected String countryName;

    /**
     * Gets the value of the streetAddress property.
     * 
     * @return
     *     possible object is
     *     {@link StreetAddressType }
     *     
     */
    public StreetAddressType getStreetAddress() {
        return streetAddress;
    }

    /**
     * Sets the value of the streetAddress property.
     * 
     * @param value
     *     allowed object is
     *     {@link StreetAddressType }
     *     
     */
    public void setStreetAddress(StreetAddressType value) {
        this.streetAddress = value;
    }

    /**
     * Gets the value of the city property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getCity() {
        return city;
    }

    /**
     * Sets the value of the city property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setCity(String value) {
        this.city = value;
    }

    /**
     * Gets the value of the state property.
     * 
     * @return
     *     possible object is
     *     {@link StateType }
     *     
     */
    public StateType getState() {
        return state;
    }

    /**
     * Sets the value of the state property.
     * 
     * @param value
     *     allowed object is
     *     {@link StateType }
     *     
     */
    public void setState(StateType value) {
        this.state = value;
    }

    /**
     * Gets the value of the nonUSState property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getNonUSState() {
        return nonUSState;
    }

    /**
     * Sets the value of the nonUSState property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setNonUSState(String value) {
        this.nonUSState = value;
    }

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
     * Gets the value of the countryName property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getCountryName() {
        return countryName;
    }

    /**
     * Sets the value of the countryName property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setCountryName(String value) {
        this.countryName = value;
    }

}
