
package com.tracfone.b2b.inquiryservices.balanceinquiry;

import javax.xml.bind.annotation.XmlEnum;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for ToleranceLevelType.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * <p>
 * <pre>
 * &lt;simpleType name="ToleranceLevelType">
 *   &lt;restriction base="{http://www.w3.org/2001/XMLSchema}string">
 *     &lt;enumeration value="LOW"/>
 *     &lt;enumeration value="HIGH"/>
 *   &lt;/restriction>
 * &lt;/simpleType>
 * </pre>
 * 
 */
@XmlType(name = "ToleranceLevelType")
@XmlEnum
public enum ToleranceLevelType {

    LOW,
    HIGH;

    public String value() {
        return name();
    }

    public static ToleranceLevelType fromValue(String v) {
        return valueOf(v);
    }

}
