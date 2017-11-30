/**
 * 
 */
package com.jacada.tracfoneAD.util;

import java.io.Serializable;

/**
 * A Response holder for consistent structure of returned responses. In the UI
 * BroadBridge will expect results in this structure.
 * 
 * There are also static convenience methods for success and failures
 * 
 * @author GV
 *
 */
public class Response<E> implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = -3654999967127237649L;

	private int status = 0;
	private String id;
	private String message;
	private E result;

	/**
	 * A sugar method to easily create a success response holder with the object
	 * passed
	 * 
	 * @param request
	 * @param result
	 * @return A built {@link Response} object
	 */
	public static <E> Response<E> success(Request<?> request, E result) {
		Response<E> response = new Response<E>();
		response.setId(request.getId());
		response.setResult(result);
		response.setStatus(0);
		return response;
	}

	/**
	 * A sugar method to easily create a failure response holder with the
	 * exception passed.
	 * 
	 * Only the exception message is carried over.
	 * 
	 * @param request
	 * @param exception
	 * @return A built {@link Response} object
	 */
	public static <E> Response<E> fail(Request<?> request, Exception exception) {
		Response<E> response = new Response<E>();
		response.setId(request.getId());
		response.setMessage(exception.getMessage());
		response.setStatus(1);
		return response;
	}

	/**
	 * A sugar method to easily create a failure response holder with the object
	 * passed.
	 * 
	 * To be used in cases there is no exception but you would like to return an
	 * failure response to the UI
	 * 
	 * @param request
	 * @param result
	 * @return A built {@link Response} object
	 */
	public static <E> Response<E> fail(Request<?> request, E result) {
		Response<E> response = new Response<E>();
		response.setId(request.getId());
		response.setResult(result);
		response.setStatus(1);
		return response;
	}

	public int getStatus() {
		return status;
	}

	public void setStatus(int status) {
		this.status = status;
	}

	public E getResult() {
		return result;
	}

	public void setResult(E result) {
		this.result = result;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

}
