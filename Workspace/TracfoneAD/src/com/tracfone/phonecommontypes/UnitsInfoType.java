
package com.tracfone.phonecommontypes;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for UnitsInfoType complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="UnitsInfoType">
 *   &lt;complexContent>
 *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
 *       &lt;sequence>
 *         &lt;element name="voiceUnits" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *         &lt;element name="smsUnits" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *         &lt;element name="dataUnits" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *         &lt;element name="serviceDays" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *         &lt;element name="voiceConversionFactor" type="{http://www.w3.org/2001/XMLSchema}int" minOccurs="0"/>
 *       &lt;/sequence>
 *     &lt;/restriction>
 *   &lt;/complexContent>
 * &lt;/complexType>
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "UnitsInfoType", propOrder = {
    "voiceUnits",
    "smsUnits",
    "dataUnits",
    "serviceDays",
    "voiceConversionFactor"
})
public class UnitsInfoType {

    @XmlElement(required = true)
    protected String voiceUnits;
    @XmlElement(required = true)
    protected String smsUnits;
    @XmlElement(required = true)
    protected String dataUnits;
    @XmlElement(required = true)
    protected String serviceDays;
    protected Integer voiceConversionFactor;

    /**
     * Gets the value of the voiceUnits property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getVoiceUnits() {
        return voiceUnits;
    }

    /**
     * Sets the value of the voiceUnits property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setVoiceUnits(String value) {
        this.voiceUnits = value;
    }

    /**
     * Gets the value of the smsUnits property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getSmsUnits() {
        return smsUnits;
    }

    /**
     * Sets the value of the smsUnits property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setSmsUnits(String value) {
        this.smsUnits = value;
    }

    /**
     * Gets the value of the dataUnits property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getDataUnits() {
        return dataUnits;
    }

    /**
     * Sets the value of the dataUnits property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setDataUnits(String value) {
        this.dataUnits = value;
    }

    /**
     * Gets the value of the serviceDays property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getServiceDays() {
        return serviceDays;
    }

    /**
     * Sets the value of the serviceDays property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setServiceDays(String value) {
        this.serviceDays = value;
    }

    /**
     * Gets the value of the voiceConversionFactor property.
     * 
     * @return
     *     possible object is
     *     {@link Integer }
     *     
     */
    public Integer getVoiceConversionFactor() {
        return voiceConversionFactor;
    }

    /**
     * Sets the value of the voiceConversionFactor property.
     * 
     * @param value
     *     allowed object is
     *     {@link Integer }
     *     
     */
    public void setVoiceConversionFactor(Integer value) {
        this.voiceConversionFactor = value;
    }

}
