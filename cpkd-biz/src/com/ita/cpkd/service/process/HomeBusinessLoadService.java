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
import com.inet.xportal.xdb.business.BaseDBStore;
import com.inet.xportal.xdb.persistence.JSONDB;
import com.inet.xportal.xdb.query.Query;
import com.inet.xportal.xdb.query.impl.QueryImpl;
import com.ita.cpkd.bo.HomeBusinessBo;
import com.ita.cpkd.model.HomeBusiness;

import javax.inject.Inject;
import javax.inject.Named;
import java.util.Map;


/**
 * Created by HS on 13/09/2016.
 */
@Named("ita_homebusiness_loadservice")
@XPortalDataService(roles = {"cpkd.master"}, description = "Danh Mục")
@XPortalPageRequest(uri = "ita/homebusiness/load", result = WebConstant.ACTION_XSTREAM_JSON_RESULT)
public class HomeBusinessLoadService extends DataServiceMarker {
    @Inject
    private HomeBusinessBo homeBusinessBo;

    @Override
    protected WebDataService service(AbstractBaseAction action, Map<String, Object> params)
            throws WebOSBOException {
        //District district = action.getModel(District.class);
        HomeBusiness pes = new HomeBusiness();
        String id = XParamUtils.getString("homeBusiness_ID", params, "");
        pes = homeBusinessBo.load(id);
        // TODO check your required data
        /*Query<JSONDB> query = new QueryImpl<JSONDB>();
        query.field(BaseDBStore.ID_KEY).equal(BaseDBStore.getId(id));*/


        // save account
        //district.setUuid(districtBo.add(district));
        // SearchDTO<PersonRepresent> result= personRepresentBo.query((QueryImpl<JSONDB>)query);
       /* if(result.getTotal()>0)
            pes = result.getItems().get(0);*/

        return new ObjectWebDataservice<HomeBusiness>(pes);
    }
}
