
package com.tracfone.b2b.inquiryservices.balanceinquiry;

import javax.xml.bind.annotation.XmlEnum;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for DataUnitsType.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * <p>
 * <pre>
 * &lt;simpleType name="DataUnitsType">
 *   &lt;restriction base="{http://www.w3.org/2001/XMLSchema}string">
 *     &lt;enumeration value="KB"/>
 *     &lt;enumeration value="MB"/>
 *     &lt;enumeration value="GB"/>
 *   &lt;/restriction>
 * &lt;/simpleType>
 * </pre>
 * 
 */
@XmlType(name = "DataUnitsType")
@XmlEnum
public enum DataUnitsType {

    KB,
    MB,
    GB;

    public String value() {
        return name();
    }

    public static DataUnitsType fromValue(String v) {
        return valueOf(v);
    }

}
