
package com.tracfone.commontypes;

import javax.xml.bind.annotation.XmlEnum;
import javax.xml.bind.annotation.XmlEnumValue;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for TrueFalseStringType.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * <p>
 * <pre>
 * &lt;simpleType name="TrueFalseStringType">
 *   &lt;restriction base="{http://www.w3.org/2001/XMLSchema}string">
 *     &lt;enumeration value="true"/>
 *     &lt;enumeration value="false"/>
 *   &lt;/restriction>
 * &lt;/simpleType>
 * </pre>
 * 
 */
@XmlType(name = "TrueFalseStringType")
@XmlEnum
public enum TrueFalseStringType {

    @XmlEnumValue("true")
    TRUE("true"),
    @XmlEnumValue("false")
    FALSE("false");
    private final String value;

    TrueFalseStringType(String v) {
        value = v;
    }

    public String value() {
        return value;
    }

    public static TrueFalseStringType fromValue(String v) {
        for (TrueFalseStringType c: TrueFalseStringType.values()) {
            if (c.value.equals(v)) {
                return c;
            }
        }
        throw new IllegalArgumentException(v);
    }

}
