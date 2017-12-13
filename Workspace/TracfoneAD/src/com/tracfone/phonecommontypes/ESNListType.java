
package com.tracfone.phonecommontypes;

import java.util.ArrayList;
import java.util.List;
import javax.xml.bind.JAXBElement;
import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElementRef;
import javax.xml.bind.annotation.XmlElementRefs;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for ESNListType complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="ESNListType">
 *   &lt;complexContent>
 *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
 *       &lt;sequence maxOccurs="unbounded">
 *         &lt;element name="esn" type="{http://www.tracfone.com/PhoneCommonTypes}ESNType"/>
 *         &lt;element name="smp" type="{http://www.tracfone.com/PhoneCommonTypes}ESNType" minOccurs="0"/>
 *       &lt;/sequence>
 *     &lt;/restriction>
 *   &lt;/complexContent>
 * &lt;/complexType>
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "ESNListType", propOrder = {
    "esnAndSmp"
})
public class ESNListType {

    @XmlElementRefs({
        @XmlElementRef(name = "smp", namespace = "http://www.tracfone.com/PhoneCommonTypes", type = JAXBElement.class),
        @XmlElementRef(name = "esn", namespace = "http://www.tracfone.com/PhoneCommonTypes", type = JAXBElement.class)
    })
    protected List<JAXBElement<String>> esnAndSmp;

    /**
     * Gets the value of the esnAndSmp property.
     * 
     * <p>
     * This accessor method returns a reference to the live list,
     * not a snapshot. Therefore any modification you make to the
     * returned list will be present inside the JAXB object.
     * This is why there is not a <CODE>set</CODE> method for the esnAndSmp property.
     * 
     * <p>
     * For example, to add a new item, do as follows:
     * <pre>
     *    getEsnAndSmp().add(newItem);
     * </pre>
     * 
     * 
     * <p>
     * Objects of the following type(s) are allowed in the list
     * {@link JAXBElement }{@code <}{@link String }{@code >}
     * {@link JAXBElement }{@code <}{@link String }{@code >}
     * 
     * 
     */
    public List<JAXBElement<String>> getEsnAndSmp() {
        if (esnAndSmp == null) {
            esnAndSmp = new ArrayList<JAXBElement<String>>();
        }
        return this.esnAndSmp;
    }

}
