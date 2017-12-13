
package com.tracfone.b2b.inquiryservices.balanceinquiry;

import javax.xml.bind.annotation.XmlEnum;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for ServicePlanType.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * <p>
 * <pre>
 * &lt;simpleType name="ServicePlanType">
 *   &lt;restriction base="{http://www.w3.org/2001/XMLSchema}string">
 *     &lt;enumeration value="LIMITED"/>
 *     &lt;enumeration value="UNLIMITED"/>
 *   &lt;/restriction>
 * &lt;/simpleType>
 * </pre>
 * 
 */
@XmlType(name = "ServicePlanType")
@XmlEnum
public enum ServicePlanType {

    LIMITED,
    UNLIMITED;

    public String value() {
        return name();
    }

    public static ServicePlanType fromValue(String v) {
        return valueOf(v);
    }

}
