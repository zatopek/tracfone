package com.jacada.tracfoneAD.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.oxm.jaxb.Jaxb2Marshaller;
import org.springframework.ws.client.support.interceptor.ClientInterceptor;
import org.springframework.ws.soap.security.wss4j.Wss4jSecurityInterceptor;

import com.jacada.tracfoneAD.customerServiceProfile.dao.WSBalanceInquiryDao;
import com.jacada.tracfoneAD.customerServiceProfile.dao.interfaces.BalanceInquiryDao;

@Configuration
@ComponentScan(basePackages = { "com.tracfone" })
public class WebServicesConfiguration {
	
	@Bean
	public Jaxb2Marshaller marshaller() {
		Jaxb2Marshaller jaxb2Marshaller = new Jaxb2Marshaller();
		String[] packages = {
				"com.tracfone" };
		jaxb2Marshaller.setPackagesToScan(packages);
		return jaxb2Marshaller;
	}
	
	@Value("${tracfone.balancesInquiry.protocol}")
	private String balanceInquiryProtocol;
	@Value("${tracfone.balancesInquiry.path}")
	private String balanceInquiryPath;
	@Value("${tracfone.balancesInquiry.host}")
	private String balanceInquiryHost;
	@Value("${tracfone.balancesInquiry.port}")
	private String balanceInquiryPort;
	@Value("${tracfone.balancesInquiry.username}")
	private String balanceInquiryUsername;
	@Value("${tracfone.balancesInquiry.password}")
	private String balanceInquiryPassword;


	@Bean
	public BalanceInquiryDao balanceInquiryDao(Jaxb2Marshaller marshaller) {

		WSBalanceInquiryDao wSBalanceInquiryDao = new WSBalanceInquiryDao();
		wSBalanceInquiryDao.setDefaultUri(balanceInquiryProtocol
				+ "://" + balanceInquiryHost + ":"
				+ balanceInquiryPort + balanceInquiryPath);
		wSBalanceInquiryDao.setMarshaller(marshaller);
		wSBalanceInquiryDao.setUnmarshaller(marshaller);

		Wss4jSecurityInterceptor securityInterceptor = new Wss4jSecurityInterceptor();
		securityInterceptor.setSecurementUsername(balanceInquiryUsername);
		securityInterceptor.setSecurementPassword(balanceInquiryPassword);
		securityInterceptor.setSecurementPasswordType("PasswordText");
		securityInterceptor.setSecurementActions("UsernameToken");
		ClientInterceptor[] interceptors = new ClientInterceptor[] { securityInterceptor };
		wSBalanceInquiryDao.setInterceptors(interceptors);
		return wSBalanceInquiryDao;
	}
}
