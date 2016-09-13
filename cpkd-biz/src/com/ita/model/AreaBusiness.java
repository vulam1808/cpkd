package com.ita.model;

import com.inet.xportal.web.WebConstant;
import com.inet.xportal.web.annotation.XPortalModel;

/**
 * Created by HS on 13/09/2016.
 */
@XPortalModel(name = "ita-areabusiness", result = WebConstant.ACTION_XSTREAM_JSON_RESULT)
public class AreaBusiness {
    private String uuid;
    private String area;

    public String getUuid() {
        return uuid;
    }

    public void setUuid(String uuid) {
        this.uuid = uuid;
    }
    public String getArea() {
        return area;
    }

    public void setArea(String area) {
        this.area = area;
    }


}
