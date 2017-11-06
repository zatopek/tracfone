package com.jacada.tracfoneAD.sSO.entities;

import com.jacada.tracfoneAD.sSO.exceptions.ApplicationSourceSystemNotFoundException;

public enum ApplicationSourceSystem {

	//TO-DO
	SYS_A("SYS_A"), 
	SYS_B("SYS_B");
	
	
	
	/**
	 * This field holds <code>name</code> of type <code>String</code>
	 */
	private String name;

	/**
	 * This is Constructor.
	 * 
	 * @param name
	 */
	ApplicationSourceSystem(String name) {
		this.name = name;
	}

	/**
	 * This method is used for getting Application source system based on the
	 * string passed. pass "CAS", "CRIS" to get CAS and CRIS respectively.
	 * 
	 * @param name
	 * @return appropriate enum of source system - ApplicationSourceSystem
	 * @throws ApplicationSourceSystemNotFoundException
	 */
	public static ApplicationSourceSystem getInstance(String name)
			throws ApplicationSourceSystemNotFoundException {
		for (ApplicationSourceSystem sourceSystem : ApplicationSourceSystem
				.values()) {
			if (sourceSystem.getName().equalsIgnoreCase(name)) {
				return sourceSystem;
			}
		}
		throw new ApplicationSourceSystemNotFoundException();
	}

	/**
	 * @return the name
	 */
	public String getName() {
		return name;
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see java.lang.Enum#toString()
	 */
	public String toString() {
		return this.getName();
	}
}
