package USER.external;

import javax.jws.WebService;
import com.jacada.ws.WebServiceBaseImpl;



@WebService(
		  serviceName = "JacadaCustomService",
		  endpointInterface = "USER.external.JacadaCustomServiceWS"
		)


public class JacadaCustomServiceImpl extends WebServiceBaseImpl implements
		USER.external.JacadaCustomServiceWS {

	public JacadaCustomServiceImpl() {
		super();
		setTargetServiceName("USER.external.IJacadaCustomService");
	}
	
}
