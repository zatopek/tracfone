package USER.external;

import SYSTEM.global.GlobalAppHandler;


public class JacadaCustomService implements	IJacadaCustomService {

	/**
	 * 
	 */
	private static final long	serialVersionUID	= 1L;
	private GlobalAppHandler handler;
	
	
	
	
	public GlobalAppHandler getGlobalAppHandler() {
		return handler;
	}

	public void setGlobalAppHandler(GlobalAppHandler handler) {
		this.handler = handler;
	}
	
}
