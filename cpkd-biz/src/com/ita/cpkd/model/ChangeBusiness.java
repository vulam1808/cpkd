package com.ita.cpkd.model;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by ACER on 9/14/2016.
 */
public class ChangeBusiness {
    private String uuid;
    private String homeBusiness_ID;

    private String nameBusiness;
    private String personRepresent_ID;
    private String address;
    private String province_ID;
    private String district_ID;
    private String ward_ID;
    private String phone;
    private String fax;
    private String email;
    private String website;
    private String areaBusiness_ID;
    private String taxCode;
    private String type;
    private String cashCapital;
    private String businessCapital;
    private long dateSubmit;
    private String statusProcess;
    private List<String> infoChange = new ArrayList<String>();

    public List<String> getInfoChange() {
        return infoChange;
    }

    public void setInfoChange(List<String> infoChange) {
        this.infoChange = infoChange;
    }

    public String getStatusProcess() {
        return statusProcess;
    }

    public void setStatusProcess(String statusProcess) {
        this.statusProcess = statusProcess;
    }



    public String getUuid() {
        return uuid;
    }

    public void setUuid(String uuid) {
        this.uuid = uuid;
    }

    public String getHomeBusiness_ID() {
        return homeBusiness_ID;
    }

    public void setHomeBusiness_ID(String homeBusiness_ID) {
        this.homeBusiness_ID = homeBusiness_ID;
    }

    public String getNameBusiness() {
        return nameBusiness;
    }

    public void setNameBusiness(String nameBusiness) {
        this.nameBusiness = nameBusiness;
    }

    public String getPersonRepresent_ID() {
        return personRepresent_ID;
    }

    public void setPersonRepresent_ID(String personRepresent_ID) {
        this.personRepresent_ID = personRepresent_ID;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getProvince_ID() {
        return province_ID;
    }

    public void setProvince_ID(String province_ID) {
        this.province_ID = province_ID;
    }

    public String getDistrict_ID() {
        return district_ID;
    }

    public void setDistrict_ID(String district_ID) {
        this.district_ID = district_ID;
    }

    public String getWard_ID() {
        return ward_ID;
    }

    public void setWard_ID(String ward_ID) {
        this.ward_ID = ward_ID;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getFax() {
        return fax;
    }

    public void setFax(String fax) {
        this.fax = fax;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getWebsite() {
        return website;
    }

    public void setWebsite(String website) {
        this.website = website;
    }

    public String getAreaBusiness_ID() {
        return areaBusiness_ID;
    }

    public void setAreaBusiness_ID(String areaBusiness_ID) {
        this.areaBusiness_ID = areaBusiness_ID;
    }

    public String getTaxCode() {
        return taxCode;
    }

    public void setTaxCode(String taxCode) {
        this.taxCode = taxCode;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getCashCapital() {
        return cashCapital;
    }

    public void setCashCapital(String cashCapital) {
        this.cashCapital = cashCapital;
    }

    public String getBusinessCapital() {
        return businessCapital;
    }

    public void setBusinessCapital(String businessCapital) {
        this.businessCapital = businessCapital;
    }

    public long getDateSubmit() {
        return dateSubmit;
    }

    public void setDateSubmit(long dateSubmit) {
        this.dateSubmit = dateSubmit;
    }
}
