
package com.tracfone.b2b.inquiryservices.balanceinquiry;

import java.util.ArrayList;
import java.util.List;
import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for notificationsType complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="notificationsType">
 *   &lt;complexContent>
 *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
 *       &lt;sequence>
 *         &lt;element name="notificationMedium" type="{http://b2b.tracfone.com/InquiryServices/BalanceInquiry}DeliveryModeType" maxOccurs="unbounded"/>
 *       &lt;/sequence>
 *     &lt;/restriction>
 *   &lt;/complexContent>
 * &lt;/complexType>
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "notificationsType", propOrder = {
    "notificationMedium"
})
public class NotificationsType {

    @XmlElement(required = true)
    protected List<DeliveryModeType> notificationMedium;

    /**
     * Gets the value of the notificationMedium property.
     * 
     * <p>
     * This accessor method returns a reference to the live list,
     * not a snapshot. Therefore any modification you make to the
     * returned list will be present inside the JAXB object.
     * This is why there is not a <CODE>set</CODE> method for the notificationMedium property.
     * 
     * <p>
     * For example, to add a new item, do as follows:
     * <pre>
     *    getNotificationMedium().add(newItem);
     * </pre>
     * 
     * 
     * <p>
     * Objects of the following type(s) are allowed in the list
     * {@link DeliveryModeType }
     * 
     * 
     */
    public List<DeliveryModeType> getNotificationMedium() {
        if (notificationMedium == null) {
            notificationMedium = new ArrayList<DeliveryModeType>();
        }
        return this.notificationMedium;
    }

}
