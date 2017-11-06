package com.jacada.tracfoneAD.sSO.dao;

import java.util.List;

import com.jacada.tracfoneAD.sSO.dao.interfaces.SSODao;
import com.jacada.tracfoneAD.sSO.entities.ApplicationSourceSystem;
import com.jacada.tracfoneAD.sSO.entities.SSOCredential;

public class SSODaoStub implements SSODao {

	private static final long serialVersionUID = 1L;

	@Override
	public List<SSOCredential> getUserCredentials(String agentId) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public void updateUserCredentials(String agentId,
			SSOCredential sSOCredential, boolean saveOrUpdate) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public SSOCredential getUserCredentialBySystem(String agentId,
			ApplicationSourceSystem system) {
		// TODO Auto-generated method stub
		return null;
	}
}
