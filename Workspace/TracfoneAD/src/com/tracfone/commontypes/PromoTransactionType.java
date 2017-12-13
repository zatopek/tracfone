
package com.tracfone.commontypes;

import javax.xml.bind.annotation.XmlEnum;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for PromoTransactionType.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * <p>
 * <pre>
 * &lt;simpleType name="PromoTransactionType">
 *   &lt;restriction base="{http://www.w3.org/2001/XMLSchema}string">
 *     &lt;enumeration value="PURCHASE"/>
 *     &lt;enumeration value="PROMOENROLLMENT"/>
 *     &lt;enumeration value="ACTIVATION"/>
 *     &lt;enumeration value="REACTIVATION"/>
 *     &lt;enumeration value="REDEMPTION"/>
 *   &lt;/restriction>
 * &lt;/simpleType>
 * </pre>
 * 
 */
@XmlType(name = "PromoTransactionType")
@XmlEnum
public enum PromoTransactionType {

    PURCHASE,
    PROMOENROLLMENT,
    ACTIVATION,
    REACTIVATION,
    REDEMPTION;

    public String value() {
        return name();
    }

    public static PromoTransactionType fromValue(String v) {
        return valueOf(v);
    }

}
