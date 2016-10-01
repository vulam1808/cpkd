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