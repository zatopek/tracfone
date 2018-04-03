package com.jacada.tracfoneAD.sSO.dao;

import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.jacada.tracfoneAD.sSO.dao.interfaces.SSODao;
import com.jacada.tracfoneAD.sSO.entities.ApplicationSourceSystem;
import com.jacada.tracfoneAD.sSO.entities.LoginCredential;

@Component
public class DefaultSSODao implements SSODao {

    /**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private SQLiteJDBCDriverConnection sQLiteJDBCDriverConnection;
	
	@Value("${sso.sqllite.location}")
	private String ssoSqliteLocation;

	
	@Override
	public List<LoginCredential> getUserSsoCredentials(String agentId) {
		
		if(sQLiteJDBCDriverConnection == null){
			sQLiteJDBCDriverConnection = new SQLiteJDBCDriverConnection(ssoSqliteLocation);
		}
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
		if(sQLiteJDBCDriverConnection == null){
			sQLiteJDBCDriverConnection = new SQLiteJDBCDriverConnection(ssoSqliteLocation);
		}
		sQLiteJDBCDriverConnection.delete(agentId);
		
	}

	@Override
	public void addOrUpdateUserSsoCredentials(String agentId,
			List<LoginCredential> loginCredentials, boolean add) {
		
		if(sQLiteJDBCDriverConnection == null){
			sQLiteJDBCDriverConnection = new SQLiteJDBCDriverConnection(ssoSqliteLocation);
		}
		
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


