package com.jacada.tracfoneAD.interactionNotes.web;

import com.jacada.tracfoneAD.interactionNotes.model.interfaces.InteractionNotesManager;
import java.util.Collection;
import javax.servlet.http.HttpServletRequest;
import org.springframework.web.bind.ServletRequestDataBinder;
import org.springframework.web.servlet.ModelAndView;
import com.jacada.jad.feature.web.WorkspaceJsonController;

public class JsonInteractionNotesController extends WorkspaceJsonController {

	private InteractionNotesManager manager;

	public void setInteractionNotesManager(InteractionNotesManager manager) {
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
