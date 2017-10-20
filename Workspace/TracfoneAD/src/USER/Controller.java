package USER;

import SYSTEM.global.managers.exceptions.DuplicateLoginException;

import com.jacada.jad.core.JacadaLicenseServletException;
import com.jacada.jad.layout.InteractionType;

import javax.servlet.jsp.JspException;

public abstract class Controller extends SYSTEM.Controller
{
    
	private static final long serialVersionUID = 1L;

	/*
	@Override
    protected void prepareSession() throws JspException, DuplicateLoginException, JacadaLicenseServletException {
    	super.prepareSession();
        // load predefined layout based on agent's role.
        if (getRequest().isUserInRole("AgentRole")) {
        	//if LayoutByContext=false in GLOBAL_SETTINGS
            //getLayoutManager().setLayout("sample");
            //else, when working in context, you can set a layout per context
            getLayoutManager().setLayout(InteractionType.Voice, "sample");
        }

    }
    */
}
