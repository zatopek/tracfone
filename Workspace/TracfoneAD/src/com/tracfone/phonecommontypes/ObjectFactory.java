
package com.tracfone.phonecommontypes;

import javax.xml.bind.JAXBElement;
import javax.xml.bind.annotation.XmlElementDecl;
import javax.xml.bind.annotation.XmlRegistry;
import javax.xml.namespace.QName;


/**
 * This object contains factory methods for each 
 * Java content interface and Java element interface 
 * generated in the com.tracfone.phonecommontypes package. 
 * <p>An ObjectFactory allows you to programatically 
 * construct new instances of the Java representation 
 * for XML content. The Java representation of XML 
 * content can consist of schema derived interfaces 
 * and classes representing the binding of schema 
 * type definitions, element declarations and model 
 * groups.  Factory methods for each of these are 
 * provided in this class.
 * 
 */
@XmlRegistry
public class ObjectFactory {

    private final static QName _ESNListTypeEsn_QNAME = new QName("http://www.tracfone.com/PhoneCommonTypes", "esn");
    private final static QName _ESNListTypeSmp_QNAME = new QName("http://www.tracfone.com/PhoneCommonTypes", "smp");

    /**
     * Create a new ObjectFactory that can be used to create new instances of schema derived classes for package: com.tracfone.phonecommontypes
     * 
     */
    public ObjectFactory() {
    }

    /**
     * Create an instance of {@link EncryptedDetailsType }
     * 
     */
    public EncryptedDetailsType createEncryptedDetailsType() {
        return new EncryptedDetailsType();
    }

    /**
     * Create an instance of {@link PhoneType }
     * 
     */
    public PhoneType createPhoneType() {
        return new PhoneType();
    }

    /**
     * Create an instance of {@link GenCodesType }
     * 
     */
    public GenCodesType createGenCodesType() {
        return new GenCodesType();
    }

    /**
     * Create an instance of {@link DeviceIdTypeType }
     * 
     */
    public DeviceIdTypeType createDeviceIdTypeType() {
        return new DeviceIdTypeType();
    }

    /**
     * Create an instance of {@link DeviceListType }
     * 
     */
    public DeviceListType createDeviceListType() {
        return new DeviceListType();
    }

    /**
     * Create an instance of {@link PinType }
     * 
     */
    public PinType createPinType() {
        return new PinType();
    }

    /**
     * Create an instance of {@link EncryptedCodesType }
     * 
     */
    public EncryptedCodesType createEncryptedCodesType() {
        return new EncryptedCodesType();
    }

    /**
     * Create an instance of {@link SpcCodesType }
     * 
     */
    public SpcCodesType createSpcCodesType() {
        return new SpcCodesType();
    }

    /**
     * Create an instance of {@link UnitsInfoType }
     * 
     */
    public UnitsInfoType createUnitsInfoType() {
        return new UnitsInfoType();
    }

    /**
     * Create an instance of {@link DeviceManufacturerListType }
     * 
     */
    public DeviceManufacturerListType createDeviceManufacturerListType() {
        return new DeviceManufacturerListType();
    }

    /**
     * Create an instance of {@link QueuedPinType }
     * 
     */
    public QueuedPinType createQueuedPinType() {
        return new QueuedPinType();
    }

    /**
     * Create an instance of {@link DeviceCredentialsType }
     * 
     */
    public DeviceCredentialsType createDeviceCredentialsType() {
        return new DeviceCredentialsType();
    }

    /**
     * Create an instance of {@link DeviceWithAccountType }
     * 
     */
    public DeviceWithAccountType createDeviceWithAccountType() {
        return new DeviceWithAccountType();
    }

    /**
     * Create an instance of {@link ESNListType }
     * 
     */
    public ESNListType createESNListType() {
        return new ESNListType();
    }

    /**
     * Create an instance of {@link PhoneCodesType }
     * 
     */
    public PhoneCodesType createPhoneCodesType() {
        return new PhoneCodesType();
    }

    /**
     * Create an instance of {@link PhoneUnlockingCodesType }
     * 
     */
    public PhoneUnlockingCodesType createPhoneUnlockingCodesType() {
        return new PhoneUnlockingCodesType();
    }

    /**
     * Create an instance of {@link ESNStatusType }
     * 
     */
    public ESNStatusType createESNStatusType() {
        return new ESNStatusType();
    }

    /**
     * Create an instance of {@link DeviceIdType }
     * 
     */
    public DeviceIdType createDeviceIdType() {
        return new DeviceIdType();
    }

    /**
     * Create an instance of {@link JAXBElement }{@code <}{@link String }{@code >}}
     * 
     */
    @XmlElementDecl(namespace = "http://www.tracfone.com/PhoneCommonTypes", name = "esn", scope = ESNListType.class)
    public JAXBElement<String> createESNListTypeEsn(String value) {
        return new JAXBElement<String>(_ESNListTypeEsn_QNAME, String.class, ESNListType.class, value);
    }

    /**
     * Create an instance of {@link JAXBElement }{@code <}{@link String }{@code >}}
     * 
     */
    @XmlElementDecl(namespace = "http://www.tracfone.com/PhoneCommonTypes", name = "smp", scope = ESNListType.class)
    public JAXBElement<String> createESNListTypeSmp(String value) {
        return new JAXBElement<String>(_ESNListTypeSmp_QNAME, String.class, ESNListType.class, value);
    }

}
