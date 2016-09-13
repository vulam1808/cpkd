package com.ita.service.master;

import com.inet.xportal.web.WebConstant;
import com.inet.xportal.web.action.AbstractBaseAction;
import com.inet.xportal.web.annotation.XPortalDataService;
import com.inet.xportal.web.annotation.XPortalPageRequest;
import com.inet.xportal.web.exception.WebOSBOException;
import com.inet.xportal.web.interfaces.DataServiceMarker;
import com.inet.xportal.web.interfaces.ObjectWebDataservice;
import com.inet.xportal.web.interfaces.WebDataService;
import com.inet.xportal.web.util.XParamUtils;
import com.ita.bo.AreaBusinessBo;
import com.ita.model.AreaBusiness;
import com.ita.model.Province;
import com.opensymphony.xwork2.inject.Inject;

import javax.inject.Named;
import java.util.Map;

/**
 * Created by HS on 13/09/2016.
 */
@Named("ita_areabusiness_updateservice")
@XPortalDataService(roles = {"cpkd.master"}, description = "Danh M?c")
@XPortalPageRequest(uri = "ita/areabusiness/update", model = "com.ita.model.AreaBusiness", result = WebConstant.ACTION_XSTREAM_JSON_RESULT)
public class AreaBusinessUpdateService extends DataServiceMarker{

    @Inject
    private AreaBusinessBo areabusinessBo;
    @Override
    protected WebDataService service(AbstractBaseAction action, Map<String, Object> params)
            throws WebOSBOException {
        AreaBusiness areabusinessmodel = action.getModel(AreaBusiness.class);
        String id = XParamUtils.getString("uuid", params, "");
        // TODO check your required data

        // save account
        //district.setUuid(districtBo.add(district));
        areabusinessBo.update(id,areabusinessmodel);
        areabusinessmodel.setUuid(id);

        return new ObjectWebDataservice<AreaBusiness>(areabusinessmodel);
    }
}
