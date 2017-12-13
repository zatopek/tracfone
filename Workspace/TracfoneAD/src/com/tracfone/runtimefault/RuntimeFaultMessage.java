
package com.tracfone.runtimefault;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for anonymous complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType>
 *   &lt;complexContent>
 *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
 *       &lt;sequence>
 *         &lt;element name="code" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *         &lt;element name="subcode" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *         &lt;element name="isRetriable" type="{http://www.w3.org/2001/XMLSchema}boolean"/>
 *         &lt;element name="summary" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *         &lt;element name="detail">
 *           &lt;complexType>
 *             &lt;complexContent>
 *               &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
 *                 &lt;sequence>
 *                   &lt;element name="message" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *                   &lt;element name="originalPayload" type="{http://www.w3.org/2001/XMLSchema}anyType"/>
 *                   &lt;element name="coreFault" type="{http://www.w3.org/2001/XMLSchema}anyType"/>
 *                 &lt;/sequence>
 *               &lt;/restriction>
 *             &lt;/complexContent>
 *           &lt;/complexType>
 *         &lt;/element>
 *         &lt;element name="causedBy" type="{http://www.w3.org/2001/XMLSchema}anyType" minOccurs="0"/>
 *       &lt;/sequence>
 *     &lt;/restriction>
 *   &lt;/complexContent>
 * &lt;/complexType>
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "", propOrder = {
    "code",
    "subcode",
    "isRetriable",
    "summary",
    "detail",
    "causedBy"
})
@XmlRootElement(name = "RuntimeFaultMessage")
public class RuntimeFaultMessage {

    @XmlElement(required = true)
    protected String code;
    @XmlElement(required = true)
    protected String subcode;
    protected boolean isRetriable;
    @XmlElement(required = true)
    protected String summary;
    @XmlElement(required = true)
    protected RuntimeFaultMessage.Detail detail;
    protected Object causedBy;

    /**
     * Gets the value of the code property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getCode() {
        return code;
    }

    /**
     * Sets the value of the code property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setCode(String value) {
        this.code = value;
    }

    /**
     * Gets the value of the subcode property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getSubcode() {
        return subcode;
    }

    /**
     * Sets the value of the subcode property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setSubcode(String value) {
        this.subcode = value;
    }

    /**
     * Gets the value of the isRetriable property.
     * 
     */
    public boolean isIsRetriable() {
        return isRetriable;
    }

    /**
     * Sets the value of the isRetriable property.
     * 
     */
    public void setIsRetriable(boolean value) {
        this.isRetriable = value;
    }

    /**
     * Gets the value of the summary property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getSummary() {
        return summary;
    }

    /**
     * Sets the value of the summary property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setSummary(String value) {
        this.summary = value;
    }

    /**
     * Gets the value of the detail property.
     * 
     * @return
     *     possible object is
     *     {@link RuntimeFaultMessage.Detail }
     *     
     */
    public RuntimeFaultMessage.Detail getDetail() {
        return detail;
    }

    /**
     * Sets the value of the detail property.
     * 
     * @param value
     *     allowed object is
     *     {@link RuntimeFaultMessage.Detail }
     *     
     */
    public void setDetail(RuntimeFaultMessage.Detail value) {
        this.detail = value;
    }

    /**
     * Gets the value of the causedBy property.
     * 
     * @return
     *     possible object is
     *     {@link Object }
     *     
     */
    public Object getCausedBy() {
        return causedBy;
    }

    /**
     * Sets the value of the causedBy property.
     * 
     * @param value
     *     allowed object is
     *     {@link Object }
     *     
     */
    public void setCausedBy(Object value) {
        this.causedBy = value;
    }


    /**
     * <p>Java class for anonymous complex type.
     * 
     * <p>The following schema fragment specifies the expected content contained within this class.
     * 
     * <pre>
     * &lt;complexType>
     *   &lt;complexContent>
     *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
     *       &lt;sequence>
     *         &lt;element name="message" type="{http://www.w3.org/2001/XMLSchema}string"/>
     *         &lt;element name="originalPayload" type="{http://www.w3.org/2001/XMLSchema}anyType"/>
     *         &lt;element name="coreFault" type="{http://www.w3.org/2001/XMLSchema}anyType"/>
     *       &lt;/sequence>
     *     &lt;/restriction>
     *   &lt;/complexContent>
     * &lt;/complexType>
     * </pre>
     * 
     * 
     */
    @XmlAccessorType(XmlAccessType.FIELD)
    @XmlType(name = "", propOrder = {
        "message",
        "originalPayload",
        "coreFault"
    })
    public static class Detail {

        @XmlElement(required = true)
        protected String message;
        @XmlElement(required = true)
        protected Object originalPayload;
        @XmlElement(required = true)
        protected Object coreFault;

        /**
         * Gets the value of the message property.
         * 
         * @return
         *     possible object is
         *     {@link String }
         *     
         */
        public String getMessage() {
            return message;
        }

        /**
         * Sets the value of the message property.
         * 
         * @param value
         *     allowed object is
         *     {@link String }
         *     
         */
        public void setMessage(String value) {
            this.message = value;
        }

        /**
         * Gets the value of the originalPayload property.
         * 
         * @return
         *     possible object is
         *     {@link Object }
         *     
         */
        public Object getOriginalPayload() {
            return originalPayload;
        }

        /**
         * Sets the value of the originalPayload property.
         * 
         * @param value
         *     allowed object is
         *     {@link Object }
         *     
         */
        public void setOriginalPayload(Object value) {
            this.originalPayload = value;
        }

        /**
         * Gets the value of the coreFault property.
         * 
         * @return
         *     possible object is
         *     {@link Object }
         *     
         */
        public Object getCoreFault() {
            return coreFault;
        }

        /**
         * Sets the value of the coreFault property.
         * 
         * @param value
         *     allowed object is
         *     {@link Object }
         *     
         */
        public void setCoreFault(Object value) {
            this.coreFault = value;
        }

    }

}
