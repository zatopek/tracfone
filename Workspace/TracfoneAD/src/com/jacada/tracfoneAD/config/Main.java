package com.jacada.tracfoneAD.config;

import java.io.File;

import org.springframework.beans.factory.config.PropertyPlaceholderConfigurer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.EnableAspectJAutoProxy;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.FileSystemResource;

import com.google.gson.Gson;

/**
 * This is the main Configuration file for the project.
 * 
 * @author Gautam
 * 
 */

@Configuration
@EnableAspectJAutoProxy
@ComponentScan(basePackages = { "com.jacada.tracfoneAD.controller" })
public class Main {

	/**
	 * This method returns an instance of the
	 * {@link PropertyPlaceholderConfigurer} with uad.properties and
	 * JacadaConfiguration.properties file configured
	 * 
	 * @return {@link PropertyPlaceholderConfigurer} instance
	 */
	@Bean
	public static PropertyPlaceholderConfigurer propertyPlaceholderConfigurer() {
		PropertyPlaceholderConfigurer configurer = new PropertyPlaceholderConfigurer();
		String propertiesFileName = "tracfonead.properties";
		String jacadaPropertiesFileName = "JacadaConfiguration.properties";
		File properties = new File(jacadaPropertiesFileName);
		if (properties.exists()) {
			configurer.setLocations(new FileSystemResource(propertiesFileName),
					new FileSystemResource(jacadaPropertiesFileName));
		} else {
			configurer.setLocations(new ClassPathResource(propertiesFileName),
					new ClassPathResource(jacadaPropertiesFileName));
		}

		return configurer;
	}

	/**
	 * This method returns an instance of {@link Gson} to be shared within the
	 * application
	 * 
	 * @return
	 */
	@Bean
	public Gson gson() {
		return new Gson();
	}

}
