
package com.tracfone.commontypes;

import javax.xml.bind.annotation.XmlEnum;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for AVAILABLETYPE.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * <p>
 * <pre>
 * &lt;simpleType name="AVAILABLETYPE">
 *   &lt;restriction base="{http://www.w3.org/2001/XMLSchema}string">
 *     &lt;enumeration value="AVAILABLE"/>
 *     &lt;enumeration value="NOT_AVAILABLE"/>
 *   &lt;/restriction>
 * &lt;/simpleType>
 * </pre>
 * 
 */
@XmlType(name = "AVAILABLETYPE")
@XmlEnum
public enum AVAILABLETYPE {

    AVAILABLE,
    NOT_AVAILABLE;

    public String value() {
        return name();
    }

    public static AVAILABLETYPE fromValue(String v) {
        return valueOf(v);
    }

}
