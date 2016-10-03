package com.ita.cpkd.model;

import com.inet.xportal.web.WebConstant;
import com.inet.xportal.web.annotation.XPortalModel;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by ACER on 9/28/2016.
 */
@XPortalModel(name = "ita-businessDetail", result = WebConstant.ACTION_XSTREAM_JSON_RESULT)
public class BusinessDetail {
    private String uuid;
    private String homeBusiness_ID;
    private String taskProcessID;
    private String nameBusiness;
    private String numberBusiness;
    private String taxCode;
    private List<Detail> list_changeBusiness_ID;
    private List<Detail> list_pauseBusiness_ID;
    private List<Detail> list_endBusiness_ID;

    public String getNameBusiness() {
        return nameBusiness;
    }

    public void setNameBusiness(String nameBusiness) {
        this.nameBusiness = nameBusiness;
    }

    public String getNumberBusiness() {
        return numberBusiness;
    }

    public void setNumberBusiness(String numberBusiness) {
        this.numberBusiness = numberBusiness;
    }

    public String getTaxCode() {
        return taxCode;
    }

    public void setTaxCode(String taxCode) {
        this.taxCode = taxCode;
    }

    public String getTaskProcessID() {
        return taskProcessID;
    }

    public void setTaskProcessID(String taskProcessID) {
        this.taskProcessID = taskProcessID;
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

    public List<Detail> getList_changeBusiness_ID() {
        return list_changeBusiness_ID;
    }

    public void setList_changeBusiness_ID(List<Detail> list_changeBusiness_ID) {
        this.list_changeBusiness_ID = list_changeBusiness_ID;
    }

    public List<Detail> getList_pauseBusiness_ID() {
        return list_pauseBusiness_ID;
    }

    public void setList_pauseBusiness_ID(List<Detail> list_pauseBusiness_ID) {
        this.list_pauseBusiness_ID = list_pauseBusiness_ID;
    }

    public List<Detail> getList_endBusiness_ID() {
        return list_endBusiness_ID;
    }

    public void setList_endBusiness_ID(List<Detail> list_endBusiness_ID) {
        this.list_endBusiness_ID = list_endBusiness_ID;
    }
}
