package com.jacada.common.logging;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.AfterThrowing;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.google.gson.Gson;

/**
 * An instance of this class will log all method entry and exits and try to log
 * the arguments into and out of the classes as well.
 * 
 * An instance of this class is never needed to be manually created.
 * 
 * @author Gautam
 *
 */
@Aspect
@Component
public class LoggingAspect {

	private static final Logger LOGGER = LoggerFactory.getLogger(LoggingAspect.class);

	@Autowired
	private transient Gson gson;

	/**
	 * This method will log the entry into any method call under the
	 * com.jacada.anico.uad.
	 * 
	 * The method will try to log the arguments to the method as well, but if
	 * this attempt fails for unknown parse problems, just the entry statement
	 * will be logged.
	 * 
	 * Note: This method should not be manually called
	 * 
	 * @param joinPoint
	 */
	@Before("execution(* com.jacada.tracfoneAD..*.*(..))")
	public void before(JoinPoint joinPoint) {
		if (LOGGER.isTraceEnabled()) {
			try {
				LOGGER.trace("Entered {} with arguments {}", joinPoint.getSignature(),
						gson.toJson(joinPoint.getArgs()));
			} catch (Exception e) {
				LOGGER.trace("Entered {} the arguments could not be logged", joinPoint.getSignature());
			}
		}

	}

	/**
	 * This method will log the exit from any method call under the
	 * com.jacada.anico.uad package and sub packages
	 * 
	 * The method will try to log the returned value from the method as well,
	 * but if this attempt fails for unknown parse problems, just the exit
	 * statement will be logged.
	 * 
	 * Note: This method should not be manually called
	 * 
	 * @param joinPoint
	 * @param returnValue
	 */
	@AfterReturning(value = "execution(* com.jacada.tracfoneAD..*.*(..))", returning = "returnValue")
	public void after(JoinPoint joinPoint, Object returnValue) {
		if (LOGGER.isTraceEnabled()) {
			try {
				LOGGER.trace("Exiting {} with response {}", joinPoint.getSignature(), gson.toJson(returnValue));
			} catch (Exception e) {
				LOGGER.trace("Exiting {} the response could not be logged.", joinPoint.getSignature());
			}
		}
	}

	/**
	 * This method will log the exception thrown from any method call under the
	 * com.jacada.anico.uad package and sub packages
	 * 
	 * Note: This method should not be manually called
	 * 
	 * @param joinPoint
	 * @param exception
	 */
	@AfterThrowing(value = "execution(* com.jacada.tracfoneAD..*.*(..))", throwing = "exception")
	public void exception(JoinPoint joinPoint, Exception exception) {
		LOGGER.error("Exiting {} with exception.", joinPoint.getSignature());
		LOGGER.error("Exception", exception);
	}
}
