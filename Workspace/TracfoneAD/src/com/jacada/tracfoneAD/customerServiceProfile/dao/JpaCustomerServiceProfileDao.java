package com.jacada.tracfoneAD.customerServiceProfile.dao;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import com.jacada.tracfoneAD.config.Main;
import com.jacada.tracfoneAD.customerServiceProfile.dao.interfaces.CustomerServiceProfileDao;
import com.jacada.tracfoneAD.customerServiceProfile.entities.CustomerServiceProfile;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
@Transactional
public class JpaCustomerServiceProfileDao implements CustomerServiceProfileDao {

	private static final long serialVersionUID = 1L;

	@Value("${jdbc.driverClassName}")
	private String driverClassName;
	@Value("${jdbc.url}")
	private String jdbcURL;
	@Value("${jdbc.username}")
	private String username;
	@Value("${jdbc.password}")
	private String password;

	@Override
	public ResultSet getCustomerServiceProfile(String esn) {

		Connection dbConnection = null;
		PreparedStatement preparedStatement = null;
		ResultSet rs = null;

		String query = "select "
				+ "device_type, sim, sim_status, x_min, min_status, x_msid, phone_gen, part_serial_no, x_hex_serial_no,"
				+ "part_number, lease_status_flag, lease_status_name, sequence, service_type, rate_plan, service_plan_objid,"
				+ "carrier, technology, technology_alt, install_date, service_end_dt, x_expire_dt, next_charge_date, brand,"
				+ "dealer_name, cards_in_queue, warranty_exchanges, basic_warranty, extended_warranty, x_policy_description,"
				+ "sp_script_text, adf_next_refill_date, customer_id, first_name, last_name, e_mail, groupid, x_zipcode, lid, phone_status"
				+ " from table(sa.adfcrm_vo.get_service_profile(?,?))";

		try {
			Class.forName(driverClassName);
			dbConnection = DriverManager.getConnection(jdbcURL, username,
					password);
			preparedStatement = dbConnection.prepareStatement(query);
			preparedStatement.setString(1, esn);
			preparedStatement.setString(2, null);
			rs = preparedStatement.executeQuery();
		} catch (ClassNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return rs;
	}

	@Override
	public ResultSet getOperatingSystem(String partNumber) {
		Connection dbConnection = null;
		PreparedStatement preparedStatement = null;
		ResultSet rs = null;

		String query = "select name model,  x_param_name parameter,x_param_value value"
				+ " From Table_X_Part_Class_Values ,Table_X_Part_Class_Params, Table_Part_Class, table_part_num"
				+ " WHERE value2part_class = table_part_class.objid"
				+ " And Value2class_Param= Table_X_Part_Class_Params.Objid"
				+ " and x_param_name in ( 'MANUFACTURER', 'OPERATING_SYSTEM','DEVICE_TYPE' )"
				+ " and part_num2part_class = table_part_class.objid and part_number = ?"
				+ " order by name, x_param_name";
				
		try {
			Class.forName(driverClassName);
			dbConnection = DriverManager.getConnection(jdbcURL, username,
					password);
			preparedStatement = dbConnection.prepareStatement(query);
			preparedStatement.setString(1, partNumber);
			rs = preparedStatement.executeQuery();
		} catch (ClassNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return rs;
	}

}
