
package com.tracfone.b2b.inquiryservices.balanceinquiry;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for DataUsageType complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="DataUsageType">
 *   &lt;complexContent>
 *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
 *       &lt;sequence>
 *         &lt;element name="baseDataUsage" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="totalAddonDataUsage" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="totalDataUsage" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="hiSpeedDataUsage" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="roamingDataUsage" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="groupDataUsage" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *       &lt;/sequence>
 *     &lt;/restriction>
 *   &lt;/complexContent>
 * &lt;/complexType>
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "DataUsageType", propOrder = {
    "baseDataUsage",
    "totalAddonDataUsage",
    "totalDataUsage",
    "hiSpeedDataUsage",
    "roamingDataUsage",
    "groupDataUsage"
})
public class DataUsageType {

    protected String baseDataUsage;
    protected String totalAddonDataUsage;
    protected String totalDataUsage;
    protected String hiSpeedDataUsage;
    protected String roamingDataUsage;
    protected String groupDataUsage;

    /**
     * Gets the value of the baseDataUsage property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getBaseDataUsage() {
        return baseDataUsage;
    }

    /**
     * Sets the value of the baseDataUsage property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setBaseDataUsage(String value) {
        this.baseDataUsage = value;
    }

    /**
     * Gets the value of the totalAddonDataUsage property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getTotalAddonDataUsage() {
        return totalAddonDataUsage;
    }

    /**
     * Sets the value of the totalAddonDataUsage property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setTotalAddonDataUsage(String value) {
        this.totalAddonDataUsage = value;
    }

    /**
     * Gets the value of the totalDataUsage property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getTotalDataUsage() {
        return totalDataUsage;
    }

    /**
     * Sets the value of the totalDataUsage property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setTotalDataUsage(String value) {
        this.totalDataUsage = value;
    }

    /**
     * Gets the value of the hiSpeedDataUsage property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getHiSpeedDataUsage() {
        return hiSpeedDataUsage;
    }

    /**
     * Sets the value of the hiSpeedDataUsage property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setHiSpeedDataUsage(String value) {
        this.hiSpeedDataUsage = value;
    }

    /**
     * Gets the value of the roamingDataUsage property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getRoamingDataUsage() {
        return roamingDataUsage;
    }

    /**
     * Sets the value of the roamingDataUsage property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setRoamingDataUsage(String value) {
        this.roamingDataUsage = value;
    }

    /**
     * Gets the value of the groupDataUsage property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getGroupDataUsage() {
        return groupDataUsage;
    }

    /**
     * Sets the value of the groupDataUsage property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setGroupDataUsage(String value) {
        this.groupDataUsage = value;
    }

}
