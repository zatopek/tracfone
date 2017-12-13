
package com.tracfone.commontypes;

import javax.xml.bind.annotation.XmlEnum;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for TechnologyType.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * <p>
 * <pre>
 * &lt;simpleType name="TechnologyType">
 *   &lt;restriction base="{http://www.w3.org/2001/XMLSchema}string">
 *     &lt;enumeration value="GSM"/>
 *     &lt;enumeration value="CDMA"/>
 *     &lt;enumeration value="ALL"/>
 *   &lt;/restriction>
 * &lt;/simpleType>
 * </pre>
 * 
 */
@XmlType(name = "TechnologyType")
@XmlEnum
public enum TechnologyType {

    GSM,
    CDMA,
    ALL;

    public String value() {
        return name();
    }

    public static TechnologyType fromValue(String v) {
        return valueOf(v);
    }

}
