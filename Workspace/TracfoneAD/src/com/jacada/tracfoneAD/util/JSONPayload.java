package com.jacada.tracfoneAD.util;

import java.io.Serializable;

public class JSONPayload implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 586766390417905476L;
	private String message;
	private String status;
	private Object result;
	private boolean success;

	public JSONPayload() {
		this.message = "";
		this.status = "";
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public Object getResult() {
		return result;
	}

	public void setResult(Object result) {
		this.result = result;
	}

	public boolean isSuccess() {
		return success;
	}

	public void setSuccess(boolean success) {
		this.success = success;
	}

}
