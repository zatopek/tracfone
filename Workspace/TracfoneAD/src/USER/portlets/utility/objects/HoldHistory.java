package USER.portlets.utility.objects;

import java.io.Serializable;

public class HoldHistory implements Serializable {

	private static final long serialVersionUID = 1L;
	
	private String accountId;
	private String type;
	private String remarks;
	private String status;
	private String dateofEntry;
	private String dateofExpiration;
	private String currentAmount;
	private String originalAmount;
	private String employeeNumber;
	private String referenceNumber;
	public HoldHistory() {
		super();
	}
	public HoldHistory(String type, String remarks, String status,
			String dateofEntry, String dateofExpiration, String currentAmount,
			String originalAmount, String employeeNumber, String referenceNumber) {
		super();
		this.type = type;
		this.remarks = remarks;
		this.status = status;
		this.dateofEntry = dateofEntry;
		this.dateofExpiration = dateofExpiration;
		this.currentAmount = currentAmount;
		this.originalAmount = originalAmount;
		this.employeeNumber = employeeNumber;
		this.referenceNumber = referenceNumber;
	}
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	public String getRemarks() {
		return remarks;
	}
	public void setRemarks(String remarks) {
		this.remarks = remarks;
	}
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
	public String getDateofEntry() {
		return dateofEntry;
	}
	public void setDateofEntry(String dateofEntry) {
		this.dateofEntry = dateofEntry;
	}
	public String getDateofExpiration() {
		return dateofExpiration;
	}
	public void setDateofExpiration(String dateofExpiration) {
		this.dateofExpiration = dateofExpiration;
	}
	public String getCurrentAmount() {
		return currentAmount;
	}
	public void setCurrentAmount(String currentAmount) {
		this.currentAmount = currentAmount;
	}
	public String getOriginalAmount() {
		return originalAmount;
	}
	public void setOriginalAmount(String originalAmount) {
		this.originalAmount = originalAmount;
	}
	public String getEmployeeNumber() {
		return employeeNumber;
	}
	public void setEmployeeNumber(String employeeNumber) {
		this.employeeNumber = employeeNumber;
	}
	public String getReferenceNumber() {
		return referenceNumber;
	}
	public void setReferenceNumber(String referenceNumber) {
		this.referenceNumber = referenceNumber;
	}
	public String getAccountId() {
		return accountId;
	}
	public void setAccountId(String accountId) {
		this.accountId = accountId;
	}

}
