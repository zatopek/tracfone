
package com.tracfone.phonecommontypes;

import javax.xml.bind.annotation.XmlEnum;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for ActivationStatusType.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * <p>
 * <pre>
 * &lt;simpleType name="ActivationStatusType">
 *   &lt;restriction base="{http://www.w3.org/2001/XMLSchema}string">
 *     &lt;enumeration value="COMPLETE"/>
 *     &lt;enumeration value="PROCESSING"/>
 *     &lt;enumeration value="ENROLLMENT_FAILED"/>
 *     &lt;enumeration value="ENROLLED"/>
 *   &lt;/restriction>
 * &lt;/simpleType>
 * </pre>
 * 
 */
@XmlType(name = "ActivationStatusType")
@XmlEnum
public enum ActivationStatusType {

    COMPLETE,
    PROCESSING,
    ENROLLMENT_FAILED,
    ENROLLED;

    public String value() {
        return name();
    }

    public static ActivationStatusType fromValue(String v) {
        return valueOf(v);
    }

}
