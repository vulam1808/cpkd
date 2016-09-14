
package com.ita.cpkd.service.master;


import com.inet.xportal.nosql.web.data.SearchDTO;
import com.inet.xportal.web.WebConstant;
import com.inet.xportal.web.action.AbstractBaseAction;
import com.inet.xportal.web.annotation.XPortalDataService;
import com.inet.xportal.web.annotation.XPortalPageRequest;
import com.inet.xportal.web.exception.WebOSBOException;
import com.inet.xportal.web.interfaces.DataServiceMarker;
import com.inet.xportal.web.interfaces.ObjectWebDataservice;
import com.inet.xportal.web.interfaces.WebDataService;

import com.ita.cpkd.bo.AreaBusinessBo;
import com.ita.cpkd.model.AreaBusiness;
import javax.inject.Inject;
import javax.inject.Named;
import java.util.Map;





/**
 * Created by HS on 13/09/2016.
 */
@Named("ita_areabusiness_loadservice")
@XPortalDataService(roles = {"cpkd.master"}, description = "Danh Mục")
@XPortalPageRequest(uri = "ita/areabusiness/load",  result = WebConstant.ACTION_XSTREAM_JSON_RESULT)

public class AreaBusinessLoadService extends DataServiceMarker {
    @Inject
    private AreaBusinessBo areabusinessBo;

    @Override
    protected WebDataService service(AbstractBaseAction action, Map<String, Object> params)
            throws WebOSBOException {
        //District district = action.getModel(District.class);

        // TODO check your required data

        // save account
        //district.setUuid(districtBo.add(district));
        SearchDTO<AreaBusiness> result= areabusinessBo.query();


        return new ObjectWebDataservice<SearchDTO<AreaBusiness>>(result);
    }
}
