package com.ita.cpkd.service.process;

import com.inet.xportal.nosql.web.data.SearchDTO;
import com.inet.xportal.web.WebConstant;
import com.inet.xportal.web.action.AbstractBaseAction;
import com.inet.xportal.web.annotation.XPortalDataService;
import com.inet.xportal.web.annotation.XPortalPageRequest;
import com.inet.xportal.web.exception.WebOSBOException;
import com.inet.xportal.web.interfaces.DataServiceMarker;
import com.inet.xportal.web.interfaces.ObjectWebDataservice;
import com.inet.xportal.web.interfaces.WebDataService;
import com.inet.xportal.web.util.XParamUtils;
import com.inet.xportal.xdb.persistence.JSONDB;
import com.inet.xportal.xdb.query.Query;
import com.inet.xportal.xdb.query.impl.QueryImpl;
import com.ita.cpkd.bo.HomeBusinessBo;
import com.ita.cpkd.bo.PersonRepresentBo;
import com.ita.cpkd.model.District;
import com.ita.cpkd.model.HomeBusiness;
import com.ita.cpkd.model.PersonRepresent;

import javax.inject.Inject;
import javax.inject.Named;
import java.util.Map;


/**
 * Created by HS on 13/09/2016.
 */
@Named("ita_homebusiness_checknameservice")
@XPortalDataService(roles = {"cpkd.create"}, description = "Tạo hồ sơ")
@XPortalPageRequest(uri = "ita/homebusiness/checknamebusiness", result = WebConstant.ACTION_XSTREAM_JSON_RESULT)
public class HomeBusinessCheckNameService extends DataServiceMarker {
    @Inject
    private HomeBusinessBo homeBusinessBo;

    @Override
    protected WebDataService service(AbstractBaseAction action, Map<String, Object> params)
            throws WebOSBOException {
        //HomeBusiness arbmodel = action.getModel(HomeBusiness.class);
        String name = XParamUtils.getString("nameBusiness", params, "");
        // TODO check your required data

        // save account
        //district.setUuid(districtBo.add(district));
        Query<JSONDB> query = new QueryImpl<JSONDB>();
        query.field("nameBusiness").equal(name);


        SearchDTO<HomeBusiness> datas = homeBusinessBo.query((QueryImpl<JSONDB>)query);
        //datas.getItems();
        //String uuid= homeBusinessBo.add(arbmodel);
        //arbmodel.setUuid(uuid);

        return new ObjectWebDataservice<SearchDTO<HomeBusiness>>(datas);
    }

}
