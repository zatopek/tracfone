package com.jacada.tracfoneAD.securityQuestions.dao;

import com.jacada.jad.core.JadThreadLocal;
import com.jacada.tracfoneAD.securityQuestions.dao.interfaces.SecurityQuestionsDao;
import org.springframework.beans.factory.FactoryBean;
import java.io.Serializable;

public class SecurityQuestionsDaoFactoryBean implements Serializable, FactoryBean<SecurityQuestionsDao> {

	private static final long serialVersionUID = 1L;
	private transient SecurityQuestionsDao stub;
	private transient SecurityQuestionsDao dao;
	private boolean allowStub = true;
	
	public SecurityQuestionsDao getObject() throws Exception {
		if(JadThreadLocal.isDynamicViewsEditor() && allowStub){
			return stub;
		}
		return dao;
	}

	public Class<?> getObjectType() {
		return SecurityQuestionsDao.class;
	}

	public boolean isSingleton() {
		return false;
	}
	
	public void setStub(SecurityQuestionsDao stub) {
		this.stub = stub;
	}

	public void setDao(SecurityQuestionsDao dao) {
		this.dao = dao;
	}
}
