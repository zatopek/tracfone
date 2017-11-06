package com.jacada.tracfoneAD.sSO.exceptions;

public class SSOException{
	
	private int code; //code from ExceptionConstants
	private String message; //informative message
	private String system; //system inducing Exception
	private String agentId; //current logged in agent
	private Exception nativeException = null; //if java.lang.Exception (or any child class is thrown,
											  //store it here.
	//Success
	public SSOException(String system, String agentId){
		this.code = ExceptionConstants.SUCCESS;
		this.system = system;
		this.agentId = agentId;
	}
	
	//Non-Success
	public SSOException(int code, String message, String system, String agentId, Exception nativeException){
		this.code = code;
		this.message = message;
		this.system = system;
		this.agentId = agentId;
		this.nativeException = nativeException;
	}
	
	public String getAgentId() {
		return agentId;
	}
	public void setAgentId(String agentId) {
		this.agentId = agentId;
	}
	public int getCode() {
		return code;
	}
	public void setCode(int code) {
		this.code = code;
	}
	public String getMessage() {
		return message;
	}
	public void setMessage(String message) {
		this.message = message;
	}
	public Exception getNativeException() {
		return nativeException;
	}
	public void setNativeException(Exception nativeException) {
		this.nativeException = nativeException;
	}
	public String getSystem() {
		return system;
	}
	public void setSystem(String system) {
		this.system = system;
	}
	
	
	
}
