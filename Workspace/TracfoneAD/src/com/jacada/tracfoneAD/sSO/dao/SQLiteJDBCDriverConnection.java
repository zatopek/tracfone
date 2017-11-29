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

import com.jacada.tracfoneAD.sSO.entities.LoginCredential;

public class SQLiteJDBCDriverConnection {

	public static String DB_URL = "jdbc:sqlite:C:\\Jacada\\sqlite\\db\\tracfone.db";

	/**
	 * Connect to the database
	 * 
	 * @return the Connection object
	 */
	private Connection connect() {

		Connection conn = null;
		try {
			Class.forName("org.sqlite.JDBC");
			conn = DriverManager.getConnection(DB_URL);
			System.out.println("Connection to SQLite has been established.");
		} catch (SQLException e) {
			System.out.println(e.getMessage());
		} catch (ClassNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return conn;
	}

	/**
	 * Connect to database
	 * 
	 */
	public void createNewDatabase() {

		try (
				Connection conn = this.connect()) {
			if (conn != null) {
				DatabaseMetaData meta = conn.getMetaData();
				System.out
						.println("The driver name is " + meta.getDriverName());
				System.out.println("A new database has been created.");
			}

		} catch (SQLException e) {
			System.out.println(e.getMessage());
		}
	}

	public void createNewTable() {

		// SQL statement for creating a new table
		String sql = "CREATE TABLE IF NOT EXISTS agent_sso (\n"
				+ "	agentId text NOT NULL,\n" + "	system text NOT NULL,\n"
				+ "	username text NOT NULL,\n" + "	password text NOT NULL,\n"
				+ " PRIMARY KEY (agentId, system)\n" + ");";

		try (Connection conn = this.connect();
				Statement stmt = conn.createStatement()) {
			// create a new table
			stmt.execute(sql);
		} catch (SQLException e) {
			System.out.println(e.getMessage());
		}
	}

	/**
	 * select all rows in the agent_sso table that matches the agentId
	 */
	public List<LoginCredential> getAgentLogins(String agentId) {
		System.out.println("getAgentLogins");
		List<LoginCredential> loginList = new ArrayList<LoginCredential>();
		
		String sql = "SELECT system, username, password FROM agent_sso where agentId='"
				+ agentId + "'";

		try (Connection conn = this.connect();
				Statement stmt = conn.createStatement();
				ResultSet rs = stmt.executeQuery(sql)) {

			// loop through the result set
			while (rs.next()) {
				String system = rs.getString("system");
				String username = rs.getString("username");
				String password = rs.getString("password");
				
				LoginCredential loginCredential = new LoginCredential();
				loginCredential.setSystem(system);
				loginCredential.setUsername(username);
				loginCredential.setPassword(password);
				loginList.add(loginCredential);		
				
				System.out.println(system + "\t"
						+ username + "\t"
						+ password);
			}

		} catch (SQLException e) {
			System.out.println(e.getMessage());
		}
		
		return loginList;
	}
	
	/**
     * Insert a new row into the agent_sso table
     *
     * @param name
     * @param capacity
     */
    public void insertAgentSsoForSystem(String agentId, String system, String username, String password) {
    	
        String sql = "INSERT INTO agent_sso(agentId,system,username,password) VALUES(?,?,?,?)";
        System.out.println("insertAgentSsoForSystem=>" + system);
        try (Connection conn = this.connect();
                PreparedStatement pstmt = conn.prepareStatement(sql)) {
            pstmt.setString(1, agentId);
            pstmt.setString(2, system);
            pstmt.setString(3, username);
            pstmt.setString(4, password);
            pstmt.executeUpdate();
        } catch (SQLException e) {
            System.out.println(e.getMessage());
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
    public void update(String agentId, String system, String username, String password) {
        String sql = "UPDATE agent_sso SET username = ? , "
                + "password = ? "
                + "WHERE agentId = ? and system = ?";
 
        try (Connection conn = this.connect();
                PreparedStatement pstmt = conn.prepareStatement(sql)) {
 
            // set the corresponding param
            pstmt.setString(1, username);
            pstmt.setString(2, password);
            pstmt.setString(3, agentId);
            pstmt.setString(4, password);
            // update 
            pstmt.executeUpdate();
        } catch (SQLException e) {
            System.out.println(e.getMessage());
        }
    }    
    
    /**
     * Delete an agent_sso specified by the agentId
     *
     * @param agentId
     */
    public void delete(String agentId) {
        String sql = "DELETE FROM agent_sso WHERE agentId = ?";
 
        try (Connection conn = this.connect();
                PreparedStatement pstmt = conn.prepareStatement(sql)) {
 
            pstmt.setString(1, agentId);
            // execute the delete statement
            pstmt.executeUpdate();
 
        } catch (SQLException e) {
            System.out.println(e.getMessage());
        }
    }
    
}