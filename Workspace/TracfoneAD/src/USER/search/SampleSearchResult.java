package USER.search;

import com.jacada.jad.search.SearchResult;

/**
 * This is a sample implementation of the SearchResult.
 * @author victortr
 *
 */
public class SampleSearchResult implements SearchResult {
	private static final long serialVersionUID = 1L;
	private String title;
	private String url;
	
	public String getTitle() {
		return title;
	}
	public void setTitle(String title) {
		this.title = title;
	}
	public String getUrl() {
		return url;
	}
	public void setUrl(String url) {
		this.url = url;
	}
	public SampleSearchResult(String title, String url) {
		super();
		this.title = title;
		this.url = url;
	}
	
	public SampleSearchResult() {
		
	}
	
}
