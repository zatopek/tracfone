package com.jacada.tracfoneAD.sSO.dao;

import com.jacada.jad.core.JadThreadLocal;
import com.jacada.tracfoneAD.sSO.dao.interfaces.SSODao;
import org.springframework.beans.factory.FactoryBean;
import java.io.Serializable;

public class SSODaoFactoryBean implements Serializable, FactoryBean<SSODao> {

	private static final long serialVersionUID = 1L;
	private transient SSODao stub;
	private transient SSODao dao;
	private boolean allowStub = false;
	
	public SSODao getObject() throws Exception {
		if(JadThreadLocal.isDynamicViewsEditor() && allowStub){
			return stub;
		}
		return dao;
	}

	public Class<?> getObjectType() {
		return SSODao.class;
	}

	public boolean isSingleton() {
		return false;
	}
	
	public void setStub(SSODao stub) {
		this.stub = stub;
	}

	public void setDao(SSODao dao) {
		this.dao = dao;
	}
}
