package com.jacada.tracfoneAD.callHandling.model;

import SYSTEM.global.managers.ApplicationAuditingManager;

import com.jacada.jad.auditing.entity.Action;
import com.jacada.jad.auditing.entity.AuditApplication;
import com.jacada.jad.auditing.entity.Process;
import com.jacada.jad.auditing.exceptions.AuditingException;
import com.jacada.jad.feature.model.DefaultWorkspaceManager;
import com.jacada.jad.feature.annotations.FeatureManager;
import com.jacada.tracfoneAD.callHandling.model.interfaces.CallHandlingManager;
import com.jacada.tracfoneAD.util.TracFoneAudior;

@FeatureManager(name = "CallHandling")
public class DefaultCallHandlingManager extends DefaultWorkspaceManager implements CallHandlingManager {

	private static final long serialVersionUID = 1L;
	
	private ApplicationAuditingManager auditingManager;

	public ApplicationAuditingManager getAuditingManager() {
		return auditingManager;
	}
	
	public void setAuditingManager(ApplicationAuditingManager auditingManager) {
		this.auditingManager = auditingManager;
	}

	@Override
	public void auditScreenPop(String esn, String task_id) {
		AuditApplication auditApplication = auditingManager.getAuditApplication();
		Process incomingCallProcess = auditApplication.addProcess(TracFoneAudior.PROCESS_INCOMING_CALL);
		Action screenPopAction = incomingCallProcess.addAction(TracFoneAudior.ACTION_SCREEN_POP);
		screenPopAction.addActionParam("esn", esn);
		screenPopAction.addActionParam("task_id", task_id);
		try {
			auditingManager.audit(screenPopAction);
		} catch (AuditingException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
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
		System.out.println("auditAction starts");
		AuditApplication auditApplication = auditingManager.getAuditApplication();
		System.out.println("auditAction app:" + auditApplication.getProjectId());
		Process incomingCallProcess = auditApplication.addProcess(TracFoneAudior.PROCESS_INCOMING_CALL);
		System.out.println("auditAction add process");
		Action auditAction = incomingCallProcess.addAction(action);
		System.out.println("auditAction add action");
		auditAction.addActionParam("esn", esn);
		System.out.println("auditAction esn:" +esn);
		try {
			auditingManager.audit(auditAction);
			System.out.println("audit action");
		} catch (AuditingException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}	
		try {
			auditingManager.audit(incomingCallProcess);
			System.out.println("audit process");
		} catch (AuditingException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}		
	}

	@Override
	public void auditInvalidTask(String task_id) {
		AuditApplication auditApplication = auditingManager.getAuditApplication();
		Process incomingCallProcess = auditApplication.addProcess(TracFoneAudior.PROCESS_INCOMING_CALL);
		Action auditAction = incomingCallProcess.addAction(TracFoneAudior.ACTION_INVALID_TASK);
		auditAction.addActionParam("task_id", task_id);
		try {
			auditingManager.audit(auditAction);
			System.out.println("audit action");
		} catch (AuditingException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}	
		try {
			auditingManager.audit(incomingCallProcess);
			System.out.println("audit process");
		} catch (AuditingException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}		
		
	}

}
