package USER.portlets.customerInfo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import USER.portlets.customerInfo.CustomerInfoManager;
import USER.portlets.customerInfo.entity.CustomerInfo;
import USER.portlets.customerInfo.entity.CustomerInfoData;
import USER.portlets.utility.objects.InteractionHistory;
import USER.portlets.utility.objects.Payment;

import com.jacada.jad.logging.LogWrapper;

@Controller
@RequestMapping("/customerInfo")
@Lazy
public class CustomerInfoController {
	

	@Autowired
	private CustomerInfoManager customerInfoManager;
	
	
	@RequestMapping(value="load/{customerId}", method = RequestMethod.GET, produces = "application/json")
	public @ResponseBody ResponseEntity<CustomerInfoData> loadCustomer(@PathVariable String customerId) throws Exception{
		if(LogWrapper.isDebugEnabled(LogWrapper.GENERAL)){
			LogWrapper.debug(this.getClass().getName() + ".loadCustomer using customerId: " + customerId);
		}
		CustomerInfo customer = customerInfoManager.getCustomer(customerId);
		return  new ResponseEntity<CustomerInfoData>(new CustomerInfoData(customer), getHeaders(), HttpStatus.OK);
	}
	
	@RequestMapping(value = "*", method=RequestMethod.GET, produces = "application/json")
	public @ResponseBody ResponseEntity<String> defaults() throws Exception{
		return new ResponseEntity<String>("{}", getHeaders(), HttpStatus.OK);
	}
	
	@RequestMapping(value="accounts/{customerId}", method = RequestMethod.GET, produces = "application/json")
	public @ResponseBody ResponseEntity<CustomerInfoData> loadAccounts(@PathVariable String customerId) throws Exception{
		if(LogWrapper.isDebugEnabled(LogWrapper.GENERAL)){
			LogWrapper.debug(this.getClass().getName() + ".loadCustomer using customerId: " + customerId);
		}
		CustomerInfo customer = customerInfoManager.getCustomer(customerId);
		CustomerInfoData data = new CustomerInfoData(customer.getAccounts());
		return  new ResponseEntity<CustomerInfoData>(data, getHeaders(), HttpStatus.OK);
	}
	
	@RequestMapping(value="payments/{customerId}/{accountId}", method = RequestMethod.GET, produces = "application/json")
	public @ResponseBody ResponseEntity<CustomerInfoData> loadPayments(@PathVariable String customerId, @PathVariable String accountId) throws Exception{
		if(LogWrapper.isDebugEnabled(LogWrapper.GENERAL)){
			LogWrapper.debug(this.getClass().getName() + ".loadPayments using customerId: " + customerId+ "  accountId: "+accountId);
		}
		List<Payment> payments = customerInfoManager.getPayments(customerId, accountId);
		CustomerInfoData data = new CustomerInfoData(payments);
		return  new ResponseEntity<CustomerInfoData>(data, getHeaders(), HttpStatus.OK);
	}
	
	@RequestMapping(value="interactions/{customerId}/{accountId}", method = RequestMethod.GET, produces = "application/json")
	public @ResponseBody ResponseEntity<CustomerInfoData> loadInteractions(@PathVariable String customerId, @PathVariable String accountId) throws Exception{
		if(LogWrapper.isDebugEnabled(LogWrapper.GENERAL)){
			LogWrapper.debug(this.getClass().getName() + ".interactions using customerId: " + customerId+ "  accountId: "+accountId);
		}
		List<InteractionHistory> interactionsData = customerInfoManager.getInteractionsData(customerId, accountId);
		CustomerInfoData data = new CustomerInfoData(interactionsData);
		return  new ResponseEntity<CustomerInfoData>(data, getHeaders(), HttpStatus.OK);
	}
	
	private HttpHeaders getHeaders(){
		HttpHeaders responseHeaders = new HttpHeaders();
        responseHeaders.set("Content-Type", "application/json");
        return responseHeaders;
	}

}
