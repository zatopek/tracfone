package com.jacada.tracfoneAD.callHandling.web;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.StringTokenizer;

import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.jacada.jad.feature.web.WorkspaceController;
import com.jacada.jad.push.PushHelper;
import com.jacada.tracfoneAD.callHandling.model.interfaces.CallHandlingManager;
import com.jacada.tracfoneAD.customerServiceProfile.entities.CustomerServiceProfile;
import com.jacada.tracfoneAD.customerServiceProfile.entities.Flash;
import com.jacada.tracfoneAD.customerServiceProfile.entities.InteractionDetail;
import com.jacada.tracfoneAD.customerServiceProfile.entities.InteractionReason;
import com.jacada.tracfoneAD.customerServiceProfile.entities.ProductOffering;
import com.jacada.tracfoneAD.customerServiceProfile.entities.TasTicket;
import com.jacada.tracfoneAD.customerServiceProfile.model.interfaces.CustomerServiceProfileManager;
import com.jacada.tracfoneAD.util.JSONPayload;

@Controller
@RequestMapping("/call")
public class DefaultCallHandlingController extends WorkspaceController {

	private static final Logger LOGGER = LoggerFactory.getLogger(DefaultCallHandlingController.class);

	@Autowired
	private CustomerServiceProfileManager customerServiceProfileManager;

	@Autowired
	private ThreadPoolTaskExecutor executor;

	private CallHandlingManager manager;

	public void setCallHandlingManager(CallHandlingManager manager) {
		this.manager = manager;
	}

	@RequestMapping(value = "getLatestPurchaseObjId/{esn}/{brand}", method = RequestMethod.GET, produces = "application/json")
	public @ResponseBody JSONPayload getLatestPurchaseObjId(@PathVariable String esn, @PathVariable String brand,
			HttpServletRequest request) {
		JSONPayload payload = new JSONPayload();
		try {
			String purchase = customerServiceProfileManager.getLatestPurchaseObjId(esn, brand);
			payload.setStatus("200");
			payload.setSuccess(true);
			payload.setResult(purchase);
		} catch (Exception e) {
			payload.setStatus("500");
			payload.setSuccess(false);
			payload.setMessage(e.getLocalizedMessage());
		}
		return payload;
	}

	@RequestMapping(value = "getInteractionDetails/{reasonObjId}", method = RequestMethod.GET, produces = "application/json")
	public @ResponseBody JSONPayload getInteractionDetails(@PathVariable String reasonObjId,
			HttpServletRequest request) {
		JSONPayload payload = new JSONPayload();
		try {
			List<InteractionDetail> details = customerServiceProfileManager.getInteractionDetails(reasonObjId);
			payload.setStatus("200");
			payload.setSuccess(true);
			payload.setResult(details);

		} catch (Exception e) {
			payload.setStatus("500");
			payload.setSuccess(false);
			payload.setMessage(e.getLocalizedMessage());
		}
		return payload;
	}

	@RequestMapping(value = "getInteractionReasons", method = RequestMethod.GET, produces = "application/json")
	public @ResponseBody JSONPayload getInteractionReasons(HttpServletRequest request) {
		JSONPayload payload = new JSONPayload();
		try {
			List<InteractionReason> reasons = customerServiceProfileManager.getInteractionReasons();
			payload.setStatus("200");
			payload.setSuccess(true);
			payload.setResult(reasons);

		} catch (Exception e) {
			payload.setStatus("500");
			payload.setSuccess(false);
			payload.setMessage(e.getLocalizedMessage());
		}
		return payload;
	}

	@RequestMapping(value = "getInteractionResults", method = RequestMethod.GET, produces = "application/json")
	public @ResponseBody JSONPayload getInteractionResults(HttpServletRequest request) {
		JSONPayload payload = new JSONPayload();
		try {
			List<InteractionReason> results = customerServiceProfileManager.getResults();
			payload.setStatus("200");
			payload.setSuccess(true);
			payload.setResult(results);

		} catch (Exception e) {
			payload.setStatus("500");
			payload.setSuccess(false);
			payload.setMessage(e.getLocalizedMessage());
		}
		return payload;
	}

	@RequestMapping(value = "getProductOfferings/{esn}/{brand}", method = RequestMethod.GET, produces = "application/json")
	public @ResponseBody JSONPayload getProductOfferings(@PathVariable String esn, @PathVariable String brand,
			HttpServletRequest request) {
		JSONPayload payload = new JSONPayload();
		try {
			LinkedHashMap<String, ProductOffering> productOfferings = customerServiceProfileManager
					.getProductOfferings(esn, brand);
			String objectId = customerServiceProfileManager.getLatestPurchaseObjId(esn, brand);
			LinkedHashMap<String, ProductOffering> newProductOfferings = findProductOffering(productOfferings,
					objectId);
			List<ProductOffering> list = new ArrayList<ProductOffering>();
			list.addAll(newProductOfferings.values());

			payload.setStatus("200");
			payload.setSuccess(true);
			payload.setResult(list);

		} catch (Exception e) {
			payload.setStatus("500");
			payload.setSuccess(false);
			payload.setMessage(e.getLocalizedMessage());
		}
		return payload;
	}

	@RequestMapping(value = "getOpenedTickets/{esn}", method = RequestMethod.GET, produces = "application/json")
	public @ResponseBody JSONPayload getOpenedTickets(@PathVariable String esn, HttpServletRequest request) {
		JSONPayload payload = new JSONPayload();
		try {
			List<TasTicket> openedTickets = customerServiceProfileManager.getOpenedTickets(esn);
			payload.setStatus("200");
			payload.setSuccess(true);
			payload.setResult(openedTickets);

		} catch (Exception e) {
			payload.setStatus("500");
			payload.setSuccess(false);
			payload.setMessage(e.getLocalizedMessage());
		}
		return payload;
	}

	@RequestMapping(value = "getActiveFlashes/{esn}", method = RequestMethod.GET, produces = "application/json")
	public @ResponseBody JSONPayload getActiveFlashes(@PathVariable String esn, HttpServletRequest request) {
		JSONPayload payload = new JSONPayload();
		try {
			List<Flash> activeFlashes = customerServiceProfileManager.getActiveFlashes(esn);
			payload.setStatus("200");
			payload.setSuccess(true);
			payload.setResult(activeFlashes);

		} catch (Exception e) {
			payload.setStatus("500");
			payload.setSuccess(false);
			payload.setMessage(e.getLocalizedMessage());
		}
		return payload;
	}

	@RequestMapping(value = "customerSearch/{agentId}", method = RequestMethod.GET, produces = "application/json")
	public @ResponseBody JSONPayload customerSearch(@PathVariable String agentId, HttpServletRequest request)
			throws Exception {

		JSONPayload payload = new JSONPayload();
		try {
			String esn = request.getParameter("esn");

			LOGGER.debug("esn=" + esn);

			CustomerServiceProfile customerServiceProfile = new CustomerServiceProfile();
			if (esn != null && esn.trim().length() > 0) {
				customerServiceProfile = customerServiceProfileManager.getCustomerServiceProfile(esn);
			}
			if (customerServiceProfile.getDeviceProfile().getMin() == null) {
				payload.setStatus("500");
				payload.setSuccess(false);
			} else {
				payload.setStatus("200");
				payload.setSuccess(true);
				executor.execute(new AccountBalancesThread(customerServiceProfileManager, agentId, esn,
						customerServiceProfile.getServiceProfile().getBrand(),
						customerServiceProfile.getDeviceProfile().getPhoneStatus()));
			}
			payload.setResult(customerServiceProfile);

		} catch (Exception e) {
			payload.setStatus("500");
			payload.setSuccess(false);
			payload.setMessage(e.getLocalizedMessage());
		}
		return payload;
	}

	@RequestMapping(value = "incomingCall/{agentId}", method = RequestMethod.GET, produces = "application/json")
	public @ResponseBody void incoming(@PathVariable String agentId, HttpServletRequest request) throws Exception {
		/*
		 * Map <String, String[]> params = request.getParameterMap(); JSONObject
		 * obj = new JSONObject(); for (Map.Entry<String, String[]> entry :
		 * params.entrySet()) { obj.put(entry.getKey(), entry.getValue()[0]); }
		 * PushHelper.pushMessage(request, "IncomingCallParamObj", obj);
		 */

		String url = request.getParameter("url");
		String esn = this.getRequestParameterValue(url, "esn");
		String task_id = this.getRequestParameterValue(url, "task_id");
		String call_id = this.getRequestParameterValue(url, "call_id");
		// String flash_id = this.getRequestParameterValue(url, "flash_id");
		// String case_id = this.getRequestParameterValue(url, "case_id");

		LOGGER.debug("esn=" + esn + " task_id=" + task_id + " call_id=" + call_id);
		// PushHelper.publishMessageToAgent(agentId, "IncomingCallQueryString",
		// request.getQueryString());

		CustomerServiceProfile customerServiceProfile = customerServiceProfileManager.getCustomerServiceProfile(esn);
		// CustomerServiceProfile customerServiceProfile = new
		// CustomerServiceProfile();
		customerServiceProfile.getCallInfo().setTaskId(task_id);
		customerServiceProfile.getCallInfo().setCallId(call_id);
		customerServiceProfile.getTasInfo().setUrl(url);
		// customerServiceProfile.getCustomerProfile().setCaseId(case_id);
		// customerServiceProfile.getCustomerProfile().setFlashId(flash_id);
		PushHelper.publishMessageToAgent(agentId, "CustomerServiceProfile", customerServiceProfile);
		// Audit screen pop
		// manager.auditScreenPop(esn, task_id);

		// creating thread
		executor.execute(new AccountBalancesThread(customerServiceProfileManager, agentId, esn,
				customerServiceProfile.getServiceProfile().getBrand(),
				customerServiceProfile.getDeviceProfile().getPhoneStatus()));
	}

	@RequestMapping(value = "auditCreateInteractionNotes/{esn}", method = RequestMethod.GET, produces = "application/json")
	public @ResponseBody void audit(@PathVariable String esn, HttpServletRequest request) throws Exception {
		manager.auditCreateInteractionNotes(esn);
	}

	@RequestMapping(value = "auditAddPin/{esn}", method = RequestMethod.GET, produces = "application/json")
	public @ResponseBody void auditAddPin(@PathVariable String esn, HttpServletRequest request) throws Exception {
		manager.auditAddPin(esn);
	}

	@RequestMapping(value = "auditPurchasePin/{esn}", method = RequestMethod.GET, produces = "application/json")
	public @ResponseBody void auditPurchasePin(@PathVariable String esn, HttpServletRequest request) throws Exception {
		manager.auditPurchasePin(esn);
	}

	@RequestMapping(value = "auditInvalidTask/{task_id}", method = RequestMethod.GET, produces = "application/json")
	public @ResponseBody void auditInvalidTask(@PathVariable String task_id, HttpServletRequest request)
			throws Exception {
		manager.auditInvalidTask(task_id);
	}

	private String getRequestParameterValue(String requestString, String parameter) {
		StringTokenizer st = new StringTokenizer(requestString, "&");
		while (st.hasMoreTokens()) {
			String token = st.nextToken();
			if (token.startsWith(parameter)) {
				return token.substring(parameter.length() + 1);
			}
		}
		;
		return "";
	}

	@SuppressWarnings("unchecked")
	private LinkedHashMap<String, ProductOffering> findProductOffering(
			LinkedHashMap<String, ProductOffering> productOfferings, String objectId) {
		ProductOffering offer = productOfferings.get(objectId);
		if (offer != null) {
			productOfferings.remove(objectId);
			LinkedHashMap<String, ProductOffering> newmap = (LinkedHashMap<String, ProductOffering>) productOfferings
					.clone();
			productOfferings.clear();
			offer.setRecentPurchase(true);
			productOfferings.put(offer.getObjectId(), offer);
			productOfferings.putAll(newmap);
		}
		return productOfferings;
	}

}
