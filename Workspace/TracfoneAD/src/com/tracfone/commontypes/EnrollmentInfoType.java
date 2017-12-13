
package com.tracfone.commontypes;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for EnrollmentInfoType complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="EnrollmentInfoType">
 *   &lt;complexContent>
 *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
 *       &lt;sequence>
 *         &lt;element name="webuserObjId" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *         &lt;element name="programObjId" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *         &lt;element name="paymentSourceId" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *       &lt;/sequence>
 *     &lt;/restriction>
 *   &lt;/complexContent>
 * &lt;/complexType>
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "EnrollmentInfoType", propOrder = {
    "webuserObjId",
    "programObjId",
    "paymentSourceId"
})
public class EnrollmentInfoType {

    @XmlElement(required = true)
    protected String webuserObjId;
    @XmlElement(required = true)
    protected String programObjId;
    @XmlElement(required = true)
    protected String paymentSourceId;

    /**
     * Gets the value of the webuserObjId property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getWebuserObjId() {
        return webuserObjId;
    }

    /**
     * Sets the value of the webuserObjId property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setWebuserObjId(String value) {
        this.webuserObjId = value;
    }

    /**
     * Gets the value of the programObjId property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getProgramObjId() {
        return programObjId;
    }

    /**
     * Sets the value of the programObjId property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setProgramObjId(String value) {
        this.programObjId = value;
    }

    /**
     * Gets the value of the paymentSourceId property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getPaymentSourceId() {
        return paymentSourceId;
    }

    /**
     * Sets the value of the paymentSourceId property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setPaymentSourceId(String value) {
        this.paymentSourceId = value;
    }

}
