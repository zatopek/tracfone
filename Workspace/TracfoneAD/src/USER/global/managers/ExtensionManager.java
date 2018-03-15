package USER.global.managers;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Value;

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
	@Value("${tas.url}")
	private String tasUrl;
	@GlobalAction(actionName=GlobalActionNames.LOGIN,order=GlobalActionOrder.BEFORE)
	public void login(HttpServletRequest request){ 

		dispositionManager.addListener(dispositionEventListener);
		
		String username = (String) request.getSession().getAttribute("username");		
		String agentName = (String) request.getSession().getAttribute("agentName");		
		if(username==null || username.equals("null") || username.equals("undefined")){
			username = "";
		}

		try {
			PushHelper.pushMessageToAgent(request.getSession(), agentName, "AgentEnvUsername", username);
			PushHelper.pushMessageToAgent(request.getSession(), agentName, "StartTas", tasUrl);
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
