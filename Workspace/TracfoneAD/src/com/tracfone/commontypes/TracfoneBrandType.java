
package com.tracfone.commontypes;

import javax.xml.bind.annotation.XmlEnum;
import javax.xml.bind.annotation.XmlEnumValue;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for TracfoneBrandType.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * <p>
 * <pre>
 * &lt;simpleType name="TracfoneBrandType">
 *   &lt;restriction base="{http://www.w3.org/2001/XMLSchema}string">
 *     &lt;enumeration value="NET10"/>
 *     &lt;enumeration value="STRAIGHT_TALK"/>
 *     &lt;enumeration value="TRACFONE"/>
 *     &lt;enumeration value="TELCEL"/>
 *     &lt;enumeration value="ANY"/>
 *     &lt;enumeration value="SIMPLE_MOBILE"/>
 *     &lt;enumeration value="SLFRIENDS"/>
 *     &lt;enumeration value="TOTAL_WIRELESS"/>
 *     &lt;enumeration value="PAGE_PLUS"/>
 *     &lt;enumeration value="WFM"/>
 *   &lt;/restriction>
 * &lt;/simpleType>
 * </pre>
 * 
 */
@XmlType(name = "TracfoneBrandType")
@XmlEnum
public enum TracfoneBrandType {

    @XmlEnumValue("NET10")
    NET_10("NET10"),
    STRAIGHT_TALK("STRAIGHT_TALK"),
    TRACFONE("TRACFONE"),
    TELCEL("TELCEL"),
    ANY("ANY"),
    SIMPLE_MOBILE("SIMPLE_MOBILE"),
    SLFRIENDS("SLFRIENDS"),
    TOTAL_WIRELESS("TOTAL_WIRELESS"),
    PAGE_PLUS("PAGE_PLUS"),
    WFM("WFM");
    private final String value;

    TracfoneBrandType(String v) {
        value = v;
    }

    public String value() {
        return value;
    }

    public static TracfoneBrandType fromValue(String v) {
        for (TracfoneBrandType c: TracfoneBrandType.values()) {
            if (c.value.equals(v)) {
                return c;
            }
        }
        throw new IllegalArgumentException(v);
    }

}
