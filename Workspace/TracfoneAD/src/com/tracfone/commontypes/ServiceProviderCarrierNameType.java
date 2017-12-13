
package com.tracfone.commontypes;

import javax.xml.bind.annotation.XmlEnum;
import javax.xml.bind.annotation.XmlEnumValue;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for ServiceProviderCarrierNameType.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * <p>
 * <pre>
 * &lt;simpleType name="ServiceProviderCarrierNameType">
 *   &lt;restriction base="{http://www.w3.org/2001/XMLSchema}string">
 *     &lt;enumeration value="TRACFONE"/>
 *     &lt;enumeration value="NET10"/>
 *     &lt;enumeration value="STRAIGHT_TALK"/>
 *     &lt;enumeration value="TELCEL"/>
 *     &lt;enumeration value="SIMPLE_MOBILE"/>
 *     &lt;enumeration value="VERIZON"/>
 *     &lt;enumeration value="OTHER"/>
 *     &lt;enumeration value="CONSUMER CELLULAR"/>
 *     &lt;enumeration value="US CELLULAR"/>
 *     &lt;enumeration value="TMOBILE"/>
 *     &lt;enumeration value="BOOST MOBILE"/>
 *     &lt;enumeration value="ALLTEL"/>
 *     &lt;enumeration value="CRICKET"/>
 *     &lt;enumeration value="QWEST"/>
 *     &lt;enumeration value="METRO PCS"/>
 *     &lt;enumeration value="AT&amp;T/CINGULAR"/>
 *     &lt;enumeration value="SPRINT"/>
 *     &lt;enumeration value="VIRGIN MOBILE"/>
 *     &lt;enumeration value="NEXTEL"/>
 *     &lt;enumeration value="EDGE WIRELESS"/>
 *     &lt;enumeration value="TOTAL_WIRELESS"/>
 *   &lt;/restriction>
 * &lt;/simpleType>
 * </pre>
 * 
 */
@XmlType(name = "ServiceProviderCarrierNameType")
@XmlEnum
public enum ServiceProviderCarrierNameType {

    TRACFONE("TRACFONE"),
    @XmlEnumValue("NET10")
    NET_10("NET10"),
    STRAIGHT_TALK("STRAIGHT_TALK"),
    TELCEL("TELCEL"),
    SIMPLE_MOBILE("SIMPLE_MOBILE"),
    VERIZON("VERIZON"),
    OTHER("OTHER"),
    @XmlEnumValue("CONSUMER CELLULAR")
    CONSUMER_CELLULAR("CONSUMER CELLULAR"),
    @XmlEnumValue("US CELLULAR")
    US_CELLULAR("US CELLULAR"),
    TMOBILE("TMOBILE"),
    @XmlEnumValue("BOOST MOBILE")
    BOOST_MOBILE("BOOST MOBILE"),
    ALLTEL("ALLTEL"),
    CRICKET("CRICKET"),
    QWEST("QWEST"),
    @XmlEnumValue("METRO PCS")
    METRO_PCS("METRO PCS"),
    @XmlEnumValue("AT&T/CINGULAR")
    AT_T_CINGULAR("AT&T/CINGULAR"),
    SPRINT("SPRINT"),
    @XmlEnumValue("VIRGIN MOBILE")
    VIRGIN_MOBILE("VIRGIN MOBILE"),
    NEXTEL("NEXTEL"),
    @XmlEnumValue("EDGE WIRELESS")
    EDGE_WIRELESS("EDGE WIRELESS"),
    TOTAL_WIRELESS("TOTAL_WIRELESS");
    private final String value;

    ServiceProviderCarrierNameType(String v) {
        value = v;
    }

    public String value() {
        return value;
    }

    public static ServiceProviderCarrierNameType fromValue(String v) {
        for (ServiceProviderCarrierNameType c: ServiceProviderCarrierNameType.values()) {
            if (c.value.equals(v)) {
                return c;
            }
        }
        throw new IllegalArgumentException(v);
    }

}
