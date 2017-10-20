package USER.global.managers;

import java.util.HashMap;

import com.jacada.jad.cti.party.openMedia.ICustomItemPartyManagerInfo;
import com.jacada.jad.logging.LogWrapper;
import com.jacada.jad.push.PushHelper;

public class CustomItemHandler  extends com.jacada.jad.cti.handlers.CustomItemHandler {
	private static final long serialVersionUID = 1L; 
	    
    public void incomingCustomItem(){
        super.incomingCustomItem();
        sendEventToPortlet("incomingCustomItem");
    }
    
    public void startCustomItem (){
        super.startCustomItem();
        sendEventToPortlet("startCustomItem");
    }
    
    public void customItemDone (){
        super.customItemDone();
        sendEventToPortlet("customItemDone");
    }
    
    @Override
    protected void notifyClientOnStartCustomItem(HashMap<String, String> args) {
    	String interactionId = this.getOpenMediaOperationProxy().getPartyManagerInfo().getInteractionId(); 
		try{
			String fileName = this.getOpenMediaOperationProxy().getAttachedData(interactionId, "FileName");
			args.put("title", fileName);
			LogWrapper.debug(LogWrapper.CTI, "CustomItemHandler. Adding file name to work item as a title: " + fileName);
		}catch(Exception e){
			LogWrapper.error(LogWrapper.CTI, "Failed to retrieve file name of Work Item " + interactionId, e);
		}
    	super.notifyClientOnStartCustomItem(args);
    }
    
    public void sendEventToPortlet(String event){
        try{
            ICustomItemPartyManagerInfo dataMgr =  this.getOpenMediaOperationProxy().getPartyManagerInfo();
            String EventInfo = "Event Name: "+event+", Genesys Interaction Id:"+dataMgr.getInteractionId()+", ItemId:"+dataMgr.getCustomItemId();  
            PushHelper.pushMessage(this.getSessionInformation().getSession(), "updateMultimediaPortlet", EventInfo);
        }catch(Exception ex){
            LogWrapper.error("Exception in sendEventToPortlet with " + event + ", msg is: " + ex.getMessage());
        }
    }
} 
