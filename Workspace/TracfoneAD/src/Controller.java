
import javax.servlet.jsp.JspException;

import org.apache.beehive.netui.pageflow.Forward;
import org.apache.beehive.netui.pageflow.PageFlowUtils;
import org.apache.beehive.netui.pageflow.annotations.Jpf;

import SYSTEM.global.SharedData;
import USER.global.managers.ExtensionManager;

@Jpf.Controller(
	    sharedFlowRefs={
	        @Jpf.SharedFlowRef(name="globalApp", type=SYSTEM.global.SharedData.class)
	    }
	)
public class Controller extends USER.Controller
{
	private static final long serialVersionUID = 1L; 

	@Jpf.SharedFlowField(name="globalApp")
    public transient SharedData globalApp;

	public SharedData getGlobalApp() {
        if (globalApp == null) {
            globalApp = (SYSTEM.global.SharedData) PageFlowUtils.getSharedFlow(SYSTEM.global.SharedData.class.getName(),
					this.getRequest(), getRequest().getSession().getServletContext());
        }
        return globalApp;
    }


    /**
     * @common:control
     */
    private transient com.jacada.jad.external.db.JFAPDataBaseAccess jFAPDataBase;

    protected Object _getDatabaseControl()
    {
        return jFAPDataBase;
    }

    //private external.JFAP_LookupWS jFAP_LookupWS;

    
    @Jpf.Action(forwards = {
        @Jpf.Forward(name = "login",
                    path = "LoginForm.jsp"), 
        @Jpf.Forward(name = "success",
                     path = "index.jsp"), 
        @Jpf.Forward(name = "reset",
                     path = "ResetToDefaults.do"), 
        @Jpf.Forward(name = "DuplicateLoginForm",
                 path = "DuplicateLoginForm.jsp"),
        @Jpf.Forward(name = "empty",
                     path = "/SYSTEM/resources/jsp/empty.jsp")
    })
    protected Forward begin() throws Exception // NOPMD by victortr on 6/26/08 10:06 AM
    {
    	return super.begin();
    }

    /**
     * @jpf:action
     * @jpf:forward name="success" path="index.jsp"
     */
	@Jpf.Action(
		forwards = { 
			@Jpf.Forward(name = "success", path = "index.jsp")
		}
	)
    protected Forward ResetToDefaults() throws JspException // NOPMD by victortr on 6/26/08 10:06 AM
    {
        return null;        
    }
	
    protected synchronized void beforeAction() throws Exception {
        super.beforeAction();
        getGlobalApp().failoverRecovery(getRequest(),getResponse());
        jFAPDataBase = getGlobalApp().getJFAPDataBase();
    }
    
    @Jpf.Action(
    		forwards = { 
    			@Jpf.Forward(name = "success", path = "DuplicateLoginForm.jsp")
    		}
    	)
    protected Forward DuplicateLoginForm() {
    	return new Forward("success");
    }
    
   @Jpf.Action(
    		forwards = { 
    			@Jpf.Forward(name = "success", path = "index.jsp"),
    			@Jpf.Forward(name = "login", path = "LoginForm.jsp")
    		}
    	)
    protected Forward afterDuplicateLoginForm(BranchFormBean form) throws Exception {
	   return super.afterDuplicateLoginForm(form);
	}
   
}
