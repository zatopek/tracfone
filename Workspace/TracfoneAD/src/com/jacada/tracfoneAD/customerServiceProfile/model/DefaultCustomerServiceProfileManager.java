package com.jacada.tracfoneAD.customerServiceProfile.model;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import com.jacada.jad.feature.model.DefaultWorkspaceManager;
import com.jacada.jad.feature.annotations.FeatureManager;
import com.jacada.tracfoneAD.customerServiceProfile.entities.AccountBalances;
import com.jacada.tracfoneAD.customerServiceProfile.entities.CustomerProfile;
import com.jacada.tracfoneAD.customerServiceProfile.entities.CustomerServiceProfile;
import com.jacada.tracfoneAD.customerServiceProfile.entities.DeviceProfile;
import com.jacada.tracfoneAD.customerServiceProfile.entities.Flash;
import com.jacada.tracfoneAD.customerServiceProfile.entities.ProductOffering;
import com.jacada.tracfoneAD.customerServiceProfile.entities.ServiceProfile;
import com.jacada.tracfoneAD.customerServiceProfile.entities.TasTicket;
import com.jacada.tracfoneAD.customerServiceProfile.model.interfaces.CustomerServiceProfileManager;
import com.tracfone.b2b.inquiryservices.balanceinquiry.GetBalanceByTransIdResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@FeatureManager(name = "CustomerServiceProfile")
@Component
public class DefaultCustomerServiceProfileManager extends DefaultWorkspaceManager
		implements CustomerServiceProfileManager {

	private static final long serialVersionUID = 1L;
	@Autowired
	private transient com.jacada.tracfoneAD.customerServiceProfile.dao.interfaces.CustomerServiceProfileDao customerServiceProfileDao;
	@Autowired
	private transient com.jacada.tracfoneAD.customerServiceProfile.dao.interfaces.BalanceInquiryDao balanceInquirySoapConnector;
	// sleep to get balance very 2 seconds
	private static int SLEEP_TIME = 2000;
	// 30 seconds max time to allow account balance service
	private static int MAX_TIME_LAPSE = 30000;
	
	private static final String OS = "OS";
	private static final String FIRMWARE = "FIRMWARE";
	private static final String MANUFACTURER = "MANUFACTURER";

	@Override
	public CustomerServiceProfile getCustomerServiceProfile(String esn) {

		System.out.println("getCustomerServiceProfile=>" + esn);
		CustomerServiceProfile customerServiceProfile = new CustomerServiceProfile();

		if (esn != null && esn.length() > 0) {
			ResultSet rs = customerServiceProfileDao.getCustomerServiceProfile(esn);
			try {
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
					Map<String, String> deviceOsInformation = getDeviceOsInformation(deviceProfile.getPartNumber());
					deviceProfile.setOs(deviceOsInformation.get(OS));
					deviceProfile.setFirmware(deviceOsInformation.get(FIRMWARE));
					deviceProfile.setManufacturer(deviceOsInformation.get(MANUFACTURER));

					serviceProfile.setServiceType(rs.getString("service_type"));
					serviceProfile.setRatePlan(rs.getString("rate_plan"));
					serviceProfile.setServicePlanObjId(rs.getString("service_plan_objid"));
					serviceProfile.setCarrier(rs.getString("carrier"));
					serviceProfile
							.setTechnology(rs.getString("technology") + "(" + rs.getString("technology_alt") + ")");
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

					customerProfile.setCustomerId(rs.getString("customer_id"));
					customerProfile.setContactName(rs.getString("first_name") + " " + rs.getString("last_name"));
					customerProfile.setEmail(rs.getString("e_mail"));
					customerProfile.setGroupId(rs.getString("groupid"));
					customerProfile.setZip(rs.getString("x_zipcode"));
					customerProfile.setLid(rs.getString("lid"));

					accountBalances.setPhoneStatus(deviceProfile.getPhoneStatus());
					customerServiceProfile.setDeviceProfile(deviceProfile);
					customerServiceProfile.setServiceProfile(serviceProfile);
					customerServiceProfile.setCustomerProfile(customerProfile);
					customerServiceProfile.setAccountBalances(accountBalances);

				}
			} catch (SQLException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
		return customerServiceProfile;

	}

	@Override
	public Map<String, String> getDeviceOsInformation(String partNumber) {
		String os = "";
		String manufacturer;
		String firmware;
		Map<String, String> deviceOsInformation = new HashMap<String, String>();
		
		if (partNumber != null && partNumber.length() > 0) {
			ResultSet rs = customerServiceProfileDao.getDeviceInformationFromPartNumber(partNumber);

			try {
				while (rs.next()) {
					String parameter = rs.getString("PARAMETER");
					if (parameter.equals("OPERATING_SYSTEM")) {
						os = rs.getString("VALUE");
						deviceOsInformation.put(OS, os);
					}
					else if (parameter.equals("MANUFACTURER")) {
						manufacturer = rs.getString("VALUE");
						deviceOsInformation.put(MANUFACTURER, manufacturer);
					}
					else if (parameter.equals("FIRMWARE")) {
						firmware = rs.getString("VALUE");
						deviceOsInformation.put(FIRMWARE, firmware);
					}
				}
				/*
				 * ResultSetMetaData metadata = rs.getMetaData(); int
				 * columnCount = metadata.getColumnCount(); for (int i=1;
				 * i<=columnCount; i++) { String columnName =
				 * metadata.getColumnName(i); System.out.println(columnName); }
				 */

			} catch (SQLException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
		return deviceOsInformation;
	}

	@Override
	public AccountBalances getAccountBalances(String brand, String esn) {
		
		AccountBalances accountBalances = new AccountBalances();
		accountBalances.setDataBalance(AccountBalances.DATA_NOT_AVAILABLE);
		accountBalances.setSmsBalance(AccountBalances.DATA_NOT_AVAILABLE);
		accountBalances.setVoiceBalance(AccountBalances.DATA_NOT_AVAILABLE);
		
		if(brand != null && esn != null)
		{		
			boolean hasBalance = false;
			GetBalanceByTransIdResponse response = null;
			long startTime = System.currentTimeMillis();
			long lapsedTime = 0;
			while ((lapsedTime < MAX_TIME_LAPSE) && !hasBalance) {
				System.out.println("getAccountBalances=>lapsedTime=" + lapsedTime);
				response = balanceInquirySoapConnector.getAccountBalances(brand, esn);
				if (response != null && response.getBalance() != null && response.getBalance().getTotalBenefits() != null) {
					hasBalance = true;
					accountBalances.setSmsBalance(response.getBalance().getTotalBenefits().getText());
					accountBalances.setVoiceBalance(response.getBalance().getTotalBenefits().getVoice());
					accountBalances.setDataBalance(response.getBalance().getTotalBenefits().getData().getTotalDataUsage());
				} else {
					try {
						Thread.sleep(SLEEP_TIME);
					} catch (InterruptedException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
					lapsedTime = System.currentTimeMillis() - startTime;
				}
			}
		}
		return accountBalances;
	}

	@Override
	public String getLatestPurchaseObjId(String esn, String brand) {
		ResultSet rs = customerServiceProfileDao.getRecentPurchases(esn, brand);
		try {
			while (rs.next()) {
				return rs.getString("OBJID");
			}
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		return null;
	}

	@Override
	public List<TasTicket> getOpenedTickets(String esn) {
		ResultSet rs = customerServiceProfileDao.getTicketHistory(esn);
		List<TasTicket> ticketList = new ArrayList<TasTicket>();
		try {
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

		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return ticketList;
	}

	@Override
	public List<Flash> getActiveFlashes(String esn) {
		ResultSet rs = customerServiceProfileDao.getActiveFlashes(esn);
		List<Flash> flashList = new ArrayList<Flash>();		
		try {
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

		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return flashList;
	}

	@Override
	public LinkedHashMap<String, ProductOffering> getProductOfferings(String esn, String brand) {
		ResultSet rs = customerServiceProfileDao.getProductOfferings(esn, brand);
		LinkedHashMap<String, ProductOffering> productOfferings = new LinkedHashMap<String, ProductOffering>();
		try {
			while (rs.next()) {

					ProductOffering productOffering = new ProductOffering();
					productOffering.setDescription(rs.getString("Description"));
					productOffering.setObjectId(rs.getString("OBJID"));
					productOffering.setPartNumber(rs.getString("PROPERTY_DISPLAY"));
					productOffering.setPrice(rs.getString("Customer_Price"));
					productOffering.setUnits(rs.getString("units"));
					productOfferings.put(rs.getString("OBJID"), productOffering);
				
			}

		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return productOfferings;
	}
}
