
package com.tracfone.b2b.inquiryservices.balanceinquiry;

import javax.xml.bind.annotation.XmlEnum;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for DeliveryModeType.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * <p>
 * <pre>
 * &lt;simpleType name="DeliveryModeType">
 *   &lt;restriction base="{http://www.w3.org/2001/XMLSchema}string">
 *     &lt;enumeration value="SMS"/>
 *     &lt;enumeration value="EMAIL"/>
 *   &lt;/restriction>
 * &lt;/simpleType>
 * </pre>
 * 
 */
@XmlType(name = "DeliveryModeType")
@XmlEnum
public enum DeliveryModeType {

    SMS,
    EMAIL;

    public String value() {
        return name();
    }

    public static DeliveryModeType fromValue(String v) {
        return valueOf(v);
    }

}
