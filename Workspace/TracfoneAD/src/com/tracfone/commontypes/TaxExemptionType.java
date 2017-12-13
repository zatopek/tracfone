
package com.tracfone.commontypes;

import javax.xml.bind.annotation.XmlEnum;
import javax.xml.bind.annotation.XmlEnumValue;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for TaxExemptionType.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * <p>
 * <pre>
 * &lt;simpleType name="TaxExemptionType">
 *   &lt;restriction base="{http://www.w3.org/2001/XMLSchema}string">
 *     &lt;enumeration value="TAXABLE"/>
 *     &lt;enumeration value="SALES_EXEMPT"/>
 *     &lt;enumeration value="SALES_E911_EXEMPT"/>
 *   &lt;/restriction>
 * &lt;/simpleType>
 * </pre>
 * 
 */
@XmlType(name = "TaxExemptionType")
@XmlEnum
public enum TaxExemptionType {

    TAXABLE("TAXABLE"),
    SALES_EXEMPT("SALES_EXEMPT"),
    @XmlEnumValue("SALES_E911_EXEMPT")
    SALES_E_911_EXEMPT("SALES_E911_EXEMPT");
    private final String value;

    TaxExemptionType(String v) {
        value = v;
    }

    public String value() {
        return value;
    }

    public static TaxExemptionType fromValue(String v) {
        for (TaxExemptionType c: TaxExemptionType.values()) {
            if (c.value.equals(v)) {
                return c;
            }
        }
        throw new IllegalArgumentException(v);
    }

}
