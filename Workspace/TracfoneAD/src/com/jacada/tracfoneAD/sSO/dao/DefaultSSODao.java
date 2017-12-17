package com.jacada.tracfoneAD.sSO.dao;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import net.sf.ehcache.hibernate.HibernateUtil;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.springframework.orm.hibernate3.HibernateTemplate;
import org.springframework.stereotype.Component;

import com.jacada.jad.logging.LogWrapper;
import com.jacada.tracfoneAD.sSO.dao.interfaces.SSODao;
import com.jacada.tracfoneAD.sSO.entities.AgentSSO;
import com.jacada.tracfoneAD.sSO.entities.ApplicationSourceSystem;
import com.jacada.tracfoneAD.sSO.entities.LoginCredential;
import com.jacada.tracfoneAD.sSO.entities.SSOCredential;
import com.jacada.tracfoneAD.sSO.exceptions.ApplicationSourceSystemNotFoundException;
@Component
public class DefaultSSODao implements SSODao {

    /**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private SQLiteJDBCDriverConnection sQLiteJDBCDriverConnection;
	
	public DefaultSSODao()
	{
		sQLiteJDBCDriverConnection = new SQLiteJDBCDriverConnection();
		//sQLiteJDBCDriverConnection.createNewDatabase();
		//sQLiteJDBCDriverConnection.createNewTable();
	}
	
	@Override
	public List<LoginCredential> getUserSsoCredentials(String agentId) {
		return sQLiteJDBCDriverConnection.getAgentLogins(agentId);
	}

	@Override
	public LoginCredential getUserSsoCredentialBySystem(String agentId,
			ApplicationSourceSystem system) {
		
		List<LoginCredential> loginArray = this.getUserSsoCredentials(agentId);
		if(loginArray!= null && loginArray.size()>0)
		{
			for(LoginCredential login:loginArray)
			{
				if(login.getSystem().equals(system))
				{
					return login;
				}
			}
		}
		return null;
	}

	@Override
	public void deleteUserSsoCredentials(String agentId) {
		sQLiteJDBCDriverConnection.delete(agentId);
		
	}

	@Override
	public void addOrUpdateUserSsoCredentials(String agentId,
			List<LoginCredential> loginCredentials, boolean add) {
		if(add)
		{
			for(LoginCredential login:loginCredentials)
			{
				sQLiteJDBCDriverConnection.insertAgentSsoForSystem(agentId, login.getSystem().toString(), login.getUsername(), login.getPassword());			
			}
		}
		else
		{
			for(LoginCredential login:loginCredentials)
			{
				sQLiteJDBCDriverConnection.update(agentId, login.getSystem().toString(), login.getUsername(), login.getPassword());			
			}
		}
					
	}
}


