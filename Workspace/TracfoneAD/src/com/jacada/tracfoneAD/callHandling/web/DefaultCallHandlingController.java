package com.jacada.tracfoneAD.callHandling.web;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.StringTokenizer;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.jacada.jad.feature.web.WorkspaceController;
import com.jacada.jad.push.PushHelper;
import com.jacada.tracfoneAD.callHandling.model.interfaces.CallHandlingManager;
import com.jacada.tracfoneAD.customerServiceProfile.entities.AccountBalances;
import com.jacada.tracfoneAD.customerServiceProfile.entities.CustomerServiceProfile;
import com.jacada.tracfoneAD.customerServiceProfile.entities.ProductOffering;
import com.jacada.tracfoneAD.customerServiceProfile.entities.TasTicket;
import com.jacada.tracfoneAD.customerServiceProfile.model.interfaces.CustomerServiceProfileManager;
import com.jacada.tracfoneAD.util.JSONPayload;


@Controller
@RequestMapping("/call")
public class DefaultCallHandlingController extends WorkspaceController {

	@Autowired
	private CustomerServiceProfileManager customerServiceProfileManager;
	
	private CallHandlingManager manager;

	public void setCallHandlingManager(CallHandlingManager manager) {
		this.manager = manager;
	}
	@RequestMapping(value = "getLatestPurchaseObjId/{esn}/{brand}", method = RequestMethod.GET, produces = "application/json")
	public @ResponseBody
	JSONPayload getLatestPurchaseObjId(@PathVariable String esn, @PathVariable String brand, HttpServletRequest request) {
		JSONPayload payload = new JSONPayload();
		try{
			String purchase = customerServiceProfileManager.getLatestPurchaseObjId(esn, brand);
			payload.setStatus("200");
			payload.setSuccess(true);
			payload.setResult(purchase);			
		}
		catch(Exception e){
			payload.setStatus("500");
			payload.setSuccess(false);
			payload.setMessage(e.getLocalizedMessage());
		}
		return payload;
	}
	
	@RequestMapping(value = "getProductOfferings/{esn}/{brand}", method = RequestMethod.GET, produces = "application/json")
	public @ResponseBody
	JSONPayload getProductOfferings(@PathVariable String esn, @PathVariable String brand, HttpServletRequest request) {
		JSONPayload payload = new JSONPayload();
		try{
			LinkedHashMap<String, ProductOffering> productOfferings = customerServiceProfileManager.getProductOfferings(esn, brand);
			String objectId = customerServiceProfileManager.getLatestPurchaseObjId(esn, brand);
			LinkedHashMap<String, ProductOffering> newProductOfferings = findProductOffering(productOfferings, objectId);
			List<ProductOffering> list = new ArrayList<ProductOffering>();
			list.addAll(newProductOfferings.values());
			
			payload.setStatus("200");
			payload.setSuccess(true);
			payload.setResult(list);
			
		}
		catch(Exception e){
			payload.setStatus("500");
			payload.setSuccess(false);
			payload.setMessage(e.getLocalizedMessage());
		}
		return payload;
	}
	
	@RequestMapping(value = "getOpenedTickets/{esn}", method = RequestMethod.GET, produces = "application/json")
	public @ResponseBody
	JSONPayload getOpenedTickets(@PathVariable String esn, HttpServletRequest request){
		JSONPayload payload = new JSONPayload();
		try{
			List<TasTicket> openedTickets = customerServiceProfileManager.getOpenedTickets(esn);
			payload.setStatus("200");
			payload.setSuccess(true);
			payload.setResult(openedTickets);
			
		}
		catch(Exception e){
			payload.setStatus("500");
			payload.setSuccess(false);
			payload.setMessage(e.getLocalizedMessage());
		}
		return payload;
	}
	
	@RequestMapping(value = "incomingCall/{agentId}", method = RequestMethod.GET, produces = "application/json")
	public @ResponseBody
	void incoming(@PathVariable String agentId, HttpServletRequest request) throws Exception {
		/*
		Map <String, String[]> params = request.getParameterMap();
		JSONObject obj = new JSONObject();
		for (Map.Entry<String, String[]> entry : params.entrySet())
		{
			obj.put(entry.getKey(), entry.getValue()[0]);
		}
		PushHelper.pushMessage(request, "IncomingCallParamObj", obj);
		*/
		
		System.out.println("GET incomingCall->start");
		
		String esn = this.getRequestParameterValue(request.getParameter("url"), "esn");
		String task_id = this.getRequestParameterValue(request.getParameter("url"), "task_id");

		System.out.println(esn + " " + task_id);
		//PushHelper.publishMessageToAgent(agentId, "IncomingCallQueryString", request.getQueryString());
		
		CustomerServiceProfile customerServiceProfile = customerServiceProfileManager.getCustomerServiceProfile(esn);
		//CustomerServiceProfile customerServiceProfile = new CustomerServiceProfile();
		customerServiceProfile.getCallInfo().setTaskId(task_id);
		PushHelper.publishMessageToAgent(agentId, "CustomerServiceProfile", customerServiceProfile);
		AccountBalances accountBalances= customerServiceProfileManager.getAccountBalances(
				customerServiceProfile.getDeviceProfile().getPhoneStatus(),
				customerServiceProfile.getServiceProfile().getBrand(), esn);
		//AccountBalances accountBalances = new AccountBalances();
		PushHelper.publishMessageToAgent(agentId, "AccountBalances", accountBalances);
		//PushHelper.publishMessageToAgent(agentId, "CustomerServiceProfile", new CustomerServiceProfile());
		//PushHelper.publishMessageToAgent(agentId, "LaunchWorkflow", task_id);
		
		System.out.println("GET incomingCall->end");
		
	}
	
	@RequestMapping(value="incomingCall/{agentId}", method = RequestMethod.POST, produces = "application/json")
	public @ResponseBody void incomingCall(@PathVariable String agentId, HttpServletRequest request) throws Exception{

		System.out.println("POST incomingCall->start");
		
		String esn = this.getRequestParameterValue(request.getParameter("url"), "esn");
		String task_id = this.getRequestParameterValue(request.getParameter("url"), "task_id");
				
		//CustomerServiceProfile customerServiceProfile =  new CustomerServiceProfile();
		//Comment out for local testing
		CustomerServiceProfile customerServiceProfile = customerServiceProfileManager.getCustomerServiceProfile(esn);		
		customerServiceProfile.getCallInfo().setTaskId(task_id);
		System.out.println("POST incomingCall->push 1");
		PushHelper.publishMessageToAgent(agentId, "CustomerServiceProfile", customerServiceProfile);
		AccountBalances accountBalances= customerServiceProfileManager.getAccountBalances(
				customerServiceProfile.getDeviceProfile().getPhoneStatus(),
				customerServiceProfile.getServiceProfile().getBrand(), esn);
		System.out.println("POST incomingCall->push 2");
		PushHelper.publishMessageToAgent(agentId, "AccountBalances", accountBalances);
		//PushHelper.publishMessageToAgent(agentId, "CustomerServiceProfile", new CustomerServiceProfile());
		//PushHelper.publishMessageToAgent(agentId, "LaunchWorkflow", task_id);
		
		// Audit screen pop
		manager.auditScreenPop(esn, task_id);
		
		System.out.println("POST incomingCall->end");
	}	
	
	@RequestMapping(value="auditCreateInteractionNotes/{esn}", method = RequestMethod.GET, produces = "application/json")
	public @ResponseBody void audit(@PathVariable String esn, HttpServletRequest request) throws Exception{
		manager.auditCreateInteractionNotes(esn);
	}
	
	@RequestMapping(value="auditAddPin/{esn}", method = RequestMethod.GET, produces = "application/json")
	public @ResponseBody void auditAddPin(@PathVariable String esn, HttpServletRequest request) throws Exception{
		manager.auditAddPin(esn);
	}
	
	@RequestMapping(value="auditPurchasePin/{esn}", method = RequestMethod.GET, produces = "application/json")
	public @ResponseBody void auditPurchasePin(@PathVariable String esn, HttpServletRequest request) throws Exception{
		manager.auditPurchasePin(esn);
	}	
	
	private String getRequestParameterValue(String requestString, String parameter)
	{
		StringTokenizer st = new StringTokenizer(requestString, "&");
		while (st.hasMoreTokens()) {
			String token = st.nextToken();
			if(token.startsWith(parameter)){
				return token.substring(parameter.length()+1);
			}		
		};
		return "";
	}
	
	private LinkedHashMap<String, ProductOffering> findProductOffering(LinkedHashMap<String, ProductOffering> productOfferings, String objectId) {
		ProductOffering offer = productOfferings.get(objectId);
		if(offer != null){
			productOfferings.remove(objectId);
			LinkedHashMap<String, ProductOffering> newmap = (LinkedHashMap<String, ProductOffering>) productOfferings.clone();
			productOfferings.clear();
			offer.setRecentPurchase(true);
			productOfferings.put(offer.getObjectId(), offer);
			productOfferings.putAll(newmap);
	    }
	    return productOfferings;
	}
}
