
package com.tracfone.commontypes;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for TaxesType complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="TaxesType">
 *   &lt;complexContent>
 *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
 *       &lt;sequence>
 *         &lt;element name="rcrfAmount" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *         &lt;element name="rcrfRate" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *         &lt;element name="combsTaxAmount" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *         &lt;element name="combsTaxRate" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *         &lt;element name="e911Amount" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *         &lt;element name="e911Rate" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *         &lt;element name="usfAmount" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *         &lt;element name="usfRate" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *         &lt;element name="totalTaxAmount" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *         &lt;element name="discountAmount" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *         &lt;element name="totalCharges" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *         &lt;element name="amount" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *       &lt;/sequence>
 *     &lt;/restriction>
 *   &lt;/complexContent>
 * &lt;/complexType>
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "TaxesType", propOrder = {
    "rcrfAmount",
    "rcrfRate",
    "combsTaxAmount",
    "combsTaxRate",
    "e911Amount",
    "e911Rate",
    "usfAmount",
    "usfRate",
    "totalTaxAmount",
    "discountAmount",
    "totalCharges",
    "amount"
})
public class TaxesType {

    @XmlElement(required = true)
    protected String rcrfAmount;
    @XmlElement(required = true)
    protected String rcrfRate;
    @XmlElement(required = true)
    protected String combsTaxAmount;
    @XmlElement(required = true)
    protected String combsTaxRate;
    @XmlElement(required = true)
    protected String e911Amount;
    @XmlElement(required = true)
    protected String e911Rate;
    @XmlElement(required = true)
    protected String usfAmount;
    @XmlElement(required = true)
    protected String usfRate;
    @XmlElement(required = true)
    protected String totalTaxAmount;
    @XmlElement(required = true)
    protected String discountAmount;
    @XmlElement(required = true)
    protected String totalCharges;
    @XmlElement(required = true)
    protected String amount;

    /**
     * Gets the value of the rcrfAmount property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getRcrfAmount() {
        return rcrfAmount;
    }

    /**
     * Sets the value of the rcrfAmount property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setRcrfAmount(String value) {
        this.rcrfAmount = value;
    }

    /**
     * Gets the value of the rcrfRate property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getRcrfRate() {
        return rcrfRate;
    }

    /**
     * Sets the value of the rcrfRate property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setRcrfRate(String value) {
        this.rcrfRate = value;
    }

    /**
     * Gets the value of the combsTaxAmount property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getCombsTaxAmount() {
        return combsTaxAmount;
    }

    /**
     * Sets the value of the combsTaxAmount property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setCombsTaxAmount(String value) {
        this.combsTaxAmount = value;
    }

    /**
     * Gets the value of the combsTaxRate property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getCombsTaxRate() {
        return combsTaxRate;
    }

    /**
     * Sets the value of the combsTaxRate property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setCombsTaxRate(String value) {
        this.combsTaxRate = value;
    }

    /**
     * Gets the value of the e911Amount property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getE911Amount() {
        return e911Amount;
    }

    /**
     * Sets the value of the e911Amount property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setE911Amount(String value) {
        this.e911Amount = value;
    }

    /**
     * Gets the value of the e911Rate property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getE911Rate() {
        return e911Rate;
    }

    /**
     * Sets the value of the e911Rate property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setE911Rate(String value) {
        this.e911Rate = value;
    }

    /**
     * Gets the value of the usfAmount property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getUsfAmount() {
        return usfAmount;
    }

    /**
     * Sets the value of the usfAmount property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setUsfAmount(String value) {
        this.usfAmount = value;
    }

    /**
     * Gets the value of the usfRate property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getUsfRate() {
        return usfRate;
    }

    /**
     * Sets the value of the usfRate property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setUsfRate(String value) {
        this.usfRate = value;
    }

    /**
     * Gets the value of the totalTaxAmount property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getTotalTaxAmount() {
        return totalTaxAmount;
    }

    /**
     * Sets the value of the totalTaxAmount property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setTotalTaxAmount(String value) {
        this.totalTaxAmount = value;
    }

    /**
     * Gets the value of the discountAmount property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getDiscountAmount() {
        return discountAmount;
    }

    /**
     * Sets the value of the discountAmount property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setDiscountAmount(String value) {
        this.discountAmount = value;
    }

    /**
     * Gets the value of the totalCharges property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getTotalCharges() {
        return totalCharges;
    }

    /**
     * Sets the value of the totalCharges property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setTotalCharges(String value) {
        this.totalCharges = value;
    }

    /**
     * Gets the value of the amount property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getAmount() {
        return amount;
    }

    /**
     * Sets the value of the amount property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setAmount(String value) {
        this.amount = value;
    }

}
