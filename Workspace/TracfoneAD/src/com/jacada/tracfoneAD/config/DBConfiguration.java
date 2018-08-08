package com.jacada.tracfoneAD.config;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;

@Configuration
public class DBConfiguration {

	@Value("${jdbc.driverClassName}")
	private String driverClassName;
	@Value("${jdbc.url}")
	private String jdbcUrl;
	@Value("${jdbc.username}")
	private String username;
	@Value("${jdbc.password}")
	private String password;
	@Value("${jdbc.maxPoolSize}")
	private int maxPoolSize;
	
	@Bean(name="tasDataSource")
	public DataSource dataSource() {
		HikariConfig config = new HikariConfig();
		config.setJdbcUrl(jdbcUrl);
		config.setDriverClassName(driverClassName);
		config.setUsername(username);
		config.setPassword(password);
		config.setMaximumPoolSize(maxPoolSize);
		HikariDataSource dataSource = new HikariDataSource(config);
		return dataSource;
	}
	
}
