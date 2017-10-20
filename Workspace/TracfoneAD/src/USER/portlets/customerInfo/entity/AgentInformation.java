package USER.portlets.customerInfo.entity;

import java.io.Serializable;

public class AgentInformation implements Serializable {

	private static final long serialVersionUID = 1L;
	
	private String number;
	private String name;
	private String phone;
	private String email;
	// TODO maybe address should be an object
	private String address;
	private String paperLessAgent;
	
	public String getPaperLessAgent() {
		return paperLessAgent;
	}
	public void setPaperLessAgent(String paperLessAgent) {
		this.paperLessAgent = paperLessAgent;
	}
	
	public String getNumber() {
		return number;
	}
	public void setNumber(String number) {
		this.number = number;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getPhone() {
		return phone;
	}
	public void setPhone(String phone) {
		this.phone = phone;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public String getAddress() {
		return address;
	}
	public void setAddress(String address) {
		this.address = address;
	}
	

}
