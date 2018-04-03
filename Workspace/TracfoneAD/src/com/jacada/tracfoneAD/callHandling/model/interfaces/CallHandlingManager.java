package com.jacada.tracfoneAD.callHandling.model.interfaces;

import com.jacada.jad.feature.model.WorkspaceManager;

public interface CallHandlingManager extends WorkspaceManager {
	public void auditScreenPop(String esn, String task_id);
	public void auditCreateInteractionNotes(String esn);
	public void auditAddPin(String esn);
	public void auditPurchasePin(String esn);
	public void auditInvalidTask(String task_id);
}
