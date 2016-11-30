package com.ita.cpkd.model;



import java.util.ArrayList;
import java.util.List;

/**
 * Created by ACER on 9/28/2016.
 */

public class BusinessDetail {
    private String uuid;
    private String homeBusiness_ID;
    private String taskID;
    private String nameBusiness;
    private String numberBusiness;
    private String taxCode;
    private String statusProcess;
    private String dateSubmit;//=  System.currentTimeMillis();;
    private List<Details> list_changeBusiness_ID;//= new ArrayList<Details>();
    private List<Details> list_pauseBusiness_ID;//= new ArrayList<Details>();
    private List<Details> list_endBusiness_ID;//= new ArrayList<Details>();
    private List<Details> list_reHomeBusiness_ID;

    public List<Details> getList_reHomeBusiness_ID() {
        return list_reHomeBusiness_ID;
    }

    public void setList_reHomeBusiness_ID(List<Details> list_reHomeBusiness_ID) {
        this.list_reHomeBusiness_ID = list_reHomeBusiness_ID;
    }

    public String getDateSubmit() {
        return dateSubmit;
    }

    public void setDateSubmit(String dateSubmit) {
        this.dateSubmit =dateSubmit;
    }

    public String getStatusProcess() {
        return statusProcess;
    }

    public void setStatusProcess(String statusProcess) {
        this.statusProcess = statusProcess;
    }

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

    public String getTaskID() {
        return taskID;
    }

    public void setTaskID(String taskID) {
        this.taskID = taskID;
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

    public List<Details> getList_changeBusiness_ID() {
        return list_changeBusiness_ID;
    }

    public void setList_changeBusiness_ID(List<Details> list_changeBusiness_ID) {
        this.list_changeBusiness_ID = list_changeBusiness_ID;
    }

    public List<Details> getList_pauseBusiness_ID() {
        return list_pauseBusiness_ID;
    }

    public void setList_pauseBusiness_ID(List<Details> list_pauseBusiness_ID) {
        this.list_pauseBusiness_ID = list_pauseBusiness_ID;
    }

    public List<Details> getList_endBusiness_ID() {
        return list_endBusiness_ID;
    }

    public void setList_endBusiness_ID(List<Details> list_endBusiness_ID) {
        this.list_endBusiness_ID = list_endBusiness_ID;
    }
}
