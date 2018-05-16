package com.jacada.tracfoneAD.sSO.dao;

import java.util.List;

import com.jacada.tracfoneAD.sSO.dao.interfaces.SSODao;
import com.jacada.tracfoneAD.sSO.entities.ApplicationSourceSystem;
import com.jacada.tracfoneAD.sSO.entities.LoginCredential;

public class SSODaoStub implements SSODao {

	private static final long serialVersionUID = 1L;

	@Override
	public List<LoginCredential> getUserSsoCredentials(String agentId) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public LoginCredential getUserSsoCredentialBySystem(String agentId,
			ApplicationSourceSystem system) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public void deleteUserSsoCredentials(String agentId) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void addOrUpdateUserSsoCredentials(String agentId,
			List<LoginCredential> loginCredentials, boolean add) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public boolean checkCockpitCredentials(String pwd) {
		// TODO Auto-generated method stub
		return false;
	}
}
