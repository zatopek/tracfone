
package com.tracfone.commontypes;

import javax.xml.bind.annotation.XmlEnum;
import javax.xml.bind.annotation.XmlEnumValue;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for EsnBusinessType.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * <p>
 * <pre>
 * &lt;simpleType name="EsnBusinessType">
 *   &lt;restriction base="{http://www.w3.org/2001/XMLSchema}string">
 *     &lt;enumeration value="B2B"/>
 *     &lt;enumeration value="B2C"/>
 *   &lt;/restriction>
 * &lt;/simpleType>
 * </pre>
 * 
 */
@XmlType(name = "EsnBusinessType")
@XmlEnum
public enum EsnBusinessType {

    @XmlEnumValue("B2B")
    B_2_B("B2B"),
    @XmlEnumValue("B2C")
    B_2_C("B2C");
    private final String value;

    EsnBusinessType(String v) {
        value = v;
    }

    public String value() {
        return value;
    }

    public static EsnBusinessType fromValue(String v) {
        for (EsnBusinessType c: EsnBusinessType.values()) {
            if (c.value.equals(v)) {
                return c;
            }
        }
        throw new IllegalArgumentException(v);
    }

}
