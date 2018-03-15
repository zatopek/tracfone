package com.jacada.tracfoneAD.customerServiceProfile.entities;

public class ProductOffering {
	String description;
	String units;
	String price;
	String partNumber;
	String objectId;
	boolean recentPurchase;
	
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public String getUnits() {
		return units;
	}
	public void setUnits(String units) {
		this.units = units;
	}
	public String getPrice() {
		return price;
	}
	public void setPrice(String price) {
		this.price = price;
	}
	public String getPartNumber() {
		return partNumber;
	}
	public void setPartNumber(String partNumber) {
		this.partNumber = partNumber;
	}
	public String getObjectId() {
		return objectId;
	}
	public void setObjectId(String objectId) {
		this.objectId = objectId;
	}
	public boolean isRecentPurchase() {
		return recentPurchase;
	}
	public void setRecentPurchase(boolean recentPurchase) {
		this.recentPurchase = recentPurchase;
	}
	
	
}
