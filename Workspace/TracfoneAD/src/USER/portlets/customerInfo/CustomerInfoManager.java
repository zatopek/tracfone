package USER.portlets.customerInfo;

import java.util.List;
import java.util.Map;

import USER.portlets.customerInfo.entity.CustomerInfo;
import USER.portlets.utility.objects.Account;
import USER.portlets.utility.objects.InteractionHistory;
import USER.portlets.utility.objects.Payment;

import com.jacada.jad.logging.LogWrapper;

public class CustomerInfoManager {

	private Map<String, CustomerInfo> customers;
	private Map<String, Account> accounts;

	public CustomerInfo getCustomer(String customerId){
		if(LogWrapper.isDebugEnabled(LogWrapper.GENERAL)){
			LogWrapper.debug("CustomerInfoManager.getCustomer customerId: " + customerId);
		}
		for (CustomerInfo c : customers.values()) {
			if (c.getSSN().equalsIgnoreCase(customerId)) {
				return c;
			} 
		}
		LogWrapper.debug("CustomerInfoManager. No customer found.");
		return null;
	}


	public List<Payment> getPayments(String customerId, String accountId) {
		List<Payment> payments = null;
		if(!isEmpty(accountId)){
			Account account = accounts.get(accountId);
			if(account != null){
				payments = account.getPayments();
			}
		}
		return payments;
	}
	
	public List<InteractionHistory> getInteractionsData(String customerId, String accountId) {
		List<InteractionHistory> interactions = null;
		if(!isEmpty(accountId)){
			Account account = accounts.get(accountId);
			if(account != null){
				interactions = account.getInteractions();
			}
		}
		return interactions;
	}
	
	private boolean isEmpty(String input) {
		return input == null || input.isEmpty();
	}

	public void setCustomers(Map<String, CustomerInfo> customers) {
		this.customers = customers;
	}

	public void setAccounts(Map<String, Account> accounts) {
		this.accounts = accounts;
	}

	public Map<String, CustomerInfo> getCustomers() {
		return customers;
	}
}
