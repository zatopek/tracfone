package com.jacada.tracfoneAD.transferGuidelines.web;

import com.jacada.tracfoneAD.transferGuidelines.model.interfaces.TransferGuidelinesManager;
import java.util.Collection;
import javax.servlet.http.HttpServletRequest;
import org.springframework.web.bind.ServletRequestDataBinder;
import org.springframework.web.servlet.ModelAndView;
import com.jacada.jad.feature.web.WorkspaceJsonController;

public class JsonTransferGuidelinesController extends WorkspaceJsonController {

	private TransferGuidelinesManager manager;

	public void setTransferGuidelinesManager(TransferGuidelinesManager manager) {
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
