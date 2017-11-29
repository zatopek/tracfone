package com.jacada.tracfoneAD.customerServiceProfile.dao;

import com.jacada.tracfoneAD.customerServiceProfile.dao.interfaces.CustomerServiceProfileDao;
import com.jacada.tracfoneAD.customerServiceProfile.entities.CustomerServiceProfile;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
@Transactional
public class JpaCustomerServiceProfileDao implements CustomerServiceProfileDao {

	private static final long serialVersionUID = 1L;
	private EntityManager entityManager;

    @PersistenceContext
    public void setEntityManager(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

	@Override
	public CustomerServiceProfile getCustomerServiceProfile(String esn) {
		// TODO Auto-generated method stub
		return null;
	}

	
    
}
