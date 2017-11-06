package com.jacada.tracfoneAD.sSO.exceptions;

public class ExceptionConstants {

	//Please list possible SSO related exceptions/failures here
	public static final int SUCCESS = 0; //Success
	public static final int DATA_ACCESS_EXCEPTION = 1; //Hibernate DataAccessException
	public static final int INVALID_CREDENTIALS = 2; //User-Password Combo Invalid
	public static final int NO_USERNAME_FOUND = 3; //No UserName for specific system in NG_USER_CREDENTIALS
	public static final int NO_PASSWORD_FOUND = 4; //No Password for specific system in NG_USER_CREDENTIALS
	public static final int SYSTEM_ACCESS_FAILURE = 5; //AgentDesktop was unable to access Host system
	public static final int PASSWORD_EXPIRED = 6; //Password is expired
	public static final int UNAUTHORIZED_USER = 7; //User is not authorized access to system
	public static final int ZERO_CREDENTIALS = 8; //No credentials found in any system for current user
	public static final int ENCRYPTION_KEY_MISMATCH = 9; //Encryption Key does not match Key used to initially encrypt creds.
	public static final int AD_PASSWORD_CHANGED = 10; //Agent's Active Directory password changed.
	public static final int OTHER_JAVA_EXCEPTION = 98; //Other java.lang.Exception (or child) thrown
	public static final int GENERAL_EXCEPTION = 99; //Any other un-addressed exception
	
}
