package USER.directory;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Component;

import USER.portlets.customerInfo.CustomerInfoManager;
import USER.portlets.customerInfo.entity.CustomerInfo;

import com.jacada.jad.directory.search.provider.SearchProvider;
import com.jacada.jad.directory.search.result.ContactRecord;
import com.jacada.jad.directory.search.result.ContactSearchResult;

@Component("customSearchProvider")
@Lazy
public class CustomSearchProvider implements SearchProvider{

	protected static final String CONTACT_ID_ATTR = "ContactId";
	@Autowired
	private CustomerInfoManager customerInfoManager;
	
	@Override
	public ContactSearchResult searchContactByName(String name, boolean exactSearch) {
		Collection<CustomerInfo> customers = customerInfoManager.getCustomers().values();
		
		List<ContactRecord> contacts = new ArrayList<ContactRecord>(customers.size());
		String firstName = "";
		String lastName = "";
		name = name.toLowerCase();
		boolean singleExpression = true;
		String[] searchExpressions = name.split(" ");
		if(searchExpressions.length == 2){
			singleExpression = false;
			firstName = searchExpressions[0];
			lastName = searchExpressions[1];
		}
		if(!singleExpression){
			for (CustomerInfo customerInfo : customers) {
				if(exactSearch){
					if(customerInfo.getFirstName().equalsIgnoreCase(firstName) && firstName.trim().length()> 0 && (customerInfo.getLastName().equalsIgnoreCase(lastName)&& lastName.trim().length()> 0) ){
						ContactRecord record = convert(customerInfo);
						contacts.add(record);
					}
				}else{
					if(customerInfo.getFirstName().toLowerCase().contains(firstName) && firstName.trim().length()> 0 && (customerInfo.getLastName().toLowerCase().contains(lastName)&& lastName.trim().length()> 0) ){
						ContactRecord record = convert(customerInfo);
						contacts.add(record);
					}
				}
			}
		}else{
			for (CustomerInfo customerInfo : customers) {
				if(exactSearch){
					if((customerInfo.getFirstName().equalsIgnoreCase(name) && name.trim().length()> 0) || (customerInfo.getLastName().equalsIgnoreCase(name)&& name.trim().length()> 0) ){
						ContactRecord record = convert(customerInfo);
						contacts.add(record);
					}
				}else{
					if((customerInfo.getFirstName().toLowerCase().contains(name) && name.trim().length()> 0) || (customerInfo.getLastName().toLowerCase().contains(name)&& name.trim().length()> 0) ){
						ContactRecord record = convert(customerInfo);
						contacts.add(record);
					}
				}
			}
		}
		ContactSearchResult result = new ContactSearchResult(contacts);
		return result;
	}

	public ContactSearchResult searchContactByEmail(String email) {
		List<ContactRecord> contacts =  new ArrayList<ContactRecord>();
		Collection<CustomerInfo> customers = customerInfoManager.getCustomers().values();
		for (CustomerInfo customerInfo : customers) {
			if(customerInfo.getEmail().equalsIgnoreCase(email)){
				ContactRecord record = convert(customerInfo);
				contacts.add(record);
			}
		}
		return new ContactSearchResult(contacts);
	}

	@Override
	public ContactSearchResult searchContactByPhone(String phone) {
		List<ContactRecord> contacts =  new ArrayList<ContactRecord>();
		Collection<CustomerInfo> customers = customerInfoManager.getCustomers().values();
		for (CustomerInfo customerInfo : customers) {
			if(customerInfo.getTelephoneHome().equalsIgnoreCase(phone) || customerInfo.getTelephoneOther().equalsIgnoreCase(phone)){
				ContactRecord record = convert(customerInfo);
				contacts.add(record);
			}
		}
		return new ContactSearchResult(contacts);
	}
	
	@Override
	public ContactSearchResult searchContacts(String searchStr) {
		String[] params = searchStr.split("\\s+");//split ignore white space
		List<ContactRecord> contacts =  new ArrayList<ContactRecord>();
		if(StringUtils.isEmpty(searchStr)){
			return new ContactSearchResult(contacts);
		}
		searchStr = searchStr.toLowerCase();
		
		Collection<CustomerInfo> customers = customerInfoManager.getCustomers().values();
		for (CustomerInfo customerInfo : customers) {
			if(params.length == 2){
				//search for First+Last name
				params[0] = params[0].toLowerCase();
				params[1] = params[1].toLowerCase();
				if(customerInfo.getFirstName().toLowerCase().contains(params[0]) && customerInfo.getLastName().toLowerCase().contains(params[1])|| 
						customerInfo.getFirstName().toLowerCase().contains(params[1]) && customerInfo.getLastName().toLowerCase().contains(params[0])){
					ContactRecord record = convert(customerInfo);
					contacts.add(record);
				}
			}else if(customerInfo.getTelephoneHome().contains(searchStr) || customerInfo.getTelephoneOther().contains(searchStr) || customerInfo.getEmail().toLowerCase().contains(searchStr)
					|| customerInfo.getFirstName().toLowerCase().contains(searchStr) || customerInfo.getLastName().toLowerCase().contains(searchStr)){
				ContactRecord record = convert(customerInfo);
				contacts.add(record);
			}
		}
		return new ContactSearchResult(contacts);
	}

	@Override
	public ContactSearchResult loadContact(String contactId) {
		List<ContactRecord> contacts = new ArrayList<ContactRecord>(1);
		
		Collection<CustomerInfo> customers = customerInfoManager.getCustomers().values();
		for (CustomerInfo customerInfo : customers) {
			if(customerInfo.getSSN().equalsIgnoreCase(contactId)){
				ContactRecord record = convert(customerInfo);
				contacts.add(record);
				break;
			}
		}
		return new ContactSearchResult(contacts);
	}
	
	@Override
	public String getContactIdAttribute() {
		return CONTACT_ID_ATTR;
	}

	private ContactRecord convert(CustomerInfo customerInfo){
		Map<String, Object> attributes = new HashMap<String, Object>();
		//these keys must match CustomerInfo.js
		attributes.put("FirstName", customerInfo.getFirstName());
		attributes.put("LastName", customerInfo.getLastName());
		attributes.put("EmailAddress", customerInfo.getEmail());
		attributes.put("HomeStreet", customerInfo.getResidenceCity());
		attributes.put("HomeCity", customerInfo.getResidenceCity());
		attributes.put("HomeCountry", customerInfo.getResidenceCounty());
		attributes.put("HomeState", customerInfo.getResidenceState());
		attributes.put("HomePostalCode", customerInfo.getResidencePostalcode());
		attributes.put("HomePhone", customerInfo.getTelephoneHome());
		attributes.put("MobilePhone", customerInfo.getTelephoneOther());
		attributes.put(CONTACT_ID_ATTR, customerInfo.getSSN());
		return new ContactRecord(attributes);
	}
}
