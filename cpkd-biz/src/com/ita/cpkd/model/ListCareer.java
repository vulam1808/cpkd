package com.ita.cpkd.model;

import com.inet.xportal.web.WebConstant;
import com.inet.xportal.web.annotation.XPortalModel;

/**
 * Created by HS on 13/09/2016.
 */
@XPortalModel(name = "ita-listcareer", result = WebConstant.ACTION_XSTREAM_JSON_RESULT)
public class ListCareer {
    private String uuid;
    private String career_id;
    private String detail;
    private String homeBusiness_ID;
    private String changeBusiness_ID;

    public String getHomeBusiness_ID() {
        return homeBusiness_ID;
    }

    public void setHomeBusiness_ID(String homeBusiness_ID) {
        this.homeBusiness_ID = homeBusiness_ID;
    }

    public String getChangeBusiness_ID() {
        return changeBusiness_ID;
    }

    public void setChangeBusiness_ID(String changeBusiness_ID) {
        this.changeBusiness_ID = changeBusiness_ID;
    }

    public String getCareer_id() {
        return career_id;
    }

    public void setCareer_id(String career_id) {
        this.career_id = career_id;
    }

    public String getDetail() {
        return detail;
    }

    public void setDetail(String detail) {
        this.detail = detail;
    }
    public String getUuid() {
        return uuid;
    }

    public void setUuid(String uuid) {
        this.uuid = uuid;
    }



}
