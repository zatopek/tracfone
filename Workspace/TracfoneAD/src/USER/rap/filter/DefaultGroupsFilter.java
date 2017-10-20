package USER.rap.filter;

import java.util.Set;

import com.jacada.jad.rap.interfaces.GroupsFilter;

public class DefaultGroupsFilter implements GroupsFilter {

	public Set<String> filterGroups(Set<String> groups) {
		// the default implementation returns the original set
		return groups;
	}

}
