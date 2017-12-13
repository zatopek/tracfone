
package com.tracfone.b2b.inquiryservices.balanceinquiry;

import java.util.ArrayList;
import java.util.List;
import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for BenefitsType complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="BenefitsType">
 *   &lt;complexContent>
 *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
 *       &lt;sequence>
 *         &lt;element name="benefit" type="{http://b2b.tracfone.com/InquiryServices/BalanceInquiry}BenefitType" maxOccurs="unbounded" minOccurs="0"/>
 *       &lt;/sequence>
 *     &lt;/restriction>
 *   &lt;/complexContent>
 * &lt;/complexType>
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "BenefitsType", propOrder = {
    "benefit"
})
public class BenefitsType {

    protected List<BenefitType> benefit;

    /**
     * Gets the value of the benefit property.
     * 
     * <p>
     * This accessor method returns a reference to the live list,
     * not a snapshot. Therefore any modification you make to the
     * returned list will be present inside the JAXB object.
     * This is why there is not a <CODE>set</CODE> method for the benefit property.
     * 
     * <p>
     * For example, to add a new item, do as follows:
     * <pre>
     *    getBenefit().add(newItem);
     * </pre>
     * 
     * 
     * <p>
     * Objects of the following type(s) are allowed in the list
     * {@link BenefitType }
     * 
     * 
     */
    public List<BenefitType> getBenefit() {
        if (benefit == null) {
            benefit = new ArrayList<BenefitType>();
        }
        return this.benefit;
    }

}
