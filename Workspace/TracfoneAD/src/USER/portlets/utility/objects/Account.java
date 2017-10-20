package USER.portlets.utility.objects;

import java.io.Serializable;
import java.util.List;

public class Account implements Serializable {

	private static final long serialVersionUID = 1L;
	
	private String accountId;
	private String type;
	private String accountHolder;
	private String ssn;
	private String relationship;
	private String status;
	private String agentInfo;
	
	private String serviceAddress;
	private String gasStatus;
	private String electricityStatus;
	private String services;
	private String appliances;
	private String meterIdentifier;
	private String meterLocationIdentifier;
	private String meterAccessConstraints;
	private String accountBalance;
	private String pastDueBalance;
	
	private Agreement agreement;
	private List<Payment> payments;
	private List<InteractionHistory> interactions;

	public Account() {
		super();
	}

	public Account(String accountId, String type, String accountHolder,
			String relationship, String status, String agentInfo) {
		super();
		this.accountId = accountId;
		this.type = type;
		this.accountHolder = accountHolder;
		this.relationship = relationship;
		this.status = status;
		this.agentInfo = agentInfo;
	}

	public String getServiceAddress() {
		return serviceAddress;
	}

	public void setServiceAddress(String serviceAddress) {
		this.serviceAddress = serviceAddress;
	}

	public String getGasStatus() {
		return gasStatus;
	}

	public void setGasStatus(String gasStatus) {
		this.gasStatus = gasStatus;
	}

	public String getElectricityStatus() {
		return electricityStatus;
	}

	public void setElectricityStatus(String electricityStatus) {
		this.electricityStatus = electricityStatus;
	}

	public String getServices() {
		return services;
	}

	public void setServices(String services) {
		this.services = services;
	}

	public String getAppliances() {
		return appliances;
	}

	public void setAppliances(String appliances) {
		this.appliances = appliances;
	}

	public String getMeterIdentifier() {
		return meterIdentifier;
	}

	public void setMeterIdentifier(String meterIdentifier) {
		this.meterIdentifier = meterIdentifier;
	}

	public String getMeterLocationIdentifier() {
		return meterLocationIdentifier;
	}

	public void setMeterLocationIdentifier(String meterLocationIdentifier) {
		this.meterLocationIdentifier = meterLocationIdentifier;
	}

	public String getMeterAccessConstraints() {
		return meterAccessConstraints;
	}

	public void setMeterAccessConstraints(String meterAccessConstraints) {
		this.meterAccessConstraints = meterAccessConstraints;
	}

	public String getAccountBalance() {
		return accountBalance;
	}

	public void setAccountBalance(String accountBalance) {
		this.accountBalance = accountBalance;
	}

	public String getPastDueBalance() {
		return pastDueBalance;
	}

	public void setPastDueBalance(String pastDueBalance) {
		this.pastDueBalance = pastDueBalance;
	}


	public Agreement getAgreement() {
		return agreement;
	}

	public void setAgreement(Agreement agreement) {
		this.agreement = agreement;
	}

	public String getAccountId() {
		return accountId;
	}
	public void setAccountId(String accountId) {
		this.accountId = accountId;
	}
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	public String getAccountHolder() {
		return accountHolder;
	}
	public void setAccountHolder(String accountHolder) {
		this.accountHolder = accountHolder;
	}
	public String getRelationship() {
		return relationship;
	}
	public void setRelationship(String relationship) {
		this.relationship = relationship;
	}
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
	public String getAgentInfo() {
		return agentInfo;
	}
	public void setAgentInfo(String agentInfo) {
		this.agentInfo = agentInfo;
	}

	public String getSsn() {
		return ssn;
	}

	public void setSsn(String ssn) {
		this.ssn = ssn;
	}

	public List<Payment> getPayments() {
		return payments;
	}

	public void setPayments(List<Payment> payments) {
		this.payments = payments;
	}

	public List<InteractionHistory> getInteractions() {
		return interactions;
	}

	public void setInteractions(List<InteractionHistory> interactions) {
		this.interactions = interactions;
	}
	

}
