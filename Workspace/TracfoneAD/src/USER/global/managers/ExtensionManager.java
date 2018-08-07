package USER.global.managers;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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
	private static final Logger LOGGER = LoggerFactory.getLogger(ExtensionManager.class);
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

	@GlobalAction(actionName = GlobalActionNames.LOGIN, order = GlobalActionOrder.BEFORE)
	public void login(HttpServletRequest request) {
		try {
			dispositionManager.addListener(dispositionEventListener);

			String username = (String) request.getSession().getAttribute("username");
			String agentName = (String) request.getSession().getAttribute("agentName");
			if (username == null || username.equals("null") || username.equals("undefined")) {
				username = "";
			}

			PushHelper.pushMessageToAgent(request.getSession(), agentName, "AgentEnvUsername", username);
			PushHelper.pushMessageToAgent(request.getSession(), agentName, "StartTas", tasUrl);
		} catch (Exception e) {
			LOGGER.error("Failed to send Agent Push for login", e);
		}
	}

	public void setDispositionManager(DispositionManager dispositionManager) {
		this.dispositionManager = dispositionManager;
	}

	public void setDispositionEventListener(DispositionEventListener dispositionEventListener) {
		this.dispositionEventListener = dispositionEventListener;
	}

	public void failoverRecovery(HttpServletRequest request, HttpServletResponse response) {
		dispositionManager.addListener(dispositionEventListener);

	}

}
