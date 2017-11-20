package com.jacada.tracfoneAD.sSO.dao;

import java.util.List;

import net.sf.ehcache.hibernate.HibernateUtil;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.springframework.orm.hibernate3.HibernateTemplate;

import com.jacada.jad.logging.LogWrapper;
import com.jacada.tracfoneAD.sSO.dao.interfaces.SSODao;
import com.jacada.tracfoneAD.sSO.entities.AgentSSO;
import com.jacada.tracfoneAD.sSO.entities.ApplicationSourceSystem;
import com.jacada.tracfoneAD.sSO.entities.SSOCredential;

public class DefaultSSODao implements SSODao {

    /**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private HibernateTemplate hibernateTemplate;
   
    public void setSessionFactory(SessionFactory sessionFactory) {
        this.hibernateTemplate = new HibernateTemplate(sessionFactory);
    }

    public HibernateTemplate getHibernateTemplate() {
        return this.hibernateTemplate;
    }

    public void setHibernateTemplate(HibernateTemplate ht) {
        this.hibernateTemplate = ht;
    }

    /*
    public SSOCredMap getUserCredentials(String agentId) {
        SSOCredMap ssoCred;
        List l = new ArrayList();
        Transaction tx;
        String q = "From SSOCredMap cred where cred.agent='" + agentId + "'";
        try {
            tx = this.hibernateTemplate.getSessionFactory().getCurrentSession().beginTransaction();
            l = this.hibernateTemplate.find(q);
            tx.commit();
        } catch (Exception e) {
            LogWrapper.error("Exception thrown at SSO map loading.");
            e.printStackTrace();
        } finally {
            this.hibernateTemplate.getSessionFactory().getCurrentSession().close();
        }
        LogWrapper.debug("out of try block for SSOCredMap");

        if (l.size() > 0) {
            ssoCred = (SSOCredMap) l.get(0);

            if (ssoCred.getAgentExtn() == null) {
                LogWrapper.get(this.getClass()).debug(
                        "Agent extn is null, so setting default value.");
                ssoCred.setAgentExtn("-");
            }
            if (ssoCred.getAgentInitial() == null) {
                LogWrapper.get(this.getClass()).debug(
                        "Agent Initial is null, so setting default value.");
                ssoCred.setAgentInitial("-");
            }
            
            if (ssoCred.getCtiAgentID() == null) {
                LogWrapper.get(this.getClass()).debug(
                        "CTI Agent ID is null, so setting default value.");
                ssoCred.setCtiAgentID("");
            }
            
            if (ssoCred.getCrisRegion() == null) {
                LogWrapper.get(this.getClass()).debug(
                        "CRIS Region is null, so setting default value.");
                ssoCred.setCrisRegion(getEnvSetting().getCrisRegiona());
            }
            
             //System.out.println(" sso dao imple cti agent id "+ssoCred.getCtiAgentID());           
            return ssoCred;
        } else {
            LogWrapper.get(this.getClass()).info(
                    "No credentials found for agentId="
                            + agentId
                            + ".  Possibly the agent's first use of AgentDesktop.");
            return null;
        }
    }

    public void updateUserCredentials(String department, String agentNotes, String employeeId ,String ctiAgentID, String agentId, String agentExtn,
            String agentInitial, String crisRegion, Map<byte[], byte[]> cim, boolean saveCred) {
    	this.hibernateTemplate.execute(new UserCrentialsHibernateCallback(department,agentNotes,employeeId,ctiAgentID, agentId, agentExtn, agentInitial, crisRegion, cim, saveCred));
    }
*/
    
	@Override
	public void updateUserCredentials(String agentId,
			SSOCredential inSSOCredential, boolean saveOrUpdate) {
		
		//Session session = HibernateUtil.getSessionFactory().openSession();
		Session session = this.hibernateTemplate.getSessionFactory().openSession();
		session.beginTransaction();

		AgentSSO agentSSO = new AgentSSO();
		agentSSO.setAgentId("workspace");
		agentSSO.setSystem(ApplicationSourceSystem.SYS_A.getName());
		session.save(agentSSO);

		SSOCredential sSOCredential = new SSOCredential();
		sSOCredential.setUserId("workspace");
		sSOCredential.setPassword("password");
		sSOCredential.setAgentSSO(agentSSO);
		agentSSO.getSsoCredentials().add(sSOCredential);
		session.save(sSOCredential);

		session.getTransaction().commit();
		System.out.println("Done");
		
	}

	@Override
	public SSOCredential getUserCredentialBySystem(String agentId,
			ApplicationSourceSystem system) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public List<SSOCredential> getUserCredentials(String agentId) {
		// TODO Auto-generated method stub
		return null;
	}


}


