package USER.portlets.utility.objects;

import java.io.Serializable;

public class InteractionHistory implements Serializable {

	private static final long serialVersionUID = 1L;
	
	private String accountId;
	private String date;
	private String type;
	private String comments;
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
	public String getComments() {
		return comments;
	}
	public void setComments(String comments) {
		this.comments = comments;
	}
	public String getAccountId() {
		return accountId;
	}
	public void setAccountId(String accountId) {
		this.accountId = accountId;
	}

}
