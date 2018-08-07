package com.jacada.tracfoneAD.customerServiceProfile.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import javax.sql.DataSource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.jacada.tracfoneAD.customerServiceProfile.dao.interfaces.CustomerServiceProfileDao;
import com.jacada.tracfoneAD.customerServiceProfile.entities.AccountBalances;
import com.jacada.tracfoneAD.customerServiceProfile.entities.CustomerProfile;
import com.jacada.tracfoneAD.customerServiceProfile.entities.CustomerServiceProfile;
import com.jacada.tracfoneAD.customerServiceProfile.entities.DeviceProfile;
import com.jacada.tracfoneAD.customerServiceProfile.entities.Flash;
import com.jacada.tracfoneAD.customerServiceProfile.entities.InteractionDetail;
import com.jacada.tracfoneAD.customerServiceProfile.entities.InteractionReason;
import com.jacada.tracfoneAD.customerServiceProfile.entities.ProductOffering;
import com.jacada.tracfoneAD.customerServiceProfile.entities.ServiceProfile;
import com.jacada.tracfoneAD.customerServiceProfile.entities.TasTicket;

@Repository
@Transactional
public class JpaCustomerServiceProfileDao implements CustomerServiceProfileDao {

	private static final long serialVersionUID = 1L;
	private static final Logger LOGGER = LoggerFactory.getLogger(JpaCustomerServiceProfileDao.class);

	@Autowired
	@Qualifier("tasDataSource")
	private DataSource tasDataSource;

	private static final String OS = "OS";
	private static final String FIRMWARE = "FIRMWARE";
	private static final String MANUFACTURER = "MANUFACTURER";

	@Override
	public CustomerServiceProfile getCustomerServiceProfile(String esn) {

		Connection dbConnection = null;
		PreparedStatement preparedStatement = null;
		ResultSet rs = null;
		CustomerServiceProfile customerServiceProfile = new CustomerServiceProfile();

		String query = "select "
				+ "device_type, sim, sim_status, x_min, min_status, x_msid, phone_gen, part_serial_no, x_hex_serial_no,"
				+ "part_number, lease_status_flag, lease_status_name, sequence, service_type, rate_plan, service_plan_objid,"
				+ "carrier, technology, technology_alt, install_date, service_end_dt, x_expire_dt, next_charge_date, brand,"
				+ "dealer_name, dealer_id, cards_in_queue, warranty_exchanges, basic_warranty, extended_warranty, x_policy_description,"
				+ "sp_script_text, adf_next_refill_date, customer_id, first_name, last_name, e_mail, groupid, x_zipcode, lid, phone_status,"
				+ "sl_program_name, sl_lifeline_status" + " from table(sa.adfcrm_vo.get_service_profile(?,?))";

		try {
			dbConnection = tasDataSource.getConnection();
			preparedStatement = dbConnection.prepareStatement(query);
			preparedStatement.setString(1, esn);
			preparedStatement.setString(2, null);
			rs = preparedStatement.executeQuery();

			if (rs.next()) {

				CustomerProfile customerProfile = new CustomerProfile();
				DeviceProfile deviceProfile = new DeviceProfile();
				ServiceProfile serviceProfile = new ServiceProfile();
				AccountBalances accountBalances = new AccountBalances();

				deviceProfile.setEsn(esn);
				deviceProfile.setDeviceType(rs.getString("device_type"));
				deviceProfile.setSim(rs.getString("sim"));
				deviceProfile.setSimStatus(rs.getString("sim_status"));
				deviceProfile.setMin(rs.getString("x_min"));
				deviceProfile.setMinStatus(rs.getString("min_status"));
				deviceProfile.setMsid(rs.getString("x_msid"));
				deviceProfile.setPhoneGen(rs.getString("phone_gen"));
				deviceProfile.setSerial(rs.getString("part_serial_no"));
				deviceProfile.setPartNumber(rs.getString("part_number"));
				deviceProfile.setLeasedToFinance(rs.getString("lease_status_flag"));
				deviceProfile.setLeaseStatus(rs.getString("lease_status_name"));
				deviceProfile.setSequence(rs.getString("sequence"));
				deviceProfile.setHexSerial(rs.getString("x_hex_serial_no"));
				deviceProfile.setPhoneStatus(rs.getString("phone_status"));
				deviceProfile.setHandsetProtection(rs.getString("extended_warranty"));

				Map<String, String> deviceOsInformation = this
						.getDeviceInformationFromPartNumber(deviceProfile.getPartNumber());
				deviceProfile.setOs(deviceOsInformation.get(OS));
				deviceProfile.setFirmware(deviceOsInformation.get(FIRMWARE));
				deviceProfile.setManufacturer(deviceOsInformation.get(MANUFACTURER));

				serviceProfile.setServiceType(rs.getString("service_type"));
				serviceProfile.setRatePlan(rs.getString("rate_plan"));
				serviceProfile.setServicePlanObjId(rs.getString("service_plan_objid"));
				serviceProfile.setCarrier(rs.getString("carrier"));
				serviceProfile.setTechnology(rs.getString("technology") + "(" + rs.getString("technology_alt") + ")");
				serviceProfile.setActivationDate(rs.getString("install_date"));
				serviceProfile.setDeactDate(rs.getString("service_end_dt"));
				serviceProfile.setServiceEndDate(rs.getString("x_expire_dt"));
				serviceProfile.setNextChargeDate(rs.getString("next_charge_date"));
				serviceProfile.setBrand(rs.getString("brand"));
				serviceProfile.setDealer(rs.getString("dealer_id") + " " + rs.getString("dealer_name"));
				serviceProfile.setCardsInReserve(rs.getString("cards_in_queue"));
				serviceProfile.setWarrantyExchanges(rs.getString("warranty_exchanges"));
				serviceProfile.setBasicWarrantyFound(rs.getString("basic_warranty"));
				serviceProfile.setExtendedWarranty(rs.getString("extended_warranty"));
				serviceProfile.setCurrentThrottleStatus(rs.getString("x_policy_description"));
				serviceProfile.setAutoRefill(rs.getString("sp_script_text"));
				serviceProfile.setNextRefillDate(rs.getString("adf_next_refill_date"));

				customerProfile.setCustomerId(rs.getString("customer_id"));
				customerProfile.setContactName(rs.getString("first_name") + " " + rs.getString("last_name"));
				customerProfile.setEmail(rs.getString("e_mail"));
				customerProfile.setGroupId(rs.getString("groupid"));
				customerProfile.setZip(rs.getString("x_zipcode"));
				customerProfile.setLid(rs.getString("lid"));
				customerProfile.setLifeLineStatus(rs.getString("sl_lifeline_status"));
				customerProfile.setProgramName(rs.getString("sl_program_name"));

				accountBalances.setPhoneStatus(deviceProfile.getPhoneStatus());
				customerServiceProfile.setDeviceProfile(deviceProfile);
				customerServiceProfile.setServiceProfile(serviceProfile);
				customerServiceProfile.setCustomerProfile(customerProfile);
				customerServiceProfile.setAccountBalances(accountBalances);

			}

		} catch (Exception e) {
			LOGGER.error("Failed to get Customer Profile", e);
		} finally {
			try {
				if (rs != null) {
					rs.close();
				}
				if (preparedStatement != null) {
					preparedStatement.close();
				}
				if (dbConnection != null) {
					dbConnection.close();
				}
			} catch (Exception e) {
				LOGGER.error("Failed clean up after get Customer Profile", e);
			}
		}
		return customerServiceProfile;
	}

	@Override
	public Map<String, String> getDeviceInformationFromPartNumber(String partNumber) {
		Connection dbConnection = null;
		PreparedStatement preparedStatement = null;
		ResultSet rs = null;
		String os = "";
		String manufacturer;
		String firmware;
		Map<String, String> deviceOsInformation = new HashMap<String, String>();

		String query = "select name model,  x_param_name parameter,x_param_value value"
				+ " From Table_X_Part_Class_Values ,Table_X_Part_Class_Params, Table_Part_Class, table_part_num"
				+ " WHERE value2part_class = table_part_class.objid"
				+ " And Value2class_Param= Table_X_Part_Class_Params.Objid"
				+ " and x_param_name in ( 'MANUFACTURER', 'OPERATING_SYSTEM','DEVICE_TYPE', 'FIRMWARE' )"
				+ " and part_num2part_class = table_part_class.objid and part_number = ?"
				+ " order by name, x_param_name";

		try {
			dbConnection = tasDataSource.getConnection();
			preparedStatement = dbConnection.prepareStatement(query);
			preparedStatement.setString(1, partNumber);
			rs = preparedStatement.executeQuery();
			while (rs.next()) {
				String parameter = rs.getString("PARAMETER");
				if (parameter.equals("OPERATING_SYSTEM")) {
					os = rs.getString("VALUE");
					deviceOsInformation.put(OS, os);
				} else if (parameter.equals("MANUFACTURER")) {
					manufacturer = rs.getString("VALUE");
					deviceOsInformation.put(MANUFACTURER, manufacturer);
				} else if (parameter.equals("FIRMWARE")) {
					firmware = rs.getString("VALUE");
					deviceOsInformation.put(FIRMWARE, firmware);
				}
			}
		} catch (Exception e) {
			LOGGER.error("Failed to get Device Information from Part Number", e);
		} finally {
			try {
				if (rs != null) {
					rs.close();
				}
				if (preparedStatement != null) {
					preparedStatement.close();
				}
				if (dbConnection != null) {
					dbConnection.close();
				}
			} catch (Exception e) {
				LOGGER.error("Failed clean up after get Device Information from Part Number", e);
			}
		}
		return deviceOsInformation;
	}

	@Override
	public String getRecentPurchases(String esn, String brand) {
		Connection dbConnection = null;
		PreparedStatement preparedStatement = null;
		ResultSet rs = null;
		String recentPurchase = "";

		String query = "SELECT distinct Objid, Description,Customer_Price, part_number property_display, x_card_type, units, ServicePlanType"
				+ " FROM table(sa.ADFCRM_VO.getAvailableSpPurchase(?,?,?))"
				+ " order by x_card_type desc, customer_price asc";

		try {
			dbConnection = tasDataSource.getConnection();
			preparedStatement = dbConnection.prepareStatement(query);
			preparedStatement.setString(1, esn);
			preparedStatement.setString(2, brand.toUpperCase());
			preparedStatement.setString(3, "ENGLISH");

			rs = preparedStatement.executeQuery();
			while (rs.next()) {
				recentPurchase = rs.getString("OBJID");
			}
		} catch (Exception e) {
			LOGGER.error("Failed to get Recent Purchases", e);
		} finally {
			try {
				if (rs != null) {
					rs.close();
				}
				if (preparedStatement != null) {
					preparedStatement.close();
				}
				if (dbConnection != null) {
					dbConnection.close();
				}
			} catch (Exception e) {
				LOGGER.error("Failed clean up after get Recent Purchases", e);
			}
		}
		return recentPurchase;
	}

	@Override
	public List<TasTicket> getTicketHistory(String esn) {
		Connection dbConnection = null;
		PreparedStatement preparedStatement = null;
		ResultSet rs = null;
		List<TasTicket> ticketList = new ArrayList<TasTicket>();

		String query = "SELECT TableExtactcase.AGE, " + "TableExtactcase.CLARIFY_STATE," + "TableExtactcase.CONDITION,"
				+ "TableExtactcase.CONTACT_OBJID," + "TableExtactcase.CREATION_TIME," + "TableExtactcase.ELM_OBJID,"
				+ "TableExtactcase.FIRST_NAME," + "TableExtactcase.ID_NUMBER," + "TableExtactcase.IS_SUPERCASE,"
				+ "TableExtactcase.LAST_NAME," + "TableExtactcase.LOCATION_OBJID," + "TableExtactcase.LOGIN_NAME,"
				+ "TableExtactcase.ROWID," + "TableExtactcase.S_CONDITION," + "TableExtactcase.S_FIRST_NAME,"
				+ "TableExtactcase.S_LAST_NAME," + "TableExtactcase.S_LOGIN_NAME," + "TableExtactcase.S_STATUS,"
				+ "TableExtactcase.S_TITLE," + "TableExtactcase.STATUS," + "TableExtactcase.TITLE,"
				+ "TableExtactcase.X_CARRIER_ID," + "TableExtactcase.X_CARRIER_NAME," + "TableExtactcase.X_CASE_TYPE,"
				+ "TableExtactcase.X_ESN," + "TableExtactcase.X_ICCID," + "TableExtactcase.X_MIN,"
				+ "TableExtactcase.X_PHONE_MODEL," + "TableExtactcase.X_REPLACEMENT_UNITS,"
				+ "TableExtactcase.X_RETAILER_NAME," + "TableExtactcase.ISSUE"
				+ " FROM TABLE_EXTACTCASE TableExtactcase" + " WHERE TableExtactcase.X_ESN = ?"
				+ " ORDER BY TableExtactcase.CREATION_TIME";
		try {
			dbConnection = tasDataSource.getConnection();
			preparedStatement = dbConnection.prepareStatement(query);
			preparedStatement.setString(1, esn);
			rs = preparedStatement.executeQuery();
			while (rs.next()) {
				String status = rs.getString("STATUS");
				if (!status.toLowerCase().equals("closed")) {
					TasTicket ticket = new TasTicket();
					ticket.setId(rs.getString("ID_NUMBER"));
					ticket.setCreationTime(rs.getString("CREATION_TIME"));
					ticket.setIssue(rs.getString("ISSUE"));
					ticket.setStatus(rs.getString("STATUS"));
					ticket.setTitle(rs.getString("TITLE"));
					ticketList.add(ticket);
				}
			}
		} catch (Exception e) {
			LOGGER.error("Failed to get Ticket History", e);
		} finally {
			try {
				if (rs != null) {
					rs.close();
				}
				if (preparedStatement != null) {
					preparedStatement.close();
				}
				if (dbConnection != null) {
					dbConnection.close();
				}
			} catch (Exception e) {
				LOGGER.error("Failed clean up after get Ticket History", e);
			}
		}
		return ticketList;
	}

	@Override
	public LinkedHashMap<String, ProductOffering> getProductOfferings(String esn, String brand) {
		Connection dbConnection = null;
		PreparedStatement preparedStatement = null;
		ResultSet rs = null;
		LinkedHashMap<String, ProductOffering> productOfferings = new LinkedHashMap<String, ProductOffering>();

		String query = "SELECT distinct Objid, Mkt_Name, Description,Customer_Price, Ivr_Plan_Id, Webcsr_Display_Name,"
				+ "X_SP2PROGRAM_PARAM, X_Program_Name,"
				+ "spobjid, value_name, part_number Property_Value, part_number property_display,"
				+ "x_card_type, units, ServicePlanType, service_plan_group"
				+ " FROM table(sa.ADFCRM_VO.getAvailableSpPurchase(?,?,?))"
				+ " order by x_card_type desc, customer_price asc";

		try {
			dbConnection = tasDataSource.getConnection();
			preparedStatement = dbConnection.prepareStatement(query);
			preparedStatement.setString(1, esn);
			preparedStatement.setString(2, brand.toUpperCase());
			preparedStatement.setString(3, "ENGLISH");
			rs = preparedStatement.executeQuery();
			while (rs.next()) {

				ProductOffering productOffering = new ProductOffering();
				productOffering.setDescription(rs.getString("Description"));
				productOffering.setObjectId(rs.getString("OBJID"));
				productOffering.setPartNumber(rs.getString("PROPERTY_DISPLAY"));
				productOffering.setPrice(rs.getString("Customer_Price"));
				productOffering.setUnits(rs.getString("units"));
				productOfferings.put(rs.getString("OBJID"), productOffering);

			}
		} catch (Exception e) {
			LOGGER.error("Failed to getProductOfferings", e);
		} finally {
			try {
				if (rs != null) {
					rs.close();
				}
				if (preparedStatement != null) {
					preparedStatement.close();
				}
				if (dbConnection != null) {
					dbConnection.close();
				}
			} catch (Exception e) {
				LOGGER.error("Failed clean up after getProductOfferings", e);
			}
		}
		return productOfferings;
	}

	@Override
	public List<Flash> getActiveFlashes(String esn) {
		Connection dbConnection = null;
		PreparedStatement preparedStatement = null;
		ResultSet rs = null;
		List<Flash> flashList = new ArrayList<Flash>();

		String query = "select al.* from sa.table_alert al, sa.table_part_inst pi"
				+ " where (alert2contract = pi.objid or alert2contact = pi.x_part_inst2contact)"
				+ " and pi.part_serial_no = :your_esn" + " and pi.x_domain = 'PHONES'" + " and al.active > 0"
				+ " and al.start_date <= sysdate" + " and al.end_date >= sysdate" + " order by al.start_date";

		try {
			dbConnection = tasDataSource.getConnection();
			preparedStatement = dbConnection.prepareStatement(query);
			preparedStatement.setString(1, esn);
			rs = preparedStatement.executeQuery();
			while (rs.next()) {
				Flash flash = new Flash();
				flash.setId(rs.getString("OBJID"));
				flash.setType(rs.getString("TYPE"));
				flash.setAlertText(rs.getString("ALERT_TEXT"));
				flash.setStartDate(rs.getString("START_DATE"));
				flash.setEndDate(rs.getString("END_DATE"));
				flash.setTitle(rs.getString("TITLE"));
				flashList.add(flash);
			}
		} catch (Exception e) {
			LOGGER.error("Failed to getActiveFlashes", e);
		} finally {
			try {
				if (rs != null) {
					rs.close();
				}
				if (preparedStatement != null) {
					preparedStatement.close();
				}
				if (dbConnection != null) {
					dbConnection.close();
				}
			} catch (Exception e) {
				LOGGER.error("Failed clean up after getActiveFlashes", e);
			}
		}
		return flashList;
	}

	@Override
	public List<InteractionReason> getInteractionReasons() {
		Connection dbConnection = null;
		PreparedStatement preparedStatement = null;
		ResultSet rs = null;
		List<InteractionReason> reasonList = new ArrayList<InteractionReason>();

		String query = "select reason reason_title, objid reason_objid" + " from SA.ADFCRM_INTERACTION_REASONS"
				+ " where  1=1" + " order by rank,reason";

		try {
			dbConnection = tasDataSource.getConnection();
			preparedStatement = dbConnection.prepareStatement(query);
			rs = preparedStatement.executeQuery();
			while (rs.next()) {
				InteractionReason reason = new InteractionReason();
				reason.setObjId(rs.getString("REASON_OBJID"));
				reason.setTitle(rs.getString("REASON_TITLE"));
				reasonList.add(reason);
			}
		} catch (Exception e) {
			LOGGER.error("Failed to getInteractionReasons", e);
		} finally {
			try {
				if (rs != null) {
					rs.close();
				}
				if (preparedStatement != null) {
					preparedStatement.close();
				}
				if (dbConnection != null) {
					dbConnection.close();
				}
			} catch (Exception e) {
				LOGGER.error("Failed clean up after getInteractionReasons", e);
			}
		}
		return reasonList;
	}

	@Override
	public List<InteractionDetail> getInteractionDetails(String reasonObjId) {
		Connection dbConnection = null;
		PreparedStatement preparedStatement = null;
		ResultSet rs = null;
		List<InteractionDetail> detailList = new ArrayList<InteractionDetail>();

		String query = "select detail reason_detail_title," + " objid reason_detail_objid," + " reason_objid"
				+ " from   ADFCRM_INTERACTION_DETAILS" + " where  reason_objid = ?" + " order by rank, detail";

		try {
			dbConnection = tasDataSource.getConnection();
			preparedStatement = dbConnection.prepareStatement(query);
			preparedStatement.setString(1, reasonObjId);
			rs = preparedStatement.executeQuery();
			while (rs.next()) {
				InteractionDetail detail = new InteractionDetail();
				detail.setDetailObjId(rs.getString("REASON_DETAIL_OBJID"));
				detail.setObjId(rs.getString("REASON_OBJID"));
				detail.setTitle(rs.getString("REASON_DETAIL_TITLE"));
				detailList.add(detail);
			}
		} catch (Exception e) {
			LOGGER.error("Failed to getInteractionDetails", e);
		} finally {
			try {
				if (rs != null) {
					rs.close();
				}
				if (preparedStatement != null) {
					preparedStatement.close();
				}
				if (dbConnection != null) {
					dbConnection.close();
				}
			} catch (Exception e) {
				LOGGER.error("Failed clean up after getInteractionDetails", e);
			}
		}
		return detailList;
	}

	@Override
	public List<InteractionDetail> getInteractionDetails() {
		Connection dbConnection = null;
		PreparedStatement preparedStatement = null;
		ResultSet rs = null;
		List<InteractionDetail> detailList = new ArrayList<InteractionDetail>();

		String query = "select detail reason_detail_title," + " objid reason_detail_objid," + " reason_objid"
				+ " from  ADFCRM_INTERACTION_DETAILS" + " where 1=1" + " order by rank, detail";

		try {
			dbConnection = tasDataSource.getConnection();
			preparedStatement = dbConnection.prepareStatement(query);
			rs = preparedStatement.executeQuery();
			while (rs.next()) {
				InteractionDetail detail = new InteractionDetail();
				detail.setDetailObjId(rs.getString("REASON_DETAIL_OBJID"));
				detail.setObjId(rs.getString("REASON_OBJID"));
				detail.setTitle(rs.getString("REASON_DETAIL_TITLE"));
				detailList.add(detail);
			}
		} catch (Exception e) {
			LOGGER.error("Failed to getInteractionDetails", e);
		} finally {
			try {
				if (rs != null) {
					rs.close();
				}
				if (preparedStatement != null) {
					preparedStatement.close();
				}
				if (dbConnection != null) {
					dbConnection.close();
				}
			} catch (Exception e) {
				LOGGER.error("Failed clean up after getInteractionDetails", e);
			}
		}
		return detailList;
	}

	@Override
	public List<InteractionReason> getResults() {
		Connection dbConnection = null;
		PreparedStatement preparedStatement = null;
		ResultSet rs = null;
		List<InteractionReason> resultList = new ArrayList<InteractionReason>();

		String query = "select elm.title, elm.objid" + " from table_hgbst_elm elm," + " table_hgbst_show show,"
				+ " table_hgbst_lst lst," + " mtm_hgbst_elm0_hgbst_show1 mtm" + " where  1=1"
				+ " and    show.objid = lst.hgbst_lst2hgbst_show" + " and    elm.objid  = mtm.hgbst_elm2hgbst_show"
				+ " and    show.objid = mtm.hgbst_show2hgbst_elm" + " and    lst.title  = 'x_ddl_Result'"
				+ " order by elm.rank";

		try {
			dbConnection = tasDataSource.getConnection();
			preparedStatement = dbConnection.prepareStatement(query);
			rs = preparedStatement.executeQuery();
			while (rs.next()) {
				InteractionReason result = new InteractionReason();
				result.setObjId(rs.getString("OBJID"));
				result.setTitle(rs.getString("TITLE"));
				resultList.add(result);
			}
		} catch (Exception e) {
			LOGGER.error("Failed to getResults", e);
		} finally {
			try {
				if (rs != null) {
					rs.close();
				}
				if (preparedStatement != null) {
					preparedStatement.close();
				}
				if (dbConnection != null) {
					dbConnection.close();
				}
			} catch (Exception e) {
				LOGGER.error("Failed clean up after getResults", e);
			}
		}
		return resultList;

	}
}
