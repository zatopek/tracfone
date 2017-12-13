
package com.tracfone.phonecommontypes;

import javax.xml.bind.annotation.XmlEnum;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for ServiceStatusType.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * <p>
 * <pre>
 * &lt;simpleType name="ServiceStatusType">
 *   &lt;restriction base="{http://www.w3.org/2001/XMLSchema}string">
 *     &lt;enumeration value="ACTIVE"/>
 *     &lt;enumeration value="INACTIVE"/>
 *   &lt;/restriction>
 * &lt;/simpleType>
 * </pre>
 * 
 */
@XmlType(name = "ServiceStatusType")
@XmlEnum
public enum ServiceStatusType {

    ACTIVE,
    INACTIVE;

    public String value() {
        return name();
    }

    public static ServiceStatusType fromValue(String v) {
        return valueOf(v);
    }

}
