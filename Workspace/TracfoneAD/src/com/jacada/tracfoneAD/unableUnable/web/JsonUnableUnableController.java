package com.jacada.tracfoneAD.unableUnable.web;

import com.jacada.tracfoneAD.unableUnable.model.interfaces.UnableUnableManager;
import java.util.Collection;
import javax.servlet.http.HttpServletRequest;
import org.springframework.web.bind.ServletRequestDataBinder;
import org.springframework.web.servlet.ModelAndView;
import com.jacada.jad.feature.web.WorkspaceJsonController;

public class JsonUnableUnableController extends WorkspaceJsonController {

	private UnableUnableManager manager;

	public void setUnableUnableManager(UnableUnableManager manager) {
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
