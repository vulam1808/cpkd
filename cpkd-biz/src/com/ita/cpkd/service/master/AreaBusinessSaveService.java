package com.ita.cpkd.service.master;

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
import com.opensymphony.xwork2.inject.Inject;

import javax.inject.Named;
import java.util.Map;

/**
 * Created by HS on 13/09/2016.
 */
@Named("ita_areabusiness_saveservice")
@XPortalDataService(roles = {"cpkd.master"}, description = "Danh Mục")
@XPortalPageRequest(uri = "ita/areabusiness/save", result = WebConstant.ACTION_XSTREAM_JSON_RESULT)
public class AreaBusinessSaveService extends DataServiceMarker{
    @Inject
    private AreaBusinessBo areabusinessBo;

    @Override
    protected WebDataService service(AbstractBaseAction action, Map<String, Object> params)
            throws WebOSBOException {
        AreaBusiness areabusinessmodel = action.getModel(AreaBusiness.class);

        // TODO check your required data

        // save account
        //district.setUuid(districtBo.add(district));
        String uuid= areabusinessBo.add(areabusinessmodel);

        areabusinessmodel.setUuid(uuid);

        return new ObjectWebDataservice<AreaBusiness>(areabusinessmodel);
    }
}
