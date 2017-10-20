package com.jacada.tracfoneAD.redemption.web;

import com.jacada.tracfoneAD.redemption.model.interfaces.RedemptionManager;
import java.util.Collection;
import javax.servlet.http.HttpServletRequest;
import org.springframework.web.bind.ServletRequestDataBinder;
import org.springframework.web.servlet.ModelAndView;
import com.jacada.jad.feature.web.WorkspaceJsonController;

public class JsonRedemptionController extends WorkspaceJsonController {

	private RedemptionManager manager;

	public void setRedemptionManager(RedemptionManager manager) {
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
