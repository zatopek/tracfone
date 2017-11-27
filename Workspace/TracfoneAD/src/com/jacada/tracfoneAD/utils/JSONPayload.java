package com.jacada.tracfoneAD.utils;

import java.io.Serializable;

public class JSONPayload implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 586766390417905476L;
	private String message;
	private String status;
	private Object payload;

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

	public Object getPayload() {
		return payload;
	}

	public void setPayload(Object payload) {
		this.payload = payload;
	}

}
