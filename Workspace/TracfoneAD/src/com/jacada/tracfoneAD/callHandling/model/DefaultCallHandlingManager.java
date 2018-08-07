package com.jacada.tracfoneAD.callHandling.model;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.jacada.jad.auditing.entity.Action;
import com.jacada.jad.auditing.entity.AuditApplication;
import com.jacada.jad.auditing.entity.Process;
import com.jacada.jad.feature.annotations.FeatureManager;
import com.jacada.jad.feature.model.DefaultWorkspaceManager;
import com.jacada.tracfoneAD.callHandling.model.interfaces.CallHandlingManager;
import com.jacada.tracfoneAD.util.TracFoneAudior;

import SYSTEM.global.managers.ApplicationAuditingManager;

@FeatureManager(name = "CallHandling")
public class DefaultCallHandlingManager extends DefaultWorkspaceManager implements CallHandlingManager {

	private static final long serialVersionUID = 1L;
	private static final Logger LOGGER = LoggerFactory.getLogger(DefaultCallHandlingManager.class);

	private ApplicationAuditingManager auditingManager;

	public ApplicationAuditingManager getAuditingManager() {
		return auditingManager;
	}

	public void setAuditingManager(ApplicationAuditingManager auditingManager) {
		this.auditingManager = auditingManager;
	}

	@Override
	public void auditScreenPop(String esn, String task_id) {
		try {
			AuditApplication auditApplication = auditingManager.getAuditApplication();
			Process incomingCallProcess = auditApplication.addProcess(TracFoneAudior.PROCESS_INCOMING_CALL);
			Action screenPopAction = incomingCallProcess.addAction(TracFoneAudior.ACTION_SCREEN_POP);
			screenPopAction.addActionParam("esn", esn);
			screenPopAction.addActionParam("task_id", task_id);
			auditingManager.audit(screenPopAction);
		} catch (Exception e) {
			LOGGER.error("Exception auditing call pop", e);
		}
	}

	@Override
	public void auditCreateInteractionNotes(String esn) {
		this.auditAction(esn, TracFoneAudior.ACTION_CREATE_INTERACTION);
	}

	@Override
	public void auditAddPin(String esn) {
		this.auditAction(esn, TracFoneAudior.ACTION_ADD_PIN);
	}

	@Override
	public void auditPurchasePin(String esn) {
		this.auditAction(esn, TracFoneAudior.ACTION_PURCHASE_PIN);
	}

	private void auditAction(String esn, String action) {
		try {
			if (LOGGER.isDebugEnabled())
				LOGGER.debug("auditAction starts");
			AuditApplication auditApplication = auditingManager.getAuditApplication();
			if (LOGGER.isDebugEnabled())
				LOGGER.debug("auditAction app:" + auditApplication.getProjectId());
			Process incomingCallProcess = auditApplication.addProcess(TracFoneAudior.PROCESS_INCOMING_CALL);
			if (LOGGER.isDebugEnabled())
				LOGGER.debug("auditAction add process");
			Action auditAction = incomingCallProcess.addAction(action);
			if (LOGGER.isDebugEnabled())
				LOGGER.debug("auditAction add action");
			auditAction.addActionParam("esn", esn);
			if (LOGGER.isDebugEnabled())
				LOGGER.debug("auditAction esn:" + esn);
			auditingManager.audit(auditAction);
			if (LOGGER.isDebugEnabled())
				LOGGER.debug("audit action");
			auditingManager.audit(incomingCallProcess);
			if (LOGGER.isDebugEnabled())
				LOGGER.debug("audit process");
		} catch (Exception e) {
			LOGGER.error("Exception auditing call pop", e);
		}
	}

	@Override
	public void auditInvalidTask(String task_id) {
		try {
			AuditApplication auditApplication = auditingManager.getAuditApplication();
			Process incomingCallProcess = auditApplication.addProcess(TracFoneAudior.PROCESS_INCOMING_CALL);
			Action auditAction = incomingCallProcess.addAction(TracFoneAudior.ACTION_INVALID_TASK);
			auditAction.addActionParam("task_id", task_id);
			auditingManager.audit(auditAction);
			if (LOGGER.isDebugEnabled())
				LOGGER.debug("audit action");
			auditingManager.audit(incomingCallProcess);
			if (LOGGER.isDebugEnabled())
				LOGGER.debug("audit process");
		} catch (Exception e) {
			LOGGER.error("Exception auditing call pop", e);
		}

	}
}
