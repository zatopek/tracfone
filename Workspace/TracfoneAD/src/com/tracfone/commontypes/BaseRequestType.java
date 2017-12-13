
package com.tracfone.commontypes;

import java.util.ArrayList;
import java.util.List;
import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for BaseRequestType complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="BaseRequestType">
 *   &lt;complexContent>
 *     &lt;extension base="{http://www.tracfone.com/CommonTypes}BaseRequestResponseType">
 *       &lt;sequence>
 *         &lt;element name="brandName" type="{http://www.tracfone.com/CommonTypes}TracfoneBrandType"/>
 *         &lt;element name="sourceSystem" type="{http://www.tracfone.com/CommonTypes}SourceSystemType"/>
 *         &lt;element name="language" type="{http://www.tracfone.com/CommonTypes}LanguageType" minOccurs="0"/>
 *         &lt;element name="security" type="{http://www.tracfone.com/CommonTypes}KeyValuePairType" maxOccurs="unbounded" minOccurs="0"/>
 *         &lt;element name="channel" type="{http://www.tracfone.com/CommonTypes}ChannelType" minOccurs="0"/>
 *       &lt;/sequence>
 *     &lt;/extension>
 *   &lt;/complexContent>
 * &lt;/complexType>
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "BaseRequestType", propOrder = {
    "brandName",
    "sourceSystem",
    "language",
    "security",
    "channel"
})
public class BaseRequestType
    extends BaseRequestResponseType
{

    @XmlElement(required = true)
    protected TracfoneBrandType brandName;
    @XmlElement(required = true)
    protected String sourceSystem;
    protected LanguageType language;
    protected List<KeyValuePairType> security;
    protected String channel;

    /**
     * Gets the value of the brandName property.
     * 
     * @return
     *     possible object is
     *     {@link TracfoneBrandType }
     *     
     */
    public TracfoneBrandType getBrandName() {
        return brandName;
    }

    /**
     * Sets the value of the brandName property.
     * 
     * @param value
     *     allowed object is
     *     {@link TracfoneBrandType }
     *     
     */
    public void setBrandName(TracfoneBrandType value) {
        this.brandName = value;
    }

    /**
     * Gets the value of the sourceSystem property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getSourceSystem() {
        return sourceSystem;
    }

    /**
     * Sets the value of the sourceSystem property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setSourceSystem(String value) {
        this.sourceSystem = value;
    }

    /**
     * Gets the value of the language property.
     * 
     * @return
     *     possible object is
     *     {@link LanguageType }
     *     
     */
    public LanguageType getLanguage() {
        return language;
    }

    /**
     * Sets the value of the language property.
     * 
     * @param value
     *     allowed object is
     *     {@link LanguageType }
     *     
     */
    public void setLanguage(LanguageType value) {
        this.language = value;
    }

    /**
     * Gets the value of the security property.
     * 
     * <p>
     * This accessor method returns a reference to the live list,
     * not a snapshot. Therefore any modification you make to the
     * returned list will be present inside the JAXB object.
     * This is why there is not a <CODE>set</CODE> method for the security property.
     * 
     * <p>
     * For example, to add a new item, do as follows:
     * <pre>
     *    getSecurity().add(newItem);
     * </pre>
     * 
     * 
     * <p>
     * Objects of the following type(s) are allowed in the list
     * {@link KeyValuePairType }
     * 
     * 
     */
    public List<KeyValuePairType> getSecurity() {
        if (security == null) {
            security = new ArrayList<KeyValuePairType>();
        }
        return this.security;
    }

    /**
     * Gets the value of the channel property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getChannel() {
        return channel;
    }

    /**
     * Sets the value of the channel property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setChannel(String value) {
        this.channel = value;
    }

}
