package com.jacada.tracfoneAD.customerServiceProfile.web;

import com.jacada.tracfoneAD.customerServiceProfile.entities.CustomerServiceProfile;
import com.jacada.tracfoneAD.customerServiceProfile.model.interfaces.CustomerServiceProfileManager;
import com.jacada.tracfoneAD.util.JSONPayload;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.ServletRequestDataBinder;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.jacada.jad.feature.web.WorkspaceJsonController;

@Controller
@RequestMapping("/customerSearch")
@Lazy
public class JsonCustomerServiceProfileController extends
		WorkspaceJsonController {

	@Autowired
	private CustomerServiceProfileManager manager;

	@Override
	protected void initBinder(HttpServletRequest request,
			ServletRequestDataBinder binder) throws Exception {
		super.initBinder(request, binder);
	}

	@RequestMapping(value = "getCustomerServiceProfile/{esn}", method = RequestMethod.GET, produces = "application/json")
	public @ResponseBody
	JSONPayload getCustomerServiceProfile(@PathVariable String esn)
			throws Exception {

		CustomerServiceProfile customerServiceProfile = manager.getCustomerServiceProfile(esn);
		JSONPayload payload = new JSONPayload();
		payload.setPayload(customerServiceProfile);
		payload.setStatus("200");
		payload.setMessage("OK");
		return payload;
	}
}
