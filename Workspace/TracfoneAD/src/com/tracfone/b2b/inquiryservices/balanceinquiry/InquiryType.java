
package com.tracfone.b2b.inquiryservices.balanceinquiry;

import javax.xml.bind.annotation.XmlEnum;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for InquiryType.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * <p>
 * <pre>
 * &lt;simpleType name="InquiryType">
 *   &lt;restriction base="{http://www.w3.org/2001/XMLSchema}string">
 *     &lt;enumeration value="BALANCE"/>
 *     &lt;enumeration value="USAGE"/>
 *   &lt;/restriction>
 * &lt;/simpleType>
 * </pre>
 * 
 */
@XmlType(name = "InquiryType")
@XmlEnum
public enum InquiryType {

    BALANCE,
    USAGE;

    public String value() {
        return name();
    }

    public static InquiryType fromValue(String v) {
        return valueOf(v);
    }

}
