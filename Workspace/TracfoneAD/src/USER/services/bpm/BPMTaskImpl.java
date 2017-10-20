package USER.services.bpm;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;

import com.jacada.jad.bpm.BPMTask;
import com.jacada.jad.bpm.BPMTaskConstant.BPMErrors;
import com.jacada.jad.bpm.BPMTaskConstant.TaskDataKeys;
import com.jacada.jad.cti.agent.AgentInformation;
import com.jacada.jad.taskmanager.entities.AgentTask;
import com.jacada.logging.LogWrapper;

public class BPMTaskImpl implements BPMTask {
	
	private AgentInformation agentInfo;
	private String title;
	private Date creationDate;
	private String creator;
	private String assigneeRoleOrGroup;
	private String assigneeUser;
	private String status ;//(active | completed)
	private Date expirationDate; //(dateTime)
	private String duration; //(int)
	private int priority ;//(int)
	
	
	
	
	public Map<String, String> getBPMAuditParams() {
		
		Map<String, String> params = new HashMap<String, String>();
		params.put(TaskDataKeys.ASSIGNEE_ROLE, assigneeRoleOrGroup);
		params.put(TaskDataKeys.ASSIGNEE_USER, assigneeUser);
		params.put(TaskDataKeys.TITLE, title);
		return params;
	}
	
	
	public void convertBPMTask(HashMap<String, String> hashTask) {
		setTitle(hashTask.get(TaskDataKeys.TITLE));
		setAssigneeRole(hashTask.get(TaskDataKeys.ASSIGNEE_ROLE));
		setAssigneeUser(hashTask.get(TaskDataKeys.ASSIGNEE_USER));
		
		//Convert to Date from string
		String creationStr = hashTask.get(TaskDataKeys.CREATION_DATE);
		setCreationDate(convertStringToDate(creationStr));
		
		setCreator(hashTask.get(TaskDataKeys.CRETAOR));
		setDuration(hashTask.get(TaskDataKeys.DURATION));
		
		//Convert to Date from string
		String expirationStr = hashTask.get(TaskDataKeys.EXPIRATION_DATE);
		setExpirationDate(convertStringToDate(expirationStr));
		
		setPriority(Integer.parseInt(hashTask.get(TaskDataKeys.PRIORITY)));
		setStatus(hashTask.get(TaskDataKeys.STATUS));
		
	}
	
	
	public void convertBPMTask(AgentTask task) {
		setTitle(task.getDescription());
		setAssigneeRole(null);
		setAssigneeUser(task.getAgentName());
		setCreationDate(task.getCreationDate());
		
		setCreator(agentInfo.getName());
		setDuration(null);
		setExpirationDate(task.getDueDate());
		
		setPriority(0);
		setStatus(task.getStatusStringKey());
		
	}
	public String getTitle() {
		return title;
	}
	public void setTitle(String title) {
		this.title = title;
	}
	public Date getCreationDate() {
		return creationDate;
	}
	public void setCreationDate(Date creationDate) {
		this.creationDate = creationDate;
	}
	public String getCreator() {
		return creator;
	}
	public void setCreator(String creator) {
		this.creator = creator;
	}
	public String getAssigneeRole() {
		return assigneeRoleOrGroup;
	}
	public void setAssigneeRole(String assigneeRole) {
		this.assigneeRoleOrGroup = assigneeRole;
	}
	public String getAssigneeUser() {
		return assigneeUser;
	}
	public void setAssigneeUser(String assigneeUser) {
		this.assigneeUser = assigneeUser;
	}
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
	
	public Date getExpirationDate() {
		return expirationDate;
	}
	public void setExpirationDate(Date expirationDate) {
		this.expirationDate = expirationDate;
	}
	public String getDuration() {
		return duration;
	}
	public void setDuration(String duration) {
		this.duration = duration;
	}
	public int getPriority() {
		return priority;
	}
	public void setPriority(int priority) {
		this.priority = priority;
	}
	

	private Date convertStringToDate(String dateStr){
		if(dateStr == null){
			return null;
		}
		
		Date resultDate = null;
		try{
			SimpleDateFormat sdf = new SimpleDateFormat("dd-MMM-yyyy HH:mm:ss", new Locale("en", "EN")); 
			resultDate = sdf.parse(dateStr);
		}catch (Exception e) {
			LogWrapper.warn(BPMErrors.TASK_DATE_PARSE_ERR.getErrorCode(),dateStr);
			LogWrapper.error(e);
		}
		return resultDate;
	}

	public AgentInformation getAgentInfo() {
		return agentInfo;
	}

	public void setAgentInfo(AgentInformation agentInfo) {
		this.agentInfo = agentInfo;
	}
}
