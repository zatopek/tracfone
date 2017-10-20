package USER.taskmanager;

import java.util.Map;

import com.jacada.jad.taskmanager.entities.AgentTask;
import com.jacada.jad.taskmanager.events.TaskAuditListener;

public class TaskAuditHandler implements TaskAuditListener {

	public void auditTaskAdded(AgentTask task, Map<String, String> parameters) {
		//you may modify the parameters before they are saved to the database
	}

	public void auditTaskDeleted(AgentTask task, Map<String, String> parameters) {
		//you may modify the parameters before they are saved to the database
	}

	public void auditTaskUpdated(AgentTask task, Map<String, String> parameters) {
		//you may modify the parameters before they are saved to the database
	}

}
