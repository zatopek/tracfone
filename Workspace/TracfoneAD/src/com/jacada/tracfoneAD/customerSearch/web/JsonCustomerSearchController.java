package com.jacada.tracfoneAD.customerSearch.web;

import com.jacada.tracfoneAD.customerSearch.model.interfaces.CustomerSearchManager;
import java.util.Collection;
import javax.servlet.http.HttpServletRequest;
import org.springframework.web.bind.ServletRequestDataBinder;
import org.springframework.web.servlet.ModelAndView;
import com.jacada.jad.feature.web.WorkspaceJsonController;

public class JsonCustomerSearchController extends WorkspaceJsonController {

	private CustomerSearchManager manager;

	public void setCustomerSearchManager(CustomerSearchManager manager) {
		this.manager = manager;
	}
	
	@Override
	protected ModelAndView generateModelAndView(Collection<?> data) throws Exception {
		return super.generateModelAndView(data);
	}

	@Override
	protected void initBinder(HttpServletRequest request, ServletRequestDataBinder binder) throws Exception {
		super.initBinder(request, binder);
	}	
}
