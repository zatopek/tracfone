
package com.tracfone.b2b.inquiryservices.balanceinquiry;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlAttribute;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlSchemaType;
import javax.xml.bind.annotation.XmlType;
import javax.xml.datatype.XMLGregorianCalendar;
import com.tracfone.commontypes.BaseRequestType;


/**
 * <p>Java class for GetBalanceByTransIdRequest complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="GetBalanceByTransIdRequest">
 *   &lt;complexContent>
 *     &lt;extension base="{http://www.tracfone.com/CommonTypes}BaseRequestType">
 *       &lt;sequence>
 *         &lt;element name="balanceTransId" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *         &lt;element name="balanceTransDateTime" type="{http://www.w3.org/2001/XMLSchema}dateTime"/>
 *         &lt;element name="dataUnitsType" type="{http://b2b.tracfone.com/InquiryServices/BalanceInquiry}DataUnitsType"/>
 *         &lt;element name="notifications" type="{http://b2b.tracfone.com/InquiryServices/BalanceInquiry}notificationsType" minOccurs="0"/>
 *       &lt;/sequence>
 *       &lt;attribute name="version" use="required" type="{http://www.w3.org/2001/XMLSchema}string" />
 *     &lt;/extension>
 *   &lt;/complexContent>
 * &lt;/complexType>
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "GetBalanceByTransIdRequest", propOrder = {
    "balanceTransId",
    "balanceTransDateTime",
    "dataUnitsType",
    "notifications"
})
public class GetBalanceByTransIdRequest
    extends BaseRequestType
{

    @XmlElement(required = true)
    protected String balanceTransId;
    @XmlElement(required = true)
    @XmlSchemaType(name = "dateTime")
    protected XMLGregorianCalendar balanceTransDateTime;
    @XmlElement(required = true)
    protected DataUnitsType dataUnitsType;
    protected NotificationsType notifications;
    @XmlAttribute(name = "version", required = true)
    protected String version;

    /**
     * Gets the value of the balanceTransId property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getBalanceTransId() {
        return balanceTransId;
    }

    /**
     * Sets the value of the balanceTransId property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setBalanceTransId(String value) {
        this.balanceTransId = value;
    }

    /**
     * Gets the value of the balanceTransDateTime property.
     * 
     * @return
     *     possible object is
     *     {@link XMLGregorianCalendar }
     *     
     */
    public XMLGregorianCalendar getBalanceTransDateTime() {
        return balanceTransDateTime;
    }

    /**
     * Sets the value of the balanceTransDateTime property.
     * 
     * @param value
     *     allowed object is
     *     {@link XMLGregorianCalendar }
     *     
     */
    public void setBalanceTransDateTime(XMLGregorianCalendar value) {
        this.balanceTransDateTime = value;
    }

    /**
     * Gets the value of the dataUnitsType property.
     * 
     * @return
     *     possible object is
     *     {@link DataUnitsType }
     *     
     */
    public DataUnitsType getDataUnitsType() {
        return dataUnitsType;
    }

    /**
     * Sets the value of the dataUnitsType property.
     * 
     * @param value
     *     allowed object is
     *     {@link DataUnitsType }
     *     
     */
    public void setDataUnitsType(DataUnitsType value) {
        this.dataUnitsType = value;
    }

    /**
     * Gets the value of the notifications property.
     * 
     * @return
     *     possible object is
     *     {@link NotificationsType }
     *     
     */
    public NotificationsType getNotifications() {
        return notifications;
    }

    /**
     * Sets the value of the notifications property.
     * 
     * @param value
     *     allowed object is
     *     {@link NotificationsType }
     *     
     */
    public void setNotifications(NotificationsType value) {
        this.notifications = value;
    }

    /**
     * Gets the value of the version property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getVersion() {
        return version;
    }

    /**
     * Sets the value of the version property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setVersion(String value) {
        this.version = value;
    }

}
