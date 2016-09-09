package com.ita.model;

import com.inet.xportal.web.WebConstant;
import com.inet.xportal.web.annotation.XPortalModel;

/**
 * Created by LamLe on 9/7/2016.
 */

@XPortalModel(name = "ita-district", result = WebConstant.ACTION_XSTREAM_JSON_RESULT)
public class District {
    private String uuid;
    private String province_ID;
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


}
