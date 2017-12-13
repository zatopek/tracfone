
package com.tracfone.phonecommontypes;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for ESNStatusType complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="ESNStatusType">
 *   &lt;complexContent>
 *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
 *       &lt;sequence>
 *         &lt;element name="statusCode">
 *           &lt;simpleType>
 *             &lt;restriction base="{http://www.w3.org/2001/XMLSchema}string">
 *             &lt;/restriction>
 *           &lt;/simpleType>
 *         &lt;/element>
 *         &lt;element name="statusName">
 *           &lt;simpleType>
 *             &lt;restriction base="{http://www.w3.org/2001/XMLSchema}string">
 *               &lt;minLength value="0"/>
 *               &lt;maxLength value="50"/>
 *               &lt;enumeration value="UNREPAIRABLE"/>
 *               &lt;enumeration value="NEW"/>
 *               &lt;enumeration value="USED"/>
 *               &lt;enumeration value="ACTIVE"/>
 *               &lt;enumeration value="STOLEN"/>
 *               &lt;enumeration value="PASTDUE"/>
 *               &lt;enumeration value="SEQUENCE MISMATCH"/>
 *               &lt;enumeration value="RISK ASSESMENT"/>
 *               &lt;enumeration value="EXCHANGE"/>
 *               &lt;enumeration value="OVERDUE EXCHANGE"/>
 *               &lt;enumeration value="INACTIVE"/>
 *               &lt;enumeration value="RETURNED"/>
 *               &lt;enumeration value="RETURN TO RETAILER"/>
 *               &lt;enumeration value="REFURBISH"/>
 *             &lt;/restriction>
 *           &lt;/simpleType>
 *         &lt;/element>
 *       &lt;/sequence>
 *     &lt;/restriction>
 *   &lt;/complexContent>
 * &lt;/complexType>
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "ESNStatusType", propOrder = {
    "statusCode",
    "statusName"
})
public class ESNStatusType {

    @XmlElement(required = true)
    protected String statusCode;
    @XmlElement(required = true)
    protected String statusName;

    /**
     * Gets the value of the statusCode property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getStatusCode() {
        return statusCode;
    }

    /**
     * Sets the value of the statusCode property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setStatusCode(String value) {
        this.statusCode = value;
    }

    /**
     * Gets the value of the statusName property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getStatusName() {
        return statusName;
    }

    /**
     * Sets the value of the statusName property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setStatusName(String value) {
        this.statusName = value;
    }

}
