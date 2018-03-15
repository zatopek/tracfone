package com.jacada.tracfoneAD.util;

import java.io.Serializable;

import com.jacada.jad.auditing.auditor.Auditor;
import com.jacada.jad.auditing.entity.Action;
import com.jacada.jad.auditing.entity.AgentSession;
import com.jacada.jad.auditing.entity.AuditApplication;
import com.jacada.jad.auditing.entity.Interaction;
import com.jacada.jad.auditing.entity.Process;
import com.jacada.jad.auditing.exceptions.AuditingException;

public class TracFoneAudior implements Serializable, Auditor{

	/**
	 * 
	 */
	private static final long serialVersionUID = -3654999967127237649L;

	public static final String PROCESS_INCOMING_CALL = "INCOMING_CALL";
	public static final String ACTION_SCREEN_POP = "SCREEN_POP";
	public static final String ACTION_CREATE_INTERACTION = "CREATE_INTERACTION";
	public static final String ACTION_ADD_PIN = "ADD_PIN";
	public static final String ACTION_PURCHASE_PIN = "PURCHASE_PIN";
	
	@Override
	public void audit(AgentSession arg0) throws AuditingException {
		// TODO Auto-generated method stub
		
	}
	@Override
	public void audit(Interaction arg0) throws AuditingException {
		// TODO Auto-generated method stub
		
	}
	@Override
	public void audit(Process arg0) throws AuditingException {
		// TODO Auto-generated method stub
		
	}
	@Override
	public void audit(Action arg0) throws AuditingException {
		// TODO Auto-generated method stub
		
	}
	@Override
	public void audit(AuditApplication arg0) throws AuditingException {
		// TODO Auto-generated method stub
		
	}
}
