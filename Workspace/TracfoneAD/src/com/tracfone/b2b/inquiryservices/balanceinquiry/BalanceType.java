
package com.tracfone.b2b.inquiryservices.balanceinquiry;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for BalanceType complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="BalanceType">
 *   &lt;complexContent>
 *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
 *       &lt;sequence>
 *         &lt;element name="paidBenefits" type="{http://b2b.tracfone.com/InquiryServices/BalanceInquiry}BucketsType" minOccurs="0"/>
 *         &lt;element name="freeBenefits" type="{http://b2b.tracfone.com/InquiryServices/BalanceInquiry}BucketsType" minOccurs="0"/>
 *         &lt;element name="ildBenefits" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="intRoamingBenefits" type="{http://b2b.tracfone.com/InquiryServices/BalanceInquiry}BucketsType" minOccurs="0"/>
 *         &lt;element name="totalBenefits" type="{http://b2b.tracfone.com/InquiryServices/BalanceInquiry}BucketsType" minOccurs="0"/>
 *         &lt;element name="cashBenefits" type="{http://b2b.tracfone.com/InquiryServices/BalanceInquiry}BenefitsType" minOccurs="0"/>
 *         &lt;element name="promoBenefits" type="{http://b2b.tracfone.com/InquiryServices/BalanceInquiry}BenefitsType" minOccurs="0"/>
 *       &lt;/sequence>
 *     &lt;/restriction>
 *   &lt;/complexContent>
 * &lt;/complexType>
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "BalanceType", propOrder = {
    "paidBenefits",
    "freeBenefits",
    "ildBenefits",
    "intRoamingBenefits",
    "totalBenefits",
    "cashBenefits",
    "promoBenefits"
})
public class BalanceType {

    protected BucketsType paidBenefits;
    protected BucketsType freeBenefits;
    protected String ildBenefits;
    protected BucketsType intRoamingBenefits;
    protected BucketsType totalBenefits;
    protected BenefitsType cashBenefits;
    protected BenefitsType promoBenefits;

    /**
     * Gets the value of the paidBenefits property.
     * 
     * @return
     *     possible object is
     *     {@link BucketsType }
     *     
     */
    public BucketsType getPaidBenefits() {
        return paidBenefits;
    }

    /**
     * Sets the value of the paidBenefits property.
     * 
     * @param value
     *     allowed object is
     *     {@link BucketsType }
     *     
     */
    public void setPaidBenefits(BucketsType value) {
        this.paidBenefits = value;
    }

    /**
     * Gets the value of the freeBenefits property.
     * 
     * @return
     *     possible object is
     *     {@link BucketsType }
     *     
     */
    public BucketsType getFreeBenefits() {
        return freeBenefits;
    }

    /**
     * Sets the value of the freeBenefits property.
     * 
     * @param value
     *     allowed object is
     *     {@link BucketsType }
     *     
     */
    public void setFreeBenefits(BucketsType value) {
        this.freeBenefits = value;
    }

    /**
     * Gets the value of the ildBenefits property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getIldBenefits() {
        return ildBenefits;
    }

    /**
     * Sets the value of the ildBenefits property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setIldBenefits(String value) {
        this.ildBenefits = value;
    }

    /**
     * Gets the value of the intRoamingBenefits property.
     * 
     * @return
     *     possible object is
     *     {@link BucketsType }
     *     
     */
    public BucketsType getIntRoamingBenefits() {
        return intRoamingBenefits;
    }

    /**
     * Sets the value of the intRoamingBenefits property.
     * 
     * @param value
     *     allowed object is
     *     {@link BucketsType }
     *     
     */
    public void setIntRoamingBenefits(BucketsType value) {
        this.intRoamingBenefits = value;
    }

    /**
     * Gets the value of the totalBenefits property.
     * 
     * @return
     *     possible object is
     *     {@link BucketsType }
     *     
     */
    public BucketsType getTotalBenefits() {
        return totalBenefits;
    }

    /**
     * Sets the value of the totalBenefits property.
     * 
     * @param value
     *     allowed object is
     *     {@link BucketsType }
     *     
     */
    public void setTotalBenefits(BucketsType value) {
        this.totalBenefits = value;
    }

    /**
     * Gets the value of the cashBenefits property.
     * 
     * @return
     *     possible object is
     *     {@link BenefitsType }
     *     
     */
    public BenefitsType getCashBenefits() {
        return cashBenefits;
    }

    /**
     * Sets the value of the cashBenefits property.
     * 
     * @param value
     *     allowed object is
     *     {@link BenefitsType }
     *     
     */
    public void setCashBenefits(BenefitsType value) {
        this.cashBenefits = value;
    }

    /**
     * Gets the value of the promoBenefits property.
     * 
     * @return
     *     possible object is
     *     {@link BenefitsType }
     *     
     */
    public BenefitsType getPromoBenefits() {
        return promoBenefits;
    }

    /**
     * Sets the value of the promoBenefits property.
     * 
     * @param value
     *     allowed object is
     *     {@link BenefitsType }
     *     
     */
    public void setPromoBenefits(BenefitsType value) {
        this.promoBenefits = value;
    }

}
