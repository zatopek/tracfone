
package com.tracfone.b2b.inquiryservices.balanceinquiry;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlSchemaType;
import javax.xml.bind.annotation.XmlType;
import javax.xml.datatype.XMLGregorianCalendar;
import com.tracfone.commontypes.BaseResponseType;


/**
 * <p>Java class for GetBalanceResponse complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="GetBalanceResponse">
 *   &lt;complexContent>
 *     &lt;extension base="{http://www.tracfone.com/CommonTypes}BaseResponseType">
 *       &lt;sequence>
 *         &lt;element name="balanceTransId" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *         &lt;element name="balanceTransDateTime" type="{http://www.w3.org/2001/XMLSchema}dateTime"/>
 *       &lt;/sequence>
 *     &lt;/extension>
 *   &lt;/complexContent>
 * &lt;/complexType>
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "GetBalanceResponse", propOrder = {
    "balanceTransId",
    "balanceTransDateTime"
})
public class GetBalanceResponse
    extends BaseResponseType
{

    @XmlElement(required = true)
    protected String balanceTransId;
    @XmlElement(required = true)
    @XmlSchemaType(name = "dateTime")
    protected XMLGregorianCalendar balanceTransDateTime;

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

}
