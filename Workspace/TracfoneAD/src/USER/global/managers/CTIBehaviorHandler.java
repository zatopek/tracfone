package USER.global.managers;

public class CTIBehaviorHandler extends
	com.jacada.jad.cti.agent.DefaultCTIBehaviorHandler {

	private static final long serialVersionUID = 1L;

	//in case this is inbound call load the call scope when call starts (when script loads)
	@Override
	public void startBusinessCall(String dnis) {
		if (!this.isOutboundAllowed()){
			getCallScopeListener().endCallScope();
			getCallScopeListener().startCallScope();
		}
		super.startBusinessCall(dnis);
	}

	@Override
	public void startManuallCall(String dnis) {
		getCallScopeListener().endCallScope();
		getCallScopeListener().startCallScope();
		super.startManuallCall(dnis);
	}

	//in case this is outbound call need to start the call scope ahead to allow the call script to be loaded.
	@Override
	public void startOutboundFlow(String dnis) {
		if (this.isOutboundAllowed()){
			getCallScopeListener().endCallScope();
			getCallScopeListener().startCallScope();
		}
		super.startOutboundFlow(dnis);
	}
	
	
}
