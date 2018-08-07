package com.jacada.common.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

/**
 * Configuration for the common elements used by Jacada Workspace implementations.
 * @author Gautam
 *
 */
@Configuration
public class Common {

	@Value("${common.threadpool.corePoolSize:50}")
	private int corePoolSize;
	@Value("${common.threadpool.maxPoolSize:250}")
	private int maxPoolSize;
	@Value("${common.threadpool.queueCapacity:400}")
	private int queueCapacity;
	
	/**
	 * A pool task executor to handle different pool sizes
	 * @return {@link ThreadPoolTaskExecutor}
	 */
	@Bean
	public ThreadPoolTaskExecutor executor() {
		ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
		executor.setCorePoolSize(50);
		executor.setMaxPoolSize(250);
		executor.setQueueCapacity(400);
		return executor;
	}
}
