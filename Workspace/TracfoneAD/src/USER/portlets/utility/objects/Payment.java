package USER.portlets.utility.objects;

import java.io.Serializable;

public class Payment implements Serializable {

	private static final long serialVersionUID = 1L;
	
	private String accountId;
	private String date;
	private String type;
	private String amount;
	private String balance;
	public Payment() {
		super();
	}
	public Payment(String date, String type, String amount, String balance) {
		super();
		this.date = date;
		this.type = type;
		this.amount = amount;
		this.balance = balance;
	}
	public String getDate() {
		return date;
	}
	public void setDate(String date) {
		this.date = date;
	}
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	public String getAmount() {
		return amount;
	}
	public void setAmount(String amount) {
		this.amount = amount;
	}
	public String getBalance() {
		return balance;
	}
	public void setBalance(String balance) {
		this.balance = balance;
	}
	public String getAccountId() {
		return accountId;
	}
	public void setAccountId(String accountId) {
		this.accountId = accountId;
	}
	

}
