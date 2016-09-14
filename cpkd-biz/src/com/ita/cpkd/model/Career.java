package com.ita.cpkd.model;

import com.inet.xportal.web.WebConstant;
import com.inet.xportal.web.annotation.XPortalModel;

/**
 * Created by HS on 13/09/2016.
 */
@XPortalModel(name = "ita-career", result = WebConstant.ACTION_XSTREAM_JSON_RESULT)
public class Career {
    private String uuid;
    private String code;
    private String name;
    private String detail;

    public String getDetail() {
        return detail;
    }

    public void setDetail(String detail) {
        this.detail = detail;
    }



    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
    public String getUuid() {
        return uuid;
    }

    public void setUuid(String uuid) {
        this.uuid = uuid;
    }
    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }


}
