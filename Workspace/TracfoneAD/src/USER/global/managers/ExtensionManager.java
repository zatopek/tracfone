package USER.global.managers;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import SYSTEM.global.GlobalAction;
import SYSTEM.global.GlobalActionNames;
import SYSTEM.global.GlobalActionOrder;
import SYSTEM.global.SharedData;
import SYSTEM.global.managers.AbstractManager;

import com.jacada.jad.agentDisposition.DispositionManager;
import com.jacada.jad.agentDisposition.events.DispositionEventListener;
import com.jacada.jad.failover.FailOverAware;
import com.jacada.jad.push.PushHelper;

public class ExtensionManager implements AbstractManager, FailOverAware {
	private static final long serialVersionUID = 1L;
	private transient SharedData globalApp;

	private transient DispositionManager dispositionManager;
	private transient DispositionEventListener dispositionEventListener;

	public SharedData getGlobalApp() {
		return globalApp;
	}

	public void setGlobalApp(SharedData globalApp) {
		this.globalApp = globalApp;

	}

	@GlobalAction(actionName=GlobalActionNames.LOGIN,order=GlobalActionOrder.AFTER)
	public void login(HttpServletRequest request){ 
		
		//Adding an event listener to the disposition manager.
		//The default implementation of the listener will audit the 1st disposition code, 
		//if provided, as the call reason.
		//To see an example of how you can audit the call type on your own - 
		//see CallReasonDispositionEventListener.class 
		dispositionManager.addListener(dispositionEventListener);
		
		String username = (String) request.getSession().getAttribute("username");
		
		String agentName = (String) request.getSession().getAttribute("agentName");
		
		if(username==null || username.equals("null")){
			username = "";
		}
		
		try {
			PushHelper.pushMessageToAgent(request.getSession(), agentName, "AgentEnvUsername", username);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		
	}
	
	public void setDispositionManager(DispositionManager dispositionManager) {
		this.dispositionManager = dispositionManager;
	}

	public void setDispositionEventListener(
			DispositionEventListener dispositionEventListener) {
		this.dispositionEventListener = dispositionEventListener;
	}

	public void failoverRecovery(HttpServletRequest request,
			HttpServletResponse response) {
		dispositionManager.addListener(dispositionEventListener);

	}

}
