package USER.portlets.customerInfo.entity;

import java.util.List;

import USER.portlets.utility.objects.Account;


public class CustomerInfo{

	private String SSN;
	private String firstName;
	private String lastName;
	private String email;
	private String language;
	private String telephoneHome;
	private String telephoneOther;
	private String residenceStreet1;
	private String residenceCity;
	private String residenceState;
	private String residencePostalcode;
	private String residenceCounty;
	private String shippingPostalcode;
	private AgentInformation agentInformation;
	private List<Account> accounts;

	public String getSSN() {
		return SSN;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((SSN == null) ? 0 : SSN.hashCode());
		result = prime * result + ((email == null) ? 0 : email.hashCode());
		result = prime * result + ((firstName == null) ? 0 : firstName.hashCode());
		result = prime * result + ((lastName == null) ? 0 : lastName.hashCode());
		result = prime * result + ((residenceCity == null) ? 0 : residenceCity.hashCode());
		result = prime * result + ((residenceCounty == null) ? 0 : residenceCounty.hashCode());
		result = prime * result + ((residencePostalcode == null) ? 0 : residencePostalcode.hashCode());
		result = prime * result + ((residenceState == null) ? 0 : residenceState.hashCode());
		result = prime * result + ((telephoneHome == null) ? 0 : telephoneHome.hashCode());
		result = prime * result + ((telephoneOther == null) ? 0 : telephoneOther.hashCode());
		return result;
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		CustomerInfo other = (CustomerInfo) obj;
		if (SSN == null) {
			if (other.SSN != null)
				return false;
		} else if (!SSN.equals(other.SSN))
			return false;
		if (email == null) {
			if (other.email != null)
				return false;
		} else if (!email.equals(other.email))
			return false;
		if (firstName == null) {
			if (other.firstName != null)
				return false;
		} else if (!firstName.equals(other.firstName))
			return false;
		if (lastName == null) {
			if (other.lastName != null)
				return false;
		} else if (!lastName.equals(other.lastName))
			return false;
		if (residenceCity == null) {
			if (other.residenceCity != null)
				return false;
		} else if (!residenceCity.equals(other.residenceCity))
			return false;
		if (residenceCounty == null) {
			if (other.residenceCounty != null)
				return false;
		} else if (!residenceCounty.equals(other.residenceCounty))
			return false;
		if (residencePostalcode == null) {
			if (other.residencePostalcode != null)
				return false;
		} else if (!residencePostalcode.equals(other.residencePostalcode))
			return false;
		if (residenceState == null) {
			if (other.residenceState != null)
				return false;
		} else if (!residenceState.equals(other.residenceState))
			return false;
		if (telephoneHome == null) {
			if (other.telephoneHome != null)
				return false;
		} else if (!telephoneHome.equals(other.telephoneHome))
			return false;
		if (telephoneOther == null) {
			if (other.telephoneOther != null)
				return false;
		} else if (!telephoneOther.equals(other.telephoneOther))
			return false;
		return true;
	}

	public void setSSN(String sSN) {
		SSN = sSN;
	}

	public String getFirstName() {
		return firstName;
	}

	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}

	public String getLastName() {
		return lastName;
	}

	public void setLastName(String lastName) {
		this.lastName = lastName;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getLanguage() {
		return language;
	}

	public void setLanguage(String language) {
		this.language = language;
	}

	public String getTelephoneHome() {
		return telephoneHome;
	}

	public void setTelephoneHome(String telephoneHome) {
		this.telephoneHome = telephoneHome;
	}

	public String getTelephoneOther() {
		return telephoneOther;
	}

	public void setTelephoneOther(String telephoneOther) {
		this.telephoneOther = telephoneOther;
	}

	public String getResidenceStreet1() {
		return residenceStreet1;
	}

	public void setResidenceStreet1(String residenceStreet1) {
		this.residenceStreet1 = residenceStreet1;
	}

	public String getResidenceCity() {
		return residenceCity;
	}

	public void setResidenceCity(String residenceCity) {
		this.residenceCity = residenceCity;
	}

	public String getResidenceState() {
		return residenceState;
	}

	public void setResidenceState(String residenceState) {
		this.residenceState = residenceState;
	}

	public String getResidencePostalcode() {
		return residencePostalcode;
	}

	public void setResidencePostalcode(String residencePostalcode) {
		this.residencePostalcode = residencePostalcode;
	}

	public String getResidenceCounty() {
		return residenceCounty;
	}

	public void setResidenceCounty(String residenceCounty) {
		this.residenceCounty = residenceCounty;
	}

	public String getShippingPostalcode() {
		return shippingPostalcode;
	}

	public void setShippingPostalcode(String shippingPostalcode) {
		this.shippingPostalcode = shippingPostalcode;
	}

	public AgentInformation getAgentInformation() {
		return agentInformation;
	}

	public void setAgentInformation(AgentInformation agentInformation) {
		this.agentInformation = agentInformation;
	}

	public List<Account> getAccounts() {
		return accounts;
	}

	public void setAccounts(List<Account> accounts) {
		this.accounts = accounts;
	}

}
