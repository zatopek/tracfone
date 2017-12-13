
package com.tracfone.phonecommontypes;

import javax.xml.bind.annotation.XmlEnum;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for BalanceInquiryType.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * <p>
 * <pre>
 * &lt;simpleType name="BalanceInquiryType">
 *   &lt;restriction base="{http://www.w3.org/2001/XMLSchema}string">
 *     &lt;enumeration value="REQUEST_BALANCE"/>
 *     &lt;enumeration value="FETCH_BALANCE"/>
 *     &lt;enumeration value="GET_BALANCE"/>
 *   &lt;/restriction>
 * &lt;/simpleType>
 * </pre>
 * 
 */
@XmlType(name = "BalanceInquiryType")
@XmlEnum
public enum BalanceInquiryType {

    REQUEST_BALANCE,
    FETCH_BALANCE,
    GET_BALANCE;

    public String value() {
        return name();
    }

    public static BalanceInquiryType fromValue(String v) {
        return valueOf(v);
    }

}
