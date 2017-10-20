package USER.taskmanager;

import java.util.Collection;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import java.util.Map.Entry;

import com.jacada.jad.logging.LogWrapper;
import com.jacada.jad.rap.interfaces.CommonUser;
import com.jacada.jad.rap.interfaces.GroupsFilter;
import com.jacada.jad.rap.provider.UsersManager;
import com.jacada.jad.taskmanager.TeamMembersProvider;

public class DefaultTeamMembersProvider implements TeamMembersProvider {

	private transient UsersManager usersManager;
	private transient GroupsFilter groupsFilter;
	
	public Collection<CommonUser> getAgentTeamMembers(String agentName) {
		Set<CommonUser> agents = new HashSet<CommonUser>();
		//get groups for agent
		Set<String> userGroups = usersManager.getUserGroups(agentName);
		//filter the groups
		if (groupsFilter != null){
			userGroups = groupsFilter.filterGroups(userGroups);
		}
		Set<String> processedUsers = new HashSet<String>();
		for (String groupName : userGroups) {
			Map<String, CommonUser> usersForGroup = usersManager.getUsersForGroup(groupName);
			LogWrapper.debug("found " +usersForGroup.size()+ " agents in group "+groupName);
			Set<Entry<String, CommonUser>> entrySet = usersForGroup.entrySet();
			for (Entry<String, CommonUser> entry : entrySet) {
				//check if processed to avoid duplicate
				if (!processedUsers.contains(entry.getKey())){
					processedUsers.add(entry.getKey());
					agents.add(entry.getValue());
				}
			}
		}
		return agents;
	}
	
	public void setUsersManager(UsersManager usersManager) {
		this.usersManager = usersManager;
	}

	public void setGroupsFilter(GroupsFilter groupsFilter) {
		this.groupsFilter = groupsFilter;
	}

}
