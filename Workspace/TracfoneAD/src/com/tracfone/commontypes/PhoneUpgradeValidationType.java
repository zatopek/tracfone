
package com.tracfone.commontypes;

import javax.xml.bind.annotation.XmlEnum;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for PhoneUpgradeValidationType.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * <p>
 * <pre>
 * &lt;simpleType name="PhoneUpgradeValidationType">
 *   &lt;restriction base="{http://www.w3.org/2001/XMLSchema}string">
 *     &lt;enumeration value="FROM"/>
 *     &lt;enumeration value="TO"/>
 *     &lt;enumeration value="MINCHANGE"/>
 *   &lt;/restriction>
 * &lt;/simpleType>
 * </pre>
 * 
 */
@XmlType(name = "PhoneUpgradeValidationType")
@XmlEnum
public enum PhoneUpgradeValidationType {

    FROM,
    TO,
    MINCHANGE;

    public String value() {
        return name();
    }

    public static PhoneUpgradeValidationType fromValue(String v) {
        return valueOf(v);
    }

}
