package USER.external;

import javax.jws.WebService;
import com.jacada.ws.WebServiceBase;



@WebService( 
		targetNamespace = "http://www.jacada.com",
		serviceName = "JacadaCustomServiceWS",
		endpointInterface = "USER.external.JacadaCustomServiceWS"
)

public interface JacadaCustomServiceWS extends WebServiceBase {

}

