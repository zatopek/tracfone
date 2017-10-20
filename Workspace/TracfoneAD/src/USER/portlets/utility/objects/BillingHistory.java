package USER.portlets.utility.objects;

import java.io.Serializable;

public class BillingHistory implements Serializable {

	private static final long serialVersionUID = 1L;
	
	private String accountId;
	private String billDate;
	private String billDays;
	private String degreeDays;
	private String readType;
	private String meterReading;
	private String billType;
	private String consumption;
	private String netBill;
	private String marketerNetAmount;
	private String salesTax;
	public String getBillDate() {
		return billDate;
	}
	public void setBillDate(String billDate) {
		this.billDate = billDate;
	}
	public String getBillDays() {
		return billDays;
	}
	public void setBillDays(String billDays) {
		this.billDays = billDays;
	}
	public String getDegreeDays() {
		return degreeDays;
	}
	public void setDegreeDays(String degreeDays) {
		this.degreeDays = degreeDays;
	}
	public String getReadType() {
		return readType;
	}
	public void setReadType(String readType) {
		this.readType = readType;
	}
	public String getMeterReading() {
		return meterReading;
	}
	public void setMeterReading(String meterReading) {
		this.meterReading = meterReading;
	}
	public String getBillType() {
		return billType;
	}
	public void setBillType(String billType) {
		this.billType = billType;
	}
	public String getConsumption() {
		return consumption;
	}
	public void setConsumption(String consumption) {
		this.consumption = consumption;
	}
	public String getNetBill() {
		return netBill;
	}
	public void setNetBill(String netBill) {
		this.netBill = netBill;
	}
	public String getMarketerNetAmount() {
		return marketerNetAmount;
	}
	public void setMarketerNetAmount(String marketerNetAmount) {
		this.marketerNetAmount = marketerNetAmount;
	}
	public String getSalesTax() {
		return salesTax;
	}
	public void setSalesTax(String salesTax) {
		this.salesTax = salesTax;
	}
	public BillingHistory(String billDate, String billDays, String degreeDays,
			String readType, String meterReading, String billType,
			String consumption, String netBill, String marketerNetAmount,
			String salesTax) {
		super();
		this.billDate = billDate;
		this.billDays = billDays;
		this.degreeDays = degreeDays;
		this.readType = readType;
		this.meterReading = meterReading;
		this.billType = billType;
		this.consumption = consumption;
		this.netBill = netBill;
		this.marketerNetAmount = marketerNetAmount;
		this.salesTax = salesTax;
	}
	public BillingHistory() {
		super();
	}
	public String getAccountId() {
		return accountId;
	}
	public void setAccountId(String accountId) {
		this.accountId = accountId;
	}

}
