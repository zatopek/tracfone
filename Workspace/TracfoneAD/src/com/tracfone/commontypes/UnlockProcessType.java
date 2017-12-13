
package com.tracfone.commontypes;

import javax.xml.bind.annotation.XmlEnum;
import javax.xml.bind.annotation.XmlEnumValue;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for UnlockProcessType.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * <p>
 * <pre>
 * &lt;simpleType name="UnlockProcessType">
 *   &lt;restriction base="{http://www.w3.org/2001/XMLSchema}string">
 *     &lt;enumeration value="TF_PPE"/>
 *     &lt;enumeration value="TF_ANDROID"/>
 *     &lt;enumeration value="UnlockAndroidTMO"/>
 *     &lt;enumeration value="IPHONE"/>
 *     &lt;enumeration value="TMO_WL"/>
 *     &lt;enumeration value="NOT FOUND"/>
 *   &lt;/restriction>
 * &lt;/simpleType>
 * </pre>
 * 
 */
@XmlType(name = "UnlockProcessType")
@XmlEnum
public enum UnlockProcessType {

    TF_PPE("TF_PPE"),
    TF_ANDROID("TF_ANDROID"),
    @XmlEnumValue("UnlockAndroidTMO")
    UNLOCK_ANDROID_TMO("UnlockAndroidTMO"),
    IPHONE("IPHONE"),
    TMO_WL("TMO_WL"),
    @XmlEnumValue("NOT FOUND")
    NOT_FOUND("NOT FOUND");
    private final String value;

    UnlockProcessType(String v) {
        value = v;
    }

    public String value() {
        return value;
    }

    public static UnlockProcessType fromValue(String v) {
        for (UnlockProcessType c: UnlockProcessType.values()) {
            if (c.value.equals(v)) {
                return c;
            }
        }
        throw new IllegalArgumentException(v);
    }

}
