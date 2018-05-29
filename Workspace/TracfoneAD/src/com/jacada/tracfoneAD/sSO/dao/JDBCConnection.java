package com.jacada.tracfoneAD.sSO.dao;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.sql.DatabaseMetaData;
import java.sql.Statement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

import javax.naming.Context;
import javax.naming.InitialContext;
import javax.naming.NamingException;
import javax.sql.DataSource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.jacada.tracfoneAD.sSO.crypto.TracfoneADCryptographer;
import com.jacada.tracfoneAD.sSO.entities.LoginCredential;
import com.jacada.tracfoneAD.util.LoggingAspect;

public class JDBCConnection {
	
	private static final Logger LOGGER = LoggerFactory.getLogger(JDBCConnection.class);
	
	private Connection getConnection(){
		
	    String DATASOURCE_CONTEXT = "java:comp/env/JACADA_JDBC_DB_Reference";
	    Connection connection = null;
	    DataSource datasource = null;
	    try {
	      Context initialContext = new InitialContext();
	      try{
	       datasource = (DataSource)initialContext.lookup(DATASOURCE_CONTEXT);
	      }
	      catch(Exception e){e.printStackTrace();};

	      if (datasource != null) {
	        connection = datasource.getConnection();
	      }
	      else {
	        LOGGER.debug("Failed to lookup datasource.");
	      }
	    }
	    catch(Exception ex){
	    	LOGGER.debug("Cannot get connection: " + ex);
		    }
	    return connection;
	  }

	/**
	 * Create new table
	 * 
	 */

	public void createNewTable() {

		//String chkTableSql = "select 1 from agent_sso limit 1";
		String chkTableSql = "select table_name from user_tables where table_name='AGENT_SSO'";
		// SQL statement for creating a new table
		String sql = "CREATE TABLE agent_sso (\n"
				+ "	agentId varchar(255) NOT NULL,\n" + "	system varchar(255) NOT NULL,\n"
				+ "	username varchar(255) NOT NULL,\n" + "	password varchar(255) NOT NULL,\n"
				+ " CONSTRAINT agent_sso_pk PRIMARY KEY (agentId, system)\n" + ")";

		try (Connection conn = this.getConnection();
				Statement stmt = conn.createStatement()) {
			/*
			try {
				stmt.execute(chkTableSql);
			}catch(Exception e){
				if(e.getLocalizedMessage().toLowerCase().indexOf("doesn't exist")>=0){
					// create a new table
					stmt.execute(sql);					
				}
			}*/
			DatabaseMetaData meta = conn.getMetaData();
		    String productName = meta.getDatabaseProductName();
		    // if MySQL
		    if (productName.toLowerCase().indexOf("mysql")>-1){
		    	chkTableSql = "select 1 from agent_sso limit 1";
		    	try {
					stmt.execute(chkTableSql);
				}catch(Exception e){
					if(e.getLocalizedMessage().toLowerCase().indexOf("doesn't exist")>=0){
						// create a new table
						stmt.execute(sql);					
					}
				}
		    }
		    // assume oracle if not MySQL
		    else {
				try {
					ResultSet rs = stmt.executeQuery(chkTableSql);
					System.out.println("after check new table");
					System.out.println("table exists???");
					System.out.print(rs.next());
					if(!rs.next()) {
						System.out.println("prepare to create new table");
						System.out.println(sql);	
						stmt.execute(sql);
						System.out.println("after create new table");
					}
				}catch(Exception e){
					LOGGER.error(e.getMessage());
					System.out.println(e.getLocalizedMessage());
				}		    	
		    }			
		} catch (SQLException e) {
			LOGGER.error(e.getMessage());
		}
	}

	/**
	 * select all rows in the agent_sso table that matches the agentId
	 */
	public List<LoginCredential> getAgentLogins(String agentId) {
		LOGGER.debug("getAgentLogins=>" + agentId);
		List<LoginCredential> loginList = new ArrayList<LoginCredential>();

		String sql = "SELECT system, username, password FROM agent_sso where agentId='"
				+ agentId + "'";

		try (Connection conn = this.getConnection();
				Statement stmt = conn.createStatement();
				ResultSet rs = stmt.executeQuery(sql)) {
			
			// loop through the result set
			while (rs.next()) {
				String system = rs.getString("system");
				String username = rs.getString("username");
				String password = rs.getString("password");
				
				String decryptPwd = "";
				try {
					decryptPwd = TracfoneADCryptographer.decrypt(password);
				} catch (Exception e) {
					e.printStackTrace();
				}

				LoginCredential loginCredential = new LoginCredential();
				loginCredential.setSystem(system);
				loginCredential.setUsername(username);
				loginCredential.setPassword(decryptPwd);
				loginList.add(loginCredential);

				LOGGER.debug(system + "\t" + username + "\t" + password + "\t" + decryptPwd);
			}

		} catch (SQLException e) {
			LOGGER.error(e.getMessage());
		}

		return loginList;
	}

	/**
	 * Insert a new row into the agent_sso table
	 * 
	 * @param agentId
	 * @param system
	 * @param username
	 * @param password
	 */
	public void insertAgentSsoForSystem(String agentId, String system,
			String username, String password) {

		createNewTable();
		String cipherPwd = "";
		try {
			cipherPwd = TracfoneADCryptographer.encrypt(password);
		} catch (Exception e1) {
			e1.printStackTrace();
		}

		String sql = "INSERT INTO agent_sso(agentId,system,username,password) VALUES(?,?,?,?)";
		try (Connection conn = this.getConnection();
				PreparedStatement pstmt = conn.prepareStatement(sql)) {
			pstmt.setString(1, agentId);
			pstmt.setString(2, system);
			pstmt.setString(3, username);
			pstmt.setString(4, cipherPwd);
			pstmt.executeUpdate();
		} catch (SQLException e) {
			LOGGER.error(e.getMessage());
		}
	}

	/**
	 * Update data of a agent_sso specified by the agentId and system
	 * 
	 * @param agentId
	 * @param system
	 * @param username
	 * @param password
	 */
	public void update(String agentId, String system, String username,
			String password) {
		
		String cipherPwd = "";
		try {
			cipherPwd = TracfoneADCryptographer.encrypt(password);
		} catch (Exception e1) {
			e1.printStackTrace();
		}
		
		String sql = "UPDATE agent_sso SET username = ? , " + "password = ? "
				+ "WHERE agentId = ? and system = ?";

		try (Connection conn = this.getConnection();
				PreparedStatement pstmt = conn.prepareStatement(sql)) {

			// set the corresponding param
			pstmt.setString(1, username);
			pstmt.setString(2, password);
			pstmt.setString(3, agentId);
			pstmt.setString(4, cipherPwd);
			// update
			pstmt.executeUpdate();
		} catch (SQLException e) {
			LOGGER.error(e.getMessage());
		}
	}

	/**
	 * Delete an agent_sso specified by the agentId
	 * 
	 * @param agentId
	 */
	public void delete(String agentId) {
		String sql = "DELETE FROM agent_sso WHERE agentId = ?";

		try (Connection conn = this.getConnection();
				PreparedStatement pstmt = conn.prepareStatement(sql)) {

			pstmt.setString(1, agentId);
			// execute the delete statement
			pstmt.executeUpdate();

		} catch (SQLException e) {
			LOGGER.error(e.getMessage());
		}
	}

}
