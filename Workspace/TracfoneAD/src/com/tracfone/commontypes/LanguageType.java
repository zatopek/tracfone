
package com.tracfone.commontypes;

import javax.xml.bind.annotation.XmlEnum;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for LanguageType.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * <p>
 * <pre>
 * &lt;simpleType name="LanguageType">
 *   &lt;restriction base="{http://www.w3.org/2001/XMLSchema}string">
 *     &lt;enumeration value="ENG"/>
 *     &lt;enumeration value="SPA"/>
 *   &lt;/restriction>
 * &lt;/simpleType>
 * </pre>
 * 
 */
@XmlType(name = "LanguageType")
@XmlEnum
public enum LanguageType {

    ENG,
    SPA;

    public String value() {
        return name();
    }

    public static LanguageType fromValue(String v) {
        return valueOf(v);
    }

}
