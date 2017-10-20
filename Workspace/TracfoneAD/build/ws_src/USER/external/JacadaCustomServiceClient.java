package USER.external;


import com.jacada.ws.AbstractWebServiceClient;
import com.jacada.ws.WebServiceHeader;
import javax.xml.ws.Holder;


public class JacadaCustomServiceClient extends AbstractWebServiceClient {

	
	
	
	public void releaseSession(Holder<WebServiceHeader> ws_header) throws Exception {
		JacadaCustomServiceWS ws = (JacadaCustomServiceWS)getService(JacadaCustomServiceImpl.class);		
		ws.releaseSession(ws_header);
	}	
}