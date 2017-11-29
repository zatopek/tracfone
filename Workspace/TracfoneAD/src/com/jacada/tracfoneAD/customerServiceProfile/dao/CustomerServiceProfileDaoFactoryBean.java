package com.jacada.tracfoneAD.customerServiceProfile.dao;

import com.jacada.jad.core.JadThreadLocal;
import com.jacada.tracfoneAD.customerServiceProfile.dao.interfaces.CustomerServiceProfileDao;
import org.springframework.beans.factory.FactoryBean;
import java.io.Serializable;

public class CustomerServiceProfileDaoFactoryBean implements Serializable, FactoryBean<CustomerServiceProfileDao> {

	private static final long serialVersionUID = 1L;
	private transient CustomerServiceProfileDao stub;
	private transient CustomerServiceProfileDao dao;
	private boolean allowStub = true;
	
	public CustomerServiceProfileDao getObject() throws Exception {
		if(JadThreadLocal.isDynamicViewsEditor() && allowStub){
			return stub;
		}
		return dao;
	}

	public Class<?> getObjectType() {
		return CustomerServiceProfileDao.class;
	}

	public boolean isSingleton() {
		return false;
	}
	
	public void setStub(CustomerServiceProfileDao stub) {
		this.stub = stub;
	}

	public void setDao(CustomerServiceProfileDao dao) {
		this.dao = dao;
	}
}
