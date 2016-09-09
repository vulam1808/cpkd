package com.ita.service.master;

import com.inet.xportal.nosql.web.data.SearchDTO;
import com.inet.xportal.web.WebConstant;
import com.inet.xportal.web.action.AbstractBaseAction;
import com.inet.xportal.web.annotation.XPortalDataService;
import com.inet.xportal.web.annotation.XPortalPageRequest;
import com.inet.xportal.web.exception.WebOSBOException;
import com.inet.xportal.web.interfaces.WebDataService;
import com.inet.xportal.web.util.XParamUtils;
import com.inet.xportal.xdb.persistence.JSONDB;
import com.inet.xportal.xdb.query.Query;
import com.inet.xportal.xdb.query.impl.QueryImpl;
import com.ita.bo.AccountBo;
import com.ita.bo.DistrictBo;
import com.ita.model.District;

import javax.inject.Inject;
import javax.inject.Named;
import java.util.Map;

/**
 * Created by ACER on 9/8/2016.
 */

@Named("ita_district01_loadservice")
@XPortalDataService(roles = {"cpkd.district.load"}, description = "Load Services")
@XPortalPageRequest(uri = "cpkd/district01/load", model = "com.ita.model.District", result = WebConstant.ACTION_XSTREAM_JSON_RESULT)
public class DistrictLoad01Service extends DistrictLoadService {

    @Inject
    private DistrictBo districtBo;

    @Inject
    private AccountBo accountBo;

    @Override
    public WebDataService service(AbstractBaseAction action, Map<String, Object> params)
            throws WebOSBOException {

        String code = XParamUtils.getString("code", params, "");
        String name = XParamUtils.getString("name", params, "");

        District district = new District();
        district.setCode(code);
        district.setName(name);

        District aaa =action.getModel(District.class);

        Query<JSONDB> query = new QueryImpl<JSONDB>();
        query.field("code").equal(code);

        SearchDTO<District> datas = districtBo.query((QueryImpl<JSONDB>)query);
        datas.getItems();


        return super.service(action, params);
    }
}
