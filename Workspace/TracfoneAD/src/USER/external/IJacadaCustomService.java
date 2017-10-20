package USER.external;

import SYSTEM.global.GlobalAppAware;

import com.jacada.service.annotations.ExposedService;
import com.jacada.service.beans.IInvocableService;

@ExposedService(name = "JacadaCustomService", targetNamespace = "http://www.jacada.com")
public interface IJacadaCustomService extends IInvocableService, GlobalAppAware {

}