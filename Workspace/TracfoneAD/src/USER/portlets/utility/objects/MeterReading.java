package USER.portlets.utility.objects;

import java.io.Serializable;

public class MeterReading implements Serializable {

	private static final long serialVersionUID = 1L;
	
	private String accountId;
	private String readDate;
	private String postDate;
	private String usedBill;
	private String meterRead;
	private String readType;
	private String readSource;
	private String meterNumber;
	private String additionalConsiderations;
	public MeterReading() {
		super();
	}
	public MeterReading(String readDate, String postDate, String usedBill,
			String meterRead, String readType, String readSource,
			String meterNumber, String additionalConsiderations) {
		super();
		this.readDate = readDate;
		this.postDate = postDate;
		this.usedBill = usedBill;
		this.meterRead = meterRead;
		this.readType = readType;
		this.readSource = readSource;
		this.meterNumber = meterNumber;
		this.additionalConsiderations = additionalConsiderations;
	}
	public String getReadDate() {
		return readDate;
	}
	public void setReadDate(String readDate) {
		this.readDate = readDate;
	}
	public String getPostDate() {
		return postDate;
	}
	public void setPostDate(String postDate) {
		this.postDate = postDate;
	}
	public String getUsedBill() {
		return usedBill;
	}
	public void setUsedBill(String usedBill) {
		this.usedBill = usedBill;
	}
	public String getMeterRead() {
		return meterRead;
	}
	public void setMeterRead(String meterRead) {
		this.meterRead = meterRead;
	}
	public String getReadType() {
		return readType;
	}
	public void setReadType(String readType) {
		this.readType = readType;
	}
	public String getReadSource() {
		return readSource;
	}
	public void setReadSource(String readSource) {
		this.readSource = readSource;
	}
	public String getMeterNumber() {
		return meterNumber;
	}
	public void setMeterNumber(String meterNumber) {
		this.meterNumber = meterNumber;
	}
	public String getAdditionalConsiderations() {
		return additionalConsiderations;
	}
	public void setAdditionalConsiderations(String additionalConsiderations) {
		this.additionalConsiderations = additionalConsiderations;
	}
	public String getAccountId() {
		return accountId;
	}
	public void setAccountId(String accountId) {
		this.accountId = accountId;
	}
	

}
