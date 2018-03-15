package com.jacada.tracfoneAD.customerServiceProfile.dao;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import com.jacada.tracfoneAD.customerServiceProfile.dao.interfaces.CustomerServiceProfileDao;
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
				+ "dealer_name, dealer_id, cards_in_queue, warranty_exchanges, basic_warranty, extended_warranty, x_policy_description,"
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

	@Override
	public ResultSet getRecentPurchases(String esn, String brand) {
		Connection dbConnection = null;
		PreparedStatement preparedStatement = null;
		ResultSet rs = null;
		
		String query = "SELECT distinct Objid, Description,Customer_Price, part_number property_display, x_card_type, units, ServicePlanType"
				+ " FROM table(sa.ADFCRM_VO.getAvailableSpPurchase(?,?,?))"
				+ " order by x_card_type desc, customer_price asc";
		
		try {
			Class.forName(driverClassName);
			dbConnection = DriverManager.getConnection(jdbcURL, username,
					password);
			preparedStatement = dbConnection.prepareStatement(query);
			preparedStatement.setString(1, esn);
			preparedStatement.setString(2, brand.toUpperCase());
			preparedStatement.setString(3, "ENGLISH");
			
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
	public ResultSet getTicketHistory(String esn) {
		Connection dbConnection = null;
		PreparedStatement preparedStatement = null;
		ResultSet rs = null;
		
		String query = "SELECT TableExtactcase.AGE, "
				+ "TableExtactcase.CLARIFY_STATE,"
				+ "TableExtactcase.CONDITION,"
				+ "TableExtactcase.CONTACT_OBJID,"
				+ "TableExtactcase.CREATION_TIME,"
				+ "TableExtactcase.ELM_OBJID,"
				+ "TableExtactcase.FIRST_NAME,"
				+ "TableExtactcase.ID_NUMBER,"
				+ "TableExtactcase.IS_SUPERCASE,"
				+ "TableExtactcase.LAST_NAME,"
				+ "TableExtactcase.LOCATION_OBJID,"
				+ "TableExtactcase.LOGIN_NAME,"
				+ "TableExtactcase.ROWID,"
				+ "TableExtactcase.S_CONDITION,"
				+ "TableExtactcase.S_FIRST_NAME,"
				+ "TableExtactcase.S_LAST_NAME,"
				+ "TableExtactcase.S_LOGIN_NAME,"
				+ "TableExtactcase.S_STATUS,"
				+ "TableExtactcase.S_TITLE,"
				+ "TableExtactcase.STATUS,"
				+ "TableExtactcase.TITLE,"
				+ "TableExtactcase.X_CARRIER_ID,"
				+ "TableExtactcase.X_CARRIER_NAME,"
				+ "TableExtactcase.X_CASE_TYPE,"
				+ "TableExtactcase.X_ESN,"
				+ "TableExtactcase.X_ICCID,"
				+ "TableExtactcase.X_MIN,"
				+ "TableExtactcase.X_PHONE_MODEL,"
				+ "TableExtactcase.X_REPLACEMENT_UNITS,"
				+ "TableExtactcase.X_RETAILER_NAME,"
				+ "TableExtactcase.ISSUE"
				+ " FROM TABLE_EXTACTCASE TableExtactcase"
				+ " WHERE TableExtactcase.X_ESN = ?" 
				+ " ORDER BY TableExtactcase.CREATION_TIME";
		try {
			Class.forName(driverClassName);
			dbConnection = DriverManager.getConnection(jdbcURL, username,
					password);
			preparedStatement = dbConnection.prepareStatement(query);
			preparedStatement.setString(1, esn);
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
	public ResultSet getProductOfferings(String esn, String brand) {
		Connection dbConnection = null;
		PreparedStatement preparedStatement = null;
		ResultSet rs = null;
		
		String query = "SELECT distinct Objid, Mkt_Name, Description,Customer_Price, Ivr_Plan_Id, Webcsr_Display_Name,"
		+ "X_SP2PROGRAM_PARAM, X_Program_Name,"
		+ "spobjid, value_name, part_number Property_Value, part_number property_display,"
		+ "x_card_type, units, ServicePlanType, service_plan_group"
		+ " FROM table(sa.ADFCRM_VO.getAvailableSpPurchase(?,?,?))"
		+ " order by x_card_type desc, customer_price asc";
		 
		try {
			Class.forName(driverClassName);
			dbConnection = DriverManager.getConnection(jdbcURL, username,
					password);
			preparedStatement = dbConnection.prepareStatement(query);
			preparedStatement.setString(1, esn);
			preparedStatement.setString(2, brand.toUpperCase());
			preparedStatement.setString(3, "ENGLISH");
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
