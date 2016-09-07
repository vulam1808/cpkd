/**
 * Created by LamLe on 9/7/2016.
 */
package com.ita.model;

import com.inet.xportal.web.WebConstant;
import com.inet.xportal.web.annotation.XPortalModel;

@XPortalModel(name = "ita-province", result = WebConstant.ACTION_XSTREAM_JSON_RESULT)
public class Province {
    private String uuid;
    private String code;
    private String name;

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

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
