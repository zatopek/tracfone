package com.jacada.tracfoneAD.interaction.web;

import com.jacada.tracfoneAD.interaction.model.interfaces.InteractionManager;
import java.util.Collection;
import javax.servlet.http.HttpServletRequest;
import org.springframework.web.bind.ServletRequestDataBinder;
import org.springframework.web.servlet.ModelAndView;
import com.jacada.jad.feature.web.WorkspaceJsonController;

public class JsonInteractionController extends WorkspaceJsonController {

	private InteractionManager manager;

	public void setInteractionManager(InteractionManager manager) {
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
