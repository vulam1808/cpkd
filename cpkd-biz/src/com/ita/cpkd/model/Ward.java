package com.ita.cpkd.model;

import com.inet.xportal.web.WebConstant;
import com.inet.xportal.web.annotation.XPortalModel;

/**
 * Created by LamLe on 9/7/2016.
 */


public class Ward {
    private String uuid;
    private String province_ID;
    private String district_ID;
    private String code;
    private String name;

    public String getUuid() {
        return uuid;
    }

    public void setUuid(String uuid) {
        this.uuid = uuid;
    }

    public String getProvince_ID() {
        return province_ID;
    }

    public void setProvince_ID(String province_ID) {
        this.province_ID = province_ID;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }


    public String getDistrict_ID() {
        return district_ID;
    }

    public void setDistrict_ID(String district_ID) {
        this.district_ID = district_ID;
    }

}
