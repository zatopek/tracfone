package USER.search;

import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import SYSTEM.global.managers.LocaleManager;

import com.jacada.jad.search.SearchBridge;
import com.jacada.jad.search.SearchQuery;
import com.jacada.jad.search.SearchResult;
import com.jacada.paging.PagingResults;

/**
 * This is a sample implementation of the SearchBridge.
 * It holds predefined results for predefined queries.
 * @author victortr
 *
 */
public class SampleSearchBridge implements SearchBridge {
	private static final long serialVersionUID = 1L;
	private transient Map<String, List<SearchResult>> resultsMap;
	private transient LocaleManager localeManager;
	
	public String getName() {
		return localeManager.getApplicationLocalizationValue("application.search.sampleBridgeName");
	}

	public boolean supportsPaging() {
		return true;
	}
	// no need to implement this one, because the bridge supports paging.
	public Set<SearchResult> search(SearchQuery query) {
		return null;
	}

	public PagingResults<SearchResult> search(SearchQuery query, int firstResult,
			int maxResults) {
		PagingResults<SearchResult> result = new PagingResults<SearchResult>();
		if (resultsMap != null) {
			String text = query.getText();
			List<SearchResult> resultsListForQuery = resultsMap.get(text);
			if (resultsListForQuery != null) {
				int size = resultsListForQuery.size();
				result.setTotalCount(size);
				maxResults = firstResult + maxResults;
				if (size < maxResults) {
					maxResults = size;
				}				
				Set<SearchResult> resultsSet = new LinkedHashSet<SearchResult>();
				for (int i = firstResult; i < maxResults; i++) {
					resultsSet.add(resultsListForQuery.get(i));
				}
				result.setResults(resultsSet);				
			}
		}		
		return result;
	}

	public void setResultsMap(Map<String, List<SearchResult>> resultsMap) {
		this.resultsMap = resultsMap;
	}

	public void setLocaleManager(LocaleManager localeManager) {
		this.localeManager = localeManager;
	}
}
