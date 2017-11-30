package com.jacada.tracfoneAD.util;

import java.io.Serializable;

/**
 * A utility class to hold the request for services. Any calls to the control
 * will be expected in this format. On the UI broadbridge will make sure this
 * format is followed.
 * 
 * @author GV
 *
 */

public class Request<E> implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 8060799033044610205L;
	private String id;
	private E object;

	public String getId() {
		return id;
	}

	public E getObject() {
		return object;
	}

	public Request() {
		// TODO Auto-generated constructor stub
	}
}
