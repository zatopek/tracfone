package USER.directory;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

import USER.portlets.customerInfo.CustomerInfoManager;
import USER.portlets.customerInfo.entity.CustomerInfo;
import USER.portlets.utility.objects.InteractionHistory;

import com.jacada.jad.conversationHistory.result.ConversationRecord;
import com.jacada.jad.conversationHistory.result.ConversationSearchResult;
import com.jacada.jad.conversationHistory.search.ConversationSearchProvider;
import com.jacada.jad.conversationHistory.search.agent.AgentConversationSearchParameters;
import com.jacada.jad.conversationHistory.search.customer.CustomerConversationSearchParameters;

@Service("customConversationSearchProvider")
@Lazy
public class CustomConversationSearchProvider implements ConversationSearchProvider{

	@Autowired
	private CustomerInfoManager customerInfoManager;
	
	private enum Type{
		VOICE("2E059E8E-8A55-4CFF-AB76-3FC96754D720"), EMAIL("2D3B269B-D04D-44BB-A734-83037FD0C4BF"), CHAT("76DCA267-112E-40A9-A538-487B346F8F9A");
		private String value;
		private Type(String value) {
			this.value = value;
		}
	};
	
	@Override
	public ConversationSearchResult findAgentConversation(AgentConversationSearchParameters searchParameters) {
		return generateConversations(null);
	}

	@Override
	public ConversationSearchResult findCustomerConversation(CustomerConversationSearchParameters searchParameters) {
		return generateConversations(searchParameters.getCustomerId());
	}

	
	private ConversationSearchResult generateConversations(String customerId) {
		List<ConversationRecord> records = new ArrayList<ConversationRecord>();
		List<CustomerInfo> customers = new ArrayList<CustomerInfo>(customerInfoManager.getCustomers().values());
		int amount = 50;
		for(int i = 0; i < amount; i++){
			
			CustomerInfo customerInfo1 = null;
			if(customerId != null){
				for(CustomerInfo c: customers){
					if(c.getSSN().equalsIgnoreCase(customerId)){
						customerInfo1 = c;
						break;
					}
				}
			}
			
			if(customerInfo1 == null){
				customerInfo1 = customers.get(randomIndex(0, customers.size() - 1));
			}
			CustomerInfo customerInfo2 = customers.get(randomIndex(0, customers.size() - 1));
			
			while(customerInfo1.equals(customerInfo2)){
				customerInfo2 = customers.get(randomIndex(0, customers.size() - 1));
			}
			
			Type type = Type.values()[randomIndex(0, Type.values().length - 1)];
			
			Map<String, Object> values = new HashMap<String, Object>();
			values.put("serverInstanceType" , type.value);
			if(type == Type.VOICE){
				values.put("fromAddress" , customerInfo1.getTelephoneHome());
				values.put("toAddress" , customerInfo2.getTelephoneOther());
				values.put("subject" ,"PHANTOM_CALL");
			}else if(type == Type.EMAIL){
				List<InteractionHistory> interactions = customerInfo1.getAccounts().get(randomIndex(0, customerInfo1.getAccounts().size() - 1)).getInteractions();
				values.put("fromAddress" , customerInfo1.getEmail());
				values.put("toAddress" , customerInfo2.getEmail());
				values.put("subject" ,interactions.get(randomIndex(0, interactions.size() - 1)).getComments());
			}else{//Chat
				values.put("fromAddress" , customerInfo1.getFirstName());
				values.put("toAddress" , "Services@AVAYA-EMC");
				values.put("subject" ,"");
				
			}
			int state = randomIndex(0, 7);
			values.put("state" , state);
			long establishedDateTime = randomTimeStamp();
			long closedDateTime = randomTimeStamp();
			
			if(establishedDateTime > closedDateTime){
				long temp = establishedDateTime;
				establishedDateTime = closedDateTime;
				closedDateTime = temp;
			}
			values.put("establishedDateTime" , establishedDateTime);
			if(state == 7){
				values.put("closedDateTime" , closedDateTime);
			}else{
				values.put("closedDateTime" , null);
			}
			values.put("suspendToDateTime" , "");
			values.put("suspendReason" , "");
			values.put("interactionId" , "");
			values.put("conversationId" , "");
			
			records.add(new ConversationRecord(values));
		}

		return new ConversationSearchResult(records);
	}
	/**
	 * Get random value between [min ,max] including max;
	 * @param min
	 * @param max
	 * @return
	 */
	private int randomIndex(int min, int max){
		return  min + (int)(Math.random() * ((max - min) + 1)); 
	}
	
	private long randomTimeStamp(){
		long offset = Timestamp.valueOf("2010-01-01 00:00:00").getTime();
		long end = Timestamp.valueOf("2014-01-01 00:00:00").getTime();
		long diff = end - offset + 1;
		Timestamp rand = new Timestamp(offset + (long)(Math.random() * diff));
		return rand.getTime();
	}

}
