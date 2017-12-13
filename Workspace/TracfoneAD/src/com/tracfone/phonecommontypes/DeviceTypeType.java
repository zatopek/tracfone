
package com.tracfone.phonecommontypes;

import javax.xml.bind.annotation.XmlEnum;
import javax.xml.bind.annotation.XmlEnumValue;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for DeviceTypeType.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * <p>
 * <pre>
 * &lt;simpleType name="DeviceTypeType">
 *   &lt;restriction base="{http://www.w3.org/2001/XMLSchema}string">
 *     &lt;enumeration value="HOMEPHONE"/>
 *     &lt;enumeration value="PHONE"/>
 *     &lt;enumeration value="SIM_TYPE1"/>
 *     &lt;enumeration value="SIM_TYPE2"/>
 *     &lt;enumeration value="HOTSPOT"/>
 *     &lt;enumeration value="CARCONNECT"/>
 *     &lt;enumeration value="REMOTEALERT"/>
 *     &lt;enumeration value="TABLET"/>
 *     &lt;enumeration value="CDMA"/>
 *     &lt;enumeration value="BYOT"/>
 *     &lt;enumeration value="BYOP"/>
 *     &lt;enumeration value="SIM"/>
 *   &lt;/restriction>
 * &lt;/simpleType>
 * </pre>
 * 
 */
@XmlType(name = "DeviceTypeType")
@XmlEnum
public enum DeviceTypeType {

    HOMEPHONE("HOMEPHONE"),
    PHONE("PHONE"),
    @XmlEnumValue("SIM_TYPE1")
    SIM_TYPE_1("SIM_TYPE1"),
    @XmlEnumValue("SIM_TYPE2")
    SIM_TYPE_2("SIM_TYPE2"),
    HOTSPOT("HOTSPOT"),
    CARCONNECT("CARCONNECT"),
    REMOTEALERT("REMOTEALERT"),
    TABLET("TABLET"),
    CDMA("CDMA"),
    BYOT("BYOT"),
    BYOP("BYOP"),
    SIM("SIM");
    private final String value;

    DeviceTypeType(String v) {
        value = v;
    }

    public String value() {
        return value;
    }

    public static DeviceTypeType fromValue(String v) {
        for (DeviceTypeType c: DeviceTypeType.values()) {
            if (c.value.equals(v)) {
                return c;
            }
        }
        throw new IllegalArgumentException(v);
    }

}
