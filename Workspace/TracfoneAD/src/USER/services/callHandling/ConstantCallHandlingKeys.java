package USER.services.callHandling;

public class ConstantCallHandlingKeys {
	/*
	current supported operations are : end-call and end-script.	
*/
	/*
	 * List of given keys that may arrive in the input map
	 */
	public static class CallHandlingKeys
	{
		public static String OPERATION = "operation";
		public static String STATUS = "New Status";
		public static String REASON = "Busy Reason Code";
	}
	/*
	 * List of possible operations values that may arrive in the input map
	 */
	public static class CallOperationValues
	{
		public static String END_WRAPUP_OPERATION = "end_wrapup";
	    public static String END_CALL_OPERATION = "end_call";
	}
	
	
	

}
