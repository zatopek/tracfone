package USER.portlets.utility.objects;

import java.io.Serializable;

public class Agreement implements Serializable {
	
	private static final long serialVersionUID = 1L;
	private String status;
	private String Type;
	private String Source;
	private String Condition;
	private String dateEntered;
	private String employee;
	private String totalAmount;
	private String monthlyPayment;
	private String remarks;
	private String amountToBringAgreementCurrent;
	private String amountBehindOnAgreement;
	private String requiredCurrentMonthlyPayment;
	private String latePaymentChargeDate;
	private String nextCollectionActionDate;
	private String incomeLevel;
	private String finalPayment;
	private String downPaymentAmount;
	private String downPaymentDueBy;
	private String latePaymentCharge;
	private String currentAgreementDuration;
	private String numberOfAgreementsOnFile;
	private String noOfAnalysesOnFile;
	private String lastAnalysisDate;
	private String scannedAgreement;
	private String signedAgreement;
	private String mustPostBefore;
	private String agreementInactiveDate;
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
	public String getType() {
		return Type;
	}
	public void setType(String type) {
		Type = type;
	}
	public String getSource() {
		return Source;
	}
	public void setSource(String source) {
		Source = source;
	}
	public String getCondition() {
		return Condition;
	}
	public void setCondition(String condition) {
		Condition = condition;
	}
	public String getDateEntered() {
		return dateEntered;
	}
	public void setDateEntered(String dateEntered) {
		this.dateEntered = dateEntered;
	}
	public String getEmployee() {
		return employee;
	}
	public void setEmployee(String employee) {
		this.employee = employee;
	}
	public String getTotalAmount() {
		return totalAmount;
	}
	public void setTotalAmount(String totalAmount) {
		this.totalAmount = totalAmount;
	}
	public String getMonthlyPayment() {
		return monthlyPayment;
	}
	public void setMonthlyPayment(String monthlyPayment) {
		this.monthlyPayment = monthlyPayment;
	}
	public String getRemarks() {
		return remarks;
	}
	public void setRemarks(String remarks) {
		this.remarks = remarks;
	}
	public String getAmountToBringAgreementCurrent() {
		return amountToBringAgreementCurrent;
	}
	public void setAmountToBringAgreementCurrent(
			String amountToBringAgreementCurrent) {
		this.amountToBringAgreementCurrent = amountToBringAgreementCurrent;
	}
	public String getAmountBehindOnAgreement() {
		return amountBehindOnAgreement;
	}
	public void setAmountBehindOnAgreement(String amountBehindOnAgreement) {
		this.amountBehindOnAgreement = amountBehindOnAgreement;
	}
	public String getRequiredCurrentMonthlyPayment() {
		return requiredCurrentMonthlyPayment;
	}
	public void setRequiredCurrentMonthlyPayment(
			String requiredCurrentMonthlyPayment) {
		this.requiredCurrentMonthlyPayment = requiredCurrentMonthlyPayment;
	}
	public String getLatePaymentChargeDate() {
		return latePaymentChargeDate;
	}
	public void setLatePaymentChargeDate(String latePaymentChargeDate) {
		this.latePaymentChargeDate = latePaymentChargeDate;
	}
	public String getNextCollectionActionDate() {
		return nextCollectionActionDate;
	}
	public void setNextCollectionActionDate(String nextCollectionActionDate) {
		this.nextCollectionActionDate = nextCollectionActionDate;
	}
	public String getIncomeLevel() {
		return incomeLevel;
	}
	public void setIncomeLevel(String incomeLevel) {
		this.incomeLevel = incomeLevel;
	}
	public String getFinalPayment() {
		return finalPayment;
	}
	public void setFinalPayment(String finalPayment) {
		this.finalPayment = finalPayment;
	}
	public String getDownPaymentAmount() {
		return downPaymentAmount;
	}
	public void setDownPaymentAmount(String downPaymentAmount) {
		this.downPaymentAmount = downPaymentAmount;
	}
	public String getDownPaymentDueBy() {
		return downPaymentDueBy;
	}
	public void setDownPaymentDueBy(String downPaymentDueBy) {
		this.downPaymentDueBy = downPaymentDueBy;
	}
	public String getLatePaymentCharge() {
		return latePaymentCharge;
	}
	public void setLatePaymentCharge(String latePaymentCharge) {
		this.latePaymentCharge = latePaymentCharge;
	}
	public String getCurrentAgreementDuration() {
		return currentAgreementDuration;
	}
	public void setCurrentAgreementDuration(String currentAgreementDuration) {
		this.currentAgreementDuration = currentAgreementDuration;
	}
	public String getNumberOfAgreementsOnFile() {
		return numberOfAgreementsOnFile;
	}
	public void setNumberOfAgreementsOnFile(String numberOfAgreementsOnFile) {
		this.numberOfAgreementsOnFile = numberOfAgreementsOnFile;
	}
	public String getNoOfAnalysesOnFile() {
		return noOfAnalysesOnFile;
	}
	public void setNoOfAnalysesOnFile(String noOfAnalysesOnFile) {
		this.noOfAnalysesOnFile = noOfAnalysesOnFile;
	}
	public String getLastAnalysisDate() {
		return lastAnalysisDate;
	}
	public void setLastAnalysisDate(String lastAnalysisDate) {
		this.lastAnalysisDate = lastAnalysisDate;
	}
	public String getScannedAgreement() {
		return scannedAgreement;
	}
	public void setScannedAgreement(String scannedAgreement) {
		this.scannedAgreement = scannedAgreement;
	}
	public String getSignedAgreement() {
		return signedAgreement;
	}
	public void setSignedAgreement(String signedAgreement) {
		this.signedAgreement = signedAgreement;
	}
	public String getMustPostBefore() {
		return mustPostBefore;
	}
	public void setMustPostBefore(String mustPostBefore) {
		this.mustPostBefore = mustPostBefore;
	}
	public String getAgreementInactiveDate() {
		return agreementInactiveDate;
	}
	public void setAgreementInactiveDate(String agreementInactiveDate) {
		this.agreementInactiveDate = agreementInactiveDate;
	}

}
