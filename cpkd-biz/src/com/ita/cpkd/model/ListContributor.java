package com.ita.cpkd.model;

import com.inet.xportal.web.WebConstant;
import com.inet.xportal.web.annotation.XPortalModel;

/**
 * Created by HS on 15/09/2016.
 */
@XPortalModel(name = "ita-listcontributor", result = WebConstant.ACTION_XSTREAM_JSON_RESULT)
public class ListContributor {
    private String uuid;
    private String homeBusiness_ID;
    private String name;
    private String idnumber;
    private String permanentAddress;
    private String capitalValue;
    private String capitalProportion;
    private String changeBusiness_ID;

    public String getChangeBusiness_ID() {
        return changeBusiness_ID;
    }

    public void setChangeBusiness_ID(String changeBusiness_ID) {
        this.changeBusiness_ID = changeBusiness_ID;
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

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getIdnumber() {
        return idnumber;
    }

    public void setIdnumber(String idnumber) {
        this.idnumber = idnumber;
    }

    public String getPermanentAddress() {
        return permanentAddress;
    }

    public void setPermanentAddress(String permanentAddress) {
        this.permanentAddress = permanentAddress;
    }

    public String getCapitalValue() {
        return capitalValue;
    }

    public void setCapitalValue(String capitalValue) {
        this.capitalValue = capitalValue;
    }

    public String getCapitalProportion() {
        return capitalProportion;
    }

    public void setCapitalProportion(String capitalProportion) {
        this.capitalProportion = capitalProportion;
    }
}
